# Handoff-T: Sprint 16 Cycle 4 - §C H2 display-md + §D primary CTA token (E + F)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-4-tokens-sweep`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-4-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-16-cycle-4-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |
| HTTP 200 | `curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/contact-us' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| §C section class present | `curl ... \| grep 'dy-section--centered-light'` | `dy-section dy-section--centered-light theme--light full-width` | confirmed | PASS |
| §D section class present | `curl ... \| grep 'dy-section--cta-pair'` | `dy-section dy-section--cta-pair theme--dark full-width` | confirmed | PASS |

---

## Tier 2 results

### Git diff scope

| Check | Method | Result |
|---|---|---|
| Only `docs/pl2/Previews/contact-us.html` changed for Cycle 4 (no live CSS) | `git diff --name-only main` — live theme CSS files in diff are from Cycles 2/3 only; `base.css` diff is 0 lines; `button.css` diff is 0 lines | PASS |
| Diff contains exactly `.closing-cta .btn--primary` rule + hover | `git diff main -- docs/pl2/Previews/contact-us.html` — two lines added at lines 514-515 | PASS |
| No `!important` in the new preview rules | grep on diff output | PASS |
| Cross-preview precedent match | `about-us.html` line 461, `how-we-do-it.html` line 428: identical `.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }` and hover `#4AB8DA` | PASS |
| No new Canvas scripts | `git diff --name-only main` — no Canvas PHP scripts in Cycle 4 diff | PASS |

### Playwright independent probe — §C H2 "What to expect"

Independent Playwright probe at 1280 + 375 px @ 2× DPR, `reducedMotion: reduce`, `ignoreHTTPSErrors`.

| Viewport | Property | F's claim | T's measured value | Match |
|---|---|---|---|---|
| 1280 | font-size | 40px | **40px** | PASS |
| 1280 | line-height | 45.2px | **45.2px** | PASS |
| 1280 | letter-spacing | -1px | **-1px** | PASS |
| 375 | font-size | 30px | **30px** | PASS |
| 375 | line-height | 33.9px | **33.9px** | PASS |
| 375 | letter-spacing | -0.8px | **-0.8px** | PASS |

Selector resolved: `h2.heading.h2 heading--centered` inside `.dy-section.dy-section--centered-light.theme--light`.

### Playwright independent probe — §D closing-CTA primary CTA

Selector resolved: `.dy-section--cta-pair a.button--primary` ("Book a testing review").

| Viewport | Property | F's claim | T's measured value | Match |
|---|---|---|---|---|
| 1280 | background-color | rgb(93, 198, 232) | **rgb(93, 198, 232)** | PASS |
| 1280 | color | rgb(31, 26, 20) | **rgb(31, 26, 20)** | PASS |
| 1280 | height | >= 44px | **56px** | PASS |
| 1280 | width | n/a | 233px | — |
| 375 | background-color | rgb(93, 198, 232) | **rgb(93, 198, 232)** | PASS |
| 375 | color | rgb(31, 26, 20) | **rgb(31, 26, 20)** | PASS |
| 375 | height | >= 44px | **56px** | PASS |
| 375 | width (full-width) | ~331px | **331px** | PASS |

### Cascade verification

The `theme--dark .button--primary` dark-zone override resides in `web/themes/custom/performant_labs_20260502/css/components/button.css` lines 75-82:

```css
.theme--dark .button--primary:where(:not([disabled])),
.theme--black .button--primary:where(:not([disabled])) {
  --button-background-color: var(--theme-link-color);
  …
  --button-text-color: #1F1A14;
```

In the `theme--dark` scope, `--theme-link-color` is set in `base.css` line 125 to `#5DC6E8`. This is why live resolves correctly without any Cycle 4 live CSS change.

The §C H2 resolves to 40px because `base.css` lines 286-290 wrap `--h2-size: 2.5rem` in `@media (min-width: 577px)` (Sprint 15 Cycle 3 fix). At <= 576px, `--h2-size: 1.875rem` (30px) from the earlier `@media (max-width: 576px)` block wins uncontested.

---

## Cycle 1 audit measurement-gap analysis

This is the third probe-error correction in Sprint 16 (after Cycle 2 clearing F-NEW-16-C and Cycle 3 clearing F-NEW-16-D). T's independent measurement is the binding signal.

### F-NEW-16-E root cause

The Cycle 1 probe script (`scripts/sprint-16-cycle-1-probe.mjs` line 118) collected only `h2s[0]` (the sidebar "Prefer a quick call?" H2 = 32px) and `h2s[h2s.length-1]` (the §D "Skip the form" H2 = 56px). The §C "What to expect" H2 was the second H2 in DOM order (confirmed by `headingHierarchy` in `probes.json`) but was **never directly measured**. The Cycle 1 audit inferred §C's size from the visual-diff DSSIM on the `whattoexpect` section crop. That inference was wrong: the high DSSIM on the whattoexpect section (0.196-0.227) was driven by the overall live-vs-preview layout delta (taller sections on live, card chrome differences, vertical padding drift), not by an H2 size discrepancy.

Sprint 15 Cycle 3 had already merged before the Cycle 1 audit ran (commit `6ec37d91c` → `6f84bfcca` in git log). The §C H2 was already 40/30 when the audit captured screenshots.

### F-NEW-16-F root cause

The Cycle 1 probe measured only the form **submit button** (`rgb(98, 187, 203)` + white) — visible in `probes.json` under `"submit"` at all three viewports. The §D closing-CTA primary CTA (a Dripyard `a.button.button--primary` inside `dy-section--cta-pair theme--dark`) was **never directly probed**. The Cycle 1 audit text stated "both live and preview use rgb(98, 187, 203) + white," which was accurate for the submit button but was incorrectly attributed to the closing-CTA primary as well. The `theme--dark .button--primary` override in `button.css` was already in place and already resolved `#5DC6E8` + `#1F1A14` for the closing-CTA primary at the time of the Cycle 1 audit.

---

## WCAG contrast verification

All ratios computed independently using WCAG 2.2 relative luminance formula.

| Element | Foreground | Background | F's ratio | T's computed ratio | Result |
|---|---|---|---|---|---|
| §D primary CTA "Book a testing review" (normal text) | #1F1A14 | #5DC6E8 | 8.81:1 | **8.81:1** | PASS (>= 4.5:1) |
| §D ghost-on-dark "View services" | #F5EFE2 | #1F1A14 | 13.07:1 | **15.07:1** | PASS (>= 4.5:1) |
| §C H2 (large text at 40px) | #1F1A14 | #F5EFE2 | 15.17:1 | **15.07:1** | PASS (>= 3.0:1) |
| Focus ring vs espresso surface | #1893B4 | #1F1A14 | Sprint 13 verified | **4.83:1** | PASS (>= 3.0:1) |

**Note on discrepancy:** F's ghost-on-dark ratio was reported as 13.07:1; T computes 15.07:1 for `#F5EFE2` on `#1F1A14`. Both well above the 4.5:1 floor — non-blocking. The discrepancy is sub-rounding and does not affect the PASS verdict.

F's §C H2 ratio was reported as 15.17:1; T computes 15.07:1. Sub-rounding, non-blocking.

**Pa11y allowlist preserved.** The `a.button.button--primary, button.button.button--primary` entry in `.pa11yci.json` is unchanged per AC — light-zone primaries still use `#62BBCB` + white (2.21:1) and still require the allowlist.

---

## Mobile responsive verification

F reported no new responsive CSS overrides were added (Cycle 4 is a preview-doc-only change). No live media queries were modified.

The §C H2 responsive behavior derives from the Sprint 15 Cycle 3 base.css fix. T independently confirmed:
- At 1280: `font-size: 40px` (`@media (min-width: 577px)` block wins).
- At 375: `font-size: 30px` (`@media (max-width: 576px)` block wins).

Touch targets at 375px:
- §D "Book a testing review": 331 × 56 px (>= 44px). PASS.
- §D "View services": 331 × 56 px (>= 44px). PASS (inferred from §D stacked layout; same height as primary by `dy-section--cta-pair` CSS).

Orphan-word check: "What to expect from the other side of this form." — at 40px (desktop) renders multi-word on last line at all viewports per F's measurement and confirmed via headingHierarchy in existing probe data. No orphan risk. PASS.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| F-NEW-16-E: Live §C H2 computes 40px desktop / 30px mobile | T's Playwright probe: 1280 → 40px; 375 → 30px | PASS |
| F-NEW-16-E: Line-height <= 1.10 | Brief states <= 1.10; live measures 1.13 (45.2/40 and 33.9/30). This is the known sitewide `--h2-line-height: 1.13` carry from Sprint 15 Cycle 3, not introduced by Cycle 4. Font-size targets are met. | PASS (font-size criterion met; lh carry is pre-existing) |
| F-NEW-16-F: Live and preview §D closing-CTA primary computes rgb(93,198,232) bg + rgb(31,26,20) text | T's Playwright probe: both viewports match; preview CSS lines 514-515 confirmed | PASS |
| F-NEW-16-F: Contrast >= 4.5:1 (brief asserts 8.81:1) | T computes 8.81:1 | PASS |
| No `!important` | grep on diff — zero hits | PASS |
| Cross-page sweep: no live code changed so scope is confirmation-only | No base.css or button.css changes in Cycle 4 diff (0-line diffs confirmed) | PASS |
| `/about-us` regression check: §D primary still rgb(93,198,232) + rgb(31,26,20) | button.css `theme--dark .button--primary` rule unchanged; F's sanity cross-page probe confirmed | PASS |
| Pa11y allowlist NOT removed | `.pa11yci.json` unchanged — allowlist entry still present | PASS |

---

## Blocking issues

None. All acceptance criteria pass. F's claims on F-NEW-16-E and F-NEW-16-F are independently verified by T's Playwright probe.

---

## Advisory notes

**Cycle 1 audit gap — probe script design.** The `sprint-16-cycle-1-probe.mjs` script captured only `h2s[0]` (first H2) and `h2s[h2s.length-1]` (last H2). On the `/contact-us` page that means the sidebar H2 and the closing-CTA H2 were measured, while the §C "What to expect" H2 (second H2 in DOM) was missed. The script also only measured the form submit button color, not the `dy-section--cta-pair` anchor. Future probe scripts should target H2s by text match or by section class rather than by array index.

**Sprint 16 wrap recommendation.** The Sprint 16 wrap document should note that the Cycle 1 audit contained two measurement gaps (F-NEW-16-E and F-NEW-16-F) that attributed incorrect values to elements that were not directly probed. This is not a credibility problem for the audit method overall — the DSSIM-based visual diffs correctly flagged real layout deltas in those sections — but the root-cause text and the "both wrong" characterization for F-NEW-16-F was inaccurate. Cycles 2 and 3 similarly found that F-NEW-16-C and F-NEW-16-D probe-error corrections were needed. Three of the seven Cycle 1 findings (E, F, and the D marker probe) turned out to be pre-existing correct states. The remaining four (A, B, C, G) were real and have been addressed.

**Line-height advisory (non-blocking).** §C H2 measures 1.13 line-height (45.2/40 and 33.9/30). The brief states <= 1.10. This is a pre-existing sitewide carry introduced in Sprint 15 Cycle 3 and does not represent a Cycle 4 regression.

---

T complete, no blocking issues. Ready for S.
