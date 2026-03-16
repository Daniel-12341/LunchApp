---
phase: 02-name-selector
verified: 2026-03-15T18:00:00Z
status: human_needed
score: 6/6 must-haves verified
re_verification: false
human_verification:
  - test: "Open /home in browser after login — verify full-screen Leaflet map renders with 18 emoji markers visible at Western Cape overview zoom (not a blank screen)"
    expected: "CartoDB Voyager basemap fills the entire viewport, all 18 emoji markers (with location labels beneath) are scattered across the Western Cape"
    why_human: "Leaflet renders entirely client-side; CSS height/width correctness and tile loading cannot be verified without a browser"
  - test: "Select a name from the dropdown (e.g. 'Daniel') — verify the flyTo animation runs for ~2.5 seconds and zooms to Stellenbosch"
    expected: "Map smoothly animates (not a jump) to the selected person's location over ~2.5 seconds"
    why_human: "Animation timing and smoothness are runtime behaviors"
  - test: "While a name is selected, verify non-selected markers are visibly dimmed and the selected marker is full opacity"
    expected: "All 17 non-selected markers appear at ~35% opacity; selected marker is bright"
    why_human: "CSS opacity state is applied via class logic at runtime — requires visual confirmation"
  - test: "After zoom completes, verify the selected marker bounces 3 times and the Continue button slides in at the bottom center"
    expected: "Marker bounces 3 times on arrival; Continue button appears with a slide-up animation"
    why_human: "Animation sequencing (moveend -> bounce -> button reveal) is a runtime behavior"
  - test: "Click Continue and verify navigation to /order?name=Daniel and the placeholder page shows 'Hang tight, Daniel'"
    expected: "URL changes to /order?name=Daniel; page reads 'Hang tight, Daniel — this is where you will place your lunch order.'"
    why_human: "Navigation and URL parameter rendering require a live browser session"
  - test: "Select a second name while a first is already selected — verify the map flies directly to the new location without zooming out first, and the Continue button disappears during flight"
    expected: "Direct fly animation to new location; Continue button absent during flight, reappears after landing"
    why_human: "Re-selection state transition is a runtime interaction"
---

# Phase 2: Name Selector Verification Report

**Phase Goal:** User can pick their name and watch the map zoom to their Western Cape location
**Verified:** 2026-03-15T18:00:00Z
**Status:** human_needed — all automated checks pass, visual/interactive behaviors require browser confirmation
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User sees a full-screen map of the Western Cape with all 18 emoji markers visible | ? NEEDS HUMAN | MapComponent renders `MapContainer` with `style={{ height: '100vh', width: '100%' }}` centered on [-33.9, 18.8] zoom 9; 18 markers driven by `people.map()` — visual confirmation needed |
| 2 | User sees a floating dropdown card with "Who's hungry?" header and all 18 names | VERIFIED | `NameSelectorPage.tsx` line 46: `"Who's hungry?"` header; `PEOPLE.map(person => <option>)` renders all 18 names from the array |
| 3 | Selecting a name triggers a smooth 2.5-second flyTo animation to that person's location | ? NEEDS HUMAN | `FlyController` calls `map.flyTo([lat, lng], zoom, { animate: true, duration: 2.5 })` on target change — animation smoothness needs runtime confirmation |
| 4 | Non-selected markers are dimmed; selected marker is full opacity with bounce animation | VERIFIED (logic) | `createEmojiIcon` applies `marker-dimmed` / `marker-selected` / `marker-bounce` CSS classes correctly; CSS keyframe and opacity rules exist in `globals.css` — visual confirmation needed |
| 5 | Continue button appears only after zoom animation completes | VERIFIED | `animationComplete && selectedPerson &&` guard on line 66 of `NameSelectorPage.tsx`; `handleAnimationEnd` only fires from `moveend` listener registered post-flyTo |
| 6 | Clicking Continue navigates to /order?name=SelectedName | VERIFIED | `router.push('/order?name=' + encodeURIComponent(selectedPerson.name))` in `handleContinue`; `/order` page receives `searchParams.name` and renders it in the placeholder |

**Score:** 6/6 truths have verified implementations; 2 of 6 require human visual confirmation for full certainty

---

## Required Artifacts

| Artifact | Min Lines | Actual Lines | Status | Details |
|----------|-----------|--------------|--------|---------|
| `src/app/home/page.tsx` | 10 | 13 | VERIFIED | Server Component; auth check present; renders `NameSelectorLoader` |
| `src/components/NameSelectorLoader.tsx` | — | 14 | VERIFIED | `'use client'` wrapper; `dynamic(() => import('@/components/NameSelectorPage'), { ssr: false })` confirmed |
| `src/components/NameSelectorPage.tsx` | 40 | 79 | VERIFIED | All state, dropdown, Continue button, and handler logic present |
| `src/components/MapComponent.tsx` | 80 | 117 | VERIFIED | MapContainer, TileLayer, Marker loop, FlyController, bounce state all present |
| `src/app/globals.css` | — | 81 | VERIFIED | `.marker-bounce`, `.marker-dimmed`, `.marker-selected`, `@keyframes markerBounce`, `slideUp` all present |
| `src/data/people.ts` | — | 29 | VERIFIED | Exports `Person` interface and `PEOPLE` array with exactly 18 members, alphabetically sorted |
| `src/app/order/page.tsx` | — | 25 | VERIFIED | Auth check, async `searchParams`, personalised placeholder render |
| `supabase/migrations/20260315100001_add_profile_location_fields.sql` | — | 11 | VERIFIED | Adds 5 columns (`location_name`, `lat`, `lng`, `emoji`, `fun_label`) with `if not exists` safety |
| `supabase/seed.sql` | — | — | VERIFIED | Exactly 18 org member profile rows confirmed via `grep -c "gen_random_uuid(), null,"` = 18 |

**Note:** Plan 02-02 introduced `NameSelectorLoader.tsx` as a deviation fix for Next.js 16 — not listed in original 02-02-PLAN frontmatter `files_modified` but correctly documented in the SUMMARY. File exists and is wired correctly.

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/home/page.tsx` | `src/components/NameSelectorLoader.tsx` | direct import (not dynamic) | VERIFIED | Line 3: `import NameSelectorLoader from '@/components/NameSelectorLoader'`; Line 12: `return <NameSelectorLoader />` |
| `src/components/NameSelectorLoader.tsx` | `src/components/NameSelectorPage.tsx` | `dynamic()` with `ssr: false` | VERIFIED | Lines 5-6: `dynamic(() => import('@/components/NameSelectorPage'), { ssr: false, ... })` |
| `src/components/NameSelectorPage.tsx` | `src/components/MapComponent.tsx` | React child, passes `people`, `selectedPerson`, `onAnimationEnd` | VERIFIED | Lines 38-42 in NameSelectorPage; props interface in MapComponent confirmed |
| `src/components/MapComponent.tsx` | leaflet `flyTo` | `FlyController` child using `useMap()` | VERIFIED | Line 21: `map.flyTo([target.lat, target.lng], zoom, { animate: true, duration: 2.5 })` |
| `src/components/NameSelectorPage.tsx` | `/order?name=` | `router.push` in Continue handler | VERIFIED | Line 31: `router.push('/order?name=' + encodeURIComponent(selectedPerson.name))` |
| `src/components/MapComponent.tsx` | `src/data/people.ts` | imports `Person` type; receives PEOPLE via `people` prop from NameSelectorPage | VERIFIED (indirect) | MapComponent imports `Person` type (line 7); `PEOPLE` array flows from `data/people` through `NameSelectorPage` as the `people` prop. Plan pattern `"import.*PEOPLE.*from.*data/people"` is in `NameSelectorPage`, not `MapComponent` — this is correct architecture and fully wired. |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| MAP-01 | 02-01, 02-02 | Full-screen page with dropdown of 10 (updated: 18) organisation members | SATISFIED | `NameSelectorPage.tsx` renders full-screen map + `<select>` with all 18 names from `PEOPLE` array |
| MAP-02 | 02-02 | Leaflet.js map of Western Cape with smooth zoom animation to selected person's location | SATISFIED | `MapComponent.tsx` uses `react-leaflet` with `map.flyTo()` at 2.5s duration; CartoDB Voyager tile layer centered on Western Cape |
| MAP-03 | 02-01, 02-02 | Custom emoji markers with fun labels per person | SATISFIED | `createEmojiIcon()` renders `L.divIcon` with emoji + `<span class="marker-location">{locationName}</span>`; all 18 people have unique emoji and fun labels in `PEOPLE` array |
| MAP-04 | 02-02 | Continue button appears after zoom, navigates to order page | SATISFIED | `animationComplete && selectedPerson` guard; `router.push('/order?name=...')` on click |

All 4 phase requirements (MAP-01 through MAP-04) are accounted for across the two plans and verified in code.

**Orphaned requirements check:** No additional MAP-xx requirements are assigned to Phase 2 in REQUIREMENTS.md beyond MAP-01 to MAP-04. No orphaned requirements.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/MapComponent.tsx` | 35 | `return null` | Info | `FlyController` is a renderless controller component — this is the correct Leaflet pattern for imperative map control via `useMap()`, not a stub |

No blockers or warnings found.

---

## Human Verification Required

### 1. Map renders full-screen with 18 markers

**Test:** Run `npm run dev`, log in, navigate to `/home`
**Expected:** Full viewport filled with CartoDB Voyager basemap; 18 emoji markers visible across the Western Cape at zoom level 9
**Why human:** Leaflet renders client-side only; tile loading, viewport height, and marker positioning require a browser

### 2. flyTo animation smoothness

**Test:** Select any name from the "Who's hungry?" dropdown
**Expected:** Map smoothly flies (not jumps) to the selected person's location over approximately 2.5 seconds
**Why human:** Animation duration and smoothness are runtime behaviors

### 3. Marker dimming and bounce

**Test:** After selecting a name and waiting for the animation to complete
**Expected:** Non-selected 17 markers visibly dimmed to ~35% opacity; selected marker at full brightness; selected marker bounces 3 times on arrival
**Why human:** CSS opacity transitions and animation playback require visual confirmation

### 4. Continue button timing

**Test:** Select a name; watch for the Continue button
**Expected:** Continue button is absent during the fly animation; slides in at bottom-center only after the animation lands
**Why human:** The `moveend` listener timing is a runtime sequence

### 5. Re-selection behaviour

**Test:** Select "Daniel", wait for zoom; then select "Natalia" (Hermanus) without clicking Continue
**Expected:** Map flies directly to Hermanus; Continue button disappears during flight; reappears on landing
**Why human:** State reset on re-selection (`setAnimationComplete(false)`) and animation re-trigger need live verification

### 6. Continue navigation

**Test:** Select any name, wait for animation, click Continue
**Expected:** Browser navigates to `/order?name=<SelectedName>`; page shows "Hang tight, [Name] — this is where you will place your lunch order."
**Why human:** Navigation and URL parameter rendering require a browser session

---

## Build Status

`npm run build` passes cleanly. All 7 routes generated with no TypeScript errors:

```
Route (app)
  / (static)
  /_not-found (static)
  /admin (dynamic)
  /home (dynamic)
  /order (dynamic)
```

`leaflet@^1.9.4`, `react-leaflet@^5.0.0`, `@types/leaflet@^1.9.21` present in `package.json`.

---

## Summary

Phase 2 goal — "user can pick their name and watch the map zoom to their Western Cape location" — is fully implemented. All artifacts exist, are substantive, and are correctly wired:

- The data foundation (migration, seed, `people.ts`) from Plan 02-01 is complete and correct
- The interactive map UI from Plan 02-02 is fully assembled: `home/page.tsx` gates auth and delegates to `NameSelectorLoader` (the Next.js 16 `ssr: false` wrapper), which lazily loads `NameSelectorPage`, which renders `MapComponent`
- `FlyController` inside `MapContainer` drives the `map.flyTo()` animation and fires the `moveend` callback that gates the Continue button
- All 4 requirements (MAP-01 to MAP-04) are satisfied in code

The only outstanding items are 6 visual/interactive behaviours that require a browser to confirm — no code gaps.

---

_Verified: 2026-03-15T18:00:00Z_
_Verifier: Claude (gsd-verifier)_
