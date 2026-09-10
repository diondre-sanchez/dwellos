import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getHome, HomeNotFoundError } from "@/server/homes";
import { EditHomeForm } from "./edit-home-form";
import { deleteHomeAction } from "./actions";

export default async function HomeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  let home;
  try {
    home = await getHome(session.user.id, id);
  } catch (err) {
    if (err instanceof HomeNotFoundError) redirect("/homes");
    throw err;
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{home.name}</h1>
        <Link href="/homes" className="text-sm underline">
          Back to homes
        </Link>
      </div>

      <EditHomeForm
        home={{
          id: home.id,
          name: home.name,
          address: home.address,
          buildYear: home.buildYear,
          homeType: home.homeType,
          notes: home.notes,
        }}
      />

      <form action={deleteHomeAction.bind(null, home.id)}>
        <button type="submit" className="text-sm text-red-600 underline">
          Delete this home
        </button>
      </form>
    </main>
  );
}
