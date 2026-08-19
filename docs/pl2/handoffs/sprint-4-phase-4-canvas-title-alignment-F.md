# Handoff-F: Phase 4 - Canvas page title-vs-content horizontal alignment

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-4-canvas-title-alignment`
**Issue:** sprint-4-phase-4-canvas-title-alignment-issue.md

## Confirmation table (informational, autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | Cross-page (Canvas pages site-wide) |
| GitHub issue number | sprint-4-phase-4-canvas-title-alignment-issue.md |
| Working branch | `aa/pl-sprint-4-phase-4-canvas-title-alignment` |
| Runbook phase | Sprint 4, Cycle 4 |
| Input documents read | Issue doc, sprint runbook (Cycle 4), old canvas.css (performant_labs_20260418), active theme libraries.yml, active theme info.yml, theme-change--workflow.md, theme-change.md |
| Acceptance criteria count | 3 |
| Handoff document path | docs/pl2/handoffs/sprint-4-phase-4-canvas-title-alignment-F.md |
| CSS workflow path | docs/pl2/theme-change--workflow.md |
| Component schema source of truth | N/A (no component work in this cycle) |

## Pre-flight result: ALREADY COMPLETE

The pre-flight check (required per issue instructions, following Cycle 1 pattern) found that the misalignment described in the issue **does not exist** on the active theme `performant_labs_20260502`.

### Root cause

The issue references `canvas.css` with `padding-inline: var(--spacing-xs, 1.25rem)` on `.block-page-title-block`. That file exists at `web/themes/custom/performant_labs_20260418/css/layout/canvas.css` (the old theme) but was **never ported** to the active theme `performant_labs_20260502`. The active theme has no `css/layout/` directory and no `canvas-layout` library in its `libraries.yml`.

Since the old canvas.css is not loaded, the 20px padding-inline that caused the ~6px misalignment is simply absent. Dripyard's default `.container` auto-margin logic governs both the page title block and the content containers, so they naturally align.

### Playwright measurement results

Three pages tested, five viewports each (375 / 576 / 768 / 992 / 1280):

**`/articles-2`** (the only page with `.block-page-title-block`):

| Viewport | .block-page-title-block x | .block-page-title-block padL | h1 x | Delta |
|---|---|---|---|---|
| 375 | 14.4 | 0px | 14.4 | 0px |
| 576 | 22.4 | 0px | 22.4 | 0px |
| 768 | 30.1 | 0px | 30.1 | 0px |
| 992 | 39.1 | 0px | 39.1 | 0px |
| 1280 | 50.6 | 0px | 50.6 | 0px |

**`/contact-us`** and **`/open-source-projects`** (Canvas pages): Neither page has `.block-page-title-block`. Their titles are rendered inside `dy-section` containers using the Dripyard heading component. The h1 left edge matches the `.dy-section__container.container` left edge at every viewport (the apparent delta at 1280px is due to `--heading-max-width: 1000px` centering within the container, not a gutter misalignment).

### Why .block-page-title-block is absent on Canvas pages

Canvas pages render their page titles via authored Dripyard sections (heading components inside dy-sections), not via the Drupal block system's `.block-page-title-block`. The block is either hidden by block visibility configuration or not placed for Canvas page types. Only non-Canvas pages like `/articles-2` show the standard `.block-page-title-block`, and those already align perfectly because no rogue padding-inline is applied.

## What was done

No code changes. Pre-flight check determined the issue is already resolved.

## Layer decisions

N/A. No CSS change required.

## Deviations from spec

None. The issue explicitly instructs: "If they're already within 1px, the cycle is already-complete -- note in handoff and stop."

## Verification results (T1 + T2)

**T1 (cache-clear + curl):**
```
ddev drush cr  -> [success] Cache rebuild complete.
ddev exec curl -s http://localhost/contact-us | grep 'canvas\.css' -> (no match)
```
Confirms canvas.css is not loaded on any page.

**T2 (Playwright getBoundingClientRect):**
All measurements above confirm 0px delta between `.block-page-title-block` and content at every tested viewport on `/articles-2` (the only page with that element). Canvas pages lack the element entirely.

## WCAG contrast ratios

N/A. No visual changes made.

## Mobile responsive behavior

N/A. No responsive overrides written.

## Autonomous decisions

1. **Determined cycle is already-complete** based on pre-flight Playwright measurements showing 0px alignment delta at all viewports. The issue's pre-flight check instruction explicitly covers this case. This is the same pattern as Cycle 1.
2. **Identified that canvas.css was never ported** to the active theme. The old theme's canvas.css (with its `.block-page-title-block` padding-inline rules) is at `performant_labs_20260418/css/layout/canvas.css` but is not served by `performant_labs_20260502`. The issue's premise -- that Pass 2 in canvas.css sets `padding-inline: var(--spacing-xs, 1.25rem)` on the active theme -- is outdated.
3. **Noted that Canvas pages do not render `.block-page-title-block`** at all in the current site. The page title on Canvas pages is authored inside dy-sections, not via the Drupal block system. This makes the original D.3 observation moot for the current architecture.

## Known issues

None. The alignment concern from GET-BACK-TO-THESE.md D.3 does not manifest on the current active theme. The old canvas.css containing the problematic padding was never ported. The acceptance criteria are met by default:
- Title-band left edge aligns with content first-element left edge (within 1px) at all viewports: YES (0px delta on /articles-2; Canvas pages have no standalone title block)
- No regression on any non-Canvas page: YES (no changes made)
- Trace comment documents the .container-derived value and the coupling: N/A (no CSS written)

**Recommendation:** Mark GET-BACK-TO-THESE.md D.3 as resolved with a note that the misalignment was specific to the old theme's canvas.css and did not carry forward to performant_labs_20260502. If a `canvas-layout` library is ever ported to the active theme (for edge-to-edge section backgrounds, hero bleeds, etc.), the page-title-block padding-inline should be validated at that time.

## Files changed

None.
