# Sprint 11 — Cycle 2b — `/open-source-projects` markers + P2 transition cleanup

**Branch:** `aa/pl-sprint-11-cycle-2b-osp-markers`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Apply `.dy-section--centered-white` marker to `/open-source-projects` Community section + drop the old `:has` half of P2's transition selector in `dy-section.css`. Completes the Sprint 10 ADV-3 refactor. **AC binding:** pixel-identical at 1280/768/375.

## Audit-identified target

Per `docs/pl2/handoffs/cycle-1-hygiene-audit-S.md` Thread D:
- Entity: `canvas_page` id=5
- Section index: delta 11
- Theme: white
- Kicker (delta 12): "Community" centered
- Currently caught by old P2 `:has(.dy-section__header .kicker--centered)` half

## CSS cleanup

Drop the old P2 `:has` half from these lines in `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (per audit Thread D):
- Lines 133, 141, 152 (transition selectors retained in Sprint 10 cycle 2b.2)

Result: P2 rule set uses only the marker selector.

## Acceptance criteria

- [ ] `dy-section--centered-white` applied to canvas_page id=5 section index 11 via idempotent script.
- [ ] P2 transition `:has` half dropped from `dy-section.css` lines 133/141/152.
- [ ] `/open-source-projects` AE=0 at 1280/768/375 vs pre-refactor baseline.
- [ ] No regression on /services / /about-us / /how-we-do-it / homepage.
- [ ] No `!important`.
- [ ] `component_version` preserved.
- [ ] Specificity-safe doubled-class marker `.dy-section.dy-section--centered-white` (Sprint 10 codification).

## Handoff

- F: `docs/pl2/handoffs/cycle-2b-osp-markers-F.md`
- T: `docs/pl2/handoffs/cycle-2b-osp-markers-T.md`
- S: `docs/pl2/handoffs/cycle-2b-osp-markers-S.md`
- Report: `docs/pl2/handoffs/cycle-2b-osp-markers-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-11-cycle-2b/`

## Commit message

`refactor(architecture): cycle 2b — /open-source-projects centered-white marker + P2 transition cleanup`
