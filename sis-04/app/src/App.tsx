import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { checkRoom, whyUnavailable, type RoomVerdict } from './booking';
import { filterRooms } from './filter';
import { EQUIPMENT, ROOMS } from './rooms';
import { deviceTime, fromMinutes, toMinutes } from './time';
import { Field } from './components/Field';
import { Header } from './components/Header';
import { RoomFilter } from './components/RoomFilter';
import { RoomScheduleCard } from './components/RoomScheduleCard';
import { VerdictCard } from './components/VerdictCard';

// The page: state and layout only. Rooms come from rooms.ts, filtering from filter.ts,
// every availability decision from booking.ts.
export default function App() {
  const [currentTime, setCurrentTime] = useState(deviceTime);
  const [currentMin, setCurrentMin] = useState(() => toMinutes(deviceTime()) ?? 0);
  const [attendees, setAttendees] = useState('1');
  const [needed, setNeeded] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [submitted, setSubmitted] = useState(false);

  // One place that drops an old result (it replaces five copied setSubmitted(false) calls).
  const resetResult = () => setSubmitted(false);

  const matching = useMemo(
    () => filterRooms(ROOMS, { attendees: Number(attendees) || 0, equipment: needed }),
    [attendees, needed],
  );
  // F5: a room that the filter no longer shows is not selected any more.
  const selectedRoom = matching.find((r) => r.id === roomId) ?? null;

  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);
  const nowMin = toMinutes(currentTime) ?? currentMin;

  // The decision is checkRoom on the chosen room only; whyUnavailable just words the rejection.
  let verdict: RoomVerdict = { available: false, reasons: ['Enter a start and an end time.'] };
  if (startMin !== null && endMin !== null) {
    const request = { start: startMin, end: endMin, now: nowMin };
    const id = selectedRoom?.id ?? '';
    const available = checkRoom(matching, id, request);
    verdict = { available, reasons: available ? [] : whyUnavailable(matching, id, request) };
  }

  const duration = startMin !== null && endMin !== null && endMin > startMin ? endMin - startMin : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Header currentMin={nowMin} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <section className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Find and check a room</h2>
            <p className="mt-1 text-sm text-slate-500">
              Set your requirements, pick a matching room and a time interval.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <RoomFilter
                attendees={attendees}
                onAttendees={(value) => {
                  setAttendees(value);
                  resetResult();
                }}
                options={EQUIPMENT}
                selected={needed}
                onToggle={(item) => {
                  setNeeded((list) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]));
                  resetResult();
                }}
                matchCount={matching.length}
              />

              <Field label="Room">
                <select
                  value={selectedRoom?.id ?? ''}
                  disabled={matching.length === 0}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="input disabled:bg-slate-100"
                >
                  <option value="">{matching.length ? 'Select a room…' : 'No matching rooms'}</option>
                  {matching.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.capacity} seats{r.blocked ? ' (blocked)' : ''}
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
                    resetResult();
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
                      resetResult();
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
                      resetResult();
                    }}
                    className="input"
                  />
                </Field>
              </div>

              {duration !== null && <p className="text-xs text-slate-500">Duration: {duration} min</p>}

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
              <span className="font-medium text-slate-700">{fromMinutes(nowMin)}</span>
              <button
                type="button"
                onClick={() => {
                  const t = deviceTime();
                  setCurrentTime(t);
                  setCurrentMin(toMinutes(t) ?? 0);
                  resetResult();
                }}
                className="ml-2 text-sky-600 hover:underline"
              >
                use device time
              </button>
            </div>
          </section>

          <section className="lg:col-span-3 space-y-6">
            {/* F5: the verdict is computed for the room selected now, so switching rooms refreshes it */}
            <VerdictCard verdict={verdict} submitted={submitted} />
            {selectedRoom && <RoomScheduleCard room={selectedRoom} currentMin={nowMin} />}
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Fictional sample data only. No bookings are actually created.
        </footer>
      </div>
    </div>
  );
}
