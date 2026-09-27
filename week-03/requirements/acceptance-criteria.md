# Acceptance criteria — three selected stories

## Assumptions

- **Overlap:** Back-to-back bookings are allowed under R3 because a booking ending exactly when another begins shares no booked time with it.
- **Duration:** A booking of exactly two hours is allowed under R2 because “at most two hours” is interpreted as an inclusive limit.
- A booking must start strictly after the current time.
- Students can cancel only their own bookings.
- Repeating a request to block an already blocked room leaves it blocked.

---

## US-02 — Book room

### AC-01
- **Given** an unblocked room has a booking tomorrow from 10:00 to 11:00 and no bookings overlapping 11:00 to 13:00.
- **When** a Student requests to book that room tomorrow from 11:00 to 13:00.
- **Then** the booking is created and confirmed to the Student.

### AC-02
- **Given** an unblocked room is free for the requested one-hour slot.
- **When** a Student requests a booking starting at or before the current time.
- **Then** the booking is rejected with the reason that its start must be in the future.

Test both cases: a start in the past and a start exactly at the current time.

### AC-03
- **Given** an unblocked room is free for the requested future slot.
- **When** a Student requests to book it for two hours and one minute.
- **Then** the booking is rejected with the reason that the maximum duration is two hours.

### AC-04
- **Given** an unblocked room has a booking tomorrow from 10:00 to 11:00.
- **When** a Student requests to book the same room tomorrow from 10:30 to 11:30.
- **Then** the new booking is rejected because it overlaps the existing booking.

### AC-05
- **Given** a room is blocked and has no bookings overlapping the requested future one-hour slot.
- **When** a Student requests to book that room for that slot.
- **Then** the booking is rejected because the room is blocked.

---

## US-03 — Cancel booking

### AC-06
- **Given** a Student owns an existing future booking for an unblocked room.
- **When** the Student cancels that booking.
- **Then** the booking is cancelled, its time slot becomes available, and the cancellation is confirmed to the Student.

### AC-07
- **Given** an existing booking belongs to another Student.
- **When** a Student who does not own it requests its cancellation.
- **Then** the request is rejected because the Student does not own the booking, and the booking remains unchanged.

### AC-08
- **Given** the requested booking does not exist.
- **When** a Student requests its cancellation.
- **Then** the request is rejected with the reason that the booking was not found, and no existing bookings are changed.

---

## US-05 — Block or unblock room

### AC-09
- **Given** a room is unblocked and has no existing bookings.
- **When** an Administrator blocks the room.
- **Then** the room becomes blocked and unavailable for new bookings.

### AC-10
- **Given** a room is blocked and has no existing bookings.
- **When** an Administrator unblocks the room.
- **Then** the room becomes unblocked and available for booking, subject to the future-start, duration, and non-overlap rules.

### AC-11
- **Given** a room is already blocked.
- **When** an Administrator requests to block it again.
- **Then** the room remains blocked and the Administrator is informed that it was already blocked.
