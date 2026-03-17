# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-16
**Phases:** 4 | **Plans:** 9 | **Commits:** 70

### What Was Built
- Full auth flow with username/password login and role-based access for 18 org members
- Animated Leaflet map with emoji markers and flyTo zoom to Western Cape locations
- 4-category lunch ordering with previous order recall, Surprise Me animation, and confetti
- Admin dashboard with order table, WhatsApp export, manual and automated weekly archive
- Polished UI with Pacifico/Fredoka fonts, Framer Motion transitions, mobile responsiveness

### What Worked
- Vertical slice delivery: each phase produced a testable, end-to-end feature
- Static data approach (PEOPLE array, hardcoded menu) kept things fast and simple
- Archive-based weekly reset elegantly preserved order history for "Previous Order"
- GSD workflow kept momentum high — 4 phases shipped in 2 days

### What Was Inefficient
- WhatsApp auto-share on submit (SHR-01, SHR-02) was specced but never built — admin export covered the real need
- Some decisions in STATE.md accumulated without being pruned or consolidated during execution
- Phase progress tracking in STATE.md didn't update correctly (percent stayed at 0%)

### Patterns Established
- `username@lunchapp.com` internal email format for Supabase Auth
- Server actions in separate files from client components (Next.js constraint)
- `L.divIcon` for all Leaflet markers to avoid PNG 404s in Next.js
- NameSelectorLoader wrapper pattern for SSR-incompatible components
- Service role key in Edge Functions for RLS bypass

### Key Lessons
1. Spec WhatsApp-like integrations only when actually needed — admin export was sufficient
2. Static data arrays work great for small teams; avoid premature database queries
3. Next.js 16 SSR restrictions require wrapper components for client-only libraries

### Cost Observations
- Model mix: balanced profile (mixed opus/sonnet/haiku agents)
- Sessions: ~4 execution sessions across 2 days
- Notable: rapid delivery enabled by yolo mode and auto-advance

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v1.0 | 70 | 4 | Initial build — yolo mode, vertical slices |

### Top Lessons (Verified Across Milestones)

1. Vertical slice delivery with testable phases keeps momentum high
2. Static data over DB queries for small, stable datasets
