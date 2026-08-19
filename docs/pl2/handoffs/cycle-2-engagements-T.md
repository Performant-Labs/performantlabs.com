# Handoff-T: Cycle 2 - Engagement Cards Preview Fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-2-engagements`
**Issue:** `docs/pl2/handoffs/cycle-2-engagements-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-engagements-F.md`

## Tier 1 results

### Cache-clear

| Command | Result |
|---|---|
| `ddev drush cr` | `[success] Cache rebuild complete.` — PASS |

### HTTP status

| URL | Command | Expected | Actual | Result |
|---|---|---|---|---|
| `/services` | `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/services' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `/` | `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `/articles` | `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/articles' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |

Note: `-k` flag required; ddev uses a locally-trusted cert that is not in the system trust store when accessed via curl with this OS/ddev configuration. Port 8493 is the correct HTTPS port per `ddev describe`.

### CSS variable / file presence

| File | Query-string seen | Result |
|---|---|---|
| `css/components/card.css` | `?tew14b` | PASS |
| `css/components/grid-wrapper.css` | `?tew14b` | PASS |

Query-strings differ from F's reported `?tew0rt`; this is expected — cache-busting suffix is regenerated on `drush cr`.

### Content strings — E2 eyebrow casing

| Expected | Found in `/services` HTML | Result |
|---|---|---|
| `01 / Takeover` | Yes | PASS |
| `02 / Embed` | Yes | PASS |
| `03 / Pilot` | Yes | PASS |
| `04 / a11y` (lowercase a, no case-fold) | Yes, exact | PASS |
| `TAKEOVER` / `EMBED` / `PILOT` absent | Zero matches | PASS |

### Content strings — E3 trailing periods

| Expected | Found in `/services` HTML | Result |
|---|---|---|
| `<h3 class="card__title">Test-suite takeover.</h3>` | Yes | PASS |
| `<h3 class="card__title">Embedded testing engineer.</h3>` | Yes | PASS |
| `<h3 class="card__title">Autonomous-healing pilot.</h3>` | Yes | PASS |
| `<h3 class="card__title">Accessibility testing.</h3>` | Yes | PASS |

## Tier 2 results

### Heading hierarchy

| Check | Method | Result |
|---|---|---|
| Single H1 | `grep -c '<h1'` on `/services` HTML | 1 H1 — PASS |
| H1 text | `grep -A2 '<h1'` | "Testing engagements for Drupal teams." — PASS |
| H2 section heads | Grep with context | "Four ways we engage.", "Senior testing capacity, when you need more hands.", "These aren't services we're spinning up...", "We Speak", "Not sure which shape fits?" — PASS |
| H3 card titles | Grep `card__title` | Four H3s with trailing periods as expected — PASS |
| No skipped levels (H1→H2→H3) | Full heading extraction | No gaps — PASS |
| Visually-hidden headings | grep for visually-hidden | Breadcrumb H2, nav H2, Footer H2 — all appropriately hidden, no hierarchy disruption — PASS |

### ARIA landmarks

| Landmark | Present | Result |
|---|---|---|
| `<header>` | `<header class="theme--white site-header">` | PASS |
| `<main>` | `<main class="site-main">` | PASS |
| `<footer>` | `<footer data-component-id="neonbyte:footer">` | PASS |
| `<nav>` (multiple) | Main menu nav + breadcrumb nav + footer nav | PASS |

### Semantic structure

| Check | Method | Result |
|---|---|---|
| Cards use `<article>` | Grep `<article.*card` | All 4 engagement cards are `<article>` elements — PASS |
| Cards have `id` for anchor linking | Grep article IDs | `id="test-suite-takeover"`, `id="embedded-testing-engineer"`, `id="autonomous-healing-pilot"`, `id="accessibility-testing"` — PASS |
| Navigation uses `<ul>/<li>` | `grep -c '<ul'` | 4 `<ul>` elements — PASS |
| SVG accessibility | Grep `aria-hidden` | Decorative SVGs (hamburger icon) marked `aria-hidden="true"` — PASS |
| No `!important` in card.css | Grep served CSS | 0 occurrences — PASS |
| No `!important` in grid-wrapper.css | Grep served CSS | 0 occurrences — PASS |
| `text-transform` removed (code lines only) | Strip comments, grep | 0 occurrences in executable CSS — PASS |
| `row-gap: 1.5rem` present | Grep served grid-wrapper.css | Present on `.grid-wrapper--2col .grid-wrapper__grid` — PASS |
| `--card-bottom-gap: 0` present | Grep served card.css | Present on `.card[class*="theme"] .card__bottom` — PASS |

### Spot-check / and /articles for regressions

| Check | Result |
|---|---|
| `grid-wrapper--2col` on `/` | 0 matches — no cross-page impact from E6 row-gap override — PASS |
| `grid-wrapper--2col` on `/articles` | 0 matches — no cross-page impact — PASS |
| Homepage card titles | "Tools the Drupal community uses", "Tests that heal themselves", "Experts alongside your team" — no regression — PASS |
| `/articles` renders articles | 6 `<article>` elements, H3 titles present — no regression — PASS |
| Homepage H1 count | 1 — PASS |
| `/articles` H1 count | 1 — PASS |

### Canvas component rendering (component_version deviation)

| Check | Result |
|---|---|
| All 4 `card-canvas` components render | 9 total canvas components rendered on page; all 4 engagement cards present with correct IDs — PASS |
| No OutOfRangeException in HTML | Zero matches for `OutOfRange`, `Exception`, `Error` in rendered HTML — PASS |
| Content from inputs JSON visible | Eyebrow and title text from patched inputs appear correctly in HTML — PASS |

## WCAG contrast verification

All contrasts computed against `#FFFFFF` (card surface = `--card-background: #FFFFFF` per F's L5 override on `.card.theme--light`).

| Element | Foreground | Background | F's ratio | T's ratio | Discrepancy | PASS/FAIL |
|---|---|---|---|---|---|---|
| Card body text | #5C544C | #FFFFFF | 7.43:1 | 7.43:1 | None | PASS (AA body ≥4.5:1) |
| Card title (H3) | #1F1A14 | #FFFFFF | 17.27:1 | 17.27:1 | None | PASS (AAA) |
| Eyebrow text | #8E4A2A | #FFFFFF | 6.64:1 | 6.64:1 | None | PASS (AA body ≥4.5:1) |
| Eyebrow accent line | #C97B5C | #FFFFFF | 3.25:1 | 3.25:1 | None | PASS (decorative, non-informational) |
| Card border | #E5E1DC | #FFFFFF | 1.30:1 | 1.30:1 | None | N/A (decorative) |
| Card hover border | #1893b4 | #FFFFFF | 3.58:1 | 3.58:1 | None | PASS (non-text UI ≥3:1) |

Color values sourced from `docs/pl2/briefs/pl_design_brief.md` and confirmed present in served CSS. No discrepancies between F's reported ratios and T's independently computed ratios.

Note: The CSS comment in card.css line 53 reports the card title ratio as 17.29:1; F's table reports 17.27:1; T's computation gives 17.27:1. The 17.29:1 in the comment is an older inline note and is not material — the actual ratio is 17.27:1 and passes AAA at any threshold.

## Mobile responsive verification

N/A — no responsive overrides introduced in this cycle. F confirmed no mobile-specific CSS was changed. The existing grid-wrapper.css responsive rules (container queries and media queries for `--2col` and `--3col`) were not modified. The E6 `row-gap: 1.5rem` applies at all viewports, which is consistent with the preview's `gap: var(--space-lg)` (no viewport-conditional override in the preview either). Card padding (48px) applies at all viewports consistent with the preview.

## Acceptance criteria status

| Criterion | Status | Evidence |
|---|---|---|
| § engagements at `/services` visually matches preview at 1280×800, 768×1024, 375×667 | PARTIAL — T does not perform visual diff (Tier 3); structural prerequisites all pass. S will perform pixel-level diff. | All structural and content checks PASS |
| Card surface: cream/canvas background + `--space-lg` inner padding (E1) | PARTIAL PASS — The card surface is white (`#FFFFFF`) via L5 override, matching the preview's `var(--canvas)` = `#FFFFFF`. Padding is 48px (`--space-2xl`), not `--space-lg` (24px) as the issue specifies. The preview uses `padding: var(--space-2xl)` = 48px. F correctly applied the preview value (preview wins on layout). Issue spec contradicts preview on this point. Flagged as accepted deviation. | `card.css` line 74: `padding: 3rem;` |
| Card grid row gap = `--space-xl` (48px) at 1280 (E6) | DEVIATION ACCEPTED — Actual row-gap is 24px (`--space-lg`), not 48px (`--space-xl`) as the issue specifies. The preview uses `gap: var(--space-lg)` = 24px. Confirmed in preview source: `.engagements__grid { gap: var(--space-lg); }`. F correctly applied the preview value. Issue spec contradicts preview. | `grid-wrapper.css` line 79: `row-gap: 1.5rem;`; Preview line 245: `gap: var(--space-lg);` |
| Eyebrow accent metric matches preview (E5) | PASS — `--card-bottom-gap: 0` zeroed; `margin-block-end: 1.5rem` (24px) on `.card__eyebrow-text` is the sole spacing mechanism. Matches preview's `margin-bottom: var(--space-lg)` = 24px. | `card.css` lines 75, 133 |
| All four card eyebrows use title case: "Takeover", "Embed", "Pilot", "a11y" (E2) | PASS — Confirmed in rendered HTML. `text-transform: uppercase` removed from CSS. `04 / a11y` lowercase preserved. | T1 content grep above |
| All four card H3s end with a trailing period (E3) | PASS — All four H3s confirmed with `.` in HTML. | T1 content grep above |
| N2 nearshore H2 content-cap (optional fold-in) | N/A — F deferred due to scope; no unique CSS identifier on nearshore section. Deferred to separate cycle per F's autonomous decision. | F handoff §Deviations item 4 |
| No `!important` introduced | PASS | Grep on both served CSS files: 0 occurrences |
| Tier 1 (HTTP 200, content grep) + Tier 2 (heading hierarchy, ARIA, semantic) PASS on `/services` | PASS | All Tier 1 and Tier 2 checks above |
| Tier 2 spot-check: `/` and `/articles` show no regressions | PASS — `grid-wrapper--2col` absent on both pages; card titles and article elements render correctly | T2 spot-check above |
| WCAG contrast: card body text on new cream/canvas surface ≥ 4.5:1 | PASS — 7.43:1 on #FFFFFF | WCAG table above |
| All Canvas patches set `component_version: NULL` | NOT MET — F left `component_version` unchanged to avoid `OutOfRangeException`. Canvas renders correctly with non-NULL version. This is a deviation from the issue spec, not a functional failure. | F handoff §Deviations item 3; rendered output verified correct |
| Files staged by explicit path; no `git add .` | NOT VERIFIABLE BY T — Files are unstaged (not yet committed). T notes the correct files are modified/untracked per `git status`. Git add mechanics are F's responsibility; T cannot observe how staging was performed. | `git status` shows expected files |
| F respects 6-file / one-component-family scope cap | PASS — 3 files modified (card.css, grid-wrapper.css, sprint-5-orchestrator-log.md) + 2 new untracked (cycle-2-engagements-F.md, sprint5-cycle2-engagement-content.php) + Canvas database entity. Total: 3 CSS/PHP files, well within cap. | `git status` |

## Blocking issues

None. All functional checks pass. The two issues below are spec deviations that have been independently verified to be correct per preview-wins-on-layout precedence:

1. **`component_version: NULL` not set** — The issue acceptance criterion says patches must set `component_version: NULL`. F documented that doing so causes an `OutOfRangeException` at render time. The rendered page is correct: all four cards display with the patched eyebrow and title content. This is a spec-vs-implementation reality conflict, not a functional regression. Canvas output is verified correct.

2. **E1 padding 48px vs issue's `--space-lg`** and **E6 row-gap 24px vs issue's `--space-xl`** — Both deviations are confirmed correct against the preview (the canonical source for layout decisions). The issue spec was inconsistent with the preview HTML. Deviations are documented and explained.

These deviations should be noted by S when performing visual verification. S's visual diff will confirm whether the rendered layout matches the preview at each viewport.

## Advisory notes

- The CSS comment at card.css line 53 cites the H3 contrast ratio as 17.29:1. F's table and T's computation both give 17.27:1. The discrepancy is in a code comment only and is not material.
- The `--space-xl` value in the preview token block is 32px (`--space-xl: 32px`). The issue's "~48px" measurement for the row gap likely included card internal padding in the visual measurement, as F noted. The correct gap per preview is 24px.
- `/articles` currently renders 6 articles (not "40+" as F reported). This is not a regression — it reflects the current article count in the database. No card/article structural issues found.
- N2 (nearshore H2 content-cap) remains deferred. No blocking impact on this cycle.

## Decision Logic

T complete, no blocking issues. Ready for S.
