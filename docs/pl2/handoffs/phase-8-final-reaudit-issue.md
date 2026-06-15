# Phase 8 — Final global re-audit (activation gate)

**Branch:** `aa/pl-homepage-phase-8-final-reaudit`
**Pipeline (this cycle):** O → S → O (audit-only).
**Phase 8 of `docs/pl2/pl-plan--homepage-overhaul.md`** — activation-gate audit.

All seven Phase 8 sub-cycles closed:
- 8.2 hero overflow + logo-grid wrap — PASS
- 8.4 feature-card grid (3/1/1) — PASS (one rework)
- 8.5 hero whitespace + logo-band transition — PASS
- 8.1 header (pill removed, height 73px) — PASS
- 8.3 logo bar bitmap parity — PASS
- 8.6 polish batch + nav-cluster alignment — PASS (one rework)
- 8.7 three-color primary palette + global section-padding tightening — PASS

First global re-audit (commit `51e6c385c`) returned REWORK with two binding items. Both addressed in 8.7. This audit verifies they landed and that the homepage as a whole is activation-ready.

---

## Operator's directive

Pre-activation gate. If this audit returns PASS, the next step is theme activation (`drush config:set system.theme default performant_labs_20260502`). If REWORK, one more sub-cycle.

## Scope

Full-page Tier 3 visual diff: live homepage `https://pl-performantlabs.com.3.ddev.site:8493/` vs canonical preview `docs/pl2/Previews/homepage.html`, at 1280×800 / 768×1024 / 375×667. Standard S protocol.

### Specifically called out

1. **8.7 outcomes land correctly:** cyan CTA pill, medium-teal inline links, deep-navy hover states, section-padding visually matches preview's 96/64 rhythm.
2. **Body-height residual is operator-accepted.** Live is 213 / 713 / 783 px taller than preview at 1280 / 768 / 375 — this is documented architectural cost (Dripyard component overhead). **Do NOT use whole-page pixel deltas as verdict input.** Per-section visual parity is binding.
3. **All seven sub-cycles' outcomes still hold globally** (not just in their target section).
4. **WCAG 2.2 AA audit at the page level.** Two failures pre-approved by operator are documented in the brief; any new third failure surfaces.

## Required deliverables

1. Markdown handoff at `docs/pl2/handoffs/phase-8-final-reaudit-S.md`.
2. Operator-facing HTML report at `docs/pl2/handoffs/phase-8-final-reaudit-report.html` per Step 4f.

## Acceptance criteria for the verdict

- **PASS** if (a) every section visually matches preview within reasonable per-section tolerance; (b) all seven sub-cycle outcomes still hold; (c) WCAG audit clean except for the two pre-approved deviations; (d) cyan CTA + teal links + tightened section-padding render correctly.
- **REWORK** if any section shows a new structural mismatch with preview, OR if any prior sub-cycle has regressed, OR if a new (third+) WCAG failure exists.
- **ADVISORY-HOLD** only for a new preview defect found in the sanity-check step.

## Inputs

1. `docs/pl2/workflow-ofts.md` §S — current S protocol.
2. `docs/pl2/Previews/homepage.html` — canonical preview (now with cyan CTA, three-color palette, tightened section spacing).
3. `docs/pl2/handoffs/phase-8-global-reaudit-S.md` — the first global re-audit (REWORK verdict).
4. `docs/pl2/handoffs/phase-8.7-color-spacing-S.md` — 8.7's S report (sub-cycle PASS).
5. `docs/pl2/Briefs/pl_design_brief.md` — current brief with the three-color palette and §"Documented WCAG deviations".

## Operating rules

- S only — no F.
- Preview/spec sanity check first (≤ 2 min).
- Full Tier 3 capture at three viewports per canonical S protocol.
- Operator-facing HTML report mandatory.
- The body-height delta is operator-accepted and NOT a verdict input.
