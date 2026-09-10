"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { HomeNotFoundError, deleteHome, updateHome } from "@/server/homes";
import { RoomNotFoundError, createRoom, deleteRoom, updateRoom } from "@/server/rooms";

async function requireUserId() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user.id;
}

export async function createRoomAction(_prevState: string | null, formData: FormData): Promise<string | null> {
  const userId = await requireUserId();
  const homeId = String(formData.get("homeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "Room name is required.";

  try {
    await createRoom(userId, homeId, {
      name,
      type: String(formData.get("type") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    });
  } catch (err) {
    if (err instanceof HomeNotFoundError) redirect("/homes");
    throw err;
  }

  revalidatePath(`/homes/${homeId}`);
  return null;
}

export async function updateRoomAction(_prevState: string | null, formData: FormData): Promise<string | null> {
  const userId = await requireUserId();
  const homeId = String(formData.get("homeId") ?? "");
  const roomId = String(formData.get("roomId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "Room name is required.";

  try {
    await updateRoom(userId, homeId, roomId, {
      name,
      type: String(formData.get("type") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    });
  } catch (err) {
    if (err instanceof HomeNotFoundError) redirect("/homes");
    if (err instanceof RoomNotFoundError) return "Room not found.";
    throw err;
  }

  revalidatePath(`/homes/${homeId}`);
  return null;
}

export async function deleteRoomAction(formData: FormData) {
  const userId = await requireUserId();
  const homeId = String(formData.get("homeId") ?? "");
  const roomId = String(formData.get("roomId") ?? "");

  await deleteRoom(userId, homeId, roomId);
  revalidatePath(`/homes/${homeId}`);
}

export async function updateHomeAction(_prevState: string | null, formData: FormData): Promise<string | null> {
  const userId = await requireUserId();
  const homeId = String(formData.get("homeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "Home name is required.";

  const buildYearRaw = String(formData.get("buildYear") ?? "").trim();
  const buildYear = buildYearRaw ? Number(buildYearRaw) : undefined;
  if (buildYearRaw && !Number.isInteger(buildYear)) return "Build year must be a whole number.";

  try {
    await updateHome(userId, homeId, {
      name,
      address: String(formData.get("address") ?? ""),
      buildYear,
      homeType: String(formData.get("homeType") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    });
  } catch (err) {
    if (err instanceof HomeNotFoundError) redirect("/homes");
    throw err;
  }

  revalidatePath(`/homes/${homeId}`);
  return null;
}

export async function deleteHomeAction(formData: FormData) {
  const userId = await requireUserId();
  const homeId = String(formData.get("homeId") ?? "");

  await deleteHome(userId, homeId);
  redirect("/homes");
}
