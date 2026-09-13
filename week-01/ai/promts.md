**Promt:** Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

**Rocket Q1:** How do the student marks get into the app?
- Type or paste marks manually.
Enter a list of marks directly into the app each time
- Upload a CSV or spreadsheet file.
Import an existing marks file to process in one click
- Add students one by one.
Build a student list and enter each grade individually

**I chose:** Upload a CSV or spreadsheet file.

**Rocket Q2:** Should the app show results per individual student, or just the overall class summary?
- Class summary only. Show average, highest, lowest, and pass rate for the whole class
- Per-student breakdown too. List each student's mark alongside the class-wide stats
- Both, with a pass/fail flag per student. Show each student's mark and whether they passed or failed

**I chose:** Class summary only.

**Rockets reply:**<br>
Thank you for your responses. Your final prompt score is 80%.
I have redrafted your prompt as under and will proceed to execute on the same.

**Rocket Enhanced**: <br>
A web-based student marks processor where a teacher uploads a CSV or spreadsheet file containing student marks, and the app instantly computes and displays the class summary — average mark, highest mark, lowest mark, and overall pass rate. <br>
Building with Next.js and TypeScript.

**What Rocket did:** <br>
- Built a CSV/spreadsheet upload tool that parses student marks files and computes class-wide statistics (average, highest, lowest, pass rate, total students, pass/fail split)
- Added six KPI stat cards, a mark distribution bar chart, and a grade band breakdown table with a configurable pass threshold slider
- Implemented drag-and-drop file upload zone with idle, loading skeleton, success, and parse error states via parseMarks.ts and computeSummary.ts utilities

**TEST CASES** <br>
**CASE A:**<br>
**Input:**<br>
case_A.csv -> 85, 23, 45, 90, 92

**Output:** <br>
Class Average: 67.0<br>
Mean score across all students

Highest Mark: 92<br>
Top score in the class

Lowest Mark:23<br>
Lowest score in the class

Pass Rate:60.0%<br>
Threshold: 50 marks

Total Students: 5<br>
Marks successfully parsed

Pass / Fail: 3<br>
3 passed / 2 failed

**Does it match the specification?** Yes, but the format of average is wrong.

**CASE B:**<br>
**Input:**<br>
case_B.csv -> 88, 47, -5, 101, abc, 73, 50, , 100	

**Output:**<br>
Class Average:71.6<br>
Mean score across all students

Highest Mark:100<br>
Top score in the class

Lowest Mark:47<br>
Lowest score in the class

Pass Rate:80.0%<br>
Threshold: 50 marks

Total Students:5<br>
Marks successfully parsed

Pass / Fail: 4<br>
4 passed / 1 failed / 1 student below threshold

**Does it match the specification?** Yes, but the format of average is wrong.

**CASE C:**<br>
**Input:**<br>
case_C.csv -> 10, 20, 30

**Output:**<br>
Class Average: 20.0 <br>
Mean score across all students

Highest Mark: 30<br>
Top score in the class

Lowest Mark: 10<br>
Lowest score in the class

Pass Rate: 0.0%<br>
Threshold: 50 marks

Total Students: 3 <br>
Marks successfully parsed

Pass / Fail: 0 <br>
0 passed / 3 failed / 3 students below threshold

**Does it match the specification?** Yes, but the format of average is wrong.

**CASE D:**<br>
**Input:**<br>
case_D.csv -> abc, , xyz

**Output:**<br>
File could not be processed <br>
No numeric marks were found in the uploaded file. Make sure the file contains a column of numbers between 0 and 100.

**Does it match the specification?** Yes.

**Step 6:** <br>
There was no any wrong behavior, so I left it just as it is. Then I decided to add an multiple test case analysis in once. Changed parsing method.
**Fixing prompt:** Update the CSV format to support multiple test cases in one file. Each row should start with a case label, followed by the marks for that case, for example:<br>
A,85,23,45,90,92 <br>
B,88,47,-5,101,abc,73,50,,100 <br>
C,10,20,30 <br>
D,abc,,xyz  <br>
Parse each row as a separate case <br>

**Step 7:** <br>
Rocket did not let me download a generated code, as I should upgrade my plan. Screenshots and preview link are attached in `week-01/ai` folder.<br>
**Preview link:** https://marksprocessor-qzrv65.public.builtwithrocket.new
