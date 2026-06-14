# Handoff-F: Sprint 11 Cycle 2c - P2 transition-selector cleanup

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2c-p2-cleanup`
**Issue:** `docs/pl2/handoffs/cycle-2c-p2-cleanup-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | Cross-page (/, /services, /how-we-do-it, /about-us, /open-source-projects, /contact-us) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-11-cycle-2c-p2-cleanup` |
| Runbook phase | Sprint 11, Cycle 2c |
| Input documents read | cycle-2c-p2-cleanup-issue.md, cycle-2b-osp-markers-F.md, sprint11-cycle2b-osp-markers.php, sprint10-cycle2b1-about-us-markers.php, theme-change--workflow.md, theme-change.md, dy-section.css |
| Acceptance criteria count | 6 |
| Handoff document path | `docs/pl2/handoffs/cycle-2c-p2-cleanup-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/sprint11-cycle2c-p2-cleanup.php`** (new): Idempotent Canvas-patch script. Adds `dy-section--centered-white` marker to 6 sections across 5 canvas_page entities. Preserves `component_version`. Pattern follows `sprint11-cycle2b-osp-markers.php`.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Dropped the P2 `:has(.dy-section__header .kicker--centered)` transition selectors from all 3 P2 rule blocks and the mobile rule. Marker-only selectors remain. Content centering rule gains `:not(:has(.grid-wrapper))` guard on the marker selector.

### Marker-to-section mapping (6 sections, 5 pages)

| canvas_page | Index | Page | Section | Existing classes | Marker added |
|---|---|---|---|---|---|
| 3 | 6 | /services | "Four ways we engage" | (none) | `dy-section--centered-white` |
| 4 | 0 | /how-we-do-it | Hero "Process" | `landing-hero` | `dy-section--centered-white` |
| 17 | 0 | /about-us | Hero "About" | `dy-section--cta-pair` | `dy-section--centered-white` |
| 17 | 11 | /about-us | Bio block "Open source" | `dy-section--bio-block` | `dy-section--centered-white` |
| 20 | 15 | / (homepage) | "What we ship" | (none) | `dy-section--centered-white` |
| 13 | 0 | /contact-us | Hero "Get in touch" | `contact-us-hero` | `dy-section--centered-white` |

### CSS changes

| Old line(s) | Change | Detail |
|---|---|---|
| 133-134 | `:has()` half dropped | `.dy-section.theme--white:has(.dy-section__header .kicker--centered) .dy-section__header` removed from comma-separated selector |
| 141-142 | `:has()` half dropped | Same pattern for `.dy-section__header.grid` |
| 152-153 | `:has()` half dropped + guard added | Old `:has()` fallback removed. Marker selector gains `:not(:has(.grid-wrapper))` guard to preserve P3 behavior |
| 214 | `:has()` half dropped | Mobile rule (max-width: 576px) -- old `:has()` line removed |
| 115-132 | Comment block updated | Reflects architectural close -- all consumers listed, old selectors dropped |
| 80-91 | File-level comment updated | Sprint 11 Cycle 2c history entry added |

## Layer decisions

All changes are Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**P2 marker-only selectors (no change to specificity):**
- Bottom-up: `max-width`, `margin-inline`, `text-align`, `display`, `align-items` on `.dy-section__header` and `.dy-section__content`. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: L1 ruled out (not config), L2 ruled out (not OKLCH), L3 ruled out (not `--theme-*` tokens). L5 correct.
- DOM inspection gate: N/A for selector cleanup -- same DOM elements targeted, same properties declared, only `:has()` fallback selectors removed. All consumers now have the marker class in their rendered HTML (verified T1).

## Deviations from spec

1. **6 sections marked instead of 4.** The issue lists 4 target sections (/services "Four ways we engage", /how-we-do-it hero, /about-us hero, /about-us bio-block). Cross-page audit discovered 2 additional UNMARKED P2 consumers: homepage "What we ship" (canvas_page 20 index 15) and /contact-us hero (canvas_page 13 index 0). Both had `kicker--centered` in `theme--white` sections without the `dy-section--centered-white` marker. Dropping the `:has()` half without marking these would break their header centering. All 6 were marked to achieve the issue's stated objective: "True architectural close on ADV-3."

2. **Homepage canvas_page is id=20, not id=1.** The issue references canvas_page id=1 as a possible homepage match. Investigation found the front page config (`system.site page.front`) points to `/page/20` (canvas_page id=20). Canvas_page id=1 exists but is not the homepage.

3. **Content centering retains `:not(:has(.grid-wrapper))` guard.** Two newly-marked sections (/services "Four ways we engage" and / "What we ship") contain `grid-wrapper` card content. Applying `text-align: center; align-items: center` to their `dy-section__content` would visually affect card layout. The `:not(:has(.grid-wrapper))` guard (inherited from the old P3 rule) is retained on the marker selector to preserve correct behavior. This uses `:has()` but in a different role -- it is a structural guard, not a transition fallback.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**All pages HTTP 200 (PASS):**
```
  /homepage: 200
  /services: 200
  /how-we-do-it: 200
  /about-us: 200
  /open-source-projects: 200
  /contact-us: 200
```

**Markers in rendered HTML (PASS):**
```
  /homepage: 1 occurrence of dy-section--centered-white
  /services: 2 occurrences
  /how-we-do-it: 1 occurrence
  /about-us: 2 occurrences
  /open-source-projects: 2 occurrences
  /contact-us: 1 occurrence
```

**Old P2 `:has()` selector in functional CSS lines (PASS):** 0 functional lines. 1 occurrence in comment only (line 85: history note).

**Doubled-class selectors in served CSS (PASS):** 4 occurrences of `.dy-section.dy-section--centered-white` (3 rule selectors + 1 with `:not(:has(.grid-wrapper))` guard).

**No `!important` (PASS):** 0 in functional CSS. 2 occurrences in comments only.

**Cross-page audit -- UNMARKED P2 consumers (PASS):** Full audit across /, /services, /how-we-do-it, /about-us, /open-source-projects, /contact-us, /articles. Zero unmarked consumers remain.

### T2 -- Structural checks

**component_version preserved (PASS):**
```
  canvas_page=3  [6]  cv=e6079b189d228dad  /services "Four ways"
  canvas_page=4  [0]  cv=e6079b189d228dad  /how-we-do-it hero
  canvas_page=17 [0]  cv=e6079b189d228dad  /about-us hero
  canvas_page=17 [11] cv=e6079b189d228dad  /about-us bio-block
  canvas_page=20 [15] cv=e6079b189d228dad  / "What we ship"
  canvas_page=13 [0]  cv=e6079b189d228dad  /contact-us hero
```

**Heading hierarchy (PASS):** All 6 pages have exactly 1 h1 tag.

**Idempotency (PASS):** Re-running script produces "No changes needed (all markers already present)."

## WCAG contrast ratios

No color or contrast changes in this cycle. All changes are marker-class additions and selector cleanup -- the CSS declarations (property values) are identical. Existing contrast ratios from prior cycles remain valid.

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Section H2 (white zones) | #1F1A14 | #FFFFFF | 17.29:1 | PASS (3:1 large text) |
| Section body text (white zones) | #5C544C | #FFFFFF | 7.22:1 | PASS (4.5:1) |
| Kicker text (white zones) | #5C544C | #FFFFFF | 7.22:1 | PASS (4.5:1) |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. The existing mobile rule (max-width: 100% at <=576px) was simplified by removing the old `:has()` half but the declaration and remaining selectors are unchanged.

## Autonomous decisions

1. **6 sections marked instead of 4 (scope expansion).** The issue lists 4 targets. Cross-page audit found 2 additional UNMARKED P2 consumers (homepage "What we ship" and /contact-us hero). Without marking these, dropping the `:has()` half would break their header centering. The issue's objective is "True architectural close on ADV-3" -- this requires ALL consumers marked. Conservative interpretation: mark all 6 to make the `:has()` drop safe.

2. **Homepage canvas_page corrected from id=1 to id=20.** The issue does not specify the homepage canvas_page ID. Investigation revealed `system.site page.front = /page/20`, meaning the front page is canvas_page 20, not canvas_page 1. An initial incorrect patch to canvas_page 1 index 11 was reverted before the corrected script was finalized.

3. **Content centering guard `:not(:has(.grid-wrapper))` retained on marker selector.** Two newly-marked sections contain grid-wrapper card content. Without the guard, `text-align: center; align-items: center` would apply to their `dy-section__content`, potentially affecting card layout. This is a different use of `:has()` than the old P2 transition fallback -- it is a structural guard that will persist unless a future cycle adds a separate marker for "sections that should center content."

4. **P1 (theme--light) `:has()` transition selectors NOT touched.** The issue scope is P2 only. The P1 `:has(.kicker--centered)` selectors on the theme--light rules remain as transition state until a separate cycle addresses them.

## Known issues

None. All 6 acceptance criteria are met.

### Acceptance criteria status

- [x] `.dy-section--centered-white` marker on all 4 target sections (plus 2 additional cross-page consumers discovered during audit) via idempotent script preserving `component_version`.
- [x] P2 `:has(.dy-section__header .kicker--centered)` half dropped from `dy-section.css` everywhere -- `grep` returns 0 functional lines.
- [x] All affected pages (/, /services, /how-we-do-it, /about-us, /open-source-projects, /contact-us) HTTP 200 with markers rendering.
- [x] No `!important`.
- [x] Specificity-safe doubled-class form `.dy-section.dy-section--centered-white` (0,2,0).
- [x] `component_version` preserved (e6079b189d228dad for all 6 sections).

## Files changed

- `scripts/sprint11-cycle2c-p2-cleanup.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified)
- `docs/pl2/handoffs/cycle-2c-p2-cleanup-F.md` (new, this file)
