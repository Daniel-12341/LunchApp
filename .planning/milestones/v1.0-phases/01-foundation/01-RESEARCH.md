# Phase 1: Foundation - Research

**Researched:** 2026-03-15
**Domain:** Supabase Auth + Next.js App Router (SSR) + PostgreSQL RLS
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Auth Model:** Shared login model — ONE user account (user/password) for all org members, ONE admin account (admin/admin123). Only 2 Supabase Auth accounts total.
- **Email format:** Backend uses user@lunchapp.com and admin@lunchapp.com internally; UI shows only "Username" and "Password" fields.
- **Identity model:** Individual identity comes from name selector (Phase 2), not auth. No per-user auth accounts for the 10 org members.
- **Login page aesthetic:** Playful, colourful, fun header ("What's for lunch?"), full-bleed Unsplash food photography background (blurred/dimmed) behind a login card.
- **Post-login landing:** Simple welcome page "Welcome to LunchApp!" with playful vibe. Placeholder that Phase 2 replaces.
- **No logout button yet** — added later with nav/header.
- **Seed data:** 10 org members in profiles table: Daniel, Nic, James, Sarah, Lara, Tom, Mike, Amy, Kate, Chris. Names and roles only (role: 'user'). Admin profile row also needed (role: 'admin').
- **Error handling:** Wrong credentials → "Oops! Wrong username or password. Try again." inline error. Unauthenticated → silent redirect to /login. Non-admin at /admin → silent redirect to home. Login button shows spinner and disables during request.

### Claude's Discretion

- Login card styling details (shadow, border-radius, padding)
- Exact food background image choice from Unsplash
- Welcome page layout and copy details
- Supabase client setup pattern (client-side vs server-side helpers)
- Migration file organization

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | User can log in with username and password (UI shows username only, backend uses username@lunchapp.com) | signInWithPassword with constructed email; login form with username field only |
| AUTH-02 | User session persists across browser refresh | @supabase/ssr middleware pattern with cookie-based session refresh |
| AUTH-03 | Admin user (admin/admin123) is seeded on first run | SQL seed: insert into auth.users + auth.identities with bcrypt password hash |
| AUTH-04 | Test users seeded (Daniel, Nic, James, Sarah, Lara, Tom, Mike, Amy, Kate, Chris) | SQL seed: profiles table rows; only 2 Supabase Auth accounts |
| AUTH-05 | Role-based access: user and admin roles stored in profiles table | profiles.role column; checked in middleware for /admin route protection |
| DB-01 | Profiles table with id, username, role, created_at and RLS policies | Migration: CREATE TABLE public.profiles + RLS enable + policies |
| DB-02 | Orders table with all specified columns | Migration: CREATE TABLE public.orders with all columns |
| DB-03 | RLS: users read/write own orders, admin reads all orders | RLS policies using auth.uid() = user_id, admin role check via profiles join |
</phase_requirements>

---

## Summary

Phase 1 establishes the authentication gate and database schema for LunchApp. The key technical challenge is the unconventional shared-credentials auth model: only two Supabase Auth accounts exist (user@lunchapp.com and admin@lunchapp.com), while individual identity is deferred to Phase 2. This simplifies auth but requires the login form to translate "username" input into an email string before calling Supabase.

Session persistence requires the `@supabase/ssr` package with a Next.js middleware that refreshes tokens and syncs cookies on every request — this is mandatory for App Router because Server Components cannot write cookies. The middleware also handles route protection: redirect unauthenticated users from protected pages, and redirect non-admin users from /admin.

Seeding is the trickiest part. Because the 10 org members are NOT Supabase Auth users (identity comes in Phase 2), they only need rows in `public.profiles`. The two auth accounts (user and admin) require direct SQL inserts into `auth.users` and `auth.identities` with bcrypt-hashed passwords, plus a corresponding `supabase/seed.sql` file that runs after migrations.

**Primary recommendation:** Use `@supabase/ssr` (latest) with the `createServerClient`/`createBrowserClient` pattern, middleware-based session refresh, and a single `seed.sql` for both auth users and profile rows.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.x | Supabase client (auth, db) | Official Supabase JS SDK |
| @supabase/ssr | ^0.x (latest) | Cookie-based session handling for SSR | Replaces deprecated @supabase/auth-helpers; App Router requires it for session refresh |
| next | 16.1.6 (already installed) | Framework | Already in project |
| tailwindcss | ^4 (already installed) | Styling | Already in project |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react | 19.2.3 (already installed) | UI | Already in project |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @supabase/ssr | @supabase/auth-helpers | auth-helpers is deprecated as of 2025; bug fixes focused on @supabase/ssr only |
| SQL seed.sql | Supabase admin API createUser | SQL seed works with supabase db push; admin API requires a separate script to run |
| Middleware route protection | Per-page getUser() check | Both are valid; middleware is cleaner for multiple protected routes |

**Installation:**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (no Supabase provider needed at root for App Router)
│   ├── page.tsx                # Login page (replaces default)
│   ├── home/
│   │   └── page.tsx            # Protected welcome page (Phase 2 replaces this)
│   └── admin/
│       └── page.tsx            # Admin-only protected page (scaffold only, Phase 4 builds it)
├── middleware.ts               # Session refresh + route protection (MUST be in src/ not root)
└── utils/
    └── supabase/
        ├── client.ts           # createBrowserClient — used in Client Components
        └── server.ts           # createServerClient — used in Server Components / Actions
supabase/
├── migrations/
│   ├── 20260315000001_create_profiles.sql
│   ├── 20260315000002_create_orders.sql
│   └── 20260315000003_rls_policies.sql
└── seed.sql                    # Auth users + profile rows
```

### Pattern 1: Supabase Browser Client

**What:** Used in Client Components (forms, interactive UI)
**When to use:** Any `'use client'` component that needs Supabase

```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/creating-a-client
// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Pattern 2: Supabase Server Client

**What:** Used in Server Components, Server Actions, Route Handlers
**When to use:** Any server-side code that needs Supabase

```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/creating-a-client
// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Intentionally ignored — Server Components can't set cookies
            // Middleware handles cookie refresh
          }
        },
      },
    }
  )
}
```

### Pattern 3: Middleware (Session Refresh + Route Protection)

**What:** Runs on every request; refreshes auth tokens, protects routes
**When to use:** Mandatory for App Router session persistence

```typescript
// Source: https://github.com/orgs/supabase/discussions/21468
// src/middleware.ts  (MUST be in src/ when project uses src/app/)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Always use getUser() — never getSession() in server code
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Unauthenticated users cannot access protected pages
  if (!user && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Non-admin cannot access /admin — check profiles table role
  // (role check done in the admin page itself for simplicity,
  // or add a profiles lookup here for middleware-level protection)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Pattern 4: Login with Username-to-Email Translation

**What:** Translate username input to email format before calling Supabase
**When to use:** Login form submit handler

```typescript
// Source: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
// Client Component login action
const username = formData.get('username') as string
const password = formData.get('password') as string
const email = `${username}@lunchapp.com`

const { error } = await supabase.auth.signInWithPassword({ email, password })

if (error) {
  setErrorMsg('Oops! Wrong username or password. Try again.')
  return
}
// redirect to /home
```

### Pattern 5: Protected Server Component

**What:** Server Component that redirects if not authenticated
**When to use:** Any page that requires login

```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/nextjs
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return <div>Welcome!</div>
}
```

### Pattern 6: Admin Role Check

**What:** Check profiles.role to gate /admin page
**When to use:** /admin page and any admin-only Server Components

```typescript
// src/app/admin/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/home')

  return <div>Admin</div>
}
```

### Anti-Patterns to Avoid

- **Using `getSession()` on the server:** Never use `supabase.auth.getSession()` in middleware or Server Components — it does not revalidate the JWT. Always use `getUser()`.
- **Middleware in root when using src/:** With `src/app/`, the middleware file MUST be at `src/middleware.ts`, not at the project root. Next.js won't pick it up from root.
- **Forgetting auth.identities insert in seed:** Inserting into `auth.users` without a corresponding `auth.identities` row means login will fail silently. Both inserts are required.
- **Storing plaintext passwords in seed.sql:** Supabase expects bcrypt-hashed passwords in `encrypted_password`. Use `crypt('password', gen_salt('bf'))` via pgcrypto.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session token refresh in App Router | Custom cookie/token refresh logic | @supabase/ssr middleware | Edge cases with concurrent requests, token expiry races |
| Password hashing for seed | Custom hash function | `crypt()` + `gen_salt('bf')` via pgcrypto | Must match Supabase's exact bcrypt format |
| Route protection | Per-page auth check everywhere | Middleware + per-page `getUser()` double-check | Middleware can be bypassed in some edge cases; belt-and-suspenders approach |

**Key insight:** The @supabase/ssr package exists specifically because building correct cookie-based session refresh for App Router is non-trivial — don't replicate it.

---

## Common Pitfalls

### Pitfall 1: Missing auth.identities Row in Seed

**What goes wrong:** User exists in auth.users but cannot log in — Supabase returns an error or silently fails.
**Why it happens:** Supabase requires a linked identity record in `auth.identities` for email/password sign-in to work. Inserting only into `auth.users` is insufficient.
**How to avoid:** Always pair every `auth.users` insert with a matching `auth.identities` insert in seed.sql.
**Warning signs:** `signInWithPassword` returns an error even with correct credentials.

### Pitfall 2: middleware.ts in Wrong Location

**What goes wrong:** Middleware never executes — sessions don't refresh, routes aren't protected.
**Why it happens:** When the project uses `src/app/`, Next.js looks for middleware at `src/middleware.ts`. A file at the project root is ignored.
**How to avoid:** Place `middleware.ts` inside `src/` alongside the `app/` directory.
**Warning signs:** Protected pages accessible without login, or login state lost on refresh.

### Pitfall 3: NEXT_PUBLIC_SUPABASE_ANON_KEY vs PUBLISHABLE_KEY

**What goes wrong:** Environment variable name mismatch causes `supabaseKey required` errors.
**Why it happens:** New Supabase projects (created after Nov 2025) use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (format: `sb_publishable_...`) instead of `ANON_KEY`. The variable names differ.
**How to avoid:** Check the Supabase dashboard for the correct key format for this project. CLAUDE.md specifies `NEXT_PUBLIC_SUPABASE_ANON_KEY` — verify this matches the actual project key name.
**Warning signs:** Client construction throws "supabaseKey required" at runtime.

### Pitfall 4: getSession() Instead of getUser() in Server Code

**What goes wrong:** Auth state appears correct but tokens are never refreshed — sessions expire silently.
**Why it happens:** `getSession()` reads the cookie without revalidating against Supabase servers. An expired or tampered JWT passes the check.
**How to avoid:** Always use `await supabase.auth.getUser()` in middleware and Server Components.
**Warning signs:** Session works briefly then breaks; token-related 401 errors from database operations.

### Pitfall 5: RLS Blocks All Access

**What goes wrong:** After enabling RLS, all queries return empty results even for authenticated users.
**Why it happens:** Enabling RLS without any policies = deny all. Policies must be created before any data is accessible.
**How to avoid:** Always create SELECT/INSERT/UPDATE/DELETE policies immediately after enabling RLS. Test with a simple query after migration.
**Warning signs:** Queries return `[]` with no error after enabling RLS.

---

## Code Examples

### Migration: Profiles Table

```sql
-- Source: Supabase RLS docs + standard Postgres patterns
-- supabase/migrations/20260315000001_create_profiles.sql

create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Authenticated users can read all profiles (needed for Phase 2 name selector)
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id);
```

### Migration: Orders Table

```sql
-- supabase/migrations/20260315000002_create_orders.sql

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  selected_name text not null,
  meal_category text not null,
  meal_name text not null,
  price numeric(6,2) not null,
  customisation text,
  week_number integer not null,
  year integer not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
```

### Migration: RLS Policies for Orders

```sql
-- Source: https://supabase.com/docs/guides/database/postgres/row-level-security
-- supabase/migrations/20260315000003_rls_policies.sql

-- Users can read their own orders
create policy "Users can view own orders"
  on public.orders for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (
      select role from public.profiles
      where id = (select auth.uid())
    ) = 'admin'
  );

-- Users can insert their own orders
create policy "Users can insert own orders"
  on public.orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Users can update their own orders
create policy "Users can update own orders"
  on public.orders for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Admin can update all orders (for archiving)
create policy "Admin can update all orders"
  on public.orders for update
  to authenticated
  using (
    (select role from public.profiles where id = (select auth.uid())) = 'admin'
  );
```

### Seed: Auth Users + Profile Rows

```sql
-- Source: https://laros.io/seeding-users-in-supabase-with-a-sql-seed-script
-- supabase/seed.sql

create extension if not exists "pgcrypto";

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_admin_id uuid := gen_random_uuid();
  v_user_pw text := crypt('password', gen_salt('bf'));
  v_admin_pw text := crypt('admin123', gen_salt('bf'));
begin

  -- Regular shared user account
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    v_user_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'user@lunchapp.com', v_user_pw, now(),
    '{"provider":"email","providers":["email"]}', '{}',
    now(), now()
  );

  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) values (
    v_user_id, v_user_id,
    format('{"sub":"%s","email":"user@lunchapp.com"}', v_user_id)::jsonb,
    'email', v_user_id, now(), now(), now()
  );

  -- Admin account
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    v_admin_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@lunchapp.com', v_admin_pw, now(),
    '{"provider":"email","providers":["email"]}', '{}',
    now(), now()
  );

  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) values (
    v_admin_id, v_admin_id,
    format('{"sub":"%s","email":"admin@lunchapp.com"}', v_admin_id)::jsonb,
    'email', v_admin_id, now(), now(), now()
  );

  -- Admin profile row
  insert into public.profiles (id, username, role) values
    (v_admin_id, 'admin', 'admin');

  -- Regular user is the shared account; no profile row needed for auth.user itself
  -- (profiles rows are for the 10 org members, not the shared auth account)
  -- 10 org member profiles (no auth.users accounts — identity is Phase 2)
  insert into public.profiles (id, username, role) values
    (gen_random_uuid(), 'Daniel', 'user'),
    (gen_random_uuid(), 'Nic', 'user'),
    (gen_random_uuid(), 'James', 'user'),
    (gen_random_uuid(), 'Sarah', 'user'),
    (gen_random_uuid(), 'Lara', 'user'),
    (gen_random_uuid(), 'Tom', 'user'),
    (gen_random_uuid(), 'Mike', 'user'),
    (gen_random_uuid(), 'Amy', 'user'),
    (gen_random_uuid(), 'Kate', 'user'),
    (gen_random_uuid(), 'Chris', 'user');

end $$;
```

> **Note on profiles.id for org members:** Because org members have no Supabase Auth account, their profile `id` cannot reference `auth.users`. The foreign key `id uuid references auth.users(id)` must be dropped or made nullable for org member rows. Recommend: make `id` a plain UUID primary key (no FK to auth.users), and add a separate nullable `auth_user_id` column for rows that DO link to auth. Alternatively, simply remove the FK constraint — for this small trusted-team app the referential integrity is not critical.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @supabase/auth-helpers | @supabase/ssr | 2024 | auth-helpers is deprecated; ssr package is current standard |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Nov 2025 | New projects use publishable key format; legacy projects keep ANON_KEY |
| `getSession()` for server auth checks | `getUser()` | 2024 | getSession doesn't revalidate JWT; getUser is the safe server-side method |
| cookies.get/set/remove methods | cookies.getAll/setAll methods | Late 2024 | Newer @supabase/ssr versions use getAll/setAll API |

**Deprecated/outdated:**
- `@supabase/auth-helpers`: Superseded by `@supabase/ssr`. Do not use.
- `supabase.auth.getSession()` in server code: Replaced by `supabase.auth.getUser()`.

---

## Open Questions

1. **profiles.id foreign key constraint with org member rows**
   - What we know: The standard Supabase profiles pattern uses `id uuid references auth.users(id)` — org members have no auth accounts.
   - What's unclear: Should the FK be removed entirely, or should we use a separate nullable `auth_user_id` column?
   - Recommendation: Remove the FK constraint from `profiles.id` and make it a plain UUID primary key. Add a nullable `auth_user_id uuid references auth.users(id)` column for the two auth-linked profiles (user and admin). This is clean, extensible, and avoids constraint violations.

2. **ANON_KEY vs PUBLISHABLE_KEY for this project**
   - What we know: CLAUDE.md specifies `NEXT_PUBLIC_SUPABASE_ANON_KEY`. New Supabase projects (post Nov 2025) use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - What's unclear: This project was set up on 2026-03-15 — it may use the new key format.
   - Recommendation: Planner should verify key format in .env.local and use the correct variable name. Both work functionally; it's purely a naming issue.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — Wave 0 must add |
| Config file | None — see Wave 0 |
| Quick run command | `npm run test` (after setup) |
| Full suite command | `npm run test` |

> This project has no test framework configured. The scope of Phase 1 is auth + database setup. Manual validation via the running app (login flow, session persistence, RLS queries) is the practical validation approach for this phase. Formal test framework setup is appropriate to defer unless the project adds one explicitly.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Login form submits username, constructs email, calls signInWithPassword | manual | `npm run dev` — verify login works | N/A |
| AUTH-02 | Session survives browser refresh | manual | Refresh page after login — verify still logged in | N/A |
| AUTH-03 | admin/admin123 works as credentials | manual | Login with admin credentials | N/A |
| AUTH-04 | 10 profile rows exist in database | manual | Supabase dashboard or `supabase db diff` | N/A |
| AUTH-05 | admin profile has role='admin', others role='user' | manual | Query profiles table | N/A |
| DB-01 | profiles table exists with correct columns + RLS | manual | `supabase db push` succeeds; table visible in dashboard | N/A |
| DB-02 | orders table exists with all specified columns | manual | `supabase db push` succeeds; check schema | N/A |
| DB-03 | RLS policies enforce user isolation for orders | manual | Insert order as user, attempt to select as different user | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (TypeScript compile check)
- **Per wave merge:** Manual login flow test in browser
- **Phase gate:** All 8 requirements manually verified before `/gsd:verify-work`

### Wave 0 Gaps

- No automated test framework installed. For Phase 1, this is acceptable — the deliverables are a login page, session persistence, and database schema, which are most efficiently validated manually in the browser and via `supabase db push`.

---

## Sources

### Primary (HIGH confidence)
- [Supabase SSR Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) — middleware pattern, getUser() vs getSession()
- [Supabase Creating a Client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client) — createServerClient/createBrowserClient code
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) — policy syntax, auth.uid(), USING vs WITH CHECK
- [Supabase User Data Management](https://supabase.com/docs/guides/auth/managing-user-data) — handle_new_user trigger pattern
- [Supabase signInWithPassword Reference](https://supabase.com/docs/reference/javascript/auth-signinwithpassword) — email+password auth API

### Secondary (MEDIUM confidence)
- [Seeding Users in Supabase with SQL](https://laros.io/seeding-users-in-supabase-with-a-sql-seed-script) — auth.users + auth.identities seed pattern with pgcrypto crypt()
- [Supabase Auth Next.js Discussion #21468](https://github.com/orgs/supabase/discussions/21468) — complete middleware.ts with updateSession and route protection
- [Mohamed Kadi: Next.js Supabase Auth 2025](https://mohamedkadi.com/blog/nextjs-supabase-auth-2025) — confirmed middleware + client patterns
- [Supabase API Keys Discussion #29260](https://github.com/orgs/supabase/discussions/29260) — ANON_KEY vs PUBLISHABLE_KEY transition

### Tertiary (LOW confidence)
- None — all key claims cross-verified with official Supabase documentation.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified with official Supabase docs
- Architecture: HIGH — middleware pattern from official docs + verified discussion
- Seed SQL: MEDIUM — seed pattern from community source (laros.io), consistent with official Supabase seeding docs
- Pitfalls: HIGH — all sourced from official docs or verified GitHub discussions
- profiles.id FK design: MEDIUM — recommendation based on technical reasoning, not a documented Supabase pattern

**Research date:** 2026-03-15
**Valid until:** 2026-06-15 (stable APIs; publishable key migration is the most likely change)
