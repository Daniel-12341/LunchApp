---
phase: 04-admin-polish
plan: 02
subsystem: ui
tags: [framer-motion, fonts, pacifico, fredoka, page-transitions, mobile, tailwind, next-font]

# Dependency graph
requires:
  - phase: 03-order-share
    provides: OrderPageClient, NameSelectorPage, layout structure
  - phase: 04-admin-polish
    plan: 01
    provides: AdminPageClient
provides:
  - Pacifico cursive font on all main titles app-wide
  - Fredoka rounded font on sub-headers, buttons, tab labels app-wide
  - Framer Motion AnimatePresence page transitions (fade/slide) on all navigation
  - Mobile-safe card width on name selector (min(90vw,320px))
  - 44px min touch targets on tab bar and continue button
affects: all pages, future phases adding new UI

# Tech tracking
tech-stack:
  added: [framer-motion]
  patterns:
    - PageTransition component wraps children in layout.tsx using usePathname as AnimatePresence key
    - Font CSS variables injected via next/font/google variables on body element
    - .font-pacifico/.font-fredoka utility classes via @layer utilities in globals.css

key-files:
  created:
    - src/components/PageTransition.tsx
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/app/page.tsx
    - src/components/NameSelectorPage.tsx
    - src/app/order/OrderPageClient.tsx
    - src/app/admin/AdminPageClient.tsx
    - package.json

key-decisions:
  - "usePathname as AnimatePresence key (not FrozenRouter) to avoid internal Next.js import breakage"
  - "Fredoka weight 400 (variable-weight font, not Fredoka One which is deprecated)"
  - "Body text stays clean Arial/Helvetica sans-serif; Pacifico/Fredoka only applied to specific elements via utility classes"

patterns-established:
  - "Pattern 1: Page-level fade/slide transitions via single PageTransition wrapper in layout — no per-page animation code needed"
  - "Pattern 2: .font-pacifico for main h1 titles, .font-fredoka for sub-headers/buttons/labels"

requirements-completed: [UI-01, UI-02, UI-03, UI-04]

# Metrics
duration: 10min
completed: 2026-03-15
---

# Phase 4 Plan 02: Visual Polish — Fonts and Page Transitions Summary

**Pacifico cursive titles and Fredoka rounded UI text applied app-wide with Framer Motion fade/slide page transitions and mobile responsiveness pass**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-15T19:40:49Z
- **Completed:** 2026-03-15T19:50:49Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Installed framer-motion and created PageTransition component wrapping all page navigation with smooth fade/slide animation
- Replaced Geist fonts with Pacifico (titles) and Fredoka (UI elements) using next/font/google CSS variables
- Applied font classes across login, name selector, order, and admin pages — all main titles Pacifico, all sub-headers/buttons/labels Fredoka
- Mobile responsiveness pass: name selector card uses w-[min(90vw,320px)], tab bar buttons have min-h-[44px], Continue button has min-h-[44px]

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Framer Motion, replace fonts in layout, create PageTransition, update globals.css** - `95dbf5f` (feat)
2. **Task 2: Apply fonts across all pages and mobile responsiveness pass** - `04f5974` (feat)

## Files Created/Modified
- `src/components/PageTransition.tsx` - AnimatePresence wrapper using usePathname as key, motion.div fade/slide
- `src/app/layout.tsx` - Pacifico + Fredoka font imports, PageTransition wrapper around children
- `src/app/globals.css` - Removed geist font vars, added .font-pacifico/.font-fredoka @layer utilities
- `src/app/page.tsx` - Pacifico on "What's for lunch?", Fredoka on subtitle and button
- `src/components/NameSelectorPage.tsx` - Pacifico on "Who's hungry?", Fredoka on Continue button, mobile-safe card width
- `src/app/order/OrderPageClient.tsx` - Pacifico on h1 and "Order Placed!", Fredoka on tabs/buttons/labels, min-h-[44px] on tabs
- `src/app/admin/AdminPageClient.tsx` - Pacifico on dashboard titles, Fredoka on action buttons
- `package.json` - Added framer-motion dependency

## Decisions Made
- usePathname as AnimatePresence key (not FrozenRouter pattern) — avoids Next.js internal import issues noted in research
- Used Fredoka weight 400 (Fredoka One was merged/deprecated; Fredoka is the current variable-weight replacement)
- Body text left as Arial/Helvetica; Pacifico and Fredoka applied only to specific elements via utility classes to maintain readability
- Applied font classes to AdminPageClient.tsx proactively (Plan 01 had already executed, file existed)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Applied fonts to AdminPageClient.tsx**
- **Found during:** Task 2 (Apply fonts across all pages)
- **Issue:** Plan noted "if AdminPageClient.tsx exists when this task runs, add font classes there". Plan 01 had already run so the file existed with un-polished fonts
- **Fix:** Applied font-pacifico to "Admin Dashboard" title and empty state headings; font-fredoka to action buttons
- **Files modified:** src/app/admin/AdminPageClient.tsx
- **Verification:** Build passes, fonts consistent across all pages
- **Committed in:** 04f5974 (Task 2 commit)

---

**Total deviations:** 1 auto-applied (conditional plan instruction executed)
**Impact on plan:** Expected path per plan instructions. No scope creep.

## Issues Encountered
None - both tasks executed cleanly, build passed on first attempt for each task.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Visual polish complete — all pages use Pacifico/Fredoka fonts with page transitions
- Ready for any remaining Phase 4 plans (03+) if applicable
- Existing confetti, Surprise Me ticker, and map flyTo animations unaffected (no changes to those code paths)

---
*Phase: 04-admin-polish*
*Completed: 2026-03-15*

## Self-Check: PASSED

- src/components/PageTransition.tsx: FOUND
- src/app/layout.tsx: FOUND
- .planning/phases/04-admin-polish/04-02-SUMMARY.md: FOUND
- Commit 95dbf5f: FOUND
- Commit 04f5974: FOUND
