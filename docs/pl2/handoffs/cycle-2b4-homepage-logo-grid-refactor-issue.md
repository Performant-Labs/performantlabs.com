# Sprint 10 — Cycle 2b.4 — homepage logo-grid selector-class refactor

**Branch:** `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Replace fragile selectors in `logo-grid.css` (per audit §1.3) with class-based markers on the homepage logo-strip section. **AC binding:** shipped state pixel-identical at 1280/768/375.

## Patterns to migrate

| File | Selector | Proposed marker | Sections |
|---|---|---|---|
| `logo-grid.css:219` | `.dy-section:has(.logo-grid) .dy-section__header > *` | `.dy-section--logo-grid` | homepage hero-adjacent logo strip |
| `logo-grid.css:256, 260` | `.hero.theme--white + .dy-section:has(.logo-grid)` (sibling combinator) | `.dy-section--post-hero-logos` | homepage section directly following the hero |

Note both markers go on the same homepage section (the hero-adjacent logo strip is the only section following the hero AND containing the logo-grid). F may apply both classes to the one section, or merge into a single marker name — F decides.

## Cycle 2b.1/2/3 lessons (carry forward)

- Use specificity-safe `.dy-section.dy-section--<marker>` (0,2,0) to beat utility classes.
- Cross-page reach check — these `logo-grid.css` selectors should be homepage-only; F verifies via grep.
- Preserve `component_version`.

## Acceptance criteria

- [ ] Marker(s) on the homepage logo-strip section.
- [ ] `logo-grid.css` rules rewritten as marker-based.
- [ ] Homepage AE = 0 at 1280/768/375.
- [ ] No regression on /services, /about-us, /how-we-do-it, /open-source-projects.
- [ ] No `!important`.
- [ ] `component_version` preserved.
- [ ] T1 + T2 PASS.

## Handoff

- F: `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-F.md`
- T: `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-T.md`
- S: `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-S.md`
- Report: `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b4/`

## Commit message

`refactor(architecture): cycle 2b.4 — homepage logo-grid selector-class markers (ADV-3)`
