# Week 06 — Lab report

**Name:** Abylaikhan
**Group:** Monday, 16:00-19:00
**Date:** 18.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72149724 |
| Browser and version | Google Chrome (Версия: 155.0.8059.80 (официальная сборка) (64 бит)) |
| If you could not use Bolt.new: the tool you used instead, and why | Not applicable — Bolt.new was used. |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The prototype may reject 11:00–12:00 as overlapping an existing booking from 10:00–11:00, although the endpoints only touch. | AC4 | Not confirmed. The touching request showed only a current-time error; T1 could not be run with now=09:00. |
| 2 | The prototype may use the computer's current time without letting me supply 09:00, making T6 impossible to set up correctly. | AC1 | Yes. v1 uses the device clock and offers only refresh, so I could not supply 09:00. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
src/App.tsx — the whole app: sample data, availability logic (evaluateAvailability), and UI components (Header, VerdictCard, RoomScheduleCard, Field)
src/index.css — added a shared .input style for form fields
```

**What v1 does — one line per thing that works, or visibly does not:**

- Provides a room selector, start/end time inputs, a duration display and a Check availability button.
- Includes Science Lab A with one existing booking from 10:00 to 11:00.
- Uses the device clock as the current time and offers a refresh button, but provides no input for supplying a different current time.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Not testable | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Not testable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Not testable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Not testable | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Not testable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Not testable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Not testable | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Not testable | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Cannot supply the current time (AC1) | Select Science Lab A, enter 11:00–12:00 and check. With supplied current time 09:00, the expected result is Available. The page instead uses device time 18:13, offers no input for 09:00 and displays Unavailable: Start time must be after the current time. | High | Fix |
| 2 | Blocked-room sample data does not match the prescribed T3 setup (§6) | Select Auditorium B (blocked). The required booking is 10:00–11:00, but its schedule shows 08:00–09:00. Science Lab A has the required booking but provides no control to set it to blocked. | Medium | Fix |
| 3 | Unnecessary backend/database dependency | check_prototype.py reports P3 FAIL at prototype/package.json:14. The frontend-only prototype should not need @supabase/supabase-js, but this dependency remains in the export. | Medium | Remove unused dependency |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, selecting Science Lab A, entering 11:00–12:00 and trying to supply current time 09:00 produces no way to set the current time; the page instead uses the device clock and rejects the request as being in the past, but AC1 requires evaluating the request against the supplied current time, so this request should be Available when the current time is 09:00. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.

I'll add a user-editable current time field so AC1 evaluates against the supplied time, not the device clock.


Read
src/App.tsx
Open
I'll make the current time user-editable via a time input, keeping the device clock as the default and a "use device time" button.


0123456789
 actions taken
Build passes.

What I changed: In src/App.tsx (the App component), I added an editable "Current time" time-input field in the form, plus a currentTime string state that mirrors currentMin. The verdict now evaluates against the user-supplied current time (falling back to the device clock if the field is empty), and the old refresh button became a "use device time" reset. The evaluation logic itself is unchanged, so AC2–AC6 are preserved.

Why: AC1 requires evaluating the request against the supplied current time, but the prototype only used the device clock — so 11:00–12:00 against a supplied 09:00 was wrongly rejected as past. Now setting the current time to 09:00 and choosing Science Lab A (which only has Chemistry Lab 10:00–11:00) with 11:00–12:00 yields Available, since the start is after 09:00 and the interval only touches the existing booking at 11:00.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only the SAMPLE_ROOMS fixture and its schedule display in src/App.tsx (the prescribed T3 setup needs a blocked room whose only booking is 10:00–11:00, but Auditorium B currently shows 08:00–09:00) for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.


Read
src/App.tsx
Open
The fixture mismatch is the cleanup: Auditorium B's only booking is 08:00–09:00, but the prescribed T3 setup wants the blocked room's sole booking at 10:00–11:00. Aligning it keeps AC1–AC6 intact (a blocked room is rejected by AC3 regardless of its bookings), and makes the schedule display match the expected test setup.


0123456789
 actions taken
Cleanup applied: In src/App.tsx, I changed Auditorium B's only booking from 08:00–09:00 (480–540 min) to 10:00–11:00 (600–660 min).

Why: The fixture now matches the prescribed T3 setup — a blocked room whose single booking is 10:00–11:00 — so the schedule display stops contradicting the documented test data. It's the smallest change that fixes the mismatch. AC1–AC6 are preserved: Auditorium B stays blocked and is still rejected by AC3 regardless of the booking times, the booking display is read-only (AC5), and no validation logic was touched.
```

**Another Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only package.json and package-lock.json for the unnecessary @supabase/supabase-js dependency in this frontend-only prototype for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.

Searched
supabase
Open
Confirmed — the app never imports Bolt Database. I'll remove the unused dependency from package.json and regenerate the lock file.

0123456789
 actions taken
Build passes.

Cleanup applied: Removed @supabase/Bolt Database-js from package.json dependencies and regenerated package-lock.json via npm install.

Why: The app uses in-memory React state with fictional sample data and never imports the Bolt Database client, so the dependency was dead weight — and confusing, since its presence implied a backend that doesn't exist. Removing it doesn't touch any application code, so AC1–AC6 are fully preserved.
```


Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Added an editable Current time field and used its value for availability checks | accept | AC1 requires comparison against the supplied current time. | T1, T2, T4–T9 passed. T3 remained Not testable because the blocked-room fixture does not match the required setup. |
| 2 | Kept device time as the default, added a reset button and an empty-field fallback | accept | These remain within the one-page scope and allow an explicit supplied time. The active validation time is displayed. | All runnable cases passed with an explicitly entered 09:00. Reset and empty-field fallback were not separately tested. |
| 3 | Changed Auditorium B's sole sample booking from 08:00–09:00 to 10:00–11:00 | accept | Matches the prescribed T3 setup in README §6. AC3 still rejects the blocked room; the correction changes fictional fixture data without adding features. | T3 passed after reloading preview. All nine cases T1–T9 passed on the final version; T8 remained Available twice without changing bookings, and T9 passed at 375 px. |
| 4 | Removed the unused @supabase/supabase-js dependency; Bolt reported regenerating package-lock.json | accept | The scope excludes backend and database functionality. Removing an unused dependency preserves AC1–AC6. | P3 changed from FAIL to PASS. T1–T9 were repeated after cleanup and all passed. |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Cannot supply the current time (AC1) | Accept fix | src/App.tsx — added an editable Current time input used by availability validation. | T1, T2, T4–T9 passed with now=09:00. T3 remained Not testable because of issue-2. |
| 2 | Blocked-room fixture did not match the prescribed T3 setup | Accept cleanup | src/App.tsx — SAMPLE_ROOMS: changed Auditorium B's only booking from 480–540 to 600–660 minutes. | After reloading preview, T3 showed the required booking and rejected the blocked request. All nine final cases passed. |
| 3 | Unnecessary Supabase dependency caused P3 FAIL | Accept cleanup | package.json — removed @supabase/supabase-js; package-lock.json regenerated by Bolt. | P3 passed. All nine cases passed after cleanup; final screenshots updated. |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/App.tsx`

<!-- Write your explanation below this line -->
The evaluateAvailability function checks whether a selected room is available for a requested interval. It receives the room, start and end times in minutes, and the supplied current time. It checks that the interval is within the day, starts before it ends, begins strictly after the supplied time, and lasts no more than 120 minutes. It also rejects blocked rooms and requests that overlap existing bookings. Strict comparisons allow touching endpoints. The function returns an object containing the availability decision and rejection reasons. The interface uses this result to display Available or Unavailable. Existing bookings are only read, never added, removed, or modified.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | none |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- The final page cannot express 23:00–24:00 because its time input does not accept 24:00. I chose to retain this as a documented interface limitation, as permitted by the assignment's open end-of-day decision. AC1 allows an end value of 1440, but the current interface does not expose that boundary. Entering 00:00 would mean the beginning of the same day, so it is not a valid substitute for 24:00.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- v1 used the device clock as the current time and provided only a refresh button. There was no way to supply 09:00, so I could not reproduce the exact T6 setup where start equals now. Although 09:00–09:30 was rejected when tested later in the day, that did not verify the equality boundary. The final version allows entering 09:00 explicitly, and T6 correctly returns Unavailable.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->

My expectation that v1 would utilize the device's clock without accepting an external current time was validated. This hindered the replication of T6 with both start and now set to 09:00. My expectation regarding the wrongful rejection of touching bookings could not be validated on v1 due to the current-time error hindering the required test.I agreed to three specific changes: a modifiable current-time field, fixed blocked-room sample data, and deletion of the unnecessary Supabase dependency. All suggestions were accepted. Nonetheless, it would have been incorrect to believe Bolt’s assertion that all criteria were maintained without verification. Following the fixture change, the preview first showed outdated data until it was refreshed.The prototype appeared complete prior to undergoing the necessary testing configuration. T6 showed that appearance alone was inadequate: it was only by providing 09:00 specifically that I could confirm the strict future-start rule. All nine instances were approved following the final cleanup, including multiple inspections without altering reservations and the mobile design. The documented interface limitation persists as a hindrance to entering 24:00.
