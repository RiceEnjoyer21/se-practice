# Week 05 — Lab report

**Name:** Abylaikhan Orynbassar
**Group:** Monday, 16:00-19:00
**Date:** 10.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Claude |
| **Exact** model name | claude sonnet 5.5 |
| Language and version | Python 3.10.19 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Implementation Plan for can_book
Order of checks

Each check returns False immediately on failure. If all pass, return True. Cheap, constant-time checks go first, and the linear scan over existing goes last.

Blocked (AC3): if blocked is True, return False.
Range validity (AC1): require 0 <= start < end <= 1440.
Future start (AC1): require start > now (strictly greater).
Duration (AC2): require end - start <= 120.
Overlap (AC4): for each (s, e) in existing, the new booking conflicts if start < e and s < end. If any conflict is found, return False.
Otherwise return True.

Because every check is a pure condition and the result is a boolean, the order doesn’t change the outcome. It only affects efficiency and readability.

Assumptions
start, end, and now are integers. The contract says so, so no type coercion or validation is needed beyond the range checks in AC1.
existing tuples are valid, as the contract states, so s < e and both are within 0–1440. No defensive checks on them.
existing may be empty, in which case there is no overlap.
existing may be unsorted and may contain bookings that touch each other. A full scan is the safe approach, with no early-exit assumptions based on ordering.
existing holds active bookings only, so no filtering by status is needed.
Intervals are half-open [start, end), so two bookings that share only an endpoint do not conflict.
blocked is a real Boolean, so a simple truthiness test is enough.
The function is read-only. It iterates existing without sorting, appending, or removing, so inputs stay unchanged (AC5).
Invalid new-booking input (for example start >= end) means False, not an exception, since AC5 says to return False otherwise.
A booking that fails AC1 for being “in the past” (start <= now) is rejected even if it would end in the future.
Boundary cases to test

Range and time (AC1)

Case	Expected	What it catches
start=-1	False	Missing lower bound check
start=0, end=60, now=0	False	start > now written as >=
start=0, end=60, now=-1 is not valid input, so use start=1, end=60, now=0	True	Off-by-one on the now comparison
start=600, end=600	False	Zero-length booking allowed by <=
start=700, end=600	False	Reversed interval
start=1380, end=1440, now=0	True	end <= 1440 written as <
start=1380, end=1441	False	Missing upper bound check
start=1439, end=1440, now=1438	True	Last-minute slot at day end
start=600, end=660, now=600	False	start == now treated as valid

Duration (AC2)

Case	Expected	What it catches
start=600, end=720 (exactly 120)	True	< written instead of <=
start=600, end=721 (121)	False	Missing or loose duration check
start=600, end=601 (1 minute)	True	Hidden minimum-duration rule

Blocked (AC3)

Case	Expected	What it catches
Otherwise valid, blocked=True	False	Ignoring the flag
Valid request, blocked=True, existing empty	False	Blocked check hidden behind the overlap loop

Overlap (AC4)

Case	Expected	What it catches
existing=[(600, 660)], new (660, 720)	True	Touching at end treated as overlap
existing=[(600, 660)], new (540, 600)	True	Touching at start treated as overlap
existing=[(600, 660)], new (630, 690)	False	Partial overlap, new starts inside
existing=[(600, 660)], new (570, 630)	False	Partial overlap, new ends inside
existing=[(600, 660)], new (610, 650)	False	New fully inside existing
existing=[(610, 650)], new (600, 660)	False	New fully contains existing
existing=[(600, 660)], new (600, 660)	False	Identical interval
existing=[(600, 660)], new (600, 661)	False	Same start, longer
existing=[(600, 660), (720, 780)], new (660, 720)	True	Fits exactly in a gap between two bookings
Unsorted existing=[(720, 780), (600, 660)], new (630, 690)	False	Early exit that assumes sorted input
Conflict only with the last item in a long list	False	Loop stopping early or checking only the first item
existing=[]	True (if all else valid)	Crash on empty list

Input immutability (AC5)

Case	Expected	What it catches
Pass existing unsorted, compare to a copy afterwards	Unchanged	In-place sort() or other mutation

Combined failures

Case	Expected	What it catches
Valid overlap-free request but 121 minutes long	False	Passing because only one rule was tested
Overlapping and blocked	False	Any one rule masking another
Notes on one test case

In the range table I flagged that now=-1 is outside the contract, so the off-by-one test for start > now uses start=1, now=0. That gives the tightest valid check on the strict inequality.

Ready for the next request, whether that’s the implementation or the test suite.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | | Check blocked status, range, future start, duration and overlap, then return True. | Step 1 implements AC3; steps 2–3 implement AC1; step 4 implements AC2; step 5 implements AC4; step 6 implements AC5. | Checked every step. Found no invented booking restrictions. |
| 2 | | With existing=[(600, 660)], request (540, 600) should return True because it touches the existing start. | With the lab's base now=540, AC1 rejects this request because start equals now. | Selected (570, 600) with now=540 instead, so the test isolates touching endpoints under AC4. |
| 3 | | Requests (600, 720), (600, 721) and (600, 601) test duration. | With the base existing=[(600, 660)], all three overlap. AC4 would mask the duration check. | Selected (720, 840), (720, 841) and (720, 721) instead, keeping the other ACs satisfied. |
| 4 | | Request (600, 660), now=600 tests a start equal to now. | With the base existing=[(600, 660)], the request also fails AC4. Part 3 requires one rejection reason per test. | Selected (540, 570), now=540 instead, avoiding overlap. |
| 5 | | A negative start catches a missing lower-bound check. | Since now is valid and nonnegative, a negative start also violates start > now. It cannot isolate the lower bound. | Did not treat this case as proof that the lower-bound check works independently. |
| 6 | | An overlapping and blocked request catches one rule masking another. | Either rule alone still rejects that request, so the test cannot expose a missing blocked or overlap check. | Selected separate blocked-only and overlap-only tests. |

**Boundary cases the assistant suggested that I kept as tests:**

Selected for the test suite; not yet run. Unless stated otherwise: now=540, blocked=False, existing=[(600, 660)].

- Touching on either side: (570, 600) and (660, 720) → True (AC4).
- Exactly 120 minutes: (720, 840) → True; 121 minutes: (720, 841) → False (AC2).
- Starts now: (540, 570) → False; starts one minute later: (541, 570) → True (AC1).
- Ends at midnight: (1380, 1440) → True; exceeds midnight: (1380, 1441) → False (AC1).
- Zero-length: (720, 720) → False; reversed: (720, 690) → False (AC1).
- Last minute of the day: (1439, 1440) → True (AC1).
- Contained request: (615, 645) → False; containing request: (570, 690) → False (AC4).
- Overlap with the last entry: (630, 690), existing=[(900, 960), (600, 660)] → False (AC4).
- Empty list: (660, 720), existing=[] → True (AC5).
- Compare an unsorted list of bookings with a copy before and after both an accepted and a rejected request; its contents and order must remain unchanged (AC5).
- Blocked room: (660, 720), blocked=True → False (AC3).
 
---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | if blocked: | AC3 | Correct. Returns False when the room is blocked. The contract guarantees blocked is Boolean. |
| 2 | if not (0 <= start < end <= 1440): | AC1 | Correct. Rejects invalid day bounds, zero-length requests and reversed intervals. Allows end = 1440. |
| 3 | if start <= now: | AC1 | Correct. Rejects starts before or exactly at now, enforcing start > now. |
| 4 | if end - start > 120: | AC2 | Correct. Rejects durations above 120 minutes and allows exactly 120 minutes. |
| 5 | if start < e and s < end: | AC4 | Correct. Both comparisons must hold for overlap. Strict comparisons allow touching endpoints on either side. |
| 6 | return True | AC5 | Correct. Reached only after all earlier checks pass and no existing booking conflicts. All rejection paths return False. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None. The function adds no booking restrictions, logging, saving or confirmation. It only reads existing and returns Boolean values.

Prediction before running: By inspection, I expect no failures for inputs covered by the contract. In particular, touching endpoints, exactly 120 minutes and end = 1440 should be allowed when all other criteria hold. This prediction has not yet been verified by execution.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | None | True | AC4 | PASS | Pending final run |
| 2 | test_overlap_is_rejected | (630, 690) | None | False | AC4 | PASS | Pending final run |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | PASS | Pending final run |
| 4 | test_exactly_120_minutes_is_allowed | (720, 840) | None | True | AC2 | PASS | Pending final run |
| 5 | test_121_minutes_is_rejected | (720, 841) | None | False | AC2 | PASS | Pending final run |
| 6 | test_start_equal_to_now_is_rejected | (540, 570) | None | False | AC1 | PASS | Pending final run |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
