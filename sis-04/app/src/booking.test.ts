import { describe, expect, test } from 'vitest';
import { canBook, checkRoom, whyUnavailable } from './booking';
import type { BookingRequest } from './booking';

// Default fixture: now = 09:00 (540), room open, one booking 10:00-11:00.
// Every call builds fresh objects, so no test can leak state into another.
function check(
  start: number,
  end: number,
  changes: Partial<BookingRequest> = {},
): boolean {
  return canBook({
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  });
}

describe('canBook: plan T01-T14', () => {
  test('T01 AC4: 660-720 touches the end of 600-660 and is allowed', () => {
    expect(check(660, 720)).toBe(true);
  });

  test('T02 AC1: 540-570 starts exactly at now and is rejected', () => {
    expect(check(540, 570)).toBe(false);
  });

  test('T03 AC1: 720-720 has zero duration and is rejected', () => {
    expect(check(720, 720)).toBe(false);
  });

  test('T04 AC1: 750-720 is reversed and is rejected', () => {
    expect(check(750, 720)).toBe(false);
  });

  test('T05 AC1: 1380-1441 ends past the end of the day and is rejected', () => {
    expect(check(1380, 1441)).toBe(false);
  });

  test('T06 AC2: 720-840 is exactly 120 minutes and is allowed', () => {
    expect(check(720, 840)).toBe(true);
  });

  test('T07 AC2: 720-841 is 121 minutes and is rejected', () => {
    expect(check(720, 841)).toBe(false);
  });

  test('T08 AC4: 570-600 touches the start of 600-660 and is allowed', () => {
    expect(check(570, 600)).toBe(true);
  });

  test('T09 AC4: 630-690 partly overlaps 600-660 and is rejected', () => {
    expect(check(630, 690)).toBe(false);
  });

  test('T10 AC4: 570-690 contains 600-660 and is rejected', () => {
    expect(check(570, 690)).toBe(false);
  });

  test('T11 AC4: 615-645 lies inside 600-660 and is rejected', () => {
    expect(check(615, 645)).toBe(false);
  });

  test('T12 AC4: 600-660 is identical to the booking and is rejected', () => {
    expect(check(600, 660)).toBe(false);
  });

  test('T13 AC3: 660-720 in a blocked room is rejected', () => {
    expect(check(660, 720, { blocked: true })).toBe(false);
  });

  test('T14 AC4: 630-690 with no bookings is allowed', () => {
    expect(check(630, 690, { bookings: [] })).toBe(true);
  });
});

describe('canBook: AC5 data is not changed', () => {
  test('AC5: an Available request leaves the bookings equal to the copy taken before', () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);

    const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

    expect(result).toBe(true);
    expect(bookings).toEqual(before);
    expect(JSON.stringify(bookings)).toBe(JSON.stringify(before));
  });
});

describe('canBook: my own cases X1, X2', () => {
  test('X1 AC1: 1380-1440 ends exactly at the end of the day and is allowed', () => {
    expect(check(1380, 1440)).toBe(true);
  });

  test('X2 AC4: 660-720 between 600-660 and 720-780 touches both and is allowed', () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    expect(check(660, 720, { bookings })).toBe(true);
  });
});

describe('canBook: boundaries added in review', () => {
  test('E01 AC1: 541-570 starts one minute after now and is allowed', () => {
    expect(check(541, 570)).toBe(true);
  });

  test('E02 AC1: 539-570 starts before now and is rejected', () => {
    expect(check(539, 570)).toBe(false);
  });

  test('E03 AC4: 570-630 overlaps only the head of 600-660 and is rejected', () => {
    expect(check(570, 630)).toBe(false);
  });

  test('E04 AC4: 740-770 overlaps only the second booking and is rejected', () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    expect(check(740, 770, { bookings })).toBe(false);
  });
});

describe('canBook: regression tests for the provided bugs', () => {
  test('BUG-A: 780-840 touches 720-780 and 840-900 on both sides and must be Available', () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
      { start: 840, end: 900 },
    ];
    expect(check(780, 840, { bookings })).toBe(true);
  });

  test('BUG-B: 720-780 touches nothing, is Available and leaves bookings unchanged', () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);

    const result = canBook({ start: 720, end: 780, now: 540, blocked: false, bookings });

    expect(result).toBe(true);
    expect(bookings).toEqual(before);
  });
});

// A fixed catalog for checkRoom, separate from the page's ROOMS, so demo data cannot change a result.
// now = 09:00 (540) in every request below.
function catalog() {
  return [
    { id: 'a', name: 'Room A', capacity: 10, equipment: ['projector'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'b', name: 'Room B', capacity: 20, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'Room C', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: true, bookings: [] },
  ];
}

describe('checkRoom: the chosen room decides', () => {
  test('B1 AC2: exactly 120 minutes (720-840) in room B is available', () => {
    expect(checkRoom(catalog(), 'b', { start: 720, end: 840, now: 540 })).toBe(true);
  });

  test('B2 AC2: 121 minutes (720-841) in room B is rejected', () => {
    expect(checkRoom(catalog(), 'b', { start: 720, end: 841, now: 540 })).toBe(false);
  });

  test('B3 AC4: 660-720 touches the 600-660 booking of room A and is available', () => {
    expect(checkRoom(catalog(), 'a', { start: 660, end: 720, now: 540 })).toBe(true);
  });

  test('B4 AC4: 630-690 overlaps the 600-660 booking of room A and is rejected', () => {
    expect(checkRoom(catalog(), 'a', { start: 630, end: 690, now: 540 })).toBe(false);
  });

  test('F3 AC3: blocked room C with no bookings is never available', () => {
    expect(checkRoom(catalog(), 'c', { start: 720, end: 780, now: 540 })).toBe(false);
  });

  test('F5: the same 600-660 request is unavailable in room A and available in room B', () => {
    const request = { start: 600, end: 660, now: 540 };
    expect(checkRoom(catalog(), 'a', request)).toBe(false);
    expect(checkRoom(catalog(), 'b', request)).toBe(true);
  });

  test('F5: an unknown room id is not available', () => {
    expect(checkRoom(catalog(), 'zzz', { start: 720, end: 780, now: 540 })).toBe(false);
  });

  test('AC5: checkRoom leaves the whole catalog unchanged', () => {
    const rooms = catalog();
    const before = structuredClone(rooms);
    checkRoom(rooms, 'a', { start: 660, end: 720, now: 540 });
    checkRoom(rooms, 'a', { start: 630, end: 690, now: 540 });
    expect(rooms).toEqual(before);
  });
});

describe('whyUnavailable: checkRoom decides, the reasons only explain', () => {
  test('AC5: an available request in room B is available and has no reasons', () => {
    const request = { start: 720, end: 780, now: 540 };
    expect(checkRoom(catalog(), 'b', request)).toBe(true);
    expect(whyUnavailable(catalog(), 'b', request)).toEqual([]);
  });

  test('AC3 F3: blocked room C is unavailable and the reason names the block', () => {
    const request = { start: 720, end: 780, now: 540 };
    expect(checkRoom(catalog(), 'c', request)).toBe(false);
    expect(whyUnavailable(catalog(), 'c', request)).toEqual(['This room is currently blocked and cannot be booked.']);
  });

  test('AC4: 630-690 in room A is unavailable because of the overlap only', () => {
    const request = { start: 630, end: 690, now: 540 };
    expect(checkRoom(catalog(), 'a', request)).toBe(false);
    expect(whyUnavailable(catalog(), 'a', request)).toEqual(['The interval overlaps an existing booking.']);
  });

  test('AC1 AC2: 500-700 in room B starts in the past and is too long, both reasons', () => {
    const request = { start: 500, end: 700, now: 540 };
    expect(checkRoom(catalog(), 'b', request)).toBe(false);
    expect(whyUnavailable(catalog(), 'b', request)).toEqual([
      'Start time must be after the current time.',
      'Booking length cannot exceed 120 minutes.',
    ]);
  });

  test('F5: an unknown room id is unavailable with a select-a-room reason', () => {
    const request = { start: 720, end: 780, now: 540 };
    expect(checkRoom(catalog(), 'zzz', request)).toBe(false);
    expect(whyUnavailable(catalog(), 'zzz', request)).toEqual(['Select a room.']);
  });
});
