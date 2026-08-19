# Handoff-T: Sprint 5 — Final Cycle — Cross-section Verification + WCAG

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-final-verification`
**Issue:** `docs/pl2/handoffs/cycle-final-verification-issue.md`
**Handoff-F reviewed:** N/A (verification-only cycle; no F handoff — audit reviews cycle-2, cycle-3-rework-2, and cycle-4-rework F handoffs directly)

---

## Tier 1 results

### Cache clear

Command: `ddev drush cr`
Result: `[success] Cache rebuild complete.`
PASS.

### HTTP status

| Page | Command | Expected | Actual | Result |
|---|---|---|---|---|
| `/services` | `curl -sk URL:8493/services -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `/` | `curl -sk URL:8493/ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `/about-us` | `curl -sk URL:8493/about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| `/articles` | `curl -sk URL:8493/articles -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |

### All five visible sections render on `/services`

Method: `grep -c` on fetched HTML for section-specific markers.

| Section | Marker | Count | Result |
|---|---|---|---|
| Hero | `landing-hero` | 1 | PASS |
| Engagement cards | `card__eyebrow` | 17 (4 cards × multi-element) | PASS |
| Nearshore | `nearshore` (case-insensitive) | 2 | PASS |
| Wordmark / proof | `wordmark-strip` | 2 | PASS |
| Closing CTA | `theme--dark` | 1 | PASS |

Actual dripyard section count: 6 components (hero, engagements, nearshore capacity, dogfooding, wordmark strip, closing CTA). The issue's "5 visible sections" groups nearshore capacity + dogfooding as one nearshore section, which is correct by content intent.

### CSS variable presence

Theme CSS files served on `/services` (from `performant_labs_20260502`):

- `css/base.css` — 75 `--theme-*` variable declarations present. PASS.
- `css/components/card.css` — loaded. PASS.
- `css/components/grid-wrapper.css` — loaded. PASS.
- `css/components/dy-section.css` — loaded. PASS.

### Rendered content spot-check

| Content element | Expected | Actual | Result |
|---|---|---|---|
| H1 text | "Testing engagements for Drupal teams." | Present at line 522 | PASS |
| Engagements H2 | "Four ways we engage." | Present at line 562 | PASS |
| Eyebrow 01 casing | "01 / Takeover" (title case) | "01 / Takeover" | PASS |
| Eyebrow 02 casing | "02 / Embed" | "02 / Embed" | PASS |
| Eyebrow 03 casing | "03 / Pilot" | "03 / Pilot" | PASS |
| Eyebrow 04 casing | "04 / a11y" | "04 / a11y" | PASS |
| Card trailing period | "Test-suite takeover." | Present (all 4 cards) | PASS |
| Wordmark label | "We speak" | Present | PASS |
| Wordmark items | Drupal, Playwright, Cypress, PHP, JavaScript, React | All 6 present | PASS |
| Closing CTA kicker | "Book a review" | Present | PASS |
| Closing CTA H2 | "Not sure which shape fits?..." | Present | PASS |

### CTA route verification (no 404s)

All 6 non-anchor routes used in `/services` CTAs return HTTP 200:

| Path | Status | Result |
|---|---|---|
| `/about-us` | 200 | PASS |
| `/articles` | 200 | PASS |
| `/contact-us` | 200 | PASS |
| `/how-we-do-it` | 200 | PASS |
| `/open-source-projects` | 200 | PASS |
| `/privacy-policy` | 200 | PASS |
| `/docs` | 200 | PASS |

Anchor links (`/services#test-suite-takeover`, `#embedded-testing-engineer`, `#autonomous-healing-pilot`, `#accessibility-testing`) resolve to `id` attributes confirmed present on the 4 card `<article>` elements. PASS.

---

## Tier 2 results

### Heading hierarchy — `/services`

Visible heading sequence (excluding `visually-hidden` nav/breadcrumb infrastructure):

```
H1: "Testing engagements for Drupal teams."
H2: "Four ways we engage."
  H3: "Test-suite takeover."
  H3: "Embedded testing engineer."
  H3: "Autonomous-healing pilot."
  H3: "Accessibility testing."
H2: "Senior testing capacity, when you need more hands."
H2: "These aren't services we're spinning up. They're how we already work."
H2: "Not sure which shape fits? Start with a testing review."
  H3: (footer columns ×3)
```

Single H1: confirmed (1 `<h1>` tag). No skipped levels (H1 → H2 → H3, no jump from H1 to H3). PASS.

### Heading hierarchy — `/` (spot-check)

Sequence: H1 → H2 (×4) → H3 card titles → H3 footer columns. Single H1. No skips. PASS.

### Heading hierarchy — `/about-us` (spot-check)

Sequence: H1 → H2 → H2 → H3 card titles → H3 "Who we are." (subsection under H2 "Open source" section) → H2 → H2 → H3 footer columns. Single H1. The H3 at line 645 is a valid subsection under the preceding H2 at line 584 — the subsequent H2 at line 663 opens a new top-level section. No invalid skip. PASS.

### Heading hierarchy — `/articles` (spot-check)

Sequence: H1 "Articles." → H3 article card titles (6 cards). All three `<h2>` tags on the page are `visually-hidden` nav/breadcrumb infrastructure. This creates a visible H1 → H3 skip in the content area. This is **FU-7b**, confirmed pre-existing from sprint 4 wrap and explicitly marked out of scope for sprint 5 in both the sprint runbook and the orchestrator log. No sprint 5 change caused or worsened this. ADVISORY (pre-existing, out of scope).

### ARIA landmarks

| Page | `<header>` | `<main>` | `<footer>` | `<nav>` | Result |
|---|---|---|---|---|---|
| `/services` | 1 | 1 | 1 | 3 | PASS |
| `/` | 1 | 1 | 1 | 2 | PASS |
| `/about-us` | 1 | 1 | 1 | 3 | PASS |
| `/articles` | 1 | 1 | 1 | 4 | PASS |

### Semantic structure — `/services`

| Check | Finding | Result |
|---|---|---|
| Lists use `<ul>/<li>` | 4 `<ul>` elements, 102 `<li>` elements; nav menus render as `<ul>` | PASS |
| Buttons vs links | 1 `<button>` (mobile nav toggle); all CTAs are `<a href>` (correct — navigation, not actions) | PASS |
| Engagement cards semantic element | All 4 cards are `<article>` elements with `id` attributes | PASS |
| `aria-expanded` on toggles | Mobile nav button has no static `aria-expanded`; `primary-menu.js` sets it dynamically via `setAttribute('aria-expanded', toState)` on interaction — standard pattern | PASS |
| SVG accessibility | 6 SVGs present; all have `aria-hidden="true"` (decorative arrow icons) | PASS |
| Image alt text | 1 `<img>`: `class="header-logo__image"` with `alt="Home"` — correct (logo links to homepage) | PASS |

### !important regression in changed files

| File | `!important` in rules | `!important` in comments only | Result |
|---|---|---|---|
| `card.css` | 0 | 0 | PASS |
| `grid-wrapper.css` | 0 | 0 | PASS |
| `dy-section.css` | 0 | 2 (comment lines 39, 101: "No !important.") | PASS |

### Touch targets

| Element | Height mechanism | Computed height | ≥ 44px? | Result |
|---|---|---|---|---|
| `button--large` (primary CTA) | `--button-height: 56px` via `button-large.css` | 56px | Yes | PASS |
| `button` (default) | `--button-height: 48px` in `button.css` | 48px | Yes | PASS |
| `button--small` (ghost CTA secondary) | `--button-height: 35px` via `button-small.css` | 35px | **No** | ADVISORY — see note below |

`button--small` is used on the closing CTA secondary button ("Or start with the tools"). At 35px this falls below the 44px WCAG 2.5.5 / 2.5.8 threshold. This was confirmed pre-existing: the `button--outline.button--small.button--ghost-on-dark` construction is visible in `cycle-3-closing-cta-F.md` line 90 as the pre-existing DOM structure before cycle 3 began. Sprint 5 cycle 3 reordered elements and changed the primary CTA but did not introduce the `button--small` class. No sprint 5 cycle caused this. Pre-existing, not on sprint 5 scope. ADVISORY.

### Focus rings

| Surface | Focus ring color | Background | Contrast | ≥ 3:1 non-text? | Result |
|---|---|---|---|---|---|
| White / canvas | `#1893b4` | `#FFFFFF` | 3.58:1 | Yes | PASS |
| Cream `#F5EFE2` | `#1893b4` | `#F5EFE2` | 3.12:1 | Yes | PASS |
| Warm `#F2EFED` | `#1893b4` | `#F2EFED` | 3.12:1 | Yes | PASS |
| Dark / espresso | `#62BBCB` | `#1F1A14` | 7.80:1 | Yes | PASS |
| Dark zone (white) | `#FFFFFF` | `#1F1A14` | 17.27:1 | Yes | PASS |

### Pa11y on `/services`

Command: `pa11y --reporter json https://pl-performantlabs.com.3.ddev.site:8493/services`

Results: 3 errors, 0 warnings, 0 notices.

| Error | Code | Element | Root cause | PC-5 allowlisted? |
|---|---|---|---|---|
| Contrast `<a class="breadcrumb__link">Home</a>` | `WCAG2AA.1_4_3.G18.Fail` | Breadcrumb "Home" link | `#1893b4` on `#FFFFFF` = 3.58:1 (fails 4.5:1 body text threshold) | Yes — inline link `#1893b4` brand deviation, operator-approved 2026-05-11 |
| Contrast `<a class="button button--primary...">Book a testing review</a>` | `WCAG2AA.1_4_3.G18.Fail` | Primary CTA — closing CTA section | `#FFFFFF` on `#62BBCB` = 2.21:1 | Yes — button `--primary` brand deviation, operator-approved |
| Contrast `<a class="button button--primary...">Talk about capacity</a>` | `WCAG2AA.1_4_3.G18.Fail` | Primary CTA — nearshore section | `#FFFFFF` on `#62BBCB` = 2.21:1 | Yes — same button deviation |

Baseline comparison: homepage Pa11y returns 1 error (button--primary), confirming the button deviation is pre-existing site-wide and not introduced by sprint 5.

**0 new errors introduced by sprint 5 cycles.** PC-5 qualification: PASS.

### Keyboard / focus order

Interactive element DOM order on `/services`:

1. Mobile nav button (`<button class="mobile-nav-button">`) — `<span class="visually-hidden">Menu</span>` provides accessible label
2. Primary nav links (Services / How we do it / Articles / Open source projects / About us / Contact us)
3. Content CTAs: "Book a testing review" (engagements hero area, line 530), "Talk about capacity" (nearshore, line 667), "Book a testing review" (closing CTA, line 750), "Or start with the tools" (closing CTA ghost, line 761)
4. Footer links (Services sub-pages, Resources column, Company column, privacy policy, "Get in touch")

Logical reading order (header → content → footer) is preserved. No `tabindex` overrides found. PASS.

---

## WCAG contrast verification

All ratios computed independently from hex values in CSS source files using the WCAG 2.1 relative luminance formula.

### Sprint 5 WCAG spot-checks (issue requirement)

| Element | Foreground | Background | F's ratio | T's ratio | Threshold | Result |
|---|---|---|---|---|---|---|
| Wordmark strip items (Cycle 4, post-fix) | `#5C544C` | `#FFFFFF` | 7.43:1 | **7.43:1** | 4.5:1 body | PASS |
| Closing CTA H2 (cream on espresso) (Cycle 3) | `#F5EFE2` | `#1F1A14` | 13.07:1 | **15.07:1** | 3.0:1 large | PASS |
| Engagement card body text (Cycle 2) | `#5C544C` | `#FFFFFF` | 7.43:1 | **7.43:1** | 4.5:1 body | PASS |

**Discrepancy note — closing CTA H2:** F reported 13.07:1; T independently computes 15.07:1 for `#F5EFE2` on `#1F1A14`. The discrepancy is a rounding/method difference in F's intermediate computation. Both values are well above the 3.0:1 large-text AA threshold. The disposition (PASS) is identical.

**Discrepancy note — kicker:** F's cycle-3-rework-2 handoff reports "Kicker (terracotta on espresso) `#C97B5C` / `#1F1A14` = 4.47:1". T computes 5.32:1 for the same hex pair. Both exceed the 3.0:1 large-text AA threshold; PASS in both cases. F's figure appears to have used a different intermediate rounding or a slightly different foreground hex.

### Full contrast table for `/services`

| Element | Foreground | Background | T's ratio | Threshold | Result |
|---|---|---|---|---|---|
| Card title H3 | `#1F1A14` (ink-strong) | `#FFFFFF` | 17.27:1 | 4.5:1 body | PASS |
| Card body text | `#5C544C` (body) | `#FFFFFF` | 7.43:1 | 4.5:1 body | PASS |
| Card eyebrow text | `#8E4A2A` (accent-deep) | `#FFFFFF` | 6.64:1 | 4.5:1 body | PASS |
| Closing CTA H2 (cream) | `#F5EFE2` (on-dark) | `#1F1A14` (espresso) | 15.07:1 | 3.0:1 large | PASS |
| Closing CTA body (muted) | `#B8AFA0` (on-dark-muted) | `#1F1A14` | 7.96:1 | 4.5:1 body | PASS |
| Kicker (terracotta on espresso) | `#C97B5C` (accent) | `#1F1A14` | 5.32:1 | 3.0:1 large | PASS |
| Ghost CTA text | `#F5EFE2` (on-dark) | `#1F1A14` | 15.07:1 | 4.5:1 body | PASS |
| Wordmark items | `#5C544C` | `#FFFFFF` | 7.43:1 | 4.5:1 body | PASS |
| Primary CTA (approved deviation) | `#FFFFFF` | `#62BBCB` | 2.21:1 | — | PRE-APPROVED |
| Inline link (approved deviation) | `#1893b4` | `#FFFFFF` | 3.58:1 | — | PRE-APPROVED |
| Breadcrumb link (approved deviation) | `#1893b4` | `#FFFFFF` | 3.58:1 | — | PRE-APPROVED |
| Focus ring — white surface | `#1893b4` | `#FFFFFF` | 3.58:1 | 3.0:1 non-text | PASS |
| Focus ring — cream surface | `#1893b4` | `#F5EFE2` | 3.12:1 | 3.0:1 non-text | PASS |
| Focus ring — dark surface | `#62BBCB` | `#1F1A14` | 7.80:1 | 3.0:1 non-text | PASS |

---

## Mobile responsive verification

No responsive overrides were added in cycles 2, 3, or 4. All three F handoffs explicitly state "N/A — no responsive overrides in this cycle." The base mobile typography scale at `max-width: 576px` (established pre-sprint-5 in `base.css`) maps correctly to the design brief's `typography-mobile` block:

| Token | Brief mobile | CSS value | Match |
|---|---|---|---|
| `display-xl` (H1) | 44px | `--title-size: 2.75rem` = 44px | PASS |
| `display-lg` | 36px | `--h1-size: 2.25rem` = 36px | PASS |
| `display-md` | 30px | `--h2-size: 1.875rem` = 30px | PASS |
| `heading-lg` | 24px | `--h3-size: 1.5rem` = 24px | PASS |
| `heading-md` | 20px | `--h4-size: 1.25rem` = 20px | PASS |
| `heading-sm` | 17px | `--h5-size: 1.0625rem` = 17px | PASS |
| `body-lg` | 17px | `--body-l-size: 1.0625rem` = 17px | PASS |

Breakpoint: `@media (max-width: 576px)` matches brief's `sm: 576px`. PASS.

The `row-gap: 1.5rem` override on `.grid-wrapper--2col .grid-wrapper__grid` (cycle 2) applies at all viewports; at mobile the 2-col grid collapses to 1-col (confirmed via `@media (max-width: 576px)` rule in `grid-wrapper.css` forcing `grid-column: span 6`). No mobile regression introduced.

The `max-width: none` on closing CTA (cycle 3) lives inside `@media (min-width: 577px)` — it does not apply at mobile. The `.text p { max-width: 640px }` rule is unconditional but has no visible effect at 375px (container is already narrower than 640px). Confirmed by F's cycle-3 mobile analysis. PASS.

---

## Acceptance criteria status

| Criterion (from issue) | Evidence | Result |
|---|---|---|
| `/services` HTTP 200, all 5 visible sections render | HTTP 200 confirmed; all 6 section components render (hero, engagements, nearshore capacity, dogfooding, wordmark strip, closing CTA) | PASS |
| Heading hierarchy clean: single H1 (hero), no skipped levels | 1 × H1; sequence H1 → H2 → H3 confirmed, no skips on `/services` | PASS |
| ARIA landmarks `<header>`, `<main>`, `<footer>`, `<nav>` present | All 4 present on all 4 pages | PASS |
| T3 visual: every section MATCH or DELTA-with-justification vs preview at 1280 + 375 | T3 is out of T scope (Tier 3 = S responsibility per workflow); T1/T2 structural verification complete | N/A for T |
| WCAG 2.2 AA: every row of S's audit table PASS | Pre-approved deviations allowlisted (button--primary, inline link, breadcrumb); all other elements PASS — see contrast table above | PASS (T scope) |
| Pa11y: 0 new errors (allowlist via PC-5) | 3 errors, all on PC-5 allowlist (2× button--primary, 1× breadcrumb link) | PASS |
| Keyboard nav: every interactive element reachable in logical reading order with visible focus ring | DOM order confirmed logical (header → content CTAs → footer); focus ring CSS present for all surface types | PASS |
| All CTAs route correctly (no 404) | All 7 distinct routes return HTTP 200; anchor IDs confirmed present | PASS |
| Mobile (375): touch targets ≥ 44×44 CSS px; no horizontal scroll outside intentional containers | `button--large` = 56px (PASS), standard button = 48px (PASS); `button--small` = 35px (pre-existing, advisory); `overflow-x: clip` present in `dy-section.css` line 187 | PASS (one advisory) |
| Cross-page regression: `/`, `/about-us`, `/articles` T1 + T2 PASS | HTTP 200 all three; ARIA landmarks all present; heading hierarchy clean on `/` and `/about-us`; `/articles` H1→H3 skip is pre-existing FU-7b | PASS (FU-7b advisory) |

---

## Blocking issues

None.

---

## Advisory notes

1. **`/articles` H1 → H3 heading skip (FU-7b).** Visible content on `/articles` goes H1 → H3 (article card titles) with no intervening H2. Pre-existing, documented in sprint-4-wrap as FU-7b ("Out of scope; Sprint 5 does not touch `/articles`"). No sprint 5 cycle caused or worsened this.

2. **`button--small` touch target (35px).** The ghost secondary CTA on `/services` closing CTA ("Or start with the tools") uses `button--outline.button--small` which resolves to `height: 35px`, below the 44px WCAG 2.5.5 minimum. Pre-existing: the button--small class was present in the Canvas DOM before cycle 3 began (confirmed in `cycle-3-closing-cta-F.md` line 90). Sprint 5 cycle 3 did not introduce it.

3. **F's kicker contrast ratio discrepancy.** F reported `#C97B5C` on `#1F1A14` as 4.47:1. T independently computes 5.32:1. Both exceed the 3.0:1 large-text threshold. The discrepancy does not change the disposition. S should use 5.32:1 in its audit table.

4. **F's H2 (cream on espresso) contrast discrepancy.** F reported 13.07:1; T computes 15.07:1. Both exceed the 3.0:1 large-text threshold. The discrepancy does not change the disposition.

5. **No `prefers-reduced-motion` in custom theme CSS.** The custom theme does not add `prefers-reduced-motion` overrides. Dripyard base handles this in its own CSS (confirmed present). The design brief explicitly notes motion transitions as a known gap ("Default to 150ms ease-out; document when motion becomes a real surface area"). Not a blocker.

6. **Mobile nav button `aria-expanded` not in static HTML.** The mobile nav `<button>` has no `aria-expanded` in the server-rendered HTML; `primary-menu.js` sets it dynamically on interaction via `setAttribute('aria-expanded', toState)`. This is a standard progressive-enhancement pattern — the attribute is present for keyboard/AT users at the moment the button becomes interactive. Not a blocker.

7. **FU-S5-1 (768px engagement grid).** Sprint 5 orchestrator log records that at 768px the live engagement grid stays 2×2 while the preview collapses to 1-col at ≤991px. Logged as FU-S5-1. Not in scope for the final verification cycle.

8. **`prefers-reduced-motion` noted for `/about-us` closing CTA.** The `max-width: none` fix (cycle 3) applies to the `@media (min-width: 577px)` block and is purely a layout rule. No motion/animation is introduced by sprint 5 CSS changes.

---

## Decision Logic

T complete, no blocking issues. Ready for S.

S should proceed with T3 visual diff of `/services` whole-page at 1280/768/375 vs `docs/pl2/Previews/services.html`, keyboard navigation walkthrough, forced-colors mode check, and the full WCAG audit table. S should use T's independently computed contrast ratios (not F's) in its audit table where discrepancies exist (kicker 5.32:1, H2 cream 15.07:1).
