"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deleteHome, HomeNotFoundError, updateHome } from "@/server/homes";

export async function updateHomeAction(
  homeId: string,
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "Name is required.";

  const buildYearRaw = String(formData.get("buildYear") ?? "").trim();
  let buildYear: number | null = null;
  if (buildYearRaw) {
    buildYear = Number(buildYearRaw);
    if (!Number.isInteger(buildYear)) return "Build year must be a whole number.";
  }

  try {
    await updateHome(session.user.id, homeId, {
      name,
      address: String(formData.get("address") ?? "").trim() || null,
      buildYear,
      homeType: String(formData.get("homeType") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    });
  } catch (err) {
    if (err instanceof HomeNotFoundError) redirect("/homes");
    throw err;
  }

  revalidatePath("/homes");
  revalidatePath(`/homes/${homeId}`);
  redirect(`/homes/${homeId}`);
}

export async function deleteHomeAction(homeId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  try {
    await deleteHome(session.user.id, homeId);
  } catch (err) {
    if (!(err instanceof HomeNotFoundError)) throw err;
  }

  revalidatePath("/homes");
  redirect("/homes");
}
