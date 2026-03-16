# LunchApp

## What This Is

A fun, colourful lunch ordering web app for a small organisation (~18 people) in the Western Cape. Users log in, pick their name from an animated map, choose a meal from categorised menus, and confirm with confetti. An admin can view all weekly orders, export a WhatsApp summary, and archive weeks manually or via automated Edge Function.

## Core Value

Users can quickly and enjoyably place their weekly lunch order with a playful, animated experience.

## Requirements

### Validated

- ✓ Simple username/password auth via Supabase Auth — v1.0
- ✓ Two roles: user and admin — v1.0
- ✓ Seeded admin and 18 org members — v1.0
- ✓ Name selector page with animated map zoom (Leaflet.js) — v1.0
- ✓ Fun emoji markers with custom labels per person — v1.0
- ✓ Lunch order page with 4 meal categories with priced items — v1.0
- ✓ "My Previous Order" feature to re-select last order — v1.0
- ✓ "Surprise Me!" random meal selector with animation — v1.0
- ✓ Special requests text field — v1.0
- ✓ Order saved to Supabase orders table — v1.0
- ✓ Confetti success screen after order submission — v1.0
- ✓ Admin page showing all weekly orders in a table — v1.0
- ✓ Admin can reset week and export WhatsApp summary — v1.0
- ✓ Weekly auto-reset via Edge Function (Sunday 21:00 UTC) — v1.0
- ✓ Archived orders preserved for "Previous Order" feature — v1.0
- ✓ RLS: users read/write own orders, admin reads all — v1.0
- ✓ Mobile-friendly, playful UI with Framer Motion animations — v1.0

### Active

- [ ] WhatsApp link auto-generated on order submit (SHR-01, SHR-02 — deferred from v1.0)

### Out of Scope

- Email verification / OTP — simplicity over security for internal tool
- OAuth / social login — not needed for small team
- Payment processing — orders are informational only
- Real-time updates — not needed for weekly ordering
- User self-registration — admin seeds users

## Context

Shipped v1.0 MVP with 1,665 lines TypeScript + 292 lines SQL.
Tech stack: Next.js 16 (TypeScript), Tailwind CSS, Supabase (Postgres + Auth + Edge Functions), Framer Motion, Leaflet.js.
Hosting: Vercel (dev + prod), Supabase (dev + prod).
18 org members in Western Cape, South Africa with custom map locations and emoji markers.
Admin WhatsApp export covers the sharing use case; auto-share on submit deferred.

## Constraints

- **Tech stack**: Next.js + Tailwind + Supabase (established)
- **Auth**: Supabase Auth email/password only, no OTP
- **Data**: Hardcoded org members and menu items (updatable later)
- **Edge Functions**: Deno runtime, service role key for RLS bypass

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| username@lunchapp.com email format | Supabase Auth requires email, but UI shows only username | ✓ Good — transparent to users |
| Hardcoded org members | Small team, no need for user management UI | ✓ Good — simple and fast |
| Archive-based weekly reset | Preserve order history for "Previous Order" feature | ✓ Good — enables recall |
| WhatsApp via admin export | Simple button rather than auto-share on submit | ✓ Good — admin controls sharing |
| profiles.id as plain UUID | Org members without auth accounts can have profile rows | ✓ Good — flexible schema |
| Static PEOPLE array | No DB query needed for map rendering | ✓ Good — fast client-side |
| L.divIcon for markers | Avoids default Leaflet PNG 404 errors in Next.js | ✓ Good — no broken images |
| Fredoka weight 400 | Fredoka One deprecated; Fredoka is variable-weight replacement | ✓ Good — future-proof |
| Service role key in Edge Function | Bypass RLS for admin-level bulk archive | ✓ Good — necessary for cron |
| pg_cron with manual fallback | Inline manual alternative for simpler setup | ✓ Good — flexible deployment |

---
*Last updated: 2026-03-16 after v1.0 milestone*
