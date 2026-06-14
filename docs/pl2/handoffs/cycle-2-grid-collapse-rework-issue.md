# Sprint 6 — Cycle 2 — REWORK — card internal layout at 768

**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse` (continue here)
**Mode:** autonomous

## What S found

The grid-collapse L5 rule lands cleanly (1-col at 768, 2×2 at 1280, 1-col at 375 — all per spec). But the cycle exposed a downstream regression: at 768 the card-internal layout still uses a half-width content column. Playwright evidence:

- `article.card` width = 693 px
- `.card__layout` width = 691 px
- `.card__bottom` width = **305 px** (≈ 44 % of card)

Result: title + body wrap into the left ~44 % of each stacked card with empty space on the right. Preview shows full-bleed content. 1280 and 375 render correctly via different cascade paths.

## Source-of-truth resolution (autonomous)

Per Sprint 6 PC-1 (brief tokens > preview > content > live), preview is canonical for layout. Fix the card-internal layout to fill at 768.

## Fix

Add an L5 rule in `web/themes/custom/performant_labs_20260502/css/components/card.css` (or wherever the existing `.card__bottom` width constraint lives — F traces) so that at `(max-width: 991px)`:

- `.card__layout` and `.card__bottom` (or whichever element constrains the inner column) span the full card width.
- Likely either: `.card__bottom { width: 100%; }`, OR remove a `grid-template-columns` rule on `.card__layout`, OR set `flex: 1` — F decides after tracing the existing rule.

## Acceptance criteria

- [ ] `/services` § engagements at 768: 4 stacked cards, each with title + body filling the full card width (not 44 %).
- [ ] `/services` § engagements at 1280 (2×2) unchanged.
- [ ] `/services` § engagements at 375 (1-col) unchanged.
- [ ] No regression on other pages using `card.css` — F confirms which pages render `.card__bottom`.
- [ ] No `!important`.
- [ ] T1 + T2 PASS.

## Handoff

- F: `docs/pl2/handoffs/cycle-2-grid-collapse-F-rework.md`
- T: `docs/pl2/handoffs/cycle-2-grid-collapse-T-rework.md`
- S: `docs/pl2/handoffs/cycle-2-grid-collapse-S-rework.md`
