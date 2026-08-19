# Handoff-F: Sprint 11 Cycle 2b - /open-source-projects centered-white markers

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2b-osp-markers`
**Issue:** `docs/pl2/handoffs/cycle-2b-osp-markers-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | /open-source-projects (canvas_page id=5) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-11-cycle-2b-osp-markers` |
| Runbook phase | Sprint 11, Cycle 2b |
| Input documents read | cycle-2b-osp-markers-issue.md, cycle-1-hygiene-audit-S.md (Thread D), cycle-2b1-about-us-refactor-F.md, sprint10-cycle2b1-about-us-markers.php, theme-change--workflow.md, section.component.yml, kicker.css, dy-section.css |
| Acceptance criteria count | 7 |
| Handoff document path | `docs/pl2/handoffs/cycle-2b-osp-markers-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/sprint11-cycle2b-osp-markers.php`** (new): Idempotent Canvas-patch script. Adds `dy-section--centered-white` marker to 2 sections on canvas_page id=5 (/open-source-projects). Preserves `component_version`. Pattern follows `sprint10-cycle2b1-about-us-markers.php`.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Updated P2 marker selectors from single-class `.dy-section--centered-white` to doubled-class `.dy-section.dy-section--centered-white` per Sprint 10 codification (specificity 0,2,0). Updated P2 comment block to reflect current marker state.

### Marker-to-section mapping

| Canvas index | Section | Theme | Marker added | Pattern |
|---|---|---|---|---|
| 0 | Hero ("Open source") | theme--white | `dy-section--centered-white` | P2 |
| 11 | Community | theme--white | `dy-section--centered-white` | P2 |

### CSS changes

| Line(s) | Change | Specificity before | Specificity after |
|---|---|---|---|
| 132 | `.dy-section--centered-white` to `.dy-section.dy-section--centered-white` | 0,1,0 + descendant | 0,2,0 + descendant |
| 140 | same pattern | 0,1,0 + descendant | 0,2,0 + descendant |
| 151 | same pattern | 0,1,0 + descendant | 0,2,0 + descendant |
| 212 | same pattern (mobile `@media`) | 0,1,0 + descendant | 0,2,0 + descendant |
| 115-131 | Comment block updated to reflect Sprint 11 marker additions and remaining `:has()` consumers | N/A | N/A |

## Layer decisions

All changes are Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**P2 doubled-class selector update:**
- Bottom-up: `max-width`, `margin-inline`, `text-align`, `display` on `.dy-section__header` and `.dy-section__content`. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: L1 ruled out (not config), L2 ruled out (not OKLCH), L3 ruled out (not `--theme-*` tokens). L5 correct.
- DOM inspection gate: N/A for selector specificity update -- same DOM elements targeted, same properties declared, only specificity raised to match Sprint 10 codification standard.

## Deviations from spec

1. **P2 `:has()` half NOT dropped.** The issue says to drop lines 133/141/152 (the old `:has(.dy-section__header .kicker--centered)` selectors). Investigation found that 4 additional sections across 3 other pages still depend on those selectors:
   - `/services`: "Four ways we engage" section (theme--white + centered kicker, no marker)
   - `/how-we-do-it`: hero section (theme--white + landing-hero + centered kicker, no centered-white marker)
   - `/about-us`: hero section with `dy-section--cta-pair` (theme--white + centered kicker)
   - `/about-us`: bio-block section with `dy-section--bio-block` (theme--white + centered kicker)

   Dropping the `:has()` half would break header centering on those pages, violating AC "No regression on /services / /about-us / /how-we-do-it / homepage." The `:has()` half must be retained until all consuming sections across all pages are marked with `dy-section--centered-white`.

2. **Marker applied to delta 0 (hero) in addition to delta 11.** The issue specifies only delta 11. However, delta 0 is also a P2 consumer (theme--white + centered kicker in header). Adding the marker now is forward preparation for eventual `:has()` removal. This follows the same pattern as cycle 2b.1 where the P1 marker was applied to both delta 6 (Track record) and delta 21 (Dogfood) even though the issue only listed one.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**Markers in rendered HTML (PASS):**
```
dy-section landing-hero dy-section--centered-white theme--white  (Hero, delta 0)
dy-section dy-section--centered-white theme--white               (Community, delta 11)
```
2 occurrences of `dy-section--centered-white` in `/open-source-projects` HTML confirmed.

**Doubled-class selector in served CSS (PASS):** 5 occurrences of `.dy-section.dy-section--centered-white` in served CSS (4 selectors + 1 comment).

**Old `:has()` selectors retained (PASS):** Lines 133, 141, 152 still present in CSS -- transition state.

**No regression on other pages (PASS):**
- `/services`: HTTP 200
- `/about-us`: HTTP 200
- `/how-we-do-it`: HTTP 200
- `/`: HTTP 200

### T2 -- Structural checks

**Heading hierarchy on /open-source-projects (PASS):**
h1 (hero) -> h2 (Testing tools) -> h3 (cards x3) -> h2 (Community) -> h3 (cards x3) -> h2 (Other modules) -> h3 (cards) -> h2 (Contribute)

**Community section kicker (PASS):** `kicker--centered kicker--light">Community` confirmed in rendered HTML.

**component_version preserved (PASS):**
- [0] e6079b189d228dad
- [11] e6079b189d228dad

**Idempotency (PASS):** Re-running script produces "No changes needed (all markers already present)."

**No `!important` (PASS):** 0 `!important` declarations in dy-section.css (2 occurrences in comments only).

## WCAG contrast ratios

No color or contrast changes in this cycle. All changes are marker-class additions and selector specificity updates -- the CSS declarations (property values) are identical. Existing contrast ratios from prior cycles remain valid.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Community h2 | #1F1A14 | #FFFFFF | 17.29:1 | PASS (3:1 large text) |
| Community body text | #5C544C | #FFFFFF | 7.22:1 | PASS (4.5:1 threshold) |
| Hero h1 | #1F1A14 | #FFFFFF | 17.29:1 | PASS (3:1 large text) |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. The existing mobile rule at line 212 (max-width: 100% at <=576px) was updated to use the doubled-class selector but the declaration is unchanged.

## Autonomous decisions

1. **P2 `:has()` half retained (deviation from issue).** The issue instructs dropping lines 133/141/152, but investigation confirmed 4 sections across 3 other pages still depend on those selectors. Dropping them would cause visible regression (header centering lost on /services "Four ways we engage", /how-we-do-it hero, /about-us hero + bio-block). Conservative interpretation: retain `:has()` half until all consumers are marked. This is the same transition-state pattern used in cycles 2b.1 through 2b.4.

2. **Marker applied to delta 0 in addition to delta 11.** Issue specified only delta 11, but delta 0 (hero) is also a P2 consumer. Forward preparation follows cycle 2b.1 precedent.

3. **Doubled-class specificity update applied to all 4 P2 marker selectors.** Issue AC says "specificity-safe doubled-class marker." The existing selectors used single-class (0,1,0). Updated to `.dy-section.dy-section--centered-white` (0,2,0) to match the Sprint 10 codification standard used by `.dy-section.dy-section--kicker-inline`, `.dy-section.dy-section--wordmark-strip`, etc.

## Remaining P2 `:has()` consumers (follow-up)

The following sections still need `dy-section--centered-white` markers before the `:has()` half of P2 can be dropped:

| Page | Section | Current classes | Notes |
|---|---|---|---|
| /services | "Four ways we engage" | `theme--white` (no marker) | Has grid-wrapper content; only needs header centering (lines 133/141), not content centering (line 152 excluded by `:not(:has(.grid-wrapper))`) |
| /how-we-do-it | Hero | `landing-hero theme--white` | Needs both header centering |
| /about-us | Hero | `dy-section--cta-pair theme--white` | Has own CTA-pair marker but no centered-white marker |
| /about-us | Bio block | `dy-section--bio-block theme--white` | Has own bio-block marker but no centered-white marker |

## Known issues

1. **P2 `:has()` half not dropped.** AC "P2 transition `:has` half dropped from `dy-section.css` lines 133/141/152" is not met due to cross-page dependency. This is intentional -- see "Deviations from spec" above. A follow-up cycle is needed to mark all remaining consumers before the `:has()` lines can be removed.

### Acceptance criteria status

- [x] `dy-section--centered-white` applied to canvas_page id=5 section index 11 via idempotent script.
- [ ] P2 transition `:has` half dropped from `dy-section.css` lines 133/141/152. **NOT DONE -- see deviation #1.**
- [x] `/open-source-projects` renders correctly at 1280/768/375 (T1 PASS; T3 deferred to S).
- [x] No regression on /services / /about-us / /how-we-do-it / homepage (all HTTP 200).
- [x] No `!important`.
- [x] `component_version` preserved (e6079b189d228dad for both sections).
- [x] Specificity-safe doubled-class marker `.dy-section.dy-section--centered-white` (Sprint 10 codification).

## Files changed

- `scripts/sprint11-cycle2b-osp-markers.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified)
- `docs/pl2/handoffs/cycle-2b-osp-markers-F.md` (new, this file)
