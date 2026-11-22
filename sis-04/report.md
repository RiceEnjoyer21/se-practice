# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude Code (VS Code extension) |
| Assistant model | Claude Opus 5.5 (claude-opus-5-5) |
| Starting point | week-08 |
| Baseline commit | f890f8e |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | my laptop, Windows 11, Node v22.14.0, npm 11.6.2, from `sis-04/app` |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

`cd sis-04/app && npm install && npx vitest run`, on the week-08 code exactly as it was brought in:

```text
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/sis-04/app

 ✓ src/booking.test.ts (23 tests) 4ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  23:15:06
   Duration  769ms (transform 33ms, setup 0ms, collect 35ms, tests 4ms, environment 0ms, prepare 551ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app
├── src/App.tsx          the whole page (~470 lines): SAMPLE_ROOMS (4 rooms, no equipment), Room/Booking
│                        types, toMinutes/fromMinutes, evaluateAvailability() which calls canBook and then
│                        re-checks AC1-AC4 itself to build reasons, App() with the form, and components
│                        Header, Field, VerdictCard, RoomScheduleCard
├── src/booking.ts       canBook({ start, end, now, blocked, bookings }): boolean, the AC1-AC5 rule
├── src/booking.test.ts  23 Vitest tests for canBook (T01-T14, AC5, X1-X2, E01-E04, BUG-A, BUG-B)
├── src/main.tsx         mounts App
├── src/index.css        Tailwind + .input class
└── package.json         vite, react 18, vitest 3.2.4, tailwind, lucide-react
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

Sent as the first message to a fresh Claude Code agent (a new context with no history of this work):

```text
I am extending a small React + TypeScript + Vite app (Smart Campus Room Availability Checker). Fictional data only. Constraints: no login, no payments, no live APIs, no database, no network calls, no browser storage. Please read the code at C:\Users\LOQ\Desktop\SWE\se-practice\sis-04\app (read only, do not edit anything).

Repository map (sis-04/app):
- src/App.tsx — the whole page (~470 lines): SAMPLE_ROOMS (4 rooms, no equipment), Room/Booking types, toMinutes/fromMinutes, evaluateAvailability() which calls canBook and then re-checks AC1-AC4 itself to build reasons, App() with the form, and components Header, Field, VerdictCard, RoomScheduleCard
- src/booking.ts — canBook({ start, end, now, blocked, bookings }): boolean, the AC1-AC5 rule (times in minutes after midnight)
- src/booking.test.ts — 23 Vitest tests for canBook (T01-T14, AC5, X1-X2, E01-E04, BUG-A, BUG-B)
- src/main.tsx — mounts App; src/index.css — Tailwind + .input class
- package.json — vite, react 18, vitest 3.2.4, tailwind, lucide-react

Acceptance criteria that must be preserved:
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New feature (room selection): a catalog of at least four fictional rooms, each with id, name, capacity, equipment list, blocked status and its own bookings. Show only rooms that satisfy the user's requirements. The availability check must use the chosen room's bookings, not another room's.
F1 Capacity filter: room capacity >= requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

Target layout (fixed): src/rooms.ts (Room type + ROOMS), src/filter.ts (filterRooms(rooms, { attendees, equipment })), src/booking.ts (canBook unchanged + checkRoom(rooms, roomId, { start, end, now }) which calls canBook with that room's blocked and bookings), App.tsx and components with no rules of their own. 10+ Vitest tests.

Task: list the maintainability risks you see in the current code, each with a file and function reference and the evidence (line or code snippet), with a priority (High/Medium/Low). Then propose a prioritised plan of small, safe steps (smallest first), where the tests are run after every step. I want a plan, not a full rewrite. Do not write any code yet.

Reply with the risk table and the numbered plan only, concise (under 600 words).
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The AC1-AC4 rules exist twice. The page re-checks them by hand to build the reasons, so they can drift away from `canBook`, and the page could then show a reason list that disagrees with the decision | `src/App.tsx`, `evaluateAvailability()` | App.tsx lines 130-151 repeat `startMin <= currentMin`, `endMin - startMin > MAX_BOOKING_MINUTES`, `room.blocked` and `startMin < b.end && endMin > b.start`, which are the same conditions as booking.ts lines 23-28. Line 156 returns `available` when the list is empty, even if `canBook` said false | High |
| 2 | Room data lives inside the UI and has no equipment, so F1/F2 cannot be added or tested without editing the page, and tests cannot use a catalog | `src/App.tsx`, `SAMPLE_ROOMS`, `type Room` | App.tsx lines 20-72: `SAMPLE_ROOMS` with 4 rooms, `capacity` but no `equipment`; `useState<Room[]>(SAMPLE_ROOMS)` at line 162 has no setter, so it is constant data stored as state | High |
| 3 | The availability check has no room-level function: the page passes `room.blocked` and `room.bookings` itself, and nothing tests that the chosen room's data is used (F3, F5) | `src/App.tsx`, `evaluateAvailability()`; `src/booking.ts` | App.tsx lines 114-121 build the `canBook` argument from `room`; `booking.test.ts` only calls `canBook` with hand-made arrays, so a wrong-room bug would pass all 23 tests | High |
| 4 | The limits 1440 and 120 are declared in three places, and the declared constants are not even used by the rule | `src/booking.ts`, `canBook()`; `src/App.tsx` | booking.ts lines 11-12 declare `MINUTES_IN_DAY`/`MAX_BOOKING_MINUTES`, but lines 23 and 25 use the literals `1440` and `120`; App.tsx lines 74-75 declare both again | Medium |
| 5 | Resetting the old result on every input change is copied by hand, so a new filter input could easily forget it and leave a stale verdict for the wrong room (F5) | `src/App.tsx`, `App()` form handlers | `setSubmitted(false)` repeated at lines 226, 248, 261, 272 and 311 | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. `src/booking.ts`: make `canBook` use its own `MINUTES_IN_DAY` / `MAX_BOOKING_MINUTES` constants and export them, fix the misleading comment. The logic does not change; the 23 tests must stay green (risk 4).
2. `src/rooms.ts`: move the `Room` type and the rooms out of `App.tsx` into `ROOMS`, give every room an `equipment` list, and grow the catalog to 5 fictional rooms (one blocked). `App.tsx` imports it. Run the tests (risk 2).
3. `checkRoom(rooms, roomId, { start, end, now })` in `src/booking.ts`: first write tests F3, F5, B1-B4 and an unknown-id test in `booking.test.ts` and see them fail, then add `checkRoom`, which calls `canBook` with the chosen room's `blocked` and `bookings` (risk 3).
4. `filterRooms(rooms, { attendees, equipment })` in `src/filter.ts`: first write `filter.test.ts` with F1, F2, F4, B5, B6 and INT and see them fail, then add the function (capacity >= attendees, `every` selected item).
5. One source of reasons: move the explanation into `src/booking.ts` as `rejectionReasons()`, delete the duplicated block from `evaluateAvailability()` in `App.tsx`, and test that the reasons are empty exactly when `checkRoom` says Available (risk 1).
6. Wire the page: an attendees input, equipment checkboxes, the room list from `filterRooms`, an empty state (F4), the verdict from `checkRoom`, and one `resetResult()` helper instead of five `setSubmitted(false)` copies; clear the selection when the chosen room is filtered out (F5, risk 5). Check at desktop and 375 px width (AC6), take the screenshots.
7. Split the page components (`VerdictCard`, `RoomScheduleCard`, `Header`, `Field`, the new `RoomFilter`) into `src/components/`, keep no rule in them, draw `before.puml` / `after.puml`. Run the tests after the move.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Step 3 of its plan: "add `rejectionReasons(req)` to booking.ts. Add a test that `canBook(x) === (rejectionReasons(x).length === 0)` for every existing case", which meant one loop over all existing cases | Modified | I kept `rejectionReasons` in `src/booking.ts`, but the equivalence check is written as separate, named tests, not one loop: README §9 forbids `test.each` and table-driven tests (checker S2), and each case needs its own ID in its title. I also kept the `canBook` body unchanged instead of rebuilding it on top of `rejectionReasons`: README §7 says `canBook` stays "unchanged from Practice #07/#08", and its 23 tests (T01-T14, AC5 …) are the regression proof for AC1-AC5. I rejected its step 7 (merge the two time states) for this SIS: it is outside F1-F5, and it would change how the page reads "now" while I am already changing the room logic. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Claude Code (VS Code extension), a fresh agent with no history, Claude Opus 5.5 (claude-opus-5-5)
**Date:** 2026-11-22
**Purpose:** codebase analysis (Task 1) and the improvement plan: maintainability risks with file/function references, and a plan of small steps, no code

**Prompt:**

```text
The whole context message from section 2.2, sent unchanged: the repository map, AC1-AC6, F1-F5,
the constraints (no login, payments, live APIs, database; fictional data only), the fixed target
layout, and "list the maintainability risks ... Then propose a prioritised plan of small, safe steps
(smallest first) ... I want a plan, not a full rewrite. Do not write any code yet. Reply with the
risk table and the numbered plan only, concise (under 600 words)."
```

**Output used:**

```text
| R1 | High | App.tsx `evaluateAvailability` | L128-153 repeat AC1-AC4 (`startMin <= currentMin`,
`endMin - startMin > MAX_BOOKING_MINUTES`, `room.blocked`, `room.bookings.some(...)`). L156:
`reasons.length === 0 ? { kind: 'available' }` | The rules exist in two places and can drift apart.
If they disagree, L156 reports Available even though `canBook` returned false. |
| R2 | High | App.tsx `SAMPLE_ROOMS`, `App` | L29-72: the room data has no `equipment`. L162:
`useState<Room[]>(SAMPLE_ROOMS)` has no setter. L231-236 lists every room, blocked ones included |
The data sits inside the UI, so F1/F2 cannot be added or tested without editing App. |
| R3 | Medium | booking.ts `canBook` | L23 `end <= 1440`, L25 `> 120`, while L11-12 declare
`MINUTES_IN_DAY` and `MAX_BOOKING_MINUTES` and never use them. App.tsx L74-75 declares them again. […]
[…]
| R6 | Medium | App.tsx form handlers | `setSubmitted(false)` is repeated by hand at L226, L248, L261,
L271 and L311 | New filter inputs could easily forget it, which would leave a stale verdict (risk to F5). |
[…]
1. **booking.ts tidy-up (R3, R4, R8):** use and export `MINUTES_IN_DAY` and `MAX_BOOKING_MINUTES`, […]
2. **Extract data (R2):** create `src/rooms.ts` with the `Booking`/`Room` types and `ROOMS`. Keep the
   same 4 rooms and add an `equipment: string[]` to each, […]
3. **One source of reasons (R1):** add `rejectionReasons(req)` to booking.ts. Add a test that
   `canBook(x) === (rejectionReasons(x).length === 0)` for every existing case. […]
4. **`checkRoom(rooms, roomId, {start, end, now})` in booking.ts:** it calls `canBook` with that room's
   `blocked` and `bookings`, and an unknown id returns Unavailable. […]
5. **`src/filter.ts` `filterRooms`, plus tests:** […]
6. **Wire App:** […] replace the copied `setSubmitted(false)` calls with one `resetResult()` helper (R6)
7. **Time state (R5):** keep one `currentTime` string, derive the minutes from it, […]
```

**Problems found:** The line numbers were slightly off: it says L128-153 and L271, but the duplicated block is lines 130-151 and the fourth `setSubmitted(false)` is at line 272. It also says the file has "~495 lines" while my map said about 470. In step 3 it asked for one test that loops over "every existing case", which is the table-driven style README §9 forbids. Its step 7 (time state) is outside F1-F5.
**Changes made:** I checked every risk with `grep -n` in `App.tsx` and `booking.ts` and wrote the confirmed ones in 3.1 with my own line numbers. I took its order for 3.2 but put `checkRoom` and `filterRooms` (tests first) before the reasons move. I changed step 3 to separate named tests and dropped step 7 (see 3.3).
**Verified by:** `grep -n` over `src/App.tsx` and `src/booking.ts` (lines 23-25, 74-75, 130-151, 226/248/261/272/311 confirmed), and `python tests/check_sis.py` L3/L4 PASS

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
