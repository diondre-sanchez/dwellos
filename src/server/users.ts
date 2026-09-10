import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export class EmailInUseError extends Error {}

export async function registerUser(input: { email: string; password: string; name?: string }) {
  const email = input.email.trim().toLowerCase();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new EmailInUseError();

  const passwordHash = await bcrypt.hash(input.password, 10);

  return db.user.create({
    data: { email, passwordHash, name: input.name?.trim() || null },
  });
}
