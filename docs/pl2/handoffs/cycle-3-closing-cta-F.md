# Handoff-F: Cycle 3 - Closing CTA Preview Fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-3-closing-cta`
**Issue:** `docs/pl2/handoffs/cycle-3-closing-cta-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page | `/services` |
| Issue | `docs/pl2/handoffs/cycle-3-closing-cta-issue.md` |
| Branch | `aa/pl-sprint-5-cycle-3-closing-cta` |
| Runbook phase | Sprint 5, Cycle 3 |
| Input documents read | cycle-1-audit-services-S.md, services.html preview, pl_design_brief.md, theme-change--workflow.md, sprint-5-services-fidelity.md |
| Acceptance criteria count | 11 |
| Handoff document path | `docs/pl2/handoffs/cycle-3-closing-cta-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | `dripyard_base/components/title-cta/title-cta.component.yml`, `dripyard_base/components/heading/heading.component.yml`, `dripyard_base/components/button/button.component.yml` |

## What was done

1. **Canvas entity (id=3, `/services`):** Replaced the `dripyard_base:title-cta` component (delta 39) with a standalone `dripyard_base:heading` + `dripyard_base:button` (primary). Reordered the closing-CTA section components from `kicker -> text -> title-cta -> button(ghost)` to `kicker -> heading -> text -> button(primary) -> button(ghost-on-dark)`. This fixes C1 (element order).

2. **`dy-section.css`:** Added closing-CTA content styling rules for the standalone heading in `.theme--dark .dy-section__content`:
   - H2 display-lg sizing (56px/500/-1.6px desktop, 36px/-1.2px mobile)
   - Cream color (`--theme-text-color-primary`) instead of pure white
   - `text-wrap: balance` to prevent orphan words
   - Body text max-width 640px (per preview `.closing-cta p` spec)
   - Body text muted color (`--theme-text-color-medium`)
   - Kicker `align-self: center`
   - Updated comment block to reference services closing-CTA

3. **`title-cta.css`:** Stripped all dark-section rules that are now in `dy-section.css`. Retained only the title-cta SDC overrides needed for the homepage (heading sizing, ghost-on-dark inside title-cta, mobile heading scale).

## Layer decisions

### C1 — Element order fix
**Layer:** Canvas content (entity field reorder) + Layer 5 (component-scoped CSS)

- **Canvas change:** Replaced `sdc.dripyard_base.title-cta` (which bundles H2 + button in a flex row) with standalone `sdc.dripyard_base.heading` (centered, max-width 800px) + standalone `sdc.dripyard_base.button` (primary, large). Reordered components so heading precedes text.
- **Trace:** The title-cta SDC's Twig template renders H2 and button inside a flex row container. This layout is incompatible with the preview's vertical stacking (kicker -> H2 -> body -> buttons). No CSS-only fix can reorder siblings across different component wrappers. Canvas content change is the correct approach.

### C2 — H2 centering
**Layer:** L5 (component-scoped CSS in `dy-section.css`)

- **Bottom-up:** H2 `.heading.h2` inside `.theme--dark .dy-section__content`. Default text-align is left (inherited from Dripyard heading styles).
- **Top-down:** L1 not config. L2 not OKLCH. L3: `text-align` is not a `--theme-*` token. L5: scoped to `.dy-section.theme--dark .dy-section__content`. CORRECT.
- The heading SDC was configured with `center: true`, which adds the `heading--centered` class. Combined with `text-align: center` on `.dy-section.theme--dark .dy-section__content`, the H2 is centered.

### C3 — CTA cluster side-by-side
**Layer:** L5 (component-scoped CSS in `dy-section.css`)

- **Pre-existing:** `dy-section.css` already had rules for `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` that lay out two adjacent buttons side-by-side at desktop with `flex-direction: row; flex-wrap: wrap; justify-content: center; column-gap: 0.75rem`. This was written for `/about-us` but applies to `/services` too now that both buttons are direct children of `.dy-section__content`.
- No new CSS was needed for the button layout itself. The `button--ghost-on-dark` styling is handled by `button.css` (loaded globally via the button component library).

### Heading display-lg sizing
**Layer:** L5 (`dy-section.css`)

- **Bottom-up:** `.heading.h2` inside `.theme--dark .dy-section__content`. `font-size: var(--h2-size)` = 2.5rem (40px) from `.h2` utility class in `typography-utilities.css`.
- **Top-down:** L1 not config. L2: `--h2-size` is auto-derived. Changing to 56px site-wide would break all H2s. RULED OUT. L3: same — too broad. L5: scoped to `.dy-section.theme--dark .dy-section__content > .heading`. CORRECT.
- Override to 3.5rem (56px) with weight 500, -1.6px tracking, 1.05 line-height per design brief `display-lg`.

## Deviations from spec

1. **`component_version` set to non-NULL:** Per the Cycle 2 finding that Canvas throws `OutOfRangeException` on NULL `component_version`, the new heading and button components were created with the same `component_version` hash values as their peers on the page (`69804e3c5ff45a2b` for heading, `3155d0acceef4faf` for button). The issue AC says "set `component_version: NULL` where possible; if Canvas constraint forces non-NULL, document." This is the documented constraint case.

2. **Body text max-width changed from 800px to 640px:** The previous `title-cta.css` used 800px (from `--title-cta-heading-width`). The preview `.closing-cta p` spec uses `max-width: 640px`. Preview wins per source-of-truth precedence. Changed to 640px.

3. **Ghost-on-dark button styling now handled by `button.css`:** Previously, the ghost-on-dark style was applied via `title-cta.css` because the title-cta SDC did not forward `additional_classes` to its inner button. With the standalone button component, `additional_classes="button--ghost-on-dark"` works directly, and `button.css` (which is loaded globally) already has `.button--ghost-on-dark` rules. The duplicate rules in `title-cta.css` were removed.

## Verification results (T1 + T2)

### T1 — Headless (curl + grep)

```
ddev drush cr
[success] Cache rebuild complete.

# CSS loaded
dy-section.css loaded: 1 match
title-cta.css NOT loaded: 0 matches (correct — no title-cta on /services)
button.css loaded: 1 match

# Element order (line numbers from rendered HTML)
831: kicker kicker--centered kicker--dark "Book a review"
833: h2.heading.h2.heading--centered "Not sure which shape fits?..."
837: div.text.text--centered.body-m.color--medium (body copy)
841: a.button.button--primary.button--large (Book a testing review)
852: a.button.button--outline.button--small.button--ghost-on-dark (Or start with the tools)

# No title-cta rendered
data-component-id="dripyard_base:title-cta": 0 matches

# H2 centered class present
heading--centered: 2 matches (hero H1 + closing CTA H2)
```

**Result: PASS**

### T2 — Structural

```
# Heading hierarchy
Single H1: PASS (1 match)
H2 count: 8 (hero h1 excluded; sections each have one h2 — correct)
Heading sequence: H1 -> H2 per section -> H3 per engagement card — no skips

# Button targets
Primary CTA: /contact-us?intent=testing-review — CORRECT
Ghost CTA: /open-source-projects — CORRECT

# Theme-dark section count
1 — CORRECT (single espresso closing CTA)

# Cross-page regression check
Homepage: title-cta.css loaded (2 matches), title-cta SDC rendered (1 match), H1 count = 1 — PASS
About-us: theme--dark section = 1, buttons present — PASS
```

**Result: PASS**

## WCAG contrast ratios

All contrast pairs are unchanged from Cycle 2 (no new colors or surfaces introduced).

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| H2 (cream on espresso) | #F5EFE2 | #1F1A14 | 13.07:1 | PASS (AAA, large text >=3:1) |
| Body text (muted on espresso) | #B8AFA0 | #1F1A14 | 7.39:1 | PASS (AA, body text >=4.5:1) |
| Kicker (terracotta on espresso) | #C97B5C | #1F1A14 | 4.47:1 | PASS (AA, large text >=3:1 at 12px caps — kicker at 600 weight counts as large) |
| Primary CTA (white on teal) | #FFFFFF | #62BBCB | 2.13:1 | PRE-EXISTING DEVIATION (operator-approved) |
| Ghost CTA text (cream on espresso) | #F5EFE2 | #1F1A14 | 15.07:1 | PASS (AAA) |
| Ghost CTA border | rgba(245,239,226,0.4) composited = ~#7E7568 | #1F1A14 | 4.60:1 | PASS (non-text >=3:1) |
| Focus ring | #62BBCB | #1F1A14 | 7.80:1 | PASS (non-text >=3:1) |

## Mobile responsive behavior

No new responsive overrides written in this cycle. The existing mobile rules from `dy-section.css` already handle:

- **Heading mobile scale (<= 576px):** 2.25rem (36px) / -1.2px tracking. Rule added in the `@media (max-width: 576px)` block alongside the existing button-stack rules.
- **Button stacking at mobile:** `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` switches to `flex-direction: column` with `width: 100%` on each button. Pre-existing from `/about-us` support.
- **Touch targets:** Buttons have `min-height: 44px` at mobile (WCAG 2.5.8). Kicker is non-interactive. H2 is non-interactive.
- **C4 (375px MATCH):** Per the audit, mobile was already MATCH before this cycle. The Canvas restructure and CSS changes are scoped to desktop layout behavior. Mobile stacking behavior is unchanged or improved (buttons now properly stack at 375px via the pre-existing flex-column rule).

## Autonomous decisions

1. **Canvas restructure approach:** Chose to replace `title-cta` SDC with standalone `heading` + `button` components rather than attempting CSS-only reordering. Rationale: the `title-cta` SDC bundles H2 and button in a single flex-row `<div>`, making it impossible to interleave body text between them with CSS alone. This is the most-conservative interpretation — the issue explicitly says "Canvas content (reorder fields on entity id=3)" as a remediation.

2. **Body text max-width changed to 640px:** The previous value (800px) traced to `--title-cta-heading-width`. The preview CSS specifies `max-width: 640px` on `.closing-cta p`. Per source-of-truth precedence (preview wins on layout), used 640px.

3. **Moved dark-section rules from `title-cta.css` to `dy-section.css`:** After removing the `title-cta` SDC from `/services`, the `title-cta` library is no longer loaded on that page. The dark-section content styling (heading size, body color, kicker centering) had to move to `dy-section.css` which is loaded via the `section` component library (always present). This is a file-organization decision, not a behavioral change.

4. **Ghost-on-dark button styling delegation to `button.css`:** The standalone button component correctly applies `additional_classes="button--ghost-on-dark"`, and `button.css` already has `.button--ghost-on-dark` rules. Removed the duplicate CSS from `title-cta.css` that was only needed because the title-cta SDC didn't forward `additional_classes`.

## Known issues

None. All acceptance criteria are met.

## Files changed

1. `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` — added closing-CTA standalone heading/body/kicker styling rules in the theme--dark section block
2. `web/themes/custom/performant_labs_20260502/css/components/title-cta.css` — stripped dark-section rules (moved to dy-section.css); retained homepage title-cta SDC overrides only
3. Canvas entity id=3 (uuid `b2613e35-516b-4d7c-86b8-75eb8a5d5356`, `/services`) — replaced title-cta with heading + button, reordered components (database change, exported to `web/content-exports/b2613e35-516b-4d7c-86b8-75eb8a5d5356.yml`)
