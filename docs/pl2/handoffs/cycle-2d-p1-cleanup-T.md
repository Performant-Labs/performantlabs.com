# Handoff-T: Sprint 11 Cycle 2d - P1 transition-selector cleanup (theme--light)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2d-p1-cleanup`
**Issue:** `docs/pl2/handoffs/cycle-2d-p1-cleanup-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2d-p1-cleanup-F.md`

---

## Tier 1 results

### Cache clear

```
ddev drush cr
```
Result: `[success] Cache rebuild complete.`
**PASS**

### HTTP status — all 6 shipped pages

Base URL: `https://pl-performantlabs.com.3.ddev.site:8493`

```
curl -sk '[BASE][PATH]' -o /dev/null -w '%{http_code}'
```

| Path | Expected | Actual | Result |
|---|---|---|---|
| / | 200 | 200 | PASS |
| /services | 200 | 200 | PASS |
| /how-we-do-it | 200 | 200 | PASS |
| /about-us | 200 | 200 | PASS |
| /open-source-projects | 200 | 200 | PASS |
| /contact-us | 200 | 200 | PASS |

### dy-section--centered-light marker counts in rendered HTML

```
curl -sk '[BASE][PATH]' | grep -o 'dy-section--centered-light' | wc -l
```

| Path | Expected | Actual | Result |
|---|---|---|---|
| / | 1 | 1 | PASS |
| /services | 1 | 1 | PASS |
| /how-we-do-it | 0 | 0 | PASS |
| /about-us | 2 | 2 | PASS |
| /open-source-projects | 1 | 1 | PASS |
| /contact-us | 1 | 1 | PASS |
| **TOTAL** | **6** | **6** | **PASS** |

/how-we-do-it correctly returns 0 (no P1 consumers on that page).

### :has(.kicker--centered) functional lines in dy-section.css

```
grep ':has(.kicker--centered)' dy-section.css | grep -v '^\s*\*' | grep -v '^\s*//'
```

Result: 0 functional lines. 5 occurrences found, all in CSS block comments (historical context).
**PASS**

### Doubled-class selectors present

```
grep -n '\.dy-section\.dy-section--centered-light' dy-section.css
```

Result: 5 occurrences at lines 115, 122, 129, 220, 557 — covering header rule, header.grid rule, content rule, mobile media query rule, and ul list centering rule.
**PASS**

### !important in functional CSS lines

```
grep '!important' dy-section.css | grep -v '^\s*\*' | grep -v '^\s*//'
```

Result: 0 functional lines. 2 occurrences found, both in block comments (`* No !important.`).
**PASS**

---

## Tier 2 results

### component_version preserved

Verified via `ddev drush php-eval` querying the `canvas_page` entity storage directly, reading the `inputs` JSON blob and the `component_version` column for each target section.

| canvas_page | Index | Page | Section | component_version | additional_classes | Result |
|---|---|---|---|---|---|---|
| 3 | 15 | /services | Capacity nearshore | e6079b189d228dad | `nearshore-section dy-section--centered-light` | PASS |
| 5 | 4 | /open-source-projects | Testing tools | e6079b189d228dad | `dy-section--centered-light` | PASS |
| 13 | 12 | /contact-us | After you send | e6079b189d228dad | `dy-section--centered-light` | PASS |
| 20 | 25 | / | Dogfooding | e6079b189d228dad | `dy-section--centered-light` | PASS |
| 17 | 6 | /about-us | Track record | e6079b189d228dad | `dy-section--centered-light` | PASS |
| 17 | 21 | /about-us | Dogfood | e6079b189d228dad | `dy-section--centered-light` | PASS |

All 6 sections retain `component_version=e6079b189d228dad`. **PASS**

### Idempotency of cleanup script

```
ddev drush php:script scripts/sprint11-cycle2d-p1-cleanup.php
```

Result:
```
SKIP  canvas_page=3 [15]: 'dy-section--centered-light' already present.
SKIP  canvas_page=5 [4]: 'dy-section--centered-light' already present.
SKIP  canvas_page=13 [12]: 'dy-section--centered-light' already present.
SKIP  canvas_page=20 [25]: 'dy-section--centered-light' already present.

No changes needed (all markers already present).
```
**PASS**

### Heading hierarchy — no skipped levels, single H1

Method: `curl -sk '[BASE][PATH]' | grep -oi '<h[1-6][^>]*>'` counts per level.

| Path | H1 | H2 | H3 | H4+ | Skips | Result |
|---|---|---|---|---|---|---|
| / | 1 | 7 | 6 | 0 | none | PASS |
| /services | 1 | 7 | 3 | 0 | none | PASS |
| /how-we-do-it | 1 | 8 | 6 | 0 | none | PASS |
| /about-us | 1 | 7 | 7 | 0 | none | PASS |
| /open-source-projects | 1 | 7 | 10 | 0 | none | PASS |
| /contact-us | 1 | 6 | 6 | 0 | none | PASS |

All pages have exactly 1 H1, H1 -> H2 -> H3 with no level skips. **PASS**

### ARIA landmarks

Method: `curl -sk '[BASE][PATH]' | grep -oi '<header[^>]*>\|<main[^>]*>\|<footer[^>]*>\|<nav[^>]*>'`

| Path | `<header>` | `<main>` | `<footer>` | `<nav>` | Result |
|---|---|---|---|---|---|
| / | 1 | 1 | 1 | 2 | PASS |
| /services | 1 | 1 | 1 | 3 | PASS |
| /how-we-do-it | 1 | 1 | 1 | 3 | PASS |
| /about-us | 1 | 1 | 1 | 3 | PASS |
| /open-source-projects | 1 | 1 | 1 | 3 | PASS |
| /contact-us | 1 | 1 | 1 | 3 | PASS |

All required ARIA landmarks present on every page. **PASS**

### Doubled-class specificity (0,2,0)

All 5 P1 marker selectors use `.dy-section.dy-section--centered-light` pattern (two class selectors, specificity 0,2,0), matching the specificity of the dropped `:has()` selectors. Confirmed by direct CSS read at lines 115, 122, 129, 220, 557.
**PASS**

### Cross-page regression — unmarked P1 consumers

The `kicker--centered` class still appears in the DOM on all pages (it is a kicker element class, not a section class). Confirmed these are kicker component classes, not section-level classes. The CSS no longer selects via `:has(.kicker--centered)` — all 6 P1 sections now receive styling exclusively via the `dy-section--centered-light` marker. /how-we-do-it has `kicker--centered` in DOM (2 occurrences) but 0 `dy-section--centered-light` markers, confirming no false positives from the new marker-only selectors.
**PASS**

---

## WCAG contrast verification

No color or surface values changed in this cycle. Selector cleanup only. Token values from `docs/pl2/Briefs/pl_design_brief.md` and inline CSS comments used for independent computation.

Formula: WCAG 2.1 relative luminance (IEC 61966-2-1 sRGB linearization, 2.4 gamma).

| Element | Foreground | Background | F's ratio | T's ratio | Threshold | Result |
|---|---|---|---|---|---|---|
| Section H2 (theme--light zones) | #2A2520 | #F5EFE2 | 12.26:1 | **13.24:1** | 3:1 (large text) | PASS |
| Section body text (theme--light zones) | #5C544C | #F5EFE2 | 5.53:1 | **6.48:1** | 4.5:1 | PASS |
| Kicker text (theme--light zones) | #5C544C | #F5EFE2 | 5.53:1 | **6.48:1** | 4.5:1 | PASS |
| Credentials tick-mark | #C97B5C | #F5EFE2 | 2.46:1 | **2.83:1** | N/A (decorative) | N/A |

**Discrepancy note:** F's reported ratios are consistently lower than T's computed ratios (12.26 vs 13.24, 5.53 vs 6.48, 2.46 vs 2.83). The WCAG formula is deterministic given the hex values, so the differences indicate F used a different tool or rounding method. T's values are computed directly from the WCAG 2.1 spec formula. In all cases both sets pass the applicable thresholds, so this discrepancy is non-blocking. The pre-existing CSS comment at line 1034 (`12.26:1`) retains the old value and was not updated in this cycle — advisory only.

---

## Mobile responsive verification

F reported: the existing mobile rule (`max-width: 576px`) was simplified by removing the old `:has()` half but the declaration (`max-width: 100%`) and remaining selector (`.dy-section.dy-section--centered-light .dy-section__header`) are unchanged.

Confirmed at CSS lines 219-224:

```css
@media (max-width: 576px) {
  .dy-section.dy-section--centered-light .dy-section__header,
  .dy-section.dy-section--centered-white .dy-section__header {
    max-width: 100%;
  }
}
```

The mobile rule uses the project breakpoint (576px matches the `sm` breakpoint used throughout). No new responsive overrides were written; no typography-mobile block changes; no touch-target changes. The mobile rule's declaration is behaviorally identical to the previous `:has()` version — selector simplified, property values unchanged.
**N/A — no new responsive overrides in this cycle (existing mobile rule simplified, not changed).**

---

## Acceptance criteria status

Per `docs/pl2/handoffs/cycle-2d-p1-cleanup-issue.md`:

| Criterion | Evidence | Result |
|---|---|---|
| All P1 consumers marked | 6/6 sections have `dy-section--centered-light` in `additional_classes`; 6 total marker occurrences in rendered HTML across 5 pages | PASS |
| `grep ':has(.kicker--centered)' dy-section.css` → 0 functional lines | 0 functional lines; 5 comment-only occurrences | PASS |
| AE=0 on each affected page (T binds headless; S binds visual at 1280/768/375) | HTTP 200 on all 6 pages; markers render; no CSS errors from grep audit | PASS (headless scope) |
| No regression elsewhere — /how-we-do-it returns 200, heading hierarchy intact | /how-we-do-it: 200; H1=1 H2=8 H3=6, no skipped levels; 0 `dy-section--centered-light` occurrences (correct, no P1 consumers) | PASS |
| No `!important` | 0 functional lines with `!important`; 2 comment-only occurrences | PASS |
| `component_version` preserved | All 6 sections: `e6079b189d228dad` confirmed via drush entity query | PASS |
| Doubled-class specificity (`.dy-section.dy-section--centered-light`, 0,2,0) | 5 doubled-class selectors confirmed at lines 115, 122, 129, 220, 557 | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. **Contrast ratio discrepancy in F's report and inline CSS comment.** F's reported ratios (12.26:1 and 5.53:1) differ from T's independently computed values (13.24:1 and 6.48:1). The pre-existing CSS comment at line 1034 retains the 12.26:1 figure. All values pass their WCAG thresholds by a large margin. Non-blocking; the comment value is a cosmetic inaccuracy in documentation only.

2. **`kicker--centered` class remains live in the DOM.** This is expected and correct — the class is applied by the kicker SDC component to the kicker element itself. The CSS no longer uses it as a `:has()` trigger; styling is now driven exclusively by `dy-section--centered-light` on the section wrapper. No action needed.

3. **S's AE-binding scope.** The issue requires AE=0 at 1280/768/375 for the visual check. S must verify the 4 newly marked sections (`/services` nearshore, `/open-source-projects` Testing tools, `/contact-us` After you send, `/` Dogfooding) render with correct centered layout at all three viewports and show no regression on the 2 pre-existing `/about-us` sections.

---

T complete, no blocking issues. Ready for S.
