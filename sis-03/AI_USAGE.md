# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Claude (claude.ai chat) | Claude Sonnet 5.5 | the plan (stage A) | report.md section 11 (B1) | week-05 |
| Claude (claude.ai chat) | Claude Sonnet 5.5 | Python v1 (stage B) | `code/original/booking_v1.py` | week-05 |
| Bolt.new | not displayed | web prototype v1 (stage B) | `web/original/` | week-06 |
| Claude Code (VS Code) | Claude Sonnet 5.5 (claude-sonnet-5-5) | critique (stage C) | report.md sections 8 and 11 (B3) | this SIS |
| Claude Code (VS Code) | Claude Sonnet 5.5 (claude-sonnet-5-5) | repair (stage D), running the page cases with Playwright, filling report tables | `web/final/src/App.tsx`, report.md, `evidence/final-narrow.png` | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
Claude generated the 19 tests in Week 05. I checked their expected values against AC1–AC5, not against the function's output: touching endpoints are allowed (AC4), a start equal to now is rejected (AC1), exactly 120 minutes is allowed and 121 is not (AC2), the day bounds 1440 and 1441 (AC1), a blocked room is rejected (AC3), and the immutability tests compare `existing` with a saved copy (AC5). All 19 pass and the checker's fault-injection checks M1–M10 pass.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes
The Python results come from running both files; the page results were observed by driving the real pages in Chrome with Playwright (browser clock fixed to 09:00, disclosed in section 5). T8, T9 and T10 are reported as Not testable on the page, not guessed.

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:** none. Issue 3 in report.md section 7 was repaired through Claude Code instead of Bolt; this is disclosed in section 13.

Signed: Abylaikhan Orynbassar
Date: 2026-11-01
