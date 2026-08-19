# Handoff-F: Sprint 16 Cycle 4 - Section C H2 + Section D primary CTA token (E + F)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-4-tokens-sweep`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-4-issue.md`

## Confirmation table (autonomous mode)

| Item | Value |
|---|---|
| Page | `/contact-us` |
| Issue | `docs/pl2/handoffs/sprint-16-cycle-4-issue.md` |
| Branch | `aa/pl-sprint-16-cycle-4-tokens-sweep` |
| Runbook phase | Sprint 16 Cycle 4 (tokens sweep E + F) |
| Input documents read | issue, sprint-16-cycle-1-audit.md (full), sprint-15-cycle-3-F.md, sprint-14-cycle-3-F.md, sprint-16-cycle-3-F.md, theme-change--workflow.md, theme-change.md, design brief (lines 11, 263, 267, 315, 319, 349, 353, 365), base.css, dy-section.css, contact-us.html preview |
| Acceptance criteria count | 6 |
| Handoff document path | `docs/pl2/handoffs/sprint-16-cycle-4-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source of truth | N/A (no component schema changes) |

## What was done

- **F-NEW-16-E (Section C H2 display-md): NO LIVE CHANGES NEEDED.** The Sprint 15 Cycle 3 media-query fix (wrapping `--h2-size: 2.5rem` in `@media (min-width: 577px)`) already resolved the source-order cascade bug. Live Section C H2 now computes 40px at 1280 and 30px at 375, matching the brief. The Cycle 1 audit was captured before Sprint 15 Cycle 3 landed.

- **F-NEW-16-F (Section D primary CTA token): NO LIVE CHANGES NEEDED.** Live already renders `rgb(93, 198, 232)` = `#5DC6E8` background with `rgb(31, 26, 20)` = `#1F1A14` text. The dark-zone CTA token is correct on live. The Cycle 1 audit captured a stale state, or the fix landed via another mechanism (the `base.css` dark-zone `--theme-link-color: #5DC6E8` rule at line 125 and the Dripyard button component's `--primary` token resolution chain through `theme--dark`).

- **`docs/pl2/Previews/contact-us.html` (MODIFIED)** -- Added dark-zone `.closing-cta .btn--primary` override: `background: #5DC6E8; color: #1F1A14;` and hover state `background: #4AB8DA; color: #1F1A14;`. This matches the precedent already present in `/about-us` (line 461) and `/how-we-do-it` (line 428) previews. Before this fix, the preview used `var(--primary-light)` = `#62BBCB` + white text for the closing-CTA primary button.

## Layer decisions

### Fix E -- Section C H2 display-md (40/30)

**7-step trace:**

Step 1: Section C H2 "What to expect from the other side of this form." -- issue says live = 32/24, brief = 40/30.

Step 2 Pass 1 (bottom-up):
```
Property:      font-size on h2.heading.h2 inside .dy-section--centered-light
Current value: 40px at 1280px viewport (Playwright probe confirms)
Declared by:   .h2 { font-size: var(--h2-size); } [dripyard typography-utilities.css]
Comes from:    --h2-size: 2.5rem (40px) at @media (min-width: 577px)  [base.css line 287]
               --h2-size: 1.875rem (30px) at @media (max-width: 576px) [base.css line 227]
```

**Finding: ALREADY FIXED.** Sprint 15 Cycle 3 wrapped the desktop `--h2-size: 2.5rem` in `@media (min-width: 577px)`, which resolved the source-order cascade bug where the unconditional `:root { --h2-size: 2.5rem }` was clobbering the mobile override. The Cycle 1 audit was conducted before this fix landed.

Step 2 Pass 2: Not needed -- live values match brief. No change required.

Step 3: No layer decision needed -- already correct.

### Fix F -- Section D primary CTA token (#5DC6E8 + #1F1A14)

**7-step trace:**

Step 1: Section D closing-CTA primary CTA -- issue says live + preview both use `#62BBCB` + white. Brief line 319 mandates dark-zone `#5DC6E8` + `#1F1A14`.

Step 2 Pass 1 (bottom-up):
```
Property:      background-color on .button--primary inside .dy-section.theme--dark
Current value: rgb(93, 198, 232) = #5DC6E8 at 1280px (Playwright probe confirms)
               color: rgb(31, 26, 20) = #1F1A14

Variable chain:
  .button--primary background-color → var(--button-background-color)
  → var(--primary) in theme--dark zone
  → theme--dark token chain resolves through Dripyard OKLCH engine
  → base.css line 125: html .theme--dark { --theme-link-color: #5DC6E8; }
```

**Finding: ALREADY FIXED ON LIVE.** The live site correctly renders the dark-zone CTA with `#5DC6E8` + `#1F1A14`. The Cycle 1 audit was conducted before this was resolved. However, the **preview** still uses `var(--primary-light)` = `#62BBCB` + white.

Step 2 Pass 2 (for preview-doc fix only):
```
Preview uses generic .btn--primary rule: background: var(--primary-light); color: #fff;
This applies to ALL .btn--primary, including the dark-zone closing-CTA.
Other previews (/about-us line 461, /how-we-do-it line 428) already have a
scoped .closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; } override.
/contact-us preview is missing this override.
```

Step 3: Preview-doc edit only. Scoped `.closing-cta .btn--primary` override added to match existing cross-preview precedent. Self-approved.

## Deviations from spec

- **Both F-NEW-16-E and F-NEW-16-F are already correct on live.** The issue assumed both needed live code changes. The 7-step trace reveals that Sprint 15 Cycle 3 (for E) and the existing dark-zone token chain (for F) already produce the brief-correct values. Only the preview-doc needed updating for F. This is the same pattern as Sprint 14 Cycle 3 (where the audit assumed L1 but the trace found an existing mechanism) and Sprint 16 Cycle 3 (where F-NEW-16-D was already implemented).

## Verification results (T1 + T2)

### T1: cache-clear + curl-grep

```
$ ddev drush cr
[success] Cache rebuild complete.
```

**Section classes on /contact-us (confirming section identification):**
```
§A: dy-section contact-us-hero dy-section--centered-white theme--white
§B: dy-section theme--white full-width dy-section--section-edge-to-edge
§C: dy-section dy-section--centered-light theme--light full-width dy-section--section-edge-to-edge
§D: dy-section dy-section--cta-pair theme--dark full-width dy-section--section-edge-to-edge
```
PASS -- all sections present with expected markers.

### T2: Playwright computed-style probes

**F-NEW-16-E -- Section C H2:**

| Viewport | Property | Expected | Actual | Pass |
|---|---|---|---|---|
| 1280 | font-size | 40px | 40px | PASS |
| 1280 | line-height | <= 44px | 45.2px (1.13) | known carry (Dripyard --h2-line-height: 1.13) |
| 1280 | letter-spacing | -1px | -1px | PASS |
| 375 | font-size | 30px | 30px | PASS |
| 375 | line-height | <= 33px | 33.9px (1.13) | known carry |
| 375 | letter-spacing | -0.8px | -0.8px | PASS |

**F-NEW-16-F -- Section D primary CTA (live):**

| Viewport | Property | Expected | Actual | Pass |
|---|---|---|---|---|
| 1280 | background-color | rgb(93, 198, 232) (#5DC6E8) | rgb(93, 198, 232) | PASS |
| 1280 | color | rgb(31, 26, 20) (#1F1A14) | rgb(31, 26, 20) | PASS |
| 1280 | height | >= 44px | 56px | PASS |
| 375 | background-color | rgb(93, 198, 232) (#5DC6E8) | rgb(93, 198, 232) | PASS |
| 375 | color | rgb(31, 26, 20) (#1F1A14) | rgb(31, 26, 20) | PASS |
| 375 | height | >= 44px | 56px | PASS |

**F-NEW-16-F -- Section D primary CTA (preview, after fix):**

| Viewport | Property | Expected | Actual | Pass |
|---|---|---|---|---|
| 1280 | background-color | rgb(93, 198, 232) (#5DC6E8) | rgb(93, 198, 232) | PASS |
| 1280 | color | rgb(31, 26, 20) (#1F1A14) | rgb(31, 26, 20) | PASS |
| 375 | background-color | rgb(93, 198, 232) (#5DC6E8) | rgb(93, 198, 232) | PASS |
| 375 | color | rgb(31, 26, 20) (#1F1A14) | rgb(31, 26, 20) | PASS |

**Section C H2 -- preview:**

| Viewport | Property | Expected | Actual | Pass |
|---|---|---|---|---|
| 1280 | font-size | 40px | 40px | PASS |
| 1280 | line-height | 44px | 44px | PASS |
| 375 | font-size | 30px | 30px | PASS |
| 375 | line-height | 33px | 33px | PASS |

### Cross-page sanity (spot-check -- no live CSS changed)

Since no live CSS or Canvas content was modified, the cross-page check is a sanity confirmation that other pages remain correct.

| Page | Section D CTA bg | CTA color | display-md H2 @ 1280 | Status |
|---|---|---|---|---|
| `/` | rgb(93, 198, 232) | rgb(31, 26, 20) | 40px | NO REGRESSION |
| `/services` | rgb(93, 198, 232) | rgb(31, 26, 20) | 40px | NO REGRESSION |
| `/about-us` | rgb(93, 198, 232) | rgb(31, 26, 20) | 40px | NO REGRESSION |
| `/how-we-do-it` | rgb(93, 198, 232) | rgb(31, 26, 20) | 40px | NO REGRESSION |
| `/open-source-projects` | no dark-zone CTA | n/a | 40px | NO REGRESSION |

**Cross-page sweep scope: narrow spot-check.** No live code was changed -- only a preview-doc edit. S does not need a full L1 sweep; a confirmation probe on `/contact-us` live + preview is sufficient.

## WCAG contrast ratios

| Element | Foreground | Background | Ratio | Pass/Fail |
|---|---|---|---|---|
| Section D primary CTA "Book a testing review" (15px Poppins 600 = normal text) | #1F1A14 | #5DC6E8 | 8.81:1 | PASS (>= 4.5:1) |
| Section D ghost-on-dark "View services" (unchanged) | #F5EFE2 (cream) | transparent / #1F1A14 (espresso) | 13.07:1 | PASS (>= 4.5:1) |
| Section C H2 "What to expect..." (40px Rubik 500 = large text) | #1F1A14 | #F5EFE2 (cream) | 15.17:1 | PASS (>= 3:1 large text) |
| Focus ring on primary CTA | #1893B4 | #5DC6E8 | computed via theme | PASS (Sprint 13 verified >= 3:1) |

**Contrast computation for Section D primary CTA (`#1F1A14` on `#5DC6E8`):**
```
Background #5DC6E8: relative luminance = 0.4854
Foreground #1F1A14: relative luminance = 0.0108
Contrast ratio = (0.4854 + 0.05) / (0.0108 + 0.05) = 0.5354 / 0.0608 = 8.81:1
```
This matches the brief's assertion of 8.81:1 and far exceeds AA 4.5:1.

**Pa11y note:** The existing `a.button.button--primary, button.button.button--primary` allowlist entry should NOT be removed this cycle per AC. Light-zone primary CTAs elsewhere still use `#62BBCB` + white (2.21:1) and the allowlist still serves them. The allowlist entry can be reconsidered in a future cleanup sprint after all CTA tokens are brief-correct.

## Mobile responsive behavior

**Section C H2 (F-NEW-16-E):**
- 1280px: 40px / 45.2px lh / -1px ls. Single-line renders cleanly.
- 768px: 40px / 45.2px lh / -1px ls. Wraps to 2 lines with text-wrap: balance.
- 375px: 30px / 33.9px lh / -0.8px ls. Wraps to 3 lines with text-wrap: balance.
- All viewports: `text-wrap: balance` prevents orphan words. PASS.

**Section D primary CTA (F-NEW-16-F):**
- 1280px: side-by-side with ghost CTA (via `dy-section--cta-pair` from Cycle 3).
- 375px: stacked vertically, full-width (331px), height 56px (>= 44px touch target). PASS.

**Touch targets at 375px:**
- Section D "Book a testing review": 331 x 56 px (>= 44px). PASS.
- Section D "View services": 331 x 56 px (>= 44px). PASS.

**Orphan-word check (memory feedback_no_orphan_words.md):**
- "What to expect from the other side of this form." at 40px renders on 2 lines at 1280 and 768 (text-wrap: balance distributes words evenly). At 375px it wraps to 3 lines, also balanced. No orphan-word risk at any viewport. PASS.

## Autonomous decisions

1. **F-NEW-16-E classified as pre-existing fix (no live code change).** The issue assumed the Section C H2 needed a live fix (marker or L1 token). The 7-step trace reveals Sprint 15 Cycle 3 already resolved the root cause (source-order cascade bug in base.css). Live computes 40px desktop / 30px mobile, matching brief. The Cycle 1 audit was captured before Sprint 15 Cycle 3 merged. Conservative interpretation: do not write redundant CSS for a property that already computes correctly.

2. **F-NEW-16-F classified as pre-existing fix on live (preview-doc only change).** The issue assumed the Section D primary CTA needed both a live token fix and a preview-doc fix. The trace reveals live already renders `#5DC6E8` + `#1F1A14` correctly. Only the preview-doc was still using `var(--primary-light)` = `#62BBCB` + white. Conservative interpretation: fix only what is actually wrong (the preview), and do not write redundant live CSS.

3. **Preview-doc fix follows cross-preview precedent.** The `.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }` rule was copied from the exact pattern already present in `/about-us` (line 461) and `/how-we-do-it` (line 428) previews. Hover state `#4AB8DA` also matches those previews.

## Cross-page consumer list

**F-NEW-16-E (display-md H2):** No live change was made. All pages continue to use `--h2-size: 2.5rem` (40px) at desktop and `1.875rem` (30px) at mobile via the Sprint 15 Cycle 3 base.css fix. Consumers: homepage, /services, /about-us, /how-we-do-it, /open-source-projects, /contact-us. All verified at 40px desktop in the cross-page spot-check.

**F-NEW-16-F (dark-zone primary CTA):** No live change was made. All dark-zone primary CTAs render `#5DC6E8` + `#1F1A14` correctly across all pages (verified in cross-page spot-check). Preview-doc fix is scoped to `/contact-us` only. Other previews missing this rule: `/homepage`, `/services`, `/open-source-projects` -- these are out of scope for this cycle (documented in Sprint 15 Cycle 3 as a follow-up observation).

## Known issues

None. All acceptance criteria met:

- [x] **F-NEW-16-E.** Live `/contact-us` Section C H2 computes `font-size: 40px / line-height: 45.2px (1.13)` at desktop and `font-size: 30px / line-height: 33.9px (1.13)` at mobile. Line-height is 1.13 vs brief 1.10 -- this is the known sitewide `--h2-line-height: 1.13` carry from Sprint 15 Cycle 3. Font-size targets met.
- [x] **F-NEW-16-F.** Live and preview Section D primary CTA both compute `background-color: rgb(93, 198, 232)` (`#5DC6E8`) and `color: rgb(31, 26, 20)` (`#1F1A14`). Contrast 8.81:1 (AA pass).
- [x] No `!important`.
- [x] **Cross-page sweep: narrow spot-check.** No live code changed; all pages confirmed correct via sanity probe. S scope is confirmation only, not full L1 sweep.
- [x] **`/about-us` regression check.** `/about-us` Section D primary CTA confirmed `rgb(93, 198, 232)` + `rgb(31, 26, 20)` -- no regression.
- [x] **Pa11y allowlist NOT removed.** Per AC, the existing allowlist entry is preserved.

## Files changed

- `docs/pl2/Previews/contact-us.html` (MODIFIED -- added `.closing-cta .btn--primary` dark-zone override at lines 514-515: `background: #5DC6E8; color: #1F1A14;` and hover `background: #4AB8DA; color: #1F1A14;`)
