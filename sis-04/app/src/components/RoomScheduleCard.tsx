import { Ban, DoorClosed } from 'lucide-react';
import type { Room } from '../rooms';
import { fromMinutes } from '../time';

export function RoomScheduleCard({
  room,
  currentMin,
}: {
  room: Room;
  currentMin: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DoorClosed className="h-5 w-5 text-slate-400" />
          <h3 className="text-base font-semibold text-slate-900">{room.name}</h3>
        </div>
        {room.blocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
            <Ban className="h-3 w-3" /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            Open
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500">
        capacity {room.capacity} · {room.equipment.join(', ')}
      </p>

      <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Existing bookings
      </h4>
      {room.bookings.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No existing bookings today.</p>
      ) : (
        <ul className="mt-2 divide-y divide-slate-100 rounded-lg ring-1 ring-slate-100">
          {room.bookings
            .slice()
            .sort((a, b) => a.start - b.start)
            .map((b) => {
              const past = b.end <= currentMin;
              return (
                <li
                  key={`${b.start}-${b.end}`}
                  className="flex items-center justify-between px-3 py-2.5 text-sm"
                >
                  <span className="text-slate-700">{b.label}</span>
                  <span
                    className={`font-mono text-xs ${
                      past ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {fromMinutes(b.start)} – {fromMinutes(b.end)}
                    {past && ' · ended'}
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
