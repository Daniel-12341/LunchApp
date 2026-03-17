---
phase: 4
slug: admin-polish
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-15
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — project has no test framework; all behaviors require live Supabase auth or visual inspection |
| **Config file** | none |
| **Quick run command** | `npm run build` (type-check + build verification) |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (compile verification)
- **After every plan wave:** Manual smoke test: login flow, order flow, admin page, archive, WhatsApp export
- **Before `/gsd:verify-work`:** Full manual verification of all success criteria
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | ADM-01 | manual | `npm run build` | ✅ | ⬜ pending |
| 04-01-02 | 01 | 1 | ADM-02 | manual | `npm run build` | ✅ | ⬜ pending |
| 04-01-03 | 01 | 1 | ADM-03 | manual | `npm run build` | ✅ | ⬜ pending |
| 04-01-04 | 01 | 1 | ADM-04 | unit-capable | `npm run build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | DB-04 | manual | `supabase functions deploy` | ❌ | ⬜ pending |
| 04-02-02 | 02 | 2 | UI-01 | manual | `npm run build` | ✅ | ⬜ pending |
| 04-02-03 | 02 | 2 | UI-02 | manual | `npm run build` | ✅ | ⬜ pending |
| 04-02-04 | 02 | 2 | UI-03 | manual | `npm run build` | ✅ | ⬜ pending |
| 04-02-05 | 02 | 2 | UI-04 | manual | Visual review | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework setup needed — all behaviors require live Supabase auth context or visual inspection. The `buildWhatsAppMessage` pure function is the only unit-testable piece; can be tested manually.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| /admin redirects non-admin to /home | ADM-01 | Requires Supabase auth context | Login as non-admin, navigate to /admin, verify redirect |
| Orders list shows current week | ADM-02 | Requires live DB with orders | Place orders, visit /admin, verify all current-week orders appear |
| Archive sets archived=true | ADM-03 | Requires live DB mutation | Click archive button, verify orders disappear and DB has archived=true |
| WhatsApp message format | ADM-04 | Format verification | Click WhatsApp button, verify grouped-by-category message with correct format |
| Edge Function archives weekly | DB-04 | Requires deployed Edge Function + pg_cron | Deploy function, invoke manually via curl, verify archived orders |
| Visual polish present | UI-01 | Visual review | Inspect all pages for playful fonts, consistent styling |
| Page transitions animate | UI-02 | Visual review | Navigate between pages, verify Framer Motion transitions |
| Fonts load correctly | UI-03 | Visual review | Check Pacifico/Fredoka One render on all pages |
| Mobile responsive | UI-04 | Device testing | Test on mobile viewport, verify layout adapts |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: build verification after each task commit
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
