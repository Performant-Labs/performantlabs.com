# Handoff-T: Cycle 2b.2 - /services selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b2-services`
**Issue:** `docs/pl2/handoffs/cycle-2b2-services-refactor-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b2-services-refactor-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | Cache rebuild complete | PASS |
| /services HTTP | `curl -sk .../services -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| /about-us HTTP | `curl -sk .../about-us -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| /open-source-projects HTTP | `curl -sk .../open-source-projects -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| /how-we-do-it HTTP | `curl -sk .../how-we-do-it -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| / HTTP | `curl -sk .../ -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| Hero marker in DOM | grep `dy-section--cta-pair` on rendered index 0 | present | `dy-section landing-hero dy-section--cta-pair theme--white` | PASS |
| Dogfooding marker in DOM | grep `dy-section--centered-white` on /services | present | `dy-section dy-section--centered-white theme--white` | PASS |
| Wordmark-strip marker in DOM | grep `dy-section--wordmark-strip` on /services | present | `dy-section dy-section--wordmark-strip theme--white` | PASS |
| Closing CTA marker in DOM | grep `dy-section--cta-pair theme--dark` on /services | present | `dy-section dy-section--cta-pair theme--dark` | PASS |
| `dy-section--centered-white` in served CSS | grep count | >= 1 | 7 occurrences | PASS |
| `dy-section--wordmark-strip` in served CSS | grep count | >= 1 | 4 occurrences | PASS |
| `dy-section--cta-pair` in served CSS | grep count | >= 1 | 16 occurrences | PASS |
| Old P8 `:has(> .button + .button)` in active CSS rules | grep — exclude comment lines | 0 active rules | 0 active rules (2 occurrences in comments only) | PASS |
| `!important` in active CSS rules | grep — exclude comment lines | 0 active rules | 0 active rules (2 occurrences in comments only) | PASS |
| Wordmark strip items rendered | grep `wordmark-strip__item` content | 6 items | Drupal, Playwright, Cypress, PHP, JavaScript, React | PASS |
| 6 rendered sections on /services | grep dy-section classes (top-level) | >= 4 markers | 6 sections, all 4 markers present | PASS |

---

## Tier 2 results

| Check | What was verified | Method | Result |
|---|---|---|---|
| H1 count on /services | Single H1 | `grep -c '<h1[^0-9]'` | 1 — PASS |
| Heading hierarchy on /services | No skipped levels | Extracted tag sequence: h1 (hero), h2 (sections), h3 (cards) | PASS |
| ARIA landmarks | header, main, footer, nav | `grep -oE '<(header|main|footer|nav)'` | All 4 present — PASS |
| P2 transition selector (old :has() retained) | Lines 112, 120, 131, 192 present in CSS | `grep -n 'theme--white:has'` | 4 active rule occurrences — PASS |
| /open-source-projects "Community" kicker--centered present | Old P2 :has() transition applies | grep kicker--centered on page | 4 occurrences; Community section is theme--white + kicker--centered in header — PASS |
| /open-source-projects has no `dy-section--centered-white` marker | Marker not applied to that page | grep dy-section classes | No `dy-section--centered-white` present — PASS |
| P8 marker-only (no old :has in active rules) | `theme--dark.dy-section--cta-pair` used exclusively | `grep -n 'theme--dark.*cta-pair'` in CSS | 5 active rule lines — PASS |
| /about-us `dy-section--cta-pair theme--dark` present | P8 closing CTA matches marker selector | grep dy-section classes on /about-us | Present — PASS |
| /about-us closing CTA has 2 anchor buttons | P8 layout rule activates correctly | grep `<a.*class="button` in CTA section | 2 anchor buttons — PASS |
| /services closing CTA has 2 anchor buttons | P8 layout rule activates correctly | grep `<a.*class="button` in CTA section | 2 anchor buttons — PASS |
| /how-we-do-it has no `dy-section--centered-white` | No false marker | grep dy-section classes | Absent — PASS |
| / homepage has no spurious markers | No false marker | grep dy-section classes | No marker classes except pre-existing — PASS |
| Touch targets (P4 + P8 buttons) | `min-height: 44px` set in all button rules | `grep -n 'min-height'` in CSS | 44px set at lines 167, 182, 638, 650 — PASS |
| Mobile max-width rule includes P2 | `dy-section--centered-white` and old :has() both in @media (max-width: 576px) | Read lines 186-195 | Both present — PASS |
| P10 direct swap | `dy-section--wordmark-strip` used, no old `:has(.wordmark-strip-wrapper)` | grep CSS | Old selector absent from active rules — PASS |
| `component_version` preserved on all 4 sections | `e6079b189d228dad` at top-level of component struct | drush php:eval on canvas_page id=3 indices 0, 20, 25, 27 | All 4: `e6079b189d228dad` — PASS |
| Script idempotency | Re-run yields "No changes needed" | F's reported test | Confirmed via F (T did not re-run destructively) — ADVISORY |

---

## WCAG contrast verification

F's contrast table reports no color changes in this cycle — all values carried forward from prior cycle handoffs. T independently computed the ratios from hex values in CSS files.

| Element | Foreground | Background | F's ratio | T's ratio | PASS/FAIL |
|---|---|---|---|---|---|
| Dogfooding body text | #5C544C | #FFFFFF | 7.43:1 | 7.43:1 | PASS (>= 4.5:1) |
| Dogfooding H2 | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | PASS (>= 3:1 large text) |
| Closing CTA H2 | #F5EFE2 | #1F1A14 | 13.07:1 | **15.07:1** | PASS (>= 3:1 large text) |
| Closing CTA body | #B8AFA0 | #1F1A14 | 7.39:1 | **7.96:1** | PASS (>= 4.5:1) |
| Hero H1 | #1F1A14 | #FFFFFF | 17.29:1 | 17.27:1 | PASS (>= 3:1 large text) |
| Wordmark label | #5C544C | #FFFFFF | 7.43:1 | 7.43:1 | PASS (>= 4.5:1) |
| Wordmark items | #5C544C | #FFFFFF | 7.43:1 | 7.43:1 | PASS (>= 4.5:1) |

Discrepancy notes:

- Closing CTA H2 (13.07 vs 15.07): F's value appears to have been computed by a different tool and carried forward unchanged from `cycle-3-closing-cta-F-rework.md`. T's computation uses the standard WCAG 2.1 formula with sRGB linearization. The actual ratio (15.07) exceeds the threshold by 5x — all pass.
- Closing CTA body (7.39 vs 7.96): Same carry-forward from cycle 3. Both exceed the 4.5:1 AA threshold.
- Dogfooding H2 / Hero H1 (17.29 vs 17.27): Rounding difference only.

No WCAG failures. All elements pass at T's computed values.

---

## Mobile responsive verification

F states no responsive overrides were written in this cycle. All existing responsive rules are preserved via the selector rewrites.

T verified:

1. P4 mobile rule (`@media (max-width: 576px)`) applies to `.dy-section.theme--white.dy-section--cta-pair .dy-section__content` — correct marker-based selector.
2. P8 mobile rule (`@media (max-width: 576px)`) applies to `.dy-section.theme--dark.dy-section--cta-pair .dy-section__content` — correct marker-based selector.
3. Mobile max-width release (`@media (max-width: 576px)`) includes both `dy-section--centered-white` and the P2 old `:has()` half — confirmed at lines 188-195 of dy-section.css.
4. P10 wordmark mobile rule (`@media (max-width: 576px)`) targets `.wordmark-strip__row` and `.wordmark-strip__item` — unchanged from prior cycle; no selector rewrite needed.

No breakpoint mismatches found. Touch targets confirmed at 44px min-height for all interactive button rules.

---

## Acceptance criteria status

| Criterion (from issue) | Status | Evidence |
|---|---|---|
| All 5 affected /services sections have correct marker(s) in `additional_classes`. | PASS | 4 sections patched (hero: `dy-section--cta-pair`, dogfooding: `dy-section--centered-white`, wordmark strip: `dy-section--wordmark-strip`, closing CTA: `dy-section--cta-pair`). Nearshore already carries `nearshore-section` from Sprint 6 Cycle 3 and is theme--light, not matched by P2. Deviation documented in F. |
| P2 + P4 + P10 use new marker selectors; P3 removed. | PASS | P2 uses transition selector (marker + old `:has()`) to preserve /open-source-projects. P3 merged into P2. P4 direct swap confirmed (`dy-section.theme--white.dy-section--cta-pair`). P10 direct swap confirmed (`dy-section--wordmark-strip`). Old P3 `:not(:has(.grid-wrapper))` selector absent from marker half. |
| P8 old `:has()` half removed from `dy-section.css` (now safe). | PASS | No active CSS rule contains `:has(> .button + .button)`. 2 occurrences in comments only. |
| `/services` renders pixel-identical at 1280/768/375 vs pre-refactor. | DEFERRED | T1+T2 PASS. T3 pixel-diff deferred to S per pipeline. |
| No regression on `/about-us` (P8 cleanup must not break closing CTA). | PASS | `dy-section--cta-pair theme--dark` present on /about-us. 2 anchor buttons confirmed. Page returns 200. |
| No regression on `/how-we-do-it` (no consumer of old P2 selector). | PASS | No marker classes on /how-we-do-it. Page returns 200 (60189 bytes). |
| No `!important`. | PASS | 0 occurrences in active CSS rules. |
| Canvas `component_version` preserved. | PASS | All 4 patched sections: `e6079b189d228dad` at top-level `component_version` field in canvas_page id=3. |
| T1 + T2 PASS. | PASS | All checks in this document. |

---

## Blocking issues

None.

---

## Advisory notes

1. **F's contrast table has inaccurate carry-forward values.** Closing CTA H2 (reported 13.07, actual 15.07) and body (reported 7.39, actual 7.96) were copied from `cycle-3-closing-cta-F-rework.md` without recomputing. All elements pass WCAG at T's computed values. Non-blocking.

2. **Dogfooding section has no H2 visible in the heading hierarchy grep.** `curl | grep -o '<h[1-6]...'` only captures headings with text content on the same line. The Dogfooding H2 is multi-line markup. The heading hierarchy structure (h1 > h2s > h3s) was confirmed by reviewing the DOM section order. Non-blocking.

3. **Script idempotency was asserted by F but not independently re-run by T.** The script contains correct idempotency logic (`strpos` check before patching). Since the entity is already saved with markers, T did not re-run the script to avoid any risk of side effects. An independent re-run to confirm "No changes needed" is advisable before closing the cycle if O wants full closure. Non-blocking.

4. **P2 old `:has()` transition half will match the /services hero section** (which is theme--white + kicker--centered in the header). The hero now has `dy-section--cta-pair` but not `dy-section--centered-white`. The P2 `:has()` transition selector at line 112 will match the hero's `dy-section__header` (it has kicker--centered in the header). In practice this applies `max-width: 820px; margin-inline: auto; text-align: center` to the hero header — which is the same behavior as before the refactor. The hero uses P4 for its content slot (CTA pair), not P2. No functional regression. Non-blocking.

---

T complete, no blocking issues. Ready for S.
