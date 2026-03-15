---
phase: 01-foundation
plan: 01
subsystem: database
tags: [postgres, supabase, rls, migrations, seed, pgcrypto]

requires: []

provides:
  - "public.profiles table with id (plain UUID), auth_user_id (nullable FK), username, role, created_at"
  - "public.orders table with all 11 columns and user_id FK to auth.users"
  - "RLS enabled on both tables with 5 policies total"
  - "supabase/seed.sql with 2 auth accounts + 11 profiles (1 admin + 10 org members)"

affects:
  - 01-02-auth-ui
  - 02-order-form
  - 03-admin
  - 04-polish

tech-stack:
  added: []
  patterns:
    - "Profiles table uses plain UUID pk (no FK to auth.users) + nullable auth_user_id column for auth-linked rows"
    - "RLS admin role checks join on auth_user_id (not id) since id is not a FK to auth.users"
    - "Seed uses pgcrypto crypt() + gen_salt('bf') for bcrypt password hashing"
    - "auth.identities insert always paired with auth.users insert for signInWithPassword compatibility"

key-files:
  created:
    - supabase/migrations/20260315000001_create_profiles.sql
    - supabase/migrations/20260315000002_create_orders.sql
    - supabase/migrations/20260315000003_rls_policies.sql
    - supabase/seed.sql
  modified: []

key-decisions:
  - "profiles.id is a plain UUID primary key (no FK to auth.users) so org members without auth accounts can have profile rows; auth-linked rows use the separate nullable auth_user_id column"
  - "RLS policies use auth_user_id (not id) for admin role checks — critical because profiles.id is not a FK to auth.users"
  - "10 org member profiles seeded with auth_user_id = NULL; only the admin profile has auth_user_id set"

patterns-established:
  - "All schema changes go in supabase/migrations/ — never edited directly in Supabase dashboard"
  - "seed.sql uses a PL/pgSQL DO block with declared UUID variables for referential consistency across auth.users, auth.identities, and public.profiles inserts"

requirements-completed: [DB-01, DB-02, DB-03, AUTH-03, AUTH-04, AUTH-05]

duration: 18min
completed: 2026-03-15
---

# Phase 1 Plan 01: Database Schema and Seed Summary

**Postgres schema with profiles + orders tables, RLS policies, and seeded auth users via pgcrypto bcrypt in a PL/pgSQL DO block**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-15T16:18:04Z
- **Completed:** 2026-03-15T16:36:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Profiles table created with plain UUID pk and nullable auth_user_id FK, enabling org members (no auth accounts) to have profile rows
- Orders table created with all 11 required columns and RLS enabled
- 5 RLS policies implemented: 2 for profiles (select all, update own), 4 for orders (select, insert, update-user, update-admin)
- Seed file creates 2 Supabase Auth accounts with matching auth.identities rows and bcrypt-hashed passwords, plus 11 profiles

## Task Commits

Each task was committed atomically:

1. **Task 1: Create migration files for profiles, orders, and RLS policies** - `f56d75b` (feat)
2. **Task 2: Create seed file with auth users and org member profiles** - `c27ceba` (feat)

## Files Created/Modified

- `supabase/migrations/20260315000001_create_profiles.sql` - Profiles table DDL + RLS enable + 2 policies
- `supabase/migrations/20260315000002_create_orders.sql` - Orders table DDL + RLS enable
- `supabase/migrations/20260315000003_rls_policies.sql` - 4 RLS policies for orders (user isolation + admin read/update)
- `supabase/seed.sql` - Auth users, auth.identities, admin profile, and 10 org member profiles

## Decisions Made

- **profiles.id as plain UUID:** Org members have no Supabase Auth accounts. Using `id uuid references auth.users(id)` as the PK would block inserting org member rows. Resolution: `id` is a plain UUID PK; a separate nullable `auth_user_id uuid references auth.users(id)` column links auth-backed rows.
- **RLS join column:** Because `profiles.id` is not a FK to auth.users, all admin role checks in RLS policies use `WHERE auth_user_id = (select auth.uid())` rather than `WHERE id = (select auth.uid())`.
- **auth.identities always paired:** Both auth.users inserts have a matching auth.identities insert. Omitting this causes signInWithPassword to fail silently.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required beyond running `supabase db push` to apply migrations and seed.

## Next Phase Readiness

- Database schema and seed data are complete and ready for `supabase db push`
- Plan 01-02 (Auth UI) can now reference `public.profiles` and build the login form, middleware, and Supabase client utilities
- No blockers

---
*Phase: 01-foundation*
*Completed: 2026-03-15*
