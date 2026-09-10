import { db } from "@/lib/db";

export class HomeNotFoundError extends Error {}

export function listHomesForUser(userId: string) {
  return db.home.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { rooms: true, assets: true } } },
  });
}

export function createHome(userId: string, input: { name: string; address?: string; buildYear?: number; homeType?: string; notes?: string }) {
  return db.home.create({
    data: {
      ownerId: userId,
      name: input.name.trim(),
      address: input.address?.trim() || null,
      buildYear: input.buildYear ?? null,
      homeType: input.homeType?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function getHomeForUser(userId: string, homeId: string) {
  const home = await db.home.findUnique({
    where: { id: homeId },
    include: { rooms: { orderBy: { createdAt: "asc" }, include: { _count: { select: { assets: true } } } } },
  });
  if (!home || home.ownerId !== userId) throw new HomeNotFoundError();
  return home;
}

export async function updateHome(
  userId: string,
  homeId: string,
  input: { name: string; address?: string; buildYear?: number; homeType?: string; notes?: string },
) {
  const home = await db.home.findUnique({ where: { id: homeId } });
  if (!home || home.ownerId !== userId) throw new HomeNotFoundError();

  return db.home.update({
    where: { id: homeId },
    data: {
      name: input.name.trim(),
      address: input.address?.trim() || null,
      buildYear: input.buildYear ?? null,
      homeType: input.homeType?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function deleteHome(userId: string, homeId: string) {
  const home = await db.home.findUnique({ where: { id: homeId } });
  if (!home || home.ownerId !== userId) throw new HomeNotFoundError();
  await db.home.delete({ where: { id: homeId } });
}
