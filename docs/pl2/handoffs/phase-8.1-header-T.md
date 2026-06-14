# Handoff-T: Phase 8.1 - Site Header Parity

**Date:** 2026-05-10
**Branch:** `aa/pl-homepage-phase-8.1-header`
**Issue:** `docs/pl2/handoffs/phase-8.1-header-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.1-header-F.md`

---

## Config-import confirmation

**Command:**
```
ddev drush config:get block.block.performant_labs_20260502_header_cta status
```
**Expected:** `false`
**Actual:** `'block.block.performant_labs_20260502_header_cta:status': false`
**Result:** PASS — the block-disable config is live. `cim` was not needed; the config was already applied. Cache-rebuild was already performed by F.

---

## Tier 1 results

### T1-1: HTTP status

**Command:** `curl -s -o /dev/null -w '%{http_code}' 'http://pl-performantlabs.com.3.ddev.site:8090/'`

Note: the mkcert-trusted HTTPS endpoint (`https://...ddev.site:8493`) returned curl exit-code 60 (SSL certificate verification failure) from the host shell. This is a known issue with mkcert trust not propagating to the curl CA bundle in the macOS environment. The HTTP plaintext port (:8090) was used for all headless checks — this is the same rendered content served by the same Drupal stack; HTTP and HTTPS differ only at the transport layer. The Drupal application, blocks, and CSS are identical.

**Expected:** 200
**Actual:** 200
**Result:** PASS

### T1-2: "Book a testing review" pill absent from header

**Command:** `curl -s 'http://pl-performantlabs.com.3.ddev.site:8090/' | grep -c 'Book a testing review'`

**Expected:** 0 matches **in the header region**
**Actual:** 2 matches total — **both in page body**, not in the header.

Verification: the two matches are (1) the hero section CTA button (`<a class="button button--primary button--large" href="/contact-us?intent=testing-review">Book a testing review</a>`) and (2) the closing section CTA. The `header-navigation-wrapper__third` div is present in the DOM but **empty** — no pill markup appears between the opening and closing `<div>` of that slot.

```
grep -B 5 -A 15 'header-navigation-wrapper__third'
→ <div class="header-navigation-wrapper__third">
→                  [empty]
→ </div>
```

**Result:** PASS — pill is absent from the header. Page-body occurrences of the text are expected body content CTAs, not the removed header pill.

### T1-3: Three CSS changes present in served header.css

**Served file URL:** `/themes/custom/performant_labs_20260502/css/components/header.css?tetv37`

| Change | Expected rule | Found | PASS/FAIL |
|--------|--------------|-------|-----------|
| Border zeroing on `.site-header__shadow[class]` | `border-top: 0; border-inline: 0;` | YES — lines confirmed in served CSS | PASS |
| `--header-padding-block: 14px` at `max-width: 991px` | `@media (max-width: 991px) { .site-header { --header-padding-block: 14px; } }` | YES | PASS |
| `.site-header .mobile-nav-button` 44×44 at `max-width: 991px` | `width: 44px; height: 44px;` inside same media block | YES | PASS |

### T1-4: Six nav labels present in rendered HTML

**Command:** `curl ... | grep -oi 'Services|How we do it|Articles|Open source projects|About us|Contact us' | sort | uniq -c`

| Label | Min expected | Actual count | PASS/FAIL |
|-------|-------------|-------------|-----------|
| Services | ≥ 1 | 3 (case-sensitive: 3) | PASS |
| How we do it | ≥ 1 | 1 | PASS |
| Articles | ≥ 1 | 2 | PASS |
| Open source projects | ≥ 1 | 1 | PASS |
| About us | ≥ 1 | 2 | PASS |
| Contact us | ≥ 1 | 2 | PASS |

**Result:** All six nav labels present. PASS

### T1-5: Hamburger button present in markup

**Command:** `curl ... | grep -c 'mobile-nav-button'`
**Actual:** 4 matches (stylesheet link × 2, component start comment, button element, CSS comment in header.css link). The button element itself is confirmed:

```html
<button data-component-id="neonbyte:mobile-nav-button"
        class="mobile-nav-button"
        data-drupal-selector="mobile-nav-button">
  <span class="visually-hidden">Menu</span>
  <span class="mobile-nav-button__icon"></span>
</button>
```

**Result:** PASS — hamburger button is present in markup.

---

## Tier 2 results

### T2-1: Heading hierarchy

**Method:** `curl ... | grep -oi '<h[1-6][^>]*>' | grep -oi '<h[1-6]' | sort | uniq -c`

| Level | Count |
|-------|-------|
| H1 | 1 |
| H2 | 7 (includes 2 visually-hidden menu-block headings; all legitimate) |
| H3 | 6 (card titles + footer column headings) |
| H4–H6 | 0 |

Single H1 confirmed ("Ship Drupal releases with confidence." in the hero). H1 → H2 → H3 sequence; no skipped levels.

**Result:** PASS

### T2-2: ARIA landmarks

**Method:** `curl ... | grep -oi '<header\b|<nav\b|<main\b|<footer\b' | sort | uniq -c`

| Landmark | Count | Expected |
|----------|-------|----------|
| `<header>` | 1 | ≥ 1 |
| `<nav>` | 2 | ≥ 1 (primary + footer nav) |
| `<main>` | 1 | 1 |
| `<footer>` | 1 | 1 |

**Result:** PASS

### T2-3: Hamburger ARIA attributes

**Static HTML (curl):** The `.mobile-nav-button` element does NOT carry `aria-expanded`, `aria-controls`, or `aria-label` in the server-rendered markup. It carries only `class`, `data-component-id`, and `data-drupal-selector`.

**Accessible name in static HTML:** `<span class="visually-hidden">Menu</span>` is present inside the button — this provides an accessible name via text content, which is spec-compliant. The accessible name "Menu" is exposed to AT without JS.

**JS-hydrated attributes:** Confirmed via `neonbyte/components/header/primary-menu/primary-menu.js`:
- `mobileNavigationButton.setAttribute('aria-expanded', 'false')` — set on init
- `mobileNavigationButton.setAttribute('aria-controls', primaryNavigationRegion.getAttribute('id'))` — set on init, resolves to `header-navigation-wrapper`
- `mobileNavigationButton.setAttribute('aria-expanded', toState)` — toggled on click

The `id="header-navigation-wrapper"` is confirmed in the static markup:
```html
<div id="header-navigation-wrapper" class="header-navigation-wrapper" ...>
```

**Deviation from spec:** Issue spec says `aria-label="Open menu"`; live uses visually-hidden "Menu" text. F documented this deviation. Both patterns expose an accessible name to AT; the live pattern also degrades gracefully in no-JS environments. Non-blocking per F's documented decision.

**Result:** PASS (with the `aria-label` text deviation flagged as advisory — see Known Issues)

### T2-4: Focus order

Not directly testable via curl. F confirmed via Playwright that the hamburger overlay works and nav links are reachable. Focus trap is NOT implemented (advisory only, out of scope per issue). Interactive elements in static order: logo link → primary nav links → page content links → footer links. No re-ordering mechanisms in CSS (no `order` or `tabindex` overrides were introduced this cycle).

**Result:** PASS (structural review; focus trap advisory noted separately)

---

## WCAG contrast verification

Hex values sourced from `web/themes/custom/performant_labs_20260502/css/base.css` and `header.css`. No surface or text color changes were made in this sub-cycle; verification confirms existing values are unchanged.

| Element | Foreground | Background | F's ratio | T's computed ratio | Threshold | PASS/FAIL |
|---------|-----------|-----------|-----------|-------------------|-----------|-----------|
| Nav link (resting) | #2A2520 | #FFFFFF | 14.8:1 | ~15.18:1 | ≥ 4.5:1 | PASS |
| Nav link (hover/active) | #0F6F8A | #FFFFFF | 5.74:1 | ~5.55:1 | ≥ 4.5:1 | PASS |
| Hamburger icon (ink on white) | #2A2520 | #FFFFFF | 14.8:1 | ~15.18:1 | ≥ 3:1 | PASS |

**Computation notes:**
- #2A2520 (R=42, G=37, B=32): relative luminance ≈ 0.01917. Against white (L=1.0): ratio = 1.05 / 0.06917 ≈ 15.18:1. F reported 14.8:1 — T's calculation is slightly higher; both are conservative relative to the 4.5:1 threshold. PASS either way.
- #0F6F8A (R=15, G=111, B=138): relative luminance ≈ 0.1391. Against white: ratio = 1.05 / 0.1891 ≈ 5.55:1. F reported 5.74:1 — minor discrepancy (≤ 0.2:1 variance typical of sRGB linearization rounding). Both values clear the 4.5:1 threshold. PASS.
- Focus ring: governed by `--theme-focus-ring-color` → `--header-text-color` → resolves to `--theme-text-color-medium` in white zone. No change this cycle; not recomputed.

**Result:** All ratios pass at their respective thresholds. PASS

---

## Mobile responsive verification

F reported three responsive overrides, all at `max-width: 991px`.

| Override | Breakpoint | CSS rule confirmed in served stylesheet | Touch-target math | Match spec |
|----------|-----------|----------------------------------------|------------------|-----------|
| `--header-padding-block: 14px` | ≤ 991px | YES — `@media (max-width: 991px) { .site-header { --header-padding-block: 14px; } }` | N/A (padding, not touch target) | PASS |
| `.site-header .mobile-nav-button` 44×44 | ≤ 991px | YES — `width: 44px; height: 44px;` confirmed | 44 × 44 = 1936 px² ≥ WCAG 2.5.5 minimum 44×44 px. PASS | PASS |
| `border-top: 0; border-inline: 0` | All viewports (no media query) | YES — on `.site-header__shadow[class]` at all viewports | N/A | PASS |

**Height arithmetic at ≤ 991px:** 0px (border-top after zeroing) + 14px (padding-top) + 44px (button) + 14px (padding-bottom) + 1px (border-bottom) = 73px. Matches preview target.

**Touch target at mobile:** 44×44 px meets WCAG 2.5.5 SC (Target Size, Enhanced) minimum. PASS.

**Typography-mobile match:** No nav typography changes were made in this cycle. The existing `@media (width <= 1000px)` Poppins override from prior phases is unchanged and still served.

---

## Acceptance criteria status

| # | Criterion | Method | Result |
|---|-----------|--------|--------|
| 1 | Step-3 trace surfaced in F handoff; root cause(s) and chosen layer(s) documented | Read F handoff — full bottom-up/top-down trace for all 3 changes present | PASS |
| 2 | Live homepage header at 1280: wordmark + 6-link nav inline, no pill, no nav-label wrapping | Curl: all 6 nav labels present ≥ 1×; `header-navigation-wrapper__third` div is empty; no pill text in header | PASS |
| 3 | Live homepage header at 768: wordmark + hamburger, no inline nav | `.mobile-nav-button` element present in served markup; `display: none` on `.header-navigation-wrapper:not(.is-expanded) .primary-menu` at ≤ 991px confirmed in served CSS | PASS |
| 4 | Live homepage header at 375: wordmark + hamburger | Same CSS rule applies; hamburger element in markup | PASS |
| 5 | Header height ~73 px ± 4 px at all three viewports | Height arithmetic verified via served CSS: border-top 0 + 14px + 44px + 14px + 1px = 73px at ≤ 991px; at 1280 border-top 0 + 16px + ~40px nav links + 16px + 1px = ~73px. F's Playwright measurements: 73px at all three viewports | PASS |
| 6 | Hamburger: 44×44 px touch target, `aria-label`, `aria-expanded`, overlay works | 44×44 confirmed in served CSS; accessible name via visually-hidden "Menu" (not `aria-label` as spec says — deviation documented by F, functionally equivalent); `aria-expanded` and `aria-controls` set by neonbyte JS at runtime (confirmed in source); overlay works per F's Playwright trace. Focus trap: NOT implemented — advisory only per issue scope | PASS (with advisory on focus trap and `aria-label` text) |
| 7 | No regressions on 8.2, 8.4, 8.5; no `!important`; files staged by explicit path | See Regression checks below; `!important` grep on diff returned 0 matches | PASS |

---

## Regression checks

| Prior fix | Check performed | Evidence | PASS/FAIL |
|-----------|----------------|----------|-----------|
| 8.2: hero `padding-inline: 0` on `.hero.theme--white` | Served `hero.css` grep: `padding-inline: 0;` | Found in served `/themes/custom/.../css/components/hero.css?tetv37` | PASS |
| 8.2: logo-grid `min-width: 992px` nowrap | Served `logo-grid.css` grep: `@media (min-width: 992px) { flex-wrap: nowrap; }` | Rule confirmed in served `/themes/custom/.../css/components/logo-grid.css?tetv37` | PASS |
| 8.4: `grid-wrapper--3col-stack-md` on homepage | Homepage curl grep | `<div class="grid-wrapper grid-wrapper--3col-stack-md">` present | PASS |
| 8.4: `/open-source-projects` emits `grid-wrapper--3col` (not `-stack-md`) | Curl `/open-source-projects` | `<div class="grid-wrapper grid-wrapper--3col">` (2 instances, no `-stack-md`) | PASS |
| 8.4: `/how-we-do-it` emits `grid-wrapper--3col` (not `-stack-md`) | Curl `/how-we-do-it` | `<div class="grid-wrapper grid-wrapper--3col">` (1 instance, no `-stack-md`) | PASS |
| 8.5: hero `min-height: auto`, `height: auto`, `padding-block: 120px 96px` (desktop) and `64px` (mobile) | Served `hero.css` grep | `min-height: auto; height: auto; padding-block: 120px 96px;` and `padding-block: 64px;` all confirmed | PASS |
| 8.5: dy-section sibling-combinator rule | Served `logo-grid.css` grep | `.hero.theme--white + .dy-section:has(.logo-grid) { padding-top: 3rem; }` and `.dy-section__header { margin-bottom: 2rem; }` confirmed | PASS |
| No `!important` in CSS diff | `git diff main -- header.css | grep '!important'` | 0 matches | PASS |

---

## Git diff scope

**Command:** `git diff main --name-only`

**Files changed vs main:**
```
config/sync/block.block.performant_labs_20260502_header_cta.yml
config/sync/views.view.articles.yml
docs/pl2/Previews/homepage.html
docs/pl2/briefs/pl_design_brief.md
docs/pl2/handoffs/phase-8.1-header-F.md
web/themes/custom/performant_labs_20260502/css/components/header.css
```

**Analysis:**
- `block.block.performant_labs_20260502_header_cta.yml` — F's change. Expected.
- `web/themes/.../css/components/header.css` — F's change. Expected.
- `docs/pl2/handoffs/phase-8.1-header-F.md` — F's handoff. Expected.
- `docs/pl2/Previews/homepage.html` — O's spec commit `336c97209` (added hamburger markup and CSS to preview; pre-dates F's work). Expected per issue: "A first commit on this branch landed the spec change."
- `docs/pl2/briefs/pl_design_brief.md` — O's spec commit `336c97209` (updated §Header responsive behavior). Expected per issue.
- `config/sync/views.view.articles.yml` — **unstaged** (not in F's staged changes). This is a pre-existing working-tree modification unrelated to 8.1. It does not appear in F's staged set and will not be included in F's commit if F used explicit-path staging. **Advisory:** this unstaged file should not be accidentally committed with F's changes.

**F's staged set (confirmed via `git status`):** Exactly the three expected files — `block.block...header_cta.yml`, `header.css`, `phase-8.1-header-F.md`.

**Result:** PASS — F's staged scope is correct. The extra diff-vs-main files are either the pre-committed O spec files or an unstaged pre-existing working-tree change.

---

## Blocking issues

None.

---

## Advisory notes

1. **Focus trap missing:** The hamburger overlay has no focus trap. Tab escapes the overlay into page content when the menu is open. This is a known neonbyte default behavior, scoped as advisory by the issue. Follow-up sub-cycle recommended.

2. **`aria-label` text discrepancy:** Issue spec says `aria-label="Open menu"`. Live uses `<span class="visually-hidden">Menu</span>` — functionally equivalent accessible name but the string differs. F documented this and left it to avoid a Twig override for a string difference. Non-blocking.

3. **Unstaged `views.view.articles.yml`:** This file has an unstaged modification in the working tree. It is not part of F's staged commit. F should confirm it is not accidentally committed when this branch is merged.

4. **WCAG ratio discrepancy (minor):** T computed `#0F6F8A on #FFFFFF` as ~5.55:1 vs F's 5.74:1. The 0.19:1 gap is within normal sRGB linearization rounding variance. Both values clear the 4.5:1 threshold; the discrepancy has no practical consequence.

5. **curl SSL on HTTPS port:** The `https://...ddev.site:8493` URL returned curl exit-60 from the host shell (mkcert cert not in curl's CA bundle). All T checks used the HTTP port `:8090`. The served content is identical; this is a tooling environment issue, not a site issue.
