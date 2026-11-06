# Week 07 — Lab report

**Name:**
**Group:**
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | |
| Assistant that generated the tests (tool) | Claude (fresh chat) |
| Exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Test command | `npx vitest run` (in `app/`) |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `src/App.tsx`, function `evaluateAvailability` (inside the page file) |
| Its inputs | `room` (with `blocked` and `bookings`), `startMin`, `endMin`, `currentMin` |
| What it returned | A `Verdict`: `{kind:'available'}` or `{kind:'unavailable', reasons: string[]}` |
| How the page used it | `App` called it in a `useMemo` and passed the verdict to `VerdictCard`, which shows Available or the list of reasons |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
I created `src/booking.ts` with `canBook({ start, end, now, blocked, bookings })`. I copied the four rule conditions from `evaluateAvailability` unchanged: the AC1 interval and `start <= now` check, the AC2 `> 120` check, the AC3 blocked check and the AC4 overlap check `start < b.end && end > b.start`. They now return `false` instead of pushing messages. `evaluateAvailability` in `src/App.tsx` imports `canBook`, returns Available when it is true, and otherwise builds the reason messages as before. The conversion from HH:MM and the messages stay in the page. Behaviour is the same because the conditions are the same and only their location changed. Typecheck and build pass.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The booking 600–660 ends at 660 and the request starts at 660. The end minute is excluded, so the intervals only touch and share no minute. Length is 60, start is after now (540), room is open. |
| T02 | 540–570 (starts now) | false | AC1 | Start 540 equals now 540. AC1 needs the start strictly after the current time, so a request that starts at this very minute is not allowed. |
| T03 | 720–720 (zero duration) | false | AC1 | AC1 needs start < end. 720 is not less than 720, so the interval is empty and must be rejected. |
| T04 | 750–720 (reversed) | false | AC1 | The start 750 is after the end 720, so start < end is false. A reversed interval has no valid length. |
| T05 | 1380–1441 (past day end) | false | AC1 | End 1441 is more than 1440, the last minute of the day. AC1 needs end <= 1440. The length (61) and overlap rules are fine, so only AC1 rejects it. |
| T06 | 720–840 (120 minutes) | true | AC2 | Length is exactly 120. AC2 rejects only bookings longer than 120, so the limit itself is allowed. It is far from 600–660 and after now. |
| T07 | 720–841 (121 minutes) | false | AC2 | Length is 121, one minute over the limit. Everything else is valid, so only AC2 rejects it. |
| T08 | 570–600 (touching before) | true | AC4 | The request ends at 600 and the booking starts at 600. The end minute is excluded, so they only touch. Start 570 is after now 540. |
| T09 | 630–690 (partial overlap) | false | AC4 | Minutes 630–660 are inside both the request and the booking 600–660, so they share time. That is an overlap. |
| T10 | 570–690 (contains booking) | false | AC4 | The request starts before the booking and ends after it, so the whole booking 600–660 is inside it. They overlap. The length 120 is still allowed, so only AC4 rejects it. |
| T11 | 615–645 (inside booking) | false | AC4 | The request lies fully inside 600–660, so every minute of it is already booked. Overlap. |
| T12 | 600–660 (identical interval) | false | AC4 | Same start and same end as the existing booking. It shares all of its minutes, so it overlaps. Only a pure touch would be allowed. |
| T13 | 660–720, blocked = true | false | AC3 | The same request as T01 is Available when the room is open. With blocked = true only the room state changes, so AC3 must be the reason it is rejected. |
| T14 | 630–690, bookings = [] | true | AC4 | The same request as T09 is rejected only because of the booking. With no bookings there is nothing to overlap, and the other rules pass, so it is Available. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | A check only reads the bookings. After calling canBook on 660–720 the array must equal the copy made before the call, so the request is not saved into the data. |
| X1 | 1380–1440 (ends exactly at the end of the day) | true | AC1 | AC1 allows end <= 1440, so 1440 itself is valid. It is the opposite side of T05 (1441). Length is 60, after now, far from the booking at 600–660. |
| X2 | 660–720 with bookings = [600–660, 720–780] (fits exactly between two bookings) | true | AC4 | The request touches two bookings, one at each end. Both touches are allowed because end minutes are excluded, so it is Available. A rule that checks only one neighbour would fail here. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Function under test (src/booking.ts, imported in the test as `import { canBook } from './booking'`):

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
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!(0 <= start && start < end && end <= MINUTES_IN_DAY)) return false;
  if (start <= now) return false;
  if (end - start > MAX_BOOKING_MINUTES) return false;
  if (blocked) return false;
  if (bookings.some((b) => start < b.end && end > b.start)) return false;
  return true;
}

Default fixture: now = 540 (09:00), blocked = false, bookings = [{ start: 600, end: 660 }] (10:00–11:00). Use fresh data in every test. Change only what the row says.

| ID | Candidate start–end / changed input | Expected | Requirement |
| --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |
| T02 | 540–570 (starts now) | false | AC1 |
| T03 | 720–720 (zero duration) | false | AC1 |
| T04 | 750–720 (reversed) | false | AC1 |
| T05 | 1380–1441 (past day end) | false | AC1 |
| T06 | 720–840 (120 minutes) | true | AC2 |
| T07 | 720–841 (121 minutes) | false | AC2 |
| T08 | 570–600 (touching before) | true | AC4 |
| T09 | 630–690 (partial overlap) | false | AC4 |
| T10 | 570–690 (contains booking) | false | AC4 |
| T11 | 615–645 (inside booking) | false | AC4 |
| T12 | 600–660 (identical interval) | false | AC4 |
| T13 | 660–720, blocked = true | false | AC3 |
| T14 | 630–690, bookings = [] | true | AC4 |
| AC5 | an Available request; the bookings after the call equal the bookings before | true, data unchanged | AC5 |
| X1 | 1380–1440 (ends exactly at the end of the day) | true | AC1 |
| X2 | 660–720 with bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }] | true | AC4 |
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
I wrote the tests to booking.test.ts. I haven’t run them, as you asked. Put the file next to src/booking.ts, i.e. at src/booking.test.ts, so ./booking resolves. booking.ts is untouched.

Run command

npx vitest run src/booking.test.ts

How the file is built

Fresh fixtures: makeRequest() builds new objects and a new bookings array on every call. The default is now = 540, blocked = false, bookings = [{600, 660}]. Each row changes only what it lists.
Fixed time: canBook takes now as an argument. The tests also freeze the system clock with Vitest fake timers, so any hidden dependence on the real clock would show up.
Exact decisions: every assertion is toBe(true) or toBe(false).

AC mapping

AC	Tests	What is covered
AC1	T02, T03, T04, T05, X1	starts now, zero duration, reversed, past day end, ends exactly at 1440
AC2	T06, T07	120 minutes passes, 121 fails
AC3	T13	blocked room is rejected
AC4	T01, T08, T09, T10, T11, T12, T14, X2	touching before and after, partial overlap, contains, inside, identical, no bookings, fits between two bookings
AC5	two tests in the AC5 block	the Available case from your table, plus an Unavailable case I added. Input is frozen and compared to a deep clone before and after. The array and element references are checked too
AC6	none	not testable here, see below

Unclear requirements

AC5 label: canBook returns only a boolean. The “Available / Unavailable” wording is page code I can’t see, so the tests don’t check it. I can add a component test if you share the page component or name its label function.
AC5 “unchanged”: the tests prove canBook doesn’t mutate its input. They can’t prove the page leaves its own booking state alone after a click.
AC6: layout and validation messages need a component or browser test (Playwright, or Vitest with Testing Library). They can’t be tested through this function. “Understandable feedback” also needs defined message text before it can be asserted.
AC1 gaps in the table:
There is no case for a negative start (e.g. -10–30). The code rejects it, but nothing tests it.
There is no case for start just after now (541) or just before it (539).
The table also doesn’t say whether a past time should get different feedback from other invalid input. canBook can’t tell the page which rule failed.
Rejection reason: with a boolean result, the page can’t show why a request was rejected. AC6 asks for understandable feedback, so this is a design question.
Rule order: when several rules fail at once (e.g. blocked and overlapping), the result is false either way. That is fine for the boolean, but a future reason code would need an agreed order.
X1 and X2: these two rows are not in the reviewed table, so please confirm them.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: **yes**

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | `it.each(rows)` runs T01–T14, X1 and X2 as one table | Table-driven: the IDs do not have their own named tests, and the lab rules forbid `test.each` | revise | Split into one `test('T05 AC1: …')` per case so each ID has its own name and result (AC1–AC4 cases) |
| 2 | `vi.useFakeTimers()`, `vi.setSystemTime(new Date(...))` | Own weakness: needless clock code; `canBook` takes `now` as a number, so the clock cannot matter, and it adds `new Date` to the tests | revise | AC1 uses the supplied `now = 540`; remove fake timers and any `Date` |
| 3 | Expected values of T01–T14, X1, X2 | Checked each against the case table and AC1–AC4: none copies the code's output; T06 true (AC2 allows 120), T02 false (AC1 start must be after now) | accept | AC1–AC4 |
| 4 | AC5 test with a frozen array and `structuredClone` | Not weak: calls `canBook` on an Available request (660–720) and compares bookings with a copy taken before the call | accept | AC5 |
| 5 | Whole table: only the plan's inputs | Only valid requests: no negative start (-10–30) and no start just after `now` (541), both AC1 boundaries | revise | Add these two boundary tests to the final suite (AC1) |
| 6 | Assistant note: "X1 and X2 are not in the reviewed table" | Wrong: both were in the prompt table; the note is about the assistant's reading, not the tests | reject | The case table of section 3 |
| 7 | Improvement answer: E01 (541–570 true) and E02 (539–570 false) | Only valid requests: T02 pins only `start == now`, so `start < now` or `start <= now + 1` would pass | accept | AC1: start must be strictly after now; kept as E01, E02 |
| 8 | Improvement answer: E07 (570–630) and E08 (740–770 with two bookings) | Missing boundaries: T09–T12 never hit only the head of a booking; every plan case but X2 has one booking, so a check of `bookings[0]` only would pass | accept | AC4; kept as E03 (head overlap) and E04 (second booking only) |
| 9 | Improvement answer: E03–E06, E09, E10 and N01, N02 (negative `now`) | Duplicates of T07, T13, T01 and X2 with other numbers, or inputs outside the lab: negative `now` is not a valid time of day | reject | AC1–AC4 are already covered by T-cases; the lost check on `0 <= start` is recorded in 9.2 as a limitation |
| 10 | Improvement answer: AC5 also on an Unavailable request, deep-frozen input | Plan asks for the Available request; the extra case repeats T09 | reject | AC5 test stays as in the plan |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-07/app

 ✓ src/booking.test.ts (18 tests) 8ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  01:08:57
   Duration  3.71s (transform 35ms, setup 0ms, collect 48ms, tests 8ms, environment 0ms, prepare 3.44s)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | All 18 tests passed in the first run | Ran the first suite unchanged; compared the code and the passing tests with AC1–AC4 | – (no failure) | No repair needed for correctness; the suite is still revised for style and the rules (see section 5) |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-07/app

 ✓ src/booking.test.ts (18 tests) 8ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  01:08:57
   Duration  3.71s (transform 35ms, setup 0ms, collect 48ms, tests 8ms, environment 0ms, prepare 3.44s)

----- assistant's answer -----

Before the review, one correction: the output you pasted isn’t failure output. All 18 tests passed. I rechecked every expectation against the function and none is wrong, so there is nothing to repair from a failure. A green run only shows the suite agrees with the current code. It doesn’t show the suite would catch a bug, so I reviewed it for that.

I rewrote booking.test.ts. I haven’t run it, as before. The command is still npx vitest run src/booking.test.ts. No correct expectation was changed.

Incorrect expectations
None. I checked all 16 table rows and both AC5 tests against the function by hand, and each expectation matches the requirement it cites.

Test repairs
#	Change	Requirement	Defect it could detect
1	Add E01 (539–570 → false) and E02 (541–570 → true)	AC1	T02 alone only pins start == now. A bug like start < now fails T02, but start <= now + 1 or start < now + 1 would also need E02. E01 and E02 pin both sides of the boundary.
2	Add E07 (570–630 → false)	AC4	T09–T12 never overlap only the head of the existing booking. A wrong overlap formula such as end > b.start && end < b.end passes T09 and T11 but accepts a request overlapping the head. E07 catches it.
3	Add E08, E09, E10 (two bookings, overlap with the second only, reversed array order)	AC4	Every table row except X2 uses one booking. X2 only passes touching intervals, so code that checks only bookings[0], or uses every instead of some, would still pass the table. E08 and E09 catch it. E10 checks order independence on the passing side.
4	Add E03, E04 (1320–1440 true, 1319–1440 false)	AC1 and AC2	This checks the 120-minute limit and the day-end limit together. A shortcut such as using end to judge duration would be caught.
5	Add E05 (700–1000 → false)	AC2	T07 is only 1 minute over. This case is far over the limit with no other rule failing, so a limit set too high or applied wrongly is caught.
6	Add E06 (blocked, empty bookings → false)	AC3	T13 is blocked with an existing booking present, though it doesn’t overlap. E06 removes overlap from the picture, so a blocked check wrongly tied to the bookings list would fail here.
7	Add N01, N02 with negative now	AC1	With now = 540, the 0 <= start clause can never be the deciding rule, because start > now rejects the same inputs first. Deleting that clause is undetectable. These two cases test it, but only if negative now is valid. They sit in their own describe so you can drop them.
8	AC5 asserts the whole request is unchanged	AC5	The old test checked only bookings. It now checks start, end, now and blocked as well, using a deep-frozen input, a before/after comparison, and a repeat call that must return the same decision.
9	AC5 now covers the Unavailable case as well, in one it.each	AC5	The two cases share one assertion block instead of two near-duplicate tests.
10	Removed the Row type and row() helper	none	They did nothing and made the file harder to read. Cases are now plain objects.

Duplicates
T01 and T13 share the interval 660–720 on purpose. T01 shows it is free, and T13 shows only blocked changes the answer.
The old Unavailable AC5 test repeated T09’s interval. It now sits in the shared it.each, so the repeat is deliberate.
No other cases are redundant.

Implementation fixes
None are needed. These are decisions, not bugs.

canBook returns only a boolean, so the page can’t say why a request was rejected. AC6 asks for understandable validation feedback. Returning a reason code, such as { ok: false, reason: 'blocked' }, would let you test AC5 and AC6 properly. This is a design change.
The function doesn’t handle NaN, non-integer minutes, or malformed bookings, such as one with start >= end. It happens to return false for NaN start or end, but no requirement says so. I didn’t add tests for these.

Open questions
Is a negative now valid input? If not, delete the N cases. The 0 <= start clause is then redundant in the code.
Do you approve E01–E10 and N01–N02? They are not in the reviewed table, so I kept them in separate describe blocks.
Do you want the AC6 page tests (desktop and narrow width, validation text)? They need a component or browser test. This function can’t cover them.

Mutation check
Since you run the tests, try these edits to booking.ts one at a time. The suite should fail on each:

start <= now → start < now
> MAX → >= MAX
start < b.end → start <= b.end
end > b.start → end >= b.start
bookings.some → bookings.slice(0, 1).some
delete end <= MINUTES_IN_DAY
delete 0 <= start

The last one survives unless you keep N01 and N02. Before this review, bookings.slice(0, 1).some would also have survived.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-07/app

 ✓ src/booking.test.ts (21 tests) 4ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  01:23:11
   Duration  799ms (transform 31ms, setup 0ms, collect 35ms, tests 4ms, environment 0ms, prepare 548ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | – |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2, AC5 | – |
| M3 | Remove the blocked-room rejection | Detected | T13 | – |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
M1 (end - start >= MAX_BOOKING_MINUTES)
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-07/app
   × canBook: plan T01-T14 > T06 AC2: 720-840 is exactly 120 minutes and is allowed 6ms
 FAIL  src/booking.test.ts > canBook: plan T01-T14 > T06 AC2: 720-840 is exactly 120 minutes and is allowed
AssertionError: expected false to be true // Object.is equality
      Tests  1 failed | 20 passed (21)

M2 (start <= b.end && end >= b.start)
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-07/app
   × canBook: plan T01-T14 > T01 AC4: 660-720 touches the end of 600-660 and is allowed 7ms
   × canBook: plan T01-T14 > T08 AC4: 570-600 touches the start of 600-660 and is allowed 0ms
   × canBook: AC5 data is not changed > AC5: an Available request leaves the bookings equal to the copy taken before 0ms
   × canBook: my own cases X1, X2 > X2 AC4: 660-720 between 600-660 and 720-780 touches both and is allowed 0ms
      Tests  4 failed | 17 passed (21)

M3 (line "if (blocked) return false;" removed)
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-07/app
   × canBook: plan T01-T14 > T13 AC3: 660-720 in a blocked room is rejected 6ms
 FAIL  src/booking.test.ts > canBook: plan T01-T14 > T13 AC3: 660-720 in a blocked room is rejected
AssertionError: expected true to be false // Object.is equality
      Tests  1 failed | 20 passed (21)
```

All three changes reverted, and the full suite run again (section 6.3): **yes**

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Science Lab A, current time 09:00, 11:00–12:00: green Available card, "No existing bookings were modified". The booking Chemistry Lab 10:00–11:00 is still listed. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The page has no switch for blocked, so I selected the room that is blocked in the data (Auditorium B), same interval 11:00–12:00, and pressed Check again. The result became red Unavailable with the one reason "This room is currently blocked and cannot be booked". Its booking Maintenance 10:00–11:00 is unchanged. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Cleared Start time (shows --:--), End 12:00, pressed Check: Unavailable with "Enter a valid time interval (start before end, within 00:00–24:00)". The message is understandable but generic: it does not say that Start time is empty. | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At about 375 px, portrait, the form is one column, Start and End sit side by side, the button is full width and the Available result is shown under the form. No horizontal scrolling. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | After repeating Available, Unavailable (blocked room) and Available again, then checking a new interval 12:00–13:00 in Science Lab A, the result is Available and the list still has only Chemistry Lab 10:00–11:00. The new interval was not added. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
