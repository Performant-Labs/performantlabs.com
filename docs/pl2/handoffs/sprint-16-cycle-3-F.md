# Handoff-F: Sprint 16 Cycle 3 - Sidebar H2 + CTA pair layout (A + D + G)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-3-sidebar`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-3-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/contact-us` |
| Issue | `docs/pl2/handoffs/sprint-16-cycle-3-issue.md` |
| Branch | `aa/pl-sprint-16-cycle-3-sidebar` |
| Runbook phase | Sprint 16 Cycle 3 (sidebar + CTA layout batch) |
| Input documents read | issue, sprint-16-cycle-1-audit.md (full), sprint-14-cycle-3-F.md, contact-us.html preview, theme-change--workflow.md, theme-change.md, base.css, dy-section.css, webform.css, neonbyte variables-typography.css |
| Acceptance criteria count | 5 |
| Handoff document path | `docs/pl2/handoffs/sprint-16-cycle-3-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A (no component schema changes; Canvas `additional_classes` only) |

## What was done

- **`web/themes/custom/performant_labs_20260502/css/components/webform.css` (MODIFIED)** -- Added F-NEW-16-A sidebar H2 sizing rule: `.contact-sidebar .heading { font-size: 1.375rem; line-height: 1.25; letter-spacing: -0.2px; font-weight: 500; }`. Scoped to sidebar card only; no cascade widening to other H2s on the page.
- **`scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` (NEW)** -- Canvas assembly script that adds `dy-section--cta-pair` to the contact-us closing-CTA section's `additional_classes` (canvas_page id=13, index 20, UUID `c0a10012-0012-4000-8000-000000000012`). This activates the existing L5 CSS rules in dy-section.css for side-by-side button layout at >= 577px. Idempotent. Preserves `component_version: e6079b189d228dad`.
- **F-NEW-16-D (sidebar card wrapper): NO CHANGES NEEDED** -- The sidebar card styling (hairline border, 12px radius, 32px padding, sticky at >= 992px) was already fully implemented in webform.css from a prior sprint. The `.contact-sidebar` class is present in live HTML and all card chrome properties compute correctly. The Cycle 1 audit may have been conducted against an earlier state.

## Layer decisions

### Fix A — Sidebar H2 size (22px)

**7-step trace:**

Step 1: Sidebar H2 "Prefer a quick call?" renders at 32px on live; preview specifies 22px.

Step 2 Pass 1 (bottom-up):
```
Property:      font-size on h2.heading.h3 inside .contact-sidebar
Current value: 32px (2rem) at 1280px viewport
Declared by:   .h3 { font-size: var(--h3-size); } [dripyard typography-utilities.css]
Comes from:    --h3-size: 2rem at >600px (neonbyte variables-typography.css line 86)
               --h3-size: 1.5rem at <=576px (base.css line 229)
```

DOM inspection gate:
```
[x] Tier 1: h2.heading.h3 at line 913 inside .contact-sidebar .flex-wrapper__layout
[x] Parent: .flex-wrapper.contact-sidebar inside .dy-section__content
[x] N/A — no JS rendering
```

Step 2 Pass 2 (top-down):
```
L1: not config. RULED OUT.
L2: not OKLCH. RULED OUT.
L3: --h3-size is site-wide; setting to 22px would break all H3 headings
    (24px at mobile, 32px at desktop). TOO BROAD. RULED OUT.
L5: .contact-sidebar .heading (specificity 0,2,0) — component-scoped to
    the sidebar card only. Selector beats .h3 (0,1,0). CORRECT LAYER.
```

Step 3: Layer 5, self-approved. Written to webform.css.

Step 4: CSS rule added.

Step 5: T1+T2 verified (see below).

### Fix D — Sidebar card wrapper

**7-step trace (abbreviated — pre-existing):**

Step 1: Audit says sidebar card wrapper is missing.

Step 2: Inspected live rendered HTML and computed styles. The `.contact-sidebar` class IS present on the flex-wrapper element. webform.css already contains D5 sidebar card styling rules with border, radius, padding, and sticky positioning. All properties compute correctly at 1280/768/375.

**Finding: D is already implemented.** The Cycle 1 audit captured a state before webform.css landed, or was working from a stale cache. No CSS change needed.

### Fix G — Closing-CTA button-row layout

**7-step trace:**

Step 1: Closing-CTA two buttons stack vertically on live at all viewports. Preview shows side-by-side at desktop.

Step 2 Pass 1 (bottom-up):
```
Property:      layout of two .button children in .dy-section.theme--dark .dy-section__content
Current value: stacked vertically (flex-direction: column from .dy-section__content default)
Declared by:   .dy-section__content has display:flex; flex-direction:column (Dripyard section default)
```

DOM inspection gate:
```
[x] Tier 1: .dy-section.theme--dark .dy-section__content contains:
    kicker, heading, text, button.button--primary, button.button--outline
[x] Section classes: "dy-section theme--dark full-width dy-section--section-edge-to-edge..."
[x] Missing: dy-section--cta-pair marker class
```

Step 2 Pass 2 (top-down):
```
L1: not config. RULED OUT.
L2: not OKLCH. RULED OUT.
L3: Could write new CSS targeting .dy-section.theme--dark directly, but the
    dy-section--cta-pair pattern already exists (Sprint 10 codification) and
    is the established architectural approach. Adding a CSS selector that
    targets ALL theme--dark sections would affect /how-we-do-it which has a
    different layout intent (stacked buttons with long labels).
    TOO BROAD for pure CSS. RULED OUT for new CSS.
L5 (existing): The dy-section.css already has complete .dy-section--cta-pair
    rules for both theme--white and theme--dark at lines 666-704. The /about-us
    and /services closing-CTA sections already carry this marker and render
    side-by-side. The /contact-us section simply lacks the marker.
    CORRECT APPROACH: Add marker via Canvas additional_classes.
```

Step 3: L3 Canvas (marker class) + existing L5 CSS (no new CSS written). Self-approved. The Sprint 14 Cycle 3 precedent confirms this is the correct pattern: the CSS rules exist, the section just needs the marker class.

Step 4: Canvas script written and executed.

Step 5: T1+T2 verified (see below).

## Deviations from spec

- **F-NEW-16-D classified as pre-existing.** The issue lists D as requiring implementation, but the sidebar card styling is already fully functional in webform.css. Rather than writing redundant CSS, I verified the existing implementation matches all AC requirements and documented it as pre-existing. If S's re-audit finds any discrepancy, the webform.css rules can be adjusted.

## Verification results (T1 + T2)

### T1: cache-clear + curl-grep

```
$ ddev drush cr
[success] Cache rebuild complete.
```

**contact-sidebar class in rendered HTML:**
```
class="flex-wrapper contact-sidebar margin-top--0 margin-bottom--0 padding-top--0 padding-bottom--0 flex-wrapper__align-x-start flex-wrapper__align-y-top flex-wrapper__wrap"
```
PASS -- `.contact-sidebar` present.

**dy-section--cta-pair on closing-CTA section:**
```
class="dy-section dy-section--cta-pair theme--dark full-width dy-section--section-edge-to-edge margin-top--0 margin-bottom--0 padding-top--l padding-bottom--l"
```
PASS -- `dy-section--cta-pair` marker present.

**webform.css loaded:**
```
href="/themes/custom/performant_labs_20260502/css/components/webform.css?tez82z"
```
PASS.

**dy-section.css loaded:**
```
href="/themes/custom/performant_labs_20260502/css/components/dy-section.css?tez82z"
```
PASS.

### T2: Playwright computed-style probes

**1280px viewport:**

| Property | Expected | Actual | Pass |
|---|---|---|---|
| Sidebar H2 font-size | 22px | 22px | PASS |
| Sidebar H2 line-height | 27.5px | 27.5px | PASS |
| Sidebar H2 letter-spacing | -0.2px | -0.2px | PASS |
| Sidebar H2 font-weight | 500 | 500 | PASS |
| Sidebar H2 single line | yes | 1 line | PASS |
| Sidebar card border | 1px solid #E5E1DC | 1px solid rgb(229, 225, 220) | PASS |
| Sidebar card border-radius | 12px | 12px | PASS |
| Sidebar card padding-top | 32px | 32px | PASS |
| Sidebar card padding-left | 32px | 32px | PASS |
| Sidebar card position | sticky | sticky | PASS |
| Sidebar card top | 48px | 48px | PASS |
| CTA button 1 top | same as button 2 | 2812 | -- |
| CTA button 2 top | same as button 1 | 2812 | PASS (side-by-side) |

**768px viewport:**

| Property | Expected | Actual | Pass |
|---|---|---|---|
| Sidebar H2 font-size | 22px | 22px | PASS |
| Sidebar card position | static | static | PASS |
| Sidebar card border-radius | 12px | 12px | PASS |
| CTA button 1 top | same as button 2 | 4069 | -- |
| CTA button 2 top | same as button 1 | 4069 | PASS (side-by-side) |

**375px viewport:**

| Property | Expected | Actual | Pass |
|---|---|---|---|
| Sidebar H2 font-size | 22px | 22px | PASS |
| Sidebar card position | static | static | PASS |
| CTA button 1 top | different from button 2 | 5015 | -- |
| CTA button 2 top | different from button 1 | 5091 | PASS (stacked) |
| CTA button 1 height | >= 44px | 56px | PASS |
| CTA button 2 height | >= 44px | 56px | PASS |
| CTA button width | full-width | 331px (full) | PASS |

### Other H2s on page (cascade widening check)

| H2 text | font-size | Changed? |
|---|---|---|
| "Prefer a quick call?" | 22px | YES (32 -> 22, intended) |
| "What to expect from the other side of this form." | 40px | NO (unchanged) |
| "Skip the form -- book the review." | 56px | NO (unchanged) |

PASS -- no cascade widening. Only the sidebar H2 changed.

### Canvas script idempotency

```
$ ddev drush php:script scripts/sprint16-cycle3-contact-us-cta-pair-marker.php
SKIP: 'dy-section--cta-pair' already present in additional_classes.
```
PASS -- idempotent.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Sidebar H2 "Prefer a quick call?" (22px/500wt = normal text) | #1F1A14 | #FFFFFF | 17.29:1 | PASS (>= 4.5:1) |
| CTA "Book a testing review" (primary, unchanged) | #FFFFFF | #62BBCB | 2.13:1 | pre-existing allowlist (F-NEW-16-F carry) |
| CTA "View services" (ghost-on-dark, unchanged) | #FFFFFF | transparent/#1F1A14 | 17.29:1 | PASS |
| Focus ring on sidebar H2 area | #1893b4 | #FFFFFF | 3.58:1 | PASS (>= 3:1 non-text) |

No contrast regressions. The sidebar H2 size change (32 -> 22px) does not affect any color tokens.

## Mobile responsive behavior

**Sidebar H2 (F-NEW-16-A):** The `.contact-sidebar .heading` rule uses absolute values (1.375rem / 1.25 lh / -0.2px ls) that apply at all viewports. The preview also uses a fixed 22px across all viewports. Before the fix, the H2 was 32px at desktop and 24px at mobile (via --h3-size token cascade). Now it is 22px at all viewports, matching the preview exactly.

**Sidebar card (F-NEW-16-D):** Pre-existing. Sticky at >= 992px, static at < 992px. No change this cycle.

**CTA buttons (F-NEW-16-G):** The existing dy-section.css rules for `.dy-section--cta-pair.theme--dark` handle the responsive behavior:
- >= 577px: flex-direction: row, side-by-side, centered
- <= 576px: flex-direction: column, stacked, full-width, min-height 44px

Verified:
- 1280px: side-by-side (both top=2812)
- 768px: side-by-side (both top=4069)
- 375px: stacked (top=5015 vs 5091), full-width (331px), height 56px (>= 44px)

**Touch targets at 375px:**
- CTA "Book a testing review": 331 x 56 px (>= 44px). PASS.
- CTA "View services": 331 x 56 px (>= 44px). PASS.
- Sidebar "Book a slot": 151 x 56 px (>= 44px). PASS.

**Reflow at 375px:** pageWidth=360 < clientWidth=375. No horizontal scroll. PASS.

**Orphan-word check (memory feedback_no_orphan_words.md):** "Prefer a quick call?" renders on a single line at 22px inside the 320px sidebar (320 - 64px padding = 256px usable; text measures ~230px at 22px Rubik 500). No orphan risk at any viewport.

## Cross-page sanity (F-NEW-16-G)

| Page | Closing-CTA buttons | Layout at 1280 | Regressed? |
|---|---|---|---|
| `/about-us` | "Book a testing review" + "See the testing menu" | side-by-side (both top=3976) | NO |
| `/` (homepage) | "Book a testing review" + "Or test with the tools" | side-by-side (both top=4187) | NO |
| `/services` | "Book a testing review" + "Or start with the tools" | side-by-side (top 3850 vs 3856, 6px sub-pixel) | NO |
| `/how-we-do-it` | "Book a testing review" + "See all engagement shapes" | stacked (top 4599 vs 4810) | NO (pre-existing; long label) |
| `/open-source-projects` | "Drop us a line" (single button) | N/A | NO |

No regressions on any page. The `dy-section--cta-pair` marker was added only to `/contact-us` (canvas_page id=13, index 20). Other pages' closing-CTA sections are untouched.

## Autonomous decisions

1. **F-NEW-16-D classified as pre-existing (no code change).** The issue listed D as requiring implementation with "hairline + 12 radius + 32 padding + sticky at >= 992." The 7-step trace reveals all four properties already compute correctly on live via webform.css D5 rules. Rather than writing redundant CSS, I documented it as pre-existing and verified via T2. If the Cycle 1 audit was conducted against a stale state, this is expected. If S disagrees, the webform.css rules can be adjusted.

2. **Fix G implemented via Canvas marker (L3) instead of new CSS (L5).** The issue offered two paths: L3 Canvas marker or L5 CSS. The trace found that dy-section.css already contains complete `.dy-section--cta-pair` rules (lines 666-704) that handle the exact layout needed, and `/about-us` and `/services` already use this marker successfully. Writing new CSS would duplicate existing rules. Adding the marker class is the established pattern (Sprint 10 codification, Sprint 14 Cycle 3 precedent).

3. **CTA breakpoint: 577px (existing) vs issue's 768px.** The issue AC says "side-by-side at >= 768." The existing dy-section.css `dy-section--cta-pair` rules use 577px as the breakpoint (matching the preview's behavior and the `/about-us`/`/services` precedent). I preserved the existing 577px breakpoint rather than introducing a new 768px rule, as: (a) the preview works at 768 (verified: side-by-side at 768), (b) the existing cross-page pattern is 577px, (c) introducing a 768px breakpoint would create inconsistency across pages. At 768px the buttons render side-by-side, satisfying the AC.

## Known issues

None. All acceptance criteria met:

- [x] **F-NEW-16-A.** Sidebar H2 computes 22px / 27.5px / -0.2px at all viewports. Other H2s unchanged.
- [x] **F-NEW-16-D.** Sidebar card has 1px solid #E5E1DC border, 12px radius, 32px padding, sticky at >= 992, static below. (Pre-existing.)
- [x] **F-NEW-16-G.** Closing-CTA buttons side-by-side at 1280 and 768; stacked at 375. Cross-page sanity: no regressions.
- [x] No `!important`. 7-step trace per fix documented.
- [x] Files staged by explicit path.

## Files changed

- `web/themes/custom/performant_labs_20260502/css/components/webform.css` (MODIFIED -- added F-NEW-16-A sidebar H2 sizing rule, lines 234-268)
- `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` (NEW -- Canvas script for F-NEW-16-G)
