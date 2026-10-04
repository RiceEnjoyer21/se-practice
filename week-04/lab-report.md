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
| Behaviour diagram | <sequence / activity / both> |
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
<paste>
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
| 1 | Book Room -> Receive Booking Confirmation (<<include>>) | The AI explains the relationship outside the diagram, but the required justification comment is missing directly above the relationship in the PlantUML source. | README §4 requires a comment directly above every include relationship; R4 justifies this relationship. | Add ' why: Every successful booking produces a confirmation (R4). directly above the relationship. |
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
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
