# Handoff-S: Sprint 6 Cycle 2 Rework — /services engagements card-internal layout at 768

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Issue:** `docs/pl2/handoffs/cycle-2-grid-collapse-rework-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2-grid-collapse-T-rework.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-grid-collapse-F-rework.md`
**Prior S (REWORK):** `docs/pl2/handoffs/cycle-2-grid-collapse-S.md`
**Operator-facing report:** [`cycle-2-grid-collapse-rework-report.html`](cycle-2-grid-collapse-rework-report.html)

## T precondition
Confirmed: T reported zero blocking issues. All T1 + T2 + acceptance-criteria checks PASS.

## Tier 3 visual audit

### Visual diff results (whole-page, informative only)

Whole-page deltas are inflated by page-height drift (live Drupal render vs static preview footer differences). Per-section engagements crops at the binding viewport (768) are the decisive signal.

| Page | Viewport | Live (px) | Preview (px) | AE pixels | Whole-page delta |
|---|---|---|---|---|---|
| /services | 1280 × 800  | 1280 × 4418 | 1280 × 4067 | 2,034,640 | ~36% (height drift) |
| /services | 768 × 1024  | 768 × 5249  | 768 × 4744  | 1,752,100 | ~43% (height drift) |
| /services | 375 × 667   | 375 × 6555  | 375 × 6360  |   825,909 | ~34% (height drift) |
| /open-source-projects | 1280 | 1280 × 4490 | 1280 × 4203 | 2,278,010 | ~40% (height drift) |
| /open-source-projects | 768  | 768 × 7041  | 768 × 7820  | 3,750,060 | ~62% (height drift) |
| /open-source-projects | 375  | 375 × 9293  | 375 × 7454  | 1,540,670 | ~44% (height drift) |

### DOM measurements (post-fix, Playwright getBoundingClientRect + getComputedStyle)

`.grid-wrapper--2col` cards on /services:

| Viewport | `article.card` width | `.card__layout` width | display | flex-direction | padding-inline | `.card__bottom` width |
|---|---|---|---|---|---|---|
| 1280 | 549.9 px | 547.9 px | flex | column | 0 / 0 | 547.9 px (full) |
| 768  | 692.75 px | 690.75 px | **flex** | **column** | **0 / 0** | **690.75 px (full)** |
| 375  | 331.2 px | 329.2 px | flex | column | 0 / 0 | 329.2 px (full) |

At 768, F's `@media (max-width: 991px) { .grid-wrapper--2col .card__layout { display: flex; flex-direction: column } }` correctly overrides Dripyard's `@container (width > 600px)` grid layout. The container query's `grid-template-columns: repeat(2, minmax(0, 1fr))` remains in computed style but is inert because `display: flex` is in effect. `card__bottom` now spans the full card width, matching the preview.

`/open-source-projects` cards at 768 (sample of 6):

| `.card__layout` width | display | grid-template-columns | `.card__top` width | `.card__bottom` width |
|---|---|---|---|---|
| 271.5 px | flex | none | 271.5 px (full) | 271.5 px (full) |
| 271.5 px | flex | none | 271.5 px (full) | 271.5 px (full) |
| 271.5 px | flex | none | 271.5 px (full) | 271.5 px (full) |
| 315.5 px | flex | none | 315.5 px (full) | 315.5 px (full) |
| 315.5 px | flex | none | 315.5 px (full) | 315.5 px (full) |
| 315.5 px | flex | none | 315.5 px (full) | 315.5 px (full) |

All cards stay below the 600 px container threshold; image+text cards render normally with image on top, text below. No regression. Selector scoping (`.grid-wrapper--2col …`) confirms why: this class is absent on /open-source-projects per T's curl scan.

### Per-section delta description

- **Engagements @ 1280 (/services):** MATCH. 2 × 2 grid, content fills cards. Unchanged from prior cycle.
- **Engagements @ 768 (/services):** MATCH. Four cards stack 1-col. Content (eyebrow, title, body) now fills the full ~691 px card width. **Cycle goal met.** Compare to prior S finding of `card__bottom = 305 px` (~44%).
- **Engagements @ 375 (/services):** MATCH. 1-col stack, content full-bleed. Unchanged.
- **Cards @ 1280 / 768 / 375 (/open-source-projects):** MATCH. Image cards render normally — image-on-top, text-below. Selector scope confirms no rule applies on this page.

### Desktop (1280px)

| Token / spec | Brief / preview | Rendered | Match |
|---|---|---|---|
| Engagements grid | 2 × 2 | 2 × 2 | YES |
| Card content fills card | full-bleed | full-bleed (547.9 px in 549.9 px card) | YES |

### Tablet (768px)

| Token / spec | Brief / preview | Rendered | Match |
|---|---|---|---|
| Engagements grid | 1-col, 4 stacked | 1-col, 4 stacked | YES |
| Card content fills card | full-bleed | full-bleed (690.75 px in 692.75 px card) | YES |
| Color, typography, spacing | unchanged | unchanged | YES |

### Mobile (375px)

| Token / spec | Brief / preview | Rendered | Match |
|---|---|---|---|
| Engagements grid | 1-col | 1-col | YES |
| Card content fills card | full-bleed | full-bleed | YES |

## Design brief compliance

This rework is layout-only (display, flex-direction, padding-inline). No color, typography, or spacing tokens modified. Pre-existing token compliance preserved.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | No interactive surface changes |
| Focus ring visibility | PASS | No focus style changes |
| Forced-colors mode | PASS | No color/border changes |
| Reduced-motion | PASS | No transition changes |
| 200% zoom | PASS | No horizontal scroll regression |
| Heading hierarchy | PASS | Unchanged (per T: H1=1, H2=7, H3=7) |
| Image alt text | PASS | No image changes |
| Mobile touch targets (375px) | PASS | Card targets unchanged |
| Mobile typography scale | PASS | Unchanged |
| Mobile layout | PASS | 1-col, no horizontal scroll |
| Tablet (768) WCAG | PASS | Content reads at full ~691 px measure; no contrast or sizing regression |

## Static preview comparison

| Section | Status | Notes |
|---|---|---|
| Engagements (1280) | MATCH | 2 × 2, full-bleed card content |
| Engagements (768)  | **MATCH** | Cycle goal met — 1-col stack, content full-bleed |
| Engagements (375)  | MATCH | 1-col stack, content full-bleed |
| OSP cards (all viewports) | MATCH | Image cards unaffected; selector scoping verified |
| Other sections | MATCH | No changes |

## Verdict

**PASS** — F's `@media (max-width: 991px)` block in `card.css` correctly overrides Dripyard's container-query 2-col layout when the engagement grid has collapsed. At 768, all four engagement cards stack vertically with content filling the full card width (was ~305 px / ~44% in prior cycle). Cross-page check on /open-source-projects confirms image cards are unaffected — selector scoping (`.grid-wrapper--2col …`) is correct. Specificity wins (0,2,0 over 0,1,0; 0,3,0 over 0,2,0) and source order (libraries-extend after contrib) are independently verified by T.

Ready for O to commit.

## Advisory notes

1. **Computed-style cosmetic.** At 768, `grid-template-columns: repeat(2, minmax(0px, 1fr))` is leaked into `.card__layout`'s computed style (the container query's other declarations still resolve). It is inert because `display: flex` overrides the grid display. No visual or functional impact. If a future housekeeping pass wants to clean this up, an additional `grid-template-columns: none` could be added inside the same `@media` block — purely aesthetic.

2. **Padding-inline reset scope verified.** F's `.grid-wrapper--2col .card[class*="theme"] .card__layout { padding-inline: 0 }` resolves to `0 / 0` on the engagement cards (all themed) and is correctly scoped — would not affect non-themed cards anywhere.

3. **OSP page-height drift in screenshots.** The `/open-source-projects` page renders ~7041 px tall on live but ~7820 px tall in the static preview at 768 (and reverses at 375). This is content/footer drift, not a regression introduced by this cycle. Worth noting only so the operator does not interpret the high whole-page diff percentages as visual change.
