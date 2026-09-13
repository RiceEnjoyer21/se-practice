# Week 01 — Manual vs AI: Comparison

**Name:** Abylaikhan Orynbassar <br>
**Group:** Monday, 16:00-19:00 <br>
**Date:** 13.09.2026

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js and TypeScript |
| Time to first version that ran | 17 mins. | 15 mins. |
| Time to all 4 test cases passing | 33 mins. | 20 mins. |
| Number of attempts / prompts needed | 4 | 1 |
| Lines of code you actually wrote | all | none |
| Did it handle invalid marks (case B)? | yes | yes |
| Did it handle an empty list (case D)? | yes | yes |
| Did it use the ≥ 50 pass threshold? | yes | yes |
| Output format matches the spec? | yes | yes |
| Can you explain every line of it? | yes | mostly |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | (5, '67.00', 92, 23, '60.0%') | 5, 67.0, 92, 23, 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | yes, but only format was wrong |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | (5, '71.60', 100, 47, '80.0%') | 5, 71.60, 100, 47, 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | yes, same issue |
| C | `10, 20, 30` | (3, '20.00', 30, 10, '0.0%') | 3, 20.00, 30, 10, 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | yes, same issue |
| D | `abc, , xyz` | "no crash, no division by zero." | File could not be processed | clear message, no crash | yes |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

- It chose the tech stack by itself. Whether I did a simple programme, it generated an app with functional GUI, styling, extra buttons.
- Speaking to the result the output was the whole analysis with pass threshold, mentioned how many marks were passed and skipped, highlighted highest/lowest/medium results with green/red/orange colors. Created a mark distribtion table, with pass threshold, added total students, pass/fail columns, grade band table also.

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

- The input format. It was parsing the results vertically, which is inconvinient.
- It skipped Valid column, but modified it as pass/fail column. Mostly it made the task perfetly, except minor issues.

## 5. The defect I asked Rocket to fix

**Prompt I used:** Update the CSV format to support multiple test cases in one file. Each row should start with a case label, followed by the marks for that case, for example:<br>
A,85,23,45,90,92 <br>
B,88,47,-5,101,abc,73,50,,100 <br>
C,10,20,30 <br>
D,abc,,xyz  <br>
Parse each row as a separate case <br>

**Result:** Perfectly fixed, added multiple test case analysis, empty cases handled.

**What this tells me:** It mostly worked well, the fixed promt upgraded the result, but despite everything it mostly handles the general context, so it could drift from the initial idea. I still have to track minor issues which ai agent decided to silently skip.

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->

**Reflection**<br>
The logical part of the work was sped up dramatically. While it took for me a half of an hour to write a hardcoded logic for python function, it created a Next.js and TypeScript app with extended analysis, functional GUI, cards, plot and grade breakdown in minutes. The difference is huge, where a one line prompt made a ready to go product in a few minutes. The hardest issue here could be a time to make a model fully understand your query, as it catches only the general context, but as time goes it could drift from the initial idea. So mostly it costs fixing minor issues, or sometimes the whole logic depending on your query and how model understood it. Sometimes it could silently skip your specifications and that is where you should track your process. In my case it modified a "Valid" colummn which is a problem, as it should strictly follow to the specification. Of course between two artifacts I would chose my manual solution, because I came up with the way of creating it, strictly following to the specification. We can explain most of the work, but still don't understand how exactly it works. I can't be responsible to put my name for a generated code which I didn't fully write or understand. A human engineer still has to be responsible for specification requrements and rules, test cases, and other functionalities to fully satisfy a client.
