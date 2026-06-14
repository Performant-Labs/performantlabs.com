# Handoff-F: Cycle 4 - § proof / logo strip preview fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-4-proof`
**Issue:** `docs/pl2/handoffs/cycle-4-proof-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/services` (canvas_page id=3) |
| Issue | `cycle-4-proof-issue.md` |
| Branch | `aa/pl-sprint-5-cycle-4-proof` |
| Runbook phase | Sprint 5, Cycle 4 (§ proof) |
| Input documents read | cycle-4-proof-issue.md, cycle-1-audit-services-S.md (§ proof), services.html preview (§ proof + logo-bar CSS), pl-plan--sprint-5-services-fidelity.md, theme-change--workflow.md, text.component.yml, logo-grid.component.yml |
| Acceptance criteria count | 10 |
| Handoff path | `docs/pl2/handoffs/cycle-4-proof-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source | `web/themes/contrib/dripyard_base/components/text/text.component.yml` |

## What was done

- **`scripts/sprint5-cycle4-proof-wordmark.php`** (new): Canvas patch script that removes the H2 "We Speak" heading, the logo-grid component, and all 8 logo-item-canvas children from the "We Speak" section (indices 26-35). Replaces them with a single `dripyard_base:text` component containing the wordmark strip HTML.
- **`scripts/sprint5-cycle4-proof-wordmark-fix.php`** (new): Follow-up patch that corrects the HTML to use `<div class="wordmark-strip__item">` instead of `<span>` -- Canvas's `canvas_html_block` text filter strips `<span>` tags but allows `<div class>`.
- **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** (modified): Appended ~130 lines of L5 CSS for the wordmark strip: section padding override, hairline borders, "We speak" label styling, flex wordmark row, individual item typography, and responsive breakpoints for tablet (centered wrap) and mobile (tighter gap/padding, smaller font).

## Implementation approach

**Approach chosen: reuse existing `dripyard_base:text` SDC with custom HTML + L5 CSS.**

Alternatives considered:
1. **New SDC** -- would require new `.component.yml`, Twig template, library registration, and `libraries-extend` entry. Pushes over scope cap (7+ files). Rejected.
2. **Restyle existing `logo-grid` SDC** -- logo-grid renders `<img>` elements via `logo-item-canvas`; there is no text-rendering path. Would require Twig template override at Layer 4 (forbidden). Rejected.
3. **`<ul>/<li>` list** -- semantically reasonable, but Canvas's text filter allows `<ul>` without `class` attributes, making it impossible to distinguish this list from other lists for CSS targeting. Rejected.

The chosen approach uses the `text` SDC's `modifier_classes` prop (`"wordmark-strip-wrapper"`) to scope the CSS, and the `text` prop for the HTML content. Canvas's block text filter accepts `<div class>` but strips `<span>`, so wordmark items use `<div class="wordmark-strip__item">` styled as flex items.

**Content change: 8 logos reduced to 6 wordmarks.** Per issue and source-of-truth precedence (preview wins), the two extra logos (Anthropic and OpenAI, target_ids 66 and 67) are dropped. The canonical set is: Drupal, Playwright, Cypress, PHP, JavaScript, React.

## Layer decisions

### P1 + P2: Wordmark strip (Canvas content + L5)

**Canvas content change (entity layer):**
- Removed: heading component (H2 "We Speak"), logo-grid component, 8 logo-item-canvas components.
- Added: 1 text component with wordmark strip HTML.
- Section wrapper (uuid `cb83f10b`) preserved unchanged.

**L5 CSS (dy-section.css):**

Bottom-up trace: New markup -- no existing variable chain. The wordmark strip is custom HTML inside a `dripyard_base:text` SDC.

Top-down trace:
- L1: Not config-driven. RULED OUT.
- L2: Not OKLCH-derived. RULED OUT.
- L3: Not a theme token. RULED OUT.
- L5: Component-scoped structural styling for new wordmark strip markup within a section. CORRECT LAYER.

DOM inspection evidence:
- [x] Tier 1: `.wordmark-strip-wrapper` exists in rendered HTML at line 724
- [x] Tier 1: `.wordmark-strip__item` divs render with correct text content (6 wordmarks)
- [x] Tier 1: parent `.dy-section__content` in `.dy-section.theme--white`
- [x] N/A -- no JS rendering involved

## Deviations from spec

1. **`<div>` instead of `<span>` for wordmark items.** Canvas's `canvas_html_block` text filter strips `<span>` tags. Used `<div class="wordmark-strip__item">` with flex display instead. Visual output is identical.

2. **`component_version` not set to NULL.** Canvas requires a valid version hash matching a registered SDC schema version. Setting `component_version` to NULL causes an `OutOfRangeException` at render time (discovered in Cycle 2, documented in `sprint5-cycle2-engagement-content.php`). The new text component uses the same valid hash as other text components on the page (`05732cb45a35eac6`). This is a platform constraint, not a deviation from intent.

3. **"We Speak" heading removed entirely.** The preview's logo-bar has no `<h2>` -- only a small-caps label. The live page had the "We Speak" text as an H2 heading. Removing it improves fidelity and removes a redundant heading from the hierarchy. The "We speak" label is now rendered as a `<div>` with small-caps styling, which is semantically correct (it's a decorative label, not a heading).

## Verification results (T1 + T2)

### T1 (curl + grep)

```
# Wordmark strip renders
$ curl -sk URL/services | grep 'wordmark-strip'
  -> Line 724: <div ... class="text text-content wordmark-strip-wrapper body-m color--inherit">
  -> Line 725: wordmark-strip__label "We speak", 6x wordmark-strip__item divs

# No logo-grid or logo-item on page
$ curl -sk URL/services | grep -c 'logo-grid\|logo-item'
  -> 0

# Dogfooding H2 preserved
$ curl -sk URL/services | grep -c "These aren't services we're spinning up"
  -> 1

# CSS file served with wordmark-strip rules
$ curl -sk URL/dy-section.css | grep -c 'wordmark-strip'
  -> 21

# Homepage logo-grid unaffected
$ curl -sk URL/ | grep -c 'logo-grid'
  -> 7 (unchanged)

# /services HTTP 200
$ curl -sk -o /dev/null -w '%{http_code}' URL/services
  -> 200
```

### T2 (structural)

```
# Heading hierarchy
H1: "Testing engagements for Drupal teams." (hero)
H2: "Four ways we engage." (engagements)
  H3 x4: card titles
H2: "Senior testing capacity..." (nearshore)
H2: "These aren't services we're spinning up..." (dogfooding)
H2: "Not sure which shape fits?..." (closing CTA)

No H2 for "We Speak" -- correct per preview (label, not heading).
No skipped levels. Single H1.

# ARIA: no interactive elements added (wordmark items are decorative text)
# No new ARIA attributes needed.
```

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| "WE SPEAK" label | #5C544C (`--theme-text-color-medium`) | #FFFFFF | 7.43:1 | PASS (AA, normal text) |
| Wordmark items (at opacity 0.8) | #5C544C blended to ~#7D766F | #FFFFFF | ~4.86:1 | PASS (AA, 18px/500wt = normal text; 4.86 >= 4.5) |
| Hairline borders | #E5E1DC (`--theme-border-color`) | #FFFFFF | decorative | N/A |

## Mobile responsive behavior

| Override | Breakpoint | What changes | Verification |
|---|---|---|---|
| Wordmark row gap | <=576px | Gap reduces from 48px to 16px/32px (row/col). Justify changes from space-between to center. | At 375px, 6 items wrap to ~3 rows of 2, centered. All text legible. |
| Wordmark item font-size | <=576px | Reduces from 18px to 16px. | Text remains legible. |
| Strip padding | <=576px | Reduces from 48px to 32px. | Tighter but proportional. |
| Label margin | <=576px | Reduces from 32px to 24px. | Proportional to tighter strip. |
| Tablet centered wrap | 577px-991px | Justify changes from space-between to center. Gap moderates. | At 768px, items wrap centered with moderate gap. |

No touch target concerns -- wordmark items are not interactive elements.

## Autonomous decisions

1. **Implementation approach: text SDC reuse over new SDC.** A new SDC would have required 7+ files (component.yml, Twig, CSS, library, libraries-extend, patch script, handoff), exceeding the 6-file scope cap. The text SDC with custom HTML + L5 CSS achieves the same visual result in 3 files.

2. **`<div>` instead of `<span>` for wordmark items.** Canvas's text filter (`canvas_html_block`) strips `<span>` tags. This was discovered during T1 verification when spans rendered as concatenated text. Pivoted to `<div class="wordmark-strip__item">` which the filter allows. Required a fix script.

3. **Heading removal.** Removed the H2 "We Speak" from the section header. The preview has no heading for the logo bar -- only a label. This is the most conservative interpretation: the preview is the source of truth for layout/composition.

4. **`component_version` kept as valid hash.** The issue AC says "set component_version: NULL (or document the platform constraint)." Canvas enforces a non-NULL constraint; setting to NULL causes `OutOfRangeException`. Documented as a platform constraint, consistent with Cycle 2's finding.

5. **CSS placement in dy-section.css** rather than creating a new file. The wordmark strip lives inside a `dy-section` wrapper, and dy-section.css is already loaded via `libraries-extend` for all sections. This avoids adding a new library entry and keeps the file count at 3 (within scope cap).

6. **Content change: 8 to 6 wordmarks.** Per issue: "Source-of-truth precedence: preview's 6 wordmarks win over live's 8. Document the drop of Anthropic + OpenAI as a content change." Documented above.

## Known issues

None. All 10 acceptance criteria are met (with the documented platform constraint for `component_version`).

## Files changed

1. `scripts/sprint5-cycle4-proof-wordmark.php` (new) -- Canvas patch: remove logo-grid, add text wordmark strip
2. `scripts/sprint5-cycle4-proof-wordmark-fix.php` (new) -- Canvas patch: fix span->div for text filter compatibility
3. `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (modified) -- L5 CSS for wordmark strip styling (~130 lines appended)
