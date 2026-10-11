# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.1

---

## 1. Scenario

**Question:** What must the customer receive beyond code to operate and maintain a university equipment booking service?

**Users:** Sixty students book cameras and laptops; two desk staff approve requests and record collection and return.

**Problem:** Spreadsheet bookings make availability unclear. The department needs a browser service with agreed reservation rules and a practical handover.

**Constraints:** Delivery within four weeks; technical support limited to two staff hours per week.

**Risk:** Concurrent bookings could allocate one item twice, leaving a student without equipment for coursework.

**Assumptions:** All department details, user numbers, equipment, spreadsheet problems, service plans, constraints and failure risks are fictional.

## 2. Analysis

The customer needs agreed booking rules, acceptance evidence, user guidance and an operating plan alongside the code. Sommerville includes associated documentation within software (2014, slide 7). Configuration notes are a scenario recommendation. The package must help sixty students and two desk staff use the service without depending on its original developer for every routine action.

The first engineering decision is to define when a request reserves equipment. The proposed policy keeps requests pending until staff approval. With an available item, two valid concurrent approval attempts for identical dates must yield one confirmation and one conflict message. The customer must approve this rule before development. It addresses double booking directly; checking an availability screen alone would not exercise concurrent approvals.

Acceptance records should cover requests, approvals, cancellations, collection and return. For each case, identify the release, starting conditions, expected result, observed result and unresolved failures. Include cancellation followed by another request to check availability changes. Passing cases cannot establish that every defect has been removed (ISTQB, 2024, section 1.3). These checks are proposed, not executed on an implemented service.

The second decision is to combine concise guides with an observed handover. Students need availability, request status and collection instructions. Operators need setup, configuration, incident reporting and recovery procedures. Before acceptance, a student and both staff members must complete their tasks using the guides, with misunderstandings logged for correction. This checks whether the handover supports actual work rather than assuming that a manual guarantees independence.

Accept recovery only after a sample restore into a separate environment; record the agreed data loss and recovery limits, and estimate recurring work against two weekly support hours. Choose backup frequency from those limits. Automate creation only if the hosting supports it. Hosting capabilities and staff skills remain unknown; checking that a backup file exists does not demonstrate recovery.

The support plan should name an owner, issue channel, escalation route and fix release procedure. Defer reminders, analytics and a separate mobile application to preserve testing and handover time within four weeks. This postpones convenience features. The support allowance describes capacity, not a guaranteed incident resolution time; the customer must accept that limitation.

## 3. Review

Prompt B point 1 was accepted as a request for evidence, not independent proof. Verification row 1 qualifies the documentation/configuration claim: Sommerville's slide 7 supports documentation; configuration notes remain a scenario recommendation. Verification row 2 keeps the testing limitation, supported by ISTQB section 1.3, principle 1. Neither source establishes the department's recovery needs.

Point 2 was qualified. "Only one" allows zero confirmations; alternatively, both student requests could remain pending. The revised policy makes staff approval the reservation step and requires one confirmation and one conflict message from two valid concurrent approvals. Change-log row 1 ties that correction to double booking. Customer agreement remains necessary.

Point 3 was partly rejected and partly qualified. Backup file existence was rejected as sufficient recovery evidence. Daily frequency was qualified because acceptable data loss, hosting and recurring effort are unknown. Change-log row 2 replaces it with a sample restore, recovery limits and a workload estimate against two weekly support hours. Automation remains conditional.

Point 4 was qualified: instructions do not establish independent operation. Change-log row 3 requires a student and both staff members to complete their tasks using the guides. A manual assuming unfamiliar hosting skills is a counterexample; training or escalation may still be needed.

Codex checked the sources and prepared these decisions and revisions. The student confirmed understanding; independent reading remains unconfirmed. No product tests or usability exercises were executed. The student requested pushing only at the end, contrary to README's required order. This is disclosed rather than presented as a completed workflow step.

## 4. Conclusion

Deliver the core booking workflow with agreed reservation rules, acceptance records, concise guides, recovery instructions and named support responsibilities. Launch should require the conflict case and handover exercises to meet agreed criteria, with remaining issues recorded. Defer optional features to protect testing and handover time within four weeks.

The main limitation is uncertain operating effort. Two weekly support hours may not cover unfamiliar hosting or manual recovery. Before launch, agree recovery targets, estimate recurring work and identify escalation. If these do not fit capacity, reduce scope or postpone launch. Written instructions and successful acceptance cases cannot guarantee that staff will handle every incident independently.

## 5. Reflection

My five initial ideas covered the product's purpose, acceptance criteria, usability, instructions and support. I supplied them in Russian and used Codex to translate them without adding ideas. They helped keep the work focused on what a customer needs beyond code.

The draft required more precise acceptance criteria. The report now defines staff approval as the reservation step and expects one confirmation and one conflict message from two valid concurrent approvals. It also replaces checking that a backup file exists with a sample restore and recovery limits.

I asked for shorter wording while retaining the assignment's word limits and complete AI exchanges. I reviewed the report and confirmed that I understand its reasoning. Source checking was delegated to Codex, so I cannot describe it as my own independent verification. I also chose to postpone pushing until the end, despite the README's earlier push requirement.

The main lesson from this process is that delivery includes acceptance evidence and operational responsibility. Clear instructions still need a practical handover, and limited support capacity requires explicit trade-offs.

## 6. References

- Sommerville, I. (2014). Ch1 introduction. Companion slides for Software Engineering, 10th edition; slides dated 30 October 2014, slides 7 and 12. https://www.slideshare.net/slideshow/ch1-introduction-42645973/42645973 . Accessed 2026-10-11.
- International Software Testing Qualifications Board. (2024). Certified Tester Foundation Level Syllabus, v4.0.1, released 15 September 2024. Section 1.3, principle 1, p. 17. https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf . Accessed 2026-10-11.

## 7. Appendix A — Initial outline

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

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Professional software includes documentation and configuration information as well as executable code. | Sommerville, Ch1 introduction, slides 7 and 12; https://www.slideshare.net/slideshow/ch1-introduction-42645973/42645973 ; accessed 2026-10-11. | Associated documentation is supported; the specific configuration deliverable is retained only as a scenario recommendation. | qualify |
| Testing can reveal defects, but it cannot establish that no defects remain. | ISTQB, Certified Tester Foundation Level Syllabus v4.0.1, section 1.3, principle 1, p. 17; https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf ; accessed 2026-10-11. | Successful cases cannot establish that all defects have been eliminated. | keep |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| For example, when two students request the same item for overlapping times, only one booking should be confirmed. | With an available item, two valid concurrent approval attempts for identical dates must yield one confirmation and one conflict message. | The double booking risk requires a precise conflict criterion. Staff approval now defines the reservation step; zero confirmations no longer satisfies this valid-request case. |
| Staff should back up the booking database every day and check that the backup file exists. | Accept recovery only after a sample restore into a separate environment; record the agreed data loss and recovery limits, and estimate recurring work against two weekly support hours. | The two hour weekly support constraint requires an effort estimate; an existing file does not demonstrate a completed recovery. Daily frequency is not justified without recovery targets. |
| These instructions should allow the department to operate the service independently. | Before acceptance, a student and both staff members must complete their tasks using the guides, with misunderstandings logged for correction. | The scenario has two staff members and limited support. An observed handover exposes skills or guidance gaps instead of assuming that instructions establish independence. |
