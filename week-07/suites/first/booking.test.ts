import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canBook } from './booking';
import type { BookingRequest, ExistingBooking } from './booking';

// Fixed wall-clock time. canBook receives `now` as an argument, so the system
// clock must not influence it; freezing it at an unrelated instant proves that.
const FIXED_SYSTEM_TIME = new Date('2026-11-07T03:00:00.000Z');

// Default fixture: now = 09:00, room free, one booking 10:00-11:00.
// Every call builds brand-new objects/arrays so no test can leak state into another.
function makeRequest(overrides: Partial<BookingRequest> = {}): BookingRequest {
  return {
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

type Row = {
  id: string;
  start: number;
  end: number;
  overrides?: Partial<BookingRequest>;
  expected: boolean;
  ac: string;
};

// Builds a request from a row. `overrides` is a factory so each test gets fresh data.
const row = (
  id: string,
  start: number,
  end: number,
  expected: boolean,
  ac: string,
  overrides?: () => Partial<BookingRequest>,
) => ({ id, start, end, expected, ac, overrides });

type RowWithFactory = Omit<Row, 'overrides'> & {
  overrides?: () => Partial<BookingRequest>;
};

const rows: RowWithFactory[] = [
  row('T01', 660, 720, true, 'AC4'), // touching after
  row('T02', 540, 570, false, 'AC1'), // starts exactly now
  row('T03', 720, 720, false, 'AC1'), // zero duration
  row('T04', 750, 720, false, 'AC1'), // reversed
  row('T05', 1380, 1441, false, 'AC1'), // past day end
  row('T06', 720, 840, true, 'AC2'), // exactly 120 minutes
  row('T07', 720, 841, false, 'AC2'), // 121 minutes
  row('T08', 570, 600, true, 'AC4'), // touching before
  row('T09', 630, 690, false, 'AC4'), // partial overlap
  row('T10', 570, 690, false, 'AC4'), // contains existing booking
  row('T11', 615, 645, false, 'AC4'), // inside existing booking
  row('T12', 600, 660, false, 'AC4'), // identical interval
  row('T13', 660, 720, false, 'AC3', () => ({ blocked: true })),
  row('T14', 630, 690, true, 'AC4', () => ({ bookings: [] })),
  row('X1', 1380, 1440, true, 'AC1'), // ends exactly at end of day
  row('X2', 660, 720, true, 'AC4', () => ({
    bookings: [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ],
  })), // fits exactly between two bookings
];

describe('canBook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_SYSTEM_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('reviewed case table', () => {
    it.each(rows)(
      '$id [$ac]: $start-$end => $expected',
      ({ start, end, expected, overrides }) => {
        const request = makeRequest({ start, end, ...(overrides?.() ?? {}) });

        expect(canBook(request)).toBe(expected);
      },
    );
  });

  describe('AC5: decision is returned without changing booking data', () => {
    it('AC5: Available request leaves bookings unchanged (deep-frozen input)', () => {
      const bookings: ExistingBooking[] = [
        Object.freeze({ start: 600, end: 660 }),
      ];
      Object.freeze(bookings);
      const request = makeRequest({ start: 660, end: 720, bookings });
      const before = structuredClone(bookings);
      const arrayRef = request.bookings;
      const firstRef = request.bookings[0];

      const result = canBook(request);

      expect(result).toBe(true);
      expect(request.bookings).toBe(arrayRef);
      expect(request.bookings[0]).toBe(firstRef);
      expect(request.bookings).toEqual(before);
      expect(request.bookings).toHaveLength(1);
    });

    it('AC5: Unavailable request also leaves bookings unchanged', () => {
      const bookings: ExistingBooking[] = [{ start: 600, end: 660 }];
      const request = makeRequest({ start: 630, end: 690, bookings });
      const before = structuredClone(bookings);

      const result = canBook(request);

      expect(result).toBe(false);
      expect(request.bookings).toEqual(before);
    });
  });
});
