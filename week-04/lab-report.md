# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Abylaikhan |
| Group | Monday, 16:00-19:00 |
| AI assistant | Claude |
| Exact model | claude-sonnet 5.5 |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
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
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** 
1. US-05 covers both blocking and unblocking, modeled as one use case.
2. dministrators do not book, cancel, or view availability; only the stories’ actor-to-goal mappings are shown.
3. Viewing availability is not a prerequisite for booking, so no include connects these use cases.
4. R1–R3 are internal validation rules within Book Room; R2 and R3 also affect availability.
5. Cancel Own Booking releases the slot and is restricted to the student who made the booking.
6. The system boundary contains six use cases and excludes all out-of-scope features.
7. Both actors are human users; no external systems are in scope.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Book Room → Receive Booking Confirmation (include relationship) | The AI explains the relationship outside the diagram, but the required justification comment is missing directly above the relationship in the PlantUML source. | README §4 requires a comment directly above every include relationship; R4 justifies this relationship. | Add ' why: Every successful booking produces a confirmation (R4). directly above the relationship. |
| 2 | Assumption 2: “Administrators do not book, cancel, or view availability. | This wording turns the absence of administrator stories for these goals into a prohibition. The supplied requirements assign goals to roles but do not establish such a prohibition or say that a person cannot hold both roles. | The scenario and US-01–US-06 specify actor-to-goal mappings, not mutually exclusive roles. | Clarify that only explicitly assigned goals are modeled. Keep the existing actor associations without claiming additional permission restrictions. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student may make zero or more bookings. | Each booking belongs to exactly one student. | Student: 1 / Booking: 0..* |
| Room — Booking | One room may have zero or more bookings over time. | Each booking reserves exactly one room. | Room: 1 / Booking: 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: The note attached to Booking explicitly prohibits overlapping ACTIVE bookings for the same room and defines the overlap condition.
- R1: The Booking note requires a future start and a duration greater than zero and at most 120 minutes.
- R3: The Booking note requires checking Room.blocked before creation and prohibits new bookings for blocked rooms.
- R4: The Booking note requires confirmation after every successful booking.
- US-03: The Booking note restricts cancellation to the booking's owner. Multiplicity identifies the owner but does not enforce permission to cancel.

### 4.3 Assumptions

- A1: Touching bookings are allowed. A booking ending at 12:00 does not overlap with one starting at 12:00. Intervals are treated as start-inclusive and end-exclusive.
- A2: Blocking a room preserves existing bookings and prevents only new bookings. Unblocking allows new bookings again.
- A3: Cancelled bookings remain stored with status CANCELLED. They do not prevent new reservations under R2.
- A4: Duration is represented in whole minutes. endTime is derived from startTime plus durationMinutes.
- A5: A successful booking has a confirmation identifier. The delivery mechanism is outside this domain diagram.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | R2 note on Booking | The original note says overlapsWith() is applied to active bookings, but does not explicitly state that overlapping active bookings for the same room are forbidden. | R2; README §4 requires R2 in a note on Booking. | Replace the wording with an explicit no-overlap constraint and define the overlap condition. |
| 2 | Booking.overlapsWith() and Room.block() policies | The response leaves touching intervals and the effect of blocking on existing bookings undecided. | README §3 requires both decisions to be declared when the model depends on them; R2 and R3. | Declare A1 and A2 in §4.3 and the diagram note: touching bookings are allowed, and blocking preserves existing bookings. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence, it shows how Student, BookingService and BookingRepository interact during validation, reservation and confirmation.

**Design components added beyond the domain model:** 
- BookingService — coordinates the booking request, validates the rules, creates the booking and returns confirmation or rejection.
- BookingRepository — retrieves rooms and active bookings and persists successful reservations. The overlap check and save are assumed to form one atomic reservation operation.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Inner alt guards: “room is blocked” and “overlappingBookings is not empty”| Both conditions can be true at the same time. The diagram does not clearly express the blocked-room priority stated in the AI's assumption 7. | R2 and R3; AI assumption 7. The priority is a design choice, not a scenario requirement. | Check blocked status first. Place the overlap query and its alternatives inside the room-not-blocked branch. |
| 2 | endTime argument in findActiveBookings() | The diagram uses endTime without showing its derivation. The calculation appears only in the AI's assumption 2. | US-02's requested time slot; R1 and R2; derived Booking.endTime in the class diagram. | Add an explicit calculation of endTime from startTime and durationMinutes after R1 passes and before querying overlaps. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The availability operation does not explicitly describe how blocked rooms and active bookings affect its result. | Room.getAvailability() | accept | US-01 depends on R2 and R3. Although these rules appear elsewhere, attaching their availability meaning to Room makes the operation clearer. Add a note that blocked rooms offer no bookable slots and ACTIVE bookings exclude overlapping intervals. |
| 2 | The sequence refers directly to a private attribute instead of the available query operation. | room.blocked guards; Room.isBlocked() | accept | The guards can be understood as state conditions, but using room.isBlocked() makes their relationship to the public domain operation explicit. Replace the two blocked-status guards with room.isBlocked() conditions. |
| 3 | BookingService and BookingRepository must be added to the class diagram. | Sequence lifelines and domain class diagram | reject | README Part 3 explicitly identifies these as design components, not domain classes. They are explained in §5. Adding them to the domain diagram would conflict with the assignment's separation of domain and design elements. |
| 4 | UC4 needs a direct Student association because it traces to a Student story. | Receive Booking Confirmation and its include relationship | reject | R4 makes confirmation an outcome of successful booking. README §9 explicitly permits this included use case without a direct actor association and requires the justification comment, which is present. |
| 5 | Cancellation ownership is not enforced because cancel() has no requester parameter. | Student.cancelBooking(), Booking.cancel() and the US-03 note | reject | The note explicitly restricts cancellation to the booking's owner, and the association identifies that owner. This domain model states the constraint without prescribing an authorization implementation. A requester parameter is one possible design, not a requirement. CANCELLED bookings are already excluded because R2 applies only to ACTIVE bookings. |
| 6 | Separate overlap-query and save messages contradict the atomicity assumption. | findActiveBookings(), saveBooking() and the reservation note | reject | Several calls can participate in one atomic operation. The explicit note states that assumption, so separate messages do not themselves contradict it. The diagram does not prove how atomicity is implemented. Confirmation is delivered to Student only after savedBooking; preparing its identifier earlier is not a success notification. |
| 7 | A1 and A2 are unjustified because they are absent from the approved stories. | Touching-booking and room-blocking assumptions | reject | README §3 explicitly leaves these decisions open and requires declared assumptions. Both are recorded in §4.3. The strict overlap inequalities implement the chosen A1 policy; they are not supplied by R2 itself. |
| 8 | Administrator functionality must appear in the Book Room sequence, and an Administrator domain class is required. | US-05, US-06 and the sequence scope | reject | Task 3A specifically requests the Book Room scenario. Room.block() and unblock() support US-05; Room and Booking provide information for US-06's usage review. An Administrator actor does not automatically require a stored domain class. In §7, state explicitly that these administrator workflows are outside the chosen sequence. |


---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room\n(US-02) | Booking.startTime, durationMinutes, derived endTime; R1 note on Booking. | validateRequest(); R1 fails/passes alternatives; explicit endTime calculation. |
| R2 | Book Room\n(US-02) | Booking.status, startTime, endTime; Room–Booking association; no-overlap constraint in the Booking note. | findActiveBookings(); strict overlap condition in the repository note; empty/non-empty alternatives; atomic reservation assumption. |
| R3 | Book Room\n(US-02); Block or Unblock Room\n(US-05) | Room.blocked, block(), unblock(), isBlocked(); R3 note on Booking. | room.blocked alternatives; rejection(ROOM_BLOCKED). Changing blocked status is outside this sequence. |
| R4 | Book Room\n(US-02); Receive Booking Confirmation\n(US-04) | Booking.confirm(), confirmationId; R4 note on Booking. | confirm(booking) prepares the identifier; confirmation(...) is returned to Student after savedBooking. |
| US-01 | View Room Availability\n(US-01) | Room.getAvailability(); Room.blocked; Booking time interval and status. | The availability-browsing workflow is not shown. findRoom() and findActiveBookings() check availability only within Book Room. |
| US-02 | Book Room\n(US-02) | Student.bookRoom(); Room; Booking; Student–Booking and Room–Booking associations. | bookRoom(...) request, validation, createBooking(), saveBooking(), and success/rejection alternatives. |
| US-03 | Cancel Own Booking\n(US-03) | Student.cancelBooking(); Booking.cancel(), status; ownership association and US-03 note. | Not shown: cancellation is outside the chosen Book Room sequence. |
| US-04 | Receive Booking Confirmation\n(US-04) | Booking.confirm(), confirmationId.| confirmation(...) reply to Student after successful persistence. |
| US-05 | Block or Unblock Room\n(US-05) | Room.block(), unblock(), blocked; A2 note preserving existing bookings.| The administrator workflow is not shown. The room.blocked guards show the effect on new booking requests. |
| US-06 | Review Room Usage\n(US-06) | Room and its associated Bookings; Booking.startTime, durationMinutes and status provide data for a derived usage review. No separate reporting operation is modeled. | Not shown: usage review is outside the chosen Book Room sequence. |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | The include relationship was justified only in accompanying prose. Assumption 2 stated that administrators do not book, cancel or view availability. | Added a justification comment directly above the include relationship and a scope comment clarifying that actor associations do not establish additional permission restrictions. | README §4 requires the inline justification; R4 supports the include. US-01–US-06 assign goals without declaring mutually exclusive roles. |
| 2 | class | The R2 note mentioned applying overlapsWith() but did not explicitly prohibit overlaps. Touching intervals and the effect of blocking on existing bookings were undecided. | Expanded the Booking note with an explicit no-overlap constraint and strict overlap formula. Declared A1 allowing touching bookings and A2 preserving existing bookings when a room is blocked. | R2 requires no overlapping active bookings for the same room. README §3 requires the two unresolved policies to be declared as assumptions. |
| 3 | sequence | Blocked-room and overlap conditions appeared in the same alt fragment. endTime was used without a visible calculation. Atomicity was explained only in accompanying prose. | Nested the overlap query and alternatives inside the unblocked-room branch; added the endTime calculation, explicit overlap formula and an atomic-reservation assumption note. | Makes the selected R3-before-R2 priority explicit, aligns the time interval with the class diagram and exposes the assumption used to preserve R2 under concurrent requests. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
python tests/check_models.py
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (6 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 5 assumption(s) declared
LR5  PASS  2 behaviour-diagram findings in §5
LR6  PASS  8 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The class diagram required the greatest explanation. Its initial R2 note indicated that overlapsWith() was used for active bookings, yet did not clearly forbid overlapping reservations for the same room. It also created emotional moments and left the consequences of reserving a room unresolved. I included a clear constraint and stated that overlapping bookings are permitted and current bookings remain intact despite room blocking. In the absence of these decisions, implementation might deny nearby reservations or annul current bookings without a consensus policy.The sequence evaluation clarified the blocked-room priority and included the previously omitted endTime calculation. The subsequent critique pointed out that getAvailability() did not clearly indicate how blocked rooms and active bookings influence its outcome. Nonetheless, the request to include BookingService and BookingRepository in the domain class diagram clashed with the assignment's division of domain ideas and design elements.The checker incorrectly categorized a successful branch due to its variable name having "overlap". Changing the variable name maintained the logic. Successfully passing structural checks aids in the submission process but does not substitute for semantic review.
