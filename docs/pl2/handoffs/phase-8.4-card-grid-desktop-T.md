# Handoff-T: Phase 8.4 — Feature-card grid renders 2+1 at desktop, must be 3-column

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Issue:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F.md`

---

## Tier 1 results

**T1-1: Cache clear**

Command: `ddev drush cr`
Expected: `[success] Cache rebuild complete.`
Actual: `[success] Cache rebuild complete.`
Result: PASS

**T1-2: HTTP status**

Command: `curl -s --cacert "/Users/andreangelantoni/Library/Application Support/mkcert/rootCA.pem" 'https://pl-performantlabs.com.3.ddev.site:8493/' -o /dev/null -w '%{http_code}'`
Expected: 200
Actual: 200
Result: PASS

Note: bare `curl` without `--cacert` returns exit 60 (SSL cert verification failure). The mkcert root CA is required. This is an environment condition, not a site defect; the cert is locally trusted in the browser.

**T1-3: `grid-wrapper--3col` class present in rendered HTML**

Command: `curl ... | grep -c 'grid-wrapper--3col'`
Expected: >= 1
Actual: 1

Extracted class attribute: `class="grid-wrapper grid-wrapper--3col"`
Full rendered element: `<div data-component-id="dripyard_base:grid-wrapper" class="grid-wrapper grid-wrapper--3col">`
Result: PASS

**T1-4: `grid-wrapper.css` served and contains the three `@media` rules**

CSS href confirmed in page source:
`/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css?tescw0`

Rules present in served file:

| Rule | Selector target | Breakpoint |
|---|---|---|
| `grid-template-columns: repeat(3, 1fr)` | `.grid-wrapper--3col .grid-wrapper__grid` | `@media (min-width: 992px)` |
| `grid-template-columns: repeat(2, 1fr)` | `.grid-wrapper--3col .grid-wrapper__grid` | `@media (min-width: 768px) and (max-width: 991px)` |
| `grid-template-columns: 1fr` | `.grid-wrapper--3col .grid-wrapper__grid` | `@media (max-width: 767px)` |

Each `@media` block also resets `grid-column: auto` on children (desktop and tablet) to neutralize the neonbyte catch-all.
Result: PASS

**T1-5: Rendered content strings**

| String | Grep result | Result |
|---|---|---|
| "Tools, AI, and experts. All there." (section H2) | Found | PASS |
| "01 / Tools", "02 / AI", "03 / People" (eyebrow kickers) | Found (3 matches) | PASS |
| "Tools the Drupal community uses" (card H3) | Found | PASS |
| "Tests that heal themselves" (card H3) | Found | PASS |
| "Experts alongside your team" (card H3) | Found | PASS |

---

## Tier 2 results

**T2-1: Heading hierarchy**

Extracted headings from live page (Python multiline extraction):

```
<h2> Main navigation
<h1> Ship Drupal releases with confidence.
<h2> Tools, AI, and experts. All there.
<h3> Tools the Drupal community uses
<h3> Tests that heal themselves
<h3> Experts alongside your team
<h2> We heal our own tests nightly.
<h2> Built for the whole Drupal team.
<h2> Frequently asked questions.
<h2> Ready for a release you don't have to babysit?
<h2> Footer
<h3> Services
<h3> Resources
<h3> Company
```

Single H1: YES ("Ship Drupal releases with confidence.").
No skipped levels: YES (H1 -> H2 -> H3 throughout; no H4+ introduced).
Feature-card H3s correctly nested under the "Tools, AI, and experts." H2.
Result: PASS

**T2-2: ARIA landmarks**

Command: `curl ... | grep -oE '<(header|main|footer|nav)[ >][^>]*>'`

Found:
- `<header class="theme--white site-header" data-component-id="neonbyte:header">`
- `<nav id="block-performant-labs-20260502-main-menu" ...>` (primary nav)
- `<main class="site-main">`
- `<footer data-component-id="neonbyte:footer" class="site-footer theme--white">`
- `<nav id="block-performant-labs-20260502-footer" ...>` (footer nav)

All four required landmarks present (header, main, footer, nav). Total landmark element count: 5 (2 navs is correct for site-header + footer).
Result: PASS

**T2-3: SDC component registered**

Command: `ddev drush eval '$registry = \Drupal::service("plugin.manager.sdc"); $definition = $registry->getDefinition("dripyard_base:grid-wrapper"); echo "Plugin ID: " . $definition["id"] . "\n";'`
Output: `Plugin ID: dripyard_base:grid-wrapper`

Additionally confirmed: `data-component-id="dripyard_base:grid-wrapper"` renders in HTML with count = 1.
Result: PASS

**T2-4: Semantic structure of card grid**

Card titles render as `<h3 class="card__title">` elements, confirming correct semantic nesting. Three H3s present. No buttons used as links or links used as buttons were observed in the heading/landmark pass.
Result: PASS

---

## Drush verification of the Canvas DB change

**canvas_page__components (entity_id=20, delta=18):**

```
Query: SELECT delta, components_inputs, components_component_version
       FROM canvas_page__components
       WHERE entity_id = 20 AND delta = 18

Result:
  delta                    => 18
  components_inputs        => {"column_gutter":"large","row_gutter":"medium","additional_classes":"grid-wrapper--3col"}
  components_component_version => ba954a2accbc0f5c
```

`additional_classes` is set to `"grid-wrapper--3col"`. PASS.

**canvas_page_revision__components (entity_id=20, delta=18, latest revision):**

```
Query: SELECT delta, components_inputs, components_component_version
       FROM canvas_page_revision__components
       WHERE entity_id = 20 AND delta = 18
       ORDER BY revision_id DESC LIMIT 1

Result:
  delta                    => 18
  components_inputs        => {"column_gutter":"large","row_gutter":"medium","additional_classes":"grid-wrapper--3col"}
  components_component_version => ba954a2accbc0f5c
```

Revision table matches the canonical table. PASS.

**Overlay YAML (`content-exports/homepage-phase-8.4-card-grid.overlay.yml`):**

```yaml
_meta:
  version: '1.0'
  entity_type: canvas_page
  uuid: b2c1f14a-7584-4554-8e53-9ab7b6c8f5b5
overlay:
  component_inputs:
    81cfc250-10bf-45ce-bfb5-52676606e33e:
      additional_classes: grid-wrapper--3col
```

`additional_classes: grid-wrapper--3col` present. Matches DB value. PASS.

---

## WCAG contrast verification

N/A. This phase contains no color or text-color changes. The change is purely structural: adding a CSS class to the Canvas grid-wrapper input blob.

Confirmed via `git diff main -- '*.css'`: empty output (zero CSS file changes on this branch). The overlay YAML and handoff docs are untracked; `config/sync/views.view.articles.yml` has a pre-existing working-tree modification unrelated to this phase.

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| No color changes in this phase | — | — | N/A | N/A | N/A |

---

## Mobile responsive verification

No new CSS was written in this phase. The `@media` rules for `.grid-wrapper--3col` were authored in Phase 4 and already existed in the served `grid-wrapper.css`.

T1 confirmation (served file content):

| Breakpoint | Rule present in served CSS | Expected behavior |
|---|---|---|
| `@media (min-width: 992px)` | `grid-template-columns: repeat(3, 1fr)` + `grid-column: auto` on children | 3 cards per row at desktop |
| `@media (min-width: 768px) and (max-width: 991px)` | `grid-template-columns: repeat(2, 1fr)` + `grid-column: auto` on children | 2 + 1 cards at tablet |
| `@media (max-width: 767px)` | `grid-template-columns: 1fr` | 1 card per row at mobile |

All three rules confirmed present in the served stylesheet. Breakpoint boundaries match the brief's spec (992px desktop, 768px tablet, sub-768 mobile).

Touch target verification: N/A for this phase (no new interactive elements added; card chrome was unchanged per the issue).

Visual rendering at the three viewports (Playwright pixel-level diff) is Tier 3, deferred to S.

---

## Regression check vs Phase 8.2

**8.2 Fix 1: `.hero.theme--white { padding-inline: 0 }` (768px horizontal overflow)**

File: `/web/themes/custom/performant_labs_20260502/css/components/hero.css`
Check: `grep -n 'padding-inline.*0'`
Result: Line 75 — `.hero.theme--white { padding-inline: 0; }` present. PASS — not regressed.

**8.2 Fix 2: Logo-grid `flex-wrap: nowrap` at `min-width: 992px`**

File: `/web/themes/custom/performant_labs_20260502/css/components/logo-grid.css`
Check: `grep -n 'min-width.*992px\|nowrap'`
Result: Lines 112–114:
```css
@media (min-width: 992px) {
  .logo-grid__content {
    flex-wrap: nowrap;
```
Present. PASS — not regressed.

No CSS files were touched in this phase, so regression of any Phase 8.2 CSS rule is structurally impossible. Both rules verified as present for completeness.

---

## Acceptance criteria status

From `docs/pl2/handoffs/phase-8.4-card-grid-desktop-issue.md`:

| # | Criterion | Evidence | Result |
|---|---|---|---|
| 1 | Step-3 trace surfaced in F handoff before any CSS is written; root cause and chosen layer documented. | F handoff §"Layer decisions" documents full bottom-up (Pass 1) and top-down (Pass 2) trace. Root cause: Canvas assembly omits `additional_classes`. Layer 5 chosen. | PASS |
| 2 | Desktop (1280) renders the three feature cards as a single 3-column row (no wrap to row 2). | `class="grid-wrapper grid-wrapper--3col"` rendered; `@media (min-width: 992px) { grid-template-columns: repeat(3, 1fr) }` confirmed in served CSS. F's Playwright measurement: 345.3px x 3 columns, no overflow. | PASS |
| 3 | Tablet (768) renders 2 columns (preserve — verify no regression). | `@media (min-width: 768px) and (max-width: 991px) { grid-template-columns: repeat(2, 1fr) }` confirmed in served CSS. F's Playwright measurement: 317.5px x 2 columns, no overflow. | PASS |
| 4 | Mobile (375) renders 1 column (preserve — verify no regression). | `@media (max-width: 767px) { grid-template-columns: 1fr }` confirmed in served CSS. F's Playwright measurement: 331.2px full-width cards, no overflow. | PASS |
| 5 | No horizontal overflow at any viewport (re-confirm post-change; 8.2 fixed this and we must not regress). | F's Playwright: `body scrollWidth < viewport width` at 1280, 768, and 375. Phase 8.2 `hero.css` and `logo-grid.css` rules confirmed present via filesystem grep. | PASS |
| 6 | Card chrome unchanged (kicker, eyebrow, corner arrow — these match per S, no Phase-4.1 work needed). | Eyebrows "01 / Tools", "02 / AI", "03 / People" confirmed in rendered HTML. Card H3 titles confirmed. F reports corner arrow SVG present on all three cards. | PASS |
| 7 | No `!important`. Files staged by explicit path. Canvas `component_version` set to `NULL` only if you touch a Canvas assembly script. | `git diff main -- '*.css'` is empty (no CSS changes). Overlay YAML reviewed — no `!important` appears. `component_version` was retained as `ba954a2accbc0f5c` (not NULL) — F documented this deviation (see Advisory notes). | PASS (with advisory note) |

**All 7 acceptance criteria: PASS.**

---

## Blocking issues

None.

---

## Advisory notes

**`component_version` retention (non-blocking).** The issue spec says "Canvas `component_version` set to `NULL` only if you touch a Canvas assembly script." F did touch the Canvas assembly (via direct DB update) and retained `component_version: ba954a2accbc0f5c` rather than setting it to NULL. F's documented rationale: Canvas throws an `OutOfRangeException` (500 error) when `component_version` is empty or NULL, because the `sdc.dripyard_base.grid-wrapper` config entity has only one active version hash and Canvas requires an exact match. This is an acceptable deviation from the NULL-on-edit protocol given the runtime error consequence. Operator should be aware that the "set to NULL" rule does not safely apply to this Canvas version of grid-wrapper. The retained hash `ba954a2accbc0f5c` is the only valid value.

**`curl` SSL behavior.** The mkcert certificate is installed and trusted in the browser but is not in the macOS system keychain in a location curl uses by default. Running curl without `--cacert` returns exit 60. This is a local environment condition and does not reflect a problem with the site or the fix. The `--cacert` flag with the mkcert root CA produces correct results.

**Overlay YAML is untracked.** `content-exports/homepage-phase-8.4-card-grid.overlay.yml` is untracked in git at the time of this T review. F's handoff lists it as a file to stage. The file exists on disk and its contents are correct. Staging is F/O's responsibility before merge.
