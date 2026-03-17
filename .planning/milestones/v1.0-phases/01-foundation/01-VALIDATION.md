---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — no automated test framework in project |
| **Config file** | None — Wave 0 note below |
| **Quick run command** | `npm run build` (TypeScript compile check) |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Manual login flow test in browser
- **Before `/gsd:verify-work`:** All 8 requirements manually verified
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | DB-01 | manual | `npm run build` | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | DB-02 | manual | `npm run build` | N/A | ⬜ pending |
| 01-01-03 | 01 | 1 | DB-03 | manual | `npm run build` | N/A | ⬜ pending |
| 01-01-04 | 01 | 1 | AUTH-03, AUTH-04 | manual | `supabase db push` | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | AUTH-01 | manual | `npm run build` | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | AUTH-02 | manual | `npm run build` | N/A | ⬜ pending |
| 01-02-03 | 02 | 1 | AUTH-05 | manual | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No automated test framework installed. For Phase 1, deliverables are auth UI + database schema — most efficiently validated manually in-browser and via `supabase db push`.

*Existing infrastructure (TypeScript compiler via `npm run build`) covers compile-time verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Login with username/password | AUTH-01 | Requires browser interaction with Supabase Auth | 1. Run `npm run dev` 2. Navigate to / 3. Enter "user" + "password" 4. Verify redirect to /home |
| Session survives refresh | AUTH-02 | Requires browser cookie persistence check | 1. Login 2. Refresh page 3. Verify still on /home |
| Admin credentials work | AUTH-03 | Requires browser interaction | 1. Login with "admin" + "admin123" 2. Verify access to /admin |
| 10 profiles exist | AUTH-04 | Database state verification | Query profiles table in Supabase dashboard |
| Role-based access | AUTH-05 | Requires login as both roles | 1. Login as user, try /admin → redirect 2. Login as admin → access granted |
| RLS user isolation | DB-03 | Requires two authenticated sessions | Insert order as user, query as different user, verify no access |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
