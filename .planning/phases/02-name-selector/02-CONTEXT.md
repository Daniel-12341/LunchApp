# Phase 2: Name Selector - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

User picks their name from a dropdown on a full-screen Leaflet map of the Western Cape. Selecting a name triggers a smooth fly-to animation to that person's location. Each person has custom emoji markers. A Continue button appears after the zoom and navigates to the order page. This page replaces the current `/home` welcome placeholder.

</domain>

<decisions>
## Implementation Decisions

### Page Layout
- Full-screen Leaflet map filling the entire viewport
- Floating dropdown card positioned top-center with padding
- Card header: "Who's hungry?" with food emoji — playful, continuing the fun vibe from login
- Default view: Overview of Western Cape with ALL 18 markers visible at a zoomed-out level

### Person Data (18 people — replaces original 10)
- **IMPORTANT:** Profiles table must be updated from the original 10 to these 18 org members
- Each person has: name, Western Cape location, emoji combo, fun label (label stored but NOT displayed on map)

| Name | Location | Emoji | Fun Label |
|------|----------|-------|-----------|
| Daniel | Stellenbosch | 🏓🔥 | Smashing padel balls |
| Nic | Rondebosch | ⭐👶👑 | Baby leader |
| Anastasia | Greyton | 🎬🏡 | Taking the best videos of Greyton |
| Andre | Paarl | 🏉💪 | Practicing his passes |
| Andrea | Rondebosch | 👶❤️ | Looking after Jack |
| Angus | Rondebosch | 💇✂️ | Getting a fresh haircut |
| Chris | Greyton | 🎭🔫 | Loving Mafia! |
| Dormehl | Sea Point | 🧘🏋️ | Practicing Pilates & gyming |
| Francois | Foreshore | 🦾🏆 | Hyrox man |
| James | In the sea | 🐟🎣 | The tuna specialist |
| Jenna | Somerset West | 🥾⛰️ | Hiker |
| Lloyd | Simonstown | 💍🐧 | Penguin town romantic |
| Luc | Sea Point | 🏓🌊 | Padel by the sea |
| Lungile | Rondebosch | 😂🤪 | Life of the party |
| Michael | Greyton | ♟️🧠 | Chess strategist |
| Natalia | Hermanus | 🐋👀 | Whale watching |
| Oliver | Greyton | 🔍🕵️ | Murder mystery master |
| Rosie | Rondebosch | 🎨🎭 | Art, museums & theatre |

### Map Markers
- Markers show emoji combo ONLY — no fun label text displayed on map
- Location name shown alongside emoji on the marker
- Non-selected markers stay visible but dimmed (reduced opacity)
- Selected marker at full opacity after zoom

### Zoom Animation
- Leaflet flyTo() with smooth 2-3 second animation
- When switching names: fly directly to new person (no zoom-out-first step)
- After zoom lands: marker bounces/pulses as arrival effect

### Continue Button
- Appears AFTER zoom animation completes (not before)
- Positioned bottom-center floating on the viewport
- Button text: "Continue" — simple and direct
- Navigates to /order (placeholder page until Phase 3 builds it)

### Claude's Discretion
- Leaflet tile provider choice (OpenStreetMap, CartoDB, etc.)
- Map zoom levels (initial overview vs. zoomed-in on person)
- Exact marker styling (size, shadow, border)
- Continue button animation (slide-up, fade-in, etc.)
- Dropdown component styling details
- James "in the sea" marker placement (somewhere in False Bay or Atlantic)
- /order placeholder page design

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/utils/supabase/server.ts`: Server-side Supabase client for fetching profiles
- `src/utils/supabase/client.ts`: Browser-side Supabase client
- `src/middleware.ts`: Auth middleware — already protects routes, redirects unauthenticated users

### Established Patterns
- Server Components with `getUser()` auth check (see `/home/page.tsx`, `/admin/page.tsx`)
- Tailwind CSS for styling, emerald colour scheme
- Playful design language with food emojis and fun headers

### Integration Points
- Replace current `src/app/home/page.tsx` (welcome placeholder) with name selector
- New route: `src/app/order/page.tsx` (placeholder for Phase 3)
- Profiles table: needs migration to add location, emoji, fun_label columns + update from 10 to 18 members
- Middleware: `/home` and `/order` both need to remain protected routes
- Selected name needs to persist (cookie, URL param, or session state) for Phase 3 order page

</code_context>

<specifics>
## Specific Ideas

- "James - in the sea" — his marker should literally be placed in the ocean (False Bay or Atlantic)
- The page should feel like a fun reveal — picking your name triggers a little journey on the map
- Nic and Andrea both relate to "Jack" (baby) — their markers are both in Rondebosch
- Multiple people in Rondebosch (Nic, Andrea, Angus, Lungile, Rosie) and Greyton (Anastasia, Chris, Michael, Oliver) — markers need slight offset to not overlap

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-name-selector*
*Context gathered: 2026-03-15*
