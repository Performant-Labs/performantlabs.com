# Issue: Sprint 17 Cycle 2 — preview-doc batch (CARD + A + B + D)

**Branch:** `aa/pl-sprint-17-cycle-2-preview-doc-batch`
**Sprint:** 17
**Mode:** Autonomous
**Pipeline:** F → T → S

## Objective

Four preview-doc fixes in `docs/pl2/Previews/open-source-projects.html`. No live theme code.

1. **F-NEW-17-CARD** — Restructure each `.project-card` (or equivalent) so the **title** is the link; remove the separate "Read the docs →" footer link. Match live `card.html.twig` pattern.
2. **F-NEW-17-A** — Hero H1 + card H3 color: change `#2A2520` → `#1F1A14` (Sprint 13–16 sitewide ink-strong baseline).
3. **F-NEW-17-B** — Hero `.hero__inner` (or equivalent container) max-width: change `920px` → `1040px` to match live's wrap behavior (H1 should render 1 line at 1280 like live).
4. **F-NEW-17-D** — Add a Payment Stripe card to §D "Other modules we maintain" (live has 7 cards, preview has 6). Match live's section content.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-17-cycle-1-audit.md` — finding details per row (probe data, selectors)
- [ ] `docs/pl2/Previews/open-source-projects.html` — file to edit
- [ ] `docs/pl2/Previews/{about-us,how-we-do-it}.html` — siblings to cross-reference structure
- [ ] Live `/open-source-projects` page — source of truth for CARD pattern + Payment Stripe content

## Acceptance criteria

- [ ] **CARD.** Every project card on the preview has the title as the link (`<a>` wraps the heading text); no separate footer "Read the docs →" link remains. The card's existing visual chrome (border, radius, padding) preserved.
- [ ] **A.** Preview computes `color: rgb(31, 26, 20)` for hero H1 + card H3s.
- [ ] **B.** Preview hero `.hero__inner` (or wrapper) computes `max-width: 1040px` at 1280. Hero H1 wraps to 1 line at 1280.
- [ ] **D.** Preview §D has 7 cards including a Payment Stripe entry; match the live ordering + content.
- [ ] No `!important`.
- [ ] Stage by explicit path.
- [ ] Post-fix DSSIM at 1280 for hero + cards sections drops materially vs Cycle 1 baseline.

## Constraints

- Docs-only. No theme files.
- No live code changes.
- Per memory `feedback_no_orphan_words.md` — confirm hero H1 at 1-line wrap; no new orphans introduced.

## Handoff

Write to: `docs/pl2/handoffs/sprint-17-cycle-2-F.md`.

## Notes

CARD is the largest restructure of the four. F should match live's exact card HTML structure where possible — read the rendered HTML on `/open-source-projects` via curl + section grep to capture the canonical structure, then apply to the preview.
