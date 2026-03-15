---
phase: 3
slug: order-share
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test framework configured; `npm run build` as proxy |
| **Config file** | none — no test framework |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green + manual browser smoke test
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | ORD-01 | manual + build | `npm run build` | n/a | ⬜ pending |
| 03-01-02 | 01 | 1 | ORD-02 | manual + build | `npm run build` | n/a | ⬜ pending |
| 03-01-03 | 01 | 1 | ORD-03 | manual + build | `npm run build` | n/a | ⬜ pending |
| 03-01-04 | 01 | 1 | ORD-04 | manual + build | `npm run build` | n/a | ⬜ pending |
| 03-01-05 | 01 | 1 | ORD-05 | manual + build | `npm run build` | n/a | ⬜ pending |
| 03-01-06 | 01 | 1 | ORD-06 | manual + build | `npm run build` | n/a | ⬜ pending |
| 03-02-01 | 02 | 1 | SHR-03 | manual + build | `npm run build` | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.
- `npm run build` serves as the automated gate (catches TypeScript errors, missing props, type mismatches).

*No test framework to install — manual browser testing is the validation approach for this project.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Order page renders with name from ?name= param | ORD-01 | No test framework; visual UI check | Navigate to /order?name=Daniel, verify greeting shows name |
| Tab switching shows correct category items | ORD-02 | Interactive UI behavior | Click each tab (Pizza/Pasta/Salad/Panini), verify items match category |
| Previous order card appears for returning user | ORD-03 | Requires Supabase data state | Place order, revisit page, verify previous order card shows |
| Surprise Me picks random item and animates | ORD-04 | Animation visual verification | Click "Surprise Me!", verify ticker animation runs ~2s and lands on item |
| Special requests field accepts text | ORD-05 | Form input visual check | Type in special requests field, verify text persists through confirmation |
| Order saved to Supabase | ORD-06 | Requires Supabase dashboard verification | Submit order, check Supabase orders table for new row |
| Confetti fires and success modal appears | SHR-03 | Visual animation check | Submit order, verify confetti + "Order placed!" modal |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
