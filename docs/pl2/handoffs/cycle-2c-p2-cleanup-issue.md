# Sprint 11 — Cycle 2c — P2 transition-selector cleanup

**Branch:** `aa/pl-sprint-11-cycle-2c-p2-cleanup`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Apply `.dy-section--centered-white` to the 4 remaining P2 consumers identified by cycle 2b F's investigation. Drop the P2 `:has` half from `dy-section.css` lines 133/141/152. **True architectural close on ADV-3.**

## Targets (from cycle 2b F handoff)

| Page | Section | Entity ID | How to find delta |
|---|---|---|---|
| `/services` | "Four ways we engage" | canvas_page id=3 | F greps Canvas data for the centered kicker w/ this text |
| `/how-we-do-it` | hero | canvas_page id=4 | F identifies hero section (typically delta 0 or low index) |
| `/about-us` | hero | canvas_page id=17 | F identifies hero section |
| `/about-us` | bio block | canvas_page id=17 | Note: already has `dy-section--bio-block` marker from Sprint 10 cycle 2b.1. Just add `dy-section--centered-white` as a second class. |

F verifies each section currently matches the old P2 `:has(.dy-section__header .kicker--centered)` selector and applies the marker.

## CSS cleanup

After all 4 markers applied, drop the old P2 `:has` half from `dy-section.css`:
- Lines 133, 141, 152 (and any other line in the P2 rule cluster — F verifies by grep)

## Acceptance criteria

- [ ] `.dy-section--centered-white` marker on all 4 target sections (added via idempotent script preserving `component_version`).
- [ ] P2 `:has(.dy-section__header .kicker--centered)` half dropped from `dy-section.css` everywhere — `grep ':has(.dy-section__header .kicker--centered)' dy-section.css` returns 0 functional lines.
- [ ] All 5 affected pages (/services, /how-we-do-it, /about-us, /open-source-projects, plus regression check on /) AE=0 at 1280/768/375.
- [ ] No `!important`.
- [ ] Specificity-safe doubled-class form.
- [ ] `component_version` preserved.

## Handoff

- F: `docs/pl2/handoffs/cycle-2c-p2-cleanup-F.md`
- T: `docs/pl2/handoffs/cycle-2c-p2-cleanup-T.md`
- S: `docs/pl2/handoffs/cycle-2c-p2-cleanup-S.md`
- Report: `docs/pl2/handoffs/cycle-2c-p2-cleanup-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-11-cycle-2c/`

## Commit message

`refactor(architecture): cycle 2c — P2 transition cleanup (4 remaining consumers + :has drop)`
