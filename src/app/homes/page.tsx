import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listHomesForUser } from "@/server/homes";
import { logoutAction } from "./actions";
import { CreateHomeForm } from "./CreateHomeForm";

export default async function HomesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const homes = await listHomesForUser(session.user.id);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your homes</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm underline">
            Sign out
          </button>
        </form>
      </div>

      {homes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {homes.map((home) => (
            <li key={home.id}>
              <Link href={`/homes/${home.id}`} className="flex items-center justify-between rounded border p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                <div>
                  <p className="font-medium">{home.name}</p>
                  {home.homeType && <p className="text-sm text-gray-600">{home.homeType}</p>}
                </div>
                <p className="text-sm text-gray-600">
                  {home._count.rooms} room{home._count.rooms === 1 ? "" : "s"} · {home._count.assets} asset
                  {home._count.assets === 1 ? "" : "s"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <CreateHomeForm />
    </main>
  );
}
