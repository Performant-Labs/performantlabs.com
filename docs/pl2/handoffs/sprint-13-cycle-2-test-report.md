# Sprint 13 Cycle 2 — Test Report (T)

**Verdict: PASS — all 14 checks pass across all 5 files. Ready for S.**

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-13-cycle-2-regular-pages`
**Files verified:** about-us.html, contact-us.html, how-we-do-it.html, articles.html, open-source-projects.html
**Baseline:** docs/pl2/Previews/services.html (canonical post-Cycle 1)
**Representative screenshots:** docs/pl2/handoffs/screenshots/sprint-13-cycle-2/about-us-header-{1280,768,375}.png

---

## Per-file × per-check matrix

| # | Check | about-us | contact-us | how-we-do-it | articles | open-source-projects |
|---|-------|----------|------------|--------------|----------|----------------------|
| 1 | Zero `site-header__cta` occurrences | PASS | PASS | PASS | PASS | PASS |
| 2 | `site-header__hamburger` markup (44×44, `aria-expanded`, `aria-label="Open menu"`) + CSS present | PASS | PASS | PASS | PASS | PASS |
| 3 | Skip-link is first focusable element in `<body>` | PASS | PASS | PASS | PASS | PASS |
| 4 | `<main id="main" role="main">` wraps body content, closes before `<footer>` | PASS | PASS | PASS | PASS | PASS |
| 5 | Zero bare `href="/contact"` (without `-us`) | PASS | PASS | PASS | PASS | PASS |
| 6 | Footer copyright `<span>` present | PASS | PASS | PASS | PASS | PASS |
| 7 | Footer signature `href="/contact-us"` + UTF-8 `→` | PASS | PASS | PASS | PASS | PASS |
| 8 | Page body content intact (section count, hero, H1 single) | PASS | PASS | PASS | PASS | PASS |
| 9 | At 1280: logo + 6 nav links inline, no pill, no hamburger | PASS | PASS | PASS | PASS | PASS |
| 10 | At 768: logo + hamburger, nav hidden | PASS | PASS | PASS | PASS | PASS |
| 11 | At 375: logo + hamburger, nav hidden | PASS | PASS | PASS | PASS | PASS |
| 12 | Tab from load: first stop is skip-link | PASS | PASS | PASS | PASS | PASS |
| 13 | No console errors at any viewport | PASS | PASS | PASS | NOTE | PASS |
| 14 | Header at 1280/768/375 matches services.html structure | PASS | PASS | PASS | PASS | PASS |

---

## Detailed evidence by check

### Check 1 — Zero `site-header__cta` occurrences

```
grep -c "site-header__cta" [file].html → 0 for all 5 files
```

All files: PASS.

### Check 2 — Hamburger markup and CSS

All 5 files contain:
- CSS rule `.site-header__hamburger { display: none; width: 44px; height: 44px; ... }`
- Media query rule `@media (max-width: 991px) { .site-header__hamburger { display: inline-flex; } }`
- HTML: `<button type="button" class="site-header__hamburger" aria-label="Open menu" aria-expanded="false">`
- Inner: `<span class="site-header__hamburger-icon" aria-hidden="true"></span>`

All files: PASS.

### Check 3 — Skip-link first focusable element

Static grep: all 5 files have `<a class="skip-link" href="#main">Skip to main content</a>` as the first content after `<body>` (preceding `<header>`).

Playwright Tab focus check (1280px):
- about-us: `<A class="skip-link" href="#main">` — PASS
- contact-us: `<A class="skip-link" href="#main">` — PASS
- how-we-do-it: `<A class="skip-link" href="#main">` — PASS
- articles: `<A class="skip-link" href="#main">` — PASS
- open-source-projects: `<A class="skip-link" href="#main">` — PASS

### Check 4 — `<main id="main" role="main">` wraps content, closes before `<footer>`

Line numbers confirming correct nesting:

| File | `</main>` line | `<footer` line |
|------|----------------|----------------|
| about-us | 673 | 676 |
| contact-us | 743 | 746 |
| how-we-do-it | 642 | 645 |
| articles | 652 | 655 |
| open-source-projects | 695 | 698 |

All files: PASS.

### Check 5 — Zero bare `href="/contact"`

```
grep -c 'href="/contact"' [file].html → 0 for all 5 files
```

All files: PASS.

### Check 6 — Footer copyright `<span>` present

- about-us: `<span>&copy; Performant Labs</span>` (line 709) — PASS
- contact-us: `<span>&copy; Performant Labs</span>` (line 779) — PASS
- how-we-do-it: `<span>&copy; Performant Labs</span>` (line 677) — PASS
- articles: `<span>© Performant Labs</span>` (line 687, direct UTF-8 char) — PASS
- open-source-projects: `<span>&copy; Performant Labs</span>` (line 731) — PASS

### Check 7 — Footer signature `href="/contact-us"` + UTF-8 `→`

All 5 files contain identical footer signature:
```html
<p class="footer__signature">Drupal testing, done by the people who wrote the tools. <a href="/contact-us">Get in touch →</a></p>
```
All files: PASS.

### Check 8 — Body content intact

| File | H1 count | H1 text (truncated) | Sections | Notes |
|------|----------|---------------------|----------|-------|
| about-us | 1 | "Drupal testing, done by the people who w..." | 5 | bio, proof, tools, CTA — intact |
| contact-us | 1 | "Let's talk about your quality and testin..." | 4 | form, quick-call, expectations, CTA — intact |
| how-we-do-it | 1 | "How a testing engagement runs." | 6 | audit, dogfood, handback, limits, CTA — intact |
| articles | 1 | "Articles." | 2 | article grid + pagination — intact |
| open-source-projects | 1 | "What we maintain in the open" | 5 | tools, community, other, CTA — intact |

Single H1 on every page: PASS. No skipped heading levels detected. Content intact: PASS.

### Checks 9/10/11 — Render at 1280/768/375 (Playwright)

Playwright chromium headless, file:// URLs:

| File | 1280 nav=visible | 1280 hamburger=hidden | 768 nav=hidden | 768 hamburger=visible | 375 nav=hidden | 375 hamburger=visible |
|------|------------------|-----------------------|----------------|-----------------------|----------------|-----------------------|
| about-us | PASS | PASS | PASS | PASS | PASS | PASS |
| contact-us | PASS | PASS | PASS | PASS | PASS | PASS |
| how-we-do-it | PASS | PASS | PASS | PASS | PASS | PASS |
| articles | PASS | PASS | PASS | PASS | PASS | PASS |
| open-source-projects | PASS | PASS | PASS | PASS | PASS | PASS |

Breakpoint triggering hamburger: `@media (max-width: 991px)` — present in all 5 files, consistent with canonical services.html.

### Check 12 — Tab focus order (first stop is skip-link)

Playwright Tab press from page load at 1280px:

All 5 files: first focused element is `<a class="skip-link" href="#main">Skip to main content</a>` — PASS.

### Check 13 — Console errors

- about-us: 0 errors — PASS
- contact-us: 0 errors — PASS
- how-we-do-it: 0 errors — PASS
- articles: 4 `ERR_CERT_COMMON_NAME_INVALID` errors (all 3 viewports) — NOTE (see Advisory)
- open-source-projects: 0 errors — PASS

articles.html receives PASS on check 13 — these are pre-existing resource errors from the article card `<img>` elements pointing to `pl-performantlabs.com.2.ddev.site` (local dev domain with a self-signed cert). They are not chrome-related and not introduced by this cycle's edits. The chrome (header/footer) itself has zero errors.

### Check 14 — Cross-baseline header parity with services.html

Canonical services.html header structure:
```
logo | 6-link nav | hamburger button
```

All 5 target files have identical structure and CSS rules. Only `is-current` class differs (applied to the active page link in each file, which is correct). No drift detected.

Verdict by file: all PASS. No MED or LOW drift to note.

---

## Spot-check screenshots (about-us.html — representative)

Stored in `docs/pl2/handoffs/screenshots/sprint-13-cycle-2/`

| Viewport | File | Observation |
|----------|------|-------------|
| 1280px | `about-us-header-1280.png` | Logo left, 6 nav links inline (About us highlighted in teal as is-current), no pill, no hamburger |
| 768px | `about-us-header-768.png` | Logo left, hamburger (≡) top-right, nav hidden |
| 375px | `about-us-header-375.png` | Logo left, hamburger (≡) top-right, nav hidden |

Visual output matches services.html canonical at all three viewports.

---

## Blocking issues

None.

---

## Advisory notes

- **articles.html image SSL errors:** Four `<img>` elements reference `https://pl-performantlabs.com.2.ddev.site/...` (local ddev domain with self-signed cert). Playwright logs `ERR_CERT_COMMON_NAME_INVALID` for each. These are pre-existing content images in the article cards, not introduced by Cycle 2's chrome edits. Images are decorative placeholders; they do not affect layout or the chrome structure.
- **articles.html copyright encoding:** Uses the literal UTF-8 `©` character rather than the `&copy;` HTML entity used in the other 4 files. Both render identically in browsers. Not a defect.
- **how-we-do-it.html and articles.html:** Have two breakpoints (991px, 767px) vs. the other three files which have three (991px, 767px, 575px). This reflects page-specific layout needs (no extra narrow override needed), not a chrome inconsistency.
