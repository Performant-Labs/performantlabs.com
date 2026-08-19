# Handoff-T: how-we-do-it pass-3 verification

**Date:** 2026-05-05
**Branch:** `main`
**Overlay applied:** `content-exports/how-we-do-it-rewrite-pass-3.overlay.yml`
**CSS modified:** `web/themes/custom/performant_labs_20260502/css/components/dy-section.css`
**Preview reference:** `docs/pl2/Previews/how-we-do-it.html`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|-------|---------|----------|--------|--------|
| Cache clear | `ddev drush cr` | "Cache rebuild complete" | "Cache rebuild complete" | PASS |
| HTTP status | `curl -sk https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| dy-section.css loaded | grep linked stylesheets | `/css/components/dy-section.css` present in `<head>` | `/themes/custom/performant_labs_20260502/css/components/dy-section.css?telbi8` confirmed in `<head>` line 86 | PASS |
| CSS variables: `--text-max-width: 800px` | `grep '800px'` in fetched HTML | At least one text component inline style | Seven instances of `style="--text-max-width: 800px;"` found | PASS |
| Rendered H1 text | grep `How a testing engagement runs` | Present | Present at line 584–585 | PASS |
| Kicker text "Process" | grep in kicker spans | Present | `<span class="kicker kicker--centered kicker--light">Process</span>` at line 582 | PASS |

---

## Tier 2 results

| Check | Method | Result |
|-------|--------|--------|
| ARIA: `<header>` | grep `<header` | PASS — 1 instance |
| ARIA: `<main>` | grep `<main` | PASS — 1 instance |
| ARIA: `<footer>` | grep `<footer` | PASS — 1 instance |
| ARIA: `<nav>` | grep `<nav ` | PASS — 3 instances (primary nav, breadcrumb nav, footer nav) |
| Skip link | grep `skip-link` | PASS — `<a class="skip-link" href="#main-content">Skip to main content</a>` present |
| SVG icons aria-hidden | grep `aria-hidden="true"` on CTA button SVG | PASS — confirmed at line 782 |
| Interactive elements: buttons use `<a class="button">` not `<button>` (correct for links) | grep button elements | PASS — all interactive elements are anchor tags with button classes |
| `aria-current="page"` on active nav link | grep `aria-current` | PASS — `/how-we-do-it` nav link has `aria-current="page"` at line 281 |

---

## Acceptance criteria status

### 1. Kickers: 5 total

| Kicker | Expected class | Live class | Text | Result |
|--------|---------------|------------|------|--------|
| Hero | `kicker--centered` | `kicker kicker--centered kicker--light` | "Process" | PASS |
| Week 1 | `kicker--inline` | `kicker kicker--inline kicker--light` | "Week 1" | PASS |
| Week 2 | `kicker--inline` | `kicker kicker--inline kicker--light` | "Week 2" | PASS |
| Week 3+ | `kicker--inline` | `kicker kicker--inline kicker--light` | "Week 3+" | PASS |
| CTA | `kicker--centered kicker--dark` | `kicker kicker--centered kicker--dark` | "Get started" | PASS |

Total kicker count: 5. All match preview spec.

### 2. Section themes in order

| Section | Expected | Live `class` | Result |
|---------|----------|-------------|--------|
| Hero | white | `theme--white` | PASS |
| Week 1 (Audit) | light/cream | `theme--light` — surface `#F5EFE2` | PASS |
| Week 2 (Dogfood) | white | `theme--white` | PASS |
| Week 3+ (Take over / hand back) | secondary/warm | `theme--secondary` — surface `#F2EFED` | PASS |
| What we don't do | light/cream | `theme--light` — surface `#F5EFE2` | PASS |
| CTA | dark/espresso | `theme--dark` — surface `#1F1A14` | PASS |

### 3. Heading texts

| Element | Expected text | Live text | Result |
|---------|--------------|-----------|--------|
| H1 | "How a testing engagement runs" | "How a testing engagement runs" (line 585) | PASS |
| H2 (§B) | "Audit." | "Audit." (line 607) | PASS |
| H2 (§C) | "Stand up the dogfood loop." | "Stand up the dogfood loop." (line 644) | PASS |
| H2 (§D) | "Take over or hand back." | "Take over or hand back." (line 666) | PASS |
| H2 (§E) | "What we don't do." | "What we don't do." (line 745) | PASS |
| H2 (§F CTA) | "Want a one-page audit of your testing surface?" | "Want a one-page audit of your testing surface?" (line 774) | PASS |

### 4. Cards: 3 cards with eyebrow text, NO images

| Card | Eyebrow expected | Eyebrow live | Has image | Result |
|------|-----------------|-------------|-----------|--------|
| 1 | "01 / Hand back" | "01 / Hand back" (line 686) | No — `card__layout` contains only `card__bottom` | PASS |
| 2 | "02 / Take over" | "02 / Take over" (line 703) | No | PASS |
| 3 | "03 / Embed" | "03 / Embed" (line 720) | No | PASS |

No `card__image` or `card__media` wrapper found in card markup.

### 5. CTA section: espresso background, subtitle paragraph, TWO buttons

| Element | Expected | Live | Result |
|---------|----------|------|--------|
| Theme | `theme--dark` (espresso `#1F1A14`) | `class="dy-section theme--dark"` (line 761) | PASS |
| Subtitle paragraph | "A 30-minute call..." | Present at line 793–794: "A 30-minute call with a senior engineer..." | PASS |
| Primary button | `button--primary` → `/contact-us?intent=testing-review` | `class="button button--primary button--large"` href `/contact-us?intent=testing-review` (line 779) | PASS |
| Ghost/outline button | `button--ghost-on-dark` → `/services` | `class="button button--outline button--large button--ghost-on-dark"` href `/services` (line 797) | PASS |

Note: The DOM order in live is `title-cta (h2 + primary btn) > subtitle text > ghost btn`, which differs from the preview's `h2 > subtitle > [primary + ghost]`. This is an accepted structural difference due to the `title-cta` Canvas component containing the heading and its paired primary button as a unit. Both buttons are present in the section. This is a Canvas component model constraint, not a defect.

### 6. Header CTA: "Book a testing review" linking to `/contact-us?intent=testing-review`

Live line 394: `<a class="button button--primary button--large" href="/contact-us?intent=testing-review">Book a testing review</a>` — PASS

### 7. Graph: canvas-image with radius-large class, followed by caption text

- `canvas-image canvas-image--radius-large` present at line 617 — PASS
- Image source: `/sites/default/files/migration/how-we-do-it/RelativeCost.png` (srcset with .avif variants) — PASS
- Caption text component follows immediately after: "Bugs that escape the test suite cost an order of magnitude more to fix in production than in CI..." (lines 628–631) — PASS
- `alt="How We Do It - Relative Cost of Fixing Bugs"` present — PASS

### 8. Prose max-width: text components with `--text-max-width: 800px`

Seven `style="--text-max-width: 800px;"` instances found in live HTML. All text components carry this inline style. PASS.

### 9. Hero centering: H1 with centered class, lead paragraph centered

- H1 has `heading--centered` class (line 584) — PASS
- Lead paragraph text component has `text--centered` class (line 592) — PASS

### 10. Heading hierarchy: h1 > h2 (x5+) > h3 (x4), no skipped levels

Content heading sequence (excluding visually-hidden and navigation headings):

1. `<h1>` — "How a testing engagement runs"
2. `<h2>` — "Audit."
3. `<h2>` — "Stand up the dogfood loop."
4. `<h3>` (inline in text body) — "What changes from 'we monitor your site'"
5. `<h2>` — "Take over or hand back."
6. `<h3>` — "Hand back, green." (card)
7. `<h3>` — "Take over, ongoing." (card)
8. `<h3>` — "Embed, instead." (card)
9. `<h2>` — "What we don't do."
10. `<h2>` — "Want a one-page audit of your testing surface?"

Single H1: PASS. H2s all descend from H1: PASS. H3s all descend from H2s (h3 in §C is under H2 "Stand up the dogfood loop."; h3 cards are under H2 "Take over or hand back."): PASS. No skipped levels: PASS.

### 11. Regression check: /services kickers, cards, buttons

| Element | Expected still working | Live result | Result |
|---------|----------------------|-------------|--------|
| HTTP status | 200 | 200 | PASS |
| Kickers on /services | All `kicker--centered` (services page has no inline kickers) | 5 kickers, all `kicker--centered kicker--light` or `kicker--centered kicker--dark` | PASS |
| Cards with eyebrow text | Present | 4 `card__eyebrow-text` elements found (lines 650, 666, 682, 698) | PASS |
| Primary button | Present | `button--primary button--large` at lines 598, 735, 910 | PASS |
| Ghost-on-dark button | Present | `button--outline button--small button--ghost-on-dark` at line 924 | PASS |

The `:has(.kicker--centered)` scoping in `dy-section.css` did not break services centering behavior. PASS.

---

## WCAG contrast verification

All hex values sourced directly from `/themes/custom/performant_labs_20260502/css/base.css`.

| Element | Foreground | Background | Ratio | Threshold | Result |
|---------|-----------|------------|-------|-----------|--------|
| Body text, theme--light | `#5C544C` | `#F5EFE2` | **6.48:1** | 4.5:1 | PASS |
| Heading text, theme--light | `#2A2520` | `#F5EFE2` | **13.24:1** | 4.5:1 | PASS |
| Link, theme--light | `#0F6F8A` | `#F5EFE2` | **5.01:1** | 4.5:1 | PASS |
| Body text, theme--secondary | `#5C544C` | `#F2EFED` | **6.49:1** | 4.5:1 | PASS |
| Heading text, theme--secondary | `#2A2520` | `#F2EFED` | **13.26:1** | 4.5:1 | PASS |
| Link, theme--secondary | `#0F6F8A` | `#F2EFED` | **5.01:1** | 4.5:1 | PASS |
| Heading text, theme--white | `#2A2520` | `#FFFFFF` | **15.17:1** | 4.5:1 | PASS |
| Body text, theme--white | `#5C544C` | `#FFFFFF` | **7.43:1** | 4.5:1 | PASS |
| Link, theme--white | `#0F6F8A` | `#FFFFFF` | **5.74:1** | 4.5:1 | PASS |
| Text on dark (CTA), theme--dark | `#F5EFE2` | `#1F1A14` | **15.07:1** | 4.5:1 | PASS |
| Link on dark, theme--dark | `#5DC6E8` | `#1F1A14` | **8.81:1** | 4.5:1 | PASS |
| Focus ring, theme--light / secondary | `#1893b4` | `#F5EFE2` | N/A — verified in prior sprint as 3.10:1 (≥3:1) | 3:1 | PASS (prior) |
| Focus ring, theme--dark | `#62bbcb` | `#1F1A14` | N/A — verified in prior sprint as ≥3:1 | 3:1 | PASS (prior) |

No discrepancies with F-reported ratios. Comments in `base.css` cite `5.01:1` for link on `#F5EFE2` and `5.74:1` for link on `#FFFFFF`; both independently confirmed by T.

---

## Mobile responsive verification

`dy-section.css` contains two mobile breakpoints:

| Breakpoint | Rule | Purpose | Verified present | Touch target |
|-----------|------|---------|-----------------|--------------|
| `@media (min-width: 577px)` | Services hero CTA pair: `display: flex; flex-direction: row; justify-content: center` | Desktop: side-by-side buttons | CSS rule confirmed at line 94–116 | `min-height: 44px` on `.button` at line 114 — PASS |
| `@media (max-width: 576px)` | Services hero CTA pair: `display: flex; flex-direction: column; align-items: center` | Mobile: stacked buttons | CSS rule confirmed at line 119–131 | `min-height: 44px; width: 100%` at line 129–130 — PASS |
| `@media (max-width: 576px)` | Header centering: `max-width: 100%` for centered kicker sections | Mobile: no clipping of 820px cap | CSS rule confirmed at line 135–140 | N/A |

Graph card container (`canvas-image` in `theme--light`) has `max-width: 720px` and `overflow: clip` — no additional mobile breakpoint defined. This is consistent with the canvas-image component's own responsive handling.

---

## Blocking issues

None.

---

## Advisory notes

1. **CTA DOM order differs from preview.** The `title-cta` Canvas component couples the H2 heading with the primary CTA button inside a single container. The subtitle paragraph and ghost button sit outside the `title-cta` container as sibling components. The preview shows h2 → subtitle → both buttons in a single block. Visually this is acceptable since the subtitle still appears between the primary CTA and the ghost button in the rendered DOM (lines 792–797). Not a defect.

2. **Graph block has a real image, not a placeholder.** The preview used a CSS placeholder div (`graph-block__placeholder` with text "Relative cost of fixing bugs graph"). The live page renders an actual image (`RelativeCost.png` with srcset/avif variants, `width="720" height="539"`). This is an improvement over the preview, not a regression.

3. **`theme--secondary` surface is `#F2EFED` (warm gray), not the theme's OKLCH-derived secondary value `#ea8b1f`.** The custom `base.css` overrides `--theme-surface` for `.theme--secondary` to the project's surface-warm token, which is the intended "warm" section treatment. The orange `#ea8b1f` primary secondary color is not used as a surface. This is intentional design-system behavior, not a bug.

4. **"What we don't do" has no kicker.** The preview also had no kicker for that section. The live section header contains only the H2 heading, no kicker span. This matches the preview exactly.
