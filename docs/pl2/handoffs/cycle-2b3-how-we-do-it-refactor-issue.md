# Sprint 10 — Cycle 2b.3 — `/how-we-do-it` selector-class refactor

**Branch:** `aa/pl-sprint-10-cycle-2b3-how-we-do-it`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Replace fragile selectors targeting `/how-we-do-it` sections with class-based markers. **AC binding:** shipped state pixel-identical at 1280/768/375.

## Patterns to migrate

| Pattern | Current selector | Proposed marker | Sections affected |
|---|---|---|---|
| P5 | `.dy-section:has(.kicker--inline) .dy-section__header.grid` + `.dy-section:has(.kicker--inline) .dy-section__header` | `.dy-section--kicker-inline` | Week 1, Week 2, Week 3+ (theme--white + theme--secondary sections w/ kicker--inline) |
| P6 | `.dy-section.theme--secondary + .dy-section .dy-section__header` (sibling combinator) | `.dy-section--tight-header` (on the affected section) | "What we don't do" (theme--light section following theme--secondary "Week 3+") |

## Cycle 2b.2 lessons

- Use **specificity-safe** marker selectors: `.dy-section.dy-section--kicker-inline` (0,2,0) rather than `.dy-section--kicker-inline` (0,1,0). Utility classes can otherwise win source-order ties.
- Check cross-page reach of OLD selector before "direct swap." P5/P6 should be /how-we-do-it-only but **F verifies** by grepping for kicker--inline + theme--secondary consumers across all Canvas pages before deciding swap vs transition.
- Preserve `component_version`.

## Acceptance criteria

- [ ] Markers on affected sections of `/how-we-do-it` (entity ID — F finds via drush).
- [ ] P5 + P6 rewritten as marker-based.
- [ ] `/how-we-do-it` AE = 0 at 1280/768/375 vs pre-refactor.
- [ ] No regression on other pages.
- [ ] No `!important`.
- [ ] `component_version` preserved.
- [ ] T1 + T2 PASS.

## Handoff

- F: `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-F.md`
- T: `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-T.md`
- S: `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-S.md`
- Report: `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b3/`

## Commit message

`refactor(architecture): cycle 2b.3 — /how-we-do-it selector-class markers (ADV-3)`
