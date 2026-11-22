import { AlertTriangle, CheckCircle2, DoorClosed, XCircle } from 'lucide-react';
import type { RoomVerdict } from '../booking';

export function VerdictCard({
  verdict,
  submitted,
}: {
  verdict: RoomVerdict;
  submitted: boolean;
}) {
  if (!submitted) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3 text-slate-400">
          <DoorClosed className="h-6 w-6" />
          <p className="text-sm">
            Select a room and time, then check availability.
          </p>
        </div>
      </div>
    );
  }

  if (verdict.available) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-800">Available</h3>
            <p className="mt-1 text-sm text-emerald-700">
              This room is free for the requested interval. No existing bookings
              were modified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-rose-50 p-6 shadow-sm ring-1 ring-rose-200">
      <div className="flex items-start gap-3">
        <XCircle className="h-7 w-7 shrink-0 text-rose-600" />
        <div className="w-full">
          <h3 className="text-lg font-semibold text-rose-800">Unavailable</h3>
          <ul className="mt-2 space-y-1.5">
            {verdict.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
