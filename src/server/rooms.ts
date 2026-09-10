import { db } from "@/lib/db";
import { HomeNotFoundError } from "./homes";

export class RoomNotFoundError extends Error {}

async function assertHomeOwnership(userId: string, homeId: string) {
  const home = await db.home.findUnique({ where: { id: homeId } });
  if (!home || home.ownerId !== userId) throw new HomeNotFoundError();
}

export async function createRoom(userId: string, homeId: string, input: { name: string; type?: string; notes?: string }) {
  await assertHomeOwnership(userId, homeId);
  return db.room.create({
    data: {
      homeId,
      name: input.name.trim(),
      type: input.type?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function updateRoom(
  userId: string,
  homeId: string,
  roomId: string,
  input: { name: string; type?: string; notes?: string },
) {
  await assertHomeOwnership(userId, homeId);
  const room = await db.room.findUnique({ where: { id: roomId } });
  if (!room || room.homeId !== homeId) throw new RoomNotFoundError();

  return db.room.update({
    where: { id: roomId },
    data: {
      name: input.name.trim(),
      type: input.type?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function deleteRoom(userId: string, homeId: string, roomId: string) {
  await assertHomeOwnership(userId, homeId);
  const room = await db.room.findUnique({ where: { id: roomId } });
  if (!room || room.homeId !== homeId) throw new RoomNotFoundError();

  await db.room.delete({ where: { id: roomId } });
}
