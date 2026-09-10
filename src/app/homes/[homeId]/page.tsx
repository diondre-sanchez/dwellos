import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HomeNotFoundError, getHomeForUser } from "@/server/homes";
import { AddRoomForm } from "./AddRoomForm";
import { HomeHeader } from "./HomeHeader";
import { RoomCard } from "./RoomCard";

export default async function HomeDetailPage({ params }: { params: Promise<{ homeId: string }> }) {
  const { homeId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const home = await getHomeForUser(session.user.id, homeId).catch((err) => {
    if (err instanceof HomeNotFoundError) return null;
    throw err;
  });
  if (!home) redirect("/homes");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div>
        <Link href="/homes" className="text-sm underline">
          ← Your homes
        </Link>
      </div>

      <HomeHeader
        home={{
          id: home.id,
          name: home.name,
          address: home.address,
          buildYear: home.buildYear,
          homeType: home.homeType,
          notes: home.notes,
        }}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Rooms</h2>
        {home.rooms.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {home.rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No rooms yet.</p>
        )}
        <AddRoomForm homeId={home.id} />
      </section>
    </main>
  );
}
