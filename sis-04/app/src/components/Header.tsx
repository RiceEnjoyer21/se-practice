import { CalendarClock, Clock } from 'lucide-react';
import { fromMinutes } from '../time';

export function Header({ currentMin }: { currentMin: number }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
          <CalendarClock className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Smart Campus Room Availability
          </h1>
          <p className="text-sm text-slate-500">
            Check whether a campus room is free for your time slot.
          </p>
        </div>
      </div>
      <div className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 sm:self-auto">
        <Clock className="h-4 w-4 text-sky-600" />
        {fromMinutes(currentMin)}
      </div>
    </header>
  );
}
