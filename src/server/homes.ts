import { db } from "@/lib/db";

export class HomeNotFoundError extends Error {}

export function listHomes(ownerId: string) {
  return db.home.findMany({ where: { ownerId }, orderBy: { createdAt: "asc" } });
}

export async function getHome(ownerId: string, homeId: string) {
  const home = await db.home.findFirst({ where: { id: homeId, ownerId } });
  if (!home) throw new HomeNotFoundError();
  return home;
}

export type HomeInput = {
  name: string;
  address?: string | null;
  buildYear?: number | null;
  homeType?: string | null;
  notes?: string | null;
};

export function createHome(ownerId: string, input: HomeInput) {
  return db.home.create({
    data: {
      ownerId,
      name: input.name,
      address: input.address || null,
      buildYear: input.buildYear ?? null,
      homeType: input.homeType || null,
      notes: input.notes || null,
    },
  });
}

export async function updateHome(ownerId: string, homeId: string, input: HomeInput) {
  const { count } = await db.home.updateMany({
    where: { id: homeId, ownerId },
    data: {
      name: input.name,
      address: input.address || null,
      buildYear: input.buildYear ?? null,
      homeType: input.homeType || null,
      notes: input.notes || null,
    },
  });
  if (count === 0) throw new HomeNotFoundError();
}

export async function deleteHome(ownerId: string, homeId: string) {
  const { count } = await db.home.deleteMany({ where: { id: homeId, ownerId } });
  if (count === 0) throw new HomeNotFoundError();
}
