"use client";

import { useActionState, useRef } from "react";
import { createRoomAction } from "./actions";

export function AddRoomForm({ homeId }: { homeId: string }) {
  const [error, formAction, pending] = useActionState(createRoomAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-3 rounded border p-4"
    >
      <h2 className="font-medium">Add a room</h2>
      <input type="hidden" name="homeId" value={homeId} />
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Name
          <input name="name" type="text" required className="rounded border px-3 py-2" placeholder="Kitchen" />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Type
          <input name="type" type="text" className="rounded border px-3 py-2" placeholder="Room / System" />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Notes
        <textarea name="notes" className="rounded border px-3 py-2" rows={2} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="self-start rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Adding..." : "Add room"}
      </button>
    </form>
  );
}
