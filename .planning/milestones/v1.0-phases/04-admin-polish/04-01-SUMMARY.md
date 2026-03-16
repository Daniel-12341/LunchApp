---
phase: 04-admin-polish
plan: 01
subsystem: ui
tags: [nextjs, supabase, server-actions, whatsapp, admin]

# Dependency graph
requires:
  - phase: 03-order-share
    provides: orders table with week_number, year, archived columns and saveOrder/getPreviousOrder server actions
  - phase: 01-foundation
    provides: admin auth pattern (getUser + profiles.role check), Supabase server client, Riivo colour tokens
provides:
  - Admin dashboard at /admin showing all current-week orders
  - getWeeklyOrders server action returning current-week unarchived orders
  - archiveWeek server action for bulk archive by week_number + year
  - WhatsApp export via wa.me/27711602891 with category-grouped message
  - Copy to clipboard with same message text
  - Archive Week confirmation dialog with unordered-people warning
  - Admin credential migration: admin/admin123 -> username123/password123
affects: [04-02, 04-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component fetches data and passes props to client AdminPageClient
    - archiveWeek returns count of archived rows using .select('id') after UPDATE
    - buildWhatsAppMessage pure client-side function grouping orders by CATEGORY_ORDER
    - stillToOrder computed from PEOPLE array diff against order selected_names

key-files:
  created:
    - src/utils/adminActions.ts
    - src/app/admin/AdminPageClient.tsx
    - supabase/migrations/20260315200001_update_admin_credentials.sql
  modified:
    - src/app/admin/page.tsx

key-decisions:
  - "getWeeklyOrders returns week+year alongside data so page.tsx can pass them to client without a second calculation"
  - "archiveWeek uses .select('id') after UPDATE to get count of archived rows (Supabase requires select to return updated rows)"
  - "Order type defined in AdminPageClient.tsx and re-used via import to avoid duplication"

patterns-established:
  - "Pattern: Admin Server Component — auth check + data fetch, then render <ClientComponent orders={...} weekNumber={week} year={year} />"
  - "Pattern: WhatsApp export — category-grouped lines array joined with newline, then encodeURIComponent on wa.me URL"

requirements-completed: [ADM-01, ADM-02, ADM-03, ADM-04]

# Metrics
duration: 10min
completed: 2026-03-15
---

# Phase 4 Plan 01: Admin Dashboard Summary

**Admin dashboard at /admin with live order list, category-grouped WhatsApp export, archive-week flow, and admin credential migration to username123/password123**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-15T19:40:44Z
- **Completed:** 2026-03-15T19:50:33Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Full admin dashboard showing all current-week unarchived orders (name, category emoji, meal, price, special requests)
- "This Week's Orders (X of 18)" count and "Still to order (N): ..." list computed from PEOPLE diff
- WhatsApp send + copy-to-clipboard buttons generating category-grouped message with emoji headers and total footer
- Archive Week with confirmation dialog, unordered-people warning, and clean empty state after archive
- Admin credential migration SQL for username123/password123

## Task Commits

1. **Task 1: Create admin server actions and credential migration** - `096c1a2` (feat)
2. **Task 2: Build admin page with order list, WhatsApp export, and archive** - `823c3ef` (feat)

## Files Created/Modified

- `src/utils/adminActions.ts` - Server actions: getWeeklyOrders (ISO week filter) and archiveWeek (bulk UPDATE + count)
- `src/app/admin/AdminPageClient.tsx` - Client component: order list, WhatsApp/copy/archive buttons, confirmation dialog, empty state
- `src/app/admin/page.tsx` - Server component: auth check + getWeeklyOrders call + render AdminPageClient
- `supabase/migrations/20260315200001_update_admin_credentials.sql` - Update auth.users, auth.identities, profiles for username123/password123

## Decisions Made

- `getWeeklyOrders` returns `{ data, week, year }` so the server page can pass week/year to the client without re-computing ISO week number
- Used `.select('id')` after the UPDATE in `archiveWeek` to get row count (Supabase returns updated rows when select is chained)
- `Order` type defined in `AdminPageClient.tsx` and exported — single source of truth for the admin order shape

## Deviations from Plan

None - plan executed exactly as written. The linter additionally applied `font-pacifico` and `font-fredoka` CSS utility classes to headings and button text in AdminPageClient, which aligns with Phase 4 UI requirements (Plan 02) without conflicting.

## Issues Encountered

None. TypeScript check and production build both passed cleanly on first attempt.

## User Setup Required

Admin credentials migration must be applied to the database:
- Run: `supabase db push` to apply `20260315200001_update_admin_credentials.sql`
- After push, login as `username123` / `password123` (email constructed as `username123@lunchapp.com` internally)

## Next Phase Readiness

- Admin dashboard complete and functional — ready for Phase 4 Plan 02 (fonts, page transitions, visual polish)
- No blockers
- WhatsApp number hardcoded to +27711602891 per plan specification

---
*Phase: 04-admin-polish*
*Completed: 2026-03-15*

## Self-Check: PASSED

- FOUND: src/utils/adminActions.ts
- FOUND: src/app/admin/AdminPageClient.tsx
- FOUND: src/app/admin/page.tsx
- FOUND: supabase/migrations/20260315200001_update_admin_credentials.sql
- FOUND commit: 096c1a2
- FOUND commit: 823c3ef
