# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (chat) | Claude Sonnet 5.5 | the first test suite (Task 3) | `suites/first/booking.test.ts`, `app/src/booking.test.ts` (first copy) |
| Claude (same chat) | Claude Sonnet 5.5 | the improvement prompt (Task 5) | `lab-report.md` 6.2 (answer pasted); ideas E01, E02, E07, E08 reused in `app/src/booking.test.ts` |
| Claude Code | Claude Sonnet 5.5 | extraction of `canBook`, final suite, mutant runs, drafts of the tables in `lab-report.md` | `app/src/booking.ts`, `app/src/App.tsx`, `app/src/booking.test.ts`, `lab-report.md`, `submission.yml` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
Claude Code created `app/src/booking.ts` with the four conditions copied from `evaluateAvailability` and made `app/src/App.tsx` call it. Checked with `tsc` typecheck, `vite build`, the 21 tests and the manual UI checks.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
Claude Code, Claude Sonnet 5.5: drafts of the reasons in section 3, the review rows in section 5, the tables of sections 7, 8 and 9. Section 10 is written by me.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes / no

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes / no

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <your name>
Date:
