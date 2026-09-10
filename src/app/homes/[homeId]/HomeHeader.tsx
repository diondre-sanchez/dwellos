"use client";

import { useActionState, useState } from "react";
import { deleteHomeAction, updateHomeAction } from "./actions";

type Home = {
  id: string;
  name: string;
  address: string | null;
  buildYear: number | null;
  homeType: string | null;
  notes: string | null;
};

export function HomeHeader({ home }: { home: Home }) {
  const [editing, setEditing] = useState(false);
  const [error, formAction, pending] = useActionState(updateHomeAction, null);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await formAction(formData);
          setEditing(false);
        }}
        className="flex flex-col gap-3 rounded border p-4"
      >
        <input type="hidden" name="homeId" value={home.id} />
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input name="name" type="text" required defaultValue={home.name} className="rounded border px-3 py-2" />
        </label>
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Home type
            <input name="homeType" type="text" defaultValue={home.homeType ?? ""} className="rounded border px-3 py-2" />
          </label>
          <label className="flex w-32 flex-col gap-1 text-sm">
            Build year
            <input name="buildYear" type="number" defaultValue={home.buildYear ?? ""} className="rounded border px-3 py-2" />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Address
          <input name="address" type="text" defaultValue={home.address ?? ""} className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Notes
          <textarea name="notes" defaultValue={home.notes ?? ""} className="rounded border px-3 py-2" rows={2} />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50">
            {pending ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => setEditing(false)} className="text-sm underline">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{home.name}</h1>
        {home.homeType && <p className="text-sm text-gray-600">{home.homeType}</p>}
        {home.address && <p className="text-sm text-gray-600">{home.address}</p>}
        {home.buildYear && <p className="text-sm text-gray-600">Built {home.buildYear}</p>}
        {home.notes && <p className="text-sm text-gray-500">{home.notes}</p>}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-sm underline">
          Edit
        </button>
        <form action={deleteHomeAction}>
          <input type="hidden" name="homeId" value={home.id} />
          <button type="submit" className="text-sm text-red-600 underline">
            Delete home
          </button>
        </form>
      </div>
    </div>
  );
}
