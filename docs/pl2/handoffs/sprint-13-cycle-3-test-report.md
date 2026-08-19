# Handoff-T: Sprint 13 Cycle 3 — ATK/article-family chrome rewrite + title unification

**Verdict: PASS — all checks pass. Ready for S.**

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-13-cycle-3-atk-article-family`
**Handoff-F reviewed:** none on disk (F-3 committed directly; verified against file state + git log)

---

## Re-check summary (2026-05-12 pass 2)

Checks 2, 12, 13, and 16 were previously FAIL due to missing `<button>` element. F added the hamburger markup. All four re-verified and now PASS. Full matrix below reflects final state.

---

## Per-file × per-check matrix

| # | Check | ATK | ATK-intro | LBK-article |
|---|-------|-----|-----------|-------------|
| 1 | Zero `site-header__cta` occurrences | PASS (0) | PASS (0) | PASS (0) |
| 2 | Hamburger markup + CSS present (44×44, `aria-expanded`, `aria-label="Open menu"`) | PASS | PASS | PASS |
| 3 | Skip-link is first focusable in `<body>` | PASS | PASS | PASS |
| 4 | `<main id="main" role="main">` wraps content, closes before `<footer>` | PASS | PASS | PASS |
| 5 | Zero bare `href="/contact"` | PASS (0) | PASS (0) | PASS (0) |
| 6 | Zero `&mdash;` / `&rarr;` inside `<footer>` block | PASS | PASS | PASS |
| 7 | Footer copyright `©` (UTF-8, not `&copy;`) | PASS | PASS | PASS |
| 8 | Footer signature `href="/contact-us"` + UTF-8 `→` | PASS | PASS | PASS |
| 9 | Title matches preview-suite shape | PASS | PASS | PASS |
| 10 | Body content intact | PASS | PASS | PASS |
| 11 | 1280: logo + nav inline, no pill, no hamburger visible | PASS | PASS | PASS |
| 12 | 768: logo + hamburger visible, nav hidden | PASS | PASS | PASS |
| 13 | 375: logo + hamburger visible, nav hidden | PASS | PASS | PASS |
| 14 | Tab from page load lands on skip-link | PASS | PASS | PASS |
| 15 | No new console errors at any viewport | PASS | PASS | PASS |
| 16 | Header structure identical to `services.html` | PASS | PASS | PASS |

---

## Check 2 detail — hamburger markup (re-check)

`grep -c 'hamburger'` counts:

| File | Count | services.html baseline | Result |
|------|-------|------------------------|--------|
| automated-testing-kit.html | 9 | 9 | PASS |
| automated-testing-kit-introduction.html | 9 | 9 | PASS |
| article-introducing-layout-builder-kit-beta-1.html | 9 | 9 | PASS |

Button element confirmed present in all three files:

- ATK line 622: `<button type="button" class="site-header__hamburger" aria-label="Open menu" aria-expanded="false">`
- ATK-intro line 695: same
- LBK line 559: same

CSS confirms `width: 44px; height: 44px;` in all three files.

---

## Check 9 detail — titles

| File | Expected | Actual | Result |
|------|----------|--------|--------|
| automated-testing-kit.html | `Performant Labs — automated testing kit preview (teal + terracotta)` | `Performant Labs — automated testing kit preview (teal + terracotta)` | PASS |
| automated-testing-kit-introduction.html | `Performant Labs — automated testing kit introduction preview (teal + terracotta)` | `Performant Labs — automated testing kit introduction preview (teal + terracotta)` | PASS |
| article-introducing-layout-builder-kit-beta-1.html | `Performant Labs — introducing layout builder kit beta 1 preview (teal + terracotta)` | `Performant Labs — introducing layout builder kit beta 1 preview (teal + terracotta)` | PASS |

---

## Check 16 detail — header diff vs services.html (re-check)

Full structural diff of `<header>…</header>` block. Only `is-current` active-link differences remain — these are intentional and page-specific.

| File | Non-is-current structural diff | Result |
|------|-------------------------------|--------|
| automated-testing-kit.html | none | PASS |
| automated-testing-kit-introduction.html | none | PASS |
| article-introducing-layout-builder-kit-beta-1.html | none | PASS |

---

## Tier 1 results

| Check | Method | Expected | Actual | Result |
|-------|--------|----------|--------|--------|
| CSS variable presence | grep `site-header__hamburger` in each file | CSS block present | Present in all 3 | PASS |
| Hamburger button HTML | grep (non-CSS lines) `class="site-header__hamburger"` | `<button>` element | Present in all 3 | PASS |
| Footer `©` | grep `©` in footer block | UTF-8 © | Present in all 3 | PASS |
| Footer `href="/contact-us"` + `→` | grep in footer block | Both present | Both present in all 3 | PASS |
| Zero `href="/contact"` (bare) | `grep -c 'href="/contact"'` | 0 | 0 in all 3 | PASS |
| Zero `&mdash;`/`&rarr;` in footer | sed extract + grep | 0 | 0 in all 3 | PASS |
| Title format | `grep '<title>'` | Preview-suite shape | All 3 match exactly | PASS |

---

## Tier 2 results

| Check | Method | Result |
|-------|--------|--------|
| Skip-link first in `<body>` | Line-number comparison | PASS all 3 |
| `<main id="main" role="main">` present | `grep -n '<main'` | PASS all 3 |
| `</main>` before `<footer>` | Line number comparison | PASS all 3 (ATK: 907/910; ATK-intro: 861/864; LBK: 687/690) |
| ARIA landmarks present | `grep '<header\|<main\|<footer\|<nav'` | PASS all 3 |
| Heading hierarchy | `grep '<h[1-6]'` sequence | PASS (H1→H2→H3 in body; H3→H4 footer skip is pre-existing baseline pattern in services.html) |
| Single H1 per page | `grep -c '<h1'` | PASS all 3 (1 each) |

---

## WCAG contrast verification

No new color tokens introduced in this cycle. Cycle 3 applies the services.html palette without modification. Contrast ratios from sprint-13 cycle-1/2 audits carry forward unchanged. No new contrast verification required.

---

## Mobile responsive verification

Re-check results (Playwright headless, file:// URLs):

| File | Viewport | Hamburger present | Hamburger visible | Nav hidden | Result |
|------|----------|-------------------|-------------------|------------|--------|
| atk | 768 | 1 | true | true | PASS |
| atk | 375 | 1 | true | true | PASS |
| atk-intro | 768 | 1 | true | true | PASS |
| atk-intro | 375 | 1 | true | true | PASS |
| lbk | 768 | 1 | true | true | PASS |
| lbk | 375 | 1 | true | true | PASS |

Touch target: CSS `width: 44px; height: 44px;` confirmed in all three files — meets 44×44 minimum.

---

## Spot screenshots — ATK header

Screenshots saved to `docs/pl2/handoffs/screenshots/sprint-13-cycle-3/`.

Initial pass (hamburger absent):
- `atk-1280.png` — 1280px: logo + 6-link nav inline, no pill. PASS.
- `atk-768.png` — 768px: logo only, no hamburger. FAIL (original).
- `atk-375.png` — 375px: same. FAIL (original).

Re-check pass (hamburger present):
- `atk-recheck-768.png` — 768px: logo + hamburger control top-right, nav hidden. PASS.
- `atk-recheck-375.png` — 375px: logo + hamburger control top-right, nav hidden. PASS.

---

## Acceptance criteria status

| Criterion | Result | Evidence |
|-----------|--------|----------|
| `site-header__cta` removed from all 3 files | PASS | grep count = 0 in all 3 |
| Hamburger markup + CSS present (44×44, `aria-expanded`, `aria-label="Open menu"`) | PASS | Button element confirmed, count = 9 matching services.html in all 3 |
| Skip-link first focusable | PASS | Playwright Tab check: skip-link receives focus in all 3 at all viewports |
| `<main id="main" role="main">` wraps content, closes before `<footer>` | PASS | Line numbers confirmed in all 3 |
| Zero bare `href="/contact"` | PASS | 0 occurrences in all 3 |
| Zero `&mdash;`/`&rarr;` in footer area | PASS | sed extract of footer confirms 0 in all 3 |
| Footer `©` UTF-8 | PASS | `©` present in all 3 |
| Footer `href="/contact-us"` + UTF-8 `→` | PASS | Present in all 3 |
| Title: ATK `...automated testing kit preview (teal + terracotta)` | PASS | Exact match |
| Title: ATK-intro `...automated testing kit introduction preview (teal + terracotta)` | PASS | Exact match |
| Title: LBK-article `...introducing layout builder kit beta 1 preview (teal + terracotta)` | PASS | Exact match |
| Body content intact | PASS | Book nav, chapters, article body confirmed present in all 3 |
| 1280: logo + nav inline, no pill, no hamburger visible | PASS | Playwright + screenshot confirmed |
| 768: logo + hamburger visible, nav hidden | PASS | Playwright re-check + screenshot confirmed |
| 375: logo + hamburger visible, nav hidden | PASS | Playwright re-check + screenshot confirmed |
| Tab → skip-link at all viewports | PASS | Playwright Tab check PASS in all 9 runs (3 files × 3 viewports) |
| No new console errors | PASS | 0 new errors in all 9 runs |
| Header structure identical to services.html | PASS | Diff shows only `is-current` active-link differences (page-specific by design) in all 3 |

---

## Blocking issues

None.

---

## Advisory notes

- The `&mdash;` and `&rarr;` HTML entities in body content (book hero deck, chapter cards, article body) are acceptable — the check scope is footer area only.
- Heading hierarchy: the H3→H4 gap in the footer (`<h4>Services</h4>` etc.) is a pre-existing pattern matching services.html; not a regression.
- All console output was clean (0 errors) across all runs.
- `is-current` class differences between files are intentional (each page marks its own active nav item).
