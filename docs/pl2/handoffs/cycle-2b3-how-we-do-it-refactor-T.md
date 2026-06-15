# Handoff-T: Cycle 2b.3 - /how-we-do-it selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b3-how-we-do-it`
**Issue:** `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b3-how-we-do-it-refactor-F.md`

---

## Tier 1 results

### Cache clear

```
ddev drush cr
```
Expected: "Cache rebuild complete." Actual: "Cache rebuild complete." **PASS**

### HTTP status — /how-we-do-it

```
curl -sk 'https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it' -o /dev/null -w '%{http_code}'
```
Expected: 200. Actual: 200. **PASS**

### Marker count — dy-section--kicker-inline

```
curl -sk '.../how-we-do-it' | grep -o 'dy-section--kicker-inline' | wc -l
```
Expected: 3. Actual: 3. **PASS**

### Marker count — dy-section--tight-header

```
curl -sk '.../how-we-do-it' | grep -o 'dy-section--tight-header' | wc -l
```
Expected: 1. Actual: 1. **PASS**

### Full class attributes on marked sections

Extracted from rendered HTML:

| Section | Class string |
|---|---|
| Week 1 | `dy-section dy-section--kicker-inline theme--light container ...` |
| Week 2 | `dy-section dy-section--kicker-inline theme--white container ...` |
| Week 3+ | `dy-section dy-section--kicker-inline theme--secondary container ...` |
| What we don't do | `dy-section dy-section--tight-header theme--light container ...` |

**PASS** — all 4 match F's reported values exactly.

### CSS selectors in served stylesheet

```
curl -sk '.../dy-section.css?texi2i' | grep -n 'kicker-inline\|tight-header'
```

Active selectors confirmed present:
```
272: .dy-section.dy-section--kicker-inline .dy-section__header.grid {
304: .dy-section.dy-section--kicker-inline .dy-section__header,
305: .dy-section.dy-section--tight-header .dy-section__header {
```
**PASS**

### No active old :has(.kicker--inline) selectors

```
curl -sk '.../dy-section.css?texi2i' | grep -E '^\.dy-section:(has|.*\+ \.dy-section)'
```
No output. All occurrences of old selectors confirmed to be in comments only (verified via file read, lines 270, 298, 301). **PASS**

### No active theme--secondary sibling combinator

Same check as above — the selector `.dy-section.theme--secondary + .dy-section .dy-section__header` appears only in comment text (line 301). **PASS**

### No !important

```
grep -n '!important' dy-section.css
```
2 occurrences, both in comment lines (80, 167). Zero active `!important` declarations. **PASS**

### Cross-page HTTP and byte size

| Page | HTTP | Bytes |
|---|---|---|
| / | 200 | 82,568 |
| /services | 200 | 59,831 |
| /about-us | 200 | 57,916 |
| /open-source-projects | 200 | 68,123 |
| /contact-us | 200 | 68,625 |

All 200. Byte sizes within normal cache-variance range of F's pre/post table. **PASS**

### New markers absent from other pages

| Page | kicker-inline count | tight-header count |
|---|---|---|
| / | 0 | 0 |
| /services | 0 | 0 |
| /about-us | 0 | 0 |
| /open-source-projects | 0 | 0 |
| /contact-us | 0 | 0 |

**PASS** — markers are /how-we-do-it-only.

### Expected content strings rendered

`Week 1`, `Week 2`, `Week 3`, `What we don` all present in /how-we-do-it HTML. **PASS**

---

## Tier 2 results

### component_version preserved

```
ddev drush php:eval '... foreach ([4, 10, 14, 22] as $idx) ...'
```

| Index | component_version | additional_classes |
|---|---|---|
| [4] | e6079b189d228dad | dy-section--kicker-inline |
| [10] | e6079b189d228dad | dy-section--kicker-inline |
| [14] | e6079b189d228dad | dy-section--kicker-inline |
| [22] | e6079b189d228dad | dy-section--tight-header |

Matches F's reported values exactly. **PASS**

### Marker script idempotency

```
ddev drush php:script scripts/sprint10-cycle2b3-how-we-do-it-markers.php
```

All 4 sections output `SKIP [N]: '...' already present.` followed by `No changes needed (all markers already present).` **PASS**

### Heading hierarchy — /how-we-do-it

Extracted heading tags:

- Visually-hidden H2s (nav/breadcrumb): structural chrome, not content hierarchy
- H1 (×1): page hero heading
- H2 (×4): section headings (Week 1 Audit, Week 2 Validation, Week 3+ Expansion, What we don't do / CTA)
- H3 (×3 card titles + 3 footer column headings)

Single H1. No skipped levels (H1 → H2 → H3). **PASS**

### ARIA landmarks — /how-we-do-it

| Landmark | Present | Note |
|---|---|---|
| `<header>` | Yes | `.theme--white.site-header` |
| `<nav>` | Yes | main menu + breadcrumb + footer nav |
| `<main>` | Yes | `.site-main` |
| `<footer>` | Yes | `.site-footer.theme--white` |

**PASS**

### CSS diff — declarations unchanged

```
git diff dy-section.css | grep '^[+-]' | grep -v comment lines
```

Exactly 4 lines changed (2 removed, 2 added). Only selector text changed; `display: block` and `margin-bottom: 2rem` declarations are identical in old and new rules. No new rules, no new declarations. **PASS**

### Specificity trace

| Rule | Old specificity | New specificity | Match |
|---|---|---|---|
| P5 `.dy-section__header.grid` | (0,4,0) | (0,4,0) | Maintained |
| P5 `.dy-section__header` | (0,3,0) | (0,3,0) | Maintained |
| P6 `.dy-section__header` | (0,4,0) old sibling | (0,3,0) new marker | Reduced |

F's P6 specificity-reduction reasoning (no competing selector at (0,2,0)+ on `margin-bottom` for this element) verified against CSS file — no conflict found. **PASS**

---

## WCAG contrast verification

F reported no color or contrast changes in this cycle. Both changes are:
1. Marker class additions to Canvas `additional_classes` (no visual output)
2. Selector rewrites using identical property/value declarations (`display: block`, `margin-bottom: 2rem`)

No hex values, OKLCH tokens, or opacity values were modified. Existing contrast pairs from prior cycles are unaffected.

**Recomputation: N/A — no contrast-bearing changes in this cycle. Prior cycle ratios remain valid.**

---

## Mobile responsive verification

N/A — no responsive overrides written in this cycle. The marker classes are structural markers only. The CSS declarations (`display: block` on `.dy-section__header.grid` and `margin-bottom: 2rem` on `.dy-section__header`) apply at all viewports and are not wrapped in media queries, consistent with the pre-refactor behavior of the old `:has()` selectors.

---

## Acceptance criteria status

| Criterion | Status | Evidence |
|---|---|---|
| Markers on affected sections of /how-we-do-it | **PASS** | 3× kicker-inline + 1× tight-header confirmed in rendered HTML; `component_version=e6079b189d228dad` on all 4 |
| P5 + P6 rewritten as marker-based | **PASS** | Git diff shows 2 old selectors removed, 2 new marker selectors added; no declarations changed |
| /how-we-do-it AE = 0 at 1280/768/375 vs pre-refactor | **NOT VERIFIABLE BY T** | Pixel diff is S-domain (Playwright + ImageMagick). T confirms declarations are unchanged — the structural precondition for zero AE holds |
| No regression on other pages | **PASS** | All 5 pages return HTTP 200; new markers absent from all other pages |
| No `!important` | **PASS** | 2 occurrences in file, both in comments; zero active |
| `component_version` preserved | **PASS** | All 4 sections at `e6079b189d228dad` confirmed via drush |
| T1 + T2 PASS | **PASS** | All T1 and T2 checks above pass |

---

## Blocking issues

None. All verifiable T1 and T2 checks pass.

---

## Advisory notes

1. The AE = 0 criterion at 1280/768/375 is structurally sound — declarations are byte-identical before and after the refactor — but pixel verification is S's responsibility per the pipeline.

2. `component_version` is stored as a top-level field on the component array, not inside `inputs`. F's eval script used the correct path (`$comp["component_version"]`); T's initial eval used the wrong path but was corrected. No data issue.

3. The CSS is modified but not yet committed (git status: modified/untracked). F's work is complete; O or F should commit before S runs visual diffs.

---

T complete, no blocking issues. Ready for S.
