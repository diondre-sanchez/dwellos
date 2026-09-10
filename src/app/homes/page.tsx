import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutAction } from "./actions";

export default async function HomesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your homes</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm underline">
            Sign out
          </button>
        </form>
      </div>
      <p className="text-sm text-gray-600">Signed in as {session?.user?.email}.</p>
      <p className="text-sm text-gray-600">Home management is next up.</p>
    </main>
  );
}
