---
phase: 01-foundation
plan: 02
subsystem: auth
tags: [supabase, supabase-ssr, next.js, middleware, tailwindcss, typescript]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: profiles table with auth_user_id and role columns; orders table; RLS policies; seed data with auth users
provides:
  - Browser Supabase client (createBrowserClient) for client components
  - Server Supabase client (createServerClient) for server components and actions
  - Next.js middleware with session refresh (getUser()) and route protection
  - Login page with food-themed UI, username-to-email translation, loading spinner, inline errors
  - Protected /home welcome page (server-side auth check)
  - Protected /admin page with profiles.role gate (redirects non-admins to /home)
affects: [02-ordering, 03-sharing, 04-admin]

# Tech tracking
tech-stack:
  added: ["@supabase/supabase-js", "@supabase/ssr"]
  patterns:
    - "createBrowserClient for client components, createServerClient for server components"
    - "Middleware-based session refresh via getUser() (never getSession())"
    - "Username-to-email translation: username@lunchapp.com before signInWithPassword"
    - "Belt-and-suspenders: middleware redirect + per-page getUser() check"

key-files:
  created:
    - src/utils/supabase/client.ts
    - src/utils/supabase/server.ts
    - src/middleware.ts
    - src/app/home/page.tsx
    - src/app/admin/page.tsx
  modified:
    - src/app/page.tsx
    - src/app/layout.tsx
    - src/app/globals.css

key-decisions:
  - "Middleware redirects unauthenticated users to / and authenticated users away from / to /home"
  - "Admin role check done in admin page itself via profiles.auth_user_id query, not in middleware"
  - "Login form constructs email as username@lunchapp.com before calling signInWithPassword"
  - "getUser() used everywhere on server-side — never getSession()"

patterns-established:
  - "Auth client: src/utils/supabase/client.ts for 'use client', src/utils/supabase/server.ts for server"
  - "Protected server component: await createClient() → getUser() → if (!user) redirect('/')"
  - "Admin gate: query profiles where auth_user_id = user.id, check role === 'admin'"

requirements-completed: [AUTH-01, AUTH-02, AUTH-05]

# Metrics
duration: 2min
completed: 2026-03-15
---

# Phase 1 Plan 02: Auth UI and Route Protection Summary

**Supabase SSR auth flow with username@lunchapp.com translation, cookie-based session middleware, food-themed login page, and role-gated admin page**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-15T16:18:11Z
- **Completed:** 2026-03-15T16:20:27Z
- **Tasks:** 2 auto tasks completed (Task 3 human-verify auto-approved)
- **Files modified:** 8

## Accomplishments

- Supabase SSR auth fully wired: browser client for client components, async server client for server components
- Next.js middleware at src/middleware.ts refreshes session on every request and enforces route rules
- Food-themed login page with "What's for lunch?" header, Unsplash background, emerald theme, loading spinner, and inline error message
- Protected /home and /admin pages with server-side getUser() checks; /admin also queries profiles.role to gate admin access

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Supabase packages, create client utilities, and middleware** - `312280a` (feat)
2. **Task 2: Create login page, protected home page, and admin page** - `c73b187` (feat)
3. **Task 3: Verify complete auth flow end-to-end** - auto-approved (checkpoint:human-verify, requires db push + seed)

## Files Created/Modified

- `src/utils/supabase/client.ts` - Browser Supabase client using createBrowserClient
- `src/utils/supabase/server.ts` - Async server Supabase client using createServerClient with getAll/setAll cookies
- `src/middleware.ts` - Session refresh via getUser(), redirect unauthenticated to /, redirect authenticated away from /
- `src/app/page.tsx` - Login page: food background, "What's for lunch?", username/password form, loading spinner, inline errors
- `src/app/home/page.tsx` - Protected welcome page with server-side auth check
- `src/app/admin/page.tsx` - Admin-only page with profiles.role gate, redirects non-admins to /home
- `src/app/layout.tsx` - Updated metadata to LunchApp title and description
- `src/app/globals.css` - Added spin keyframe animation for login button spinner

## Decisions Made

- Admin role check placed in the admin page itself (not middleware) to avoid a DB query on every request
- `getUser()` used in all server-side code as specified — `getSession()` avoided entirely
- Login form translates username input to `username@lunchapp.com` before calling signInWithPassword
- Middleware placed at `src/middleware.ts` (not project root) per Next.js src/ layout requirement

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

Before verifying the auth flow end-to-end, the following steps are required:

1. Ensure `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Run `supabase db push` to apply migrations from Plan 01
3. Run seed.sql to create auth users and profile rows
4. Run `npm run dev` and test per the Task 3 verification checklist in the plan

## Next Phase Readiness

- Auth infrastructure complete: browser client, server client, middleware, login page, route protection
- /home page is a placeholder — Phase 2 will replace it with the name selector and order form
- /admin page is a scaffold — Phase 4 will build the full admin dashboard
- No blockers for Phase 2 start

---
*Phase: 01-foundation*
*Completed: 2026-03-15*
