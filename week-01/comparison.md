# Week 01 — Manual vs AI: Comparison

**Name:** Abylaikhan Orynbassar <br>
**Group:** Monday, 16:00-19:00 <br>
**Date:** 13.09.2026

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | |
| Time to first version that ran | 17 mins. | |
| Time to all 4 test cases passing | 33 mins. | |
| Number of attempts / prompts needed | 4 | |
| Lines of code you actually wrote | all | |
| Did it handle invalid marks (case B)? | yes | |
| Did it handle an empty list (case D)? | yes | |
| Did it use the ≥ 50 pass threshold? | yes | |
| Output format matches the spec? | yes | |
| Can you explain every line of it? | yes | |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | (5, '67.00', 92.0, 23.0, '60.0%') | | avg 67.00 · high 92 · low 23 · pass 60.0% | |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | (5, '71.60', 100.0, 47.0, '80.0%') | | avg 71.60 · high 100 · low 47 · pass 80.0% | |
| C | `10, 20, 30` | (3, '20.00', 30.0, 10.0, '0.0%') | | avg 20.00 · high 30 · low 10 · pass 0.0% | |
| D | `abc, , xyz` | "no crash, no division by zero." | | clear message, no crash | |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

-
-

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

-
-

## 5. The defect I asked Rocket to fix

**Prompt I used:**

**Result:** (fixed / partly fixed / broke something else)

**What this tells me:**

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->
