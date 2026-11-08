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
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
