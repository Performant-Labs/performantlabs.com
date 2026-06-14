# Handoff-T: Sprint 11 Cycle 2c — P2 transition-selector cleanup

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2c-p2-cleanup`
**Issue:** `docs/pl2/handoffs/cycle-2c-p2-cleanup-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2c-p2-cleanup-F.md`

---

## Tier 1 results

### Cache clear

| Command | Expected | Actual | Result |
|---|---|---|---|
| `ddev drush cr` | `Cache rebuild complete` | `[success] Cache rebuild complete.` | PASS |

### HTTP status (all 7 pages — 6 cross-page + /open-source-projects regression)

URL base: `https://pl-performantlabs.com.3.ddev.site:8493`

| Path | Expected | Actual | Result |
|---|---|---|---|
| `/` | 200 | 200 | PASS |
| `/services` | 200 | 200 | PASS |
| `/how-we-do-it` | 200 | 200 | PASS |
| `/about-us` | 200 | 200 | PASS |
| `/open-source-projects` | 200 | 200 | PASS |
| `/contact-us` | 200 | 200 | PASS |

### Marker counts in rendered HTML

`dy-section--centered-white` occurrences per page (grep on live curl output):

| Path | Expected per spawn prompt | Actual | Result |
|---|---|---|---|
| `/` | delta 15 = 1 new marker | 1 | PASS |
| `/services` | delta 6 = 1 new marker (2 total with prior Dogfooding section) | 2 | PASS |
| `/how-we-do-it` | delta 0 = 1 new marker | 1 | PASS |
| `/about-us` | deltas 0+11 = 2 new markers | 2 | PASS |
| `/open-source-projects` | prior-cycle markers untouched | 2 | PASS |
| `/contact-us` | delta 0 = 1 new marker | 1 | PASS |

Note: /services shows 2 occurrences because the Dogfooding section (canvas_page 3, index 3) was marked in a prior cycle; the new marker is index 6 "Four ways we engage". Both count is expected.

### P2 :has selector removal

| Command | Expected | Actual | Result |
|---|---|---|---|
| `grep ':has(.dy-section__header .kicker--centered)' dy-section.css` | 0 functional lines | 1 line — comment only (line 85, history note in `/* ... */` block) | PASS |

Line 85 reads: `*   Old :has(.dy-section__header .kicker--centered) transition selectors` — inside a `/** */` comment block. Zero functional CSS lines match.

### No `!important`

| Command | Expected | Actual | Result |
|---|---|---|---|
| `grep '!important' dy-section.css` (excluding comment lines) | 0 in functional CSS | 2 hits, both in comment lines (lines 91, 169) | PASS |

Lines 91 and 169 are inside `/* ... */` comment blocks. Zero functional `!important` declarations exist.

### Doubled-class selector count

| Selector pattern | Expected | Actual | Result |
|---|---|---|---|
| `.dy-section.dy-section--centered-white` | 4 occurrences (3 rule selectors + 1 with `:not` guard) | 4 (lines 138, 145, 154, 214) | PASS |

---

## Tier 2 results

### component_version preserved

Verified via `ddev drush php:eval` reading entity field data directly:

| canvas_page | Index | component_version | additional_classes | Result |
|---|---|---|---|---|
| 3 | 6 | `e6079b189d228dad` | `dy-section--centered-white` | PASS |
| 4 | 0 | `e6079b189d228dad` | `landing-hero dy-section--centered-white` | PASS |
| 17 | 0 | `e6079b189d228dad` | `dy-section--cta-pair dy-section--centered-white` | PASS |
| 17 | 11 | `e6079b189d228dad` | `dy-section--bio-block dy-section--centered-white` | PASS |
| 20 | 15 | `e6079b189d228dad` | `dy-section--centered-white` | PASS |
| 13 | 0 | `e6079b189d228dad` | `contact-us-hero dy-section--centered-white` | PASS |

All 6 sections show `component_version = e6079b189d228dad`. Prior markers (`landing-hero`, `dy-section--cta-pair`, `dy-section--bio-block`, `contact-us-hero`) are preserved alongside the new marker.

### Idempotency

| Command | Expected | Actual | Result |
|---|---|---|---|
| Re-run `ddev drush php:script scripts/sprint11-cycle2c-p2-cleanup.php` | All 6 SKIP, no saves | All 6 SKIP, "No changes needed (all markers already present)." | PASS |

### Heading hierarchy

Single H1 on each page:

| Path | H1 count | Result |
|---|---|---|
| `/` | 1 | PASS |
| `/services` | 1 | PASS |
| `/how-we-do-it` | 1 | PASS |
| `/about-us` | 1 | PASS |
| `/open-source-projects` | 1 | PASS |
| `/contact-us` | 1 | PASS |

### ARIA landmarks (homepage spot-check)

| Landmark | Present | Result |
|---|---|---|
| `<header` | yes | PASS |
| `<main` | yes | PASS |
| `<footer` | yes | PASS |
| `<nav` | yes | PASS |

### Structural guard on content centering

`:not(:has(.grid-wrapper))` guard confirmed on line 154:
```
.dy-section.dy-section--centered-white:not(:has(.grid-wrapper)) .dy-section__content {
```
This guard prevents `text-align: center; align-items: center` from applying to card-grid sections (/services "Four ways we engage", homepage "What we ship"). PASS.

### P1 :has selectors untouched (scope boundary)

P1 (theme--light) `:has(.kicker--centered)` selectors remain in dy-section.css at lines 105, 113, 121, 213, 551. Per F's autonomous decision #4 and issue scope ("P2 only"), this is correct. No unexpected removal occurred.

---

## WCAG contrast verification

No color or contrast changes in this cycle. F's reported pairs are from established token values. T independently computed ratios using the WCAG relative luminance formula.

| Element | Foreground | Background | F's ratio | T's ratio | Threshold | Result |
|---|---|---|---|---|---|---|
| Section H2 (white zones) | `#1F1A14` | `#FFFFFF` | 17.29:1 | 17.27:1 | >=3.0:1 (large text) | PASS |
| Section body text (white zones) | `#5C544C` | `#FFFFFF` | 7.22:1 | 7.43:1 | >=4.5:1 | PASS |
| Kicker text (white zones) | `#5C544C` | `#FFFFFF` | 7.22:1 | 7.43:1 | >=4.5:1 | PASS |

Discrepancy note: F reported 7.22:1 for `#5C544C`/`#FFFFFF`. T computes 7.43:1 using the standard WCAG formula. The difference is likely a tool rounding variation. Both values clear the 4.5:1 threshold by a large margin; the discrepancy is non-blocking.

---

## Mobile responsive verification

N/A — no responsive overrides written in this cycle. The existing mobile rule (max-width: 100% at `<=576px`, line 211-217) was simplified by removing the old P2 `:has()` half — the declaration value and the marker selector that remains are unchanged from the prior cycle. No new breakpoints or typography-mobile values were introduced.

---

## Acceptance criteria status

From `docs/pl2/handoffs/cycle-2c-p2-cleanup-issue.md`:

| Criterion | Evidence | Result |
|---|---|---|
| `.dy-section--centered-white` marker on all 4 target sections (added via idempotent script preserving `component_version`) | All 6 sections (4 spec + 2 cross-page additions) confirmed in entity data with `cv=e6079b189d228dad`; script re-run returns all SKIP | PASS |
| P2 `:has(.dy-section__header .kicker--centered)` half dropped from `dy-section.css` everywhere — grep returns 0 functional lines | `grep` returns 1 hit, line 85, inside `/* */` comment block only; 0 functional lines | PASS |
| All 5 affected pages (/services, /how-we-do-it, /about-us, /open-source-projects, plus regression check on /) HTTP 200 | All 6 pages (includes /contact-us added by F) return 200 | PASS |
| No `!important` | 2 grep hits in comments only; 0 in functional CSS | PASS |
| Specificity-safe doubled-class form | `.dy-section.dy-section--centered-white` (0,2,0) confirmed at all 4 selector sites | PASS |
| `component_version` preserved | All 6 sections show `e6079b189d228dad` per direct entity query | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. F expanded scope from 4 to 6 sections. This was a correct autonomous decision: dropping the `:has()` half without marking the two additional consumers (homepage "What we ship" and /contact-us hero) would have broken their header centering. T confirms both decisions are structurally sound.

2. The `:not(:has(.grid-wrapper))` guard on the content centering rule is a retained structural guard, not a P2 transition fallback. It applies on the marker selector, not as a fallback alongside `:has()`. This is an appropriate use of `:has()` and is distinct from the P2 transition pattern that was dropped.

3. P1 (theme--light) `:has(.kicker--centered)` selectors remain at lines 105, 113, 121, 213, 551. These are outside this cycle's scope. A future cycle should apply `.dy-section--centered-light` markers to /services nearshore and /open-source-projects then drop those `:has()` halves to complete the ADV-3 architectural close.

4. F's reported contrast ratio for `#5C544C`/`#FFFFFF` (7.22:1) differs from T's computed value (7.43:1). Both clear the threshold. The discrepancy is worth noting for calibration of F's contrast tool but does not affect pass status.

---

T complete, no blocking issues. Ready for S.
