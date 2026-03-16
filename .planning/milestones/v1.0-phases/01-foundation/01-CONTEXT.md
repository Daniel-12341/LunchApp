# Phase 1: Foundation - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up Supabase database (profiles + orders tables), authentication (shared user login + admin login), seeded org members, and RLS policies. Users can log in and land on a protected page. Database is ready for all subsequent phases.

</domain>

<decisions>
## Implementation Decisions

### Auth Model
- Shared login model: ONE user account (user/password) for all org members, ONE admin account (admin/admin123)
- Only 2 Supabase Auth accounts total — individual identity comes from name selector (Phase 2), not auth
- Backend uses user@lunchapp.com and admin@lunchapp.com internally; UI shows only "Username" and "Password" fields
- No per-user auth accounts for the 10 org members

### Login Page Look & Feel
- Playful from the start — colourful, fun header (e.g. "What's for lunch?"), food imagery
- Full-bleed Unsplash food photography background (blurred/dimmed) behind a login card
- Sets the fun tone before the user even logs in

### Post-Login Landing
- Simple welcome page: "Welcome to LunchApp!" with playful vibe
- Placeholder page that Phase 2 replaces with the name selector
- No logout button needed yet — added later with proper nav/header

### Seed Data
- 10 org members seeded in profiles table: Daniel, Nic, James, Sarah, Lara, Tom, Mike, Amy, Kate, Chris
- Names and roles only (all role: 'user') — locations/emojis/labels added in Phase 2
- Admin profile row also needed (role: 'admin')

### Error Handling
- Wrong credentials: friendly inline error below form — "Oops! Wrong username or password. Try again."
- Unauthenticated access to protected pages: silent redirect to login page
- Non-admin visiting /admin: silent redirect to home page
- Login button shows spinner and disables while auth request is in flight

### Claude's Discretion
- Login card styling details (shadow, border-radius, padding)
- Exact food background image choice from Unsplash
- Welcome page layout and copy details
- Supabase client setup pattern (client-side vs server-side helpers)
- Migration file organization

</decisions>

<specifics>
## Specific Ideas

- Login page should feel inviting and food-themed — not corporate
- The app is for a small trusted team (~10 people), so security is minimal by design
- Shared credentials mean the login is just a gate, not identity — identity is chosen via name selector in Phase 2

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — fresh Next.js scaffold with only default page.tsx and layout.tsx
- Tailwind CSS configured and ready
- Geist fonts currently loaded (will be replaced with Pacifico/Fredoka One in Phase 4)

### Established Patterns
- Next.js App Router (src/app/ directory structure)
- No state management, data fetching, or component patterns established yet — Phase 1 sets these

### Integration Points
- src/app/layout.tsx: Supabase provider will wrap children here
- src/app/page.tsx: Replace default Next.js page with login
- supabase/migrations/: All schema changes go here (per CLAUDE.md rules)
- Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-15*
