# Phase 3: Order + Share - Research

**Researched:** 2026-03-15
**Domain:** React interactive UI (tab menus, animations, form submission, Supabase insert)
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Menu layout: Tab bar at top (Pizza | Pasta | Salad | Panini), compact list, tap to select/deselect, only one item selected across all tabs
- Real menu data hardcoded in `src/data/menu.ts` — already exists with 56 items across 4 categories
- Page layout: Header greeting with `?name=` param, "My Previous Order" + "Surprise Me!" ABOVE tab bar, sticky submit button at bottom
- Two-step order flow: Step 1 select, Step 2 confirmation review screen, then save to Supabase on confirm
- "Surprise Me!" slot machine spin animation: items scroll rapidly, slow down, land on chosen meal (~2-3 seconds), auto-selects and switches to correct tab
- Previous order: fetch most recent non-archived order for `selected_name` from Supabase, one-click re-select
- Success: confetti raining down + centered modal popup "Order placed!" with summary + "Done" dismiss button
- WhatsApp sharing DEFERRED to Phase 4 — SHR-01 and SHR-02 move to Phase 4

### Claude's Discretion
- Tab bar styling (underline, pill, etc.)
- Slot machine animation implementation details
- Confetti library choice (canvas-confetti, react-confetti, etc.)
- Confirmation screen layout and styling
- Submit button styling and disabled state
- Special requests field placeholder text
- How to handle dual-price items (Carbonara with/without cream) in the UI

### Deferred Ideas (OUT OF SCOPE)
- WhatsApp link generation with all weekly orders (SHR-01) — moved to Phase 4 admin page
- WhatsApp auto-open after submit (SHR-02) — moved to Phase 4 admin page
- WhatsApp recipient: +27711602891 (Daniel) — used in Phase 4
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ORD-01 | Lunch order page with fun header, food background images, selected name displayed | Page structure with `?name=` param from existing placeholder page |
| ORD-02 | Four meal categories (Pizza, Pasta, Salad, Panini) with priced menu items | Tab component pattern using existing `MENU` data from `src/data/menu.ts` |
| ORD-03 | "My Previous Order" shows last order with one-click re-select | Supabase browser client query on `orders` table filtered by `selected_name` + `archived=false` |
| ORD-04 | "Surprise Me!" randomly selects a meal with fun animation | CSS-based slot machine scroll animation, no third-party animation library required |
| ORD-05 | Special requests text field for customisation | Standard controlled `<textarea>` component |
| ORD-06 | Order saved to Supabase orders table on submit | Next.js Server Action using `src/utils/supabase/server.ts` client |
| SHR-01 | WhatsApp link generated with all weekly orders — DEFERRED TO PHASE 4 | n/a |
| SHR-02 | WhatsApp link opens after submit — DEFERRED TO PHASE 4 | n/a |
| SHR-03 | Confetti animation and success message shown after order submission | `canvas-confetti` library (1.9.3), triggered client-side on success |
</phase_requirements>

---

## Summary

Phase 3 replaces the placeholder `/order` page with a complete interactive ordering flow. The page is a single-page client component (using the established `'use client'` wrapper pattern) that manages all state locally: active tab, selected meal, special requests text, and UI step (select vs. confirm vs. success).

The two main technical challenges are: (1) the "Surprise Me!" slot machine animation — best implemented with pure CSS keyframe scrolling through a vertically stacked list of item names, no heavy animation library needed; and (2) the confetti celebration — best handled by `canvas-confetti` (lightweight, zero React dependency, excellent TypeScript support). Data persistence uses the existing server-side Supabase client with a Server Action to insert the order, following the exact pattern already established in Phase 1.

**Primary recommendation:** Build the full order page as one `'use client'` component (`OrderPageClient.tsx`), loaded from the existing Server Component wrapper at `src/app/order/page.tsx`. Use `canvas-confetti` for celebration. Implement slot machine animation with CSS `@keyframes` and `overflow:hidden` clipping — no additional animation library needed.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (Next.js) | 19.2.3 (already installed) | UI state, tab switching, form control | Already in project |
| Tailwind CSS v4 | ^4 (already installed) | All styling, tab bar, item cards, sticky button | Already in project |
| canvas-confetti | 1.9.3 | Confetti burst on order success | Lightest option, zero React dep, 13kb, excellent TS support |
| @types/canvas-confetti | 1.9.0 (devDep) | TypeScript types for canvas-confetti | Required for TS usage |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @supabase/supabase-js | ^2.99.1 (already installed) | Browser-side query for previous order | Already in project |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| canvas-confetti | react-confetti | react-confetti needs window dimensions prop and re-renders; canvas-confetti is imperative, fire-and-forget, lighter |
| canvas-confetti | js-confetti | Both are fine; canvas-confetti has more configuration options and is more widely used |
| CSS keyframe slot machine | Framer Motion | Framer Motion not installed; overkill for one animation; pure CSS achieves same result |

**Installation:**
```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/app/order/
├── page.tsx                  # Server Component (auth check, reads ?name= param)
└── OrderPageClient.tsx       # 'use client' — all interactive order UI and state

src/utils/
└── orderActions.ts           # Server Actions: saveOrder(), getPreviousOrder()
```

### Pattern 1: Server Component + Client Wrapper (Established Pattern)
**What:** `page.tsx` handles auth and param extraction as a Server Component, then renders `<OrderPageClient name={name} />`.
**When to use:** Any page needing both server auth and client-side interactivity — mirrors the `NameSelectorLoader` pattern from Phase 2.
**Example:**
```typescript
// src/app/order/page.tsx (Server Component)
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import OrderPageClient from './OrderPageClient'

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const params = await searchParams
  const name = params.name ?? 'Someone'

  return <OrderPageClient name={name} userId={user.id} />
}
```

### Pattern 2: Server Action for Order Insert
**What:** A `'use server'` function in `src/utils/orderActions.ts` inserts the order row. Called from the client component after confirmation.
**When to use:** Any Supabase mutation — keeps DB credentials server-side.
**Example:**
```typescript
// src/utils/orderActions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

export async function saveOrder(data: {
  userId: string
  selectedName: string
  mealCategory: string
  mealName: string
  price: number
  customisation?: string
}) {
  const supabase = await createClient()
  const now = new Date()
  const weekNumber = getISOWeekNumber(now)  // see helper below
  const year = now.getFullYear()

  const { error } = await supabase.from('orders').insert({
    user_id: data.userId,
    selected_name: data.selectedName,
    meal_category: data.mealCategory,
    meal_name: data.mealName,
    price: data.price,
    customisation: data.customisation ?? null,
    week_number: weekNumber,
    year,
  })
  if (error) throw new Error(error.message)
}
```

### Pattern 3: Browser Supabase Query for Previous Order
**What:** Client-side query using `src/utils/supabase/client.ts` to fetch the most recent non-archived order for `selected_name`. Run in a `useEffect` on mount.
**When to use:** Read operations from client components where SSR is not needed.
**Example:**
```typescript
// Inside OrderPageClient.tsx
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const { data } = await supabase
  .from('orders')
  .select('meal_name, meal_category, price, customisation')
  .eq('selected_name', name)
  .eq('archived', false)
  .order('created_at', { ascending: false })
  .limit(1)
  .single()
```

### Pattern 4: ISO Week Number (No Library Needed)
**What:** Pure JS helper to get ISO 8601 week number for `week_number` column.
**When to use:** When inserting an order row.
**Example:**
```typescript
// Utility — no library needed
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
```

### Pattern 5: Slot Machine Animation (Pure CSS)
**What:** A vertically scrolling list clamped with `overflow: hidden`. CSS `@keyframes` scrolls the list fast then decelerates to rest on the selected item.
**When to use:** "Surprise Me!" reveal animation.

The implementation uses a fixed-height viewport div with `overflow: hidden`. Inside is a column of all menu item names. `transform: translateY(...)` is animated via a CSS class. The final position is calculated based on the randomly selected item's index.

```typescript
// Approach: add CSS class with animation, set final translateY
// The animation uses cubic-bezier easing to slow down naturally
// ~2-3 seconds total, fast scroll then deceleration

// CSS in globals.css or inline style:
@keyframes slotSpin {
  0%   { transform: translateY(0); }
  80%  { transform: translateY(calc(-1 * var(--target-offset) + 200px)); }
  100% { transform: translateY(calc(-1 * var(--target-offset))); }
}
```

A simpler alternative: render a single line display, use `setInterval` to cycle through random items for 2 seconds, then stop on the chosen item. This "ticker" approach is lower complexity and achieves the same visual effect without calculating pixel offsets.

**Recommended approach for slot machine:** The cycling ticker approach (rotate through item names rapidly with setInterval, stop on winner) — simpler to implement correctly and visually effective.

### Pattern 6: canvas-confetti
**What:** Imperative API that fires confetti burst over the page. No React component wrapper needed.
**When to use:** After order is confirmed and saved successfully.
**Example:**
```typescript
// Inside OrderPageClient.tsx — called after saveOrder() resolves
import confetti from 'canvas-confetti'

function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
  })
}
```

### Tab Bar State Pattern
**What:** `activeTab` state (index 0-3) controls which category is shown. Changing tabs does NOT deselect the currently selected meal — only selecting a new item does.
**Implementation:**
```typescript
const [activeTab, setActiveTab] = useState(0)
const [selectedItem, setSelectedItem] = useState<{ category: number; itemIndex: number } | null>(null)

const handleSelectItem = (categoryIndex: number, itemIndex: number) => {
  if (selectedItem?.category === categoryIndex && selectedItem?.itemIndex === itemIndex) {
    setSelectedItem(null)  // deselect on tap again
  } else {
    setSelectedItem({ category: categoryIndex, itemIndex: itemIndex })
  }
}
```

Note from CONTEXT.md: "switching tabs deselects previous" — this means selecting an item on a NEW tab deselects any item from a different tab. The implementation above handles this correctly since `selectedItem` tracks both category and index.

### Dual-Price Item Handling (Carbonara)
The `MenuItem` type has `priceAlt` and `priceAltLabel` fields. Recommended approach (Claude's discretion): show the base price with a small toggle or indicator "(with/without cream)" — two small tap targets within the item row that set `price` to either `price` or `priceAlt`.

### Anti-Patterns to Avoid
- **Server Action in client component directly:** Always put `'use server'` functions in a separate file — Next.js 16 requires this pattern.
- **useEffect for initial previous order fetch without cleanup:** Always return a cleanup/cancel from useEffect to avoid state updates after unmount.
- **Calling `createClient` from `@/utils/supabase/server.ts` in client code:** Use `client.ts` for browser queries, `server.ts` only in Server Components and Server Actions.
- **Slot machine with heavy animation library:** Framer Motion is not installed; adding it for one animation is wasteful. CSS keyframes or setInterval ticker approach is correct.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confetti animation | Custom canvas particles | canvas-confetti | Edge cases: timing, cleanup, multiple bursts, performance |
| ISO week number | Custom date math inline | Pure JS helper function (6 lines, no library) | Standard formula, no library needed, date-fns is overkill |
| Supabase browser query | Manual fetch to REST API | `@supabase/supabase-js` client | Already installed; handles auth headers, RLS, types |

**Key insight:** The complexity in this phase is in state coordination (tab + selection + step + animation), not in third-party library choices. Keep dependencies minimal.

---

## Common Pitfalls

### Pitfall 1: `searchParams` is a Promise in Next.js 16
**What goes wrong:** Accessing `searchParams.name` directly throws or returns undefined.
**Why it happens:** Next.js 16 made `searchParams` async.
**How to avoid:** Always `await searchParams` before accessing properties — the existing placeholder already does this correctly.
**Warning signs:** TypeScript error "Property 'name' does not exist on type 'Promise'"

### Pitfall 2: Server Action in Client Component File
**What goes wrong:** `'use server'` directive inside a `'use client'` file is invalid in Next.js 16.
**Why it happens:** File-level `'use client'` conflicts with function-level `'use server'`.
**How to avoid:** Put all server actions in a dedicated `src/utils/orderActions.ts` file with `'use server'` at the top.
**Warning signs:** Build error "Server actions must be in a server component or a 'use server' file"

### Pitfall 3: Supabase Client vs Server Client Confusion
**What goes wrong:** Using `createClient` from `server.ts` inside a `'use client'` component causes a runtime error (cookies() is not available).
**Why it happens:** The server client reads Next.js cookies, which only work in request context.
**How to avoid:** Client components always import from `@/utils/supabase/client`. Server Actions and Server Components import from `@/utils/supabase/server`.
**Warning signs:** Runtime error about `cookies` being called outside request scope

### Pitfall 4: Slot Machine Animation Race Condition
**What goes wrong:** Rapid clicks on "Surprise Me!" during animation can queue multiple animations.
**Why it happens:** No guard on the animation state.
**How to avoid:** Track `isSpinning` boolean state; disable the "Surprise Me!" button while `isSpinning === true`.
**Warning signs:** Multiple animations running simultaneously, wrong item selected

### Pitfall 5: Previous Order Query with No Results
**What goes wrong:** `.single()` throws an error when no rows match.
**Why it happens:** Supabase `.single()` throws if 0 or 2+ rows.
**How to avoid:** Use `.maybeSingle()` instead of `.single()` — returns `null` on no match without throwing.
**Warning signs:** Unhandled promise rejection on first-time users

### Pitfall 6: `week_number` and `year` for Edge Weeks
**What goes wrong:** Last days of December have week_number=1 of the following year (ISO 8601).
**Why it happens:** ISO weeks can cross year boundaries.
**How to avoid:** Use the ISO week helper above; derive `year` from the same Thursday used in the calculation, not from `new Date().getFullYear()`.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Saving Order (Server Action)
```typescript
// src/utils/orderActions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export async function saveOrder(payload: {
  userId: string
  selectedName: string
  mealCategory: string
  mealName: string
  price: number
  customisation?: string
}): Promise<{ error?: string }> {
  const supabase = await createClient()
  const now = new Date()
  const { error } = await supabase.from('orders').insert({
    user_id: payload.userId,
    selected_name: payload.selectedName,
    meal_category: payload.mealCategory,
    meal_name: payload.mealName,
    price: payload.price,
    customisation: payload.customisation ?? null,
    week_number: getISOWeekNumber(now),
    year: now.getFullYear(),
  })
  return error ? { error: error.message } : {}
}
```

### Fetching Previous Order (Client-side)
```typescript
// Inside useEffect in OrderPageClient.tsx
import { createClient } from '@/utils/supabase/client'

useEffect(() => {
  const supabase = createClient()
  supabase
    .from('orders')
    .select('meal_name, meal_category, price, customisation')
    .eq('selected_name', name)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
    .then(({ data }) => {
      if (data) setPreviousOrder(data)
    })
}, [name])
```

### Confetti Trigger
```typescript
import confetti from 'canvas-confetti'

function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
  })
}
// Call after saveOrder() succeeds, before showing success modal
```

### "Surprise Me!" Ticker Animation
```typescript
// Simple cycling ticker — change displayed name rapidly then stop on winner
const allItems = MENU.flatMap((cat, catIdx) =>
  cat.items.map((item, itemIdx) => ({ item, catIdx, itemIdx }))
)

function handleSurpriseMe() {
  if (isSpinning) return
  setIsSpinning(true)

  const winner = allItems[Math.floor(Math.random() * allItems.length)]
  let ticks = 0
  const totalTicks = 20  // fast phase

  const interval = setInterval(() => {
    const random = allItems[Math.floor(Math.random() * allItems.length)]
    setSpinDisplayItem(random)
    ticks++
    if (ticks >= totalTicks) {
      clearInterval(interval)
      setSpinDisplayItem(winner)
      setIsSpinning(false)
      // Auto-select the winner
      setSelectedItem({ category: winner.catIdx, itemIndex: winner.itemIdx })
      setActiveTab(winner.catIdx)
    }
  }, 80)  // 80ms intervals = fast spin, 20 ticks = ~1.6s total
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `searchParams.name` direct access | `await searchParams` then `.name` | Next.js 15+ | Must await searchParams — already done in existing placeholder |
| `.single()` for optional query | `.maybeSingle()` | Supabase JS v2 | Prevents error on 0 results |
| `'use server'` inline in client files | Separate `actions.ts` file | Next.js 14+ | Build will fail if mixed |

---

## Open Questions

1. **Carbonara dual-price UX**
   - What we know: `MenuItem` has `price: 140` and `priceAlt: 142, priceAltLabel: 'with cream'`
   - What's unclear: Whether the user must explicitly choose cream or not, or if one is the default
   - Recommendation (Claude's discretion): Show base price with a small "(+ R2 with cream)" toggle inline in the item row; default to no cream

2. **Previous order from any week vs. current week only**
   - What we know: Query is "most recent non-archived order" — no week filter specified
   - What's unclear: Should "Previous Order" show last week's order even if already ordered this week?
   - Recommendation: Show the most recent regardless of week — the user may want to reorder the same thing

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no test config or test files found in project |
| Config file | None — Wave 0 must add basic smoke test approach |
| Quick run command | `npm run build` (TypeScript compile as proxy for correctness) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ORD-01 | Order page renders with name from query param | manual-only | n/a — no test framework | No framework |
| ORD-02 | Tab switching shows correct category items | manual-only | n/a | No framework |
| ORD-03 | Previous order card appears for returning user | manual-only | n/a | No framework |
| ORD-04 | Surprise Me picks random item and animates | manual-only | n/a | No framework |
| ORD-05 | Special requests field accepts and submits text | manual-only | n/a | No framework |
| ORD-06 | Order row inserted in Supabase with correct fields | manual-only (verify in Supabase dashboard) | n/a | No framework |
| SHR-03 | Confetti fires and success modal appears | manual-only | n/a | No framework |

### Sampling Rate
- **Per task commit:** `npm run build` — catches TypeScript errors
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Manual browser smoke test before `/gsd:verify-work`

### Wave 0 Gaps
- No test framework installed — manual browser testing is the only validation approach for this project at this stage
- Consider: `npm run build` as the automated gate catches most structural errors (missing props, type mismatches)

*(Note: This project has no test files or framework configured. All functional validation is manual.)*

---

## Sources

### Primary (HIGH confidence)
- Existing codebase — `src/data/menu.ts`, `src/app/order/page.tsx`, `src/utils/supabase/server.ts`, `src/components/NameSelectorLoader.tsx` — confirmed patterns directly
- `supabase/migrations/20260315000002_create_orders.sql` — confirmed orders table schema
- `package.json` — confirmed installed dependencies and versions

### Secondary (MEDIUM confidence)
- [canvas-confetti npm](https://www.npmjs.com/package/canvas-confetti) — version 1.9.3, TypeScript via @types
- [@types/canvas-confetti npm](https://www.npmjs.com/package/@types/canvas-confetti) — version 1.9.0
- [Supabase Next.js docs](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) — server action pattern confirmed
- [ISO week number algorithm](https://www.epoch-calendar.com/support/getting_iso_week.html) — standard ISO 8601 calculation

### Tertiary (LOW confidence)
- WebSearch results on slot machine animation patterns — implementation approach chosen based on simplicity and project context

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies confirmed from existing package.json; only canvas-confetti is new
- Architecture: HIGH — patterns mirror what's already built in Phase 1 and Phase 2
- Pitfalls: HIGH — Next.js 16 + Supabase patterns verified against official docs and existing codebase

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (30 days — stable stack)
