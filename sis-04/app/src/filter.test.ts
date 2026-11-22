import { describe, it, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';

// Fixed, fictional catalog used only by these tests. Times are minutes after midnight.
// A function, so every test gets fresh objects and no test can leak into another.
function catalog() {
  return [
    { id: 'a', name: 'Room A', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false,
      bookings: [{ start: 600, end: 660, label: 'Seminar' }] },
    { id: 'b', name: 'Room B', capacity: 20, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'Room C', capacity: 30, equipment: ['projector', 'whiteboard', 'microphone'], blocked: true,
      bookings: [] },
    { id: 'd', name: 'Room D', capacity: 5, equipment: ['computers'], blocked: false, bookings: [] },
  ];
}

const ids = (rooms: { id: string }[]): string[] => rooms.map((r) => r.id).sort();

describe('filterRooms', () => {
  it('F1: keeps only rooms whose capacity is at least the requested attendees', () => {
    const result = filterRooms(catalog(), { attendees: 15, equipment: [] });
    expect(ids(result)).toEqual(['b', 'c']);
  });

  it('F2: keeps only rooms that contain ALL selected equipment items', () => {
    const result = filterRooms(catalog(), { attendees: 1, equipment: ['projector', 'whiteboard'] });
    // b has whiteboard but no projector, d has neither -> both excluded
    expect(ids(result)).toEqual(['a', 'c']);
  });

  it('F4: returns an empty result when no room matches', () => {
    expect(filterRooms(catalog(), { attendees: 1000, equipment: [] })).toEqual([]);
    expect(filterRooms(catalog(), { attendees: 1, equipment: ['laser-cutter'] })).toEqual([]);
    expect(filterRooms(catalog(), { attendees: 25, equipment: ['computers'] })).toEqual([]);
  });

  it('B5 F1: includes a room whose capacity exactly equals the attendees', () => {
    const result = filterRooms(catalog(), { attendees: 20, equipment: [] });
    expect(ids(result)).toContain('b');
    expect(ids(result)).toEqual(['b', 'c']);
  });

  it('B6 F1: excludes a room whose capacity is one below the attendees', () => {
    const result = filterRooms(catalog(), { attendees: 21, equipment: [] });
    expect(ids(result)).not.toContain('b');
    expect(ids(result)).toEqual(['c']);
  });

  it('F1 F2: filterRooms leaves the catalog and the criteria unchanged', () => {
    const rooms = catalog();
    const criteria = { attendees: 8, equipment: ['projector'] };
    const before = structuredClone({ rooms, criteria });
    filterRooms(rooms, criteria);
    expect({ rooms, criteria }).toEqual(before);
  });
});

describe('filterRooms with checkRoom', () => {
  it('INT: a room returned by filterRooms can then be checked for availability with checkRoom', () => {
    const result = filterRooms(catalog(), { attendees: 8, equipment: ['projector'] });
    expect(ids(result)).toEqual(['a', 'c']);

    // checkRoom runs on what filterRooms returned, not on the whole catalog
    // 11:00-12:00 touches the 10:00-11:00 booking of a (touching is allowed) -> available
    expect(checkRoom(result, 'a', { start: 660, end: 720, now: 540 })).toBe(true);
    // 10:30-11:30 overlaps the 10:00-11:00 booking of a -> unavailable
    expect(checkRoom(result, 'a', { start: 630, end: 690, now: 540 })).toBe(false);
    // c passes the filter but is blocked -> unavailable (F3)
    expect(checkRoom(result, 'c', { start: 660, end: 720, now: 540 })).toBe(false);
    // b was filtered out (no projector) -> not in the list, so not available
    expect(checkRoom(result, 'b', { start: 660, end: 720, now: 540 })).toBe(false);
  });
});
