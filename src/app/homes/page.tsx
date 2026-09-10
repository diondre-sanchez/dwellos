import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { listHomes } from "@/server/homes";
import { logoutAction } from "./actions";
import { NewHomeForm } from "./new-home-form";

export default async function HomesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const homes = await listHomes(session.user.id);

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
      <p className="text-sm text-gray-600">Signed in as {session.user.email}.</p>

      {homes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {homes.map((home) => (
            <li key={home.id}>
              <Link
                href={`/homes/${home.id}`}
                className="block rounded border px-4 py-3 hover:bg-gray-50"
              >
                <span className="font-medium">{home.name}</span>
                {home.address && <span className="ml-2 text-sm text-gray-600">{home.address}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="flex flex-col gap-3 rounded border p-4">
        <h2 className="font-medium">Add a home</h2>
        <NewHomeForm />
      </section>
    </main>
  );
}
