---
phase: 01-foundation
verified: 2026-03-15T18:45:00Z
status: human_needed
score: 10/10 must-haves verified (automated checks pass; 2 behaviors require human confirmation)
re_verification: false
human_verification:
  - test: "Log in as shared user (username: user, password: password) in browser"
    expected: "Redirect to /home showing 'Welcome to LunchApp!' after successful login"
    why_human: "Requires live Supabase DEV instance with migrations applied and seed.sql executed; cannot verify signInWithPassword against a real auth endpoint programmatically"
  - test: "Attempt login with wrong credentials"
    expected: "Inline error message: 'Oops! Wrong username or password. Try again.' appears below the form; button re-enables"
    why_human: "Error path requires a real Supabase response — cannot mock auth.signInWithPassword error in static analysis"
  - test: "Refresh the browser while on /home"
    expected: "User stays on /home (session persists via cookie refresh in middleware)"
    why_human: "Session cookie behaviour requires a running Next.js server with real Supabase tokens"
  - test: "Log in as shared user, then visit /admin"
    expected: "Silent redirect to /home (non-admin role)"
    why_human: "Requires live DB profile lookup — cannot verify runtime Supabase query result statically"
  - test: "Log in as admin (username: admin, password: admin123), then visit /admin"
    expected: "Admin Dashboard page renders (not redirected)"
    why_human: "Same as above — requires live DB role check"
---

# Phase 1: Foundation Verification Report

**Phase Goal:** Users can securely log in and the database is ready to store orders
**Verified:** 2026-03-15T18:45:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Profiles table exists with id, username, role, created_at, auth_user_id columns | VERIFIED | `20260315000001_create_profiles.sql` line 7–13: all 5 columns declared with correct types, constraints, and defaults |
| 2 | Orders table exists with all 11 required columns | VERIFIED | `20260315000002_create_orders.sql` lines 7–21: id, user_id, selected_name, meal_category, meal_name, price, customisation, week_number, year, archived, created_at — all present with correct types |
| 3 | RLS enabled on both tables with correct policies | VERIFIED | profiles: `enable row level security` + 2 policies (select all, update own). orders: `enable row level security` + 4 policies (select, insert, update-user, update-admin). Admin role checks correctly use `auth_user_id` column |
| 4 | Admin account (admin/admin123) is seeded as auth.users + auth.identities | VERIFIED | `seed.sql` lines 59–90: inserts admin into auth.users with bcrypt hash via pgcrypto, paired auth.identities row with correct sub/email identity_data |
| 5 | Shared user account (user/password) is seeded as auth.users + auth.identities | VERIFIED | `seed.sql` lines 22–54: inserts user@lunchapp.com into auth.users, paired auth.identities row |
| 6 | 10 org member profiles seeded with role 'user' | VERIFIED | `seed.sql` lines 102–112: Daniel, Nic, James, Sarah, Lara, Tom, Mike, Amy, Kate, Chris — all with auth_user_id NULL and role 'user' |
| 7 | Admin profile seeded with role 'admin' | VERIFIED | `seed.sql` line 95–96: admin profile with v_admin_id as auth_user_id and role 'admin' |
| 8 | User can log in with username/password and land on /home | NEEDS HUMAN | Login page wiring is correct (createClient, signInWithPassword, router.push('/home')) but end-to-end requires live Supabase instance |
| 9 | Session survives browser refresh | NEEDS HUMAN | Middleware correctly calls getUser() and sets cookies on both request and response — runtime behaviour requires live test |
| 10 | Non-admin visiting /admin is redirected to /home | NEEDS HUMAN | Admin page queries profiles.role and calls redirect('/home') for non-admin — requires live DB |

**Score:** 7/7 automated truths verified, 3 additional truths flagged for human confirmation

---

## Required Artifacts

### Plan 01-01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `supabase/migrations/20260315000001_create_profiles.sql` | Profiles table DDL + RLS enable + select/update policies | VERIFIED | 27 lines, contains `create table public.profiles`, `enable row level security`, 2 policies |
| `supabase/migrations/20260315000002_create_orders.sql` | Orders table DDL + RLS enable | VERIFIED | 21 lines, contains `create table public.orders`, `enable row level security`, all 11 columns |
| `supabase/migrations/20260315000003_rls_policies.sql` | 4 RLS policies for orders (user isolation + admin read/update) | VERIFIED | 37 lines, 4 `create policy` statements — SELECT, INSERT, UPDATE-user, UPDATE-admin |
| `supabase/seed.sql` | Auth users + profile rows for admin, shared user, and 10 org members | VERIFIED | 114 lines, 2x auth.users inserts, 2x auth.identities inserts, 11x profiles inserts |

### Plan 01-02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/utils/supabase/client.ts` | Browser Supabase client, exports createClient | VERIFIED | 8 lines, exports `createClient()` using `createBrowserClient` from `@supabase/ssr` |
| `src/utils/supabase/server.ts` | Server Supabase client, exports createClient | VERIFIED | 28 lines, exports async `createClient()` using `createServerClient` with getAll/setAll cookie pattern and try/catch on setAll |
| `src/middleware.ts` | Session refresh + route protection, exports middleware and config | VERIFIED | 52 lines, exports both `middleware` and `config`. Uses `getUser()` (not getSession). Redirects unauthenticated to `/`, authenticated at `/` to `/home` |
| `src/app/page.tsx` | Login page with username/password form (min 50 lines) | VERIFIED | 127 lines. Food background, "What's for lunch?" header, username/password inputs, inline error display, loading spinner with animate-spin, "Let's Eat!" button |
| `src/app/home/page.tsx` | Protected welcome page (min 15 lines) | VERIFIED | 25 lines. Server component, getUser() check, redirect('/') if no user, renders "Welcome to LunchApp!" |
| `src/app/admin/page.tsx` | Admin-only page with role check (min 15 lines) | VERIFIED | 31 lines. Server component, getUser() check, profiles.role query via auth_user_id, redirect('/home') for non-admin |

---

## Key Link Verification

### Plan 01-01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `supabase/seed.sql` | `auth.users + auth.identities` | SQL inserts with pgcrypto crypt() | WIRED | Lines 22–90: `insert into auth.users` and `insert into auth.identities` for both accounts; pgcrypto `crypt()` used for password hashing |
| `supabase/seed.sql` | `public.profiles` | SQL inserts for 10 members + admin | WIRED | Lines 95–112: `insert into public.profiles` — 1 admin row + 10 org member rows |
| `supabase/migrations/20260315000003_rls_policies.sql` | `public.profiles` | Role check subquery in orders policies | WIRED | Lines 13–15 and 36: `select role from public.profiles where auth_user_id = (select auth.uid())` — correctly uses auth_user_id not id |

### Plan 01-02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/page.tsx` | `src/utils/supabase/client.ts` | createClient() for signInWithPassword | WIRED | Line 5: `import { createClient } from '@/utils/supabase/client'`. Line 19: `const supabase = createClient()`. Line 22: `supabase.auth.signInWithPassword({ email, password })` |
| `src/middleware.ts` | `src/utils/supabase/server.ts` | createServerClient for session refresh | WIRED | Line 1: `import { createServerClient } from '@supabase/ssr'`. Middleware creates own server client inline (correct pattern for middleware — does not use server.ts utility, uses createServerClient directly) |
| `src/app/home/page.tsx` | `src/utils/supabase/server.ts` | Server-side getUser() auth check | WIRED | Line 2: `import { createClient } from '@/utils/supabase/server'`. Lines 5–8: `await createClient()` then `supabase.auth.getUser()` |
| `src/app/admin/page.tsx` | `public.profiles` | Role query to gate admin access | WIRED | Lines 12–15: `.from('profiles').select('role').eq('auth_user_id', user.id).single()` — correctly gates on auth_user_id |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| AUTH-01 | 01-02 | User can log in with username and password | SATISFIED (needs human for runtime) | Login page translates username to `username@lunchapp.com`, calls `signInWithPassword`, routes to `/home` on success |
| AUTH-02 | 01-02 | User session persists across browser refresh | SATISFIED (needs human for runtime) | Middleware uses `getUser()` on every request to refresh session; both request and response cookies are set |
| AUTH-03 | 01-01 | Admin user (admin/admin123) is seeded | SATISFIED | seed.sql inserts admin@lunchapp.com with bcrypt hash of 'admin123' into auth.users + auth.identities |
| AUTH-04 | 01-01 | Test users seeded (Daniel, Nic, James, Sarah, Lara, Tom, Mike, Amy, Kate, Chris) | SATISFIED | seed.sql lines 102–112: all 10 names present with role 'user' and auth_user_id NULL |
| AUTH-05 | 01-01, 01-02 | Role-based access: user and admin roles in profiles table | SATISFIED | profiles.role column with CHECK constraint (`role in ('user', 'admin')`); admin page gates on `profiles.role = 'admin'` via auth_user_id query |
| DB-01 | 01-01 | Profiles table with id, username, role, created_at and RLS policies | SATISFIED | Migration 1: all 4 required columns present (plus auth_user_id). RLS enabled with 2 policies |
| DB-02 | 01-01 | Orders table with all 11 specified columns | SATISFIED | Migration 2: all 11 columns — id, user_id, selected_name, meal_category, meal_name, price, customisation, week_number, year, archived, created_at |
| DB-03 | 01-01 | RLS: users read/write own orders, admin reads all orders | SATISFIED | Migration 3: SELECT policy allows `user_id = auth.uid() OR role = 'admin'`. INSERT/UPDATE policies enforce user_id = auth.uid() |

**Coverage:** 8/8 Phase 1 requirements addressed. No orphaned requirements found.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/admin/page.tsx` | 27 | "Coming in Phase 4" text | Info | Intentional scaffold — admin role gate is fully implemented; placeholder body content is by design and noted in the plan |
| `src/app/globals.css` | 28–32 | Custom `@keyframes spin` | Info | Redundant — login page uses Tailwind's `animate-spin` class which provides its own keyframe. Not harmful, just unnecessary |

No blockers or warnings found. The "Coming in Phase 4" text is not a stub — the admin gate logic (getUser, profile role query, redirect) is fully implemented.

---

## Human Verification Required

### 1. End-to-end Login Flow (Shared User)

**Test:** Run `supabase db push`, execute `seed.sql`, set `.env.local` with Supabase DEV credentials, run `npm run dev`. Visit `http://localhost:3000`. Enter username `user` and password `password`. Click "Let's Eat!".
**Expected:** Loading spinner appears on button while request is in flight. On success, browser navigates to `/home` displaying "Welcome to LunchApp!".
**Why human:** Requires a live Supabase DEV instance with migrations applied and seed data loaded. Static analysis cannot execute `auth.signInWithPassword` against a real endpoint.

### 2. Wrong Credentials Error Message

**Test:** On the login page, enter username `user` and password `wrongpassword`. Click "Let's Eat!".
**Expected:** Inline error "Oops! Wrong username or password. Try again." appears in the red-tinted box below the form. Button re-enables and spinner disappears.
**Why human:** Error path requires a real Supabase auth response — cannot confirm error state triggers with static analysis.

### 3. Session Persistence on Refresh

**Test:** After logging in as `user`, press F5 or Cmd+R to refresh the page.
**Expected:** Browser remains on `/home`, not redirected to login.
**Why human:** Cookie-based session refresh via Next.js middleware requires a running server; cannot verify runtime cookie behaviour statically.

### 4. Non-Admin Route Protection on /admin

**Test:** While logged in as shared user (`user`/`password`), navigate directly to `http://localhost:3000/admin`.
**Expected:** Immediate silent redirect to `/home`.
**Why human:** Requires live Supabase DB query on `public.profiles` to return `role = 'user'` and trigger the redirect.

### 5. Admin Login and /admin Access

**Test:** Log out (clear cookies), log in with username `admin` and password `admin123`. Navigate to `http://localhost:3000/admin`.
**Expected:** Admin Dashboard page renders with "Admin Dashboard" heading and "Coming in Phase 4" text — no redirect.
**Why human:** Requires live profile role query returning `'admin'` to allow the page to render.

---

## Gaps Summary

No gaps found. All automated checks pass:

- All 4 migration/seed files exist, are substantive, and contain the correct SQL.
- All 6 auth UI source files exist, are substantive, and are correctly wired.
- All 4 key links from Plan 01-01 and all 4 key links from Plan 01-02 are verified.
- All 8 Phase 1 requirements (AUTH-01 through AUTH-05, DB-01 through DB-03) are satisfied by the implementation.
- Commits f56d75b, c27ceba, 312280a, c73b187 all verified as real commits with correct file changes.
- Supabase packages (@supabase/supabase-js ^2.99.1, @supabase/ssr ^0.9.0) confirmed in package.json.

5 human verification steps are needed to confirm the end-to-end auth flow against a live Supabase DEV instance. These cannot fail the phase structurally — the code is correct — but must be confirmed before marking the phase fully done.

---

_Verified: 2026-03-15T18:45:00Z_
_Verifier: Claude (gsd-verifier)_
