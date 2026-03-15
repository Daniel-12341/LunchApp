# Roadmap: LunchApp

## Overview

Four phases that build the app in delivery order: database foundation and auth first, then the fun name-selector map, then the core ordering and WhatsApp flow, then admin tools and a final polish pass. Each phase delivers a working vertical slice that can be tested end-to-end before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Supabase migrations, auth, seeded users, RLS policies (completed 2026-03-15)
- [ ] **Phase 2: Name Selector** - Full-screen name picker with animated Leaflet map zoom
- [ ] **Phase 3: Order + Share** - Lunch order page, submit to Supabase, WhatsApp link, confetti
- [ ] **Phase 4: Admin + Polish** - Admin page, manual reset, edge function auto-reset, UI polish

## Phase Details

### Phase 1: Foundation
**Goal**: Users can securely log in and the database is ready to store orders
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DB-01, DB-02, DB-03
**Success Criteria** (what must be TRUE):
  1. User can log in with username and password and land on a protected page
  2. Session survives a browser refresh (user stays logged in)
  3. Admin account (admin/admin123) and 10 test users exist on first run
  4. RLS policies prevent a regular user from reading another user's orders
  5. Profiles and orders tables exist with correct columns and constraints
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Database schema: profiles table, orders table, RLS policies, seed data
- [ ] 01-02-PLAN.md — Auth UI: Supabase client setup, middleware, login page, protected routes

### Phase 2: Name Selector
**Goal**: User can pick their name and watch the map zoom to their Western Cape location
**Depends on**: Phase 1
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04
**Success Criteria** (what must be TRUE):
  1. User sees a full-screen page with a dropdown of all 10 organisation members
  2. Selecting a name triggers a smooth Leaflet map zoom to that person's location
  3. Each person's marker shows their custom emoji and fun label
  4. A Continue button appears after the zoom and navigates to the order page
**Plans**: TBD

Plans:
- [ ] 02-01: Name selector page with Leaflet map, locations, emoji markers, zoom animation

### Phase 3: Order + Share
**Goal**: User can place their lunch order and share it to WhatsApp in one click
**Depends on**: Phase 2
**Requirements**: ORD-01, ORD-02, ORD-03, ORD-04, ORD-05, ORD-06, SHR-01, SHR-02, SHR-03
**Success Criteria** (what must be TRUE):
  1. User sees four meal categories (Pizza, Pasta, Salad, Panini) with priced items and can select one
  2. "My Previous Order" shows the last order and lets the user re-select it in one click
  3. "Surprise Me!" picks a random meal with a visible animation
  4. Submitting an order saves it to Supabase and opens a WhatsApp link with all weekly orders
  5. Confetti animation and success message appear after order submission
**Plans**: TBD

Plans:
- [ ] 03-01: Order page — menu categories, previous order, Surprise Me, special requests, submit
- [ ] 03-02: WhatsApp link generation, confetti success screen

### Phase 4: Admin + Polish
**Goal**: Admin can view and manage all weekly orders, and the app looks and feels great on any device
**Depends on**: Phase 3
**Requirements**: ADM-01, ADM-02, ADM-03, ADM-04, DB-04, UI-01, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. Admin can visit /admin and see a table of all current-week orders with name, meal, price, customisation, and time
  2. Admin can manually archive the current week's orders with a single button click
  3. Admin can export a plain-text WhatsApp summary of all current orders
  4. Orders are automatically archived every Sunday at 21:00 UTC via Edge Function
  5. App is visually polished (playful fonts, Framer Motion transitions, mobile-responsive) across all pages
**Plans**: TBD

Plans:
- [ ] 04-01: Admin page — orders table, manual archive button, WhatsApp export
- [ ] 04-02: Edge Function weekly auto-reset, Framer Motion polish, mobile layout review

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-03-15 |
| 2. Name Selector | 0/1 | Not started | - |
| 3. Order + Share | 0/2 | Not started | - |
| 4. Admin + Polish | 0/2 | Not started | - |
