# Sprint 10 — Cycle 2b.1 — `/about-us` selector-class refactor

**Branch:** `aa/pl-sprint-10-cycle-2b1-about-us`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Replace fragile DOM-shape-sniffing selectors in `dy-section.css` that target `/about-us` sections with class-based markers, per Sprint 10 cycle 1 audit. **AC binding:** shipped state must remain pixel-identical at 1280/768/375.

## Input docs

- [ ] `docs/pl2/handoffs/cycle-1-architecture-audit-S.md` §1.2 patterns P1, P7, P8, P9, P10
- [ ] `docs/pl2/pl-plan--sprint-10-architecture-cleanup.md`
- [ ] `scripts/sprint6-cycle3-nearshore-marker.php` — reference Canvas-patch script (idempotent; preserves `component_version`)

## Patterns to migrate (`/about-us` consumers)

| Pattern | Current selector | Proposed marker | Sections affected |
|---|---|---|---|
| P1 | `.dy-section.theme--light:has(.kicker--centered)` | `.dy-section--centered-light` | §B Track record |
| P7 | `.dy-section.theme--light:has(.kicker--centered) .dy-section__content .text ul` | inherits P1's marker (`.dy-section--centered-light .dy-section__content .text ul`) | §B Track record |
| P8 (shared) | `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` | `.dy-section--cta-pair` | Closing CTA (shared with /services) |
| P9 | `.dy-section.theme--white:has(.kicker--centered) .dy-section__content > .grid-wrapper + .heading.h3 (+ .text)` | `.dy-section--bio-block` | §C "Who we are." bio block |
| P10 | `.dy-section:has(.wordmark-strip-wrapper)` | `.dy-section--wordmark-strip` | §A wordmark strip |

**Note on P8:** the marker `.dy-section--cta-pair` is shared with /services (will be applied to /services closing CTA in Cycle 2b.2). For Cycle 2b.1, add the marker to `/about-us` closing CTA only and leave the OLD selector in `dy-section.css` until 2b.2 swaps it for both. Alternative: rewrite the CSS rule in 2b.1 to use both the new marker selector AND the old `:has(> .button + .button)` selector simultaneously (transition state), then drop the old in 2b.2. F decides; document choice.

## Scope (in)

- Canvas content edits on entity `canvas_page` id=17 (/about-us) — add `additional_classes` markers per the table.
- CSS rule rewrites in `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` — replace fragile selectors with marker-based selectors.
- New file: `scripts/sprint10-cycle2b1-about-us-markers.php` (idempotent, preserves `component_version`).

## Acceptance criteria

- [ ] Canvas content edited: each of the 4 `/about-us` sections in the patterns table has the corresponding marker in its `additional_classes` prop.
- [ ] `dy-section.css` rules rewritten to use marker selectors instead of `:has()` shape-sniffing.
- [ ] **`/about-us` renders pixel-identical at 1280/768/375** vs. pre-refactor state (or per-section diff < 0.5%).
- [ ] No regression on `/services` (P8 selector remains functional until 2b.2 finishes the swap).
- [ ] No regression on other pages using `dy-section.css`.
- [ ] No `!important`.
- [ ] Canvas `component_version` preserved (do NOT set to NULL — per workflow-ofts.md §F step 8, corrected 2026-05-12 by cycle 2a).
- [ ] T1 + T2 PASS.
- [ ] F handoff captures: marker → section mapping; CSS rule diffs; pixel-diff results.

## Out of scope

- Other pages (`/services` is 2b.2; `/how-we-do-it` is 2b.3; homepage is 2b.4).
- Visual fidelity changes — refactor must preserve shipped state.
- `component_version` NULL edits (forbidden — see workflow).

## Handoff

- F: `docs/pl2/handoffs/cycle-2b1-about-us-refactor-F.md`
- T: `docs/pl2/handoffs/cycle-2b1-about-us-refactor-T.md`
- S: `docs/pl2/handoffs/cycle-2b1-about-us-refactor-S.md`
- Report: `docs/pl2/handoffs/cycle-2b1-about-us-refactor-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b1/`

## Commit message (O on S PASS)

`refactor(architecture): cycle 2b.1 — /about-us selector-class markers (ADV-3)`
