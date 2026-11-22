import { Ban, Users } from 'lucide-react';
import type { Room } from '../rooms';

// The rooms that passed filterRooms, as a visible list to pick from. Blocked rooms stay in the
// list with a label; checkRoom never reports them available (F3).
export function RoomList({
  rooms,
  selectedId,
  onSelect,
}: {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Matching rooms" className="space-y-2">
      {rooms.map((r) => {
        const on = r.id === selectedId;
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onSelect(r.id)}
            className={`w-full rounded-lg px-3 py-2 text-left ring-1 transition ${
              on ? 'bg-sky-50 ring-2 ring-sky-500' : 'bg-white ring-slate-200 hover:ring-slate-300'
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-900">{r.name}</span>
              {r.blocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                  <Ban className="h-3 w-3" /> Blocked
                </span>
              )}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> {r.capacity} seats
              </span>
              <span>{r.equipment.join(', ')}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
