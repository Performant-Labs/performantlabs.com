# Sprint 11 — Cycle 2d — P1 transition-selector cleanup (theme--light)

**Branch:** `aa/pl-sprint-11-cycle-2d-p1-cleanup`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Mirror of cycle 2c for P1 (theme--light + kicker--centered). T's cycle 2c advisory flagged P1 `:has(.kicker--centered)` selectors remain at lines 105, 113, 121, 213, 551 of `dy-section.css`. Apply `.dy-section--centered-light` to any unmarked P1 consumers + drop the `:has` half. **AC binding:** AE=0 across affected pages.

## Method (audit-style sub-cycle)

1. F greps Canvas data + DOM across all 7 shipped pages for sections matching `theme--light` + `kicker--centered` that don't yet have `dy-section--centered-light` marker.
2. F applies marker to each via idempotent script.
3. F drops `:has(.kicker--centered)` from `dy-section.css` lines 105/113/121/213/551 (and any other in the P1 rule cluster).
4. T1+T2 verify; S AE-binds.

## Cross-page reach (already-marked sections)

Per cycle 2b.1: `/about-us` §B Track record + §D Dogfood already have `dy-section--centered-light`. Don't double-mark; verify they're correctly captured by the new marker-only selector.

## Acceptance criteria

- [ ] All P1 consumers marked.
- [ ] `grep ':has(.kicker--centered)' dy-section.css` → 0 functional lines.
- [ ] AE=0 on each affected page (T+S identify which) at 1280/768/375.
- [ ] No regression elsewhere.
- [ ] No `!important`.
- [ ] `component_version` preserved.
- [ ] Doubled-class specificity.

## Handoff

- F: `docs/pl2/handoffs/cycle-2d-p1-cleanup-F.md`
- T: `docs/pl2/handoffs/cycle-2d-p1-cleanup-T.md`
- S: `docs/pl2/handoffs/cycle-2d-p1-cleanup-S.md`
- Report: `docs/pl2/handoffs/cycle-2d-p1-cleanup-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-11-cycle-2d/`

## Commit message

`refactor(architecture): cycle 2d — P1 transition cleanup (theme--light :has drop)`
