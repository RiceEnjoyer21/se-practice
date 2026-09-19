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

- Each prompt was sent in a **fresh chat**: yes / no
- No follow-up questions were asked before Part 7: yes / no
- Every output was saved **before** any editing: yes / no

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
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | | | | |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| | | |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

```

**Prompt B**

```

```

**Prompt C**

```

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
