# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.1

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** For topic 1.1, what must a customer receive beyond program code to operate and maintain a university equipment booking service?

**Users:** Sixty students request cameras and laptops; two equipment desk staff approve bookings and record collection and return.

**Problem:** A shared spreadsheet makes availability unclear, so the department wants a browser service with agreed booking rules and a reliable handover.

**Constraints:** Delivery must finish within four weeks; ongoing technical support must require no more than two staff hours per week.

**Risk:** Simultaneous requests could reserve the same item, leaving a student without equipment needed for coursework.

**Assumptions:** The department, user numbers, current spreadsheet, equipment, intended service, deadline, support capacity and failure scenario are entirely fictional.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

The customer should receive a defined booking service, evidence for accepting it, and a practical handover package. Sommerville includes associated documentation within software (2014, slide 7). For this fictional department, configuration notes are an additional recommendation tied to operating the browser service. Documentation should answer specific questions for sixty students and two staff members.

The first engineering decision is to agree the reservation rule before development. The proposed rule makes student requests pending; staff approval reserves equipment. With an available item, two valid concurrent approval attempts for identical dates must yield one confirmation and one conflict message. The customer must approve this policy. It directly addresses double booking, whereas a screenshot of available cameras would not exercise conflicting approvals.

Acceptance evidence should cover requesting, approval, cancellation, collection and return. Record the release identifier, initial state, expected outcome, observed outcome and unresolved failures for each case. Include cancellation followed by a new request to check that availability changes consistently. Successful cases provide limited evidence: they do not establish that every defect has been removed (ISTQB, 2024, section 1.3). These are proposed checks, not results from an implemented system.

The second decision is to use concise guides and an observed handover instead of promising independence from written instructions alone. Students need availability, request status and collection guidance. Operators need setup, configuration, incident reporting and recovery procedures. Before acceptance, a student and both staff members must complete their tasks using the guides, with misunderstandings logged for correction. This makes usability concrete without requiring an elaborate interface.

Accept recovery only after a sample restore into a separate environment; record the agreed data loss and recovery limits, and estimate recurring work against two weekly support hours. Backup frequency should follow those limits. Automate backup creation if the selected hosting supports it; the final choice remains conditional because hosting and staff skills are unknown. Checking file existence alone is not the proposed recovery criterion.

The support agreement should name an owner, an issue channel, escalation arrangements and a procedure for releasing fixes. Four weeks favour the core workflow over reminders, analytics and a separate mobile application. That choice preserves time for acceptance and handover but postpones convenience features. Two weekly support hours describe capacity, not a guaranteed incident resolution time.

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B point 1 was accepted as a request for evidence, rather than treated as independent proof. Verification row 1 qualifies the draft's documentation/configuration statement: Sommerville's slide 7 supports documentation, while configuration notes remain a scenario recommendation. Verification row 2 keeps the testing limitation because ISTQB section 1.3, principle 1 supports it. Neither source establishes this department's staffing or recovery needs.

Point 2 was qualified. "Only one" permits zero confirmations, and simultaneous requests might legitimately remain pending. The revised proposal therefore defines staff approval as the reservation step and specifies an available item, two valid concurrent approvals, one confirmation and one conflict message. Change-log row 1 connects this correction to the stated double booking risk; customer agreement is still needed.

Point 3 was partly rejected and partly qualified. File existence was rejected as sufficient recovery evidence. Daily frequency was qualified because acceptable data loss, hosting capabilities and recurring effort are unspecified. Change-log row 2 replaces that instruction with a sample restore, recovery limits and a workload estimate. The two hour weekly support constraint explains why automation is conditional and capacity must be checked.

Point 4 was qualified: a manual does not establish independent operation. Change-log row 3 requires a student and both staff members to complete their tasks using the guides. Unfamiliar hosting is a counterexample to the draft's confidence; training or escalation may still be necessary.

Codex performed the source checks and prepared these decisions and revisions; the student's independent reading and final review remain unconfirmed. No product tests or usability exercises were executed. At the student's request, the first commit remains unpushed until the end, departing from README's required order.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

The recommended delivery is a small booking service accompanied by agreed reservation rules, acceptance records, student and operator guides, recovery instructions and a named support arrangement. Launch should depend on the conflict case and handover exercises meeting the customer's agreed criteria, with unresolved issues recorded explicitly. Keeping optional features outside the first release fits the four week deadline.

The main limitation is uncertain operational capacity. Two support hours per week may be insufficient if hosting is unfamiliar or recovery requires substantial manual work. Before launch, the customer should approve recovery targets, an effort estimate and escalation arrangements. If these cannot fit the available capacity, reduce the service scope or postpone launch instead of promising reliable independent operation.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- Sommerville, I. (2014). Ch1 introduction. Companion slides for Software Engineering, 10th edition; slides dated 30 October 2014, slides 7 and 12. https://www.slideshare.net/slideshow/ch1-introduction-42645973/42645973 . Accessed 2026-10-11.
- International Software Testing Qualifications Board. (2024). Certified Tester Foundation Level Syllabus, v4.0.1, released 15 September 2024. Section 1.3, principle 1, p. 17. https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf . Accessed 2026-10-11.

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

<!-- The student supplied these five ideas in Russian before Prompt A; Codex translated them
     into English without adding ideas. -->

1. The customer needs to understand the purpose of the product: what problem it solves and whom it helps.
2. Clear acceptance criteria are needed to evaluate the result and approve the work.
3. A user-friendly interface is needed so that users can complete their tasks without unnecessary effort.
4. Instructions for setup and operation are needed so that the product can be used without outside help.
5. A support plan is needed so that errors can be fixed and the product continues to work after delivery.

## 8. Appendix B — AI exchanges

The fixed prompts were assembled from the student's instructions and processed sequentially in
this ongoing Codex session. They were not separate manual submissions by the student. Complete
prompt and response texts are preserved below.

Workflow deviation: at the student's explicit request, the first commit, e461f04, remained local
before Prompt A; the student plans to push the branch at the end instead of before Prompt A.

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** Codex
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.1 — Professional software delivery: For topic 1.1, what must a customer receive beyond program code to operate and maintain a university equipment booking service? for a first-year-level university assignment.

My scenario is Question: For topic 1.1, what must a customer receive beyond program code to operate and maintain a university equipment booking service? Users: Sixty students request cameras and laptops; two equipment desk staff approve bookings and record collection and return. Problem: A shared spreadsheet makes availability unclear, so the department wants a browser service with agreed booking rules and a reliable handover. Constraints: Delivery must finish within four weeks; ongoing technical support must require no more than two staff hours per week. Risk: Simultaneous requests could reserve the same item, leaving a student without equipment needed for coursework. Assumptions: The department, user numbers, current spreadsheet, equipment, intended service, deadline, support capacity and failure scenario are entirely fictional.. My initial ideas are 1. The customer needs to understand the purpose of the product: what problem it solves and whom it helps. 2. Clear acceptance criteria are needed to evaluate the result and approve the work. 3. A user-friendly interface is needed so that users can complete their tasks without unnecessary effort. 4. Instructions for setup and operation are needed so that the product can be used without outside help. 5. A support plan is needed so that errors can be fixed and the product continues to work after delivery.. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
In this fictional scenario, delivering working booking code would not be enough. The customer needs a usable service that sixty students and two equipment desk staff can understand, accept and operate. Professional software includes documentation and configuration information as well as executable code. The delivery package should therefore connect the department's purpose, agreed behaviour, evidence of testing and arrangements for continued operation.

First, provide a short requirements and acceptance checklist. It should explain who may request equipment, who approves requests, when a reservation becomes confirmed, and how cancellations and returns affect availability. These rules are proposals because the scenario does not specify them. Clear acceptance criteria turn an attractive demonstration into something the customer can evaluate. For example, when two students request the same item for overlapping times, only one booking should be confirmed.

Second, deliver test results for the important workflows: requesting, approving, cancelling, collecting and returning equipment. Include a simultaneous request test because double booking is the stated risk. Testing can reveal defects, but it cannot establish that no defects remain. The report should identify the tested version, conditions and any unresolved problems. A successful demonstration with one user would not exercise the concurrency risk. The proposed acceptance checklist should require the conflicting request test to pass.

Third, supply a simple interface and concise user guidance. Students should see whether an item is available, whether their request is pending, and whether collection has been approved. Staff need an understandable way to record collection and return. A short walkthrough with representative users would help identify confusing terminology. However, the fictional user numbers do not prove that the service requires an elaborate interface or extensive customization.

Fourth, hand over installation instructions, configuration details, a release identifier and a basic operating guide. Explain how to start the service and report an error. Staff should back up the booking database every day and check that the backup file exists. These instructions should allow the department to operate the service independently. This is preferable to depending on the original developer whenever something goes wrong, although the available hosting arrangements remain unknown.

Finally, agree a support plan naming a contact, an issue recording method and a procedure for releasing fixes. With four weeks for delivery and only two support hours per week, prioritize the booking workflow over optional reminders, analytics or a mobile application. A smaller initial scope leaves time for testing and handover, but it postpones convenience features. The two hour support limit is a fictional capacity assumption, not evidence that every incident can be resolved within that time.

The scenario details and proposed procedures are assumptions or recommendations. Verify the general claims about software deliverables and the limits of testing in authoritative sources. Hosting, staff skills and recovery requirements still need agreement before implementation.
```

### B2 — Critique (Prompt B)

- **Tool:** Codex
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: 1.1 — Professional software delivery: For topic 1.1, what must a customer receive beyond program code to operate and maintain a university equipment booking service?. Scenario: Question: For topic 1.1, what must a customer receive beyond program code to operate and maintain a university equipment booking service? Users: Sixty students request cameras and laptops; two equipment desk staff approve bookings and record collection and return. Problem: A shared spreadsheet makes availability unclear, so the department wants a browser service with agreed booking rules and a reliable handover. Constraints: Delivery must finish within four weeks; ongoing technical support must require no more than two staff hours per week. Risk: Simultaneous requests could reserve the same item, leaving a student without equipment needed for coursework. Assumptions: The department, user numbers, current spreadsheet, equipment, intended service, deadline, support capacity and failure scenario are entirely fictional.. Draft: In this fictional scenario, delivering working booking code would not be enough. The customer needs a usable service that sixty students and two equipment desk staff can understand, accept and operate. Professional software includes documentation and configuration information as well as executable code. The delivery package should therefore connect the department's purpose, agreed behaviour, evidence of testing and arrangements for continued operation.

First, provide a short requirements and acceptance checklist. It should explain who may request equipment, who approves requests, when a reservation becomes confirmed, and how cancellations and returns affect availability. These rules are proposals because the scenario does not specify them. Clear acceptance criteria turn an attractive demonstration into something the customer can evaluate. For example, when two students request the same item for overlapping times, only one booking should be confirmed.

Second, deliver test results for the important workflows: requesting, approving, cancelling, collecting and returning equipment. Include a simultaneous request test because double booking is the stated risk. Testing can reveal defects, but it cannot establish that no defects remain. The report should identify the tested version, conditions and any unresolved problems. A successful demonstration with one user would not exercise the concurrency risk. The proposed acceptance checklist should require the conflicting request test to pass.

Third, supply a simple interface and concise user guidance. Students should see whether an item is available, whether their request is pending, and whether collection has been approved. Staff need an understandable way to record collection and return. A short walkthrough with representative users would help identify confusing terminology. However, the fictional user numbers do not prove that the service requires an elaborate interface or extensive customization.

Fourth, hand over installation instructions, configuration details, a release identifier and a basic operating guide. Explain how to start the service and report an error. Staff should back up the booking database every day and check that the backup file exists. These instructions should allow the department to operate the service independently. This is preferable to depending on the original developer whenever something goes wrong, although the available hosting arrangements remain unknown.

Finally, agree a support plan naming a contact, an issue recording method and a procedure for releasing fixes. With four weeks for delivery and only two support hours per week, prioritize the booking workflow over optional reminders, analytics or a mobile application. A smaller initial scope leaves time for testing and handover, but it postpones convenience features. The two hour support limit is a fictional capacity assumption, not evidence that every incident can be resolved within that time.

The scenario details and proposed procedures are assumptions or recommendations. Verify the general claims about software deliverables and the limits of testing in authoritative sources. Hosting, staff skills and recovery requirements still need agreement before implementation..
```

**Response:**

```text
1. Verify the two general engineering claims. The statements that professional software includes documentation and configuration information, and that testing cannot establish the absence of defects, are plausible but currently unsupported. They matter because they justify the delivery package and the limits placed on acceptance evidence. Check the author's chapter on introductory software engineering and an authoritative testing syllabus. A counterexample to an overly broad interpretation is a tiny script needing only a short README: the general principle does not require a large documentation package.

2. Make the simultaneous booking criterion precise. "Only one booking should be confirmed" permits zero confirmations, even when both requests are valid and the service is available. It also leaves unclear whether approval or the initial request reserves an item. Agree the reservation rule with the fictional customer, then specify the starting conditions and expected outcomes for overlapping requests. Check the proposed criterion against an acceptance test design, including cancellation and repeated requests. A legitimate alternative is to hold both requests pending until staff choose one, but that needs a different acceptance criterion. Do not describe the chosen rule as already implemented.

3. Challenge the backup recommendation. A daily manual backup and a check that a file exists are not sufficient evidence of recoverability, and their workload has not been estimated against two support hours per week. A file could exist but be unusable in a recovery attempt. Reject file existence as the acceptance criterion; qualify the proposed daily frequency until acceptable data loss and recovery time are agreed. Check a sample restore in a separate environment and estimate the recurring work. An alternative is an automated backup process with periodic recovery exercises. The draft cannot claim that either approach already meets the capacity limit.

4. Qualify the promise of independent operation. Written instructions alone do not show that the two staff members can use unfamiliar hosting or recover the service. This matters because the department is supposed to receive a maintainable service, not continuing dependence on the developer. Check the handover through an observed exercise: a student submits a request, while staff approve it, record collection and follow the incident instructions. Include an agreed recovery exercise for the designated operator. A counterexample is a complete manual that assumes administrator skills the staff do not have. If the exercise fails, simplify the procedure, provide training or agree escalation; do not assume that a manual solves the skills gap.
```

### B3 — Revision (Prompt C)

- **Tool:** Codex
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** revision using the recorded review decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: These are the assistant's proposed review decisions for the student to review. B point 1: accept source checking; qualify the documentation/configuration claim to the part supported by Sommerville's slides, and keep the testing limitation supported by ISTQB. B point 2: qualify the vague booking criterion; propose that requests remain pending and staff approval creates the reservation, then require exactly one confirmation from two valid simultaneous approval attempts for the same available item and interval. B point 3: reject file existence as evidence of recoverability; qualify the daily frequency until acceptable data loss and recovery time are agreed, propose automation subject to hosting support, and require a sample restore and an estimate against two support hours per week. B point 4: qualify independent operation; require a student/staff walkthrough and operator recovery exercise, with training or escalation if necessary. No proposed acceptance or recovery tests have actually been executed because this is an analysis assignment.. Verified evidence: Source check 1: Sommerville, I. (2014), Ch1 introduction, companion slides for Software Engineering, 10th edition, slides 7 and 12, https://www.slideshare.net/slideshow/ch1-introduction-42645973/42645973 (accessed 2026-10-11). The slides cover associated documentation and engineering through maintenance; the specific configuration artifact remains a scenario recommendation. Decision: qualify. Source check 2: International Software Testing Qualifications Board (2024), Certified Tester Foundation Level Syllabus, v4.0.1, section 1.3, principle 1, p. 17, https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf (accessed 2026-10-11). Passing tests cannot demonstrate that all defects have been eliminated. Decision: keep. Codex opened and read these materials after Prompt B. The student's independent reading has not yet been confirmed.. Draft: In this fictional scenario, delivering working booking code would not be enough. The customer needs a usable service that sixty students and two equipment desk staff can understand, accept and operate. Professional software includes documentation and configuration information as well as executable code. The delivery package should therefore connect the department's purpose, agreed behaviour, evidence of testing and arrangements for continued operation.

First, provide a short requirements and acceptance checklist. It should explain who may request equipment, who approves requests, when a reservation becomes confirmed, and how cancellations and returns affect availability. These rules are proposals because the scenario does not specify them. Clear acceptance criteria turn an attractive demonstration into something the customer can evaluate. For example, when two students request the same item for overlapping times, only one booking should be confirmed.

Second, deliver test results for the important workflows: requesting, approving, cancelling, collecting and returning equipment. Include a simultaneous request test because double booking is the stated risk. Testing can reveal defects, but it cannot establish that no defects remain. The report should identify the tested version, conditions and any unresolved problems. A successful demonstration with one user would not exercise the concurrency risk. The proposed acceptance checklist should require the conflicting request test to pass.

Third, supply a simple interface and concise user guidance. Students should see whether an item is available, whether their request is pending, and whether collection has been approved. Staff need an understandable way to record collection and return. A short walkthrough with representative users would help identify confusing terminology. However, the fictional user numbers do not prove that the service requires an elaborate interface or extensive customization.

Fourth, hand over installation instructions, configuration details, a release identifier and a basic operating guide. Explain how to start the service and report an error. Staff should back up the booking database every day and check that the backup file exists. These instructions should allow the department to operate the service independently. This is preferable to depending on the original developer whenever something goes wrong, although the available hosting arrangements remain unknown.

Finally, agree a support plan naming a contact, an issue recording method and a procedure for releasing fixes. With four weeks for delivery and only two support hours per week, prioritize the booking workflow over optional reminders, analytics or a mobile application. A smaller initial scope leaves time for testing and handover, but it postpones convenience features. The two hour support limit is a fictional capacity assumption, not evidence that every incident can be resolved within that time.

The scenario details and proposed procedures are assumptions or recommendations. Verify the general claims about software deliverables and the limits of testing in authoritative sources. Hosting, staff skills and recovery requirements still need agreement before implementation..

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Revised explanation

The fictional department needs a service that sixty students and two desk staff can use and continue operating after handover. Code is one deliverable, alongside agreed requirements, acceptance evidence, usable instructions and support responsibilities. Sommerville's introductory slides include associated documentation in the concept of software and cover engineering through maintenance (Sommerville, 2014, slides 7 and 12). Those slides do not prescribe this project's configuration package; that is a recommendation based on the scenario.

The first engineering decision is to document the reservation policy before implementing it. A proposed policy is that student requests remain pending until staff approval creates a reservation. For one available item and interval, two valid simultaneous approval attempts must produce exactly one confirmation; the other attempt must report a conflict. This is more precise than "only one" and makes the double booking risk testable. The customer must still approve this hypothetical policy.

Deliver acceptance results for requesting, approval, cancellation, collection and return, including the conflict case. Identify the release, starting state, expected result, actual result and unresolved failures. Passing these cases is bounded evidence, not proof of universal correctness (ISTQB, 2024, section 1.3, principle 1, p. 17). No acceptance tests have been executed for this analysis assignment.

The second decision is to keep the handover small enough for four weeks while making staff operation observable. Provide a student quick guide and an operator guide covering deployment, configuration, routine operation, incident reporting and recovery. A student should demonstrate a booking request, and both staff members should demonstrate their normal workflow. The designated operator should also follow the recovery procedure. If these exercises expose missing skills, revise the instructions, train the operator or agree escalation rather than promising independence.

Replace the daily manual backup instruction with a recovery plan. Agree acceptable data loss and recovery time before choosing a backup frequency. Propose automated backup creation where the hosting supports it, then restore a sample backup in a separate environment and record the outcome. Estimate backup monitoring and recovery practice against the two hour weekly support limit; automation is not a guarantee that the limit will be met.

Name a support contact, an issue recording method and a fix release procedure. Defer reminders, analytics and a separate mobile application so that requirements, tests and handover receive time within the four week delivery period. This reduces initial scope but delays convenience features. The service should enter use only after the customer accepts the remaining operational limits.

What changed and why

- Narrowed the documentation claim to the supplied slides; configuration remains a scenario recommendation.
- Replaced the ambiguous simultaneous request criterion with a defined approval policy and an exactly one outcome.
- Replaced backup file existence with an agreed recovery target, a sample restore and a workload estimate.
- Replaced the promise of independent operation with observed handover exercises and escalation.

Remaining gaps

Hosting capabilities, staff skills, affordable recovery targets and actual support effort are unknown. All workflows and tests remain proposals. The student still needs to review these decisions, independently read the sources and edit the final answer.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Professional software includes documentation and configuration information as well as executable code. | Sommerville, Ch1 introduction, slides 7 and 12; https://www.slideshare.net/slideshow/ch1-introduction-42645973/42645973 ; accessed 2026-10-11. | Associated documentation is supported; the specific configuration deliverable is retained only as a scenario recommendation. | qualify |
| Testing can reveal defects, but it cannot establish that no defects remain. | ISTQB, Certified Tester Foundation Level Syllabus v4.0.1, section 1.3, principle 1, p. 17; https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf ; accessed 2026-10-11. | Successful cases cannot establish that all defects have been eliminated. | keep |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| For example, when two students request the same item for overlapping times, only one booking should be confirmed. | With an available item, two valid concurrent approval attempts for identical dates must yield one confirmation and one conflict message. | The double booking risk requires a precise conflict criterion. Staff approval now defines the reservation step; zero confirmations no longer satisfies this valid-request case. |
| Staff should back up the booking database every day and check that the backup file exists. | Accept recovery only after a sample restore into a separate environment; record the agreed data loss and recovery limits, and estimate recurring work against two weekly support hours. | The two hour weekly support constraint requires an effort estimate; an existing file does not demonstrate a completed recovery. Daily frequency is not justified without recovery targets. |
| These instructions should allow the department to operate the service independently. | Before acceptance, a student and both staff members must complete their tasks using the guides, with misunderstandings logged for correction. | The scenario has two staff members and limited support. An observed handover exposes skills or guidance gaps instead of assuming that instructions establish independence. |
