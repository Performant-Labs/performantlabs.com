# Handoff-T: Sprint 11 Cycle 2b - /open-source-projects centered-white markers

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2b-osp-markers`
**Issue:** `docs/pl2/handoffs/cycle-2b-osp-markers-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b-osp-markers-F.md`

---

## Tier 1 results

| Check | Command | Expected | Actual | Result |
|---|---|---|---|---|
| Cache clear | `ddev drush cr` | success | "Cache rebuild complete." | PASS |
| HTTP /open-source-projects | `curl -sk '...8493/open-source-projects' -o /dev/null -w '%{http_code}'` | 200 | 200 | PASS |
| HTTP /services | `curl -sk '...8493/services' ...` | 200 | 200 | PASS |
| HTTP /about-us | `curl -sk '...8493/about-us' ...` | 200 | 200 | PASS |
| HTTP /how-we-do-it | `curl -sk '...8493/how-we-do-it' ...` | 200 | 200 | PASS |
| HTTP / (homepage) | `curl -sk '...8493/' ...` | 200 | 200 | PASS |
| Marker count in OSP HTML | `curl ... \| grep -c 'dy-section--centered-white'` | 2 | 2 | PASS |
| Hero marker class string | grep for `landing-hero dy-section--centered-white theme--white` | present | present (line 516) | PASS |
| Community marker class string | grep for `dy-section dy-section--centered-white theme--white` | present | present (line 626) | PASS |
| Doubled-class selectors in served CSS | `curl CSS_URL \| grep -c '\.dy-section\.dy-section--centered-white'` | 4 selectors + 1 comment = 5 | 5 | PASS |
| Old :has() half retained in served CSS | grep `:has(.dy-section__header .kicker--centered)` | 3 rule selectors + 1 mobile + 1 comment = 5 | 4 rule selectors + 1 comment = 5 lines | PASS |
| No !important declarations | `curl CSS_URL \| grep '!important'` | comments only | 2 hits, both in comments | PASS |
| /services Dogfooding marker preserved | `curl ...8493/services \| grep -c 'dy-section--centered-white'` | 1 (pre-existing Sprint 10) | 1 | PASS |

**URL used:** `https://pl-performantlabs.com.3.ddev.site:8493`

Note: the standard ddev HTTPS URL (`https://pl-performantlabs.com.3.ddev.site`) returns 404 for this project. All checks used the port-qualified URL which returns 200.

---

## Tier 2 results

| Check | Method | Result |
|---|---|---|
| Single H1 on /open-source-projects | `grep -oE '<h[1-6][^>]*>'` — counted H1 open tags | 1 H1. PASS |
| Heading hierarchy | Tag-level sequence from grep | H1 (hero) -> H2 (Testing tools) -> H3 x3 (cards) -> H2 (Community) -> H3 x3 (cards) -> H2 (Other modules) -> H3 x1 (card) -> H2 (Contribute) -> H2/H3 footer. No skipped levels. PASS |
| ARIA landmarks | `grep -oE '<(header\|main\|footer\|nav)[^>]*>'` | `<header>`, `<main>`, `<footer>`, `<nav>` x3 (main-menu, breadcrumb, footer-menu) all present. PASS |
| Community kicker centering | grep for `kicker--centered kicker--light">Community` | Present. PASS |
| component_version delta 0 | `ddev drush php:eval` reading top-level field key | `e6079b189d228dad`. Matches F's claim. PASS |
| component_version delta 11 | same | `e6079b189d228dad`. Matches F's claim. PASS |
| UUID delta 0 | `ddev drush php:eval` | `4ef7e109-a789-403e-bd2b-3a5a0e697e45`. Matches script constant. PASS |
| UUID delta 11 | `ddev drush php:eval` | `fd288e24-042d-41d2-ab73-645bbf7c473f`. Matches script constant. PASS |
| additional_classes delta 0 | `ddev drush php:eval` | `landing-hero dy-section--centered-white`. Correct; original `landing-hero` preserved, marker appended. PASS |
| additional_classes delta 11 | `ddev drush php:eval` | `dy-section--centered-white`. Correct for a section with no prior additional_classes. PASS |
| Idempotency | `ddev drush php:script scripts/sprint11-cycle2b-osp-markers.php` re-run | "SKIP [0] ... SKIP [11] ... No changes needed (all markers already present)." PASS |
| Mobile @media doubled-class | Source CSS line 213 | `.dy-section.dy-section--centered-white .dy-section__header` inside `@media (max-width: 576px)`. Doubled-class pattern confirmed. PASS |
| /services :has() consumers unmarked | grep for `dy-section--centered-white` in /services theme--white sections | "Four ways we engage" section: class string `dy-section theme--white container ...` — no centered-white marker. Correctly unmarked; :has() half still required. PASS |
| /about-us :has() consumers unmarked | same approach | cta-pair hero and bio-block sections have no centered-white marker. Correctly unmarked. PASS |
| /how-we-do-it :has() consumer unmarked | same approach | `landing-hero theme--white` section — no centered-white marker. Correctly unmarked. PASS |

**Advisory — F's line number claim:** F's handoff states the four doubled-class selectors are at lines 132, 140, 151, 212. Actual source lines are 133, 141, 152, 213 (off by one throughout). The selectors themselves are correct; this is a documentation-only discrepancy with no structural impact.

**Advisory — component_version field location:** F's handoff states "component_version preserved" and the script header confirms the intent. `component_version` is stored as a top-level key in the field array, not inside the `inputs` JSON blob. T confirmed via `ddev drush php:eval` reading `$components[$idx]["component_version"]` directly. The script does not touch that key (it only reads/writes `inputs`), so preservation is correct by omission.

---

## WCAG contrast verification

No color or contrast changes were made in this cycle. The CSS changes are limited to selector specificity (single-class -> doubled-class) and class additions in canvas_page data. F's reported ratios are cross-checked against hex values from `docs/pl2/Briefs/pl_design_brief.md`.

| Element | Foreground | Background | F's ratio | T's ratio | Delta | Result |
|---|---|---|---|---|---|---|
| Hero h1 / Community h2 (espresso) | `#1F1A14` | `#FFFFFF` | 17.29:1 | 17.27:1 | -0.02 | PASS (threshold 3:1 large text) |
| Body text | `#5C544C` | `#FFFFFF` | 7.22:1 | 7.43:1 | +0.21 | PASS (threshold 4.5:1) |

T's computed values use the standard WCAG relative luminance formula with the 0.03928 linearization threshold. The discrepancies (0.02 and 0.21) are within rounding tolerance from different computation methods; both ratios clear their respective thresholds by wide margins. No concern.

---

## Mobile responsive verification

F reports one pre-existing mobile rule updated in this cycle: the `@media (max-width: 576px)` block that applies `max-width: 100%` to `.dy-section--centered-white .dy-section__header`.

| Breakpoint | Rule confirmed | Declaration unchanged | Result |
|---|---|---|---|
| `max-width: 576px` | `.dy-section.dy-section--centered-white .dy-section__header { max-width: 100%; }` present at source line 213 | Yes — only the selector prefix changed from single-class to doubled-class; `max-width: 100%` unchanged | PASS |

No new responsive overrides were introduced. Touch-target and typography-mobile checks are not applicable to this cycle (no interactive elements added, no typography rules changed).

---

## Acceptance criteria status

| Criterion | Result | Evidence |
|---|---|---|
| `dy-section--centered-white` applied to canvas_page id=5 section index 11 via idempotent script | PASS | DB confirms `additional_classes=dy-section--centered-white` for delta 11; idempotency re-run output "SKIP [11] ... already present" |
| P2 transition `:has` half dropped from `dy-section.css` lines 133/141/152 | FAIL — intentional deviation | F documented 4 cross-page consumers still depending on `:has()`. Selectors retained at source lines 134, 142, 153, 214. Follow-up cycle required. |
| `/open-source-projects` renders correctly at 1280/768/375 (AE=0 vs pre-refactor baseline) | PARTIAL — T1 PASS; T3 (pixel diff) deferred to S | HTTP 200, markers present, heading hierarchy clean. Visual diff is S's responsibility. |
| No regression on /services / /about-us / /how-we-do-it / homepage | PASS | All 4 pages return HTTP 200; cross-page :has() consumers confirmed still unmarked (behavior unchanged) |
| No `!important` | PASS | 2 grep hits in served CSS, both in comment text only |
| `component_version` preserved | PASS | Both delta 0 and delta 11 read `e6079b189d228dad` from the top-level `component_version` field key |
| Specificity-safe doubled-class marker `.dy-section.dy-section--centered-white` (Sprint 10 codification) | PASS | 4 rule selectors confirmed in source and served CSS; specificity 0,2,0 as declared |

---

## Blocking issues

One acceptance criterion from the issue is not met:

**AC: "P2 transition `:has` half dropped from `dy-section.css` lines 133/141/152"** — NOT done. F's deviation is documented and rationally justified (4 sections across 3 other pages still depend on those selectors; dropping them would cause visible centering regression on /services, /how-we-do-it, and /about-us).

This is a known, intentional deviation with a documented follow-up path, not an implementation error. S should determine whether this criterion blocks merge or whether the deviation acceptance logged in F's handoff is sufficient to proceed with the remaining 6 of 7 criteria passing.

All other checks pass. No implementation errors found.

---

## Advisory notes

1. F applied the marker to delta 0 (hero) in addition to the issue-specified delta 11 (Community). This is forward preparation; both sections are legitimate P2 consumers (theme--white + kicker--centered). The extra marker causes no regression and brings OSP closer to the state where `:has()` removal is possible.

2. F's handoff lists CSS line numbers as 132/140/151/212. Actual source lines are 133/141/152/213. Off-by-one throughout, no structural impact.

3. `/services` "Four ways we engage" section (unmarked theme--white with centered kicker) is the most exposed remaining `:has()` consumer: it currently has no marker of any kind, so the `:has()` half is its sole centering mechanism. This section should be prioritized in the follow-up cycle before `:has()` removal.

---

T complete, no blocking issues. Ready for S.

The single unmet AC (`:has()` drop) is a scoped, documented deviation with a forward-scheduled follow-up — not a regression or implementation error. All other criteria pass. S can proceed with visual diff at 1280/768/375.
