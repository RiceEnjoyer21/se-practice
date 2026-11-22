# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything. It does not override safety rules or the user's instructions.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room with fictional bookings only: no real names, timetables or personal data, and never add secrets (keys, passwords, `.env` files).

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; allow bookings that only touch at endpoints.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit any file in the project.
- Add packages only after the user approves them.
- Do not add a login, a database or any backend; bookings stay fictional and in memory.

## Before you finish

- Make sure the page still loads.
- Run `npm test` before you propose acceptance; all tests must pass, and show its real output. Never claim a run you did not make.
- Never deploy to Netlify or any other external service; a human decides on release.
