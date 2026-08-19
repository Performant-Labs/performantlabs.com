# Sprint 5 — Final cycle — Cross-section verification + WCAG

**Branch:** `aa/pl-sprint-5-cycle-final-verification`
**Pipeline:** O → T → S → O (verification-only, no F, no new code)
**Mode:** autonomous

## Objective

Whole-page integration audit of `/services` after Cycles 2, 3, 4 landed. Catch issues that only show up when all sections render together. Confirm cross-page regressions are absent on shared CSS files.

## Scope

- `/services` whole-page T1 + T2 + WCAG 2.2 AA.
- T1 + T2 spot-check on `/`, `/about-us`, `/articles` — these are the pages most likely to be affected by the L5 changes in `dy-section.css`, `card.css`, `grid-wrapper.css`, `title-cta.css`.
- T3 visual diff `/services` whole-page at 1280×800, 768×1024, 375×667 vs `docs/pl2/Previews/services.html`. Section-by-section.
- Keyboard nav full-page, focus rings, forced-colors mode, reduced-motion, 200% zoom, image alt text, mobile touch targets ≥ 44×44 CSS px.
- Pa11y on `/services` — qualify per pre-commitment PC-5 ("0 new errors introduced by this cycle"). Pre-existing brand-color deviations (button --primary 2.21:1; breadcrumb 3.12:1) not blockers.

## Out of scope

- N2 nearshore container-cap (Cycle 5 closed; logged as FU-S5-5).
- Pre-existing accepted deviations from `pl-plan--services.md` §"Final advisory carry-forward".
- Hero (FU-2 canonical).

## Acceptance criteria

- [ ] `/services` HTTP 200, all 5 visible sections (hero, engagements, nearshore, proof, closing-cta) render.
- [ ] Heading hierarchy clean: single H1 (hero), no skipped levels.
- [ ] ARIA landmarks `<header>`, `<main>`, `<footer>`, `<nav>` present.
- [ ] T3 visual: every section MATCH or DELTA-with-justification vs preview at 1280 + 375. Section-by-section table.
- [ ] WCAG 2.2 AA: every row of S's audit table PASS.
- [ ] Pa11y: 0 new errors (allowlist via PC-5: existing brand deviations OK).
- [ ] Keyboard nav: every interactive element reachable in logical reading order with visible focus ring.
- [ ] All CTAs route correctly (no 404).
- [ ] Mobile (375): touch targets ≥ 44×44 CSS px; no horizontal scroll outside intentional containers.
- [ ] Cross-page regression check: `/`, `/about-us`, `/articles` T1 + T2 PASS.

## Handoff locations

- T: `docs/pl2/handoffs/cycle-final-verification-T.md`
- S: `docs/pl2/handoffs/cycle-final-verification-S.md`
- Report: `docs/pl2/handoffs/cycle-final-verification-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-5-final/`

## Commit message (O will commit on S PASS)

`chore(services): sprint 5 final cycle — cross-section verification + WCAG audit`
