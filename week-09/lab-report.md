# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Abylaikhan
**Student ID:** 23B031400
**GitHub:** RiceEnjoyer21

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude (claude.ai web chat) |
| Exact model (or "not displayed") | Claude Sonnet 5.5 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.13.2 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether the room can be booked for one requested time slot today and answers Available or Unavailable. Every time is a whole number of minutes since midnight, from 0 to 1440 (10:00 = 600, 16:30 = 990, 24:00 = 1440). This tool only checks: it does not save, create or change any booking. A slot is available when 0 <= start < end <= 1440, start is after now, it lasts at most 120 minutes, the room is not blocked, and it does not overlap an existing booking (touching ends are fine). If the user does not give the current time, the start and end, whether the room is blocked, or the existing bookings, ask for them instead of guessing.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start, in whole minutes since midnight (10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end, in whole minutes since midnight (11:00 = 660, 24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "The current time, in whole minutes since midnight (9:00 = 540)."
      },
      "blocked": {
        "type": "boolean",
        "description": "true if the room is blocked (for example for maintenance), otherwise false."
      },
      "bookings": {
        "type": "array",
        "description": "The bookings that already exist for the room today, each as an object with start and end in minutes since midnight. Use an empty list [] if there are none.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Start of an existing booking, in minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "End of an existing booking, in minutes since midnight."
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| `start`, `end`, `now` | `"type": "integer"` | A model can send `"end": "11:00"` (S03) or a fraction like `600.5` (S10); `canBook` compares numbers, so a string or a half-minute would reach it and give a wrong or crashing comparison. |
| `start`, `end`, `now` | `"minimum": 0` | A time before midnight such as `"start": -30` (S06) would be accepted; there is no such minute in the day. |
| `start`, `end`, `now` | `"maximum": 1440` | A time after 24:00 such as `"end": 1500` (S07) would be accepted; 1440 itself stays valid as `end` = 24:00 (S11). |
| `blocked` | `"type": "boolean"` | `"blocked": "false"` (S09) is a non-empty string, and in JavaScript it is truthy, so a free room would look blocked. |
| `bookings` | `"type": "array"` | A single object or a string in place of the list would reach the overlap loop, which iterates over it. No `minItems`: an empty list is a valid call (S02). |
| `bookings.items` | `"type": "object"` with `properties` `start`/`end` | A booking as a pair `[660, 720]` (S12) would be accepted, and `booking.start` would be `undefined`, so the overlap check would silently pass. |
| `bookings.items` | `"required": ["start", "end"]` | `{ "start": 660 }` (S08) would be accepted; with no `end` the overlap comparison is against `undefined` and the booking is ignored. |
| `bookings.items.start`, `.end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Same reasons as for the request times: an existing booking at `"11:00"` or at minute 1500 is not a booking `canBook` can compare. |
| `bookings.items` | `"additionalProperties": false` | A model could add `"room"` or `"title"` to a booking and think it matters; the function ignores it. |
| top level | `"required"` with all five fields | `now` missing (S04) would be accepted, and `canBook` would compare `start` with `undefined`; the model must ask rather than leave a field out. |
| top level | `"additionalProperties": false` | An invented field such as `"room": "204"` (S05) would be accepted and silently ignored, so the caller would believe it checked room 204. |
| `description` (tool) | unit, range 0–1440, "does not save", the six rules, "ask instead of guessing" | Without the unit a model sends `"10:00"` or hours; without "does not save" an agent may think a check is a booking; without "ask" it invents `now` or `bookings` (R3). |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | nothing — passed on the first run of my definition |
| S02 | PASS | PASS | nothing — passed on the first run of my definition |
| S03 | PASS | PASS | nothing — passed on the first run of my definition |
| S04 | PASS | PASS | nothing — passed on the first run of my definition |
| S05 | PASS | PASS | nothing — passed on the first run of my definition |
| S06 | PASS | PASS | nothing — passed on the first run of my definition |
| S07 | PASS | PASS | nothing — passed on the first run of my definition |
| S08 | PASS | PASS | nothing — passed on the first run of my definition |
| S09 | PASS | PASS | nothing — passed on the first run of my definition |
| S10 | PASS | PASS | nothing — passed on the first run of my definition |
| S11 | PASS | PASS | nothing — passed on the first run of my definition |
| S12 | PASS | PASS | nothing — passed on the first run of my definition |

Note: the very first run on the **fresh, empty template** (before I wrote any property) had
S01, S02 and S11 PASS and S03–S10 and S12 FAIL (9 FAIL), because an empty schema accepts every call.
The "First run" column above is the first run of **my definition**, which already had integer types,
the 0–1440 range, `additionalProperties: false` at both levels and `required` inside `items`,
so no S case changed between the first and the final run.

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Match: yes, F1–F3 PASS. The model converted all four times correctly: now 9:00 = 540, start 10:00 = 600,
end 11:00 = 660, and the booking 11:00–12:00 = `{"start": 660, "end": 720}`. "It isn't blocked" became
`false`. The reply was exactly one JSON object with no prose and no code fence, as the prompt asked.
The requested slot 600–660 only touches the booking at 660, so `canBook` will answer Available (AC4,
touching allowed). That decision is not in the call: the model did not answer "free" itself, it only
passed the facts to the tool.

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Match: yes, F4–F6 PASS. 13:30 = 810, 14:00 = 840, 16:30 = 990 (not 960, so it did not read 16:30 as
16:00), "blocked for maintenance" = `true`, "no other bookings" = `[]`. The model **did not refuse to
call**, although the request breaks two rules: the room is blocked (AC3) and 840–990 is 150 minutes,
more than 120 (AC2). It also did not "fix" the request by cutting the end to 960 to fit the limit.
That is the right split: the schema accepts the call because every value is a valid integer or
boolean, and only `canBook` decides Unavailable. One caveat about my own definition: its description
gives `16:30 = 990` as an example, so the correct conversion of 16:30 was partly handed to the model by
the description; this run does not prove it would convert an unseen time like 16:45 as reliably.

### R3

```text
The checker only covers today's bookings, so it can't check tomorrow. Is today OK, and if so, what are the exact start and end times, the current time, whether the room is blocked, and which bookings already exist?
```

The model **asked** (saved as `calls/r3.txt`), it did not call, so it invented no values. R3 leaves out
almost everything the schema requires: `now` (no current time), exact `start` and `end` ("afternoon"
is a range of hours, "a couple of hours" is roughly but not exactly 120 minutes), `blocked` and
`bookings` (not mentioned at all). It also contains a fact the tool cannot represent: **"tomorrow"**.
There is no date field, and my description says the tool checks a slot "today", so the model noticed
that a call would silently answer for the wrong day; it said so instead of mapping "afternoon" to,
say, start = 780 and end = 900 for today. A tempting invented call would have been `now = 0` or the
real clock time, `blocked = false` and `bookings = []`, all of which pass the schema. Two small
deviations: the prompt asked for "one short question", and the reply is one sentence of explanation
plus a question that bundles five missing items; and it is not JSON, which is correct here, since the
prompt allows a question when arguments are missing.

## 5. What the schema cannot check

Every allowed keyword looks at **one value at a time** and compares it with a constant. None of them
compares two fields, does arithmetic, or looks at what the function does. So:

- **AC1, partly.** The schema *can* enforce that each of `start`, `end`, `now` is a whole number and
  that `0 ≤ value ≤ 1440` (`type: integer`, `minimum: 0`, `maximum: 1440`). It *cannot* enforce
  `start < end` or "start after `now`", because both are relations between two fields. S01 with
  `"start": 600, "end": 600` would pass my schema; so would `"now": 700` with `"start": 600`.
- **AC2** (at most 120 minutes) is `end − start ≤ 120`, arithmetic on two fields. R2 asks for
  840–990 = 150 minutes and passed F5 against my schema; only `canBook` turns it into Unavailable.
- **AC3** (not when blocked). The schema only checks that `blocked` is a boolean. `"enum": [false]`
  would technically refuse `blocked: true`, but then R2 — a call that *should* be made — would be
  refused by the client instead of answered Unavailable by the function, and the user would get a
  validation error instead of a reason. Deciding Unavailable is the function's job.
- **AC4** (no overlap, touching allowed) compares the request with every item of `bookings`
  (`start < b.end && b.start < end`). `items` validates each booking alone, never against `start`/`end`.
  It cannot even check that a booking itself has `start < end`.
- **AC5** (does not change or save anything) is about behaviour, not input. A schema describes
  what goes in; it cannot see whether the code pushes into `bookings` (Week 08 BUG-B). The description
  can *promise* it, only the function and its tests can keep the promise.
- **AC6** (the page's feedback) is the UI's output, outside the tool call altogether.

So the schema keeps the call well-shaped; AC1's ordering, AC2, AC3, AC4 and AC5 stay in `canBook`.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | **allow** | It is read-only: by AC5 `check_room` saves nothing, and every call is validated by the schema first, so the worst case is a wrong Available/Unavailable answer the user can see, not a changed booking. |
| A2 | read `week-08/app/src/booking.ts` | **allow** | Reading one source file changes nothing and the file holds no secrets, only the booking rules; the only cost is that its text is sent to the model provider, which is acceptable for course code. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | **block** | It changes a business rule (AC2) because one user asked in chat; the limit belongs to the specification, not to a user's request, and the change would also make my tests and every other user's checks disagree with the spec. |
| A4 | run `npm test` in `week-08/app` | **allow** | Running the existing test suite only reads the code and reports results, and it is the agent's best way to check its own work; I allow `npm test` only, not `npm install`, which runs third-party install scripts. |
| A5 | run `git reset --hard` to undo its own last three edits | **ask** | `git reset --hard` throws away every uncommitted change in the working tree, including my own edits, not just the agent's last three, and that work cannot be recovered; I want to see `git status` and the diff first, or have it use `git restore <file>` on its own files. |
| A6 | `git commit` its change on the `week-09` branch | **ask** | A commit on `week-09` is reversible, but it goes into my graded history under my name; I must read the diff first, because the course rule is that I commit myself and I answer for every line. |
| A7 | `git push` to `main` | **block** | Pushing to `main` is outward-facing and breaks the course rule that work goes only through an open, never-merged PR from `week-09`; once pushed, others and the grader see it and undoing it needs a force-push. |
| A8 | send the contents of `.env` to an MCP server it found online | **block** | This is exfiltration of secrets: `.env` holds keys and passwords, and an unknown MCP server found online is untrusted third-party code, possibly a prompt injection; once sent, the secrets cannot be taken back, only rotated. |

## 7. Checkpoint

Checkpoint: **`34a8e94`** — `Week 09: model calls for R1-R3, report section 4` (from `git log --oneline`
on `week-09`). It holds the finished tool definition and the three saved calls, so everything the agent
could damage is committed before it starts.

Command to return to it:

```bash
git reset --hard 34a8e94
```

What it throws away: every commit made on `week-09` after `34a8e94` (they leave the branch; they stay
reachable through `git reflog` for a while, but nothing else points at them), and **every uncommitted
change to tracked files**, staged or not — the agent's edits *and* any of mine I had not committed.
It does not delete untracked files (a new file the agent created stays until `git clean -fd`).
Because it also discards my own work, I would run `git status` before it and commit or stash anything
of mine first.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None. All 30 checks pass (30 PASS · 0 FAIL · 0 ERROR), so `known_fails` in `submission.yml` is empty.

## 10. Conclusion (80–150 words)

The three layers catch different mistakes. The schema caught shape: S03 (`"11:00"`), S09 (`"false"`)
and S12 (a pair) are refused before `canBook` runs. But R2 shows its limit: 840–990 on a blocked room
passed F5, because 150 minutes and `true` are valid values; only `canBook` knows AC2 and AC3 make it
Unavailable. The model's job is translation, and the description shapes it: R3 was answered with a
question, partly because my description says "today" and "ask instead of guessing", yet nothing in
the schema could have stopped invented `now` or `bookings`. The agent layer is about side effects, not
correctness: A1 is safe because AC5 says the tool saves nothing, while A5 and A8 are dangerous whatever
the schema says.
