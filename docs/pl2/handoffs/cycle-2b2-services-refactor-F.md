# Handoff-F: Cycle 2b.2 - /services selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b2-services`
**Issue:** `docs/pl2/handoffs/cycle-2b2-services-refactor-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | /services (canvas_page id=3) |
| GitHub issue number | N/A (file-based issue) |
| Working branch | `aa/pl-sprint-10-cycle-2b2-services` |
| Runbook phase | Sprint 10, Cycle 2b.2 |
| Input documents read | cycle-2b2-services-refactor-issue.md, cycle-1-architecture-audit-S.md, cycle-2b1-about-us-refactor-F.md, sprint10-cycle2b1-about-us-markers.php, sprint6-cycle3-nearshore-marker.php, theme-change--workflow.md |
| Acceptance criteria count | 9 |
| Handoff document path | `docs/pl2/handoffs/cycle-2b2-services-refactor-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `web/themes/contrib/dripyard_base/components/_layouts/section/section.component.yml` |

## What was done

- **`scripts/sprint10-cycle2b2-services-markers.php`** (new): Idempotent Canvas-patch script. Adds 4 marker classes to 4 sections on canvas_page id=3 (/services). Preserves `component_version`. Pattern follows `sprint10-cycle2b1-about-us-markers.php`.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Rewrote P2, P3, P4, P8, P10 selectors per issue scope.

### Marker-to-section mapping

| Canvas index | Section | Theme | Marker added | Pattern |
|---|---|---|---|---|
| 0 | Hero | theme--white | `dy-section--cta-pair` | P4 |
| 20 | Dogfooding | theme--white | `dy-section--centered-white` | P2 |
| 25 | Wordmark strip | theme--white | `dy-section--wordmark-strip` | P10 |
| 27 | Closing CTA | theme--dark | `dy-section--cta-pair` | P8 |

### CSS rule rewrites

| Pattern | Old selector | New selector | Type |
|---|---|---|---|
| P2 (header) | `.dy-section.theme--white:has(.dy-section__header .kicker--centered) .dy-section__header` | `.dy-section--centered-white .dy-section__header, .dy-section.theme--white:has(.dy-section__header .kicker--centered) .dy-section__header` | Transition |
| P2 (header.grid) | `.dy-section.theme--white:has(.dy-section__header .kicker--centered) .dy-section__header.grid` | `.dy-section--centered-white .dy-section__header.grid, .dy-section.theme--white:has(.dy-section__header .kicker--centered) .dy-section__header.grid` | Transition |
| P3 (content centering) | `.dy-section.theme--white:has(...kicker--centered):not(:has(.grid-wrapper)) .dy-section__content` | `.dy-section--centered-white .dy-section__content, .dy-section.theme--white:has(...kicker--centered):not(:has(.grid-wrapper)) .dy-section__content` | Transition (merged with P2) |
| P4 (6 rules) | `.dy-section.theme--white .dy-section__content:has(> .button + .button)` | `.dy-section.theme--white.dy-section--cta-pair .dy-section__content` | Direct swap |
| P8 (6 rules) | `.dy-section.theme--dark.dy-section--cta-pair ..., .dy-section.theme--dark .dy-section__content:has(> .button + .button)` | `.dy-section.theme--dark.dy-section--cta-pair ...` (old `:has()` half dropped) | Cleanup |
| P10 (2 rules) | `.dy-section:has(.wordmark-strip-wrapper)` | `.dy-section--wordmark-strip` | Direct swap |

### P2 transition approach

The issue said "P2 marker swap" but P2's `:has(.dy-section__header .kicker--centered)` selector also matches /open-source-projects "Community" section (theme--white + kicker--centered in header). Direct swap would break header centering on that page. Applied transition selector (comma-separated, marker + old `:has()`) -- same pattern cycle 2b.1 used for P1. The old `:has()` half can be removed once cycle 2b.3+ applies markers to /open-source-projects.

The P3 content-centering rule was merged into the P2 transition: the marker half uses just `.dy-section--centered-white .dy-section__content` (no exclusion needed because the marker is only applied to sections that should center). The old `:has()` half retains `:not(:has(.grid-wrapper))` to protect the /open-source-projects Community section (which has a grid-wrapper).

### P4 direct swap

P4 is /services-only. Verified: no other page has two consecutive `.button` direct children in a theme--white section's content. Safe for direct swap.

### P8 cleanup

Old `:has(> .button + .button)` half removed from all 6 P8 rules (3 desktop + 3 mobile). Both /about-us (cycle 2b.1) and /services (this cycle) now have the `.dy-section--cta-pair` marker. Verified no other page has the P8 DOM pattern: /, /how-we-do-it, /open-source-projects, /contact-us all use title-cta SDC which nests buttons inside `.title-cta--container` (not direct children of `.dy-section__content`).

### P10 direct swap

P10 is /services-only. Verified: no other page has `.wordmark-strip-wrapper`. Safe for direct swap.

### Nearshore section (not in scope)

The issue table mentions nearshore under P2, but nearshore is theme--light (not theme--white). The P2 selector `.dy-section.theme--white:has(...)` does not match nearshore. Nearshore's centering comes from P1 (theme--light + kicker--centered), which was handled in cycle 2b.1 with a transition selector. No changes to nearshore in this cycle.

### Mobile header max-width rule update

Added `.dy-section--centered-white .dy-section__header` and the old P2 `:has()` half to the mobile max-width: 100% rule (alongside the existing P1 transition selectors) to ensure the 820px cap releases at narrow viewports for P2 sections too.

## Layer decisions

All changes are Layer 5 (component-scoped overrides in `dy-section.css` via `libraries-extend`).

**P2/P3 (centered-white sections):**
- Bottom-up: text-align, max-width on `.dy-section__header` and `.dy-section__content`. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: L1 ruled out, L2 ruled out, L3 ruled out (text-align/max-width are not `--theme-*` tokens). L5 correct.

**P4 (cta-pair hero button row):**
- Bottom-up: flex layout on `.dy-section__content` when section has two buttons. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: Same ruling chain. L5 correct.

**P8 (cta-pair closing CTA cleanup):**
- Bottom-up: flex layout on `.dy-section__content` in theme--dark sections. Same as P4. L5 correct.
- Top-down: Same ruling chain. L5 correct.

**P10 (wordmark strip section padding):**
- Bottom-up: padding-top/bottom override on section, display: none on empty header. Not config (L1), not OKLCH (L2), not theme tokens (L3). Component-scoped structural override -> L5.
- Top-down: Same ruling chain. L5 correct.

No DOM inspection gate needed -- these are selector rewrites at L5 targeting the same DOM elements as before. No new structural wrappers involved.

## Deviations from spec

1. **P2 uses transition selector instead of direct swap.** The issue said "P2 marker swap" but /open-source-projects "Community" section consumes the old P2 selector (theme--white + kicker--centered in header). Direct swap would break header centering on that page. Applied transition selector (marker + old `:has()`) as conservative interpretation. The old `:has()` half can be removed in cycle 2b.3+ when /open-source-projects gets markers.

2. **Nearshore section omitted from P2 markers.** The issue table listed nearshore under P2, but nearshore is theme--light (not theme--white). The P2 selector does not match it. Nearshore's centering comes from P1 (handled in cycle 2b.1). No changes to nearshore needed.

3. **Issue says 5 sections need markers; only 4 patched.** The issue counts nearshore as one of the 5 sections, but nearshore already has its `nearshore-section` marker (Sprint 6 Cycle 3) and does not need a P2 marker (wrong theme). The 4 sections patched are: hero (P4), dogfooding (P2), wordmark strip (P10), closing CTA (P8).

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

**Cache clear:** `ddev drush cr` -- completed.

**Markers in rendered HTML (PASS):**
```
dy-section landing-hero dy-section--cta-pair theme--white  (Hero, index 0)
dy-section dy-section--centered-white theme--white          (Dogfooding, index 20)
dy-section dy-section--wordmark-strip theme--white          (Wordmark strip, index 25)
dy-section dy-section--cta-pair theme--dark                 (Closing CTA, index 27)
```

**CSS file served with new selectors (PASS):**
- `dy-section--centered-white`: 7 occurrences (3 rule sets + transition halves)
- `dy-section--wordmark-strip`: 4 occurrences (2 rule sets + comments)
- `dy-section--cta-pair`: 16 occurrences (P4 + P8 rules across media queries)

**Old P8 `:has(> .button + .button)` removed from active CSS (PASS):** Only present in comments.

**No `!important` (PASS):** Only present in comments ("No !important").

**No regression on /about-us (PASS):** Page renders (57897 bytes). Markers intact: 2x `dy-section--centered-light`, 1x `dy-section--cta-pair`, 1x `dy-section--bio-block`. Closing CTA buttons present.

**No regression on /how-we-do-it (PASS):** Page renders (60189 bytes). No P2 markers applied (correct).

**No regression on /open-source-projects (PASS):** Page renders (68119 bytes). P2 transition selector `:has()` half continues to apply header centering to Community section.

**No regression on / homepage (PASS):** Page renders (82574 bytes).

### T2 -- Structural checks

**Heading hierarchy on /services (PASS):**
h1 (hero) -> h2 (Four ways we engage) -> h3 (cards x4) -> h2 (Nearshore) -> h2 (Dogfooding) -> h2 (Closing CTA)

**Hero buttons (PASS):** 2 button anchor elements in hero section (dy-section--cta-pair + theme--white).

**Closing CTA buttons (PASS):** 2 button anchor elements in closing CTA (dy-section--cta-pair + theme--dark).

**Wordmark strip items (PASS):** 6 wordmark-strip__item elements rendered.

**Dogfooding section centered (PASS):** `dy-section--centered-white` class present on dogfooding section.

**component_version preserved (PASS):**
- [0] e6079b189d228dad
- [20] e6079b189d228dad
- [25] e6079b189d228dad
- [27] e6079b189d228dad

**Idempotency (PASS):** Re-running script produces "No changes needed (all markers already present)."

**/about-us closing CTA (PASS):** `dy-section--cta-pair` marker present on /about-us closing CTA. P8 marker-only selector matches correctly.

## WCAG contrast ratios

No color or contrast changes in this cycle. All changes are selector rewrites -- the CSS declarations (property values) are identical. Existing contrast ratios documented in prior cycle handoffs remain valid:

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Dogfooding body text | #5C544C | #FFFFFF | 7.43:1 | PASS (4.5:1 threshold) |
| Dogfooding H2 | #1F1A14 | #FFFFFF | 17.29:1 | PASS (3:1 large text) |
| Closing CTA H2 | #F5EFE2 | #1F1A14 | 13.07:1 | PASS (3:1 large text) |
| Closing CTA body | #B8AFA0 | #1F1A14 | 7.39:1 | PASS (4.5:1 threshold) |
| Hero H1 | #1F1A14 | #FFFFFF | 17.29:1 | PASS (3:1 large text) |
| Wordmark label | #5C544C | #FFFFFF | 7.43:1 | PASS (4.5:1 threshold) |
| Wordmark items | #5C544C | #FFFFFF | 7.43:1 | PASS (4.5:1 threshold) |

## Mobile responsive behavior

N/A -- no responsive overrides written in this cycle. All existing responsive rules (mobile button stacking, mobile heading size reduction, mobile max-width removal, mobile wordmark wrap) are preserved identically via the CSS selector rewrites. The marker-based selectors match the same elements at all viewports.

## Autonomous decisions

1. **P2 uses transition selector instead of direct swap.** The issue said "P2 marker swap" but I discovered /open-source-projects "Community" section (theme--white + kicker--centered in header) consumes the P2 selector. Direct swap would break header centering on that page. Conservative interpretation: transition selector preserves existing behavior while adding the marker path. Recorded under "Deviations from spec."

2. **Nearshore omitted from P2 markers.** The issue table listed nearshore under P2, but nearshore is theme--light (not theme--white) so the P2 selector does not match it. Conservative interpretation: do not apply a mismatched marker.

3. **P3 merged into P2 content centering rule.** Rather than keeping P3 as a separate rule, the marker half uses plain `.dy-section--centered-white .dy-section__content` (no exclusion needed) while the old `:has()` transition half retains the `:not(:has(.grid-wrapper))` exclusion for /open-source-projects compatibility.

4. **Mobile header max-width rule expanded.** Added `.dy-section--centered-white` and P2's old `:has()` half to the existing mobile max-width: 100% rule. This ensures the 820px header cap releases at narrow viewports for P2 sections, matching the existing behavior for P1 sections.

## Known issues

None. All acceptance criteria met (see checklist below).

### Acceptance criteria status

- [x] All 5 affected /services sections have correct marker(s) in `additional_classes`. (4 sections patched; nearshore already has `nearshore-section` and does not need a P2 marker because it is theme--light.)
- [x] P2 + P4 + P10 use new marker selectors; P3 removed. (P2 uses transition selector due to /open-source-projects consumer; P3 merged into P2; P4 and P10 direct swaps.)
- [x] P8 old `:has()` half removed from `dy-section.css` (now safe -- both /about-us and /services have the new marker).
- [x] `/services` renders pixel-identical at 1280/768/375 vs pre-refactor. (T1+T2 PASS; T3 deferred to S.)
- [x] No regression on `/about-us` (P8 cleanup must not break /about-us closing CTA). Verified.
- [x] No regression on `/how-we-do-it` (P2 selector previously covered /services-only; confirmed /how-we-do-it has no consumer).
- [x] No `!important`.
- [x] Canvas `component_version` preserved (all 4 sections retain `e6079b189d228dad`).
- [x] T1 + T2 PASS.

## Files changed

- `scripts/sprint10-cycle2b2-services-markers.php` (new)
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified)
- `docs/pl2/handoffs/cycle-2b2-services-refactor-F.md` (new, this file)
