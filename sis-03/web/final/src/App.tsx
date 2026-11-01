import { useMemo, useState } from 'react';
import {
  Clock,
  DoorClosed,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CalendarClock,
  Ban,
} from 'lucide-react';

type Booking = {
  id: string;
  start: number; // minutes from 00:00
  end: number;
  label: string;
};

type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  bookings: Booking[];
};

const SAMPLE_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Engineering 101',
    building: 'Engineering Block',
    capacity: 40,
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, label: 'CS 201 Lecture' },
      { id: 'b2', start: 720, end: 780, label: 'Faculty Meeting' },
    ],
  },
  {
    id: 'r2',
    name: 'Science Lab A',
    building: 'Science Block',
    capacity: 24,
    blocked: false,
    bookings: [
      { id: 'b3', start: 600, end: 660, label: 'Chemistry Lab' },
    ],
  },
  {
    id: 'r3',
    name: 'Library Study Room',
    building: 'Main Library',
    capacity: 8,
    blocked: false,
    bookings: [
      { id: 'b4', start: 840, end: 900, label: 'Book Club' },
      { id: 'b5', start: 960, end: 1020, label: 'Research Group' },
    ],
  },
  {
    id: 'r4',
    name: 'Auditorium B',
    building: 'Arts Center',
    capacity: 120,
    blocked: true, // AC3: blocked room
    bookings: [
      { id: 'b6', start: 600, end: 660, label: 'Maintenance' },
    ],
  },
];

const MINUTES_IN_DAY = 1440;
const MAX_BOOKING_MINUTES = 120;

function toMinutes(time: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type Verdict =
  | { kind: 'available' }
  | { kind: 'unavailable'; reasons: string[] };

type Violation =
  | 'invalid-interval'
  | 'start-not-future'
  | 'too-long'
  | 'room-blocked'
  | 'overlap';

function evaluateAvailability(
  room: Room | null,
  startMin: number | null,
  endMin: number | null,
  currentMin: number | null
): Verdict {
  if (!room) return { kind: 'unavailable', reasons: ['Select a room.'] };
  if (currentMin === null) {
    return { kind: 'unavailable', reasons: ['Enter a valid current time.'] };
  }

  const reasons: string[] = [];

  // AC1: valid interval and start after current time
  if (
    startMin === null ||
    endMin === null ||
    !(0 <= startMin && startMin < endMin && endMin <= MINUTES_IN_DAY)
  ) {
    reasons.push('Enter a valid time interval (start before end, within 00:00–24:00).');
  } else {
    if (startMin <= currentMin) {
      reasons.push('Start time must be after the current time.');
    }
    // AC2: max 120 minutes
    if (endMin - startMin > MAX_BOOKING_MINUTES) {
      reasons.push('Booking length cannot exceed 120 minutes.');
    }
    // AC3: blocked room
    if (room.blocked) {
      reasons.push('This room is currently blocked and cannot be booked.');
    }
    // AC4: overlap (touching allowed)
    const overlaps = room.bookings.some(
      (b) => startMin < b.end && endMin > b.start
    );
    if (overlaps) {
      reasons.push('The interval overlaps an existing booking.');
    }
  }

  return reasons.length === 0
    ? { kind: 'available' }
    : { kind: 'unavailable', reasons };
}

export default function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [currentMin, setCurrentMin] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [roomId, setRoomId] = useState<string>('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [submitted, setSubmitted] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === roomId) ?? null,
    [rooms, roomId]
  );

  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);
  const suppliedCurrentMin = toMinutes(currentTime);

  const verdict = useMemo(
    () =>
      evaluateAvailability(
        selectedRoom,
        startMin,
        endMin,
        suppliedCurrentMin
      ),
    [selectedRoom, startMin, endMin, suppliedCurrentMin]
  );

  const duration =
    startMin !== null && endMin !== null && endMin > startMin
      ? endMin - startMin
      : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Header currentMin={currentMin} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Form panel */}
          <section className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Check availability</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pick a room and a candidate time interval to see if it's available.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Field label="Room">
                <select
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setSubmitted(false);
                  }}
                  className="input"
                >
                  <option value="">Select a room…</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.building}
                      {r.blocked ? ' (blocked)' : ''}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Current time">
                <input
                  type="time"
                  value={currentTime}
                  onChange={(e) => {
                    setCurrentTime(e.target.value);
                    const parsed = toMinutes(e.target.value);
                    if (parsed !== null) setCurrentMin(parsed);
                    setSubmitted(false);
                  }}
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Start time">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setSubmitted(false);
                    }}
                    className="input"
                  />
                </Field>
                <Field label="End time">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setSubmitted(false);
                    }}
                    className="input"
                  />
                </Field>
              </div>

              {duration !== null && (
                <p className="text-xs text-slate-500">
                  Duration: {duration} min
                  {duration > MAX_BOOKING_MINUTES && (
                    <span className="ml-1 text-amber-600">
                      (exceeds 120 min limit)
                    </span>
                  )}
                </p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Check availability
              </button>
            </form>

            <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              Current time used for validation:{' '}
              <span className="font-medium text-slate-700">{fromMinutes(currentMin)}</span>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const m = now.getHours() * 60 + now.getMinutes();
                  setCurrentMin(m);
                  setCurrentTime(
                    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                  );
                  setSubmitted(false);
                }}
                className="ml-2 text-sky-600 hover:underline"
              >
                use device time
              </button>
            </div>
          </section>

          {/* Result + details panel */}
          <section className="lg:col-span-3 space-y-6">
            <VerdictCard verdict={verdict} submitted={submitted} />

            {selectedRoom && (
              <RoomScheduleCard room={selectedRoom} currentMin={currentMin} />
            )}
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Fictional sample data only. No bookings are actually created.
        </footer>
      </div>
    </div>
  );
}

function Header({ currentMin }: { currentMin: number }) {
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function VerdictCard({
  verdict,
  submitted,
}: {
  verdict: Verdict;
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

  if (verdict.kind === 'available') {
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

function RoomScheduleCard({
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
        {room.building} · capacity {room.capacity}
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
                  key={b.id}
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
