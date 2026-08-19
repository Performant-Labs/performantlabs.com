# Sprint 4 — Cycle 4: Canvas page title-vs-content horizontal alignment

**Mode:** autonomous
**Branch:** `aa/pl-sprint-4-phase-4-canvas-title-alignment` (off `aa/pl-sprint-4-pre-services-foundation`)
**Sprint runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md) §"Cycle 4 — Canvas page title-vs-content horizontal alignment (D.3)"
**Upstream source:** [`GET-BACK-TO-THESE.md`](../GET-BACK-TO-THESE.md) §D.3

## Operator pre-commitment

🛑 **S4-4 = Path A** (locked at sprint kickoff 2026-05-11; runbook §"Operator pre-commitments"). Retune Pass 2 in `canvas.css` to match Dripyard's `.container` gutter at each breakpoint. **Do not present A/B/C/D menus.** Execute path A.

## Objective

Close the ~6px horizontal misalignment between the Canvas page-title band (`.block-page-title-block`, currently 20px inset) and the content below it (`.dy-section__container.container`, ~14px auto-margin) at mobile and up. Visible as a leftward "tuck" on every Canvas page.

## Why cross-page

Affects `/contact-us`, `/articles-2`, `/open-source-projects`, and every future Canvas page including Services. Setting the alignment correctly once propagates site-wide.

## Input documents

Read before starting:

- [ ] [Sprint runbook §Cycle 4](../pl-plan--sprint-4-pre-services-foundation.md) — objective, scope, acceptance criteria, path A guidance
- [ ] [`web/themes/custom/performant_labs_20260502/css/layout/canvas.css`](../../web/themes/custom/performant_labs_20260502/css/layout/canvas.css) — Pass 2 currently sets `padding-inline: var(--spacing-xs, 1.25rem)` on `.block-page-title-block`; this is the wrong value
- [ ] Dripyard `.container` styles — measure the effective left/right gutter at each breakpoint (375, 576, 768, 992, 1200+)
- [ ] [`docs/pl2/theme-change--workflow.md`](../theme-change--workflow.md) — 7-step CSS workflow

## Scope (path A)

1. **Measure Dripyard's `.container` left/right gutter** at the project's breakpoints (375 / 576 / 768 / 992 / 1200+). Use DevTools or Playwright `getBoundingClientRect()` / computed style on `.dy-section__container.container` at each viewport. Capture the effective gutter values for the trace comment.
2. **Update Pass 2 in `canvas.css`** so `.block-page-title-block` `padding-inline` matches `.container`'s effective gutter at each breakpoint. Use the same media-query breakpoints Dripyard uses. Document the `.container`-derived values in a trace comment so future readers see the coupling.
3. **T3 cross-check** at 375 and 1280 on at least `/contact-us`, `/articles-2`, `/open-source-projects` — confirm `h1` x-offset equals content-first-element x-offset (within 1px).

## Files expected to change

- `web/themes/custom/performant_labs_20260502/css/layout/canvas.css`

## Acceptance criteria (verbatim from runbook)

- [ ] Title-band left edge aligns with content first-element left edge (within 1px) at 375, 768, 1280
- [ ] No regression on any non-Canvas page
- [ ] Trace comment documents the `.container`-derived value and the coupling

## Operator decision

Already decided — path A locked. Do not surface back.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/sprint-4-phase-4-canvas-title-alignment-F.md`

## Operating rules

- **Mode: autonomous** — Step 3 layer trace self-approved. This is L5 (layout component CSS in `css/layout/canvas.css`). The trace comment in the file must document that the value couples to Dripyard's `.container` and may need updating if Dripyard's container gutter changes upstream.
- Follow the 7-step CSS change workflow.
- Stage files by explicit path. No `!important`.
- Mandatory handoff section: **Autonomous decisions** — exact gutter values measured, any judgment calls on which breakpoints to override.

## Pre-flight check

Before measuring, verify the misalignment still exists on live. The runbook is sprint-aged (2026-05-11); previous cycles may have shifted things. Use Playwright `getBoundingClientRect()` on `.block-page-title-block` vs `.dy-section__container.container` at 1280 on `/contact-us`. If they're already within 1px, the cycle is already-complete (Cycle 1 pattern) — note in the handoff and stop.

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (host) |
| SSL workaround for shell curl | `ddev exec curl http://localhost/<path>` |
| Cache clear | `ddev drush cr` before every T1/T2 run |
| Playwright for getBoundingClientRect probes | already installed at project root (used in Cycles 2 + 3) |
