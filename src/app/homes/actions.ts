"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import { createHome } from "@/server/homes";

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function createHomeAction(_prevState: string | null, formData: FormData): Promise<string | null> {
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

  const home = await createHome(session.user.id, {
    name,
    address: String(formData.get("address") ?? "").trim() || null,
    buildYear,
    homeType: String(formData.get("homeType") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  });

  revalidatePath("/homes");
  redirect(`/homes/${home.id}`);
}
