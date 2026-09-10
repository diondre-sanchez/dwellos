"use server";

import { redirect } from "next/navigation";
import { EmailInUseError, registerUser } from "@/server/users";

export async function registerAction(_prevState: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");

  if (!email || !password) return "Email and password are required.";
  if (password.length < 8) return "Password must be at least 8 characters.";

  try {
    await registerUser({ email, password, name });
  } catch (err) {
    if (err instanceof EmailInUseError) return "An account with that email already exists.";
    throw err;
  }

  redirect("/login?registered=1");
}
