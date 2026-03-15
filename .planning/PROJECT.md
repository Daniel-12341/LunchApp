# LunchApp

## What This Is

A fun, colourful lunch ordering web app for a small organisation (~10 people). Users log in, pick their name from a list, see their location on an animated map of the Western Cape, then choose a meal from categorised menus. Orders are saved to Supabase and shared via a WhatsApp link. An admin can view and manage all weekly orders.

## Core Value

Users can quickly and enjoyably place their weekly lunch order and have it shared to WhatsApp in one click.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Simple username/password auth via Supabase Auth (username@lunchapp.com format internally)
- [ ] Two roles: user and admin
- [ ] Seeded admin (admin/admin123) and test users
- [ ] Name selector page with animated map zoom (Leaflet.js) to person's Western Cape location
- [ ] Fun emoji markers with custom labels per person
- [ ] Lunch order page with 4 meal categories (Pizza, Pasta, Salad, Panini) with priced items
- [ ] "My Previous Order" feature to re-select last order
- [ ] "Surprise Me!" random meal selector with animation
- [ ] Special requests text field
- [ ] Order saved to Supabase orders table
- [ ] WhatsApp link generation with all weekly orders formatted
- [ ] Confetti success screen after order submission
- [ ] Admin page showing all weekly orders in a table
- [ ] Admin can reset week (archive orders) and export order summary
- [ ] Weekly auto-reset via Supabase Edge Function (Sunday 21:00 UTC)
- [ ] Archived orders preserved for "Previous Order" feature
- [ ] RLS: users read/write own orders, admin reads all
- [ ] Mobile-friendly, playful UI with Framer Motion animations

### Out of Scope

- Email verification / OTP — simplicity over security for internal tool
- OAuth / social login — not needed for small team
- Payment processing — orders are informational only
- Real-time updates — not needed for weekly ordering
- User self-registration — admin seeds users

## Context

- Stack: Next.js (TypeScript), Tailwind CSS, Supabase (Postgres + Auth + Edge Functions)
- Hosting: Vercel (dev + prod), Supabase (dev + prod)
- CI/CD: GitHub Actions with dev/prod deploy workflow already configured
- Existing scaffolding: Next.js app initialized, Supabase CLI linked to dev project
- Organisation: ~10 people in Western Cape, South Africa
- Map: Leaflet.js with locations between Greyton and Blouberg
- Animations: Framer Motion for transitions, confetti, zoom effects
- Fonts: Google Fonts (Pacifico/Fredoka One)
- Food images: Unsplash direct URLs

## Constraints

- **Tech stack**: Next.js + Tailwind + Supabase (already set up)
- **Auth**: Supabase Auth email/password only, no OTP
- **Data**: Hardcoded org members and menu items (updatable later)
- **Speed**: Prioritise working functionality over perfect code

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| username@lunchapp.com email format | Supabase Auth requires email, but UI shows only username | — Pending |
| Hardcoded org members | Small team, no need for user management UI | — Pending |
| Archive-based weekly reset | Preserve order history for "Previous Order" feature | — Pending |
| WhatsApp via wa.me link | Simple, no API integration needed | — Pending |

---
*Last updated: 2026-03-15 after initialization*
