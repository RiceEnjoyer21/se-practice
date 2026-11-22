# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude Code (VS Code extension) | Claude Opus 5.5 (claude-opus-5-5), fresh agent, read only | 2026-11-22 | codebase analysis (Task 1), report 8.1 | none (read `app/src` only); its risks went into report 3.1 after my own `grep -n` check |
| Claude Code (VS Code extension) | Claude Opus 5.5 (claude-opus-5-5), same agent as above | 2026-11-22 | improvement plan, report 8.1 / 3.2-3.3 | none; plan modified in 3.3 |
| Claude Code (VS Code extension) | Claude Opus 5.5 (claude-opus-5-5), main session | 2026-11-22 | feature extension (Task 2): `rooms.ts`, `filter.ts`, `checkRoom`, the filter UI, screenshots taken with a headless Edge script | `app/src/rooms.ts`, `filter.ts`, `booking.ts`, `App.tsx`, `components/*`, `evidence/*.png` |
| Claude Code (VS Code extension) | Claude Opus 5.5 (claude-opus-5-5), main session + a fresh read-only review agent (8.3) | 2026-11-22 | refactoring (Task 3), diagrams | `app/src/*`, `app/README.md`, `diagrams/*.puml` |
| Claude Code (VS Code extension) | Claude Opus 5.5 (claude-opus-5-5), main session + a fresh agent for the `filter.test.ts` draft (8.2) | 2026-11-22 | tests (Task 4) | `app/src/booking.test.ts`, `app/src/filter.test.ts` |

<!-- Delete rows you did not use the assistant for; add rows for anything else. The optional
     extension (an existing skill or a read-only MCP server) goes here too, with its permissions. -->

**The assistant wrote, or helped write, tests in `app/`:** yes
All new tests in `booking.test.ts` (B1-B4, F3, F5, AC5 for `checkRoom`, the `whyUnavailable` block) and `filter.test.ts` (F1, F2, F4, B5, B6, INT; drafted by a fresh agent, report 8.2). Every expected value was worked out by hand from AC1-AC5 / F1-F5 before the code existed, and each new test was run red first (`checkRoom is not a function`, `Cannot find module './filter'`, 5 failed for `whyUnavailable`). The 23 week-08 tests are unchanged.
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes (only the terminal colour codes were stripped)

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes / no

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <your name>
Date:
