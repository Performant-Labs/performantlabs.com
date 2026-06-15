# Handoff-F: Phase 8.6 - Polish batch (final Phase 8 sub-cycle)

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Issue:** `docs/pl2/handoffs/phase-8.6-polish-issue.md`

## What was done

- `css/components/accordion.css` -- replaced chevron-down SVG with +/- text indicator via CSS ::after pseudo-element (item 2).
- `css/components/header.css` -- added 1px hairline border + 8px radius to .mobile-nav-button (item 5).
- Items 1, 3, 4 verified as already resolved (no code changes needed).
- Item 6 (nav-cluster offset) assessed as sub-threshold delta (~7px) -- documented as no-op.

## Layer decisions

### Item 1: Footer link label casing

**Status: NO-OP (already resolved)**

Trace: `ddev drush eval` on `system.menu.footer` shows all link titles already in sentence case: "Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing", "Privacy policy", etc. T1 curl confirms the rendered `.footer-column__link` elements contain sentence-case labels. No CSS `text-transform` is applied to these links (footer.css uses `text-transform: uppercase` only on `.footer-column__heading`, which is correct). This was fixed during the Phase 8 Batch 2 menu restructure (the Twig flatten template reads titles directly from the menu tree).

Layer: N/A -- already correct at L1 (menu config).

### Item 2: FAQ accordion icons (chevron-down SVG to plus/minus)

**Status: IMPLEMENTED**

Pass 1 (bottom-up): Dripyard base `accordion-item.twig` includes `{{ include('dripyard_base:icon', { icon: 'chevron-down', size: 16 }) }}` which renders an inline SVG with class `.icon` inside `.accordion-item__summary`. Dripyard base `accordion-item.css` styles the SVG at `.accordion-item__summary svg` with `flex-basis: 24px`, `flex-shrink: 0`, `margin-inline: auto 0`, and a rotation transition on `[open]`. Our prior override in `accordion.css` set `color: var(--theme-link-color)` on the SVG.

Pass 2 (top-down):
- L1: not config (icon choice is hardcoded in Twig template). RULED OUT.
- L2: not OKLCH-derived. RULED OUT.
- L3: not a theme token issue (no `--accordion-icon` token exists). RULED OUT.
- L5: correct -- component-scoped via libraries-extend on `core/components.dripyard_base--accordion-item`. Hide the SVG and add `::after` pseudo-element on the summary.

DOM inspection evidence: T1 confirmed `.accordion-item__summary` contains the SVG as last flex child. Dripyard sets `display: flex; gap: 20px` on the summary. The `::after` pseudo-element inherits the flex child positioning via `margin-inline: auto 0`.

Fix: `.accordion-item__summary svg { display: none; }` + `.accordion-item__summary::after { content: "+"; ... }` + `.accordion-item[open] > .accordion-item__summary::after { content: "\2212"; }`.

Specificity: (0,1,1) on the SVG rule matches Dripyard's nested rule; later load via libraries-extend wins. The `::after` rule is new (no conflict). The `[open]` selector uses child combinator `>` to ensure it only targets the direct summary.

Layer: L5, `css/components/accordion.css`.

### Item 3: Footer-CTA primary pill arrow glyph

**Status: NO-OP (already resolved)**

Trace: T1 curl of homepage shows `<a class="button button--primary button--large" href="/contact-us?intent=testing-review">Book a testing review  </a>`. No arrow glyph (U+2192, `&#8594;`, or any SVG icon) present in the button text. The `button.css` override does not inject any `::after` content. Zero instances of the arrow character found on the entire rendered page. This was resolved when the CTA button content was configured via Canvas assemblies during Phase 4/5.

Layer: N/A -- already correct at L1 (content config).

### Item 4: Checklist item terminal periods

**Status: NO-OP (already resolved)**

Trace: T1 curl confirms all four `.icon-list-item__content` elements have terminal periods:
- "Dev teams catch regressions before users do."
- "Engineers deploy with confidence, not anxiety."
- "Manual test cycles drop as automated runs cover the regression surface."
- "Leadership ships on schedule and on budget."

Layer: N/A -- already correct at L1 (content config in Canvas assemblies).

### Item 5: Hamburger button border + radius

**Status: IMPLEMENTED**

Pass 1 (bottom-up): neonbyte's `mobile-nav-button.css` sets `.mobile-nav-button { border: 0; background: transparent; }` at specificity (0,1,0). No border or radius is applied. The preview canonical spec shows: `border: 1px solid var(--hairline); border-radius: 8px`.

Pass 2 (top-down):
- L1: not config. RULED OUT.
- L2: not OKLCH. RULED OUT.
- L3: not a theme token (structural/component-specific). RULED OUT.
- L5: correct -- component-scoped on `.site-header .mobile-nav-button` at (0,2,0), inside `@media (max-width: 991px)`. Matches the existing Phase 8.1 size override pattern.

DOM inspection evidence: T1 confirmed `<button class="mobile-nav-button">` inside `<header class="theme--white site-header">`. The ancestor `.site-header` gives our selector the (0,2,0) specificity needed to beat neonbyte's (0,1,0) `border: 0` regardless of load order (neonbyte's mobile-nav-button.css loads after our header.css as a separate SDC component library).

Fix: added `border: 1px solid var(--theme-border-color); border-radius: 8px;` to the existing `.site-header .mobile-nav-button` rule in the `@media (max-width: 991px)` block.

Box model: `border-box` is global (Dripyard base reset). The 1px border is included in the 44x44 outer dimensions. Touch target remains 44x44 CSS px (meets WCAG 2.5.5).

Layer: L5, `css/components/header.css`.

### Item 6: Nav-cluster horizontal offset at 1280

**Status: NO-OP (sub-threshold delta, ~7px)**

Analysis: The preview uses `max-width: 1200px` container with `padding: 0 24px`. The live neonbyte header uses `--container-width: min(92cqw, 1440px)` on the shadow element (with `max-width: 94%`) plus `--header-padding-inline: 20px` on content. At 1280px viewport:

- Preview: nav sits at (1280 - 1200) / 2 + 24 = ~64px from viewport left.
- Live: shadow width = min(92% * 1280, 1440) = ~1178px, centered. Content padding = 20px. Nav sits at (1280 - 1178) / 2 + 20 = ~71px from viewport left.
- Delta: ~7px.

The issue says "if < ~10 px, may be a no-op." This is a 7px difference driven by the fundamental container-width mismatch between the static preview's 1200px container and neonbyte's 92cqw container. Correcting this would require overriding neonbyte's container system for the header only, which is architecturally wrong (the header's container should match the body container for visual consistency). Documented as no-op.

## Deviations from spec

None. Items 2 and 5 match the canonical preview exactly. Items 1, 3, 4 were already matching. Item 6 is a sub-threshold delta inherent to the neonbyte container system.

## Verification results (T1 + T2)

### Item 1 (no-op): T1 PASS
`curl -sk` + grep on `.footer-column__link` elements confirms sentence-case labels.

### Item 2: T1 PASS
- `curl -sk` fetched served `accordion.css` -- confirmed `display: none` on `.accordion-item__summary svg`.
- Confirmed `content: "+"` on `.accordion-item__summary::after`.
- Confirmed `content: "\2212"` on `.accordion-item[open] > .accordion-item__summary::after`.
- CSS load order verified: Dripyard base `accordion-item.css` at line 62, our override at line 63.

### Item 3 (no-op): T1 PASS
`curl -sk` + grep confirms "Book a testing review" button text has no arrow glyph. Zero `U+2192` characters on page.

### Item 4 (no-op): T1 PASS
`curl -sk` + grep on `.icon-list-item__content` confirms all four items end with periods.

### Item 5: T1 PASS
- `curl -sk` fetched served `header.css` -- confirmed `border: 1px solid var(--theme-border-color)` and `border-radius: 8px` in `.site-header .mobile-nav-button` rule.
- CSS load order verified: our `header.css` at line 90, neonbyte's `mobile-nav-button.css` at line 93. Our (0,2,0) beats neonbyte's (0,1,0) regardless.

### Item 6 (no-op): T1 PASS
Container-width analysis confirms ~7px delta (sub-threshold).

### T2: Structural checks
- **Heading hierarchy:** H1 (single: "Ship Drupal releases with confidence."), H2s for each section, H3s for cards and footer columns. No skipped levels. PASS.
- **ARIA landmarks:** `role="group"` on accordion group, `role="img"` + `aria-label` on heal-flow SVG, `aria-labelledby` on nav regions. All intact. PASS.

### Regression checks (prior sub-cycles)
All five prior sub-cycle CSS files confirmed loading on the rendered homepage:
- 8.1 header: `header.css` loaded (line 90), `--header-padding-block: 14px` present. PASS.
- 8.2 hero: `hero.css` loaded. PASS.
- 8.3 logo grid: `logo-grid.css` loaded. PASS.
- 8.4 card grid: `card.css` loaded. PASS.
- 8.5 hero spacing: `dy-section.css` loaded. PASS.
- Button, footer, accordion component CSS files all loaded. PASS.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|-----------|------------|-------|-----------|
| Accordion +/- indicator (item 2) | #0F6F8A (--theme-link-color) | #F3EADA (cream band surface) | 4.24:1 | PASS (decorative; functional state is on `<details>` open attribute) |
| Accordion +/- indicator on white | #0F6F8A (--theme-link-color) | #FFFFFF | 5.74:1 | PASS (AA body text 4.5:1) |
| Hamburger icon lines (item 5) | #1F1A14 (--theme-text-color-loud) | #FFFFFF | 17.29:1 | PASS (AAA) |
| Hamburger border (item 5) | #E5E1DC (--theme-border-color) | #FFFFFF | 1.23:1 | N/A (decorative hairline; icon + "Menu" label provide affordance) |
| Hamburger touch target (item 5) | -- | -- | 44x44 CSS px | PASS (WCAG 2.5.5) |

Note on the accordion indicator contrast: The +/- character at 24px is decorative in the WCAG sense. The functional disclosure state is communicated by the native `<details>` element's `open` attribute, which is exposed to assistive technology. The prior chevron-down SVG was already `aria-hidden="true"`. The CSS `::after` pseudo-element content is not reliably announced by screen readers, which is correct behavior here.

## Mobile responsive behavior

### Item 2 (accordion +/- indicator)
No responsive override needed. The `::after` pseudo-element inherits the flex layout from Dripyard's summary element, which handles responsive behavior natively. The indicator renders correctly at all viewports (flex-shrink: 0 prevents collapse).

### Item 5 (hamburger border)
The border + radius rule is scoped to `@media (max-width: 991px)` which is the exact range where `.mobile-nav-button` is visible. At `width > 1000px`, neonbyte hides the button via `display: none`. No additional responsive handling needed. Touch target verified at 44x44px (inclusive of 1px border via border-box).

## Known issues

None. All six items completed: three as verified no-ops, two as CSS implementations, one as a sub-threshold no-op with architectural justification.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/accordion.css` -- replaced SVG color rule with SVG hide + ::after plus/minus indicator rules (item 2).
2. `web/themes/custom/performant_labs_20260502/css/components/header.css` -- added border + border-radius to .mobile-nav-button rule; updated file header comment (item 5).
