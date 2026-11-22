# Smart Campus Room Availability Checker (SIS #04)

React + TypeScript + Vite. Fictional rooms and bookings only: no login, backend, network or storage.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev        # opens the page on http://localhost:5173
```

## Test

```bash
npx vitest run     # or: npm test
npx tsc --noEmit -p tsconfig.app.json   # type check
```

## Where things are

| File | What it does |
| --- | --- |
| `src/rooms.ts` | the catalog: `Room` type, `ROOMS` (5 fictional rooms), `EQUIPMENT` |
| `src/booking.ts` | `canBook` (AC1-AC5), `checkRoom` (the chosen room), `whyUnavailable` (reason texts) |
| `src/filter.ts` | `filterRooms` (F1 capacity >= attendees, F2 all selected equipment) |
| `src/time.ts` | `HH:MM` <-> minutes formatting |
| `src/App.tsx`, `src/components/` | the page: state and layout, no rules of its own |
| `src/*.test.ts` | Vitest tests (`booking.test.ts`, `filter.test.ts`) |
