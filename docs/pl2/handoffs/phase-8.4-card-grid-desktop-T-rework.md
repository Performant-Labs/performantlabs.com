# Handoff-T: Phase 8.4 Rework — Feature-card grid collapses to 1-col at 768 (match preview)

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.4-card-grid-desktop`
**Issue:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-rework-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-F-rework.md`
**Round-1 T reviewed:** `docs/pl2/handoffs/phase-8.4-card-grid-desktop-T.md`

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

**T1-3: New class `grid-wrapper--3col-stack-md` present in rendered HTML**

Command: `curl ... | grep -c 'grid-wrapper--3col-stack-md'`
Expected: >= 1
Actual: 1

Extracted class attribute: `class="grid-wrapper grid-wrapper--3col-stack-md"`
Full rendered element: `<div data-component-id="dripyard_base:grid-wrapper" class="grid-wrapper grid-wrapper--3col-stack-md">`
Result: PASS

**T1-4: Old class `grid-wrapper--3col` (without `-stack-md`) absent from homepage**

Command: `curl ... | grep -oE 'grid-wrapper--3col[^-]' | wc -l`
Expected: 0
Actual: 0

No `class="grid-wrapper grid-wrapper--3col"` (bare, non-stack-md variant) found anywhere in the homepage HTML. The only `grid-wrapper--3col` string present on the page is the substring inside `grid-wrapper--3col-stack-md`.
Result: PASS

**T1-5: Served `grid-wrapper.css` contains new `.grid-wrapper--3col-stack-md` rules**

CSS href confirmed in page source: `/themes/custom/performant_labs_20260502/css/components/grid-wrapper.css?tesem0`

Occurrences of `grid-wrapper--3col-stack-md` in served file: **5** (matches F's report).

Rules verified at each breakpoint:

| Breakpoint | Rule on `.grid-wrapper--3col-stack-md .grid-wrapper__grid` | Child reset |
|---|---|---|
| `@media (min-width: 992px)` | `grid-template-columns: repeat(3, 1fr)` | `grid-column: auto` |
| `@media (min-width: 768px) and (max-width: 991px)` | `grid-template-columns: 1fr` | `grid-column: auto` |
| `@media (max-width: 767px)` | `grid-template-columns: 1fr` | (none needed) |

Result: PASS

**T1-6: Served `grid-wrapper.css` still contains original `.grid-wrapper--3col` rules with 2-col at tablet**

Original `.grid-wrapper--3col` rules found at lines 116, 119, 126, 129, 138 of the served file.
The tablet breakpoint (`@media (min-width: 768px) and (max-width: 991px)`) for `.grid-wrapper--3col` reads `grid-template-columns: repeat(2, 1fr)` — unchanged from round 1.

Result: PASS

**T1-7: Rendered content strings**

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

Extracted headings from live page:

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
No skipped levels: YES (H1 -> H2 -> H3 throughout).
Feature-card H3s correctly nested under the "Tools, AI, and experts." H2.
Identical to round-1 T result — structural heading hierarchy unchanged by the rework.
Result: PASS

**T2-2: ARIA landmarks**

Command: `curl ... | grep -oE '<(header|main|footer|nav)[^>]*>'`

Found:
- `<header class="theme--white site-header" data-component-id="neonbyte:header">`
- `<nav id="block-performant-labs-20260502-main-menu" ...>`
- `<main class="site-main">`
- `<footer data-component-id="neonbyte:footer" class="site-footer theme--white">`
- `<nav id="block-performant-labs-20260502-footer" ...>`

All four required landmarks present (header, main, footer, nav). Two navs is correct (site-header + footer).
Result: PASS

**T2-3: SDC component registered**

Command: `ddev drush eval '$registry = \Drupal::service("plugin.manager.sdc"); $definition = $registry->getDefinition("dripyard_base:grid-wrapper"); echo "Plugin ID: " . $definition["id"] . "\n";'`
Output: `Plugin ID: dripyard_base:grid-wrapper`

Additionally confirmed: `data-component-id="dripyard_base:grid-wrapper"` renders in homepage HTML with count = 1.
Result: PASS

**T2-4: Semantic structure of card grid**

Card titles render as `<h3 class="card__title">` (confirmed via heading hierarchy extraction). Three H3s present under the correct H2. Card chrome (eyebrow kickers, H3 titles) intact. No structural semantic regressions from the class swap.
Result: PASS

---

## Drush verification of the Canvas DB change

**canvas_page__components (entity_id=20, delta=18):**

```
Query: SELECT delta, components_inputs, components_component_version
       FROM canvas_page__components
       WHERE entity_id = 20 AND delta = 18

Result:
  delta                        => 18
  components_inputs            => {"column_gutter":"large","row_gutter":"medium","additional_classes":"grid-wrapper--3col-stack-md"}
  components_component_version => ba954a2accbc0f5c
```

`additional_classes` is `"grid-wrapper--3col-stack-md"` (round-2 value). Round-1 value `"grid-wrapper--3col"` is absent. PASS.

**canvas_page_revision__components (entity_id=20, delta=18, latest revision):**

```
Query: SELECT delta, components_inputs, components_component_version
       FROM canvas_page_revision__components
       WHERE entity_id = 20 AND delta = 18
       ORDER BY revision_id DESC LIMIT 1

Result:
  delta                        => 18
  components_inputs            => {"column_gutter":"large","row_gutter":"medium","additional_classes":"grid-wrapper--3col-stack-md"}
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
      additional_classes: grid-wrapper--3col-stack-md
```

`additional_classes: grid-wrapper--3col-stack-md` present. Matches DB value. PASS.

---

## Regression check: open-source-projects and how-we-do-it

**Objective:** confirm the original `.grid-wrapper--3col` class is still applied on the other consumer pages (proving F's path-2 choice did not break their 2-col-at-tablet behavior).

| Page | `grid-wrapper--3col` present | `-stack-md` present | Result |
|---|---|---|---|
| `/open-source-projects` | 2 occurrences (`class="grid-wrapper grid-wrapper--3col"`) | 0 | PASS |
| `/how-we-do-it` | 1 occurrence (`class="grid-wrapper grid-wrapper--3col"`) | 0 | PASS |

Neither page renders `grid-wrapper--3col-stack-md`. Both still use the original `--3col` class and will therefore still receive the `repeat(2, 1fr)` tablet rule from the unchanged `--3col` block.
Result: PASS

---

## Regression check vs Phase 8.2

**8.2 Fix 1: `.hero.theme--white { padding-inline: 0 }` (768px horizontal overflow)**

File: `/web/themes/custom/performant_labs_20260502/css/components/hero.css`
Check: `grep -n 'padding-inline.*0'`
Result: Line 75 — `padding-inline: 0;` present inside the `.hero.theme--white` rule block.
Result: PASS

**8.2 Fix 2: Logo-grid `flex-wrap: nowrap` at `min-width: 992px`**

File: `/web/themes/custom/performant_labs_20260502/css/components/logo-grid.css`
Check: `grep -n 'min-width.*992px\|nowrap'`
Result: Lines 112–114:
```css
@media (min-width: 992px) {
  .logo-grid__content {
    flex-wrap: nowrap;
```
Present. PASS.

The rework's `git diff main -- '*.css'` shows additions only (no deletions) to `grid-wrapper.css`; `hero.css` and `logo-grid.css` are untouched. Both 8.2 rules verified present.
Result: PASS

---

## WCAG contrast verification

No surface-color or text-color changes in this rework. The diff confirms the change is purely additive: new `.grid-wrapper--3col-stack-md` rules appended to `grid-wrapper.css` (no existing rules edited or deleted), and a class-name string swap in the overlay YAML and Canvas DB.

`git diff main -- '*.css'` output: additions only to `grid-wrapper.css`. No `color`, `background`, `border-color`, or opacity properties in the diff. The only other modified file (`config/sync/views.view.articles.yml`) is a pre-existing unrelated working-tree change.

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| No color changes in this phase | — | — | N/A | N/A | N/A |

Contrast verification is not applicable to this phase.

---

## Mobile responsive verification

F-rework reports new responsive overrides for the new modifier class. Verified against CSS breakpoints directly in the served file:

| Breakpoint | CSS rule confirmed in served stylesheet | Expected behavior | Match |
|---|---|---|---|
| `@media (min-width: 992px)` | `.grid-wrapper--3col-stack-md .grid-wrapper__grid { grid-template-columns: repeat(3, 1fr); }` + child `grid-column: auto` | 3 cards per row at desktop | YES |
| `@media (min-width: 768px) and (max-width: 991px)` | `.grid-wrapper--3col-stack-md .grid-wrapper__grid { grid-template-columns: 1fr; }` + child `grid-column: auto` | 1-col stack at tablet (rework change) | YES |
| `@media (max-width: 767px)` | `.grid-wrapper--3col-stack-md .grid-wrapper__grid { grid-template-columns: 1fr; }` | 1 card per row at mobile | YES |

Breakpoints match the project standard (992/768/767 boundaries). No horizontal overflow rules modified. Touch targets unchanged (cards are full-width block links; no new interactive elements added).

F-rework's Playwright measurements at 1280 (3-col), 768 (1-col stack), and 375 (1-col stack) are Tier 3 / visual — deferred to S for pixel-level diff against the preview. The CSS rules that would produce those layouts are confirmed present in the served stylesheet.

---

## Acceptance criteria status

From `docs/pl2/handoffs/phase-8.4-card-grid-desktop-rework-issue.md`:

| # | Criterion | Evidence | Result |
|---|---|---|---|
| 1 | Step-3 trace + path-1-vs-path-2 decision surfaced in the rework handoff before any CSS / Canvas change is made. | F-rework handoff §"Layer decisions" documents `rg "grid-wrapper--3col"` output (3 consumers found), path-2 decision, bottom-up trace, and top-down eligibility pass — all before the CSS change. | PASS |
| 2 | Live homepage at 768 renders three feature cards in a 1-column stack. | CSS rule confirmed: `.grid-wrapper--3col-stack-md` at 768-991px → `grid-template-columns: 1fr`. Class `grid-wrapper--3col-stack-md` renders in homepage HTML. F-rework Playwright at 768: `grid-template-columns: 692.75px` (1-col), three cards at distinct `top` values, same `left=30`. | PASS |
| 3 | Live homepage at 1280 still renders 3-col single row (no regression). | CSS rule confirmed: `.grid-wrapper--3col-stack-md` at >=992px → `grid-template-columns: repeat(3, 1fr)`. F-rework Playwright at 1280: 345.266px x 3 columns, all cards at `top=1724`. | PASS |
| 4 | Live homepage at 375 still renders 1-col stack (no regression). | CSS rule confirmed: `.grid-wrapper--3col-stack-md` at <768px → `grid-template-columns: 1fr`. F-rework Playwright at 375: full-width cards at distinct top values, `scrollWidth=360 < viewport=375`. | PASS |
| 5 | Other consumers of `.grid-wrapper--3col` remain unchanged. If path 2 taken, homepage Canvas updated to new modifier; original `--3col` rules unchanged. | `git diff main` shows no deletions or edits to the existing `--3col` block (lines 114–141 of `grid-wrapper.css`). `/open-source-projects` renders `class="grid-wrapper grid-wrapper--3col"` x 2; `/how-we-do-it` renders it x 1. Neither page has `grid-wrapper--3col-stack-md`. Canvas DB and overlay YAML updated to `grid-wrapper--3col-stack-md` for homepage only. | PASS |
| 6 | No horizontal overflow at any of 1280 / 768 / 375 (8.2 fixes must not regress). | F-rework Playwright: `scrollWidth < viewport` at all three breakpoints (1265<1280, 753<768, 360<375). Phase 8.2 `hero.css` line 75 (`padding-inline: 0`) and `logo-grid.css` lines 112-114 (`flex-wrap: nowrap`) both confirmed present in filesystem. | PASS |
| 7 | No `!important`. Files staged by explicit path. `component_version` retention rule from round 1 still applies. | `grep '!important'` returns zero matches in `grid-wrapper.css` and the overlay YAML. Canvas `component_version` = `ba954a2accbc0f5c` (retained, not NULL) — consistent with the round-1 advisory note that Canvas requires this exact hash. | PASS |

**All 7 acceptance criteria: PASS.**

---

## Blocking issues

None.

---

## Advisory notes

**Brief-vs-preview contradiction (carry-forward from F-rework).** The design brief at `pl_design_brief.md` §"Responsive behavior" specifies feature cards as 2-col at md (768-991px). The live homepage now renders 1-col at 768 per the operator's directive (preview is canonical). The brief has not been updated. Recommend a dedicated documentation cycle to align the brief with the operator's decision before future work references the brief for the feature-card section.

**`component_version` retention (carry-forward from round 1).** Canvas DB retains `components_component_version: ba954a2accbc0f5c`. This is intentional — Canvas throws `OutOfRangeException` when the version is NULL. The "set to NULL on Canvas touch" protocol does not apply here. Noted for operator awareness; not a blocking issue.

**`views.view.articles.yml` working-tree modification.** This file appears in `git diff main` but is unrelated to this phase (pre-existing modification, not part of the rework scope). S should be aware it will appear in any diff output but does not affect the homepage feature-card grid.
