# Approved stories — Smart Campus study room booking

> **Replace this file's stories with your own Week 03 stories, as revised after review**
> (`week-03/requirements/user-stories.md`), keeping their IDs. If you did not complete Week 03, or
> your set was rejected in review, keep the reference set below and say so in `lab-report.md` §1.
> Either way, the IDs here are the ones your consistency table (§7) must use.

**Source of this set:** my week-03 stories, revised

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Approved stories

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view which study rooms are free and when, so that I can choose a suitable room and time before booking. | R2, R3 |
| US-02 | As a Student, I want to book a free room for a specific time slot, so that I have a reserved space to study. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel a booking I made, so that I free up the room for others when I no longer need it. | R2 |
| US-04 | As a Student, I want to receive confirmation when my booking succeeds, so that I know the requested action was completed. | R4 |
| US-05 | As an Administrator, I want to change a room's blocked status, so that I can control whether the room is available for booking. | R3 |
| US-06 | As an Administrator, I want to review room usage over a chosen period, so that I can understand how the library's study rooms are utilized. | — |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.
