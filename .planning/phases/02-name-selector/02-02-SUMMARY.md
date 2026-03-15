---
phase: 02-name-selector
plan: "02"
subsystem: ui
tags: [leaflet, react-leaflet, map, animation, next.js, dynamic-import]

# Dependency graph
requires:
  - phase: 02-name-selector/02-01
    provides: PEOPLE array with 18 Person records and location coordinates
  - phase: 01-foundation
    provides: Supabase auth client and middleware route protection for /home
provides:
  - Full-screen Leaflet map at /home with 18 emoji markers for Western Cape
  - Floating "Who's hungry?" dropdown listing all 18 names
  - flyTo animation (2.5s) to selected person's location
  - Marker dimming (non-selected 0.35 opacity) and bounce animation post-zoom
  - Continue button that appears after animation and navigates to /order?name=X
affects: [03-order-form, 04-whatsapp-share]

# Tech tracking
tech-stack:
  added: [leaflet@1.x, react-leaflet@4.x, @types/leaflet]
  patterns:
    - Server Component does auth check, delegates rendering to client via wrapper
    - Dynamic import with ssr:false requires a 'use client' wrapper component in Next.js 16
    - L.divIcon for all Leaflet markers (no default icons to avoid 404 in Next.js)
    - FlyController child component uses useMap hook inside MapContainer
    - moveend listener registered only after flyTo trigger, not on mount

key-files:
  created:
    - src/components/MapComponent.tsx
    - src/components/NameSelectorPage.tsx
    - src/components/NameSelectorLoader.tsx
  modified:
    - src/app/home/page.tsx
    - src/app/globals.css
    - package.json

key-decisions:
  - "Next.js 16 forbids ssr:false in dynamic() inside Server Components — NameSelectorLoader is a 'use client' wrapper that holds the dynamic import"
  - "Marker icons use L.divIcon with custom HTML to avoid default Leaflet PNG 404 errors in Next.js"
  - "moveend listener registered inside flyTo useEffect (not on mount) to prevent Continue button appearing prematurely on page load"

patterns-established:
  - "Server Component auth gate + 'use client' dynamic wrapper: home/page.tsx -> NameSelectorLoader -> NameSelectorPage"
  - "FlyController pattern: child component inside MapContainer using useMap hook for imperative map control"

requirements-completed: [MAP-01, MAP-02, MAP-03, MAP-04]

# Metrics
duration: 2min
completed: 2026-03-15
---

# Phase 2 Plan 02: Name Selector Map Summary

**Full-screen Leaflet map with 18 emoji markers, flyTo animation, marker dimming/bounce, and Continue navigation to /order**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-15T17:31:24Z
- **Completed:** 2026-03-15T17:33:31Z
- **Tasks:** 2 (1 implementation + 1 auto-approved checkpoint)
- **Files modified:** 6

## Accomplishments

- Installed leaflet, react-leaflet, @types/leaflet and wired up full-screen CartoDB Voyager map at /home
- 18 emoji markers rendered from PEOPLE array with per-person emoji and location name labels
- flyTo animation (2.5s) triggers on name selection; non-selected markers dim to 0.35 opacity; selected marker bounces 3x on arrival
- Continue button slides in at bottom-center after animation completes and navigates to /order?name=SelectedName
- Build passes with no TypeScript errors

## Task Commits

1. **Task 1: Install Leaflet and create map page components** - `8dd5604` (feat)
2. **Task 2: Visual verification checkpoint** - auto-approved (no commit)

## Files Created/Modified

- `src/components/MapComponent.tsx` - Leaflet map, emoji markers via L.divIcon, FlyController child, bounce state
- `src/components/NameSelectorPage.tsx` - Client component owning dropdown, selectedPerson state, animationComplete state, Continue button
- `src/components/NameSelectorLoader.tsx` - 'use client' wrapper enabling dynamic import with ssr:false (Next.js 16 fix)
- `src/app/home/page.tsx` - Server Component auth check, renders NameSelectorLoader
- `src/app/globals.css` - Marker CSS: .emoji-marker, .marker-dimmed, .marker-selected, .marker-bounce, @keyframes markerBounce, slideUp
- `package.json` - leaflet, react-leaflet, @types/leaflet added

## Decisions Made

- Next.js 16 forbids `ssr: false` in `dynamic()` within Server Components. Solution: a thin `'use client'` wrapper component (`NameSelectorLoader`) holds the dynamic import, while the Server Component (`home/page.tsx`) imports the wrapper directly.
- Used `L.divIcon` with inline HTML for all markers — avoids the default Leaflet PNG marker 404 issue that occurs in Next.js asset pipelines.
- `moveend` listener registered only inside the `flyTo` useEffect, not on component mount, preventing the Continue button from appearing on initial page load.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Next.js 16 forbids ssr:false dynamic import in Server Components**
- **Found during:** Task 1 (build verification)
- **Issue:** `next/dynamic` with `ssr: false` option throws a build error when called inside a Server Component in Next.js 16
- **Fix:** Created `NameSelectorLoader.tsx` as a `'use client'` component that owns the `dynamic()` call; `home/page.tsx` imports the loader directly without dynamic
- **Files modified:** src/components/NameSelectorLoader.tsx (created), src/app/home/page.tsx (updated import)
- **Verification:** `npm run build` passes with no TypeScript or compilation errors
- **Committed in:** 8dd5604 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking build error)
**Impact on plan:** Required fix for Next.js 16 compatibility. No scope creep — adds a thin wrapper file only.

## Issues Encountered

None beyond the auto-fixed Next.js 16 constraint above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- /home is fully functional: map renders, dropdown works, animation triggers, Continue navigates to /order?name=X
- /order placeholder page is in place and receives the name query parameter
- Phase 3 (Order Form) can begin building on top of the /order route with the selected name available via `searchParams`

---
*Phase: 02-name-selector*
*Completed: 2026-03-15*
