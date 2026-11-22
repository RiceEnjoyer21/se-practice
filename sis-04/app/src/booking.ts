export type ExistingBooking = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight
  end: number;
  now: number;
  blocked: boolean;
  bookings: ExistingBooking[];
};

export const MINUTES_IN_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

// AC1-AC5: returns true (Available) or false (Unavailable). Reads its arguments, changes nothing.
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!(0 <= start && start < end && end <= MINUTES_IN_DAY)) return false; // AC1
  if (!(start > now)) return false; // AC1: not in the past
  if (end - start > MAX_BOOKING_MINUTES) return false; // AC2
  if (blocked) return false; // AC3
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false; // AC4: touching is allowed
  }
  return true;
}
