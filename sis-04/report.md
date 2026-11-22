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

- **Catalog:** `src/rooms.ts` holds `ROOMS` with **5 fictional rooms**: Engineering 101 (40 seats), Science Lab A (24), Library Study Room (8), Auditorium B (120, **blocked**) and Seminar Room C-12 (16). Each room has an id, name, capacity, equipment, blocked flag and its own bookings. The equipment options are `projector`, `whiteboard`, `computers`, `microphone` and `video-conference` (`EQUIPMENT`).
- **Filter on the page:** a number input "Attendees" (F1) and one toggle chip per equipment item (F2, every selected item is required). The page calls `filterRooms(ROOMS, { attendees, equipment })` and shows the result as a visible list of room cards (name, seats, equipment, a red "Blocked" label), plus "N rooms match your requirements."
- **Empty state (F4):** when nothing matches, the room list disappears and an amber box says "No rooms match these requirements. Lower the number of attendees or clear some equipment."
- **Room change (F5):** the verdict is computed with `checkRoom(matching, selectedId, request)` for the room selected now. After "Check availability" has been pressed, picking another room immediately shows that room's result and its own bookings. Changing a time or the filter clears the old result (`resetResult()`). If a filter change removes the selected room, it is no longer selected and the verdict becomes "Select a room."
- **Responsive (AC6):** the two panels stack into one column below the `lg` breakpoint, see `narrow.png` at 390 px.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 20, equipment `projector`. "2 rooms match": Engineering 101 (40 seats, projector, whiteboard) and Auditorium B (120 seats, projector, microphone, labelled Blocked). Science Lab A (no projector), Library Study Room (8 seats) and Seminar Room C-12 (16 seats) are not shown |
| `evidence/filter-empty.png` | Attendees 50, equipment `computers`. The only room with computers has 24 seats, so nothing matches. The amber empty-state message is shown and there is no room list (F4) |
| `evidence/switch-a.png` | Current time 09:00, 10:00-11:00, Engineering 101 selected, "Check availability" pressed. The result is **Available**: its bookings are 09:00-10:00 and 12:00-13:00, and 10:00 only touches the first one (AC4) |
| `evidence/switch-b.png` | The same 09:00 / 10:00-11:00, then Science Lab A clicked. The result changes to **Unavailable**, "The interval overlaps an existing booking.", and the schedule shows its own Chemistry Lab 10:00-11:00 (F5) |
| `evidence/narrow.png` | Phone portrait, 390 px wide (780x3254 at 2x). Attendees 8 + `whiteboard` leave 4 rooms. Library Study Room, 09:00, 14:00-15:00 gives **Unavailable** because of the overlap with Book Club 14:00-15:00. One column, nothing cut off (AC6) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Data only: the `Room` / `RoomBooking` types, `ROOMS` (5 fictional rooms) and `EQUIPMENT`. No logic |
| `src/booking.ts` | The availability rules. `canBook` (AC1-AC5, unchanged behaviour, now uses its exported `MINUTES_IN_DAY` / `MAX_BOOKING_MINUTES`). `checkRoom` finds the chosen room and calls `canBook` with that room's `blocked` and `bookings` (F3, F5). `whyUnavailable` returns the reason texts for a request `checkRoom` rejected. Nothing is mutated |
| `src/filter.ts` | `filterRooms(rooms, { attendees, equipment })`: capacity >= attendees (F1) and `every` selected item present (F2). Returns a new array |
| `src/time.ts` | Formatting only: `toMinutes` ("HH:MM" to minutes), `fromMinutes`, `deviceTime` |
| `src/App.tsx` | The page: state (filter, room, times) and layout. It imports `filterRooms`, `checkRoom`, `whyUnavailable` and `ROOMS`, and holds no data or rule |
| `src/components/RoomFilter.tsx`, `RoomList.tsx` | Attendees input, equipment chips and the F4 empty state; the list of matching rooms to pick from, with the Blocked label |
| `src/components/VerdictCard.tsx`, `RoomScheduleCard.tsx`, `Header.tsx`, `Field.tsx` | Show a given verdict, the chosen room's bookings, the header and a labelled field. No rules |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms **stay in the filtered list** with a red "Blocked" label | Hide blocked rooms in `filterRooms` | A user who needs 120 seats sees that Auditorium B exists but is blocked, instead of just "no match". F3 is still guaranteed by `checkRoom` calling `canBook` (`blocked` gives false), and the tests `F3 AC3` and `INT` prove it on a blocked room that passed the filter. `filterRooms` keeps one job (F1, F2) |
| `canBook` stays a plain boolean and untouched; the reason texts are a separate `whyUnavailable()` in `booking.ts`, and the page takes the decision from `checkRoom` only | Make `canBook` return `{ ok, reasons }`, or keep `evaluateAvailability()` with its own re-checks in `App.tsx` (the starting code, risk 1) | README section 7 fixes `canBook` "unchanged from Practice #07/#08", and its 23 week-08 tests are the regression proof for AC1-AC5. Keeping the reasons in the page was exactly risk 1: two copies of AC1-AC4 that can drift. Now the page holds no rule (checker A5), and the `whyUnavailable` tests check the reasons together with `checkRoom` |
| The page calls `checkRoom(matching, ...)` on the **filtered** list, and switching rooms recomputes the verdict at once | Call `checkRoom(ROOMS, ...)` on the whole catalog, and clear the result on every room change (the old `setSubmitted(false)` pattern) | With the filtered list, a room that the filter removed can never be shown as available (tested in `INT`: room `b` gives false). Recomputing for the room selected now means no stale result from another room can stay on screen (F5, `switch-a` then `switch-b`). Time and filter edits still clear the result through one `resetResult()` (risk 5) |
| Steps 5-7 of the plan (reasons, wiring, component split) went into **one** commit | One commit each, as planned in 3.2 | Deadline pressure. The suite was run after each sub-step (43/43 and `tsc` clean each time), but the git history does not show them separately |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx` `evaluateAvailability()` lines 130-151: AC1-AC4 re-checked by hand (`startMin <= currentMin`, `endMin - startMin > MAX_BOOKING_MINUTES`, `room.blocked`, `startMin < b.end && endMin > b.start`) after `canBook` had already decided | Deleted from the page. The decision is `checkRoom` calling `canBook`; the wording is `whyUnavailable()` in `src/booking.ts` |
| `src/App.tsx` lines 74-75 `MINUTES_IN_DAY` / `MAX_BOOKING_MINUTES` declared again, while `src/booking.ts` declared them too and used the literals `1440` and `120` | Declared and exported once in `src/booking.ts`; `canBook` uses them |
| `src/App.tsx` `setSubmitted(false)` copied into five handlers (lines 226, 248, 261, 272, 311) | One `resetResult()` in `App.tsx` |
| `src/App.tsx` device time built twice by hand (lines 163-170 for the initial state, 305-309 in "use device time": `now.getHours() * 60 + ...` and the `padStart` string) | `deviceTime()` in `src/time.ts` |
| `src/App.tsx` line 282: the duration hint re-checked AC2 (`duration > MAX_BOOKING_MINUTES` showed "exceeds 120 min limit") | Removed. The 120-minute reason comes from `whyUnavailable` in `src/booking.ts` |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1: 540-570 starts exactly at now and is rejected` (+ T03-T05, X1, E01, E02) | now 540, 540-570 → `false` (start must be after now) |
| AC2 | `T06 AC2: 720-840 is exactly 120 minutes and is allowed`, `T07 AC2: 720-841 is 121 minutes and is rejected` | 720-840 → `true`; 720-841 → `false` |
| AC3 | `T13 AC3: 660-720 in a blocked room is rejected` | blocked: true, 660-720 → `false` |
| AC4 | `T01 AC4: 660-720 touches the end of 600-660 and is allowed` (+ T08-T12, T14, X2, E03, E04) | booking 600-660: 660-720 → `true`; 630-690 → `false` |
| AC5 | `AC5: checkRoom leaves the whole catalog unchanged` (+ the week-08 `AC5: an Available request leaves the bookings equal…`) | two `checkRoom` calls → catalog `toEqual` its `structuredClone` taken before |
| F1 | `F1: keeps only rooms whose capacity is at least the requested attendees` | capacities 10/20/30/5, attendees 15 → ids `['b', 'c']` |
| F2 | `F2: keeps only rooms that contain ALL selected equipment items` | projector + whiteboard → `['a', 'c']` (b has only whiteboard: excluded) |
| F3 | `F3 AC3: blocked room C with no bookings is never available` | `checkRoom(catalog, 'c', 720-780, now 540)` → `false` |
| F4 | `F4: returns an empty result when no room matches` | 1000 attendees / `laser-cutter` / 25 + computers → `[]` |
| F5 | `F5: the same 600-660 request is unavailable in room A and available in room B` | same request: room a → `false`, room b → `true`; unknown id → `false` |
| B1 | `B1 AC2: exactly 120 minutes (720-840) in room B is available` | `checkRoom(…, 'b', 720-840)` → `toBe(true)` |
| B2 | `B2 AC2: 121 minutes (720-841) in room B is rejected` | `checkRoom(…, 'b', 720-841)` → `toBe(false)` |
| B3 | `B3 AC4: 660-720 touches the 600-660 booking of room A and is available` | `checkRoom(…, 'a', 660-720)` → `toBe(true)` |
| B4 | `B4 AC4: 630-690 overlaps the 600-660 booking of room A and is rejected` | `checkRoom(…, 'a', 630-690)` → `toBe(false)` |
| B5 | `B5 F1: includes a room whose capacity exactly equals the attendees` | attendees 20, room b has 20 → b included, `['b', 'c']` |
| B6 | `B6 F1: excludes a room whose capacity is one below the attendees` | attendees 21, room b has 20 → b excluded, `['c']` |
| INT | `INT: a room returned by filterRooms can then be checked for availability with checkRoom` | 8 attendees + projector → `['a', 'c']`; `checkRoom(result, …)`: a 660-720 `true`, a 630-690 `false`, c (blocked) `false`, b (filtered out) `false` |

### 6.2 Commands

     <!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04/app
npm install
npx vitest run
npx tsc --noEmit -p tsconfig.app.json
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
 RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/sis-04/app

 ✓ src/filter.test.ts (7 tests) 4ms
 ✓ src/booking.test.ts (36 tests) 6ms

 Test Files  2 passed (2)
      Tests  43 passed (43)
   Start at  23:29:05
   Duration  416ms (transform 72ms, setup 0ms, collect 94ms, tests 10ms, environment 0ms, prepare 281ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 23/23 | 43/43 | The `Tests` line of the baseline run in 1.1 (commit f890f8e) and of the final run in 6.3, both `npx vitest run` in `sis-04/app` |
| Duplicated logic locations removed | 0 (baseline) | 5 | Counted from the rows of 5.3; each row points at lines in `git diff f890f8e -- sis-04/app/src` |
| Code structure: modules and their responsibilities | 6 files in `app/src`: `App.tsx` (data + reasons + UI, 495 lines), `booking.ts` (canBook), `booking.test.ts`, `main.tsx`, `index.css`, `vite-env.d.ts` | 15 files: `rooms.ts` (data), `booking.ts` (canBook, checkRoom, whyUnavailable), `filter.ts` (filterRooms), `time.ts`, `App.tsx` (state + layout, 173 lines), 6 components, 2 test files, `main.tsx`, `index.css`, `vite-env.d.ts` | `git ls-files sis-04/app/src` at f890f8e and at the final commit (plus `components/`), read against 5.1; `wc -l` of `App.tsx` at both commits |
| Remaining limitation | Rules duplicated across `App.tsx` and `booking.ts` | `rejectionReasons()` in `booking.ts` still restates the AC1-AC4 conditions to word them, so a change to `canBook` (e.g. the 120 limit) must be repeated there; only the 5 `whyUnavailable` tests tie them together. F4 and F5 on the rendered page are shown by screenshots only, there is no `render` test | The refactoring review in 8.3 (point 4) and reading `src/booking.ts` lines 42-56; `grep -c render src/*.test.ts` gives 0 |

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

**Problems found:** The line numbers were slightly off: it says L128-153 and L271, but the duplicated block is lines 130-151 and the fourth `setSubmitted(false)` is at line 272. In step 3 it asked for one test that loops over "every existing case", which is the table-driven style README §9 forbids. Its step 7 (time state) is outside F1-F5.
**Changes made:** It was right about "~495 lines": `wc -l` gives 495, so my own map (section 2.1, kept as sent) undercounted. I checked every risk with `grep -n` in `App.tsx` and `booking.ts` and wrote the confirmed ones in 3.1 with my own line numbers. I took its order for 3.2 but put `checkRoom` and `filterRooms` (tests first) before the reasons move. I changed step 3 to separate named tests and dropped step 7 (see 3.3).
**Verified by:** `grep -n` over `src/App.tsx` and `src/booking.ts` (lines 23-25, 74-75, 130-151, 226/248/261/272/311 confirmed), and `python tests/check_sis.py` L3/L4 PASS

### 8.2 Exchange 2

**Tool and model:** Claude Code (VS Code extension), a fresh agent with no history, Claude Opus 5.5 (claude-opus-5-5)
**Date:** 2026-11-22
**Purpose:** tests (Task 4), step 4 of the plan: a draft of `filter.test.ts` for `filterRooms` (F1, F2, F4, B5, B6, INT), written before `src/filter.ts` existed

**Prompt:**

```text
Write a Vitest test file src/filter.test.ts (TypeScript) for a function that does not exist yet:
export function filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[]
in src/filter.ts. Room = { id, name, capacity, equipment: string[], blocked, bookings: {start,end}[] }.
Rules: F1 capacity must be >= requested attendees. F2 the room must contain ALL selected equipment items. F4 when no room matches the result is empty (the page shows an empty state).
Also checkRoom(rooms, roomId, { start, end, now }): boolean exists in src/booking.ts (true = available).
Required tests, the ID must appear as a word in the test title: F1, F2, F4, B5 (capacity exactly equal to attendees -> included), B6 (capacity one below attendees -> excluded), INT (filterRooms then checkRoom on a room it returned).
Rules: import from 'vitest', './filter' and './booking'; no mocks; no .skip/.only/.todo/test.each; a fixed catalog inside the test file; expected values from the rules, not from running code.
Do not create or edit any files. Reply with only the file content in one code block.
```

**Output used:**

```text
const CATALOG: TestRoom[] = [
  { id: 'a', name: 'Room A', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, […] },
  { id: 'b', name: 'Room B', capacity: 20, equipment: ['whiteboard'], […] },
  { id: 'c', name: 'Room C', capacity: 30, equipment: ['projector', 'whiteboard', 'microphone'], blocked: true, […] },
  { id: 'd', name: 'Room D', capacity: 5, equipment: ['computers'], […] },
];
[…]
  it('F1: keeps only rooms whose capacity is at least the requested attendees', () => {
    const result = filterRooms(CATALOG, { attendees: 15, equipment: [] });
    expect(ids(result)).toEqual(['b', 'c']);
  });
  it('F2: keeps only rooms that contain ALL selected equipment items', () => {
    const result = filterRooms(CATALOG, { attendees: 1, equipment: ['projector', 'whiteboard'] });
    // b has whiteboard but no projector, d has neither -> both excluded
    expect(ids(result)).toEqual(['a', 'c']);
  });
[…]
  it('INT: a room returned by filterRooms can then be checked for availability with checkRoom', () => {
    const result = filterRooms(CATALOG, { attendees: 8, equipment: ['projector'] });
    expect(ids(result)).toEqual(['a', 'c']);
    const roomA = result.find((r) => r.id === 'a');
    expect(roomA).toBeDefined();
    expect(checkRoom(CATALOG, roomA!.id, { start: 660, end: 720, now: 540 })).toBe(true);
[…]
```

**Problems found:** The INT test called `checkRoom(CATALOG, …)` on the whole catalog, not on the list that `filterRooms` returned, so it never proved that the two work together: a room that was filtered out could still be "available". The catalog was one shared `const`, so a `filterRooms` that sorted or mutated it would leak into later tests, and no test checked that the input stays unchanged.
**Changes made:** I worked out every expected id list by hand from F1/F2 before running anything (15 attendees → b(20), c(30); projector+whiteboard → a, c; 20 → b, c; 21 → c). INT now calls `checkRoom(result, …)` and adds a case for the filtered-out room `b` → false. The catalog became a `catalog()` function, and I added the `F1 F2: filterRooms leaves the catalog and the criteria unchanged` test. B5/B6 titles also carry F1.
**Verified by:** `npx vitest run` before `src/filter.ts` existed: "Cannot find module './filter'", `Test Files 1 failed | 1 passed (2)`; after adding it: `Tests 38 passed (38)`, and `npx tsc --noEmit -p tsconfig.app.json` clean

### 8.3 Exchange 3

**Tool and model:** Claude Code (VS Code extension), a fresh agent with no history, Claude Opus 5.5 (claude-opus-5-5)
**Date:** 2026-11-22
**Purpose:** refactoring (Task 3): a read-only review of the whole refactoring against the baseline commit, looking for changed AC behaviour and rules left in the UI

**Prompt:**

```text
Review a refactoring, read only (do not edit any file). Repository: C:\Users\LOQ\Desktop\SWE\se-practice, folder sis-04/app/src. Compare the baseline with the working tree: run `git -C C:\Users\LOQ\Desktop\SWE\se-practice diff f890f8e -- sis-04/app/src` and read the current files.
The refactoring moved room data to rooms.ts, added filterRooms (filter.ts), checkRoom and whyUnavailable (booking.ts), and split App.tsx into components.
Rules that must not change: AC1 reject start >= end and requests in the past; AC2 max 120 minutes; AC3 reject a blocked room; AC4 reject overlaps, allow touching endpoints; AC5 no data mutation. New: F1 capacity >= attendees; F2 ALL selected equipment; F3 blocked never available; F4 empty state; F5 switching room refreshes the result.
Answer concisely (under 350 words): 1) did canBook's behaviour change? 2) does the UI still hold any rule of its own or any duplicated logic? 3) any behaviour difference between the old evaluateAvailability() and the new checkRoom + whyUnavailable path, with file:line; 4) one concrete remaining risk.
```

**Output used:**

```text
**1) Did canBook's behaviour change?** No. The checks in `booking.ts:15-24` are the same as in the
baseline, in the same order. The literal values 1440 and 120 became the constants `MINUTES_IN_DAY`
and `MAX_BOOKING_MINUTES`, with the same values. […]
**2) Does the UI hold its own rules or duplicated logic?** None that affects the decision.
`App.tsx:45` decides only through `checkRoom`, and the filter is `filterRooms`. […]
The real duplication moved into `booking.ts`. `rejectionReasons` (`booking.ts:42-56`) re-implements
every condition in `canBook`. It only words the rejection and does not decide anything. […]
- **canBook says no but no reason is found:** the old code fell through and returned *available*,
  which was a latent bug. The new code returns "Unavailable." (`booking.ts:70`), which is safer.
- **Selected room hidden by the filter:** the verdict becomes "Select a room.", but `roomId` is
  still stored. If the filter is loosened, the room comes back already selected (`App.tsx:34`). […]
**4) One remaining risk:** the rules now live in two places, `canBook` and `rejectionReasons`, in
`booking.ts`. If someone changes one, for example AC4 to reject touching endpoints or AC2's limit,
without the other, the page will show wrong or missing reasons. […] A smaller point:
`components/RoomList.tsx` is untracked, so committing without it breaks the build.
```

**Problems found:** Nothing it said was wrong when I checked it, but it reads more into "duplication" than the checker does. `rejectionReasons` does restate the conditions, but it never decides, so the duplication is a wording risk, not a behaviour risk. Its point that a hidden room "comes back already selected" is real behaviour that I had not planned; I kept it on purpose (the user's choice comes back when the filter allows it). It found no AC change, which matches the 23 week-08 tests still passing.
**Changes made:** I recorded its point 4 as the remaining limitation in section 7 instead of claiming the duplication is fully gone, and kept 5.3 to the five locations I can point at in the diff. I made sure `components/RoomList.tsx` is in the next commit.
**Verified by:** `git diff f890f8e -- sis-04/app/src/booking.ts` (canBook: only the constants and the parameter type changed); `npx vitest run`: 43 passed (43), the 23 week-08 tests among them; `python tests/check_sis.py` A5 and A6 PASS

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
