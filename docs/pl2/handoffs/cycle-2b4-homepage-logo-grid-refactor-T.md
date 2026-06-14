# Handoff-T: Cycle 2b.4 - Homepage logo-grid selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid`
**Issue:** `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b4-homepage-logo-grid-refactor-F.md`

## Tier 1 results

### Cache clear

Command: `ddev drush cr`
Expected: success
Actual: `[success] Cache rebuild complete.`
Result: PASS

### HTTP status — all 5 pages

Command: `/Users/andreangelantoni/anaconda3/bin/curl -sk https://pl-performantlabs.com.3.ddev.site:8493{path} -o /dev/null -w '%{http_code}'`

| Page | Expected | Actual | Result |
|---|---|---|---|
| / | 200 | 200 | PASS |
| /services | 200 | 200 | PASS |
| /about-us | 200 | 200 | PASS |
| /how-we-do-it | 200 | 200 | PASS |
| /open-source-projects | 200 | 200 | PASS |

### Marker presence in rendered HTML

Command: `grep -c 'dy-section--logo-grid' /tmp/pl2_homepage.html`

| Marker | Expected count | Actual count | Result |
|---|---|---|---|
| `dy-section--logo-grid` | 1 | 1 | PASS |
| `dy-section--post-hero-logos` | 1 | 1 | PASS |

Full class attribute of the marked element (grep from live HTML):

```
class="dy-section dy-section--logo-grid dy-section--post-hero-logos theme--white container dy-section--section-max-width margin-top--0 margin-bottom--0 padding-top--m padding-bottom--m"
```

Both markers are present. Both co-exist on the single logo-strip section. Result: PASS

### Markers absent on non-homepage pages

Command: `grep -c 'dy-section--logo-grid' /tmp/sz_{page}.html`

| Page | `dy-section--logo-grid` | `dy-section--post-hero-logos` | Result |
|---|---|---|---|
| /services | 0 | 0 | PASS |
| /about-us | 0 | 0 | PASS |
| /how-we-do-it | 0 | 0 | PASS |
| /open-source-projects | 0 | 0 | PASS |

### CSS selectors in served stylesheet

Custom theme logo-grid CSS URL confirmed in page source:
`/themes/custom/performant_labs_20260502/css/components/logo-grid.css?texixb`

Active (non-comment) rule lines confirmed in served CSS:

| Selector | Present | Result |
|---|---|---|
| `.dy-section.dy-section--logo-grid .dy-section__header > *` | Yes (line 233) | PASS |
| `.dy-section.dy-section--post-hero-logos` | Yes (line 270) | PASS |
| `.dy-section.dy-section--post-hero-logos .dy-section__header` | Yes (line 274) | PASS |

### No active `:has(.logo-grid)` selectors

Command: `grep ':has' /tmp/pl2_logo-grid-served.css`

All 4 occurrences are inside `/* */` comment blocks. Zero active `:has()` rules in served CSS.
Result: PASS

### No active sibling combinator `+`

Command: `grep 'hero.*+\|+ .dy-section' /tmp/pl2_logo-grid-served.css`

All occurrences of `+` are inside `/* */` comment blocks. Zero active sibling-combinator rules in served CSS.
Result: PASS

### No `!important`

Command: `grep '!important' /tmp/pl2_logo-grid-served.css`

Single occurrence is inside a comment: `* .logo-grid--size-medium (0,1,0) without !important. */`
Zero active `!important` declarations.
Result: PASS

### Page size regression check

F's pre-change baseline vs T's current measurements:

| Page | F pre-change | F post-change | T current | Delta vs F post | Result |
|---|---|---|---|---|---|
| / | 82624 | 82624 | 82620 | -4 (cache variance) | PASS |
| /services | 59829 | 59833 | 59829 | -4 (cache variance) | PASS |
| /about-us | 57918 | 57918 | 57918 | 0 | PASS |
| /how-we-do-it | 60292 | 60288 | 60292 | +4 (cache variance) | PASS |
| /open-source-projects | 68121 | 68119 | 68119 | 0 | PASS |

All deltas are within ±4 bytes, consistent with cache variance observed across prior cycles. No regression.

## Tier 2 results

### component_version preserved

Method: `ddev drush php:eval` — read `canvas_page` id=20, component index `[6]`, top-level `component_version` key.

| Field | Expected | Actual | Result |
|---|---|---|---|
| UUID | `d239b0c9-79a6-46c5-a8f4-e7c6279491e3` | `d239b0c9-79a6-46c5-a8f4-e7c6279491e3` | PASS |
| `component_version` | `e6079b189d228dad` | `e6079b189d228dad` | PASS |
| `additional_classes` | `dy-section--logo-grid dy-section--post-hero-logos` | `dy-section--logo-grid dy-section--post-hero-logos` | PASS |

Note: `component_version` is stored at the top-level component key, not inside the `inputs` JSON blob. The marker script does not write to the top-level key, so preservation is confirmed by reading it directly from the entity.

### Heading hierarchy

Method: `grep -oP '<h[1-6][^>]*>' /tmp/pl2_homepage.html | grep -oP '<h[1-6]' | sort | uniq -c`

| Level | Count | Notes |
|---|---|---|
| h1 | 1 | Single H1. PASS |
| h2 | 7 | No level skipped. PASS |
| h3 | 6 | Sequential from h2. PASS |

No skipped levels (h1 -> h2 -> h3). Single H1 on page. Result: PASS

### ARIA landmarks

Method: `grep -c '<{landmark}' /tmp/pl2_homepage.html`

| Landmark | Expected | Count | Result |
|---|---|---|---|
| `<header` | >=1 | 1 | PASS |
| `<main` | >=1 | 1 | PASS |
| `<footer` | >=1 | 1 | PASS |
| `<nav` | >=1 | 2 | PASS |

### logo-grid component absent on non-homepage pages

Method: `grep -c 'logo-grid' /tmp/sz_{page}.html`

All four non-homepage pages return 0 occurrences of `logo-grid` in HTML. F's cross-page reach check is confirmed: these selectors were and remain homepage-only.
Result: PASS

### Media queries in served CSS

Method: `grep '@media' /tmp/pl2_logo-grid-served.css`

| Rule | Present | Result |
|---|---|---|
| `@media (min-width: 992px)` | Yes | PASS |
| `@media (min-width: 577px) and (max-width: 991px)` | Yes | PASS |
| `@media (max-width: 576px)` | Yes | PASS |

Pre-existing responsive rules are intact in the served file.

## WCAG contrast verification

No color changes were made in this cycle. The only color-bearing declaration in the modified block is `color: var(--theme-text-color-medium)` on the "We Speak" label, carried forward unchanged from prior phases.

Token resolution: `--theme-text-color-medium: #5C544C` (from `base.css`, white-surface context). Background: `#FFFFFF` (theme--white section).

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| "We Speak" label (`.dy-section__header > *`) | `#5C544C` | `#FFFFFF` | 7.43:1 | 7.43:1 | PASS |

T's computation method: WCAG 2.1 relative luminance formula (sRGB linearization, IEC 61966-2-1). No discrepancy from F's reported ratio.

WCAG AA body text threshold (4.5:1): met at 7.43:1. WCAG AA large text threshold (3.0:1): met.

## Mobile responsive verification

N/A — no responsive overrides were written in this cycle. F correctly noted the marker classes are structural identifiers only. The three rewritten selectors (`logo-grid.css` lines 233, 270, 274) apply at all viewports, identical to the prior `:has()`-based selectors they replaced. The pre-existing mobile/tablet/desktop media query blocks (lines 162–208) are untouched.

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| Marker(s) on the homepage logo-strip section | `dy-section--logo-grid dy-section--post-hero-logos` confirmed in DOM via grep on live HTML | PASS |
| `logo-grid.css` rules rewritten as marker-based | 3 active selectors in served CSS use `.dy-section.dy-section--logo-grid` / `.dy-section.dy-section--post-hero-logos`; no `:has()` or `+` active rules remain | PASS |
| Homepage AE = 0 at 1280/768/375 | Visual diff is S's responsibility; T confirms no structural regressions — markers present, selectors correct, HTML intact. No Tier 1/2 evidence of layout breakage. | DEFERRED TO S |
| No regression on /services, /about-us, /how-we-do-it, /open-source-projects | All return HTTP 200; no logo-grid component in HTML; page sizes within ±4 bytes of F baseline | PASS |
| No `!important` | Confirmed zero active `!important` in served CSS | PASS |
| `component_version` preserved | `e6079b189d228dad` confirmed at top-level component key for canvas_page id=20 component [6] | PASS |
| T1 + T2 PASS | All T1 and T2 checks passed; see above | PASS |

## Blocking issues

None. All T1 and T2 checks pass.

## Advisory notes

- The `component_version` field is stored at the top level of the component array (not inside the `inputs` JSON blob). F's handoff described it as `[6] ver=e6079b189d228dad` which matches. The marker script correctly writes only to `inputs['additional_classes']` and leaves the top-level key untouched — this is the correct approach.
- Page size for `/` is 82620 bytes at T's fetch vs F's post-change 82624. The 4-byte difference is within the cache variance range documented by F (±4 bytes) and is not a regression signal.
- The "Homepage AE = 0 at 1280/768/375" criterion is a pixel-level visual diff requirement that falls within S's Tier 3 scope. T's structural checks confirm no DOM or CSS evidence of regression, but the visual diff itself is S's gate.

T complete, no blocking issues. Ready for S.
