---
phase: 02-name-selector
plan: 01
subsystem: data-foundation
tags: [migration, seed, typescript, placeholder-page]
dependency_graph:
  requires: []
  provides: [location-schema, 18-member-seed, people-data-module, order-placeholder]
  affects: [02-02-interactive-map]
tech_stack:
  added: []
  patterns: [supabase-migration, server-component-auth, static-ts-data-module]
key_files:
  created:
    - supabase/migrations/20260315100001_add_profile_location_fields.sql
    - src/data/people.ts
    - src/app/order/page.tsx
  modified:
    - supabase/seed.sql
decisions:
  - "PEOPLE array in people.ts is a static client-side mirror of seed data — no DB query needed for map rendering"
  - "Org members sorted alphabetically in both seed.sql and people.ts for easy cross-reference"
  - "Order page uses Next.js 15 async searchParams (Promise<{name?: string}>) pattern"
metrics:
  duration: 8m
  completed_date: "2026-03-15"
  tasks_completed: 2
  files_created: 3
  files_modified: 1
---

# Phase 2 Plan 1: Data Foundation Summary

**One-liner:** Extended profiles schema with 5 location fields via migration, updated seed from 10 placeholder to 18 real org members with coordinates and emoji, created static TypeScript data module, and added /order placeholder page.

## What Was Built

### Task 1: Migration and seed update (commit 8e7f272)

Created `supabase/migrations/20260315100001_add_profile_location_fields.sql` that adds 5 nullable columns to `public.profiles`:
- `location_name text`
- `lat double precision`
- `lng double precision`
- `emoji text`
- `fun_label text`

All columns use `add column if not exists` for idempotency.

Updated `supabase/seed.sql` to replace 10 placeholder org members with 18 real team members. Each row now includes `location_name`, `lat`, `lng`, `emoji`, and `fun_label`. Members sorted alphabetically.

### Task 2: TypeScript data module and order page (commit ab8b17b)

Created `src/data/people.ts` exporting:
- `Person` interface with `name`, `locationName`, `lat`, `lng`, `emoji`, `funLabel`
- `PEOPLE` constant array with all 18 members — coordinates and emoji match seed.sql exactly

Created `src/app/order/page.tsx` as a protected Next.js 15 Server Component:
- Auth check via `supabase.auth.getUser()`, redirects to `/` if unauthenticated
- Accepts `?name=` query param, renders personalised placeholder message
- Route automatically protected by existing middleware matcher

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

- Migration file adds 5 columns with `if not exists` safety: confirmed
- Seed contains exactly 18 org member profiles: confirmed (`grep -c "gen_random_uuid(), null,"` = 18)
- `src/data/people.ts` exports `PEOPLE` (18 items) and `Person` type: confirmed
- `src/app/order/page.tsx` is a valid Server Component with auth check: confirmed
- `npm run build` passes with no TypeScript errors: confirmed (all 7 pages generated cleanly)

## Self-Check: PASSED

All created files confirmed on disk. Both task commits verified in git history.
