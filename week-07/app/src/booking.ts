export type ExistingBooking = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight
  end: number;
  now: number;
  blocked: boolean;
  bookings: ExistingBooking[];
};

const MINUTES_IN_DAY = 1440;
const MAX_BOOKING_MINUTES = 120;

// Returns true (Available) or false (Unavailable).
// Conditions are copied from the original evaluateAvailability in App.tsx.
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  // AC1: valid interval and start after current time
  if (!(0 <= start && start < end && end <= MINUTES_IN_DAY)) return false;
  if (start <= now) return false;
  // AC2: max 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) return false;
  // AC3: blocked room
  if (blocked) return false;
  // AC4: overlap (touching allowed)
  if (bookings.some((b) => start < b.end && end > b.start)) return false;
  return true;
}
