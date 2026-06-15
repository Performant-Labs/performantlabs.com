# Handoff-F: Sprint 12 Cycle 2 - About-us bio re-nest inside SC + hairline above (R9 restore)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-2-about-us-bio-renest`
**Issue:** `docs/pl2/handoffs/cycle-2-about-us-bio-renest-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page being overhauled | `/about-us` |
| GitHub issue number | N/A (issue bodies live as handoff docs) |
| Working branch | `aa/pl-sprint-12-cycle-2-about-us-bio-renest` |
| Runbook phase | Sprint 12 Cycle 2 |
| Input documents read | cycle-2-about-us-bio-renest-issue.md, cycle-1-about-us-audit-S.md, pl-plan--sprint-12-about-us-fidelity.md, pl-plan--about-us.md, Previews/about-us.html, briefs/pl_design_brief.md, sprint6-cycle3-nearshore-marker.php, theme-change--workflow.md |
| Acceptance criteria count | 9 |
| Handoff document path | `docs/pl2/handoffs/cycle-2-about-us-bio-renest-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `.component.yml` files in SDC directories |

## Structural finding

The issue described the bio block as "promoted to its own standalone section." On inspection of the live DOM, the bio content (h3 "Who we are." + body paragraph) was already physically inside the same section as the Open Source cards (component [11] in Canvas). The section carried the marker class `dy-section--bio-block dy-section--centered-white` with `theme: white`. There was no separate standalone bio section between SC and SD.

The "promotion" was the incorrect `dy-section--bio-block` marker on the SC section, which gave it its own identity as a "bio block" section rather than the standard SC (Open source) section. The fix is: remove the `dy-section--bio-block` marker from the section's `additional_classes`, leaving `dy-section--centered-white` as the sole marker. The existing hairline CSS (which was already present from Sprint 10 Cycle 2b.1) then needs its selectors rewritten from `.dy-section--bio-block` to `.dy-section--centered-white`.

## What was done

- `scripts/sprint12-cycle2-about-us-bio-renest.php` — new idempotent Canvas patch script. Removes `dy-section--bio-block` from the `additional_classes` of component [11] (SC "Open source" section) on canvas_page id=17 (/about-us). Preserves `component_version: e6079b189d228dad`. Second run exits with "SKIP: already patched."
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` — two active selectors rewritten from `.dy-section--bio-block` to `.dy-section--centered-white` (lines 723, 731 in original). Six comment references updated to remove or replace `bio-block` terminology. Comment block at lines 706-722 rewritten to document the Sprint 12 Cycle 2 selector change.

## Layer decisions

### Canvas-content patch (structural demotion)

Not a CSS layer decision. This is a Canvas entity edit removing the `dy-section--bio-block` marker class from the section's `additional_classes` input. The section structure itself does not change -- the bio content remains inside SC.

### L5: Hairline CSS selector rewrite

**Pass 1 -- Bottom-up trace:**
```
Property:      border-top on .heading.h3 following .grid-wrapper in SC content
Current value: 1px solid var(--theme-border-color) = 1px solid #E5E1DC
Declared by:   .dy-section--bio-block .dy-section__content > .grid-wrapper + .heading.h3
Comes from:    Layer 5 (dy-section.css, performant_labs_20260502 theme)
Traces to:     --theme-border-color (Layer 3, base.css) -> #E5E1DC in theme--white
```

**DOM inspection evidence:**
```
[x] Tier 1: .heading.h3 "Who we are." at line 645 of rendered HTML
[x] Tier 1: immediately preceded by grid-wrapper (cards) at line 597
[x] Tier 1: parent .dy-section__content inside .dy-section.dy-section--centered-white.theme--white
[x] N/A -- no JS rendering involved
```

**Pass 2 -- Top-down eligibility:**
```
L1: not config-driven. RULED OUT.
L2: not OKLCH-derived. RULED OUT.
L3: border-top and text-align are not --theme-* tokens. The hairline color
    (#E5E1DC) is already correctly provided by --theme-border-color at L3.
    No new token needed. RULED OUT.
L5: component-scoped override in dy-section.css. Selector rewrite from
    .dy-section--bio-block to .dy-section--centered-white. CORRECT LAYER.
```

Decision: L5 (component CSS scoped to about-us SC/bio context). The hairline color token is correct at L3 (`--theme-border-color: #E5E1DC` in `theme--white`); no L3 change needed.

## Deviations from spec

The issue described the bio as being in "its own standalone section." Investigation revealed the bio was already inside SC; the issue was the incorrect marker class on SC itself. The fix is structurally simpler than the issue anticipated (marker removal rather than content migration between sections), but achieves the same acceptance criteria: `dy-section--bio-block` is gone from the DOM, bio remains inside SC with the hairline above it.

## Verification results (T1 + T2)

### T1 -- Headless (curl + grep)

```
$ ddev drush cr
[success] Cache rebuild complete.

$ ddev exec curl -s http://localhost/about-us | grep -c 'dy-section--bio-block'
0     # PASS: marker removed from rendered HTML

$ ddev exec curl -s http://localhost/about-us | grep -c 'Who we are'
1     # PASS: bio heading still renders

$ ddev exec curl -s http://localhost/about-us | grep -c 'dy-section--centered-white'
2     # PASS: hero + SC both carry centered-white marker

$ ddev exec curl -s http://localhost/about-us | grep -c 'Component start: dripyard_base:section'
5     # PASS: 5 sections (Hero, Track record, Open source, Dogfood, Closing CTA)

$ ddev exec curl -s http://localhost/themes/custom/performant_labs_20260502/css/components/dy-section.css | grep 'centered-white.*grid-wrapper'
.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3 {
.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3 + .text {
# PASS: updated selectors served correctly

$ ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/services
200   # PASS: sibling page healthy

$ ddev exec curl -s -o /dev/null -w "%{http_code}" http://localhost/open-source-projects
200   # PASS: sibling page healthy

$ ddev exec curl -s http://localhost/services | grep -c 'dy-section--bio-block'
0     # PASS: no bio-block on sibling

$ ddev exec curl -s http://localhost/open-source-projects | grep -c 'dy-section--bio-block'
0     # PASS: no bio-block on sibling
```

### T2 -- Structural checks

**Heading hierarchy:**
- h1 x1: "Drupal testing, done by the people who wrote the tools."
- h2: Main navigation (visually-hidden), Breadcrumb (visually-hidden), Track record "On drupal.org since 2006.", Open source "The tools we wrote.", Dogfood "We test what we ship.", Closing CTA "Want to talk testing?", Footer menu (visually-hidden)
- h3: Card titles (ATK, Testor, Other tools), "Who we are." (bio), Footer column headings
- No skipped levels. Single h1. PASS.

**ARIA attributes:** 8 ARIA attributes present (navigation landmarks, menu roles). PASS.

**Bio inside SC:** The h3 "Who we are." immediately follows the grid-wrapper (3-up card grid) inside the SC section. The SC section has class `dy-section--centered-white theme--white`. No standalone bio section exists. PASS.

### Idempotency (patch script run twice)

**First run:**
```
Pre-patch verification passed.
  [11] sdc.dripyard_base.section  uuid=c155cd5d-a6b7-43e4-25f6-06172839415a
  component_version: e6079b189d228dad
  Current additional_classes: 'dy-section--bio-block dy-section--centered-white'
  Current theme: white

Patched additional_classes: 'dy-section--centered-white'
component_version preserved: e6079b189d228dad

Done. Saved canvas_page id=17 with dy-section--bio-block marker removed.
```

**Second run:**
```
Pre-patch verification passed.
  [11] sdc.dripyard_base.section  uuid=c155cd5d-a6b7-43e4-25f6-06172839415a
  component_version: e6079b189d228dad
  Current additional_classes: 'dy-section--centered-white'
  Current theme: white

SKIP: 'dy-section--bio-block' not found in additional_classes. Already patched.
No changes made.
```

PASS: idempotent.

## Orphan-CSS sweep (FB-4)

Searched for `dy-section--bio-block` across:
- `web/themes/custom/performant_labs_20260502/` -- **zero active selectors.** Only two historical comment references remain in dy-section.css documenting the Sprint 10 origin and Sprint 12 removal.
- `web/themes/contrib/dripyard_base/` -- zero references.
- `scripts/` -- references in historical scripts (sprint10-cycle2b1, sprint11-cycle2c) which originally added the marker. These are historical records, not active consumers.

No orphan CSS selectors to retire. The `.dy-section--bio-block` selector was rewritten to `.dy-section--centered-white` in the same file; no standalone orphan file existed.

**Dead CSS flagged:** Line 483 in dy-section.css contains an old selector `.dy-section.theme--white .dy-section__content > .text + .heading.h3` from before the corrected rebuild. This selector no longer matches any DOM on any page (the h3 now follows `.grid-wrapper`, not `.text`). This is a pre-existing dead selector, not introduced by this cycle. Recommend cleanup in a future housekeeping cycle.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Bio h3 "Who we are." | #2A2520 (ink) | #FFFFFF (canvas) | 15.17:1 | PASS (AA body >= 4.5:1) |
| Bio body text | #5C544C (body) | #FFFFFF (canvas) | 7.43:1 | PASS (AA body >= 4.5:1) |
| Hairline rule | #E5E1DC (hairline) | #FFFFFF (canvas) | 1.30:1 | N/A (decorative) |
| Focus ring (teal) | #1893B4 (primary) | #FFFFFF (canvas) | 3.58:1 | PASS (>= 3:1 focus ring) |

## Mobile responsive behavior

N/A -- no responsive overrides in this cycle. The hairline rule and bio centering are inherited from the pre-existing CSS (now re-scoped to `dy-section--centered-white`). The structural properties (`border-top`, `margin-top`, `padding-top`, `text-align: center`, `max-width: 720px`, `margin-inline: auto`) apply at all viewports. The preview confirms the hairline is visible at 1280, 768, and 375 -- no breakpoint-specific changes.

## Autonomous decisions

1. **Structural finding reinterpretation.** The issue described the bio as "promoted to its own standalone section." DOM inspection revealed the bio was already inside SC; only the marker class was wrong. I proceeded with marker removal rather than content migration, which is simpler and achieves the same acceptance criteria. This would have been surfaced to the operator in human-in-the-loop mode.

2. **Selector choice for CSS rewrite.** Chose `.dy-section--centered-white` as the replacement selector (the marker the SC section already carries). Alternative was a pure structural selector without any section marker. `.dy-section--centered-white` was preferred because (a) it maintains the marker-based pattern established in Sprint 10/11, (b) the `.grid-wrapper + .heading.h3` structural pattern is verified unique to /about-us SC across all pages, and (c) it is more defensive against future pages that might add an h3 after a grid-wrapper in a white section.

3. **Dead CSS at line 483 left in place.** The old `.text + .heading.h3` selector predates this cycle and is not within scope (orphan-CSS sweep is scoped to `dy-section--bio-block`). Flagged in handoff for future cleanup.

## Known issues

1. **Dead CSS selector at dy-section.css line 483.** `.dy-section.theme--white .dy-section__content > .text + .heading.h3` no longer matches any DOM element on any page. Pre-existing from before the corrected rebuild. Not harmful (no false matches) but adds dead weight. Recommend cleanup in a future housekeeping cycle.

## Files changed

- `scripts/sprint12-cycle2-about-us-bio-renest.php` (new) -- idempotent Canvas patch script
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified) -- selector rewrite + comment updates
