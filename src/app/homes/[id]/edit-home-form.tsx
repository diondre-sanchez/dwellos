"use client";

import { useActionState } from "react";
import { updateHomeAction } from "./actions";

type HomeFormValues = {
  id: string;
  name: string;
  address: string | null;
  buildYear: number | null;
  homeType: string | null;
  notes: string | null;
};

export function EditHomeForm({ home }: { home: HomeFormValues }) {
  const [error, formAction, pending] = useActionState(updateHomeAction.bind(null, home.id), null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input name="name" type="text" required defaultValue={home.name} className="rounded border px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Address
        <input name="address" type="text" defaultValue={home.address ?? ""} className="rounded border px-3 py-2" />
      </label>
      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Build year
          <input
            name="buildYear"
            type="number"
            defaultValue={home.buildYear ?? ""}
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Home type
          <input
            name="homeType"
            type="text"
            placeholder="e.g. Single family"
            defaultValue={home.homeType ?? ""}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Notes
        <textarea name="notes" rows={3} defaultValue={home.notes ?? ""} className="rounded border px-3 py-2" />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="self-start rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
