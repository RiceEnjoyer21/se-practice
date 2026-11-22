import { SearchX } from 'lucide-react';
import { Field } from './Field';

// The requirement inputs (attendees, equipment) and the F4 empty state. Shows what it is given;
// the filtering itself is filterRooms in src/filter.ts.
export function RoomFilter({
  attendees,
  onAttendees,
  options,
  selected,
  onToggle,
  matchCount,
}: {
  attendees: string;
  onAttendees: (value: string) => void;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  matchCount: number;
}) {
  return (
    <div className="space-y-4">
      <Field label="Attendees">
        <input
          type="number"
          min={1}
          value={attendees}
          onChange={(e) => onAttendees(e.target.value)}
          className="input"
        />
      </Field>

      <fieldset>
        <legend className="mb-1 block text-sm font-medium text-slate-700">Required equipment</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((item) => {
            const on = selected.includes(item);
            return (
              <label
                key={item}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                  on ? 'bg-sky-600 text-white ring-sky-600' : 'bg-white text-slate-600 ring-slate-300'
                }`}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(item)} />
                {item}
              </label>
            );
          })}
        </div>
      </fieldset>

      {matchCount === 0 ? (
        <div role="status" className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
          <SearchX className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            No rooms match these requirements. Lower the number of attendees or clear some equipment.
          </span>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          {matchCount} room{matchCount === 1 ? '' : 's'} match your requirements.
        </p>
      )}
    </div>
  );
}
