// Pure booking rules for one room. No React, no I/O, and inputs are never mutated (AC5).

export type ExistingBooking = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight
  end: number;
  now: number;
  blocked: boolean;
  bookings: ExistingBooking[];
};

export type Verdict =
  | { kind: 'available' }
  | { kind: 'unavailable'; reasons: string[] };

export const MINUTES_IN_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

// The single copy of the rules. Returns one message per broken rule; empty means Available.
// An invalid interval stops the checks, because the other rules assume a valid interval.
function findViolations({ start, end, now, blocked, bookings }: BookingRequest): string[] {
  // AC1: valid interval within the day
  if (!(0 <= start && start < end && end <= MINUTES_IN_DAY)) {
    return ['Enter a valid time interval (start before end, within 00:00–24:00).'];
  }

  const reasons: string[] = [];
  // AC1: start after the current time
  if (!(start > now)) reasons.push('Start time must be after the current time.');
  // AC2: maximum duration
  if (end - start > MAX_BOOKING_MINUTES) reasons.push('Booking length cannot exceed 120 minutes.');
  // AC3: blocked room
  if (blocked) reasons.push('This room is currently blocked and cannot be booked.');
  // AC4: overlap; bookings that only touch at an endpoint are allowed
  if (bookings.some((b) => start < b.end && end > b.start)) {
    reasons.push('The interval overlaps an existing booking.');
  }
  return reasons;
}

// Returns true (Available) or false (Unavailable).
export function canBook(request: BookingRequest): boolean {
  return findViolations(request).length === 0;
}

// Page-facing verdict: same decision as canBook, plus the reasons to show the student (AC6).
export function evaluateAvailability(
  room: { blocked: boolean; bookings: ExistingBooking[] } | null,
  startMin: number | null,
  endMin: number | null,
  currentMin: number
): Verdict {
  if (!room) return { kind: 'unavailable', reasons: ['Select a room.'] };
  if (startMin === null || endMin === null) {
    return {
      kind: 'unavailable',
      reasons: ['Enter a valid time interval (start before end, within 00:00–24:00).'],
    };
  }

  const reasons = findViolations({
    start: startMin,
    end: endMin,
    now: currentMin,
    blocked: room.blocked,
    bookings: room.bookings,
  });
  return reasons.length === 0 ? { kind: 'available' } : { kind: 'unavailable', reasons };
}
