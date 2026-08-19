# Sprint 8 — Final cycle — Footer + contact regression baseline (T + S)

**Branch:** `aa/pl-sprint-8-cycle-final-verification`
**Pipeline:** O → T → S → O (verification-only)
**Mode:** autonomous

## Objective

Cycle 1 audit found Bundle 3 (F.8, F.9, ADV-C1, ADV-CU1) empirically resolved. Establish a documented regression-prevention baseline that future sprints can cite.

## Scope

All 7 shipped pages: `/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`.

Confirm:
- HTTP 200 on every page.
- Every header CTA + every footer link returns 200 (or 301 → 200 for intentional redirects). T re-runs the Cycle 1 inventory checks with fresh `drush cr`.
- `/contact-us` has exactly one H1; heading hierarchy clean.
- Every Services sub-list anchor in the footer matches a live ID on `/services`.
- Pa11y across the 7 pages — PC-5 wording (0 new errors).
- Heading hierarchy + ARIA landmarks across all 7 pages.

## Acceptance criteria

- [ ] HTTP 200 on every shipped page.
- [ ] Every CTA + footer link returns 200/301→200.
- [ ] Zero broken anchors.
- [ ] `/contact-us` H1 count = 1; heading hierarchy clean.
- [ ] WCAG 2.2 AA per S template (all rows PASS).
- [ ] Pa11y 0 new errors (PC-5).

## Handoff

- T: `docs/pl2/handoffs/cycle-final-footer-contact-baseline-T.md`
- S: `docs/pl2/handoffs/cycle-final-footer-contact-baseline-S.md`
- Report: `docs/pl2/handoffs/cycle-final-footer-contact-baseline-report.html`

## Commit message

`chore(footer-contact): sprint 8 final cycle — link integrity baseline + Bundle 3 closure`
