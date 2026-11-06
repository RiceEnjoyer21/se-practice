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
| Assistant that generated the tests (tool) | |
| Exact model (with its version, or `not displayed`) | |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | |
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
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

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
