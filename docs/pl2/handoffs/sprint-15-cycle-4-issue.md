# Issue: Sprint 15 Cycle 4 — preview-doc mobile H2 letter-spacing sweep

**Branch:** `aa/pl-sprint-15-cycle-4-preview-letter-spacing-sweep`
**Sprint:** 15
**Mode:** Autonomous
**Pipeline:** F → T → S

## Objective

Bring mobile `.section-head h2` (or equivalent `display-md` mobile heading selector) letter-spacing from `-0.6px` to `-0.8px` on the five preview files that retain the older value, to align them with the brief's `display-md` mobile letter-spacing — matching what Cycle 3 set on `how-we-do-it.html`. This is mechanical preview-doc consistency, no live theme changes.

## Background

Cycle 3 fixed `display-md` mobile across the site at L3 (live `base.css`) and updated `how-we-do-it.html` preview's `-0.6px → -0.8px` letter-spacing. The Cycle 3 S audit flagged that the same `-0.6px` value persists in five other preview files (Advisory 1, sprint-15-cycle-3-S.md):

- `docs/pl2/Previews/homepage.html`
- `docs/pl2/Previews/services.html`
- `docs/pl2/Previews/about-us.html`
- `docs/pl2/Previews/open-source-projects.html`
- `docs/pl2/Previews/contact-us.html`

This is preview-canonicalization residue from Sprint 13 — those files share the same `.section-head h2` mobile rule and need the same letter-spacing tightening.

## Acceptance criteria

- [ ] All 5 preview files above have their mobile `.section-head h2` (or equivalent `display-md` mobile heading) letter-spacing set to `-0.8px` to match `how-we-do-it.html`.
- [ ] No other selector / property changes in those files.
- [ ] No live theme files modified.
- [ ] No `!important`.
- [ ] Stage by explicit path.

## Verification (F runs T1)

For each of the 5 preview files:
- `grep -nE 'letter-spacing:\s*-0\.6px' docs/pl2/Previews/<file>.html` returns 0 matches in the mobile-H2 context after the fix.
- `grep -nE 'letter-spacing:\s*-0\.8px' docs/pl2/Previews/<file>.html` returns 1+ matches in the mobile-H2 context.

## Handoff

Write your handoff to `docs/pl2/handoffs/sprint-15-cycle-4-F.md`.

## Notes

This is a mechanical sweep. F should not deviate without trace. If the trace reveals one of the previews uses a different selector for mobile H2 (Sprint 13 canonicalized the previews but they may have small variations), document and adapt — the goal is `-0.8px` letter-spacing on whatever rule controls mobile `display-md` heading on each preview.
