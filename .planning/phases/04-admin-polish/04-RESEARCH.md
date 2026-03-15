# Phase 4: Admin + Polish - Research

**Researched:** 2026-03-15
**Domain:** Admin UI (Next.js Server Components), Framer Motion page transitions, Google Fonts (Tailwind v4), Supabase Edge Functions (pg_cron), WhatsApp wa.me formatting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Admin credentials: username123 / password123 (not admin / admin123)
- Admin navigates to /admin directly (no visible link in UI)
- Admin orders their own lunch through the normal user flow
- Admin page is a simple order list, not a dashboard
- Action buttons at top: "Send to WhatsApp" + "Copy to clipboard" + "Archive Week"
- Each order shows: name, category emoji, meal name, price, special requests (if any)
- Show count: "This Week's Orders (X of 18)"
- Show who has NOT ordered — "Still to order (N): Anastasia, Andre, ..."
- No sortable table — flat list is enough for ~18 people
- WhatsApp message grouped by category with emoji headers (Pizza, Pasta, Salad, Panini)
- Each item: "• Name — Meal Name RPrice (Special requests if any)"
- Footer: "Total: RXXX (N orders)"
- WhatsApp recipient hardcoded to +27711602891
- wa.me link format: wa.me/27711602891?text=<encoded message>
- Manual archive: confirmation dialog with count of unordered people; warning if not all 18 ordered
- After archive: empty state, fresh week starts; archived=true in DB for Previous Order feature
- Edge Function auto-archives every Sunday 21:00 UTC — silent
- Framer Motion page transitions on ALL navigation (login, name selector, order page, admin)
- Existing animations (confetti, Surprise Me, map flyTo) stay as-is
- Pacifico (weight "400") for main titles
- Fredoka One (weight "400") for sub-headers, tab labels, button text, section headers
- Body text stays clean sans-serif
- Replace Geist fonts with Pacifico/Fredoka One in layout.tsx
- Riivo colour scheme stays as-is (#0B1C3E navy, #D4E000 yellow, #A8B8D0 muted)
- General mobile responsiveness pass: touch targets, text sizing, scroll behaviour, sticky buttons

### Claude's Discretion
- Framer Motion transition type and duration (fade, slide, etc.)
- Admin page empty state illustration/emoji
- Exact mobile breakpoints and adjustments
- Edge Function implementation details (cron schedule, Supabase invoke pattern)
- Order list item styling on admin page
- WhatsApp message encoding details
- Confirmation dialog styling

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ADM-01 | Admin page at /admin, only accessible to admin role | Existing auth pattern confirmed in admin/page.tsx — getUser() + profiles.role check in place |
| ADM-02 | Table showing all current week orders (name, meal, price, customisation, time) | Supabase query pattern — filter by week_number + year + archived=false; PEOPLE array provides "still to order" diff |
| ADM-03 | Button to manually archive current week orders | Server action — bulk UPDATE orders SET archived=true WHERE week_number=X AND year=Y AND archived=false |
| ADM-04 | Button to export orders as text summary for WhatsApp | Client-side string building + encodeURIComponent; wa.me deep link pattern confirmed |
| DB-04 | Weekly auto-reset Edge Function archives orders Sunday 21:00 UTC | pg_cron + pg_net + Supabase Edge Function TypeScript; migration SQL pattern confirmed |
| UI-01 | Fun, colourful, playful design with Tailwind CSS | Riivo colour tokens already in globals.css @theme; extending with font tokens |
| UI-02 | Framer Motion animations (zoom, confetti, transitions) | framer-motion 12.x supports React 19; AnimatePresence + FrozenRouter pattern for App Router |
| UI-03 | Google Fonts (Pacifico/Fredoka One) for headers | next/font/google with variable option; @theme inline in globals.css for Tailwind v4 |
| UI-04 | Mobile-friendly responsive layout | Tailwind responsive utilities; touch targets min-h-[44px], sticky bottom bar pattern already used |
</phase_requirements>

---

## Summary

Phase 4 has three distinct technical streams: (1) admin data layer and UI, (2) visual polish, and (3) automated archiving via Edge Function. All three have clear, well-understood implementation paths.

The admin page builds directly on the existing auth pattern in `src/app/admin/page.tsx`. The current-week orders query is a simple Supabase filter (week_number + year + archived=false). The "still to order" list is computed client-side by diffing the PEOPLE array against the orders' `selected_name` values — no extra DB query needed. The WhatsApp export is pure string formatting followed by `encodeURIComponent`, opened via a `wa.me` deep link.

For visual polish, Framer Motion 12.x (same package as `framer-motion`, supports React 19) provides AnimatePresence for page transitions. The App Router requires a `FrozenRouter` wrapper to prevent context thrash during animations — this is a known pattern with established code. Google Fonts (Pacifico, Fredoka One) integrate via `next/font/google` with CSS variables exposed to Tailwind v4's `@theme inline` block in `globals.css`. The automated archive is a Supabase Edge Function invoked by a `pg_cron` + `pg_net` scheduled SQL call in a migration.

**Primary recommendation:** Implement admin + export first (highest business value), then fonts + transitions, then Edge Function last (lowest risk if delayed).

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.x (latest) | Page transitions, AnimatePresence | Supports React 19; same package name as always |
| next/font/google | built-in (Next.js 16) | Self-host Pacifico + Fredoka One | Zero external requests; built into Next.js |
| Supabase Edge Functions | Deno TypeScript | Weekly auto-archive cron | Official Supabase serverless; pg_cron integration |
| pg_cron + pg_net | Supabase built-in | Schedule Edge Function invocation | Standard Supabase scheduling pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| canvas-confetti | 1.9.4 (installed) | Existing success animation | Already in use — do not replace |
| encodeURIComponent | built-in | WhatsApp text encoding | URL-encode the message string before wa.me link |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| framer-motion | motion (new package name) | `motion` is the new brand name but `framer-motion` still works and is the same package version 12.x — use `framer-motion` to avoid import refactoring |
| pg_cron Edge Function | Supabase Cron dashboard | Dashboard cron is UI-only; migration-based pg_cron is reproducible and version-controlled |
| wa.me deep link | WhatsApp Business API | API requires paid account; wa.me is zero-cost for this use case |

**Installation:**
```bash
npm install framer-motion
```

---

## Architecture Patterns

### Recommended Project Structure (additions only)
```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Server Component — auth check + data fetch
│   │   └── AdminPageClient.tsx   # 'use client' — list UI, action buttons, dialogs
│   └── layout.tsx                # Add Pacifico + Fredoka One fonts, AnimatePresence wrapper
├── components/
│   └── PageTransition.tsx        # Reusable motion.div wrapper for all pages
├── utils/
│   └── adminActions.ts           # 'use server' — getWeeklyOrders, archiveWeek
supabase/
├── functions/
│   └── archive-weekly-orders/
│       └── index.ts              # Edge Function — Deno TypeScript
└── migrations/
    └── XXXXXXXXXXXXXXXX_schedule_archive_cron.sql  # pg_cron schedule + vault secrets
```

### Pattern 1: Admin Data Fetch (Server Component)
**What:** Fetch current week's orders server-side, pass to client component as props
**When to use:** Protected page with data that doesn't need real-time updates

```typescript
// src/app/admin/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminPageClient from './AdminPageClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('auth_user_id', user.id).single()
  if (profile?.role !== 'admin') redirect('/home')

  // Fetch current week orders
  const { week, year } = getISOWeekNumber(new Date())
  const { data: orders } = await supabase
    .from('orders')
    .select('id, selected_name, meal_category, meal_name, price, customisation, created_at')
    .eq('week_number', week)
    .eq('year', year)
    .eq('archived', false)
    .order('created_at', { ascending: true })

  return <AdminPageClient orders={orders ?? []} weekNumber={week} year={year} />
}
```

### Pattern 2: Archive Server Action
**What:** Bulk UPDATE orders to archived=true for current week
**When to use:** Admin triggers manual archive

```typescript
// src/utils/adminActions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

export async function archiveWeek(weekNumber: number, year: number): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ archived: true })
    .eq('week_number', weekNumber)
    .eq('year', year)
    .eq('archived', false)
  return error ? { error: error.message } : {}
}
```

### Pattern 3: WhatsApp Export String Builder
**What:** Group orders by category, format message, encode for wa.me URL
**When to use:** "Send to WhatsApp" and "Copy to clipboard" buttons

```typescript
// Inside AdminPageClient.tsx (client-side utility)
const CATEGORY_EMOJIS: Record<string, string> = {
  Pizza: '🍕', Pasta: '🍝', Salad: '🥗', Panini: '🥖'
}
const CATEGORY_ORDER = ['Pizza', 'Pasta', 'Salad', 'Panini']

function buildWhatsAppMessage(orders: Order[]): string {
  const grouped = CATEGORY_ORDER.reduce<Record<string, Order[]>>((acc, cat) => {
    acc[cat] = orders.filter(o => o.meal_category === cat)
    return acc
  }, {})

  const lines: string[] = ['*This Week\'s Lunch Orders*', '']
  for (const cat of CATEGORY_ORDER) {
    const catOrders = grouped[cat]
    if (catOrders.length === 0) continue
    lines.push(`${CATEGORY_EMOJIS[cat]} *${cat}*`)
    for (const o of catOrders) {
      const special = o.customisation ? ` (${o.customisation})` : ''
      lines.push(`• ${o.selected_name} — ${o.meal_name} R${o.price}${special}`)
    }
    lines.push('')
  }

  const total = orders.reduce((sum, o) => sum + Number(o.price), 0)
  lines.push(`Total: R${total} (${orders.length} orders)`)
  return lines.join('\n')
}

function getWhatsAppLink(message: string): string {
  return `https://wa.me/27711602891?text=${encodeURIComponent(message)}`
}
```

### Pattern 4: Framer Motion Page Transitions (App Router)
**What:** AnimatePresence wrapping layout.tsx children, with FrozenRouter to prevent context thrash
**When to use:** All page navigation in Next.js App Router

```typescript
// src/components/PageTransition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useContext, useRef } from 'react'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const frozen = useRef(context).current
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={segment}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  )
}
```

Then wrap in layout.tsx body:
```tsx
// app/layout.tsx — children wrapped in PageTransition
<body className={`${pacifico.variable} ${fredoka.variable} antialiased`}>
  <PageTransition>{children}</PageTransition>
</body>
```

### Pattern 5: Google Fonts with Tailwind v4
**What:** next/font/google with CSS variable option; Tailwind v4 @theme inline references the variable
**When to use:** Replacing Geist fonts with Pacifico + Fredoka One

```typescript
// src/app/layout.tsx
import { Pacifico, Fredoka_One } from 'next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
})

const fredoka = Fredoka_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
})
```

```css
/* src/app/globals.css — extend existing @theme inline block */
@theme inline {
  /* existing tokens... */
  --font-pacifico: var(--font-pacifico);
  --font-fredoka: var(--font-fredoka);
  --font-sans: Arial, Helvetica, sans-serif; /* body stays sans-serif */
}
```

Usage in Tailwind classes: `font-[family-name:var(--font-pacifico)]` or define utility in globals.css:
```css
@layer utilities {
  .font-pacifico { font-family: var(--font-pacifico), cursive; }
  .font-fredoka  { font-family: var(--font-fredoka), sans-serif; }
}
```

### Pattern 6: Supabase Edge Function with pg_cron Schedule
**What:** Deno TypeScript function + SQL migration that schedules it via pg_cron + pg_net
**When to use:** Sunday 21:00 UTC weekly auto-archive

```typescript
// supabase/functions/archive-weekly-orders/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Calculate current week (ISO week)
  const now = new Date()
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  const year = d.getUTCFullYear()

  const { error } = await supabase
    .from('orders')
    .update({ archived: true })
    .eq('week_number', week)
    .eq('year', year)
    .eq('archived', false)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  return new Response(JSON.stringify({ ok: true, week, year }), { status: 200 })
})
```

```sql
-- supabase/migrations/XXXXXXXXXXXXXXXX_schedule_archive_cron.sql
-- Store project URL and anon key in Vault (run once; values come from environment)
select vault.create_secret(current_setting('app.supabase_url'), 'project_url');
select vault.create_secret(current_setting('app.supabase_anon_key'), 'anon_key');

-- Schedule: every Sunday at 21:00 UTC
select cron.schedule(
  'archive-weekly-orders',
  '0 21 * * 0',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/archive-weekly-orders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' ||
        (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

**NOTE:** The Vault secret seeding approach with `current_setting` requires the migration to be run with those settings configured. An alternative is to skip Vault in the migration and let the Edge Function use the built-in `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars (always available in Edge Functions), and use the service role key in the cron Authorization header. For this app's simple use case, the simpler approach is to hardcode the anon key in the cron migration using a SQL variable.

### Anti-Patterns to Avoid
- **Framer Motion in Server Components:** AnimatePresence and motion.div require `'use client'`. The PageTransition wrapper must be a client component. Do not add `'use client'` to layout.tsx — import a separate client wrapper.
- **LayoutRouterContext import path:** The FrozenRouter pattern imports from `next/dist/shared/lib/app-router-context.shared-runtime` — this is an internal path that can break. A simpler alternative: use `usePathname` as the animation key (no FrozenRouter needed) but accept that exit animations won't play on fast navigations.
- **Edge Function using anon key for admin operations:** The Edge Function must use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS), not the anon key. The scheduled cron HTTP call uses the anon key just for triggering the function; inside the function, use service role.
- **Week number mismatch between app and Edge Function:** Both the app's `orderActions.ts` and the Edge Function must use the same ISO week calculation. Copy the exact function from `orderActions.ts` into the Edge Function.
- **Pacifico font export name:** In `next/font/google`, the import name for "Fredoka One" is `Fredoka_One` (underscore, not space). Verify exact export names from the package before using.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page transitions | Custom CSS keyframes + router events | framer-motion AnimatePresence | App Router timing makes manual approach fragile |
| Font loading | @font-face declarations | next/font/google | Self-hosting, layout shift prevention, CLS = 0 |
| WhatsApp URL encoding | Custom encoder | encodeURIComponent (built-in) | Handles all special characters including emoji |
| Cron scheduling | Vercel cron (vercel.json) | Supabase pg_cron + Edge Function | All in Supabase stack; no Vercel Pro required for cron |

**Key insight:** The WhatsApp export and "still to order" list are pure client-side logic — no new APIs, no DB queries beyond what the page already fetches.

---

## Common Pitfalls

### Pitfall 1: FrozenRouter Internal Import Breaking
**What goes wrong:** `next/dist/shared/lib/app-router-context.shared-runtime` is an internal Next.js path that may not exist in all versions or may move between versions.
**Why it happens:** The App Router context is not exposed as a public API.
**How to avoid:** Use `usePathname()` as the AnimatePresence key instead of `useSelectedLayoutSegment()` with FrozenRouter. Exit animations will be shorter (page unmounts faster) but the approach is stable. Duration 150-200ms keeps it imperceptible.
**Warning signs:** TypeScript error "Cannot find module 'next/dist/...'"

### Pitfall 2: Admin Credentials Migration Complexity
**What goes wrong:** Changing admin password in seed.sql doesn't affect an already-deployed database.
**Why it happens:** seed.sql is run at DB init, not on every `supabase db push`.
**How to avoid:** Use a migration to update the admin password: `UPDATE auth.users SET encrypted_password = extensions.crypt('password123', extensions.gen_salt('bf')) WHERE email = 'admin@lunchapp.com'`. Also update auth.identities email if username changes.
**Warning signs:** Admin login still works with old password after push.

### Pitfall 3: Week Number in Edge Function vs. App
**What goes wrong:** Edge Function runs on Sunday at 21:00 UTC — this is still Sunday, but the ISO week calculation for the *current* week at that moment may differ from what the app stored orders under.
**Why it happens:** ISO week boundaries and timezone differences. The app stores orders with the ISO week number based on UTC date. At Sunday 21:00 UTC the ISO week hasn't rolled over yet (it rolls over at Monday 00:00 UTC).
**How to avoid:** The Edge Function archiving Sunday's week is correct — compute week number from Sunday's date (not Monday's). The exact same `getISOWeekNumber` function must be used in both places.
**Warning signs:** Orders from the previous week appear unarchived on Monday.

### Pitfall 4: Tailwind v4 Font Utilities Naming Collision
**What goes wrong:** Defining `--font-pacifico` as a CSS variable name AND as a Tailwind token in `@theme inline` can cause the Tailwind utility class `font-pacifico` to conflict with the CSS variable if names collide.
**Why it happens:** Tailwind v4 uses the token name directly as the utility class suffix.
**How to avoid:** Use the `@layer utilities` approach to define `.font-pacifico` and `.font-fredoka` explicitly rather than relying on auto-generated utilities from `@theme`.

### Pitfall 5: Edge Function Deployment
**What goes wrong:** Edge Functions require `supabase functions deploy <name>` — they are NOT automatically deployed by `supabase db push`.
**Why it happens:** Functions and migrations are separate deployment targets.
**How to avoid:** The plan must include explicit `supabase functions deploy archive-weekly-orders` as a task step.

---

## Code Examples

Verified patterns from official/established sources:

### Current Week Orders Query
```typescript
// Confirmed pattern from existing orderActions.ts ISO week calculation
function getISOWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { week, year: d.getUTCFullYear() }
}

// Admin fetch — all current week orders
const { data: orders } = await supabase
  .from('orders')
  .select('id, selected_name, meal_category, meal_name, price, customisation, created_at')
  .eq('week_number', week)
  .eq('year', year)
  .eq('archived', false)
  .order('created_at', { ascending: true })
```

### "Still to Order" Diff
```typescript
// Client-side — no DB query needed
import { PEOPLE } from '@/data/people'  // 18 names

const orderedNames = new Set(orders.map(o => o.selected_name))
const stillToOrder = PEOPLE.map(p => p.name).filter(name => !orderedNames.has(name))
// Display: "Still to order (11): Anastasia, Andre, ..."
```

### pg_cron Syntax for Sunday 21:00 UTC
```sql
-- Standard cron: minute hour day-of-month month day-of-week
-- 0 21 * * 0  →  21:00 UTC every Sunday (0 = Sunday)
select cron.schedule('archive-weekly-orders', '0 21 * * 0', $$ ... $$);
```

### Confirmation Dialog Pattern (client component)
```typescript
// No library needed — simple state toggle
const [showConfirm, setShowConfirm] = useState(false)

// In JSX:
{showConfirm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-riivo-navy-light border border-riivo-border rounded-2xl p-6 max-w-sm w-full">
      <h3 className="font-fredoka text-riivo-white text-lg mb-2">Archive this week?</h3>
      <p className="text-riivo-muted text-sm mb-4">
        This will archive {orders.length} orders and start a fresh week.
        {stillToOrder.length > 0 && ` ${stillToOrder.length} people haven't ordered yet.`}
      </p>
      <div className="flex gap-3">
        <button onClick={() => setShowConfirm(false)} className="flex-1 ...">Cancel</button>
        <button onClick={handleArchive} className="flex-1 ...">Archive</button>
      </div>
    </div>
  </div>
)}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from 'framer-motion'` | Same — still works in v12 | Rebranded to `motion` in 2024 but framer-motion still publishes | No change needed |
| `tailwind.config.ts` font theme | `@theme inline` in globals.css | Tailwind v4 (2024) | Eliminates config file; CSS-only theming |
| Separate Geist font import | Replace with Pacifico + Fredoka_One | This phase | Import from `next/font/google` same way |
| Manual pg_cron SQL in SQL editor | Migration file for reproducibility | Best practice always | Keeps cron schedule version-controlled |

**Deprecated/outdated:**
- `@next/font/google`: Old import path — correct import is `next/font/google` (no @ prefix). The search result showing `@next/font/google` is outdated.

---

## Open Questions

1. **Vault secrets in migration for pg_cron**
   - What we know: The recommended pattern stores URL + anon key in Supabase Vault, then pg_cron reads from `vault.decrypted_secrets`
   - What's unclear: Whether `vault.create_secret` can be called in a migration file deterministically without manual steps, especially for dev vs prod environments
   - Recommendation: For planning purposes, treat the cron setup as two manual steps (not migration-automated): (1) deploy the Edge Function, (2) create the cron job via Supabase Dashboard SQL editor. Include a migration template but note it requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` to be substituted. Alternatively, use a Postgres `DO $$` block that reads from `current_setting` which can be set per-environment.

2. **Admin credential update mechanism**
   - What we know: `seed.sql` runs at DB init only; existing deployed DB has `admin123` as password
   - What's unclear: Whether the dev Supabase instance needs the password updated or if it's a fresh DB each time
   - Recommendation: Include a migration that updates the admin password + username. Use `UPDATE auth.users SET encrypted_password = extensions.crypt('password123', extensions.gen_salt('bf')) WHERE email = 'admin@lunchapp.com'`. Also update the `username` field in `profiles` if changing from 'admin' to 'username123'.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directories exist |
| Config file | None — Wave 0 must create if validation required |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADM-01 | /admin redirects non-admin to /home | manual-only | N/A — requires Supabase auth context | ❌ Wave 0 (if framework added) |
| ADM-02 | Orders list shows current week only | manual-only | N/A — requires live DB | ❌ Wave 0 |
| ADM-03 | Archive sets archived=true | manual-only | N/A — requires live DB | ❌ Wave 0 |
| ADM-04 | WhatsApp message format correct | unit | `buildWhatsAppMessage` pure function test | ❌ Wave 0 |
| DB-04 | Edge Function archives correct week | manual-only | Invoke via curl after deploy | ❌ Wave 0 |
| UI-01 | Visual polish present | manual-only | Visual review | N/A |
| UI-02 | Page transitions animate | manual-only | Visual review | N/A |
| UI-03 | Pacifico/Fredoka One load | manual-only | Visual review | N/A |
| UI-04 | Mobile responsive | manual-only | Manual device review | N/A |

### Sampling Rate
- **Per task commit:** No automated test suite — visual/manual verification after each task
- **Per wave merge:** Manual smoke test: login flow, order flow, admin page, archive, WhatsApp export
- **Phase gate:** All success criteria verified manually before `/gsd:verify-work`

### Wave 0 Gaps
- No test framework exists in this project — given the app's nature (auth-dependent, UI-heavy), all validations are manual
- The `buildWhatsAppMessage` pure function is the only unit-testable piece; framework setup is optional for this phase given project scope

*(Recommendation: skip automated test framework for Phase 4 — all behaviors require live Supabase auth or visual inspection. Manual checklist in VERIFY is sufficient.)*

---

## Sources

### Primary (HIGH confidence)
- Next.js official docs (nextjs.org/docs/app/getting-started/fonts, version 16.1.6, updated 2026-02-27) — Google Font usage, next/font/google API
- Supabase official docs (supabase.com/docs/guides/functions/schedule-functions) — pg_cron + pg_net Edge Function scheduling pattern
- npm registry — framer-motion@12.36.0 confirmed React 19 peer dependency support
- Existing codebase — `orderActions.ts` ISO week function, `orders` table schema, `profiles` RLS pattern, `PEOPLE` array structure

### Secondary (MEDIUM confidence)
- owolf.com — Next.js 15 + Tailwind v4 font CSS variable pattern (verified against official Tailwind v4 @theme docs)
- imcorfitz.com — FrozenRouter + AnimatePresence pattern for App Router (multiple community sources corroborate)
- Supabase docs cron quickstart — pg_cron syntax `0 21 * * 0` for Sunday 21:00

### Tertiary (LOW confidence)
- FrozenRouter using `next/dist/shared/lib/app-router-context.shared-runtime` — internal path; confirmed by community but not officially documented. Flag for validation during implementation.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — framer-motion React 19 support confirmed via npm; next/font confirmed via official docs
- Architecture: HIGH — all patterns build on existing codebase patterns; admin auth pattern already in place
- Pitfalls: HIGH — based on direct inspection of codebase (seed.sql, migrations, existing patterns)
- Edge Function: MEDIUM — pg_cron pattern confirmed in docs; Vault secret migration approach has env-specific complexity

**Research date:** 2026-03-15
**Valid until:** 2026-04-14 (30 days — stable stack)
