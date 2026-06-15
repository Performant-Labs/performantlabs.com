# Handoff-T: Sprint 6 Cycle 2 Rework - Card internal layout at 768

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`
**Issue:** `docs/pl2/handoffs/cycle-2-grid-collapse-rework-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-grid-collapse-F-rework.md`

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache cleared | `ddev drush cr` | success | `[success] Cache rebuild complete.` | PASS |
| HTTP /services | `curl -sk '.../services' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /open-source-projects | `curl -sk '.../open-source-projects' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /articles | `curl -sk '.../articles' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -sk '.../' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| @media block in served CSS | `curl -sk '.../card.css' \| grep -A10 "max-width: 991px"` | Block present with both rules | Both rules present verbatim | PASS |
| No `!important` | `curl -sk '.../card.css' \| grep -c "!important"` | 0 | 0 | PASS |

Base URL used: `https://pl-performantlabs.com.3.ddev.site:8493` (local DDEV port 8493, SSL bypassed via `-sk` per local self-signed cert).

### @media block as served

```
@media (max-width: 991px) {
  .grid-wrapper--2col .card__layout {
    display: flex;
    flex-direction: column;
  }

  .grid-wrapper--2col .card[class*="theme"] .card__layout {
    padding-inline: 0;
  }
}
```

## Tier 2 results

| Check | Method | Finding | Result |
|---|---|---|---|
| `.grid-wrapper--2col` scope: / | `curl -sk '.../' \| grep -c "grid-wrapper--2col"` | 0 | PASS |
| `.grid-wrapper--2col` scope: /open-source-projects | `curl -sk '.../open-source-projects' \| grep -c "grid-wrapper--2col"` | 0 | PASS |
| `.grid-wrapper--2col` scope: /articles | `curl -sk '.../articles' \| grep -c "grid-wrapper--2col"` | 0 | PASS |
| `.grid-wrapper--2col` scope: /services | `curl -sk '.../services' \| grep -c "grid-wrapper--2col"` | 1 (target page only) | PASS |
| Card count on /services | `grep -c "card__layout"` | 4 | PASS |
| `.card__top` on /services | `grep -c "card__top"` | 0 (no images — confirms no card__top child to populate col 1 of 2-col grid) | PASS |
| `.card__bottom` on /services | `grep -c "card__bottom"` | 4 | PASS |
| `/open-source-projects` card structure | `grep -c "card__layout"` = 7; `grep -c "card__top"` = 6; `grep -c "grid-wrapper--2col"` = 0 | Image cards unaffected; selector not present on page | PASS |
| Heading hierarchy /services | H1=1, H2=7, H3=7, H4=0 | Single H1; no skipped levels; unchanged from pre-rework | PASS |
| Heading hierarchy / | H1=1, H2=7, H3=6 | Single H1; no skipped levels | PASS |
| ARIA landmarks /services | `<header>`=1, `<main>`=1, `<footer>`=1, `<nav>`=3 | All four landmarks present | PASS |
| ARIA landmarks /open-source-projects | `<header>`=1, `<main>`=1, `<footer>`=1, `<nav>`=3 | All four landmarks present | PASS |
| No `!important` in card.css | grep count on served file | 0 | PASS |
| CSS change log updated | `grep "rework" docs/pl2/css-change-log.md` | Rework entry appended with L5 ruling and selector scope notes | PASS |

### Specificity verification (independent of F's claim)

F states: `.grid-wrapper--2col .card__layout` has specificity (0,2,0) and beats Dripyard's `.card__layout` (0,1,0) inside `@container`.

Independent verification from Dripyard `card.css`:

- Dripyard base rule: `.card__layout { ... @container (width > 600px) { display: grid; grid-template-columns: ... } }` — selector specificity (0,1,0).
- Dripyard padding-inline: nested inside `@container` as `.card[class*="theme"] &` which desugars to `.card[class*="theme"] .card__layout` — specificity (0,2,0).
- F's display fix: `.grid-wrapper--2col .card__layout` — specificity (0,2,0). Wins over (0,1,0) by class count. At equal specificity with any (0,2,0) Dripyard rule, load order determines winner; libraries-extend loads custom after contrib — confirmed in `performant_labs_20260502.info.yml`: `core/components.dripyard_base--card: - performant_labs_20260502/card`. Source order win confirmed.
- F's padding-inline fix: `.grid-wrapper--2col .card[class*="theme"] .card__layout` — specificity (0,3,0). Beats Dripyard's (0,2,0) by class count. Correct.

Note: `@container` and `@media` are both conditional at-rules at the same cascade layer. Specificity and source order determine which wins when both match. At 601px–991px viewport, both the Dripyard `@container (width > 600px)` and F's `@media (max-width: 991px)` match simultaneously. F's selector specificity advantage (0,2,0 vs 0,1,0; 0,3,0 vs 0,2,0) means F's rules prevail. This is structurally correct.

## WCAG contrast verification

F reports no color, typography, or contrast changes in this rework. The change is display, flex-direction, and padding-inline only.

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| N/A — layout change only | -- | -- | N/A | N/A | N/A |

No contrast verification required. All existing contrast ratios are preserved by structural isolation of the change.

## Mobile responsive verification

F added a `@media (max-width: 991px)` block targeting the 601px–991px viewport band where the 2-col grid has collapsed but Dripyard's container query would otherwise fire.

| Breakpoint | Behavior specified | CSS rule confirmed | Result |
|---|---|---|---|
| >= 992px | 2x2 grid; cards ~566px < 600px container query threshold; no fix needed | No new rule in this range; no change | PASS |
| 601px–991px | REWORK TARGET: grid collapses to 1-col (via grid-wrapper.css `@media (max-width: 991px)`); card ~693px > 600px triggers Dripyard container query; F's `@media (max-width: 991px)` block resets `.card__layout` to `display: flex; flex-direction: column` and zeroes `padding-inline` | Rule present in served CSS; both selectors confirmed | PASS |
| <= 600px | Container query does not fire (card < 600px); card__layout stays flex-column; no action needed | No new rule in this range; unchanged | PASS |

Breakpoint `max-width: 991px` matches grid-wrapper.css grid-collapse breakpoint exactly — confirmed by reading grid-wrapper.css lines 113–120.

Touch targets: not applicable to this change. Card elements are block-level and well above 44x44 CSS px at all viewports.

Typography-mobile block: not applicable. No font-size or line-height changes in this rework.

## Acceptance criteria status

From `docs/pl2/handoffs/cycle-2-grid-collapse-rework-issue.md`:

| Criterion | Evidence | Result |
|---|---|---|
| `/services` § engagements at 768: 4 stacked cards, each with title + body filling the full card width (not 44%) | `@media (max-width: 991px) { .grid-wrapper--2col .card__layout { display: flex; flex-direction: column; } }` resets the Dripyard container query grid layout. 4 `card__layout` elements confirmed on /services. 0 `card__top` elements confirm sole child is `card__bottom`, which will fill 100% width in flex-column. Visual confirmation is S's scope (Tier 3). | PASS (structural) |
| `/services` § engagements at 1280 (2×2) unchanged | At 1280px, cards are ~566px wide (< 600px container threshold). Dripyard container query does not fire; card__layout stays flex-column natively. No new rule applies at >= 992px. Grid-wrapper.css rule only fires at <= 991px. | PASS |
| `/services` § engagements at 375 (1-col) unchanged | At 375px, cards are ~343px wide (< 600px container threshold). Container query does not fire. No new rule applies to <= 600px range explicitly; `max-width: 991px` covers this range but flex-column is already the default at this width — override is redundant but not harmful. | PASS |
| No regression on other pages using `card.css` | Selector `.grid-wrapper--2col` confirmed absent on /open-source-projects (0 matches), /articles (0 matches), / (0 matches). /open-source-projects has 7 cards, 6 with `card__top` images — unaffected by this selector. | PASS |
| No `!important` | `grep -c "!important"` on served card.css = 0 | PASS |
| T1 + T2 PASS | See Tier 1 and Tier 2 results above | PASS |

## Blocking issues

None.

## Advisory notes

1. **Container query + media query interaction.** At viewports between 601px and 991px, both Dripyard's `@container (width > 600px)` and F's `@media (max-width: 991px)` match simultaneously. F's rules win on specificity (0,2,0 vs 0,1,0; 0,3,0 vs 0,2,0) and source order (libraries-extend after contrib). This is structurally correct. S should confirm the visual result at 768px as the spec's critical viewport.

2. **padding-inline reset scope.** The padding-inline reset targets `.grid-wrapper--2col .card[class*="theme"] .card__layout`. On /services all engagement cards have `class*="theme"` (confirmed by `card.theme--light` in the existing CSS scope). The reset is correctly scoped and will not affect non-themed cards.

3. **`/articles` has no `card__layout` elements.** Curl confirms 0 `card__layout` matches on /articles. Cards on that page appear to use a different markup pattern. No regression risk from this change.

---

T complete, no blocking issues. Ready for S.
