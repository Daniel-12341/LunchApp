# Phase 4: Admin + Polish - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Admin can view and manage all weekly orders from /admin, export a compiled WhatsApp message, and manually or automatically archive the week. Visual polish pass across all pages: Framer Motion transitions, Google Fonts (Pacifico/Fredoka One), and mobile responsiveness review. Admin orders their own lunch through the same flow as regular users — the admin page is purely for viewing/managing all orders.

</domain>

<decisions>
## Implementation Decisions

### Admin Credentials
- Change admin login from admin/admin123 to **username123/password123**
- Admin navigates to /admin directly (no visible link in UI)
- Admin orders their own lunch through the normal user flow (name selector → order page)

### Admin Page Layout
- Simple order list with action buttons at top: "Send to WhatsApp" + "Copy to clipboard" + "Archive Week"
- Each order shows: name, category emoji, meal name, price, special requests (if any)
- Show count: "This Week's Orders (X of 18)"
- Show who HASN'T ordered yet — list of missing names below the orders (e.g. "Still to order (11): Anastasia, Andre, ...")
- No sortable table needed — flat list is enough for ~18 people

### WhatsApp Export
- Message grouped by category with emoji headers (🍕 Pizza, 🍝 Pasta, 🥗 Salad, 🥖 Panini)
- Each item: "• Name — Meal Name RPrice (Special requests if any)"
- Footer: "Total: RXXX (N orders)"
- Two buttons on admin page: "Send to WhatsApp" (wa.me link) + "Copy to clipboard"
- WhatsApp recipient hardcoded to Daniel's number: +27711602891
- wa.me link format: wa.me/27711602891?text=<encoded message>

### Archive & Reset
- Manual archive: confirmation dialog "Archive this week? This will archive X orders and start a fresh week."
- Warning if not all 18 people have ordered: "11 people haven't ordered yet. Archive anyway?" — but still allow it
- After archive: empty state with success message, fresh week starts
- Archived orders preserved in DB (archived=true) for "My Previous Order" feature
- Edge Function auto-archives every Sunday 21:00 UTC — silent, no notification
- Admin opens Monday to a fresh week

### Visual Polish — Framer Motion
- Page transitions on ALL navigation: login → name selector → order page → admin
- Smooth fade/slide transitions between pages
- Existing animations (confetti, Surprise Me spinner, map flyTo) stay as-is

### Visual Polish — Fonts
- Pacifico (cursive) for main titles: "What's for lunch?", "Who's hungry?", "Hey Daniel!", "Admin Dashboard"
- Fredoka One (rounded bold) for sub-headers: tab labels, button text, section headers, "Order Placed!"
- Body text stays clean sans-serif (current font)
- Replace Geist fonts with Pacifico/Fredoka One in layout.tsx

### Visual Polish — Colours & Mobile
- Riivo colour scheme stays as-is: navy (#0B1C3E), yellow (#D4E000), muted (#A8B8D0)
- General mobile responsiveness pass across all pages: touch targets, text sizing, scroll behaviour, sticky buttons

### Claude's Discretion
- Framer Motion transition type and duration (fade, slide, etc.)
- Admin page empty state illustration/emoji
- Exact mobile breakpoints and adjustments
- Edge Function implementation details (cron schedule, Supabase invoke pattern)
- Order list item styling on admin page
- WhatsApp message encoding details
- Confirmation dialog styling

</decisions>

<specifics>
## Specific Ideas

- Admin credentials: username123 / password123 (not admin / admin123)
- Admin page is NOT a dashboard — it's a simple list view for managing the week's orders
- Admin uses the same ordering flow as regular users — no special order UI
- WhatsApp grouped by category is restaurant-friendly (easy for venue to prepare by type)
- "Still to order" list helps admin chase people up before sending the final WhatsApp

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/admin/page.tsx`: Existing placeholder with auth check (getUser + role check) — replace content
- `src/app/order/OrderPageClient.tsx`: Client component pattern with multiple steps (select/confirm/success) — reusable pattern for admin actions
- `src/utils/orderActions.ts`: Server actions for order CRUD — extend for admin queries
- `src/utils/supabase/server.ts`: Server-side Supabase client for admin data fetching
- `src/data/people.ts`: PEOPLE array (18 members) — use for "still to order" list
- `canvas-confetti`: Already installed — no new animation library needed for existing effects

### Established Patterns
- Riivo colour scheme with Tailwind custom colours (riivo-navy, riivo-yellow, riivo-muted, etc.)
- Server Components with getUser() auth check for protected pages
- 'use client' wrapper pattern for interactive features
- Server actions in separate files from client components
- Unsplash food background images with dark overlay pattern

### Integration Points
- `src/app/admin/page.tsx`: Replace placeholder with full admin page
- `src/app/layout.tsx`: Add Pacifico + Fredoka One Google Fonts, replace Geist
- `src/app/globals.css`: May need animation keyframes for Framer Motion or font-face declarations
- `supabase/migrations/`: New migration for admin credential change (seed data update)
- `supabase/functions/`: New Edge Function for weekly auto-archive cron
- All page components: Wrap with Framer Motion AnimatePresence for transitions

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-admin-polish*
*Context gathered: 2026-03-15*
