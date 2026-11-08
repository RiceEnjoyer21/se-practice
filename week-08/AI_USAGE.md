# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai web) | Claude Sonnet 5.5 | diagnosis without the skill (Task 4) | none — "Do not edit code" |
| Claude Code | Claude Sonnet 5.5 | diagnosis with bug-detector (Task 5) | none — "Do not edit code" |
| Claude Code | Claude Sonnet 5.5 | helper for the lab: copied the provided `canBook` into `app/src/booking.ts`, added the `BUG-A` and `BUG-B` tests, made both one-line fixes (`app/src/booking.ts`) after I asked for them, built `skills/bug-detector.zip`, pasted the real terminal output and drafted the text of `lab-report.md` (sections 3, 7, 8, 9.2, 10) | `week-08/app/src/booking.ts`, `week-08/app/src/booking.test.ts`, `week-08/lab-report.md`, `week-08/skills/bug-detector.zip`, `week-08/AI_USAGE.md`, `week-08/submission.yml` |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** yes
<!-- One edit by the assistant: it added the final full stop after "test" in step 7, because the checker (K5) expects the deck's line "Output: defect | evidence | root cause | fix | test." -->

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no
<!-- The helper assistant (Claude Code) applied both patches to app/src/booking.ts at my request, after the failing tests existed. Each patch is one edit of the overlap line (BUG-A) and the deletion of the `push` line and its comment (BUG-B). I reviewed each diff and ran the tests, and I made the commits myself. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- Claude Code, Claude Sonnet 5.5: drafted sections 3, 7, 8, 9.2 and 10 of lab-report.md. I was allowed to use it for the text of sections 9.2 and 10, and I read and checked them against the real runs. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
<!-- Two small cosmetic edits: colour codes removed (NO_COLOR=1), and the "↓ skipped" lines left out of the `-t "BUG-A"` run in 8.1. In sections 5 and 6 the three-backtick fence lines around the input code are omitted so the report's blocks parse. -->

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes
<!-- BUG-A: the overlap line used <= and >=, so touching endpoints counted as a conflict; T01, T08, X2 and BUG-A prove the fix. BUG-B: `bookings.push` changed the caller's array; the BUG-B test (720-780, touching nothing) and the AC5 test prove the fix. -->

**Anything I accepted from the AI without fully understanding it:**
none. I checked in section 7 that the claim of both answers about T02-T14 depending on run order or on the mutation was wrong for my suite (`check()` builds fresh bookings).

Signed: Abylaikhan
Date: 08.11.2026
