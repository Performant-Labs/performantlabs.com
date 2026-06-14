# Sprint 7 — Final cycle — Cross-landing-page WCAG 1.4.10 regression baseline (T + S)

**Branch:** `aa/pl-sprint-7-cycle-final-verification`
**Pipeline:** O → T → S → O (verification-only; no F)
**Mode:** autonomous

## Objective

Cycle 1 audit found R8 empirically resolved by intervening commits. Establish a documented regression-prevention baseline that future sprints can reference: the four landing pages clear WCAG 2.1 SC 1.4.10 at 320 and 375, and don't regress at 768 or 1280.

## Scope

Pages:
- `/` (homepage)
- `/services`
- `/how-we-do-it`
- `/open-source-projects`

Viewports:
- 320 × 568 (WCAG 1.4.10 spec minimum)
- 375 × 667 (target mobile)
- 768 × 1024 (tablet sanity)
- 1280 × 800 (desktop sanity)

Checks:
- T1: HTTP 200 on each page.
- T2: heading hierarchy, ARIA landmarks, semantic structure.
- WCAG 1.4.10 probe (binding signal): `documentElement.scrollWidth` ≤ `clientWidth` at 320 and 375. Internal-scroll containers (e.g., heal-flow on homepage) excluded — these are authorized overflow-x: auto and clip cleanly.
- Pa11y on each landing page — PC-5 wording: 0 new errors. Pre-existing brand-color deviations on allowlist.
- T3 visual at 320 + 375: no clipped content; hero copy + CTAs visible.
- WCAG 2.2 AA full audit per S template.

## Acceptance criteria

- [ ] `scrollWidth ≤ clientWidth` at 320 and 375 on all four landing pages.
- [ ] No new pa11y errors introduced (PC-5).
- [ ] Heading hierarchy clean per page.
- [ ] T3 visual at 320 + 375 shows no clipping on hero, CTAs, kickers.
- [ ] WCAG 2.2 AA every row PASS per S template.

## Handoff locations

- T: `docs/pl2/handoffs/cycle-final-r8-baseline-T.md`
- S: `docs/pl2/handoffs/cycle-final-r8-baseline-S.md`
- Report: `docs/pl2/handoffs/cycle-final-r8-baseline-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-7-final/`

## Commit message (O will commit on S PASS)

`chore(landing-pages): sprint 7 final cycle — WCAG 1.4.10 regression baseline`
