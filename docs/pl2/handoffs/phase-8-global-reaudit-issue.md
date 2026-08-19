# Phase 8 — Global parity re-audit (pre-activation gate)

**Branch:** `aa/pl-homepage-phase-8-global-reaudit`
**Pipeline (this cycle):** O → S → O (audit-only; no F work in this cycle)
**Phase 8 of `docs/pl2/pl-plan--homepage-overhaul.md`**.

All six sub-cycles closed:
- 8.2 hero overflow + logo-grid wrap — PASS
- 8.4 feature-card grid (3/1/1) — PASS (one rework)
- 8.5 hero whitespace + logo-band transition — PASS
- 8.1 header (pill removed, height 73px) — PASS
- 8.3 logo bar bitmap parity — PASS
- 8.6 polish batch + nav-cluster alignment — PASS (one rework)

The runbook's open Phase 8 box: "Tier 3 visual on the live homepage at 1280px and 375px. Final sign-off." — this audit answers it.

---

## Operator's directive

Fresh full Phase 8 parity audit. No sub-cycle scoping. The verdict gates theme activation: if PASS, we proceed to switch `system.theme.default` to `performant_labs_20260502`. If REWORK, we file follow-up sub-cycle issues against the residual deltas.

---

## Scope

Full-page visual diff of the live homepage `https://pl-performantlabs.com.3.ddev.site:8493/` vs canonical preview `docs/pl2/Previews/homepage.html`, at **1280×800**, **768×1024**, and **375×667**. Standard S Tier 3 protocol.

Specifically called out in scope (not deferable):

1. **Primary CTA color treatment.** S round-1 of sub-cycle 8.6 surfaced as advisory: live uses a deep teal for the primary CTAs ("Book a testing review", etc.); preview uses cyan. This is a global brand-color question. Re-measure on this audit and decide whether it's a real delta (REWORK), an out-of-scope intentional difference, or already-aligned post-8.6.

2. **All previously passing sub-cycles must still pass.** Spot-check the six sub-cycle outcomes globally (i.e. not just on the section each sub-cycle targeted — make sure no sub-cycle's changes regressed an adjacent section).

3. **Brief-vs-preview disagreements that surfaced during sub-cycles.** The brief at `pl_design_brief.md` §"Per-section mobile behavior" disagrees with the preview on at least two responsive specifics: feature cards at md (brief says 3→2, preview/live now 3→1) and logo bar at md (brief says 2 rows of 3, preview/live now 4+2). These are known brief-stale items — flag in the report for a separate doc-only update cycle, do NOT use as REWORK input.

## Required deliverables

1. Standard S handoff at `docs/pl2/handoffs/phase-8-global-reaudit-S.md` per the workflow-ofts.md S template.
2. Operator-facing HTML report at `docs/pl2/handoffs/phase-8-global-reaudit-report.html` per the canonical S prompt §"Step 4f" (wipe-slider comparators at three viewports, per-section delta table with cropped thumbnails, plain-English "what I see different" list at top, verdict banner).

## Acceptance criteria for the verdict

- **PASS** if whole-page deltas are explainable (vertical-offset cascade from minor section-height differences is OK; sub-section pixel-deltas <2% per section); per-section spot-checks all align with preview; no new visible regressions introduced by sub-cycle work; CTA color question resolved (either confirmed-match or named as a residual delta).
- **REWORK** if any single section shows a structural mismatch with preview, or a sub-cycle has regressed.
- **ADVISORY-HOLD** only if the preview itself violates a convention you discover during the sanity-check step.

## Inputs (read before starting)

1. `docs/pl2/workflow-ofts.md` §S — current S protocol (includes the new ADVISORY-HOLD verdict).
2. `docs/pl2/Previews/homepage.html` — canonical reference (updated through 8.1 / 8.3 prep commits).
3. `docs/pl2/handoffs/phase-8-visual-parity-S.md` — the *original* Phase 8 audit (for context; many of its observations turned out to be measurement errors and have been corrected by sub-cycles).
4. The six sub-cycle S handoffs for context on what was changed and verified:
   `phase-8.{1,2,3,4,5,6}-*-S*.md` (some have `-S-rework.md` variants).
5. `docs/pl2/Briefs/pl_design_brief.md` — current brief (with known stale spots noted above).

## Operating rules

- S only — no F work in this cycle.
- Standard preview/spec sanity check first (≤ 2 minutes) before running diffs.
- Standard Tier 3 capture: Playwright, full-page PNGs at three viewports; ImageMagick `compare -metric AE` per viewport; per-section crops where useful.
- Operator-facing HTML report is mandatory (it's the operator's review surface for the activation decision).
