# Handoff-T: Cycle 4 - § proof / logo strip preview fidelity

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-4-proof`
**Issue:** `docs/pl2/handoffs/cycle-4-proof-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-4-proof-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | "Cache rebuild complete." | PASS |
| HTTP /services | `curl -sk URL:8493/services -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| wordmark-strip in DOM | `curl -sk URL:8493/services \| grep -c 'wordmark-strip'` | >= 1 | 2 | PASS |
| No logo-grid/logo-item | `curl -sk URL:8493/services \| grep -c 'logo-grid\|logo-item'` | 0 | 0 | PASS |
| Dogfooding H2 present | `curl -sk URL:8493/services \| grep -c "These aren't services..."` | 1 | 1 | PASS |
| CSS file served | `curl -sk URL:8493/.../dy-section.css \| grep -c 'wordmark-strip'` | >= 1 | 21 | PASS |
| Homepage logo-grid unaffected | `curl -sk URL:8493/ \| grep -c 'logo-grid'` | 7 (F baseline) | 7 | PASS |
| HTTP /about-us | `curl -sk URL:8493/about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -sk URL:8493/ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |

Base URL: `https://pl-performantlabs.com.3.ddev.site:8493`

---

## Tier 2 results

| Check | Method | Result |
|---|---|---|
| 6 wordmark items present | DOM extraction: `wordmark-strip__item` divs | PASS — Drupal, Playwright, Cypress, PHP, JavaScript, React (6 items) |
| "We speak" label present | DOM extraction: `wordmark-strip__label` | PASS — text "We speak" confirmed |
| No raster images in wordmark section | Regex scan of section HTML chunk | PASS — 0 `<img>` tags in the wordmark `dy-section` |
| Hairline border in served CSS | grep `.wordmark-strip { border-top:` in served file | PASS — `border-top: 1px solid var(--theme-border-color)` + `border-bottom` confirmed |
| No `!important` in wordmark-strip block (lines 753–896) | `grep '!important'` on line range | PASS — 0 occurrences; 2 occurrences in full file are in comment text only |
| Heading hierarchy /services | Python regex extraction of h1–h6 | PASS — Single H1 ("Testing engagements for Drupal teams."), H2s: "Four ways we engage.", "Senior testing capacity…", "These aren't services…", "Not sure which shape fits?…". No skipped levels. No H2 "We Speak". |
| Heading hierarchy /about-us (cross-page) | Python regex extraction | PASS — Single H1, H2/H3 only, no skipped levels |
| Heading hierarchy / (homepage, cross-page) | Python regex extraction | PASS — Single H1, H2/H3 only, no skipped levels |
| ARIA landmarks /services | Regex: `<header>`, `<main>`, `<footer>`, `<nav>` | PASS — all four present |
| Wordmark items are non-interactive | Regex scan for `<a>`, `<button>` in section | PASS — 0 links, 0 buttons (items are decorative divs; no touch-target requirement) |
| Semantic structure | `<div class="wordmark-strip__item">` as flex children | PASS — divs are appropriate; Canvas filter strips `<span>`, dev decision documented |
| Responsive breakpoints present | grep `@media` in served CSS | PASS — `<=576px` and `577px–991px` breakpoints present in file |

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| "WE SPEAK" label | `#5C544C` (--theme-text-color-medium) | `#FFFFFF` | 7.43:1 | **7.43:1** | PASS |
| Wordmark items (opacity 0.8) | `#5C544C` @ 0.8 blended over `#FFFFFF` = ~`#7D7670` | `#FFFFFF` | 4.86:1 | **4.47:1** | **FAIL** |
| Hairline borders | `#E5E1DC` (--theme-border-color) | `#FFFFFF` | decorative | decorative | N/A |

**Discrepancy on wordmark items:** F reported 4.86:1; T's independent computation yields 4.47:1. Calculation method:

- Foreground: `#5C544C` (R=92, G=84, B=76), opacity 0.8 over white.
- Blended channel (sRGB): R = 92×0.8 + 255×0.2 = 124.6 → 125; G = 84×0.8 + 255×0.2 = 118.2 → 118; B = 76×0.8 + 255×0.2 = 111.8 → 112. Blended hex: `#7D7670`.
- Relative luminance of `#7D7670`: 0.1849. Contrast vs white (L=1.0): (1.05)/(0.2349) = **4.47:1**.
- F's reported hex `#7D766F` also gives 4.47:1 (luminance 0.1846) — F's reported blended hex is confirmed but the ratio F computed from it (4.86) is incorrect.
- All rounding variants (floor, ceil, round) of the blend yield < 4.5:1.

**WCAG classification:** 18px at weight 500 = 13.5pt at medium weight. WCAG 2.1 large text threshold requires 18pt regular OR 14pt bold. 13.5pt at 500 weight does **not** qualify as large text. Required threshold: **4.5:1 (normal text)**. The 4.47:1 result falls short by 0.03:1.

**This is a blocking contrast failure.** AC states: "WCAG: wordmark text contrast >= 4.5:1 against the band background."

---

## Mobile responsive verification

| Override | Breakpoint | CSS rule confirmed | Touch-target math | Result |
|---|---|---|---|---|
| Wordmark row gap + justify | `<=576px` | `.wordmark-strip__row { justify-content: center; gap: 1rem 2rem; }` present in served file | N/A — items not interactive | PASS |
| Wordmark item font-size | `<=576px` | `.wordmark-strip__item { font-size: 1rem; }` present | N/A | PASS |
| Strip padding | `<=576px` | `.wordmark-strip { padding-block: 2rem; }` present | N/A | PASS |
| Label margin | `<=576px` | `.wordmark-strip__label { margin-bottom: 1.5rem; }` present | N/A | PASS |
| Tablet centered wrap | `577px–991px` | `.wordmark-strip__row { justify-content: center; gap: 1.5rem 2.5rem; }` present | N/A | PASS |

All responsive overrides F documented are confirmed present in the served stylesheet. Touch targets are N/A (wordmark items are non-interactive decorative elements).

---

## Acceptance criteria status

| AC | Criterion | Evidence | Result |
|---|---|---|---|
| 1 | § proof renders hairline-bounded strip with small-caps "WE SPEAK" label + 6 text wordmarks horizontally distributed | DOM: label "We speak" + 6 `wordmark-strip__item` divs; CSS: `border-top/bottom: 1px solid var(--theme-border-color)`; label CSS: `text-transform: uppercase; letter-spacing: 1.6px` | PASS |
| 2 | No raster logo images in § proof | 0 `<img>` tags in wordmark section HTML | PASS |
| 3 | Dogfooding H2 + body + CTA above strip — unchanged | "These aren't services we're spinning up." H2 present (count: 1) | PASS |
| 4 | At 768/375: wordmark row remains legible; can wrap or scroll | CSS flex-wrap + responsive breakpoints confirmed; items are non-interactive (no scroll-trap concern) | PASS |
| 5 | No `!important` | 0 occurrences in wordmark-strip block (lines 753–896); full-file occurrences are in comments only | PASS |
| 6 | T1 + T2 PASS on /services | See Tier 1 and Tier 2 results above | PASS (except AC 7) |
| 7 | WCAG: wordmark text contrast >= 4.5:1 against band background | T independent calculation: 4.47:1 (below 4.5:1 threshold). F reported 4.86:1 — incorrect. | **FAIL** |
| 8 | All Canvas patches set `component_version: NULL` or document platform constraint | F documented: Canvas enforces non-NULL; NULL causes `OutOfRangeException`; existing valid hash reused. Platform constraint documented. | PASS (documented deviation) |
| 9 | Files staged by explicit path | 3 files: 2 patch scripts + dy-section.css (3 <= 6 cap) | PASS |
| 10 | F scope cap respected (≤ 6 files) | 3 files changed | PASS |

---

## Blocking issues

**1. WCAG contrast failure — wordmark items (AC 7)**

Element: `.wordmark-strip__item` with `opacity: 0.8` on `color: var(--theme-text-color-medium)` (#5C544C) over `#FFFFFF`.

Effective blended color: `#7D7670`. Contrast ratio: **4.47:1**. Required: **4.5:1** (normal text — 18px/500wt = 13.5pt, does not meet WCAG large text threshold).

F reported 4.86:1, which is incorrect. The AC explicitly requires >= 4.5:1 and this fails by 0.03:1.

**Remediation options for F (T does not implement):**

- Remove `opacity: 0.8` from `.wordmark-strip__item`. At full opacity `#5C544C` vs `#FFFFFF` = 7.43:1 (PASS).
- Or reduce opacity only enough to keep contrast >= 4.5:1. Required effective luminance: L <= 0.1935. With `opacity: x`, blend channel R = 92x + 255(1-x); effective L must give ratio >= 4.5. At opacity ~0.87 the ratio reaches 4.5:1. But the margin is extremely tight — T recommends removing opacity entirely (simplest, highest safety margin).

---

## Advisory notes

1. The "We speak" label uses `font-size: 0.75rem` (12px). The CSS comment says "small-caps" but the CSS uses `text-transform: uppercase`, not `font-variant-small-caps`. The preview references "small-caps" styling. Visually these are similar but technically different. Not a blocking concern — uppercase + tight tracking is an acceptable implementation of the visual intent.

2. F's blended contrast calculation of 4.86:1 appears to be an arithmetic error on the luminance computation. Both the blended hex F reported (#7D766F) and T's independently computed blend (#7D7670) yield 4.47:1, not 4.86:1. F should review the calculation method used.

3. Cross-page regression check passed. `/about-us` and `/` are unaffected. Homepage logo-grid count unchanged at 7.

---

## Decision Logic

T found blocking issues. F needs to address:

1. **Wordmark item contrast failure**: remove or reduce `opacity: 0.8` on `.wordmark-strip__item` so the effective contrast against `#FFFFFF` reaches >= 4.5:1. Removing opacity entirely (resulting in `#5C544C` at 7.43:1) is the recommended fix.

Do not proceed to S until this is resolved.
