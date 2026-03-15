---
phase: 03-order-share
plan: 01
subsystem: ui
tags: [next.js, react, supabase, tailwind, canvas-confetti, server-actions]

# Dependency graph
requires:
  - phase: 02-name-selector
    provides: "?name= query param passed from Continue button on home page"
  - phase: 01-foundation
    provides: "orders table schema, supabase server client, auth check pattern"
provides:
  - "Server actions saveOrder and getPreviousOrder in src/utils/orderActions.ts"
  - "Full interactive order selection UI in src/app/order/OrderPageClient.tsx"
  - "Updated order/page.tsx Server Component rendering OrderPageClient with name and userId"
affects: [03-02, 04-admin-share]

# Tech tracking
tech-stack:
  added: [canvas-confetti, "@types/canvas-confetti"]
  patterns:
    - "Server actions in separate file from client components (orderActions.ts)"
    - "Server Component wrapper passing auth user.id and name param to client component"
    - "ISO 8601 week number with Thursday-based year derivation"
    - "maybeSingle() pattern for optional DB lookups (no throw on 0 results)"

key-files:
  created:
    - src/utils/orderActions.ts
    - src/app/order/OrderPageClient.tsx
  modified:
    - src/app/order/page.tsx
    - package.json

key-decisions:
  - "Server actions kept in separate file (orderActions.ts) per Next.js constraint — cannot be in same file as 'use client' component"
  - "Surprise Me ticker uses setInterval at 80ms over 20 ticks, auto-selects winner and switches tab on completion"
  - "Carbonara cream toggle implemented as inline pill toggle, stops event propagation to avoid conflicting with item selection"
  - "pendingOrder state stored for Plan 02 confirm/success screens — step state defaults to select"

patterns-established:
  - "OrderPageClient pattern: client component receives name and userId from server wrapper"
  - "Previous order re-select: find category/item indices in MENU by meal_name + meal_category match"

requirements-completed: [ORD-01, ORD-02, ORD-03, ORD-04, ORD-05, ORD-06]

# Metrics
duration: 12min
completed: 2026-03-15
---

# Phase 3 Plan 01: Order Selection UI Summary

**Interactive order page with 4-category tab menu, previous order shortcut, Surprise Me ticker animation, dual-price Carbonara toggle, and sticky submit — server actions ready for Plan 02 confirmation flow**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-15T18:40:53Z
- **Completed:** 2026-03-15T18:52:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Order selection UI rendering all 56 Posticino menu items across 4 tabs (Pizza, Pasta, Panini, Salad)
- Previous order card fetches from Supabase on mount, one-click re-selects meal and switches tab
- Surprise Me ticker animation cycles through all items at 80ms, lands on random winner, auto-selects and switches tab
- Sticky submit button shows selected meal name and price, disabled when nothing selected
- saveOrder and getPreviousOrder server actions ready for Plan 02 confirmation flow

## Task Commits

Each task was committed atomically:

1. **Task 1: Install canvas-confetti and create server actions** - `0b86dad` (feat)
2. **Task 2: Build OrderPageClient with full menu selection UI** - `f1e0e94` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `src/utils/orderActions.ts` - Server actions: saveOrder inserts order row, getPreviousOrder fetches most recent non-archived order by selected_name
- `src/app/order/OrderPageClient.tsx` - Full interactive client component: tabs, item selection, previous order shortcut, Surprise Me ticker, Carbonara toggle, special requests, sticky submit
- `src/app/order/page.tsx` - Server Component wrapper: auth check, extracts name param, renders OrderPageClient with name and userId
- `package.json` - Added canvas-confetti and @types/canvas-confetti

## Decisions Made
- Server actions in separate file per Next.js constraint (cannot mix 'use server' and 'use client' in same file)
- Used maybeSingle() not single() for previous order query to avoid throwing on no results
- Carbonara alt price toggle uses stopPropagation to avoid deselecting item when clicking the cream toggle
- pendingOrder state prepared for Plan 02 — step state set to 'confirm' on submit but confirm/success screens are stubs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npx tsc --noEmit src/utils/orderActions.ts` fails standalone due to path aliases — full project `npx tsc --noEmit` passes cleanly (0 errors), confirming correct compilation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Order selection step complete; Plan 02 can implement confirmation screen and success celebration using existing `step` state and `pendingOrder` state
- `saveOrder` server action is ready and tested — Plan 02 calls it on confirmation
- Confetti (canvas-confetti) is installed and ready for Plan 02 success screen

---
*Phase: 03-order-share*
*Completed: 2026-03-15*
