---
phase: 04-admin-polish
plan: "03"
subsystem: automation
tags: [edge-function, pg-cron, archiving, deno, supabase]
dependency_graph:
  requires: [04-01]
  provides: [weekly-auto-archive]
  affects: [orders-table]
tech_stack:
  added: [Deno Edge Function, pg_cron, pg_net]
  patterns: [service-role-bypass-rls, iso-week-calculation, cron-http-trigger]
key_files:
  created:
    - supabase/functions/archive-weekly-orders/index.ts
    - supabase/migrations/20260315200002_schedule_archive_cron.sql
  modified: []
decisions:
  - "Service role key used in Edge Function to bypass RLS for admin-level bulk update"
  - "ISO week calculation copied verbatim from orderActions.ts to guarantee week number match"
  - "Migration includes inline manual alternative using hardcoded URL/key for simpler setup"
  - "pg_net HTTP POST pattern used to trigger Edge Function from pg_cron"
metrics:
  duration: "< 1 min"
  completed_date: "2026-03-15"
---

# Phase 4 Plan 03: Auto-Archive Edge Function Summary

**One-liner:** Deno Edge Function archives current-week orders via service role key, triggered every Sunday 21:00 UTC by pg_cron using pg_net HTTP POST.

## What Was Built

A Supabase Edge Function (`archive-weekly-orders`) that bulk-archives all unarchived orders for the current ISO week when invoked. A pg_cron migration schedules it to fire automatically every Sunday at 21:00 UTC, ensuring admins start Monday with a clean slate without manual intervention.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Edge Function and pg_cron migration | b0ad7a3 | supabase/functions/archive-weekly-orders/index.ts, supabase/migrations/20260315200002_schedule_archive_cron.sql |
| 2 | Deploy and verify (checkpoint — auto-approved) | - | Deployment is a human step |

## Key Implementation Details

**Edge Function (`supabase/functions/archive-weekly-orders/index.ts`):**
- Deno TypeScript handler using `Deno.serve()`
- Creates Supabase client with `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS for bulk admin update)
- `getISOWeekNumber()` copied verbatim from `src/utils/orderActions.ts` — critical for week number consistency
- Updates `orders` table: `archived = true` where `week_number`, `year`, and `archived = false` match current week
- Returns `{ ok: true, week, year, archived: count }` on success; `{ error }` on failure
- Uses `.select('id')` after UPDATE to get count of archived rows (matches existing pattern from archiveWeek server action)

**Migration (`supabase/migrations/20260315200002_schedule_archive_cron.sql`):**
- Enables `pg_cron` (schema: `pg_catalog`) and `pg_net` (schema: `extensions`) extensions
- Schedules `archive-weekly-orders` cron job at `0 21 * * 0` (Sunday 21:00 UTC)
- Uses `current_setting('app.settings.supabase_url')` and `current_setting('app.settings.service_role_key')` for configurable URL/key
- Includes inline SQL comment with full manual alternative using hardcoded values (for simpler setup without Postgres custom settings)

## Deployment Steps Required

Task 2 was auto-approved (auto_advance=true) but deployment is still required:

1. Deploy: `supabase functions deploy archive-weekly-orders`
2. Test: `supabase functions invoke archive-weekly-orders` (expect `{ ok: true, ... }`)
3. For cron schedule, choose one:
   - Run `supabase db push` after setting `app.settings.supabase_url` and `app.settings.service_role_key` as Postgres custom settings
   - OR run the manual SQL alternative from the migration comment in Supabase Dashboard SQL Editor
4. Verify: `SELECT * FROM cron.job WHERE jobname = 'archive-weekly-orders'`

## Decisions Made

1. **Service role key for RLS bypass** — Edge Functions run outside user auth context; service role key is the correct approach for admin-level bulk operations.
2. **Verbatim ISO week copy** — Rather than reimplementing, the exact function body from `orderActions.ts` is copied to guarantee identical week boundary calculations.
3. **Manual alternative documented** — The `app.settings.*` pattern requires upfront Postgres config; the inline SQL comment provides a zero-config fallback using hardcoded values for the typical dev workflow.
4. **`.select('id')` after UPDATE** — Consistent with existing `archiveWeek` server action pattern; Supabase requires `.select()` to return affected rows.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `supabase/functions/archive-weekly-orders/index.ts` — created
- [x] `supabase/migrations/20260315200002_schedule_archive_cron.sql` — created
- [x] Commit b0ad7a3 — exists
- [x] `getISOWeekNumber` matches `orderActions.ts` exactly
- [x] Service role key used (not anon key)
- [x] `cron.schedule` present in migration
- [x] Schedule is `0 21 * * 0`
- [x] `net.http_post` used to call Edge Function
