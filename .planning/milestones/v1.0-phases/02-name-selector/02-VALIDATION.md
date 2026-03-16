---
phase: 2
slug: name-selector
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — same as Phase 1, no automated test framework |
| **Config file** | None |
| **Quick run command** | `npm run build` (TypeScript compile check) |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Manual browser test (map renders, flyTo works, Continue navigates)
- **Before `/gsd:verify-work`:** All 4 requirements manually verified in browser
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | MAP-01, MAP-03 | manual | `npm run build` | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | MAP-02, MAP-04 | manual | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No automated test framework. Phase 2 deliverables are a Leaflet map with interactive animations — most efficiently validated manually in the browser.

*Existing infrastructure (TypeScript compiler via `npm run build`) covers compile-time verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Full-screen map with 18 markers and dropdown | MAP-01 | Requires visual browser inspection | 1. Login 2. Verify map fills viewport 3. Verify dropdown at top-center 4. Count markers |
| Smooth flyTo zoom animation | MAP-02 | Requires visual animation verification | 1. Select a name 2. Verify smooth 2-3s fly animation 3. Switch names, verify direct fly |
| Custom emoji markers with location | MAP-03 | Requires visual marker inspection | 1. Check each marker shows emoji combo 2. Verify non-selected markers dimmed |
| Continue button after zoom | MAP-04 | Requires interaction timing verification | 1. Select name 2. Wait for zoom to finish 3. Verify Continue appears 4. Click → /order |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
