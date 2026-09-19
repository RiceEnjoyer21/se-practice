# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Abylaikhan Orynbassar
**Group:** Monday, 16:00-17:00
**Date:** 19.09.2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Claude |
| Exact model name | Claude Sonnet 5 |
| Implementation language | Python |
| Date of the runs | 19.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a - used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes 
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. The input method. The model itself decided to support the .csv files, also added a built-in sample data by default
2. Passing threshold. The pass mark was set by 40 by default and lowest grade boudary could be changed by the PASS_MARK global constant or in letter_grade() function
3. Marking analysis. student rankings, statisctics, libraries imported, grade distribution, students at risk and summaries, everything model decided by itself, without any specifications.

**Questions it should have asked and did not:**

1. Specify grading boundaries, scales or letters, thresholds like passing marks, an input methods like .csv, .xlsx, manual input and etc.
2. Which language should be used, should the program include external or only build in libraries, how exceptions or errors should be handled.

**Is the function named `analyze_marks` with the required signature?** No, it is called print_report, with only one parameter data(print_report(data)). 

**First impression before testing** (one sentence — you will compare this with section 6 later): Good output with many useful features, the only issue is that many rules were unspecified, so many things model decided by itself.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It created a analyze_marks(marks, pass_mark=50) function and followed function signature, did not created any interface or other functions.
2. Handled ValueErrors to handle specific test cases, used only math python standard library. Didn't added any additional analysis or features out of the prompt.

**What B still leaves open:**

1. Mostly they are related to specification rules. So it still didn't clarified the formatting rules, roundings(percentage in pass_rate, roundings in average as example).
2. Doesn't specify how to handle with NaN, inf or boolean values.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.

Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:** passing mark rules, default value of pass_mark parameter, handled emply lists, non numeric, out of range values, no external libraries, range of marks(0-100).

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).

Function signature: analyze_marks(marks, pass_mark=50)

Return a dictionary with exactly these four keys:
- "average" — the arithmetic mean of the marks, rounded to 2 decimal places.
- "highest" — the highest mark, without rounding.
- "lowest" — the lowest mark, without rounding.
- "pass_rate" — the percentage of marks greater than or equal to pass_mark, rounded to 2 decimal places. Return it as a percentage from 0 to 100, not as a fraction.

Validation rules:
Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range, empty iterable, non-numeric values, boolean values, NaN, infinity values or marks outside 0–100. 
Numerics strings are not accepted
A mark passes when mark >= pass_mark.

Constraints:
Use no external libraries. 
Return code plus a short explanation.
Keep the required public function name and signature exactly as specified.
Return only the required four keys; do not add extra output or features.

Examples:
#	Call	Required result
1	analyze_marks([40, 60, 80], 50)	average 60 · highest 80 · lowest 40 · pass_rate 66.67
2	analyze_marks([100], 50)	average 100 · highest 100 · lowest 100 · pass_rate 100
3	analyze_marks([49.5, 50], 50)	average 49.75 · highest 50 · lowest 49.5 · pass_rate 50
4	analyze_marks([], 50)	raises ValueError
5	analyze_marks([40, "60"], 50)	raises ValueError
6	analyze_marks([-1, 50, 101], 50)	raises ValueError 

Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**What I deliberately added that A, B and C did not have:**

1. specified formatting requirements, rounding, percentages, which exact four keys shoud be returned and how
2. added example cases from section 6
3. added function signature specification, expanded constraints and validation rules which were not specified in previous prompts.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:** The specification did not state how an invalid pass_mark should be handled. My idea was to require pass_mark to be a numeric value between 0 and 100 and to raise value error if it is invalid.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1 | analyze_marks() fuction doesn't exist, failed signature, wrong threshold, harness stopped, all cases couted as ERROR |
| A | 2 | same problem |
| A | 3 | same problem |
| A | 4 | same problem, value error never raised |
| A | 5 | same problem, value error never raised |
| A | 6 | same problem, value error never raised |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
(dsaa) PS C:\Users\LOQ\Desktop\SWE\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_a.py
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
(dsaa) PS C:\Users\LOQ\Desktop\SWE\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_b.py
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```
(dsaa) PS C:\Users\LOQ\Desktop\SWE\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_c.py
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: mark must be a number, got '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark must be between 0 and 100, got -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
(dsaa) PS C:\Users\LOQ\Desktop\SWE\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_d.py
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: invalid mark (not a number): '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range 0-100: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 2 | 1 | 1 |
| **Total / 10** | 0 | 7 | 9 | 9 |

**Prompt length, in words:** A __7__ · B __44__ · C __84__ · D __253__

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says: B over A approximately 5 words per points, C over B is 20, D over C is undefined as got simmilar total points. Each point costs more words, however D didn't make any impact, but added length. Costs per point rises outrageously, so the most preferable ones here are B or C. 

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)

According to the results, prompts C and D scored best with 9/10 points both. Although prompt D length difference over C is 169, they got the same results with no gain, so cost per point for D over C is undefined. So it basically tells us that sometimes extra clarification adds only length, but not quality. I would use prompt C at work, as it gives the same results with shorter prompt, easier to maintain. As compromise prompt B is also good and cheaper for easy tasks without any additional validation. Addition in prompt B bought the most correctness, exact implementation of analyze_marks(marks, pass_mark=50). In Prompt A, model made decisions by itself, instead of analyze_marks() created print_report() function, so A case got ERROR type in all 6 cases. On the other hand that little clarification made prompt B pass all 6 cases. Pure noise was the prompt D, I realised that many additional information didn't made the quality better. The ambiguity was how pass_mark parameter should be handled. How function would behave in examples analyze_marks([50], "50"). I resolved it in prompt D, pass_mark is 0-100 or raised value error otherwise. 6 examples doesn't test this so in remains untested.
```

**Word count:** 199

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. I ran each prompt only once. Would Prompt B give the same code in a new chat, and how many runs do we need to trust the comparison?
2. Test had only six cases and none of them tested an invalid pass_mark. How do we decide that a test set is sufficient and should the tests be written by the human or by the AI?
