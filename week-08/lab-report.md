# Week 08 — Lab report

**Name:** Abylaikhan
**Group:** Monday, 16:00-19:00
**Date:** 08.11.2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | |
| Exact model (with its version, or `not displayed`) | |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows 11, Git Bash) |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts (`buggy/booking.ts`) |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-08/app

 ✓ src/booking.test.ts (21 tests) 4ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  20:51:57
   Duration  882ms (transform 31ms, setup 0ms, collect 35ms, tests 4ms, environment 0ms, prepare 653ms)
```

Green: 21 tests (T01–T14, AC5, X1, X2, E01–E04), all passing on my own Week 07 `canBook`.

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-08/app

 ❯ src/booking.test.ts (21 tests | 4 failed) 11ms
   × canBook: plan T01-T14 > T01 AC4: 660-720 touches the end of 600-660 and is allowed 7ms
     → expected false to be true // Object.is equality
   ✓ canBook: plan T01-T14 > T02 AC1: 540-570 starts exactly at now and is rejected 0ms
   ✓ canBook: plan T01-T14 > T03 AC1: 720-720 has zero duration and is rejected 0ms
   ✓ canBook: plan T01-T14 > T04 AC1: 750-720 is reversed and is rejected 0ms
   ✓ canBook: plan T01-T14 > T05 AC1: 1380-1441 ends past the end of the day and is rejected 0ms
   ✓ canBook: plan T01-T14 > T06 AC2: 720-840 is exactly 120 minutes and is allowed 0ms
   ✓ canBook: plan T01-T14 > T07 AC2: 720-841 is 121 minutes and is rejected 0ms
   × canBook: plan T01-T14 > T08 AC4: 570-600 touches the start of 600-660 and is allowed 0ms
     → expected false to be true // Object.is equality
   ✓ canBook: plan T01-T14 > T09 AC4: 630-690 partly overlaps 600-660 and is rejected 0ms
   ✓ canBook: plan T01-T14 > T10 AC4: 570-690 contains 600-660 and is rejected 0ms
   ✓ canBook: plan T01-T14 > T11 AC4: 615-645 lies inside 600-660 and is rejected 0ms
   ✓ canBook: plan T01-T14 > T12 AC4: 600-660 is identical to the booking and is rejected 0ms
   ✓ canBook: plan T01-T14 > T13 AC3: 660-720 in a blocked room is rejected 0ms
   ✓ canBook: plan T01-T14 > T14 AC4: 630-690 with no bookings is allowed 0ms
   × canBook: AC5 data is not changed > AC5: an Available request leaves the bookings equal to the copy taken before 1ms
     → expected false to be true // Object.is equality
   ✓ canBook: my own cases X1, X2 > X1 AC1: 1380-1440 ends exactly at the end of the day and is allowed 0ms
   × canBook: my own cases X1, X2 > X2 AC4: 660-720 between 600-660 and 720-780 touches both and is allowed 0ms
     → expected false to be true // Object.is equality
   ✓ canBook: boundaries added in review > E01 AC1: 541-570 starts one minute after now and is allowed 0ms
   ✓ canBook: boundaries added in review > E02 AC1: 539-570 starts before now and is rejected 0ms
   ✓ canBook: boundaries added in review > E03 AC4: 570-630 overlaps only the head of 600-660 and is rejected 0ms
   ✓ canBook: boundaries added in review > E04 AC4: 740-770 overlaps only the second booking and is rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook: plan T01-T14 > T01 AC4: 660-720 touches the end of 600-660 and is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:24:29
     22| describe('canBook: plan T01-T14', () => {
     23|   test('T01 AC4: 660-720 touches the end of 600-660 and is allowed', (…
     24|     expect(check(660, 720)).toBe(true);
       |                             ^
     25|   });
     26| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.ts > canBook: plan T01-T14 > T08 AC4: 570-600 touches the start of 600-660 and is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:52:29
     50| 
     51|   test('T08 AC4: 570-600 touches the start of 600-660 and is allowed',…
     52|     expect(check(570, 600)).toBe(true);
       |                             ^
     53|   });
     54| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.ts > canBook: AC5 data is not changed > AC5: an Available request leaves the bookings equal to the copy taken before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:87:20
     85|     const result = canBook({ start: 660, end: 720, now: 540, blocked: …
     86| 
     87|     expect(result).toBe(true);
       |                    ^
     88|     expect(bookings).toEqual(before);
     89|     expect(JSON.stringify(bookings)).toBe(JSON.stringify(before));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.ts > canBook: my own cases X1, X2 > X2 AC4: 660-720 between 600-660 and 720-780 touches both and is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:103:43
    101|       { start: 720, end: 780 },
    102|     ];
    103|     expect(check(660, 720, { bookings })).toBe(true);
       |                                           ^
    104|   });
    105| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 17 passed (21)
   Start at  20:52:38
   Duration  973ms (transform 34ms, setup 0ms, collect 39ms, tests 11ms, environment 0ms, prepare 708ms)
```

4 of 21 failed: T01, T08, AC5, X2.

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
RUN  v3.2.4 C:/Users/LOQ/Desktop/SWE/se-practice/week-08/app

 ❯ src/booking.test.ts (23 tests | 6 failed) 14ms
   × canBook: plan T01-T14 > T01 AC4: 660-720 touches the end of 600-660 and is allowed 7ms
     → expected false to be true // Object.is equality
   ✓ canBook: plan T01-T14 > T02 AC1: 540-570 starts exactly at now and is rejected 0ms
   ✓ canBook: plan T01-T14 > T03 AC1: 720-720 has zero duration and is rejected 0ms
   ✓ canBook: plan T01-T14 > T04 AC1: 750-720 is reversed and is rejected 0ms
   ✓ canBook: plan T01-T14 > T05 AC1: 1380-1441 ends past the end of the day and is rejected 0ms
   ✓ canBook: plan T01-T14 > T06 AC2: 720-840 is exactly 120 minutes and is allowed 0ms
   ✓ canBook: plan T01-T14 > T07 AC2: 720-841 is 121 minutes and is rejected 0ms
   × canBook: plan T01-T14 > T08 AC4: 570-600 touches the start of 600-660 and is allowed 0ms
     → expected false to be true // Object.is equality
   ✓ canBook: plan T01-T14 > T09 AC4: 630-690 partly overlaps 600-660 and is rejected 0ms
   ✓ canBook: plan T01-T14 > T10 AC4: 570-690 contains 600-660 and is rejected 0ms
   ✓ canBook: plan T01-T14 > T11 AC4: 615-645 lies inside 600-660 and is rejected 0ms
   ✓ canBook: plan T01-T14 > T12 AC4: 600-660 is identical to the booking and is rejected 0ms
   ✓ canBook: plan T01-T14 > T13 AC3: 660-720 in a blocked room is rejected 0ms
   ✓ canBook: plan T01-T14 > T14 AC4: 630-690 with no bookings is allowed 0ms
   × canBook: AC5 data is not changed > AC5: an Available request leaves the bookings equal to the copy taken before 1ms
     → expected false to be true // Object.is equality
   ✓ canBook: my own cases X1, X2 > X1 AC1: 1380-1440 ends exactly at the end of the day and is allowed 0ms
   × canBook: my own cases X1, X2 > X2 AC4: 660-720 between 600-660 and 720-780 touches both and is allowed 0ms
     → expected false to be true // Object.is equality
   ✓ canBook: boundaries added in review > E01 AC1: 541-570 starts one minute after now and is allowed 0ms
   ✓ canBook: boundaries added in review > E02 AC1: 539-570 starts before now and is rejected 0ms
   ✓ canBook: boundaries added in review > E03 AC4: 570-630 overlaps only the head of 600-660 and is rejected 0ms
   ✓ canBook: boundaries added in review > E04 AC4: 740-770 overlaps only the second booking and is rejected 0ms
   × canBook: regression tests for the provided bugs > BUG-A: 780-840 touches 720-780 and 840-900 on both sides and must be Available 1ms
     → expected false to be true // Object.is equality
   × canBook: regression tests for the provided bugs > BUG-B: 720-780 touches nothing, is Available and leaves bookings unchanged 2ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook: plan T01-T14 > T01 AC4: 660-720 touches the end of 600-660 and is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:24:29
     22| describe('canBook: plan T01-T14', () => {
     23|   test('T01 AC4: 660-720 touches the end of 600-660 and is allowed', (…
     24|     expect(check(660, 720)).toBe(true);
       |                             ^
     25|   });
     26| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  src/booking.test.ts > canBook: plan T01-T14 > T08 AC4: 570-600 touches the start of 600-660 and is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:52:29
     50| 
     51|   test('T08 AC4: 570-600 touches the start of 600-660 and is allowed',…
     52|     expect(check(570, 600)).toBe(true);
       |                             ^
     53|   });
     54| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  src/booking.test.ts > canBook: AC5 data is not changed > AC5: an Available request leaves the bookings equal to the copy taken before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:87:20
     85|     const result = canBook({ start: 660, end: 720, now: 540, blocked: …
     86| 
     87|     expect(result).toBe(true);
       |                    ^
     88|     expect(bookings).toEqual(before);
     89|     expect(JSON.stringify(bookings)).toBe(JSON.stringify(before));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  src/booking.test.ts > canBook: my own cases X1, X2 > X2 AC4: 660-720 between 600-660 and 720-780 touches both and is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:103:43
    101|       { start: 720, end: 780 },
    102|     ];
    103|     expect(check(660, 720, { bookings })).toBe(true);
       |                                           ^
    104|   });
    105| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  src/booking.test.ts > canBook: regression tests for the provided bugs > BUG-A: 780-840 touches 720-780 and 840-900 on both sides and must be Available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:136:43
    134|       { start: 840, end: 900 },
    135|     ];
    136|     expect(check(780, 840, { bookings })).toBe(true);
       |                                           ^
    137|   });
    138| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  src/booking.test.ts > canBook: regression tests for the provided bugs > BUG-B: 720-780 touches nothing, is Available and leaves bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:146:22
    144| 
    145|     expect(result).toBe(true);
    146|     expect(bookings).toEqual(before);
       |                      ^
    147|   });
    148| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  1 failed (1)
      Tests  6 failed | 17 passed (23)
   Start at  20:53:41
   Duration  1.55s (transform 35ms, setup 0ms, collect 40ms, tests 14ms, environment 0ms, prepare 1.02s)
```

6 of 23 failed on the buggy code: the 4 old ones plus the two new regression tests, `BUG-A` and `BUG-B`.

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01, T08, X2, `BUG-A` | `canBook` 660–720 with an existing booking 600–660 (T01); 780–840 between 720–780 and 840–900 (`BUG-A`) | `true` (Available): the request only touches the endpoints | `false` (Unavailable) | The overlap loop: `if (start <= b.end && end >= b.start) return false;`. `<=` and `>=` also count equal endpoints as a conflict. It should be strict `<` and `>`. |
| BUG-B | `BUG-B` (AC5 also fails, but for the wrong reason) | 720–780 with `bookings = [{600,660}]`, touching nothing | `true`, and `bookings` still equals `[{600,660}]` | `true`, but `bookings` now has a second element `{720,780}` | `bookings.push({ start, end });` before `return true`. It mutates the caller's array, which breaks AC5. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes / no |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes / no |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes / no |
| I read the whole file once: no passwords, API keys or private student data | yes / no |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
(paste here)
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
