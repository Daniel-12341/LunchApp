# Phase 3: Order + Share - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

User picks a lunch order from 4 meal categories (Pizza, Pasta, Salad, Panini), can re-select a previous order or use "Surprise Me!" for a random pick, adds optional special requests, and submits to Supabase. Confetti celebration on success. WhatsApp sharing is deferred to Phase 4 (admin sends compiled list manually).

</domain>

<decisions>
## Implementation Decisions

### Menu Layout
- Tab bar at top: 🍕 Pizza | 🍝 Pasta | 🥗 Salad | 🥖 Panini
- Compact list within each tab: name + price on one line, description below in smaller text
- Tap item to select — highlights with checkmark/border, tap again to deselect
- Only one item selected at a time across all categories (switching tabs deselects previous)
- Real menu data hardcoded in `src/data/menu.ts` (already created — 56 items total)

### Page Layout
- Header greeting with selected name (from `?name=` query param)
- "My Previous Order" card + "Surprise Me!" button positioned ABOVE the tab bar
- Tab bar with 4 categories below shortcuts
- Menu items list below tabs
- Special requests text field below menu
- Sticky submit button at bottom showing selected meal + price

### Two-Step Order Flow
- Step 1: Select meal (shortcuts, tabs, or surprise me) + special requests field + submit button
- Step 2: Confirmation review screen showing selection, price, special requests — confirm or go back
- On confirm: save to Supabase, show success

### "Surprise Me!" Experience
- Slot machine spin animation: items scroll rapidly, slow down, land on chosen meal (~2-3 seconds)
- Picks from ALL categories (not just current tab)
- After landing: auto-selects the revealed meal, switches to that category's tab with item highlighted
- User can still change their mind after the reveal

### Previous Order
- Shows last order from Supabase (most recent non-archived order for this `selected_name`)
- One-click to re-select: populates meal selection and switches to correct tab
- Hidden if no previous order exists

### Success Celebration
- Confetti animation raining down over the page
- Centered modal popup: "Order placed!" with order summary (meal name, category, price, special requests)
- "Done" dismiss button — returns to order page
- No WhatsApp integration in this phase

### WhatsApp Sharing — DEFERRED TO PHASE 4
- Original plan: each user sends WhatsApp after ordering
- New decision: admin manually triggers "Send all orders to WhatsApp" from admin page
- Recipient: Daniel's number +27711602891 via wa.me link
- Message format: compiled list of all weekly orders with names, meals, prices, total
- SHR-01 and SHR-02 requirements move to Phase 4; SHR-03 (confetti) stays in Phase 3

### Claude's Discretion
- Tab bar styling (underline, pill, etc.)
- Slot machine animation implementation details
- Confetti library choice (canvas-confetti, react-confetti, etc.)
- Confirmation screen layout and styling
- Submit button styling and disabled state
- Special requests field placeholder text
- How to handle dual-price items (Carbonara with/without cream) in the UI

</decisions>

<specifics>
## Specific Ideas

- Menu is from a real restaurant (Posticino) — items and prices must match exactly as defined in `src/data/menu.ts`
- The "Surprise Me!" slot machine should feel like a fun reveal moment, building anticipation
- Two-step flow: user reviews their order before it's committed — prevents accidental submissions
- WhatsApp target is Daniel's personal number: +27711602891 (for Phase 4)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/menu.ts`: Full menu data with MenuItem/MenuCategory types — 56 items across 4 categories
- `src/data/people.ts`: PEOPLE array with Person type — can match `selected_name` to person data
- `src/utils/supabase/server.ts`: Server-side Supabase client for saving orders
- `src/utils/supabase/client.ts`: Browser-side Supabase client for real-time queries
- `src/app/order/page.tsx`: Existing placeholder page with auth check and `?name=` param handling

### Established Patterns
- Server Components with `getUser()` auth check (see `/home/page.tsx`)
- Client-side data arrays for static content (`PEOPLE` in `people.ts`, `MENU` in `menu.ts`)
- Tailwind CSS with emerald colour scheme, playful design language
- `'use client'` wrapper components for interactive features (see `NameSelectorLoader.tsx` pattern)

### Integration Points
- `src/app/order/page.tsx`: Replace placeholder with full order page
- Orders table: `selected_name`, `meal_category`, `meal_name`, `price`, `customisation`, `week_number`, `year`
- `?name=` query param from Phase 2's Continue button carries the selected person
- Previous order query: fetch most recent non-archived order WHERE `selected_name` = current name

</code_context>

<deferred>
## Deferred Ideas

- WhatsApp link generation with all weekly orders (SHR-01) — moved to Phase 4 admin page
- WhatsApp auto-open after submit (SHR-02) — moved to Phase 4 admin page
- WhatsApp recipient: +27711602891 (Daniel) — used in Phase 4

</deferred>

---

*Phase: 03-order-share*
*Context gathered: 2026-03-15*
