"use client";

import { useActionState, useState } from "react";
import { deleteRoomAction, updateRoomAction } from "./actions";

type Room = {
  id: string;
  homeId: string;
  name: string;
  type: string | null;
  notes: string | null;
  _count: { assets: number };
};

export function RoomCard({ room }: { room: Room }) {
  const [editing, setEditing] = useState(false);
  const [error, formAction, pending] = useActionState(updateRoomAction, null);

  if (editing) {
    return (
      <li className="rounded border p-4">
        <form
          action={async (formData) => {
            await formAction(formData);
            setEditing(false);
          }}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="homeId" value={room.homeId} />
          <input type="hidden" name="roomId" value={room.id} />
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              Name
              <input name="name" type="text" required defaultValue={room.name} className="rounded border px-3 py-2" />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm">
              Type
              <input name="type" type="text" defaultValue={room.type ?? ""} className="rounded border px-3 py-2" />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Notes
            <textarea name="notes" defaultValue={room.notes ?? ""} className="rounded border px-3 py-2" rows={2} />
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
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded border p-4">
      <div>
        <p className="font-medium">{room.name}</p>
        <p className="text-sm text-gray-600">
          {room.type ? `${room.type} · ` : ""}
          {room._count.assets} asset{room._count.assets === 1 ? "" : "s"}
        </p>
        {room.notes && <p className="text-sm text-gray-500">{room.notes}</p>}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-sm underline">
          Edit
        </button>
        <form action={deleteRoomAction}>
          <input type="hidden" name="homeId" value={room.homeId} />
          <input type="hidden" name="roomId" value={room.id} />
          <button type="submit" className="text-sm text-red-600 underline">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}
