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
| Coding assistant (tool) | Claude (claude.ai chat for the Week 05 plan and v1; Claude Code in VS Code for this SIS) |
| Coding assistant model | Claude Sonnet 5.5 (claude-sonnet-5-5) |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/p/72149724 |
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

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
| `if start < e and s < end:` (inside `for s, e in existing:`) → `return False` | AC4 | Yes | Strict `<` on both sides means touching endpoints do not overlap (T1), while real overlap is caught (T2, T10); the loop checks every booking. |

v1 was reused from Week 05 and is already correct on T1–T11, so the final `code/booking.py` is identical to it. The Python part needed no change.

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App component and availability logic | `src/App.tsx` | Holds the whole app: fictional sample rooms, `evaluateAvailability` (AC1–AC4 rules), and the UI components Header, VerdictCard, RoomScheduleCard and Field. |
| Shared input style | `src/index.css` | Adds one shared `.input` style for the form fields. |

**What v1 does:**

- Shows a room selector, start and end time inputs, a duration display and a Check availability button, with fictional data (Science Lab A has one booking, 10:00–11:00).
- Evaluates the request with `evaluateAvailability` and shows an Available / Unavailable verdict with reasons, without changing the bookings.
- Takes the current time from the device clock and only offers a refresh button, so 09:00 cannot be supplied (the T6 setup is impossible).
- Still lists `@supabase/supabase-js` in `package.json` although the app never uses a database.

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
| AC1 | `code/booking.py` lines 9 and 13: `0 <= start < end <= 1440`, `start <= now`; page: `evaluateAvailability` in `web/final/src/App.tsx` (line 112 onward) | T6, T7, T8, T9 | T6 Unavailable, T7 Unavailable, T8 Available, T9 Unavailable | Python: T6 False, T7 False, T8 True, T9 False. Page v1: see section 5 | Python: T6 False, T7 False, T8 True, T9 False. Page final: see section 5 |
| AC2 | `code/booking.py` line 17: `end - start > 120`; page: line 123 of `web/final/src/App.tsx` | T4, T5 | T4 Available, T5 Unavailable | Python: T4 True, T5 False. Page v1: see section 5 | Python: T4 True, T5 False. Page final: see section 5 |
| AC3 | `code/booking.py` line 5: `if blocked`; page: `room.blocked` check, line 127 of `web/final/src/App.tsx` | T3 | Unavailable | Python: False. Page v1: see section 5 | Python: False. Page final: see section 5 |
| AC4 | `code/booking.py` lines 21–22: `start < e and s < end` in a loop; page: `room.bookings.some(...)`, line 131 of `web/final/src/App.tsx` | T1, T2, T10 | T1 Available, T2 Unavailable, T10 Unavailable | Python: T1 True, T2 False, T10 False. Page v1: see section 5 | Python: T1 True, T2 False, T10 False. Page final: see section 5 |
| AC5 | `code/booking.py` only reads `existing` and returns a bool; page: `VerdictCard` in `web/final/src/App.tsx` (line 361), bookings are never written | T11 and `test_inputs_are_not_mutated_and_repeat_is_stable` | T11 Available, `existing` unchanged | Python: T11 True. Page v1: see section 5 | Python: T11 True, `existing` unchanged (unit test passes). Page final: see section 5 |
| AC6 | `web/final/src/App.tsx`: reasons list in `VerdictCard`, `grid-cols-1` layout, `Field` inputs | T7, T12 | T7 shows a reason; T12 Available at ~375 px | Page v1: see section 5 | Page final: see section 5 and `evidence/final-narrow.png` |

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
| 1 | `can_book` satisfies AC1–AC4 on every branch, touching endpoints are allowed and `existing` is never modified. | Ran the 19-test suite (all OK) and `python tests/check_sis.py` (F1–F10 and M1–M10 PASS); T1–T11 results in section 5 come from that run. | accept | AC1–AC5, T1–T11: every expected value matched. |
| 2 | `can_book` should validate the entries of `existing` and the types of its arguments, because `can_book(630, 690, 540, False, [(700, 600)])` returns True. | Ran that call myself: it does return True. The contract (section 2.4) and my assumption 1 say `existing` holds valid pairs, and `now` is assumed valid. | reject | Validating inputs the contract already guarantees adds behaviour no AC asks for. AC4 is satisfied for valid input (T1, T2, T10). |
| 3 | The page cannot express 24:00, so AC1's `end = 1440` is unreachable and T8 and T9 are Not testable there. | Read `toMinutes` in `web/final/src/App.tsx` (it rejects hours above 23) and the three `type="time"` inputs, then tried T8 and T9 on the running page. | modify | The finding is correct, but the fix would replace the time inputs (a redesign beyond the brief). I keep the inputs, mark T8 and T9 Not testable and document it in section 13. |
| 4 | When the Current time field is cleared, the page silently keeps using the previous value and shows no message, so AC6 feedback is missing. | Read `suppliedCurrentMin ?? currentMin` in `web/final/src/App.tsx`, then reproduced it in the browser: Science Lab A, 11:00–12:00, Current time emptied (`evidence/before-1.png`). | accept | AC6 requires understandable validation feedback and AC1 compares against the supplied time. Fixed in issue 3 of section 7. |
| 5 | `package.json` of v1 still declares `@supabase/supabase-js`, a database client the app never imports, which is out of scope. | `grep supabase web/original/package.json` finds it and `grep -r supabase web/original/src` finds no import; `web/final/package.json` no longer has it. | accept | The scope excludes any database or backend. |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | "Do sis-03 step by step, strictly following README.md, and fill report.md before the 23:59 deadline." |
| Model / plan | Claude Code (Sonnet 5.5) read README.md and report.md, saw that Practice #05 and #06 could be reused, and planned: restore my baseline, copy the v1s and finals, run the checker, then fill the missing sections. |
| Tool call | It listed the repository branches with git, copied `week-05/code/original/booking_v1.py` and `week-06/original/` into `sis-03/`, then ran `python tests/check_sis.py`. |
| Observation | The checker printed `pass=36 fail=17 error=2`: the Python checks were green and the report, issue log, screenshots and analysis were missing. |
| Next step | It filled sections 1, 3, 4, 6 and the reused exchanges, ran the checker again (pass=40) and listed what only I could do: run the page, take screenshots and write the reflection. |
| Human review | I read each change, ran the pages and the unit tests myself, and corrected what did not match what I saw before committing. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude Code (VS Code) | README.md, report.md, the `week-05` and `week-06` branches and the checker output | File read, edit and shell commands (git, python), each shown in the tool log and asked for permission by the harness | Observed |
| Bolt.new | The Week 06 prompt, `.bolt/prompt` and the project files it listed ("Read src/App.tsx", "actions taken", "Build passes") | Edits project files, installs packages and runs a build inside its own sandbox | Observed |
| Claude Code (VS Code) | Earlier turns of the session, kept or summarised when the conversation grows long | Cannot push or open the PR unless I allow the command | Assumed |
| Bolt.new | Its hidden system prompt and a preview server that rebuilds after each edit | Sandboxed browser runtime without access to my repository | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting any AI change I ran the checks myself: the unit suite and `check_sis.py` for the Python part, and the T1–T12 cases by hand in the browser for the page. I also diffed `web/original/` against `web/final/` and searched the final source for network calls, storage and Supabase, so nothing out of scope came in with a change that "looked fine".

**Reliability, security, responsibility:** The assistants produced working code quickly, but reliability still depended on tests: my critique showed that `can_book` returns True for a malformed booking, and only the contract makes that acceptable. Security depends on permissions and scope: an unused database client in the Bolt export was a dependency nobody asked for, and the agent could run commands or edit files only because I allowed it. Responsibility stays with me: the AI can be wrong or overconfident, so I review every change, run the tests, and I am the one who submits and defends the result.

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

- **Tool:** Claude (claude.ai chat)
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-10
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
Propose a short implementation plan for can_book. List the checks in order and identify assumptions. Use Python 3 and the supplied rules. Do not write code yet. Suggest boundary cases that could expose an incorrect implementation.
~~~~

**Response:**

~~~~text
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
~~~~

### B2

- **Tool:** Claude (claude.ai chat)
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-10
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
Implement can_book in booking.py using the supplied contract and AC1-AC5. Keep the signature. Use only the standard library. Do not modify existing. Return the function and explain each condition. Keep the feature within the stated scope.
~~~~

**Response:**

~~~~text
Only the function is kept here: it is v1 exactly as saved in code/original/booking_v1.py (my Week 05 report did not keep the assistant's per-condition explanation text).

# booking.py

def can_book(start, end, now, blocked, existing):
    # AC3: the room must not be blocked
    if blocked:
        return False

    # AC1: valid range, with start before end and both inside the day
    if not (0 <= start < end <= 1440):
        return False

    # AC1: booking must start strictly after the current time
    if start <= now:
        return False

    # AC2: maximum duration of 120 minutes
    if end - start > 120:
        return False

    # AC4: reject any overlap with an existing booking
    for s, e in existing:
        if start < e and s < end:
            return False

    # AC5: all of AC1-AC4 hold
    return True
~~~~

### B3

- **Tool:** Claude Code (VS Code extension)
- **Model:** Claude Sonnet 5.5 (claude-sonnet-5-5)
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review my function (code/original/booking_v1.py) and my page (web/original and web/final/src/App.tsx) against AC1-AC6 and the contract can_book(start, end, now, blocked, existing). Take the README rules as fixed: do not suggest a cleaning buffer, a shorter limit or a Book button. List concrete claims I can check with a case, a test or a run.
~~~~

**Response:**

~~~~text
I reviewed the code in the repository, not a description of it. Claims, each with how it can be checked:

1. can_book (booking_v1.py) satisfies AC1-AC4 on every branch: blocked first (AC3), 0 <= start < end <= 1440 and start > now (AC1), duration <= 120 (AC2), strict start < e and s < end per booking (AC4, touching allowed). It only reads `existing` (AC5). Check: run the unit suite and T1-T11.

2. can_book does not defend against inputs the contract already excludes. can_book(630, 690, 540, False, [(700, 600)]) returns True, and non-integer or out-of-range values are not rejected. Check: run that call. Recommendation: validate `existing` entries and argument types.

3. The final page cannot express 24:00. toMinutes() in web/final/src/App.tsx rejects hours above 23 and the three inputs are type="time", so AC1's end = 1440 is unreachable and T8/T9 cannot be entered. Check: try T8 and T9 on the page.

4. In the final page, emptying the Current time field is not reported. The call `evaluateAvailability(selectedRoom, startMin, endMin, suppliedCurrentMin ?? currentMin)` silently falls back to the last valid value, and the header still shows that old time. AC6 asks for understandable validation feedback. Check: choose Science Lab A, 11:00-12:00, clear Current time, press Check.

5. web/original/package.json declares @supabase/supabase-js, but nothing in src/ imports it. This is a database dependency in a page whose scope excludes databases. Check: grep the folder; compare with web/final/package.json.

Other findings: the page shows Available/Unavailable with reasons (AC5/AC6), the layout is a single column below the lg breakpoint (AC6), and no code path writes to the bookings (AC5). The page adds capacity, an Open badge and an "ended" label that no AC requests; they are harmless, I would not add more.
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
test_121_minutes_is_rejected (test_booking.TestCanBook.test_121_minutes_is_rejected) ... ok
test_blocked_room_is_rejected (test_booking.TestCanBook.test_blocked_room_is_rejected) ... ok
test_conflict_only_with_last_entry_of_unsorted_list (test_booking.TestCanBook.test_conflict_only_with_last_entry_of_unsorted_list) ... ok
test_contained_within_existing_is_rejected (test_booking.TestCanBook.test_contained_within_existing_is_rejected) ... ok
test_containing_existing_is_rejected (test_booking.TestCanBook.test_containing_existing_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.TestCanBook.test_empty_existing_is_allowed) ... ok
test_end_after_1440_is_rejected (test_booking.TestCanBook.test_end_after_1440_is_rejected) ... ok
test_end_at_1440_is_allowed (test_booking.TestCanBook.test_end_at_1440_is_allowed) ... ok
test_exactly_120_minutes_is_allowed (test_booking.TestCanBook.test_exactly_120_minutes_is_allowed) ... ok
test_existing_unchanged_after_accepted_request (test_booking.TestCanBook.test_existing_unchanged_after_accepted_request) ... ok
test_existing_unchanged_after_rejected_request (test_booking.TestCanBook.test_existing_unchanged_after_rejected_request) ... ok
test_fits_exactly_between_two_bookings (test_booking.TestCanBook.test_fits_exactly_between_two_bookings) ... ok
test_last_minute_of_day_is_allowed (test_booking.TestCanBook.test_last_minute_of_day_is_allowed) ... ok
test_overlap_is_rejected (test_booking.TestCanBook.test_overlap_is_rejected) ... ok
test_reversed_request_is_rejected (test_booking.TestCanBook.test_reversed_request_is_rejected) ... ok
test_start_equal_to_now_is_rejected (test_booking.TestCanBook.test_start_equal_to_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.TestCanBook.test_touching_end_is_allowed) ... ok
test_touching_existing_start_is_allowed (test_booking.TestCanBook.test_touching_existing_start_is_allowed) ... ok
test_zero_length_request_is_rejected (test_booking.TestCanBook.test_zero_length_request_is_rejected) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.000s

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
