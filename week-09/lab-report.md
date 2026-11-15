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
| Assistant (frozen for the whole lab) | |
| Exact model (or "not displayed") | |
| Three fresh chats for R1, R2, R3? (yes / no) | |
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

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | | |
| A2 | read `week-08/app/src/booking.ts` | | |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | | |
| A4 | run `npm test` in `week-08/app` | | |
| A5 | run `git reset --hard` to undo its own last three edits | | |
| A6 | `git commit` its change on the `week-09` branch | | |
| A7 | `git push` to `main` | | |
| A8 | send the contents of `.env` to an MCP server it found online | | |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
