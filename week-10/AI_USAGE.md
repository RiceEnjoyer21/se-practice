# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | reading `AGENTS.md` (Part 1, §2.3) and the read-only risk review (Task 2), both in plan mode | none — "WITHOUT editing files"; `git status` showed no change in `app/` |
| Claude Code | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | AGENTS.md review and patch draft (Task 6) | none — it only drafted; I applied the approved lines to `app/AGENTS.md` myself (§6.2) |
| Claude Code | Claude Sonnet 5.5 (`claude-sonnet-5-5`), a new session | the refactor for R2 (Task 8) | `app/src/booking.ts`, `app/src/App.tsx` — it applied the edits without waiting for my approval; I reviewed the full diff before committing and changed one line (§8.1) |
| Claude Code | Claude Opus 5.5 (`claude-opus-5-5`), a separate session | assistant for the lab workflow: ran the baseline commands and the checker, wrote the R2 regression test, checked the AI's claims against the code, drafted the text of `lab-report.md` §2–§10 and this file | `app/src/booking.test.ts` (the R2 test), `app/AGENTS.md` (applying the lines I approved), the one-line fix in `app/src/booking.ts`, `lab-report.md`, `AI_USAGE.md`, `submission.yml`, `evidence/*.png` (copied from my screenshots) |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes
<!-- Each label rests on a file line or a run listed in "What I inspected" (e.g. K4 was run against the real canBook). -->

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
<!-- Rejected in §8.1: the refactor agent's change of `!(start > now)` to `start <= now` (fails open for NaN), and its skipping of the "show the files first" step. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes
Claude Code with Claude Opus 5.5 (`claude-opus-5-5`), in a separate session from the reviewer: it
drafted the text of `lab-report.md` §2–§10 (including the §10 conclusion, which I read and agreed
with), wrote the R2 regression test and ran every command whose output is pasted in the report.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
<!-- The Vitest runs were made with NO_COLOR=1 and --reporter=verbose, as the pasted command line shows. -->

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
Nothing that I know of. The part I relied on most is the R2 test's 15 x 17 grid of requests: I
accepted that comparing the verdict with `canBook` on that grid is what proves "never fails open".

Signed: Abylaikhan Orynbassar
Date: 22 November 2026
