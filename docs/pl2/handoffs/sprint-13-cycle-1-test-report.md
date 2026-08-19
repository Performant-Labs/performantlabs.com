# Sprint 13 Cycle 1 — Services Header Chrome Test Report

**Verdict: PASS — no blocking issues. Ready for S.**

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-13-cycle-1-services-baseline`
**File verified:** `docs/pl2/Previews/services.html`
**Baseline:** `docs/pl2/Previews/homepage.html`
**No F handoff doc found** (changes were uncommitted working-tree edits verified directly)

---

## Structural checks (read-file / grep)

| # | Check | Method | Result | Status |
|---|-------|--------|--------|--------|
| 1 | Zero `site-header__cta` occurrences | `grep -c` → 0 | 0 matches | PASS |
| 2a | `site-header__hamburger` CSS present (44×44, `display:none` default) | grep CSS block lines 177–203 | CSS block present; `width: 44px; height: 44px;` confirmed | PASS |
| 2b | `site-header__hamburger` markup: `aria-label="Open menu"`, `aria-expanded="false"` | grep line 525 | `<button type="button" class="site-header__hamburger" aria-label="Open menu" aria-expanded="false">` | PASS |
| 2c | Hamburger icon `aria-hidden="true"` on inner span | grep line 526 | `<span class="site-header__hamburger-icon" aria-hidden="true"></span>` | PASS |
| 2d | Hamburger matches homepage pattern (CSS values identical) | grep+compare | Width/height/border/border-radius/padding identical to homepage | PASS |
| 3 | Skip-link `<a class="skip-link" href="#main">` is first focusable element in `<body>` | grep line 508; Playwright `querySelectorAll('a[href],button,[tabindex]')[0].className` | First focusable class: `skip-link`; href resolves to `#main` | PASS |
| 4a | `<main id="main" role="main">` present | grep line 542 | Present at line 542 | PASS |
| 4b | `</main>` closes before `<footer>` | grep lines 652, 655 | `</main>` at 652, `<footer>` at 655 | PASS |
| 5 | Zero bare `href="/contact"` (without `-us`) | `grep 'href="/contact[^-]'` → 0; `grep 'href="/contact"'` → 0 | 0 matches | PASS |
| 6 | Body content (hero, 4 engagement cards, nearshore, proof, logo-bar, closing-cta, footer) intact | grep section classes + git diff removed lines | All 6 content sections present; diff removals are all chrome-only (CSS rule + 3 href + 1 CTA anchor) | PASS |

### Removed lines (all chrome, no body content lost)

```
-    .site-header__cta { margin-left: var(--space-lg); }
-        <a href="/contact">Contact us</a>
-      <a href="/contact" class="btn btn--primary site-header__cta">Call today</a>
-            <li><a href="/contact">Contact us</a></li>
-          <p class="footer__signature">... <a href="/contact">Get in touch →</a></p>
```

---

## Render checks (Playwright headless Chromium)

| # | Check | Viewport | Result | Status |
|---|-------|----------|--------|--------|
| 7a | Header shows logo + 6 nav links inline | 1280 | NAV visible: true; 6 links confirmed | PASS |
| 7b | No right-side CTA pill at 1280 | 1280 | `.site-header__cta` exists: false | PASS |
| 7c | No hamburger button visible at 1280 | 1280 | `.site-header__hamburger` visible: false | PASS |
| 8a | Header shows logo + hamburger at 768 | 768 | Hamburger visible: true | PASS |
| 8b | Nav links hidden at 768 | 768 | NAV visible: false | PASS |
| 9a | Header shows logo + hamburger at 375 | 375 | Hamburger visible: true | PASS |
| 9b | Nav links hidden at 375 | 375 | NAV visible: false | PASS |
| 10a | First Tab stop is skip-link | 1280 | First focusable: class=`skip-link` | PASS |
| 10b | Skip-link href points to `#main` | 1280 | href resolves to `…services.html#main` | PASS |
| 11 | No console errors at any viewport | 1280/768/375 | 0 errors at all three viewports | PASS |
| 12a | `<main>` present in DOM with id="main" | 1280 | `main.id` = "main" | PASS |
| 12b | `<main>` has role="main" | 1280 | `main.getAttribute('role')` = "main" | PASS |
| 12c | Element after `</main>` is `<footer>` | 1280 | `main.nextElementSibling.tagName` = "FOOTER" | PASS |

---

## Cross-baseline parity (services vs homepage header)

| Viewport | Pixel diff (AE) | Notes |
|----------|-----------------|-------|
| 1280 | 457 px | Entirely "Services" link shown as `is-current` (teal `#1893b4`). Correct page-specific behavior, not a defect. Structure is identical. |
| 768 | 0 px | Pixel-perfect match |
| 375 | 0 px | Pixel-perfect match |

Both pages use the same hamburger breakpoint (`max-width: 991px`), identical CSS values, and the same 6-link nav. No structural divergence.

---

## Screenshots

Saved to `docs/pl2/handoffs/screenshots/sprint-13-cycle-1-services/`:

| File | Description |
|------|-------------|
| `services-header-1280.png` | Services header at 1280 — logo left, 6 inline nav links, no CTA pill |
| `services-header-768.png` | Services header at 768 — logo left, hamburger right, nav hidden |
| `services-header-375.png` | Services header at 375 — logo left, hamburger right, nav hidden |
| `homepage-header-1280.png` | Homepage header at 1280 (baseline) |
| `homepage-header-768.png` | Homepage header at 768 (baseline) |
| `homepage-header-375.png` | Homepage header at 375 (baseline) |
| `diff-header-1280.png` | Pixel diff 1280 — only "Services" is-current highlight shows red |
| `diff-header-768.png` | Pixel diff 768 — zero (empty) |
| `diff-header-375.png` | Pixel diff 375 — zero (empty) |

---

## Heading hierarchy

H1 → H2 → H3 → H4: no skipped levels, single H1 on page. PASS.

```
H1  Testing engagements for Drupal teams.        (hero)
H2  Four ways we engage.                         (§2)
H3  Test-suite takeover / Embedded / Pilot / a11y (cards ×4)
H2  Senior testing capacity…                     (§3)
H2  These aren't services we're spinning up…     (§4)
H2  Not sure which shape fits?                   (§6)
H4  Services / Resources / Company               (footer)
```

---

## ARIA landmarks

| Landmark | Tag | Present |
|----------|-----|---------|
| `<header>` | `<header class="site-header">` | PASS |
| `<nav>` | `<nav class="site-header__nav">` | PASS |
| `<main>` | `<main id="main" role="main">` | PASS |
| `<footer>` | `<footer class="footer">` | PASS |

---

## Blocking issues

None.

---

## Advisory notes

- The skip-link CSS uses `position: absolute; left: -9999px` for the hidden state (a common pattern). It becomes `position: fixed` on focus, which is correct. No functional issue.
- The homepage does not yet have a skip-link or `<main>` landmark — that is outside the scope of this cycle and not a services.html defect.
- The 457-pixel AE diff at 1280 is expected and desirable: it is the visual indicator that "Services" is the current page.
