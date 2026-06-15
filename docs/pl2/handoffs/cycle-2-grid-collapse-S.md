# Handoff-S: Sprint 6 Cycle 2 — /services engagement grid 768 collapse (FU-S5-1)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Issue:** `docs/pl2/handoffs/cycle-2-grid-collapse-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2-grid-collapse-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-grid-collapse-F.md`
**Operator-facing report:** [`cycle-2-grid-collapse-report.html`](cycle-2-grid-collapse-report.html)

## T precondition
Confirmed: T reported zero blocking issues. All T1 and T2 checks PASS.

## Tier 3 visual audit

### Visual diff results (whole-page, informative)

| Viewport | Pixels different | Whole-page delta % |
|---|---|---|
| 1280 × 800  | 2,034,640 | 0.36% |
| 768 × 1024  | 1,888,560 | 0.46% |
| 375 × 667   | 825,909 | 0.34% |

Whole-page deltas are all < 0.5% and not actionable (drift from font-rendering, scrollbar, content layout differences between live Drupal render and static preview). Per operator instruction, **per-section crops at 768 are the binding signal**.

### Per-section engagements crops (binding)

Screenshots saved to `docs/pl2/handoffs/screenshots/sprint-6-cycle-2/`:

| Viewport | Live crop | Preview crop | Status |
|---|---|---|---|
| 1280 | engagements-1280-live | engagements-1280-preview | **MATCH** — 2 × 2 grid, content fills cards |
| 768  | engagements-768-live  | engagements-768-preview  | **REWORK** — grid collapses to 1-col (cycle goal met) but card content occupies only ~44% of card width |
| 375  | engagements-375-live  | engagements-375-preview  | **MATCH** — 1-col stack, content fills cards |

### Per-section delta description

**768 — engagements (REWORK).** The L5 rule (`@media (max-width: 991px) { .grid-wrapper--2col .grid-wrapper__grid { grid-template-columns: 1fr; } }`) does exactly what the issue specifies: four cards now stack vertically at 768. However, each card's *internal* content layout is broken at this width:

- DOM inspection at 768 (Playwright): `article.card` = 693 px wide (full grid width — correct). Inside it: `.card__layout` = 691 px (correct); `.card__bottom` = **305 px** (≈ 44%); `.card__title` and `.card__body` inherit the 305 px column.
- The preview renders title/body at the full ~720 px card width.
- The narrow inner column was acceptable while cards were half-width (at 1280 with 2-col grid, card was ~566 px so 305 px-wide content read as a sensible inner padding). The grid collapse exposed this card-internal sizing.
- At 375 the same `.card__bottom` element happens to render at the full card width (different cascade path via `@media (max-width: 576px)`), so 375 is unaffected.

Diff PNG at 768 shows a wide red column along the right ~55% of every card — that is the empty area on live where preview has text.

This is not the L5 grid rule's fault; the rule is correct and should remain. The downstream regression is in `.card__layout` and was masked previously by the 2-col grid.

### Desktop (1280px)
| Token / spec | Brief / preview | Rendered | Match |
|---|---|---|---|
| Engagements grid | 2 × 2 | 2 × 2 | YES |
| Card content fills card | full-bleed | full-bleed | YES |
| Color, typography, spacing | per brief | unchanged | YES |

### Tablet (768px)
| Token / spec | Brief / preview | Rendered | Match |
|---|---|---|---|
| Engagements grid | 1-col, 4 stacked | 1-col, 4 stacked | **YES (cycle goal met)** |
| Card content fills card | full-bleed (~720 px) | constrained to ~305 px column | **NO** |
| Color, typography, spacing | per brief | unchanged | YES |

### Mobile (375px)
| Token / spec | Brief / preview | Rendered | Match |
|---|---|---|---|
| Engagements grid | 1-col | 1-col | YES |
| Card content fills card | full-bleed | full-bleed | YES |

## Design brief compliance
This cycle is layout-only (`grid-template-columns`, `grid-column`). No color/typography/spacing tokens were modified or relevant to verify beyond pre-existing state.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | No interactive surface changes |
| Focus ring visibility | PASS | No focus style changes |
| Forced-colors mode | PASS | No color/border changes |
| Reduced-motion | PASS | No transition changes |
| 200% zoom | PASS | No horizontal scroll regression |
| Heading hierarchy | PASS | Unchanged (per T) |
| Image alt text | PASS | No image changes |
| Mobile touch targets (375px) | PASS | Card targets unchanged |
| Mobile typography scale | PASS | Unchanged |
| Mobile layout | PASS | 1-col, no horizontal scroll |
| Tablet (768) WCAG | PASS | The card-internal under-fill is not a WCAG failure (text remains legible at narrower measure); flagged as visual REWORK above, not accessibility |

## Static preview comparison

| Section | Status | Notes |
|---|---|---|
| Hero | MATCH | Untouched |
| Engagements (1280) | MATCH | 2 × 2, full-bleed card content |
| Engagements (768)  | **DELTA / REWORK** | Grid collapses correctly; card content under-fills (see Tier 3 above) |
| Engagements (375)  | MATCH | 1-col, full-bleed card content |
| Other sections | MATCH | No changes |

## Verdict

**REWORK** — the L5 grid rule itself is correct and should be kept. A downstream card-internal regression at 768 is exposed by the now-full-width cards and must be addressed before this can ship to operator commit.

### Required follow-up

1. **Card internal layout at 768.** On `/services` at 768, the inner `.card__bottom` container renders at ~305 px inside a 693 px `article.card`, leaving the right ~55% of every card empty. The preview fills the card. Find the rule constraining `.card__layout` / `.card__bottom` at this viewport (likely a `grid-template-columns` or `max-width` sized for the prior half-width-card context) and let it span the full card width at `(max-width: 991px)`. The 375 behavior is already correct and can serve as the reference cascade path.
   - **Proposed sub-issue branch:** `aa/pl-sprint-6-cycle-3-card-internal-fill-768`
   - **Out of scope for the cycle 2 fix:** do **not** modify `.grid-wrapper--2col`. The rule added in this cycle is correct.
   - **Operator decision needed:** confirm preview is canonical for card internal layout at 768. If brief specifies a constrained optical line-length treatment instead, the fix would center the inner column rather than make it full-bleed.

## Advisory notes

- Per T's advisory: the older `@media (max-width: 576px)` rule at lines 53-57 of `grid-wrapper.css` is now silently superseded by the new 991-rule. Visual outcome identical at <=576px. Consider cleaning up in a future housekeeping pass.
- The cycle 2 work is correct and minimal. The REWORK above is a discovered downstream issue, not a defect in this cycle's implementation. O may decide to commit cycle 2 as-is and open cycle 3 for the card-internal fix, rather than rolling cycle 2 back — operator's call.
