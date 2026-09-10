"use server";

import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { createHome } from "@/server/homes";

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function createHomeAction(_prevState: string | null, formData: FormData): Promise<string | null> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "Home name is required.";

  const buildYearRaw = String(formData.get("buildYear") ?? "").trim();
  const buildYear = buildYearRaw ? Number(buildYearRaw) : undefined;
  if (buildYearRaw && !Number.isInteger(buildYear)) return "Build year must be a whole number.";

  const home = await createHome(session.user.id, {
    name,
    address: String(formData.get("address") ?? ""),
    buildYear,
    homeType: String(formData.get("homeType") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });

  redirect(`/homes/${home.id}`);
}
