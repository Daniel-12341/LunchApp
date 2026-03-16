# Phase 2: Name Selector - Research

**Researched:** 2026-03-15
**Domain:** React-Leaflet maps in Next.js App Router, emoji markers, flyTo animation, Supabase schema migration
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Full-screen Leaflet map filling the entire viewport
- Floating dropdown card top-center with padding, header: "Who's hungry?" with food emoji
- Default view: Overview of Western Cape with ALL 18 markers visible at a zoomed-out level
- 18 members (not 10) — profiles table must be updated to these 18 org members with location, emoji, fun_label columns
- Markers show emoji combo ONLY — no fun label text on map; location name shown alongside emoji on marker
- Non-selected markers stay visible but dimmed (reduced opacity); selected marker at full opacity after zoom
- Leaflet flyTo() with smooth 2-3 second animation; fly directly to new person when switching (no zoom-out-first)
- After zoom lands: marker bounces/pulses as arrival effect
- Continue button appears AFTER zoom animation completes, positioned bottom-center floating, text: "Continue"
- Continue button navigates to /order (placeholder page until Phase 3)
- Replace current `src/app/home/page.tsx` with name selector
- New route: `src/app/order/page.tsx` placeholder
- Selected name must persist (cookie, URL param, or session state) for Phase 3

### Claude's Discretion
- Leaflet tile provider choice (OpenStreetMap, CartoDB, etc.)
- Map zoom levels (initial overview vs. zoomed-in on person)
- Exact marker styling (size, shadow, border)
- Continue button animation (slide-up, fade-in, etc.)
- Dropdown component styling details
- James "in the sea" marker placement (somewhere in False Bay or Atlantic)
- /order placeholder page design

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MAP-01 | Full-screen page with dropdown of 18 organisation members (updated from 10) | Leaflet MapContainer with 100vw/100vh; React select/native dropdown floating above map |
| MAP-02 | Leaflet.js map of Western Cape with smooth zoom animation to selected person's location | react-leaflet v4, useMap hook, map.flyTo(), moveend event for completion detection |
| MAP-03 | Custom emoji markers with fun labels per person | L.divIcon with HTML, CSS opacity for dimming, CSS keyframes for bounce/pulse on arrival |
| MAP-04 | Continue button appears after zoom, navigates to order page | moveend listener in useEffect, React state `animationComplete`, URL param or cookie for name persistence |
</phase_requirements>

---

## Summary

Phase 2 is a visual-first feature: a full-screen Leaflet map where users select their name and watch the map animate to their location. The core technical challenge is integrating Leaflet (a browser-only DOM library) into Next.js App Router, which defaults to server-side rendering. The solution is well-established: dynamic import with `ssr: false` wraps the entire map component, keeping the page itself a Server Component.

The second challenge is the flyTo-then-show-Continue flow. React-Leaflet's `useMap()` hook provides the Leaflet instance, and `useEffect` can watch the selected name to trigger `map.flyTo()`. Detecting animation completion uses Leaflet's native `moveend` event. The `animationComplete` state bit then reveals the Continue button.

Multiple people share the same location (5 in Rondebosch, 4 in Greyton). Overlapping markers need small coordinate offsets (±0.005–0.01 degrees) hardcoded in the data to prevent stacking. The selected name must survive navigation to `/order`, making a URL query parameter the simplest stateless approach.

**Primary recommendation:** Use react-leaflet v4 with Next.js dynamic import (ssr:false), L.divIcon for emoji markers, flyTo with moveend detection, and URL query param (`?name=Daniel`) to pass the selected name to the order page.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-leaflet | ^4.x | React component wrappers for Leaflet | Official React integration; MapContainer, Marker, TileLayer, useMap hook |
| leaflet | ^1.9.x | Base map library | Powers all map rendering; react-leaflet peer dependency |
| @types/leaflet | latest | TypeScript types | Required — Leaflet has no built-in types |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | - | No additional map library needed | DivIcon + CSS handles all marker needs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-leaflet | Plain leaflet | More manual DOM management, no React lifecycle integration |
| react-leaflet | MapLibre GL / Mapbox GL | Overkill; requires API keys; bundle size much larger |
| CartoDB tiles | OpenStreetMap tiles | OSM is fine but CartoDB Voyager/Positron look cleaner for this app's playful style |

**Installation:**
```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── home/
│   │   └── page.tsx          # Server Component — auth check, fetch profiles, render NameSelectorPage
│   └── order/
│       └── page.tsx          # Server Component — placeholder for Phase 3
├── components/
│   ├── NameSelectorPage.tsx  # Client Component ('use client') — owns all state
│   ├── MapComponent.tsx      # Client Component ('use client') — Leaflet map, dynamic-imported
│   └── PersonMarker.tsx      # Client Component — individual DivIcon marker
supabase/
└── migrations/
    └── <timestamp>_add_profile_location_fields.sql
```

### Pattern 1: SSR-Safe Leaflet Import
**What:** Leaflet accesses `window` and `document` on import; Next.js SSR has neither. Dynamic import with `ssr: false` defers execution to the browser.
**When to use:** Every time a Leaflet component is used in Next.js App Router.
**Example:**
```typescript
// src/components/NameSelectorPage.tsx
// Source: https://xxlsteve.net/blog/react-leaflet-on-next-15/
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-emerald-50 animate-pulse" />,
})
```

### Pattern 2: useMap Hook for flyTo
**What:** `useMap()` from react-leaflet returns the Leaflet map instance. It only works inside a component that is a descendant of `<MapContainer>`. A dedicated controller component handles the animation.
**When to use:** Whenever you need to programmatically pan/zoom the map.
**Example:**
```typescript
// src/components/MapComponent.tsx
'use client'
import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

interface FlyControllerProps {
  target: { lat: number; lng: number } | null
  zoom: number
  onAnimationEnd: () => void
}

function FlyController({ target, zoom, onAnimationEnd }: FlyControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!target) return

    map.flyTo([target.lat, target.lng], zoom, { animate: true, duration: 2.5 })

    const handleMoveEnd = () => {
      onAnimationEnd()
      map.off('moveend', handleMoveEnd)
    }
    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
    }
  }, [target, zoom, map, onAnimationEnd])

  return null
}
```

### Pattern 3: Emoji DivIcon Markers
**What:** `L.divIcon` creates an HTML-backed marker. Emoji render as text inside a styled div. CSS class enables the bounce animation on arrival.
**When to use:** Any non-image marker (emoji, text, SVG).
**Example:**
```typescript
// Source: https://leafletjs.com/examples/custom-icons/
import L from 'leaflet'

function createEmojiIcon(emoji: string, isSelected: boolean, isBouncing: boolean) {
  return L.divIcon({
    html: `<div class="emoji-marker ${isSelected ? 'marker-selected' : 'marker-dimmed'} ${isBouncing ? 'marker-bounce' : ''}">${emoji}</div>`,
    className: '',   // clear default leaflet styles
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}
```

CSS in globals.css:
```css
.emoji-marker {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}
.marker-dimmed { opacity: 0.35; }
.marker-selected { opacity: 1; }
@keyframes markerBounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-12px); }
  60% { transform: translateY(-6px); }
}
.marker-bounce { animation: markerBounce 0.6s ease 3; }
```

### Pattern 4: Coordinate Offsets for Co-located People
**What:** Multiple members share the same town. Hardcode small lat/lng offsets (±0.005 degrees ≈ 500m) per person to prevent markers from stacking.
**When to use:** Whenever 2+ markers share the same nominal location.
**Example:**
```typescript
// Rondebosch base: approx -33.957, 18.474
// Each person gets a unique offset so markers don't stack
{ name: 'Nic',     lat: -33.952, lng: 18.471 },
{ name: 'Andrea',  lat: -33.957, lng: 18.478 },
{ name: 'Angus',   lat: -33.961, lng: 18.474 },
{ name: 'Lungile', lat: -33.955, lng: 18.469 },
{ name: 'Rosie',   lat: -33.959, lng: 18.479 },
```

### Pattern 5: URL Param for Name Persistence
**What:** Pass selected name via URL query parameter to the order page. Simple, stateless, bookmarkable, no cookies needed.
**When to use:** Single-value state that must survive navigation.
**Example:**
```typescript
// In NameSelectorPage.tsx after Continue click:
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push(`/order?name=${encodeURIComponent(selectedName)}`)

// In order/page.tsx (Server Component):
export default function OrderPage({ searchParams }: { searchParams: { name?: string } }) {
  const name = searchParams.name ?? ''
  // ...
}
```

### Anti-Patterns to Avoid
- **Importing Leaflet at module scope in a Server Component:** Crashes build — always use dynamic import or 'use client'.
- **Omitting leaflet/dist/leaflet.css import:** Map tiles render but controls (zoom buttons, attribution) are unstyled and mispositioned.
- **Calling useMap() outside MapContainer:** React error at runtime — FlyController must be a child of MapContainer.
- **Listening for moveend without cleanup:** Listener accumulates on each re-render causing the Continue button to fire multiple times.
- **Setting map height via Tailwind h-screen only:** Leaflet requires an explicit pixel or viewport height; `style={{ height: '100vh' }}` on the MapContainer is the safest approach.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pan/zoom to location | Custom tween/scroll logic | `map.flyTo()` from Leaflet | Handles zoom + pan in one smooth animation with easing built in |
| HTML emoji markers | Canvas rendering or SVG generation | `L.divIcon` with HTML string | Fully supported, CSS-animatable, no extra dependencies |
| Overlapping marker detection | Collision detection algorithm | Manual coordinate offsets per person | Only 18 static points — hardcoded offsets are simpler and maintainable |

**Key insight:** Leaflet solves virtually every map interaction problem. The only custom code needed is the `moveend` listener to bridge Leaflet's event system into React state.

---

## Common Pitfalls

### Pitfall 1: Leaflet CSS Not Imported
**What goes wrong:** Map renders but zoom controls are invisible or misplaced; marker shadows are missing.
**Why it happens:** Leaflet ships its own CSS that must be explicitly imported.
**How to avoid:** Add `import 'leaflet/dist/leaflet.css'` at the top of the MapComponent file (the one marked `'use client'`).
**Warning signs:** Visible map tiles but broken/invisible UI controls.

### Pitfall 2: Default Marker Icon 404s
**What goes wrong:** Default Leaflet pin markers show broken image icons in Next.js.
**Why it happens:** Leaflet resolves marker-icon.png relative to leaflet.js; Next.js asset paths break this.
**How to avoid:** Use `L.divIcon` for all markers (this phase uses emoji DivIcons anyway — default icon is never used).
**Warning signs:** Console 404 errors for marker-icon.png.

### Pitfall 3: moveend Fires on Initial Map Load
**What goes wrong:** Continue button appears immediately on page load before the user selects anyone.
**Why it happens:** Leaflet fires moveend when the map first renders to its initial bounds.
**How to avoid:** Only attach the moveend listener inside the `useEffect` that responds to a non-null `target`. Do not register a global moveend on mount.
**Warning signs:** Continue button visible before any name is selected.

### Pitfall 4: flyTo Called with Stale Map Reference
**What goes wrong:** Animation doesn't trigger, or triggers on the wrong target.
**Why it happens:** `useEffect` dependency array omits `target`, causing stale closure.
**How to avoid:** Include `target` and `zoom` in the `useEffect` dependency array.
**Warning signs:** Selecting a second name doesn't animate, or animates to wrong location.

### Pitfall 5: Map Container Height Not Set
**What goes wrong:** Map renders as 0px height — invisible.
**Why it happens:** Leaflet requires an explicit height on its container element.
**How to avoid:** Set `style={{ height: '100vh', width: '100%' }}` directly on `<MapContainer>`, not just Tailwind classes.
**Warning signs:** White/blank space where map should be.

### Pitfall 6: Supabase Migration Breaks Existing Profiles
**What goes wrong:** Alter table migration fails or seeds conflict with existing 10 users from Phase 1.
**Why it happens:** Phase 1 seeded 10 users (AUTH-04) with a different set of names than the 18 needed here.
**How to avoid:** Migration must: (1) add new columns with nullable defaults, (2) DELETE old seed rows, (3) INSERT all 18 new profile rows. Use a single migration file.
**Warning signs:** Old auth-linked users (e.g., admin) lose their profile row; RLS breaks.

---

## Code Examples

Verified patterns from official sources:

### MapContainer Full-Screen Setup
```typescript
// Source: https://react-leaflet.js.org/docs/api-map/
'use client'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapComponent({ ... }) {
  return (
    <MapContainer
      center={[-33.9, 18.6]}   // Western Cape overview
      zoom={9}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {/* markers, FlyController */}
    </MapContainer>
  )
}
```

### CartoDB Voyager Tile URL (No API Key Required)
```
https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
```
Attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`

### Supabase Migration: Add Location Columns
```sql
-- supabase/migrations/<timestamp>_add_profile_location_fields.sql
alter table public.profiles
  add column if not exists location_name text,
  add column if not exists lat            double precision,
  add column if not exists lng            double precision,
  add column if not exists emoji          text,
  add column if not exists fun_label      text;

-- Remove Phase 1 seed data (wrong names/count), re-seed 18 members
delete from public.profiles where auth_user_id is null;

insert into public.profiles (username, role, location_name, lat, lng, emoji, fun_label) values
  ('Daniel',    'user',  'Stellenbosch', -33.9321, 18.8602, '🏓🔥', 'Smashing padel balls'),
  ('Nic',       'user',  'Rondebosch',   -33.9520, 18.4710, '⭐👶👑', 'Baby leader'),
  -- ... (all 18 rows)
  ;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getServerSideProps` + custom `_app` | Server Components + RSC data fetching | Next.js 13+ | Profile data fetched in Server Component, no prop drilling |
| react-leaflet v3 class components | react-leaflet v4 hooks (useMap, useMapEvents) | 2022 | `useMap()` is the standard; v3 patterns (withLeaflet HOC) are obsolete |
| Leaflet image icon markers | L.divIcon with HTML/CSS | Always supported, now preferred | Emoji/custom markers without asset management |

**Deprecated/outdated:**
- `withLeaflet` HOC from react-leaflet v3: removed in v4, use `useMap()` hook instead.
- `getServerSideProps` for auth: replaced by Server Components with `createClient()` from `@supabase/ssr`.

---

## Open Questions

1. **James "in the sea" coordinate**
   - What we know: CONTEXT.md says "False Bay or Atlantic"
   - What's unclear: Exact coordinate — any point clearly in ocean water works
   - Recommendation: False Bay center approx (-34.15, 18.7) — visually reads as "in the sea" on Western Cape overview

2. **Tile provider usage limits**
   - What we know: CartoDB tiles are free for reasonable use
   - What's unclear: Rate limits for production Vercel deployment
   - Recommendation: CartoDB Voyager for aesthetics; OpenStreetMap as fallback if needed

3. **Continue button animation style**
   - What we know: Claude's discretion per CONTEXT.md
   - Recommendation: Tailwind `transition-all duration-300` with `translate-y-4 opacity-0` → `translate-y-0 opacity-100` slide-up fade-in when `animationComplete` becomes true

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed — see Wave 0 |
| Config file | None — see Wave 0 |
| Quick run command | `npm run build` (TypeScript compile check) |
| Full suite command | Manual browser smoke test (no automated suite exists) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MAP-01 | Full-screen page renders with 18-name dropdown | smoke | `npm run build` (type-checks page renders) | ❌ Wave 0 |
| MAP-02 | Selecting a name triggers flyTo animation to correct location | manual | Manual: select each name, observe map pan | N/A — manual |
| MAP-03 | Custom emoji markers render; non-selected markers dimmed | smoke | `npm run build` + visual check | ❌ Wave 0 |
| MAP-04 | Continue button hidden until zoom completes, navigates to /order?name=X | manual | Manual: select name, wait, click Continue | N/A — manual |

### Sampling Rate
- **Per task commit:** `npm run build` — catches TypeScript errors and import failures
- **Per wave merge:** `npm run build` + manual browser smoke (select each of 18 names, verify zoom, verify Continue)
- **Phase gate:** Build green + manual smoke passes before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No test framework installed — project has no jest/vitest/playwright config
- [ ] Map interaction tests (flyTo, moveend) require browser environment; recommend deferring automated map tests to a future phase if Playwright is added

*(Core validation for this phase is: TypeScript build passes + manual browser smoke test)*

---

## Sources

### Primary (HIGH confidence)
- https://react-leaflet.js.org/ — MapContainer, useMap hook, Marker API
- https://leafletjs.com/reference.html — flyTo signature, moveend event, DivIcon
- https://leafletjs.com/examples/custom-icons/ — DivIcon HTML marker pattern
- https://nextjs.org/docs/app/api-reference/functions/use-search-params — URL params for name persistence

### Secondary (MEDIUM confidence)
- https://xxlsteve.net/blog/react-leaflet-on-next-15/ — SSR dynamic import pattern verified against Next.js docs
- https://carto.com/basemaps — CartoDB tile URLs (no API key required)
- https://github.com/leaflet-extras/leaflet-providers — tile provider reference

### Tertiary (LOW confidence)
- https://medium.com/sopra-steria-norge/react-leaflet-a-short-intro-with-animations-4fa8f8c5eb1c — flyTo + useMap animation pattern (returned 403, could not verify directly; pattern consistent with official react-leaflet hook docs)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — react-leaflet + Next.js dynamic import is the established, documented pattern
- Architecture: HIGH — useMap/FlyController/moveend pattern verified via official react-leaflet docs
- Pitfalls: HIGH — Leaflet CSS, default icons, moveend-on-load are well-documented community problems
- Supabase migration: HIGH — standard ALTER TABLE pattern per Supabase docs

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (react-leaflet v4 and Next.js 15 are stable; unlikely to change in 30 days)
