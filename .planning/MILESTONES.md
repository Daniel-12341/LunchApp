# Milestones

## v1.0 MVP (Shipped: 2026-03-16)

**Phases completed:** 4 phases, 9 plans
**Timeline:** 2 days (2026-03-14 → 2026-03-15)
**Commits:** 70
**Codebase:** 1,665 lines TypeScript + 292 lines SQL

**Key accomplishments:**
- Supabase auth with username/password login, role-based access, and 18 seeded org members
- Full-screen Leaflet map with emoji markers and flyTo animation to Western Cape locations
- Interactive order page with 4-category menu, previous order recall, and Surprise Me animation
- Two-step confirmation flow with confetti celebration and Supabase persistence
- Admin dashboard with order list, WhatsApp export, and manual archive
- Edge Function auto-archive with pg_cron (Sunday 21:00 UTC)

### Known Gaps
- **SHR-01**: WhatsApp link generated with all weekly orders formatted as a clean list — deferred, admin export (ADM-04) covers use case
- **SHR-02**: WhatsApp link opens in new tab after submit — deferred, admin export covers use case

---

