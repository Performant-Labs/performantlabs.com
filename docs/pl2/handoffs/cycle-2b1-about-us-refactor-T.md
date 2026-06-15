# Handoff-T: Cycle 2b.1 - /about-us selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b1-about-us`
**Issue:** `docs/pl2/handoffs/cycle-2b1-about-us-refactor-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b1-about-us-refactor-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | "Cache rebuild complete." | PASS |
| HTTP /about-us | `curl -sk .../about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /services | same pattern | 200 | 200 | PASS |
| HTTP /how-we-do-it | same pattern | 200 | 200 | PASS |
| HTTP /open-source-projects | same pattern | 200 | 200 | PASS |
| HTTP / (homepage) | same pattern | 200 | 200 | PASS |
| Marker dy-section--centered-light (index 6) | `curl /about-us \| grep dy-section--` | present | class="dy-section dy-section--centered-light theme--light ..." | PASS |
| Marker dy-section--bio-block (index 11) | same | present | class="dy-section dy-section--bio-block theme--white ..." | PASS |
| Marker dy-section--centered-light (index 21) | same | present | class="dy-section dy-section--centered-light theme--light ..." | PASS |
| Marker dy-section--cta-pair (index 26) | same | present | class="dy-section dy-section--cta-pair theme--dark ..." | PASS |
| New marker selectors in served CSS | `curl CSS_URL \| grep -c "dy-section--centered-light\|dy-section--bio-block\|dy-section--cta-pair"` | >0 | 18 | PASS |
| Old :has() selectors retained | `curl CSS_URL \| grep -c ":has("` | >0 | 38 | PASS |
| !important in declarations | `curl CSS_URL \| grep "!important" \| grep -v "^\s*\*"` | 0 occurrences | 0 (both occurrences are inside comments) | PASS |
| No markers on /services | `curl /services \| grep -c "dy-section--cta-pair\|dy-section--centered-light\|dy-section--bio-block"` | 0 | 0 | PASS |
| No markers on /how-we-do-it | same | 0 | 0 | PASS |
| No markers on /open-source-projects | same | 0 | 0 | PASS |
| No markers on homepage | same | 0 | 0 | PASS |
| Wordmark strip P10 CSS unchanged | `curl CSS_URL \| grep "wordmark-strip-wrapper"` | present | .dy-section:has(.wordmark-strip-wrapper) at lines 842,847 | PASS |
| Wordmark not on /about-us | `curl /about-us \| grep -c "wordmark"` | 0 | 0 | PASS |
| Wordmark on /services | `curl /services \| grep -c "wordmark-strip-wrapper"` | >0 | 1 | PASS |

---

## Tier 2 results

| Check | Method | Result |
|---|---|---|
| DB: marker classes in Canvas entity | `ddev drush php:eval` — loaded canvas_page id=17, inspected additional_classes at indices 6, 11, 21, 26 | PASS |
| DB: component_version preserved | Same eval — inspected component_version field at all 4 patched indices | PASS |
| DB: idempotency | Script output: "No changes needed (all markers already present)." | PASS |
| P8 transition — /services closing CTA has 2 buttons in theme--dark | `curl /services \| grep -A100 'theme--dark' \| grep -c 'class="button '` | PASS (count: 2) |
| P8 transition — /services closing CTA has NO dy-section--cta-pair | `curl /services \| grep "dy-section--cta-pair"` | PASS (empty) |
| P1 — /open-source-projects has kicker--centered (old :has() still serves it) | `curl /open-source-projects \| grep -c "kicker--centered"` | PASS (count: 4) |
| P1 — /how-we-do-it has kicker--centered (old :has() still serves it) | `curl /how-we-do-it \| grep -c "kicker--centered"` | PASS (count: 2) |
| P9 direct swap — bio-block selector present | `curl CSS_URL \| grep "dy-section--bio-block"` | PASS (2 selector rules, no old :has() retained for P9) |
| Heading hierarchy — single H1 | `curl /about-us \| grep -c '<h1 '` | PASS (1) |
| Heading hierarchy — no skipped levels | Visual parse of heading sequence: H1 → H2 → H2 → H3 × 3 → H3 → H2 → H2 | PASS |
| ARIA landmark — `<header>` | `curl /about-us \| grep -o '<header[^>]*>' ` | PASS |
| ARIA landmark — `<main>` | same | PASS |
| ARIA landmark — `<footer>` | same | PASS |
| ARIA landmark — `<nav>` | same (2 nav elements: main-menu, breadcrumb) | PASS |
| Comma-selector transition structure — P1 | `curl CSS_URL \| sed -n '60,80p'` — two-line selector with `.dy-section--centered-light` first, old `:has(.kicker--centered)` second | PASS |
| Comma-selector transition structure — P7 | `curl CSS_URL \| grep -A2 "centered-light.*text ul"` — same pattern | PASS |
| Comma-selector transition structure — P8 | `curl CSS_URL \| sed -n '586,621p'` — 5 selector pairs, each with `.dy-section--cta-pair` first and `:has(> .button + .button)` second | PASS |

---

## WCAG contrast verification

No color or opacity changes were made in this cycle. All CSS declarations are selector rewrites only; property values are identical to the pre-refactor state. Ratios are independently computed using the WCAG relative luminance formula.

| Element | Foreground | Background | F's ratio | T's ratio | Threshold | Result |
|---|---|---|---|---|---|---|
| Track record body text | #5C544C | #F5EFE2 | 5.53:1 | 6.48:1 | 4.5:1 (normal text) | PASS |
| Bio block h3 | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | 3.0:1 (large text) | PASS |
| Closing CTA h2 | #F5EFE2 | #1F1A14 | 13.07:1 | 15.07:1 | 3.0:1 (large text) | PASS |
| Closing CTA body | #B8AFA0 | #1F1A14 | 7.39:1 | 7.96:1 | 4.5:1 (normal text) | PASS |
| Credentials tick-mark | #C97B5C | #F5EFE2 | 2.46:1 | 2.83:1 | N/A (decorative) | N/A |

**Note on discrepancies:** F's reported ratios for "Track record body text" (5.53 vs T's 6.48) and "Closing CTA h2" (13.07 vs T's 15.07) differ materially. All pairs pass their applicable thresholds regardless of which computation is used; the discrepancies are non-blocking. F may have applied a gamma correction variant or pulled values from a tool using a different rounding method.

---

## Mobile responsive verification

F reports no responsive overrides were written in this cycle. All existing responsive rules were preserved identically via the CSS rewrite.

Verified: the transition comma-selectors are present in the existing `@media (max-width: 576px)` blocks:

- **P1 mobile** (`@media max-width: 576px`): `.dy-section--centered-light .dy-section__header` paired with `.dy-section.theme--light:has(.kicker--centered) .dy-section__header` — confirmed at CSS lines 158-160.
- **P8 mobile** (`@media max-width: 576px`): `.dy-section.theme--dark.dy-section--cta-pair .dy-section__content` and `.dy-section.theme--dark.dy-section--cta-pair .dy-section__content > .button` paired with their `:has(> .button + .button)` counterparts — confirmed at CSS lines 611-619.

No new responsive rules were added. No breakpoints changed. N/A for typography-mobile verification (no typography changes in this cycle). Touch-target `min-height: 44px` already present on `.dy-section--cta-pair .dy-section__content > .button` in both desktop and mobile blocks — PASS.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| Canvas content edited: 4 sections on /about-us have marker classes | DB read via `ddev drush php:eval`: indices 6, 11, 21, 26 have `additional_classes` = `dy-section--centered-light`, `dy-section--bio-block`, `dy-section--centered-light`, `dy-section--cta-pair` respectively | PASS |
| `dy-section.css` rules rewritten to use marker selectors (transition for P1/P7/P8; direct swap for P9) | Served CSS: 18 marker selector occurrences; P9 uses direct swap (`.dy-section--bio-block`); P1/P7/P8 use comma-separated transition selectors | PASS |
| `/about-us` renders pixel-identical (T1+T2; T3 deferred to S) | 200 response, 57,899 bytes, all 4 markers in DOM, heading hierarchy intact, no structural regressions observed | PASS (T1/T2; T3 is S's scope) |
| No regression on `/services` (P8 selector functional until 2b.2) | /services: 200, 59,741 bytes, theme--dark section has 2 buttons, no `dy-section--cta-pair` applied | PASS |
| No regression on other pages (`/open-source-projects`, `/how-we-do-it`) | Both return 200, expected byte counts, no markers applied, kicker--centered still present (served by old :has() selectors) | PASS |
| No `!important` | Served CSS grep: 2 occurrences of "!important" string, both inside block comments — zero in declarations | PASS |
| Canvas `component_version` preserved | DB read: all 4 indices retain `component_version=e6079b189d228dad` (non-NULL) | PASS |
| T1 + T2 PASS | See Tier 1 and Tier 2 sections above | PASS |
| F handoff captures marker-section mapping, CSS rule diffs, verification results | Handoff-F contains the marker-to-section table, CSS rule diff table, and a T1/T2 verification section | PASS |

---

## Blocking issues

None.

---

## Advisory notes

1. **F's P8 rule count discrepancy.** F's handoff table says P8 has "6 rules" but the served CSS shows 5 selector pairs (3 desktop, 2 mobile). The mobile block omits a `:not(.button)` rule that the desktop block has — this is architecturally correct (column stacking at mobile handles non-button flow without an explicit override). The count in F's documentation is slightly inaccurate, but the CSS behavior is correct.

2. **Contrast ratio discrepancies (F vs T).** F's Track record body text ratio (5.53:1 vs T's 6.48:1) and Closing CTA h2 ratio (13.07:1 vs T's 15.07:1) differ beyond rounding. All pairs pass at both values. F may have used a tool applying a different linearization method. Non-blocking.

3. **P9 old selector fully removed.** F correctly made P9 a direct swap (`.dy-section.theme--white:has(.kicker--centered)` → `.dy-section--bio-block`). The old selector does not appear in served CSS for P9. This is correct per F's documented reasoning that the bio-block DOM pattern is unique to /about-us.

4. **P1 marker applied to two sections (index 6 and 21).** F correctly identified that both theme--light + kicker--centered sections on /about-us require the marker for selector parity during the transition window. Issue table listed only "Track record" but the additional Dogfood section (index 21) is a valid autonomous decision.

---

T complete, no blocking issues. Ready for S.
