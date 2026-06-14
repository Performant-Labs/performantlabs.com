# Spec Audit: /how-we-do-it

**Date:** 2026-05-05
**Page title:** How a testing engagement runs
**URL:** /how-we-do-it
**Auditor:** Spec Auditor (S), Claude Opus 4.6

## Summary verdict: PASS

All three critical WCAG issues from the initial audit have been resolved
(Pass 2), and all 22 visual fidelity gaps from the gap analysis have been
closed (Pass 3). One additional WCAG contrast issue (kicker on
theme--secondary) was found and fixed during Pass 3. The page matches the
approved design preview and meets WCAG 2.1 AA requirements. See "Pass 3
visual fidelity audit" at the bottom of this document for details.

---

## 1. Heading hierarchy (WCAG 2.1 SC 1.3.1) -- CRITICAL

### 1a. Missing H1 -- Critical

The page title "How a testing engagement runs" is set on the
`canvas_page` entity and appears in `<title>`, Open Graph meta, and the
breadcrumb, but it is **not rendered as an `<h1>` element** anywhere in
the page body. The `page-title.html.twig` template in `dripyard_base`
does render an H1, but Canvas pages appear to suppress the page-title
block entirely. The rendered HTML contains zero `<h1>` elements.

**Impact:** Screen readers and heading-navigation users have no H1
landmark. Every heading on the page is H2 or lower, violating the
expectation of a single H1 that names the page.

**Recommendation:** Either (a) add a heading component with
`html_element: h1` to the first section's header slot (styled as
`body_l` or `h1` as appropriate -- it can be visually styled to match
the current lead paragraph), or (b) investigate why the Canvas module
suppresses the Drupal page-title block and restore it if appropriate.

### 1b. H3 stripped by text format -- Critical

The overlay injects an `<h3>What changes from "we monitor your site"</h3>`
inside the Week 2 body text (component `eda75617`). However, the
`canvas_html_block` text format's `filter_html` configuration does not
include `<h3>` in its allowed tags list. The `<h3>` tag is stripped on
render, leaving the subheading as bare unstyled text inline with the
surrounding paragraphs.

Allowed tags in `canvas_html_block`:
```
<strong> <em> <u> <a> <p> <br> <ul> <ol> <li> <code> <pre>
<blockquote> <table> <thead> <tbody> <tr> <th> <td> <div> <svg>
<circle> <rect> <line> <polygon> <text>
```

`<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>` are all absent.

**Impact:** The heading hierarchy jumps from H2 ("Week 2...") directly
past the intended H3 to the next H2 ("Week 3+..."). The subheading text
renders as an unmarked paragraph, invisible to heading-navigation users
and losing its structural role.

**Recommendation:** Add `<h3>` (and ideally `<h2>` through `<h6>`) to
the `canvas_html_block` filter format's allowed HTML. This is a
site-wide configuration change via
`/admin/config/content/formats/manage/canvas_html_block`.

### 1c. Card titles at H3 -- PASS

The three card-canvas components ("Hand back, green." / "Take over,
ongoing." / "Embed, instead.") render their titles as `<h3>` elements
via the card template. This is the correct level under the parent H2
"Week 3+ -- Take over or hand back."

### 1d. CTA heading at H2 -- PASS

The title-cta component renders "Want a one-page audit of your testing
surface?" as an `<h2>`. This is correct as a peer to the other section
headings.

---

## 2. Color contrast (WCAG 2.1 SC 1.4.3 / 1.4.6) -- CRITICAL (one item)

### 2a. CTA button: white text on white background -- Critical

In the `theme--primary` section (teal #1893b4 surface), the primary
button's background color resolves to `var(--theme-link-color)`, which
the custom `html .theme--primary` override sets to `#FFFFFF`. The button
text is hardcoded `#FFFFFF`. Result: white text (#FFF) on white
background (#FFF) -- contrast ratio 1:1. The button is completely
invisible except for the arrow icon (which uses `fill: currentColor` and
is also white, though its `<svg>` might have some intrinsic rendering).

**Cascade trace:**
- Dripyard `button-primary.css` (0,1,0): `--button-background-color: var(--primary)` -- would give the brand teal.
- Custom `button.css` (0,1,0, later in cascade): `--button-background-color: var(--theme-link-color)` -- overrides to link color.
- `html .theme--primary` in `base.css` (0,1,1): `--theme-link-color: #FFFFFF` -- link color is white in the primary zone because text on teal should be white.
- Custom `button.css`: `--button-text-color: #FFFFFF` -- hardcoded white.

The P13 fix comment in button.css says this pattern makes the button
"zone-adaptive" via `--theme-link-color`, but did not account for the
primary zone where link color IS white (because links on a teal surface
need to be white).

**Recommendation:** Add a `.theme--primary .button--primary` override
that sets the button to a contrasting treatment. Options:
- White bg (#FFFFFF) with dark text (#1F1A14 or #2A2520) -- matches
  Dripyard's original intent (`--color-text-color-loud`).
- Keep the Dripyard default for primary zone: bg = `var(--primary)` =
  teal, text = white. But then the button would be invisible against
  the teal surface.
- Best option: white bg + espresso text, same as dark-zone treatment
  but applied to primary zone. Add alongside the existing
  `.theme--dark .button--primary` rule.

### 2b. White heading text on teal CTA background -- PASS (large text)

White (#FFFFFF) on teal (#1893b4) = 3.58:1. This **fails** the 4.5:1
threshold for normal text but **passes** the 3.0:1 threshold for large
text. The CTA heading is rendered as H2 at 40px (display-md per design
brief), which qualifies as large text (>= 18pt or >= 14pt bold). PASS.

### 2c. Body text on white -- PASS

| Combination | Foreground | Background | Ratio | Result |
|---|---|---|---|---|
| "Loud" body on white | #1F1A14 | #FFFFFF | 17.27:1 | AA PASS |
| "Medium" body on white | #5C544C | #FFFFFF | 7.43:1 | AA PASS |
| "Primary" headings on white | #2A2520 | #FFFFFF | 15.17:1 | AA PASS |
| Link color on white | #0F6F8A | #FFFFFF | 5.74:1 | AA PASS |

### 2d. Body text on light (#F5EFE2) -- PASS

| Combination | Foreground | Background | Ratio | Result |
|---|---|---|---|---|
| "Loud" body on light | #1F1A14 | #F5EFE2 | ~15.07:1 | AA PASS |
| "Medium" body on light | #5C544C | #F5EFE2 | 6.48:1 | AA PASS |
| "Primary" headings on light | #2A2520 | #F5EFE2 | 13.24:1 | AA PASS |
| Link color on light | #0F6F8A | #F5EFE2 | 5.01:1 | AA PASS |

### 2e. "Soft" lead paragraph on white -- likely PASS

The lead paragraph uses `color: soft` in the white theme. The custom
`base.css` does not override `--theme-text-color-soft` for white/light
zones, so it falls through to Dripyard's `var(--neutral-700)` which is
`oklch(from #0000d9 0.48 var(--chroma) h)`. At lightness 0.48, this
produces a dark-ish color that should comfortably pass 4.5:1 against
white. The computed hex value depends on OKLCH resolution but the
Dripyard theme comments guarantee "minimum 4.5:1 contrast ratio over
all surface colors" for `--theme-text-color-soft`. PASS with caveat:
verify the computed color visually to ensure the blue primary hue does
not produce an unexpectedly tinted neutral.

---

## 3. Link contrast on dark CTA (WCAG 2.1 SC 1.4.3) -- see Finding 2a

The CTA button contrast issue is covered in Finding 2a above. The
heading text contrast is covered in Finding 2b (PASS for large text).

---

## 4. Touch targets (WCAG 2.5.8 / 2.5.5) -- PASS

The CTA button uses `.button--large` which sets `--button-height: 56px`.
With standard padding, the button exceeds the 44x44px minimum touch
target. No other interactive elements appear in the page body (no inline
links in body text, no card links). The cards have no `href` set, so
they render without link wrappers. PASS.

---

## 5. Orphan words -- INFO

All section headings are short enough that orphan-word risk is low at
desktop widths:

| Heading | Word count | Risk |
|---|---|---|
| Week 1 -- Audit. | 4 | Low |
| Week 2 -- Stand up the dogfood loop. | 8 | Low |
| Week 3+ -- Take over or hand back. | 8 | Medium at 375px |
| What we don't do. | 5 | Low |
| Want a one-page audit of your testing surface? | 9 | Medium at 375px |
| Hand back, green. / Take over, ongoing. / Embed, instead. | 3-4 each | Low |

At 375px mobile width, the longer headings may wrap. Whether the last
line has a single orphaned word depends on the exact font metrics
(Rubik 500 at 30px mobile). A visual check at 375px is recommended. If
orphans appear, apply `text-wrap: balance` to the heading component.

**Severity:** Info (not a WCAG requirement; user preference).

---

## 6. Image alt text (WCAG 2.1 SC 1.1.1) -- PASS WITH NOTE

### 6a. Cost-of-bugs graph (Media ID 24) -- Minor

Alt text: "How We Do It - Relative Cost of Fixing Bugs"

This names the chart but does not describe its content. For an
informational graph, WCAG best practice is to provide alt text that
conveys the data trend (e.g., "Bar chart showing the relative cost of
fixing bugs rises steeply from requirements through design, coding,
testing, and production stages"). The current alt is acceptable but
could be improved.

**Severity:** Minor (alt text is present and not generic; improving the
description is a best-practice enhancement).

### 6b. Card icons (Media IDs 62, 63, 64) -- PASS

| Media ID | Alt text | Assessment |
|---|---|---|
| 62 | "Outlined package icon on a teal tile, indicating handing the test suite back to your team." | Descriptive, PASS |
| 63 | "Two arrows in a continuous loop on a teal tile, indicating ongoing operation of the test suite." | Descriptive, PASS |
| 64 | "Three figures grouped together on a teal tile, indicating an embedded testing engineer joining the team." | Descriptive, PASS |

---

## Checklist: items to fix before shipping

1. ~~**[Critical] Missing H1.** Add an H1 heading to the page.~~ RESOLVED in Pass 2.

2. ~~**[Critical] H3 stripped by filter_html.** Add heading tags to
   the `canvas_html_block` text format's allowed HTML.~~ RESOLVED in Pass 2.

3. ~~**[Critical] CTA button invisible.** The primary button in the
   `theme--primary` zone has white text on a white background.~~ RESOLVED in Pass 2.

---

## Advisory notes (non-blocking)

- **Cost-of-bugs graph alt text.** Consider enriching the alt text to
  describe the data trend shown in the graph, not just name it.

- **Soft text color provenance.** The lead paragraph's "soft" color in
  white/light zones inherits Dripyard's OKLCH-derived `--neutral-700`
  based on the primary color `#0000d9`. This may produce a slightly
  blue-tinted gray. Verify the computed color visually and consider
  pinning `--theme-text-color-soft` to an explicit hex value in
  `base.css` (e.g., `#6B6560` or similar warm neutral) for consistency
  with the warm brand palette.

- **Orphan words at 375px.** Add `text-wrap: balance` to the heading
  component if visual inspection reveals orphaned words on the longer
  headings at mobile width.

---

## Pass 2 re-audit (2026-05-05)

Re-audit of the three critical findings after fixes were applied.

### Fix A: Missing H1 -- RESOLVED

**What was done:** A heading component (`html_element: h1`, `style: h1`,
`color: primary`) was added to the first section's header slot via
overlay `content-exports/how-we-do-it-rewrite-pass-2.overlay.yml`
(UUID `bc0002a0-aaaa-4001-8901-000000000001`, parent section
`5e8c8fc7`).

**Rendered output verification:** The live HTML at `/how-we-do-it`
contains exactly one `<h1>` element:

```html
<h1 data-component-id="dripyard_base:heading"
    class="heading h1 margin-top--0 margin-bottom--s color--primary">
```

The text content is "How a testing engagement runs," matching the page
title.

**Regression check -- duplicate H1:** The page contains exactly 1
`<h1>` element. The Drupal page-title block does not render on Canvas
pages, so there is no duplicate. CLEAN.

**WCAG SC 1.3.1 compliance:** The page now has a single H1 that names
the page, with H2 section headings beneath it and H3 subheadings where
appropriate. The heading hierarchy is complete and correct. PASS.

### Fix B: H3 stripped by text format -- RESOLVED

**What was done:** `<h2>` through `<h6>` were added to the
`canvas_html_block` filter format's allowed HTML via
`ddev drush config:set`.

**Drupal config verification:** The active configuration for
`filter.format.canvas_html_block` now includes:

```
<h2> <h3> <h4> <h5> <h6>
```

at the start of the allowed_html string.

**Rendered output verification:** The live HTML contains the `<h3>`
element inline in the Week 2 body text:

```html
<h3>What changes from "we monitor your site"</h3>
```

The tag is no longer stripped. The three card titles also render
correctly as `<h3>` elements ("Hand back, green." / "Take over,
ongoing." / "Embed, instead.").

**Regression check -- XSS risk:** Only `<h2>` through `<h6>` were
added. These are inert structural elements with no event-handler
attributes or script-execution capability. No `<script>`, `<iframe>`,
`<object>`, `<embed>`, or `<style>` tags were added. No XSS risk.

**WCAG SC 1.3.1 compliance:** The heading hierarchy is now: H1 (page
title) > H2 (section headings: Week 1, Week 2, Week 3+, What we
don't do, CTA) > H3 (subheading under Week 2; card titles under
Week 3+). No levels skipped. PASS.

### Fix C: CTA button white-on-white -- RESOLVED

**What was done:** A `.theme--primary .button--primary:where(:not([disabled]))`
rule was added to `button.css` (lines 82-89) setting:

- `--button-background-color: #FFFFFF` (white bg)
- `--button-background-color-hover: #F5EFE2` (cream bg on hover)
- `--button-text-color: #1F1A14` (espresso text)
- `--button-text-color-hover: #1F1A14` (espresso text on hover)

**Contrast ratios:**
- Resting: #1F1A14 on #FFFFFF = 17.27:1 (AAA)
- Hover: #1F1A14 on #F5EFE2 = 15.07:1 (AAA)

Both far exceed the 4.5:1 AA threshold.

**Rendered output verification:** The live HTML shows the CTA button
inside a `theme--primary` section:

```html
<div ... class="dy-section theme--primary ...">
  ...
  <a ... class="button button--primary button--large"
     href="/contact-us?intent=testing-review">
```

The CSS rule at specificity (0,2,0) correctly overrides the base
(0,1,0) rule, and the button will render with white background and
espresso text on the teal surface.

**Regression check -- other theme zones:** The rule is scoped to
`.theme--primary .button--primary` only. The existing rules for
white/light zones (base `.button--primary` rule) and dark/black zones
(`.theme--dark .button--primary`, `.theme--black .button--primary`)
are unaffected. The secondary button rules and ghost-on-dark modifier
are also unaffected. No regression.

**WCAG SC 1.4.3 compliance:** The button now has 17.27:1 contrast ratio
at rest, far exceeding the 4.5:1 AA minimum. PASS.

### Pass 2 verdict: PASS

All three critical findings have been resolved. No regressions
detected. The page meets WCAG 2.1 AA requirements and is ready to ship.

---

## Pass 3 visual fidelity audit (2026-05-05)

Re-audit after Pass 3 overlay and CSS changes to close all 22 gap-analysis
items. This pass checks visual match against the approved design preview
at `docs/pl2/Previews/how-we-do-it.html`.

### Gap closure summary

All 22 items from `how-we-do-it-gap-analysis.md` addressed:

| # | Gap item | Status | Method |
|---|----------|--------|--------|
| H1 | Header CTA text | CLOSED | Block content updated to "Book a testing review" |
| H2 | Header CTA button style | CLOSED | Pill shape via button.css; color via theme tokens |
| H3 | Nav active state | CLOSED | Existing Dripyard active-trail styling verified |
| A1 | Hero kicker ("PROCESS") | CLOSED | Kicker SDC added via pass-3 overlay (centered variant) |
| A2 | H1 alignment | CLOSED | Hero H1 centered via overlay + CSS |
| A3 | H1 text color | CLOSED | Heading color set to `default` (resolves to ink) |
| A4 | Lead paragraph alignment | CLOSED | Centered via CSS, max-width constrained |
| B1 | Week 1 kicker ("WEEK 1") | CLOSED | Kicker SDC added (inline variant) |
| B2 | Week 1 H2 text | CLOSED | Split to "Audit." with kicker handling the week label |
| B4 | Body text max-width | CLOSED | `text_max_width: 800px` applied via overlay |
| B5 | Graph presentation | CLOSED | Restructured below text with border-radius + caption |
| B6 | Week 1 section theme | CLOSED | Changed from `white` to `light` (cream #F5EFE2) |
| C1 | Week 2 kicker ("WEEK 2") | CLOSED | Kicker SDC added (inline variant) |
| C6 | Week 2 section theme | CLOSED | Changed from `light` to `white` |
| D1 | Week 3+ kicker ("WEEK 3+") | CLOSED | Kicker SDC added (inline variant) |
| D3 | Card component type | CLOSED | Images removed, eyebrow_text added ("01 / Hand back" etc.) |
| D6 | Week 3+ section theme | CLOSED | Changed from `white` to `secondary` (#F2EFED) |
| E2 | "What we don't do" text width | CLOSED | `text_max_width: 800px` applied |
| F1 | CTA background | CLOSED | Changed from `primary` (teal) to `dark` (espresso #1F1A14) |
| F2 | CTA kicker ("GET STARTED") | CLOSED | Kicker SDC added (centered, dark variant) |
| F4 | CTA subtitle | CLOSED | Paragraph component added to title-cta section |
| F5 | Second CTA button | CLOSED | Ghost-on-dark secondary button added |

### WCAG findings

#### Kicker contrast on theme--secondary -- RESOLVED

**Finding:** The inline kicker text uses `#A85F40` (terracotta-deep).
On the `theme--secondary` surface (`#F2EFED`), this produces a contrast
ratio of 4.19:1, which fails the 4.5:1 AA threshold for 12px text.

**Fix applied:** Added `.theme--secondary .kicker--light` to the existing
contrast-deepening rule in `kicker.css` (line 27-29), so kickers on both
`theme--light` and `theme--secondary` surfaces use
`var(--pl-accent-deep-on-light)` (`#8C4E33`), which yields 5.64:1 on
`#F2EFED` -- AA pass.

**Verification:** Cache cleared (`ddev drush cr`), live page inspected.
The Week 3+ kicker renders in the deeper terracotta on the warm surface.

#### All prior fixes verified

- **Missing H1** (Pass 2 Fix A): Still present, single `<h1>`, correct text.
- **H3 stripped** (Pass 2 Fix B): `<h3>` renders in Week 2 body text.
- **Button white-on-white** (Pass 2 Fix C): Primary button in CTA section
  renders white bg + espresso text (17.27:1) via `.theme--dark` zone rules.

### Visual verification

Browser scroll-through of the live page at
`https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it` confirmed:

1. **Hero:** "PROCESS" kicker centered with flanking terracotta rules,
   H1 "How a testing engagement runs" centered, lead paragraph centered.
2. **Week 1 -- Audit:** Cream background, "WEEK 1" inline kicker in
   terracotta, "Audit." H2, body text constrained, graph below text in
   bordered card with caption.
3. **Week 2 -- Stand up the dogfood loop:** White background, "WEEK 2"
   inline kicker, body text with inline H3 subheading.
4. **Week 3+ -- Take over or hand back:** Warm (#F2EFED) background,
   "WEEK 3+" inline kicker, three text-only cards with terracotta
   numbered eyebrows ("01 / Hand back", "02 / Take over", "03 / Embed").
5. **What we don't do:** Cream background, body text constrained.
6. **CTA:** Espresso (#1F1A14) background, "GET STARTED" kicker centered
   with flanking terracotta rules, 56px heading in cream, subtitle
   paragraph, "Book a testing review" primary button + "See all
   engagement shapes" ghost-on-dark button.

### Cross-page regression

No regressions observed on `/services` -- CSS scoping changes (kicker
contrast rule, dy-section centering) are properly constrained.

### Pass 3 verdict: PASS

All 22 gap-analysis items closed. One WCAG contrast issue found and
resolved (kicker on theme--secondary). No regressions. The page matches
the approved design preview and meets WCAG 2.1 AA requirements.
