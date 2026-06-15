# Handoff-T: Cycle 4 Rework - Wordmark strip WCAG contrast re-verification

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-4-proof`
**Issue:** `docs/pl2/handoffs/cycle-4-proof-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-4-proof-F-rework.md`
**Original T (with blocker):** `docs/pl2/handoffs/cycle-4-proof-T.md`

---

## Scope of this rework verification

The original T handoff raised one blocking issue: `opacity: 0.8` on `.wordmark-strip__item` blended the foreground `#5C544C` to an effective `#7D7670`, yielding a contrast ratio of 4.47:1 — below the 4.5:1 AA threshold for normal text. F's rework removed the `opacity: 0.8` declaration entirely. This verification re-checks the one blocker and sweeps for regressions on `/services`, `/`, and `/about-us`.

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | "Cache rebuild complete." | PASS |
| HTTP /services | `curl -sk URL:8493/services -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP / | `curl -sk URL:8493/ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /about-us | `curl -sk URL:8493/about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| wordmark-strip in /services DOM | `curl -sk URL:8493/services \| grep -c 'wordmark-strip'` | >= 1 | 2 | PASS |
| CSS file served (wordmark-strip count) | `curl -sk URL:8493/.../dy-section.css \| grep -c 'wordmark-strip'` | 21 (F baseline) | 21 | PASS |
| No opacity in CSS rules (served file) | `curl ... dy-section.css \| grep -v '^\s*\*' \| grep 'opacity'` | 0 lines | 0 lines | PASS |
| Opacity only in comments | `curl ... dy-section.css \| grep -n 'opacity'` | lines 796–797 (comment) only | lines 796–797 only | PASS |
| Homepage logo-grid unaffected | `curl -sk URL:8493/ \| grep -c 'logo-grid'` | 7 (prior baseline) | 7 | PASS |

Base URL: `https://pl-performantlabs.com.3.ddev.site:8493`

---

## Tier 2 results

No structural changes were made in this rework. All Tier 2 checks from the original T handoff remain valid. The specific check re-run against the served CSS to confirm the `.wordmark-strip__item` rule block:

| Check | Method | Result |
|---|---|---|
| `.wordmark-strip__item` block 1 (desktop) — no opacity | Python regex extraction of block properties from served CSS | PASS — properties: font-family, font-weight, font-size, color, letter-spacing, white-space. No opacity property. |
| `.wordmark-strip__item` block 2 (mobile override) — no opacity | Python regex extraction | PASS — property: font-size only. No opacity property. |
| WCAG comment updated in source | `grep -n 'opacity' dy-section.css` on source file | PASS — lines 796–797 reflect the rework rationale; no live rule contains opacity |

---

## WCAG contrast verification

| Element | Foreground | Background | F's ratio | T's ratio | Result |
|---|---|---|---|---|---|
| "WE SPEAK" label | `#5C544C` (--theme-text-color-medium) | `#FFFFFF` | 7.43:1 | **7.43:1** | PASS |
| Wordmark items (post-fix, full opacity) | `#5C544C` (--theme-text-color-medium) | `#FFFFFF` | 7.43:1 | **7.43:1** | PASS |
| Hairline borders | `#E5E1DC` (--theme-border-color) | `#FFFFFF` | decorative | decorative | N/A |

**T's independent computation — wordmark items post-fix:**

- Foreground: `#5C544C` (R=92, G=84, B=76). No opacity blend; full opacity confirmed in served CSS.
- sRGB linearization: R=92 -> 0.1065, G=84 -> 0.0887, B=76 -> 0.0722.
- Relative luminance: 0.2126 × 0.1065 + 0.7152 × 0.0887 + 0.0722 × 0.0722 = **0.0914**.
- Contrast vs white (L=1.0): (1.0 + 0.05) / (0.0914 + 0.05) = 1.05 / 0.1414 = **7.43:1**.
- WCAG AA normal text threshold: >= 4.5:1. **PASS** with a safety margin of 2.93:1.

**Prior blocker resolved:** the original failure was 4.47:1 (with opacity 0.8 blending to effective `#7D7670`). At full opacity the ratio is 7.43:1, comfortably above threshold. F's computed ratio matches T's independently.

---

## Mobile responsive verification

No responsive overrides were changed in this rework. All responsive checks from the original T handoff remain PASS. The served CSS continues to contain:

- `@media (max-width: 576px)` block with `.wordmark-strip__row`, `.wordmark-strip__item`, `.wordmark-strip`, `.wordmark-strip__label` overrides.
- `@media (min-width: 577px) and (max-width: 991px)` tablet block.

Neither block contains an `opacity` declaration.

---

## Acceptance criteria status

All ten AC from the original issue. AC 7 was the blocker; all others were PASS in the prior T handoff and are unaffected by this CSS-only rework.

| AC | Criterion | Evidence | Result |
|---|---|---|---|
| 1 | § proof renders hairline-bounded strip with small-caps "WE SPEAK" label + 6 text wordmarks horizontally distributed | Unchanged from prior T — DOM and CSS confirmed. | PASS |
| 2 | No raster logo images in § proof | Unchanged. | PASS |
| 3 | Dogfooding H2 + body + CTA above strip — unchanged | Unchanged. | PASS |
| 4 | At 768/375: wordmark row remains legible; can wrap or scroll | Responsive CSS confirmed present; no opacity change affects layout. | PASS |
| 5 | No `!important` | Unchanged — 0 occurrences in wordmark-strip block. | PASS |
| 6 | T1 + T2 PASS on /services | All Tier 1 and Tier 2 checks above pass. | PASS |
| 7 | WCAG: wordmark text contrast >= 4.5:1 against band background | `opacity: 0.8` removed from `.wordmark-strip__item`. Effective contrast: 7.43:1. Required: 4.5:1. | **PASS** |
| 8 | All Canvas patches set `component_version: NULL` or document platform constraint | Unchanged from prior T — documented deviation. | PASS |
| 9 | Files staged by explicit path | No new files in rework (1 file modified: dy-section.css). Within cap. | PASS |
| 10 | F scope cap respected (≤ 6 files) | 1 file modified. | PASS |

---

## Blocking issues

None. The single blocker from the original T handoff (AC 7, wordmark contrast 4.47:1 < 4.5:1) is resolved. Effective contrast is now 7.43:1.

---

## Advisory notes

1. F's rework ratio (7.43:1) matches T's independent computation exactly. No discrepancy.
2. The WCAG comment block in dy-section.css (lines 791–799) has been updated to document the rework rationale. The comment is accurate.
3. Cross-page regression sweep passed. `/about-us` and `/` return 200; homepage logo-grid count remains at 7.

---

## Decision Logic

T complete, no blocking issues. Ready for S.
