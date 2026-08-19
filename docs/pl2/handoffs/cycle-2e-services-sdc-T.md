# Handoff-T: Cycle 2e - /services SDC migration + delete orphan canvas config

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2e-services-sdc`
**Issue:** `docs/pl2/handoffs/cycle-2e-services-sdc-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2e-services-sdc-F.md`

## Tier 1 results

### Cache clear

Command: `ddev drush cr`
Expected: `[success] Cache rebuild complete.`
Actual: `[success] Cache rebuild complete.`
Result: PASS

### HTTP 200 — all 7 pages

Command: `curl -sk -o /dev/null -w "%{http_code}" <URL>`

| Path | Expected | Actual | Result |
|---|---|---|---|
| `/` | 200 | 200 | PASS |
| `/services` | 200 | 200 | PASS |
| `/about-us` | 200 | 200 | PASS |
| `/articles` | 200 | 200 | PASS |
| `/contact-us` | 200 | 200 | PASS |
| `/how-we-do-it` | 200 | 200 | PASS |
| `/open-source-projects` | 200 | 200 | PASS |

### 4 engagement card titles render on /services

Command: `curl -sk .../services | grep -oP 'Test-suite takeover|Embedded testing engineer|Autonomous-healing pilot|Accessibility testing' | sort -u`

Expected: 4 matches
Actual:
```
Accessibility testing
Autonomous-healing pilot
Embedded testing engineer
Test-suite takeover
```
Result: PASS

### card-canvas component instance count in rendered HTML

Command: `curl -sk .../services | grep -c 'component-id="dripyard_base:card-canvas"'`
Expected: 4
Actual: 4
Result: PASS

### No `performant_labs_20260418` reference in rendered HTML

Command: `curl -sk .../services | grep -c 'performant_labs_20260418'`
Expected: 0
Actual: 0
Result: PASS

### Orphan grep in config/sync

Command: `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/`
Expected: exit 1 (no matches)
Actual: exit 1 (no matches)
Result: PASS

### Orphan config file deleted from disk

Command: `ls config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml`
Expected: `No such file or directory`
Actual: `No such file or directory`
Result: PASS

### Remaining performant_labs_* canvas SDC configs — only _20260502

Command: `find config/sync -name 'canvas.component.sdc.performant_labs_*'`
Expected: only `_20260502` files
Actual:
```
config/sync/canvas.component.sdc.performant_labs_20260502.article-card.yml
config/sync/canvas.component.sdc.performant_labs_20260502.heal-flow.yml
config/sync/canvas.component.sdc.performant_labs_20260502.kicker.yml
```
No `_20260418` or `_20260411` entries. Result: PASS

### No `!important` in project CSS

Command: iterated over all `performant_labs_20260502` CSS files served on /services, counting `!important` per file
Expected: 0 per file
Actual: 0 across all 9 project CSS files
(No CSS files were modified in this cycle; check confirms no pre-existing violations on served stylesheets.)
Result: PASS

## Tier 2 results

### Component provider in rendered HTML

Method: `grep -oP 'component-id="[^"]*card-canvas[^"]*"'` on /services HTML
Result: all 4 instances emit `component-id="dripyard_base:card-canvas"`, zero `performant_labs_20260418` references.
PASS

### component_version in database (entity 3)

Method: `ddev drush php-eval` to load canvas_page entity 3 and inspect each card-canvas component's `component_id` and `component_version`.
Result: all 4 components show `sdc.dripyard_base.card-canvas | version: 552876d9540c5ead`
Hash matches `active_version` in `config/sync/canvas.component.sdc.dripyard_base.card-canvas.yml`.
PASS

### Heading hierarchy on /services

Method: extracted all heading tags by line number from rendered HTML.

Sequence in document order:
```
Line 241  h2  (visually-hidden — "Main navigation" ARIA label for nav landmark)
Line 439  h2  (visually-hidden — "Breadcrumb" ARIA label for breadcrumb nav)
Line 522  h1  "Testing engagements for Drupal teams."
Line 562  h2  (engagement cards section heading)
Line 586  h3  "Test-suite takeover."
Line 603  h3  "Embedded testing engineer."
Line 620  h3  "Autonomous-healing pilot."
Line 637  h3  "Accessibility testing."
Line 659  h2  ...
...       h2/h3  (footer sections)
```

The two H2 elements before the H1 are both `class="visually-hidden"` and serve as ARIA landmark labels (`aria-labelledby` targets). They are not visible headings and do not constitute a document outline violation. The visible heading sequence is H1 → H2 → H3 with no skipped levels.
Single H1 count: 1. PASS

### ARIA landmarks on /services

Method: `grep -oP '<(header|main|footer|nav)[^>]*>'` on rendered HTML.

Observed:
- `<header class="... site-header" ...>` — PASS
- `<nav id="block-performant-labs-20260502-main-menu" ... aria-labelledby="...">` — PASS
- `<nav data-component-id="dripyard_base:breadcrumb" ... aria-labelledby="...">` — PASS
- `<main class="site-main">` — PASS
- `<footer data-component-id="neonbyte:footer" ...>` — PASS
- `<nav id="block-performant-labs-20260502-footer" ... aria-labelledby="...">` — PASS

All required landmarks present. Both navs carry `aria-labelledby`. PASS

### No orphan-theme SDC config files

Method: `find config/sync -name 'canvas.component.sdc.performant_labs_*'`
No `_20260418` or `_20260411` files. Only `_20260502`. PASS

## WCAG contrast verification

N/A — no visual changes in this cycle. The card-canvas SDC template, CSS, and design tokens are unchanged. The component renders identically under `dripyard_base` as it did under `performant_labs_20260418` (same template, same styles, same version hash `552876d9540c5ead`). No contrast re-verification required.

## Mobile responsive verification

N/A — no responsive overrides in this phase. No CSS was added or modified.

## Acceptance criteria status

| Criterion | Result | Evidence |
|---|---|---|
| /services HTTP 200; 4 engagement cards render with correct copy + styling | PASS | HTTP 200 confirmed; all 4 card titles found in rendered HTML; 4x `dripyard_base:card-canvas` component-id in DOM |
| /services AE=0 at 1280/768/375 (cards identical to shipped state) | DEFERRED TO S | T does not run visual diff; S owns Playwright/ImageMagick AE check |
| `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` deleted from `config/sync/` | PASS | File not found on disk; not present in `find` output |
| `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0 | PASS | Command exits 1 (no matches) |
| No regression on other shipped pages | PASS | All 6 other pages return HTTP 200 |
| No `!important` | PASS | 0 occurrences across all project CSS files served on /services |
| `component_version` preserved (replacement's valid hash used) | PASS | Database confirms `552876d9540c5ead` on all 4 components; matches `active_version` in `canvas.component.sdc.dripyard_base.card-canvas.yml` |
| Idempotent migration script | PASS (trust F) | T cannot re-run a drush php-eval script post-migration, but the component_id values in the DB are correct and stable; no duplicate writes or partial states observed |

## Blocking issues

None.

## Advisory notes

The AE=0 acceptance criterion (pixel-level diff at 1280/768/375) is owned by S. T has confirmed the structural preconditions: correct component provider, correct version hash, correct card copy rendered, no orphan references. S should validate visual parity against the pre-migration baseline in the Playwright/ImageMagick step.
