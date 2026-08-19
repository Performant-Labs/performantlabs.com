# Handoff: /how-we-do-it — Batch 2 remaining issues

**Date:** 2026-05-05
**Page:** /how-we-do-it
**Live URL:** https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it
**Preview:** docs/pl2/Previews/how-we-do-it.html
**Prior work:** Batches 1-3 (overlay + CSS) applied in Pass 3. All 22 gap-analysis
items marked closed, WCAG AA passing. This document covers visual issues
that remain after Pass 3.

---

## What's working

- Section themes: all correct (hero white, Week 1 cream, Week 2 white,
  Week 3+ secondary, "What we don't do" cream, CTA espresso)
- Kickers: all 5 present, correct variant/theme, WCAG-passing contrast
- H2 heading colors: all ink (#2A2520), not teal — correct
- CTA heading: 56px cream on espresso — correct
- CTA buttons: primary (white bg + espresso text) + ghost-on-dark — both
  present with AA+ contrast
- Graph card: border, 12px radius, 48px padding, max-width 720px — styled
- Body text: max-width constrained via `text_max_width`
- Card eyebrows: terracotta monospace with hairline rule — styled

---

## Issue 1: Cards stack vertically instead of 3-column grid

**Severity:** High — major layout deviation from preview.

**What's happening:** The three engagement-shape cards in the Week 3+
section each have `grid-column: 1 / -1` on the Dripyard `grid-wrapper__grid`,
causing each card to span the full 12-column grid and stack vertically.

**Preview expects:** `grid-template-columns: repeat(3, 1fr)` — three
equal-width cards side by side.

**Root cause:** The `grid-wrapper` Dripyard component uses a 12-column
grid. The card-canvas children default to `grid-column: 1 / -1` (full
span) when no column configuration is provided. The overlay did not set
column span inputs on the grid-wrapper or individual cards.

**Fix approach:** Either:
- (a) Set the `columns` input on each card-canvas component inside the
  grid-wrapper to `4` (4 of 12 = 1/3 width), via overlay.
- (b) Add CSS: `.dy-section.theme--secondary .grid-wrapper__grid > .card
  { grid-column: span 4; }` to force 3-up layout.
- (c) Investigate whether the grid-wrapper component has a `columns_per_row`
  or similar input that controls child column span.

**Files:** `content-exports/how-we-do-it-rewrite-pass-3.overlay.yml`
(grid-wrapper and card-canvas component inputs),
`web/themes/custom/performant_labs_20260502/css/components/card.css` or
`dy-section.css` (if CSS approach).

---

## Issue 2: CTA button ordering — primary button above subtitle

**Severity:** Medium — structural deviation from preview.

**What's happening:** The CTA section renders in this order:
1. Kicker ("GET STARTED")
2. Title-CTA component (heading + primary "Book a testing review" button
   bundled together inside `title-cta--container`)
3. Subtitle paragraph ("A 30-minute call with a senior engineer...")
4. Ghost button ("See all engagement shapes")

**Preview expects:**
1. Kicker
2. Heading (alone)
3. Subtitle paragraph
4. Both buttons side by side in a flex row

**Root cause:** The `title-cta` Dripyard component bundles the heading and
a single CTA button into one container. The subtitle was added as a
separate text component after it, and the ghost button as a standalone
button component after that. The title-cta component does not allow
content between the heading and its button.

**Fix approach:** Either:
- (a) Replace the `title-cta` component with separate components: a
  heading component + text component + two button components in the
  content slot. This requires restructuring the overlay to remove the
  title-cta and add individual components. Then add CSS to flex the two
  buttons side by side.
- (b) Accept the current ordering as a Dripyard component limitation.
  The primary button above the subtitle still reads fine — the subtitle
  adds context, and the ghost button provides the secondary action.

**Files:** `content-exports/how-we-do-it-rewrite-pass-3.overlay.yml`
(CTA section component structure),
`web/themes/custom/performant_labs_20260502/css/components/title-cta.css`
(if restructured, button pair flex layout needed).

---

## Issue 3: 80px gap between section headings and body text

**Severity:** Medium — excessive whitespace makes sections feel disconnected.

**What's happening:** Every section has an 80px gap between the header
slot (kicker + heading) and the content slot (body text, graph, cards).
This is Dripyard's default `margin-bottom: 80px` on `.dy-section__header`.

**Preview uses:** Tighter spacing (~32-48px depending on section).

**Root cause:** Dripyard's section component applies a fixed 80px bottom
margin to the header slot. This is a framework-level spacing token, not
something controlled by overlay inputs.

**Fix approach:**
- CSS override: `.dy-section .dy-section__header { margin-bottom: 2rem; }`
  (32px) or similar. Needs careful scoping to avoid breaking other pages.
  Could scope to how-we-do-it specifically via a body class or use a
  `:has()` selector targeting sections with kicker--inline.
- Investigate whether the section component has a `header_spacing` or
  `gap` input that can be set via overlay.

**Affected sections:** All 5 body sections (Week 1, Week 2, Week 3+,
"What we don't do", and CTA — though the CTA uses its own title-cta
spacing).

**Files:** `web/themes/custom/performant_labs_20260502/css/components/dy-section.css`

---

## Issue 4: H1 missing trailing period

**Severity:** Low — minor content difference.

**What's happening:** The H1 renders as "How a testing engagement runs"
(no period). The preview HTML has "How a testing engagement runs." (with
period).

**Fix:** Update the heading component text in the pass-2 overlay:
`content-exports/how-we-do-it-rewrite-pass-2.overlay.yml`, line 27:
change `text: "How a testing engagement runs"` to
`text: "How a testing engagement runs."` and re-apply.

---

## Summary prioritization

| # | Issue | Severity | Fix type |
|---|-------|----------|----------|
| 1 | Cards stack vertically, not 3-column | High | Overlay input or CSS |
| 2 | CTA button above subtitle | Medium | Overlay restructure or accept |
| 3 | 80px header-content gap | Medium | CSS override |
| 4 | H1 missing period | Low | Overlay content fix |
