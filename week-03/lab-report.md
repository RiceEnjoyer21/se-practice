# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Orynbassar Abylaikhan
Student ID: 23B031400
GitHub username: RiceEnjoyer21

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | Claude |
| Exact model name and version | Claude Sonnet 5 Medium |
| Date of the session | 27.09.2026 |
| Diagram renderer used |  |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
Assumptions on the two open decisions
R3 (overlap): A booking that ends exactly when another begins is not an overlap — back-to-back bookings are allowed.
R2 (max duration): A booking of exactly two hours is allowed — "at most two hours" is inclusive.
User Stories

1.
As a Student, I want to view which study rooms are free and when, so that I can choose a suitable room and time before booking.
Priority: High
Assumption: Availability is shown only for current and future time slots, not past ones.

2.
As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed space to study.
Priority: High
Assumption: A booking may last up to and including two hours; a booking of exactly two hours is accepted.

3.
As a Student, I want to cancel a booking I made, so that I free up the room for others when I no longer need it.
Priority: High
Assumption: A student can cancel only their own bookings, not bookings made by other students.

4.
As a Student, I want to receive a confirmation when my booking or cancellation succeeds, so that I know the action went through and can rely on it.
Priority: Medium
Assumption: Confirmation is a single message triggered immediately by the action itself, not a recurring or scheduled reminder.

5.
As an Administrator, I want to block a room and unblock it later, so that a room that must be taken out of service cannot be booked while it is unavailable.
Priority: High
Assumption: Blocking a room prevents new bookings from being made on it but does not cancel bookings that already exist.

6.
As an Administrator, I want to view current room availability, so that I can decide which rooms need to be blocked or unblocked.
Priority: Medium
Assumption: The administrator sees the same availability information as students, scoped to the whole set of rooms.

7.
As an Administrator, I want to review how rooms were used over a chosen period, so that I can understand utilization patterns across the library.
Priority: Medium
Assumption: Usage review includes completed and confirmed upcoming bookings within the period, but not cancelled ones.

submission.yml
yaml
open_decisions:
  r3_overlap_boundary:
    question: "Does a booking ending exactly when another starts count as an overlap under R3?"
    decision: "No — back-to-back bookings (end == next start) are allowed, not treated as overlapping."
  r2_max_duration_boundary:
    question: "Is a booking of exactly two hours allowed under R2?"
    decision: "Yes — 'at most two hours' is inclusive; exactly 2:00:00 is a valid duration."
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| 1 — View availability | Kept the goal, replaced the time-range assumption. | The scenario does not restrict availability to current and future slots. | US-01 |
| 2 — Book room | Changed “guaranteed” to “reserved”; kept the inclusive two-hour limit. | Avoids an unsupported guarantee and records my R2 boundary decision. | US-02 |
| 3 — Cancel booking | Kept the meaning; shortened the assumption. | Cancelling only one's own bookings matches UC-03. | US-03 |
| 4 — Receive confirmation | Simplified wording; removed “single” and “immediately.” | Message count and delivery timing are not specified. | US-04 |
| 5 — Block/unblock room | Reworded the goal, removed the policy preserving existing bookings. | One status-change goal covers UC-04; treatment of existing bookings is unspecified. | US-05 |
| 6 — Administrator views availability | Deleted. | This additional administrator responsibility was insufficiently justified. | - |
| 7 — Review usage | Simplified wording, replaced the reporting assumption, and renumbered. | Booking-status filters are unspecified; usage should not introduce attendance tracking. | US-06 |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked". Answer: After reviewing the out-of-scope list, no features that are explicitly prohibited were identified. Nevertheless, the AI included unverified assumptions regarding availability times, timing of confirmations, current reservations following blocks, and contents of usage reports. I reviewed these.

**How many stories did you end with, and why that number?** Six narratives, addressing the six necessary use cases. I eliminated the poorly justified Administrator availability story and renumbered the original story 7 to US-06.

---

## 4. Original AI output — acceptance criteria (Part 3)

```
Acceptance Criteria
US-02 — Book a free room for a specific time slot

Assumptions:

A booking must start in the future (bookings in the past or "now" are not allowed).
Maximum booking duration is exactly two hours; a two-hour booking is permitted.
A room cannot have two overlapping bookings.
A blocked room cannot be booked.

Acceptance Criteria:

Successful booking
Given a student is logged in and a room is free and unblocked for the requested time slot,
When the student requests to book that room for a future 2-hour slot,
Then the system creates the booking and confirms it to the student.
Validation — booking in the past
Given a student is logged in,
When the student attempts to book a room for a time slot that starts in the past,
Then the system rejects the booking and displays an error indicating bookings must be in the future.
Validation — duration exceeds limit
Given a student is logged in and selects a future time slot,
When the requested booking duration is longer than two hours,
Then the system rejects the booking and displays an error stating the maximum duration is two hours.
Error — overlapping booking
Given a room already has a confirmed booking for a given time slot,
When a student attempts to book the same room for an overlapping time slot,
Then the system rejects the booking and displays an error indicating the room is already booked for that time.
Error — blocked room
Given a room is currently marked as blocked,
When a student attempts to book that room for any future time slot,
Then the system rejects the booking and displays an error indicating the room is unavailable.

US-03 — Cancel a booking

Assumptions:

A student can cancel only bookings they made themselves.
Only future (not yet started/completed) bookings can be cancelled.
Cancelling a booking immediately frees the room for that time slot.

Acceptance Criteria:

Successful cancellation
Given a student is logged in and has an existing future booking,
When the student cancels that booking,
Then the system removes the booking and the room becomes available again for that time slot.
Validation — booking already in the past
Given a student has a booking whose time slot has already ended,
When the student attempts to cancel it,
Then the system rejects the cancellation and displays an error stating past bookings cannot be cancelled.
Error — cancelling another student's booking
Given a student is logged in,
When the student attempts to cancel a booking made by a different student,
Then the system rejects the request and displays an error indicating they can only cancel their own bookings.
Alternative — booking does not exist
Given a student is logged in,
When the student attempts to cancel a booking that does not exist (e.g., already cancelled or invalid ID),
Then the system displays an error indicating the booking could not be found.

US-05 — Change a room's blocked status

Assumptions:

Only an Administrator can change a room's blocked status.
Blocking a room does not automatically cancel existing bookings already made before the block (unless otherwise specified by the business).
A blocked room cannot receive new bookings until it is unblocked.

Acceptance Criteria:

Successful blocking
Given an administrator is logged in and a room is currently unblocked,
When the administrator sets the room's status to blocked,
Then the system updates the room's status and prevents any new bookings for that room.
Successful unblocking
Given an administrator is logged in and a room is currently blocked,
When the administrator sets the room's status to unblocked,
Then the system updates the room's status and allows new bookings for that room again.
Validation — blocking an already blocked room
Given a room is already marked as blocked,
When the administrator attempts to block it again,
Then the system indicates no change was made (or confirms the room is already blocked) without creating a duplicate state.
Error — non-administrator attempts status change
Given a student (non-administrator) is logged in,
When they attempt to change a room's blocked status,
Then the system rejects the request and displays an authorization error.
Alternative — blocking a room with existing future bookings
Given a room has existing future bookings,
When an administrator blocks the room,
Then the system blocks the room for new bookings while existing bookings remain unaffected (flagged for admin awareness, per business rule).
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| US-02, criterion 1 | Includes login; does not test back-to-back bookings | Removed login and specified a successful two-hour booking starting exactly when another ends. | AC-01 |
| US-02, criterion 2 | Tests a past start but misses a start exactly now; includes login. | Removed login, clarified otherwise valid conditions, and covered both past and current-time starts. | AC-02 |
| US-02, criterion 3 | Includes login and does not isolate the duration violation. | Specified a free, unblocked room and a future booking lasting two hours and one minute. | AC-03 |
| US-02, criterion 4 | Overlap example and other booking conditions are vague. | Specified an unblocked room and concrete overlapping future slots. | AC-04 |
| US-02, criterion 5 | Other reasons for rejection are not excluded. | Specified a future one-hour slot without conflicting bookings, isolating the blocked-room rule. | AC-05 |
| US-03, criterion 1 | Includes login, omits confirmation, and assumes cancellation always makes a room available. | Specified an unblocked room, removed login, and included cancellation confirmation. | AC-06 |
| US-03, criterion 2 | Invents a rule prohibiting cancellation of past bookings. | Deleted this criterion and the unsupported cancellation deadline assumption. | - |
| US-03, criterion 3 | Includes login and does not explicitly protect the existing booking. | Removed login and stated that another student's booking remains unchanged. | AC-07 |
| US-03, criterion 4 | Includes login and conflates nonexistent and already-cancelled bookings. | Used a nonexistent booking and stated that no existing bookings change. | AC-08 |
| US-05, criterion 1 | Includes login; existing-booking conditions are unspecified. | Removed login and used a room without existing bookings. | AC-09 |
| US-05, criterion 2 | Includes login and suggests unblocking permits bookings without other checks. | Removed login, used a room without bookings, and retained R1–R3. | AC-10 |
| US-05, criterion 3 | Offers alternative expected results and refers to internal duplicate states. | Specified one response: the room stays blocked and the Administrator is informed. | AC-11 |
| US-05, criterion 4 | Includes login and an authorization error. | Deleted it to keep this set focused on room-status behavior; three criteria remain. | - |
| US-05, criterion 5 | Invents preservation of existing bookings and an administrator-awareness flag. | Deleted the criterion and its unsupported policy assumption. | - |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed, not an overlap | The bookings share no booked time |
| Is exactly two hours allowed under R2? | allowed | "At most two hours” is interpreted as an inclusive limit. |

**Which invalid or boundary case did the assistant leave out?** The established criteria did not assess a reservation beginning precisely at the current moment or a reservation commencing exactly when another concludes. I included these cases in AC-02 and AC-01 respectively. The initial assumptions referred to “now,” yet no standard evaluated it.

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml SmartCampus_UseCaseDiagram

left to right direction
skinparam packageStyle rectangle

actor Student
actor Administrator

rectangle "Smart Campus - Study Room Booking" {
  usecase "View availability"        as UC1
  usecase "Book room"                as UC2
  usecase "Cancel booking"           as UC3
  usecase "Block or unblock room"    as UC4
  usecase "Review usage"             as UC5
  usecase "Send confirmation"        as UC6
}

' --- Actor associations (only where an actor directly initiates the use case) ---
Student --> UC1
Student --> UC2
Student --> UC3

Administrator --> UC4
Administrator --> UC5

' --- Include relationships ---
' Booking a room always requires checking availability first (mandatory sub-step)
UC2 ..> UC1 : <<include>>

' Both booking and cancellation always trigger a confirmation (mandatory sub-step)
UC2 ..> UC6 : <<include>>
UC3 ..> UC6 : <<include>>

@enduml

Design decisions reflected in the diagram

No actor on UC-06 (Send confirmation). Nothing in the scenario says a Student or Administrator initiates a confirmation — it's a consequence of booking/cancelling. So it's reached only via <<include>> from UC-02 and UC-03, with no direct actor association. Giving it its own actor link would invent a trigger the scenario doesn't describe.
UC-02 includes UC-01. R1–R4 make a room's availability the precondition for booking; checking availability is a mandatory step inside the booking flow, not an optional variant, so <<include>> fits rather than <<extend>>.
No <<extend>> used anywhere. The scenario gives no optional/conditional insertion points (no "sometimes this happens"), so an <<extend>> relationship would be unjustified invention.
Administrator is not linked to UC-01/02/03, and Student is not linked to UC-04/05 — the notes assign these cleanly by role, and nothing suggests overlap (e.g., no shared "manage booking" case).
No relationship between UC-04 (Block/unblock) and UC-02 (Book room). R4 is a business rule enforced by the system, not a modeled use-case interaction — adding an <<extend>> here would cross into behavior/logic modeling rather than actor-goal modeling.

Let me know if you'd like me to render this as an image or export the submission.yml assumptions block alongside it.
```

Rendered diagram (image, or a link): https://cdn-0.plantuml.com/plantuml/png/TP7Dhfim48NtVeeZDcqNNAatIHTLXFApwZQetG_68LRyWsoJ25Lzzzf08aXxMVbuFi-PEUny81SwhPWIvu1WuMHp2QYb4pn8QvY_IjEI8usM-9KQKOPU2QGocKO9neW7wr26hXOcJ6fVQsca3uwYOkn98ojrDCIHTDjvvCEp7YThDGxMHgycmsy6T5vmyf7_9SKTT2Efg99AXZx3z977p-FNEPiwmCLUJsR1li_P8nak5Ah9z9LTBVegow-m3fsfud7cCR3hENiIjpXnr36gxDyPDdEs5AO6j-OidQQKzdAtR-mFOv-GvpdsGwhalULo87swPbFeyLmCMIpr-ujUCRRuBzFr-h-tcuVr3yDLx08drEXyaUtedeY33PT7YA2qpf3hY8BKdNgFu6JJ20TQB8lFEZv8bZryL-K-YFOBYsFZxQr8w-CxjbivsXT5hAm-gEnYZfrMVm40

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| UC-02 → UC-01 <<include>> | The scenario requires booking validation but does not require executing View availability as part of every booking. | Removed this include relationship and its explanatory comment. Kept Student -> UC-01 and both include relationships to UC-06. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them. Answer: None. Student was connected to Check availability, Reserve room, and Cancel reservation. Administrator was associated with blocking or unblocking rooms and reviewing usage. These connections correspond to the duties outlined in the situation. No direct connection was established between either actor and Send confirmation. The eliminated UC-02 -> UC-01 connection involved use cases, not an actor–use-case link.

**Did any screen, database or internal component appear as a use case or an actor?** No, the diagram includes just Student and Administrator as participants along with the six necessary business use cases. Both performers are beyond the system limit.

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: none
- Stories with **no use case** they belong to: none
- Criteria that test **no rule** from section 1: AC-06, AC-07, AC-08, AC-10, AC-11 do not directly test R1–R4. They cover cancellation and room-status behavior. AC-10 mentions R1–R3 but does not test their enforcement.

**What does the largest gap tell you about the generated requirements?** UC-01 and UC-05 include supporting narratives, yet lack acceptance criteria. All six functions appear in the stories, yet the availability observation and usage review still fail to have testable acceptance criteria, as only three stories were chosen for criteria creation.

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
FAIL   US-7  user-stories.md         out-of-scope vocabulary: attendance, reminder — either the assistant widened the scenario, or say why in lab-report.md
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-02, US-03, US-05
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 11 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  5 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
22 PASS · 1 FAIL · 0 ERROR   (23 checks)
Every FAIL goes in lab-report.md section 9 with what you decided about it.
A FAIL you report and explain costs you nothing. One you hide costs the criterion.
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
