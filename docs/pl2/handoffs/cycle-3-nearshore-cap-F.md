# Handoff-F: Sprint 6 Cycle 3 — nearshore container-cap (FU-S5-5)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-6-cycle-3-nearshore-cap`
**Issue:** `docs/pl2/handoffs/cycle-3-nearshore-cap-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page | `/services` |
| Issue | `cycle-3-nearshore-cap-issue.md` |
| Branch | `aa/pl-sprint-6-cycle-3-nearshore-cap` |
| Runbook phase | Sprint 6, Cycle 3 |
| Input documents read | 7 of 7 (sprint-5-wrap, cycle-1-audit-services-S, services.html preview, pl_design_brief, dy-section.css, sprint5-cycle4-proof-wordmark.php, sprint-6 runbook) |
| Acceptance criteria count | 8 |
| Handoff path | `docs/pl2/handoffs/cycle-3-nearshore-cap-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source | `dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/sprint6-cycle3-nearshore-marker.php`** (new) — Canvas content edit script that adds `additional_classes: "nearshore-section"` to the nearshore `dy-section` component (index 15, uuid `91a28c64-0d35-4b72-8e9c-f4a7b1d6e230`) on `canvas_page` id=3 (`/services`). Preserves `component_version` values (non-NULL constraint). Idempotent (skips if already present). Pattern follows `fu2-landing-hero-class-patch.php`.

- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified, +47 lines appended) — L5 CSS scoped to `.nearshore-section` marker class:
  - H2: `max-width: 640px; margin-inline: auto; text-wrap: balance`
  - Body paragraph: `max-width: 720px; margin-inline: auto` (per preview `.nearshore p`)

## Layer decisions

**CSS change: nearshore H2 content-cap + text-wrap: balance**

Bottom-up trace (Pass 1):
- Target: `.heading.h2` inside `.dy-section__header` inside `.dy-section.theme--light.nearshore-section`
- Current: inherits `max-width: 820px` from parent `.dy-section__header` (set by existing `:has(.kicker--centered)` rule)
- At desktop `--h2-size: 3.375rem` (54px), the H2 text "Senior testing capacity, when you need more hands." occupies ~900px, wrapping at 820px but not matching preview's tighter wrap pattern
- No `text-wrap: balance` applied -- orphan words possible

Top-down trace (Pass 2):
- L1: not config-driven. RULED OUT.
- L2: not OKLCH-derived. RULED OUT.
- L3: max-width and text-wrap are not `--theme-*` tokens. RULED OUT.
- L5: component-scoped to `.nearshore-section .dy-section__header .heading.h2` via marker class. CORRECT LAYER.

**CSS change: nearshore body paragraph cap**

Same trace path. Preview `.nearshore p { max-width: 720px; margin: 0 auto }`. L5 correct.

## Deviations from spec

**Issue says "~640 px content-cap"; preview's `.nearshore__inner` uses `max-width: 820px`.**

The existing `:has(.kicker--centered)` rule already applies 820px to the header container. The issue's "~640 px" appears to describe the visual width of the H2 text after wrapping, not the CSS container width. Applied `max-width: 640px` to the H2 element itself (as the issue explicitly specifies in scope section), which is narrower than the 820px container and produces a two-line balanced wrap matching the preview's visual pattern. This is the most conservative interpretation: the issue's explicit instruction wins over inferring from the preview's container width.

Body paragraph capped at 720px per preview `.nearshore p` spec, which is narrower than the 820px container but wider than the H2's 640px cap.

## Verification results (T1 + T2)

### T1 (rendered output verification)

```
$ curl ... | grep 'nearshore-section'
nearshore-section    # 1 occurrence, on the nearshore dy-section only

$ curl ... | grep 'dy-section.css'
dy-section.css?tewgbd    # CSS file referenced in page

$ curl ... CSS file | grep -c 'nearshore-section'
4    # 4 occurrences of selector in served CSS file

$ # Nearshore section HTML structure verified:
#   .dy-section.nearshore-section.theme--light > .dy-section__container > .dy-section__header.grid
#     > .kicker.kicker--centered + .heading.h2 + .text > p
```

### T2 (structural checks)

| Check | Result |
|---|---|
| Heading hierarchy (single H1, H2s follow) | PASS |
| No `!important` in CSS rules | PASS (2 occurrences in comments only) |
| Marker class only on nearshore section | PASS (1 occurrence on `/services`) |
| No cross-page regression | PASS (0 occurrences on `/`, `/about-us`, `/how-we-do-it`, `/articles`, `/open-source-projects`) |
| CSS brace balance | PASS (82 open, 82 close) |
| Script idempotent | PASS (second run outputs "SKIP: already present") |
| `component_version` preserved (non-NULL) | PASS (original `e6079b189d228dad` retained) |

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Threshold | Pass/Fail |
|---|---|---|---|---|---|
| H2 (nearshore) | #2A2520 | #F5EFE2 (cream) | 13.24:1 | 3.0:1 (large, 54px) | PASS |
| Body text (nearshore) | #5C544C | #F5EFE2 (cream) | 6.48:1 | 4.5:1 (normal) | PASS |

No color changes were made; only `max-width` and `text-wrap` properties were added (layout-only, no contrast impact).

## Mobile responsive behavior

N/A -- no responsive overrides in this phase. The nearshore section at 768 and 375 is already MATCH per Sprint 5 Cycle 1 audit (items N3, N4). The new `max-width: 640px` on the H2 and `max-width: 720px` on the body paragraph are well within mobile viewport widths and will not cause clipping or overflow. `text-wrap: balance` degrades gracefully on older browsers.

## Autonomous decisions

1. **H2 max-width 640px vs preview's 820px container.** The issue explicitly specifies "max-width: ~640px" in the scope section. The preview's `.nearshore__inner` uses `max-width: 820px`, but this is already applied by the existing `:has(.kicker--centered)` rule. Followed the issue's explicit instruction to cap the H2 itself at 640px, which produces the two-line balanced wrap pattern matching the preview's visual outcome.

2. **Body paragraph cap at 720px.** The issue says "Body text inherits the same content-cap container if appropriate (verify against preview)." Verified: preview `.nearshore p { max-width: 720px }`. Applied 720px rather than the H2's 640px because the preview uses a wider cap for body text than for the headline.

3. **CSS in `dy-section.css` (not a new `nearshore.css`).** Issue says "dy-section.css (preferred) or a new nearshore.css if F judges separation cleaner." The nearshore rules are only 2 selectors (~10 lines of CSS), fitting naturally with the other section-scoped overrides already in dy-section.css. New file would add unnecessary library registration overhead.

## Known issues

None.

## Files changed

- `scripts/sprint6-cycle3-nearshore-marker.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified, +47 lines appended)
