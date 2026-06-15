# Sprint 4 — Cycle 1: Header theme-source repair

**Mode:** autonomous
**Branch:** `aa/pl-sprint-4-phase-1-header-theme-source` (off `aa/pl-sprint-4-pre-services-foundation`)
**Sprint runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md) §"Cycle 1 — Header theme-source repair"
**Upstream source:** [`post-homepage-next.md`](../post-homepage-next.md) §2.2 ("Tech Debt #1")

## Objective

Fix the header block's Drupal theme prop at the config source (it is currently `theme--light`) so `<header class="theme--white">` renders correctly without a CSS compensation patch.

## Why this matters (context for F)

`header.css` currently forces `background-color: #FFFFFF` and `--theme-surface: #FFFFFF` on `.site-header` because the block's theme prop is wrong at Layer 1. Every future F that touches header CSS reads this L5 patch and has to understand it compensates for a Layer-1 mis-config. Fixing once propagates site-wide; failing to fix means perpetuating confusing CSS for every page.

## Conflict-check directive (sprint-specific)

Phase 8.6 just landed substantial `header.css` rework on the parent `main` lineage. Before touching `header.css`, **verify your trace does not conflict with the nav-cluster alignment fix at lines covering `@media (width > 1000px)`**. The theme-source change is **L1 config + L5 workaround removal**, not new CSS. If your trace reveals the workaround you intend to remove is actually doing additional structural work post-8.6, escalate to O via the handoff before writing — that would be a runbook-scope question.

## Input documents

Read before starting:

- [ ] [Sprint runbook §Cycle 1](../pl-plan--sprint-4-pre-services-foundation.md) — full objective, scope, acceptance criteria
- [ ] [`web/themes/custom/performant_labs_20260502/css/components/header.css`](../../../web/themes/custom/performant_labs_20260502/css/components/header.css) — current state, including the post-8.6 nav-cluster rework
- [ ] `config/sync/block.block.*header*.yml` (find via Glob) — the Drupal config entity that sets the header block's theme prop
- [ ] [`docs/pl2/theme-change--workflow.md`](../theme-change--workflow.md) — the 7-step CSS change workflow (Step 3 layer trace is mandatory and self-approved in autonomous mode)
- [ ] [`docs/pl2/theme-change.md`](../theme-change.md) — Layer system reference (L1 config → L5 component CSS)

## Scope (per runbook)

1. Identify the Drupal config entity that sets the header block's theme prop (likely `block.block.performant_labs_20260502_header.yml` or similar in `config/sync/`).
2. Change `theme--light` → `theme--white` at the config source. Export with `ddev drush cex`.
3. Remove the CSS workaround in `header.css` — the forced `background-color` and `--theme-surface` overrides that were compensating for the wrong theme prop.
4. Re-verify the header renders identically (same visual result, cleaner DOM/CSS path).

## Files expected to change

- `config/sync/block.block.*header*.yml` (1 file — change theme prop value)
- `web/themes/custom/performant_labs_20260502/css/components/header.css` (remove the compensation block — do **not** touch the post-8.6 nav-cluster rework at `@media (width > 1000px)`)

## Acceptance criteria (verbatim from runbook)

- [ ] Header `<header>` DOM has `class="theme--white"` (not `theme--light`)
- [ ] No `background-color: #FFFFFF` or `--theme-surface: #FFFFFF` compensation rules remain in `header.css`
- [ ] Visual diff against current live shows zero header delta at 1280 / 768 / 375
- [ ] `ddev drush cim` shows clean state
- [ ] No regressions on `/`, `/articles`, `/contact-us`, `/open-source-projects`

## Operator decision

None — deterministic fix per runbook. No path-A/B/C choice required.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-4-phase-1-header-theme-source-F.md`

## Operating rules

- **Mode: autonomous** — Step 3 layer trace is self-approved; record in handoff "Layer decisions" section. Scope-split decisions are self-made (one split max per cycle). Spec ambiguity resolved with most-conservative interpretation and documented under "Deviations from spec". Confirmation table is informational, written into the handoff opening block.
- Follow the 7-step CSS change workflow (`docs/pl2/theme-change--workflow.md`).
- Follow the Three-Tier Verification Hierarchy. T1 + T2 are your responsibility; T3 is S's.
- Override at the highest correct layer. This cycle is L1 (config) + L5 cleanup — NOT new CSS.
- Read the relevant `.yml` config files before assuming prop names.
- Stage files by explicit path (never `git add .`).
- No `!important`. Ever.
- Mandatory handoff section: **Autonomous decisions** — list every decision you made that would have surfaced to the operator in human-in-the-loop mode.

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (from host) |
| SSL | mkcert-trusted — no `-k` flag |
| Cache clear | `ddev drush cr` before every T1/T2 run |
