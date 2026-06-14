# Sprint 10 — Cycle 2b.2 — `/services` selector-class refactor

**Branch:** `aa/pl-sprint-10-cycle-2b2-services`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Replace fragile DOM-shape-sniffing selectors in `dy-section.css` that target `/services` sections with class-based markers. **AC binding:** shipped state pixel-identical at 1280/768/375.

## Patterns to migrate (`/services` consumers)

| Pattern | Current selector | Proposed marker | Sections affected |
|---|---|---|---|
| P2 | `.dy-section.theme--white:has(.dy-section__header .kicker--centered)` | `.dy-section--centered-white` | §3 Dogfooding, §3 Nearshore (note: §3 Nearshore already has `nearshore-section` marker from Sprint 6 cycle 3) |
| P3 | `.dy-section.theme--white:has(...kicker--centered):not(:has(.grid-wrapper))` | merged into P2's marker (positive `.dy-section--centered-white` applied only to sections that should center content; cards section omits the marker) | (same — by omission) |
| P4 | `.dy-section.theme--white .dy-section__content:has(> .button + .button)` | `.dy-section--cta-pair` | §1 hero |
| P8 (cycle-2b.1 transition cleanup) | `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` | add `.dy-section--cta-pair` marker to /services closing CTA; remove old `:has` half of comma-selector | §6 closing CTA |
| P10 | `.dy-section:has(.wordmark-strip-wrapper)` | `.dy-section--wordmark-strip` | §5 proof / wordmark strip |

## Scope

- Canvas content edits on entity `canvas_page` id=3 (/services) — add markers to §1 hero, §3 Dogfooding, §3 Nearshore (if doesn't already have centered-white in addition to nearshore-section), §5 proof, §6 closing CTA.
- `dy-section.css` rule rewrites: P2 marker swap, P3 removed (covered by P2 omission on cards), P4 marker swap, P8 transition-selector cleanup (drop old `:has(> .button + .button)` half for theme--dark; new marker now applied on both /about-us + /services), P10 marker swap.
- New file: `scripts/sprint10-cycle2b2-services-markers.php`.

## Acceptance criteria

- [ ] All 5 affected /services sections have correct marker(s) in `additional_classes`.
- [ ] P2 + P4 + P10 use new marker selectors; P3 removed.
- [ ] P8 old `:has()` half removed from `dy-section.css` (now safe — both /about-us and /services have the new marker).
- [ ] `/services` renders pixel-identical at 1280/768/375 vs pre-refactor.
- [ ] No regression on `/about-us` (P8 cleanup must not break /about-us closing CTA).
- [ ] No regression on `/how-we-do-it` (P2 selector previously covered /services nearshore + dogfooding only; confirm /how-we-do-it has no consumer of the old P2 selector — audit said P5/P6 are /how-we-do-it; P2 is /services-only).
- [ ] No `!important`.
- [ ] Canvas `component_version` preserved.
- [ ] T1 + T2 PASS.

## Handoff

- F: `docs/pl2/handoffs/cycle-2b2-services-refactor-F.md`
- T: `docs/pl2/handoffs/cycle-2b2-services-refactor-T.md`
- S: `docs/pl2/handoffs/cycle-2b2-services-refactor-S.md`
- Report: `docs/pl2/handoffs/cycle-2b2-services-refactor-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b2/`

## Commit message

`refactor(architecture): cycle 2b.2 — /services selector-class markers (ADV-3)`
