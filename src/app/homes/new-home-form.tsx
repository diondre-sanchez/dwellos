"use client";

import { useActionState } from "react";
import { createHomeAction } from "./actions";

export function NewHomeForm() {
  const [error, formAction, pending] = useActionState(createHomeAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input name="name" type="text" required className="rounded border px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Address
        <input name="address" type="text" className="rounded border px-3 py-2" />
      </label>
      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Build year
          <input name="buildYear" type="number" className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Home type
          <input name="homeType" type="text" placeholder="e.g. Single family" className="rounded border px-3 py-2" />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Notes
        <textarea name="notes" rows={3} className="rounded border px-3 py-2" />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="self-start rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Adding..." : "Add home"}
      </button>
    </form>
  );
}
