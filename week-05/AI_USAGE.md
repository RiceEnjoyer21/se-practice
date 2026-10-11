# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Сlaude | Sonnet 5.5 | The implementation plan (Task 1) | lab-report.md |
| Сlaude | Sonnet 5.5 | The first implementation, v1, and explanations of its conditions (Task 2) | code/booking.py, code/original/booking_v1.py, lab-report.md  |
| Сlaude | Sonnet 5.5 | Generating the tests, the additional edge case, and reviewing the implementation | code/test_booking.py, lab-report.md |

**The assistant wrote, or helped write, my tests in `code/`:** yes
<!-- Either answer is allowed. If "yes": say which tests, and how you checked that their EXPECTED
     values come from AC1–AC5 and not from what the generated code happens to return. -->
Claude generated all 19 tests. ChatGPT helped review their expected values and coverage. I checked the expected results against AC1–AC5 rather than treating the generated implementation as the oracle:

Touching endpoints are accepted under AC4.
A start equal to now is rejected under AC1.
Exactly 120 minutes is accepted, while 121 minutes is rejected under AC2.
Containment and a conflict with the last booking are rejected under AC4.
The immutability tests compare existing with a saved copy under AC5.
The last-minute request (1439, 1440) with now=1438 and no existing bookings satisfies AC1–AC5.

I ran the complete suite: all 19 tests passed. The checker also reported PASS for F1–F10 and M1–M10.

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:** None
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <Abylaikhan>
Date: 11.10.2026
