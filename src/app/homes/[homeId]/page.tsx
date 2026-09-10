import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HomeNotFoundError, getHomeForUser } from "@/server/homes";
import { deleteHomeAction } from "./actions";
import { AddRoomForm } from "./AddRoomForm";
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

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{home.name}</h1>
          {home.homeType && <p className="text-sm text-gray-600">{home.homeType}</p>}
          {home.address && <p className="text-sm text-gray-600">{home.address}</p>}
          {home.buildYear && <p className="text-sm text-gray-600">Built {home.buildYear}</p>}
          {home.notes && <p className="text-sm text-gray-500">{home.notes}</p>}
        </div>
        <form action={deleteHomeAction}>
          <input type="hidden" name="homeId" value={home.id} />
          <button type="submit" className="text-sm text-red-600 underline">
            Delete home
          </button>
        </form>
      </div>

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
