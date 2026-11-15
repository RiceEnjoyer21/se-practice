# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude | Claude Sonnet 5.5 | Part 2 — writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| Claude Code (VS Code extension) | Claude Opus 5.5 | helper for the lab: wrote `tool/check_room.json`, prepared the three Part 2 prompts (README text + the definition + the request), saved the replies I pasted into `calls/`, ran the checker, drafted the text of `lab-report.md` (sections 1–10), `AI_USAGE.md` and `submission.yml` | `tool/check_room.json`, `calls/r1.json`, `calls/r2.json`, `calls/r3.txt`, `lab-report.md` |

**I wrote `tool/check_room.json` myself:** no
Claude Code (Claude Opus 5.5) wrote the whole definition, both the description and the inputSchema. I checked it by running `python tests/check_tool.py` (D1–D6 and S01–S12 PASS on the first run of that definition), by reading every constraint against the reasons table in lab-report.md section 2, and by the three Part 2 calls, which were all valid against it.

**I used an AI to explain a JSON Schema keyword or a check:** no

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:** none. I can explain each constraint in `tool/check_room.json` and which S case it stops (section 2), and why AC1's ordering, AC2, AC3, AC4 and AC5 stay in `canBook` (section 5).

Signed: Abylaikhan
Date: 15.11.2026
