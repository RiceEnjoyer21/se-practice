# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude Code (VS Code extension) |
| Coding assistant model | claude-sonnet-5-5 |
| Bolt.new model | (write here) |
| Bolt project link | (write here) |
| Language | Python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | (write here) |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** One page for one selected room that only checks whether a chosen start and end time can be booked and shows Available or Unavailable. It uses fictional data, does not create or confirm bookings, and has no login, database, backend or payments. The same rules are also written as a Python function `can_book`.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Times are whole minutes from midnight. Start must be before end, both inside the day (0 to 1440), and start must be later than the current time, not equal to it. |
| AC2 | A booking can last at most 120 minutes. Exactly 120 is fine, 121 is not. |
| AC3 | If the room is blocked, every request is rejected, whatever the time. |
| AC4 | The request must not overlap any existing booking. If one ends exactly when another begins, that is not an overlap. |
| AC5 | The result is clearly Available or Unavailable, and checking never changes the list of existing bookings. |
| AC6 | Wrong input gives a clear message, and the page is comfortable to use on a narrow phone screen. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Intervals that touch at an endpoint (660–720 next to 600–660) are wrongly treated as overlapping because `<=` is used instead of `<` | AC4 | Case T1 by hand and in a test; expected Available |
| 2 | A request starting exactly at `now` (540–570 when now is 540) is accepted because `>=` is used instead of `>` | AC1 | Case T6 by hand and in a test; expected Unavailable |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Requested start time | int, minutes after midnight, 0 to 1439 |
| `end` | Requested end time, excluded from the interval | int, minutes after midnight, 1 to 1440 |
| `now` | Current time | int, 0 to 1439, assumed valid |
| `blocked` | Whether the selected room is blocked | bool |
| `existing` | Bookings already in the room | collection of `(start, end)` int pairs, must not be changed |
| returns | Whether the request is allowed | bool: `True` only if AC1–AC4 all hold |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The `existing` bookings are themselves valid and do not overlap each other.
2. Only one day is considered, so there is no date and no booking across midnight.

**Checked manually:**

- 660–720 with existing 600–660 should be Available because the intervals only touch.
- 630–690 with existing 600–660 overlaps (630 < 660), so Unavailable.
- 540–570 with now = 540 starts now, so Unavailable.
- 720–840 is 120 minutes, Available; 720–841 is 121 minutes, Unavailable.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if blocked:` → `return False` | AC3 | Yes | A blocked room rejects every request before any other check. |
| `if not (0 <= start < end <= 1440):` → `return False` | AC1 | Yes | Enforces start ≥ 0, start < end (rejects reversed and zero-length) and end ≤ 1440 (T8 allowed, T9 rejected). |
| `if start <= now:` → `return False` | AC1 | Yes | Start must be strictly after now, so start == now is rejected (T6). |
| `if end - start > 120:` → `return False` | AC2 | Yes | Rejects only above 120, so exactly 120 is allowed (T4) and 121 is not (T5). |
| `if start < booked_end and booked_start < end:` → `return False` | AC4 | Yes | Strict `<` on both sides means touching endpoints do not overlap (T1), while real overlap is caught (T2, T10); checked for every booking in the loop. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
(paste here)
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

**What v1 does:**

- (write here)

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | | |
| T2 | Overlap | 630–690 | Unavailable | False | False | | |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | | |
| T4 | Exactly 120 min | 720–840 | Available | True | True | | |
| T5 | 121 min | 720–841 | Unavailable | False | False | | |
| T6 | Starts now | 540–570 | Unavailable | False | False | | |
| T7 | Reversed | 720–660 | Unavailable | False | False | | |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | | |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | | |
| T11 | Same check twice | 660–720, twice | Available | True | True | | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py` lines 9–12: `0 <= start < end <= 1440` and `start <= now`; page: not built yet | T6, T7, T8, T9 | T6 False, T7 False, T8 True, T9 False | T6 False, T7 False, T8 True, T9 False | T6 False, T7 False, T8 True, T9 False |
| AC2 | `code/booking.py` lines 13–14: `end - start > 120` | T4, T5 | T4 True, T5 False | T4 True, T5 False | T4 True, T5 False |
| AC3 | `code/booking.py` lines 7–8: `if blocked` | T3 | False | False | False |
| AC4 | `code/booking.py` lines 15–17: `start < booked_end and booked_start < end` in a loop over `existing` | T1, T2, T10 | T1 True, T2 False, T10 False | T1 True, T2 False, T10 False | T1 True, T2 False, T10 False |
| AC5 | `code/booking.py` returns a bool and only reads `existing`; page: not built yet | T11 and `test_inputs_are_not_mutated_and_repeat_is_stable` | T11 True, `existing` unchanged | T11 True | T11 True, unchanged (unit test passes) |
| AC6 | Bolt page: not built yet | T12 | Available at ~375 px | not tested | not tested |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) |
| 3 | (write here) | (write here) | (write here) | (write here) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | (write here) |
| Model / plan | (write here) |
| Tool call | (write here) |
| Observation | (write here) |
| Next step | (write here) |
| Human review | (write here) |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** (write here)

**Reliability, security, responsibility:** (write here)

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B2

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B3

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_121_minutes_is_rejected (test_booking.BookingTests.test_121_minutes_is_rejected) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_containing_existing_booking_is_rejected (test_booking.BookingTests.test_containing_existing_booking_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_ending_after_midnight_is_rejected (test_booking.BookingTests.test_ending_after_midnight_is_rejected) ... ok
test_ending_at_midnight_is_allowed (test_booking.BookingTests.test_ending_at_midnight_is_allowed) ... ok
test_equal_start_and_end_are_rejected (test_booking.BookingTests.test_equal_start_and_end_are_rejected) ... ok
test_exactly_120_minutes_is_allowed (test_booking.BookingTests.test_exactly_120_minutes_is_allowed) ... ok
test_gap_between_bookings_is_allowed (test_booking.BookingTests.test_gap_between_bookings_is_allowed) ... ok
test_identical_to_existing_booking_is_rejected (test_booking.BookingTests.test_identical_to_existing_booking_is_rejected) ... ok
test_inputs_are_not_mutated_and_repeat_is_stable (test_booking.BookingTests.test_inputs_are_not_mutated_and_repeat_is_stable) ... ok
test_inside_existing_booking_is_rejected (test_booking.BookingTests.test_inside_existing_booking_is_rejected) ... ok
test_negative_start_is_rejected (test_booking.BookingTests.test_negative_start_is_rejected) ... ok
test_overlap_in_unsorted_list_is_rejected (test_booking.BookingTests.test_overlap_in_unsorted_list_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_over_the_start_is_rejected (test_booking.BookingTests.test_overlap_over_the_start_is_rejected) ... ok
test_results_are_real_booleans (test_booking.BookingTests.test_results_are_real_booleans) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_second_booking_overlap_is_rejected (test_booking.BookingTests.test_second_booking_overlap_is_rejected) ... ok
test_start_before_now_is_rejected (test_booking.BookingTests.test_start_before_now_is_rejected) ... ok
test_start_equal_to_now_is_rejected (test_booking.BookingTests.test_start_equal_to_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_unsorted_inputs_are_not_reordered (test_booking.BookingTests.test_unsorted_inputs_are_not_reordered) ... ok

----------------------------------------------------------------------
Ran 24 tests in 0.001s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
