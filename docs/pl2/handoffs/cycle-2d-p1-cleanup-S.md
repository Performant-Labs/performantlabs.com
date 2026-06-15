# Handoff-S: Sprint 11 Cycle 2d — P1 transition-selector cleanup (theme--light)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2d-p1-cleanup`
**Issue:** `docs/pl2/handoffs/cycle-2d-p1-cleanup-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2d-p1-cleanup-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2d-p1-cleanup-F.md`
**Operator-facing report:** [`cycle-2d-p1-cleanup-report.html`](cycle-2d-p1-cleanup-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. Tier 1 and Tier 2 all PASS. 6/6 sections carry `dy-section--centered-light`; rendered HTML marker counts match expectations on all 6 pages; `grep ':has(.kicker--centered)' dy-section.css` returns 0 functional lines; `component_version=e6079b189d228dad` preserved on every patched section; idempotency confirmed (re-run = all SKIP); heading hierarchy + ARIA landmarks intact on all 6 pages; 5 doubled-class P1 selectors at lines 115, 122, 129, 220, 557 (specificity 0,2,0).

## Verification approach (Sprint 10/11 stash-baseline method)

This is a refactor cycle; AC binds pixel-identity vs the pre-refactor state on the affected pages. The cycle branch contains F's CSS edits + F's marker patch, so the pre-refactor state was reconstructed locally:

1. `git stash push web/themes/custom/performant_labs_20260502/css/components/dy-section.css` saved F's CSS edits (CSS reverted to old P1 `:has()` selectors intact).
2. Temp helper `scripts/sprint11-cycle2d-p1-cleanup-remove.php` (mirror of F's patch script, marker-stripping inverse) removed `dy-section--centered-light` from the 4 newly patched sections (canvas_page 3/15, 5/4, 13/12, 20/25). `/about-us` [6] and [21] were intentionally NOT touched — they were marked pre-cycle (cycle 2b.1) and form part of the pre-refactor baseline state.
3. `ddev drush cr`.
4. Playwright (chromium, fullPage, scroll-primed, deviceScaleFactor=1, ignoreHTTPSErrors) captured baseline PNGs for all 6 pages at 1280×800, 768×1024, 375×667.
5. `git stash pop` restored F's CSS. `ddev drush php:script scripts/sprint11-cycle2d-p1-cleanup.php` re-applied the 4 markers. `ddev drush cr`.
6. Live PNGs captured under identical conditions.
7. `compare -metric AE -fuzz 1%` on each baseline/live pair. `convert +append` for side-by-side composites.

Temp helper script removed after capture. Capture script `scripts/capture-cycle-2d.js` left in place as audit artifact (matches the convention of prior cycles `capture-cycle-2b*`, `capture-cycle-2c.js`).

## Tier 3 visual audit

### AE pixel-count matrix (18 pairs)

| Page | Viewport | Image dimensions | AE (pixels diff) | Whole-page delta | Result |
|---|---|---|---|---|---|
| /                     | 1280×800 | 1280×4754 | 0 | 0.000% | MATCH |
| /                     | 768×1024 | 768×5658  | 0 | 0.000% | MATCH |
| /                     | 375×667  | 375×7065  | 0 | 0.000% | MATCH |
| /services             | 1280×800 | 1280×3854 | 0 | 0.000% | MATCH |
| /services             | 768×1024 | 768×4266  | 0 | 0.000% | MATCH |
| /services             | 375×667  | 375×5059  | 0 | 0.000% | MATCH |
| /how-we-do-it         | 1280×800 | 1280×5378 | 0 | 0.000% | MATCH |
| /how-we-do-it         | 768×1024 | 768×6471  | 0 | 0.000% | MATCH |
| /how-we-do-it         | 375×667  | 375×8174  | 0 | 0.000% | MATCH |
| /about-us             | 1280×800 | 1280×4549 | 0 | 0.000% | MATCH |
| /about-us             | 768×1024 | 768×5690  | 0 | 0.000% | MATCH |
| /about-us             | 375×667  | 375×7952  | 0 | 0.000% | MATCH |
| /contact-us           | 1280×800 | 1280×3452 | 0 | 0.000% | MATCH |
| /contact-us           | 768×1024 | 768×4814  | 0 | 0.000% | MATCH |
| /contact-us           | 375×667  | 375×6096  | 0 | 0.000% | MATCH |
| /open-source-projects | 1280×800 | 1280×4490 | 0 | 0.000% | MATCH |
| /open-source-projects | 768×1024 | 768×7041  | 0 | 0.000% | MATCH |
| /open-source-projects | 375×667  | 375×9293  | 0 | 0.000% | MATCH |

All 18 page × viewport pairs produced zero differing pixels (AE=0, fuzz 1%). Every diff PNG is blank. Full-page scroll heights are identical between baseline and live for every pair, ruling out reflow.

### Per-section delta description

No rendered delta on any page at any viewport. The P1 cleanup is byte-identical at the pixel level.

### Why the result is pixel-identical (mechanism)

- Before this cycle, header centering on the 6 P1 sections came from the `.dy-section.theme--light:has(.kicker--centered) …` half of the rules at the old lines 105/113/121 (plus the mobile rule at 213 and the ul list centering rule at 551).
- After this cycle, each section carries `dy-section--centered-light` on its wrapper, and each rule retains the doubled-class marker half `.dy-section.dy-section--centered-light …` with identical declarations.
- DOM elements targeted are identical; property values declared are identical; specificity moved from 0,2,0 (`.theme--light:has(…)`, two compound classes → 0,2,0 anyway) to 0,2,0 (`.dy-section.dy-section--centered-light`). No intermediate rule targets the same properties on these sections, so computed style is unchanged.
- F deliberately did NOT add a `:not(:has(.grid-wrapper))` guard on the P1 content-centering rule (the P1 pattern never had one); /open-source-projects "Testing tools" and /contact-us "After you send" both contain `grid-wrapper` card content, and pixel-identity confirms F's call was correct — the grid-wrapper's own layout dominates regardless.
- /how-we-do-it (no P1 consumers; regression page only) AE=0 confirms zero regression. /about-us (2 pre-cycle markers, both untouched in the data layer) AE=0 confirms the selector-only CSS change is also a no-op on already-marked sections.

## Design brief compliance

Refactor cycle — no visual change intended; no design-brief tokens modified. F's git diff on `dy-section.css` is selector cleanup (drop the `:has(.kicker--centered)` half from 5 rule locations) + comment-block updates. Every declaration value is unchanged. Pixel-identity (AE=0) is the operative verification: colors, typography, spacing, borders, shadows, decorative treatments are byte-identical to the pre-refactor state.

| Token / property | Pre-refactor | Post-refactor | Match |
|---|---|---|---|
| Header `max-width` | `calc(720 / 16 * 1rem)` | unchanged | YES |
| Header `margin-inline` | `auto` | unchanged | YES |
| Header `text-align` | `center` | unchanged | YES |
| Header.grid `display` / `align-items` | `flex; flex-direction: column; align-items: center` | unchanged | YES |
| Content `text-align` / `align-items` | `center` / `center` | unchanged | YES |
| Mobile `max-width` (≤576px) | `100%` | unchanged | YES |
| ul list centering | `text-align: center` / `align-items` | unchanged | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | No DOM order changes; tab order unchanged (class-list + selector edits only) |
| Focus ring visibility | PASS | No focus styles touched |
| Forced-colors mode | PASS | No color rules added or changed |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | Layout unchanged (AE=0 at every viewport implies same wrapping/clipping) |
| Heading hierarchy | PASS | Single H1 on all 6 pages, H1→H2→H3 with no skips (T-verified) |
| Image alt text | PASS | No `<img>` elements added or changed |
| Mobile touch targets (375) | PASS | No interactive elements touched |
| Mobile typography scale | PASS | No typography rules changed; AE=0 at 375 confirms |
| Mobile layout | PASS | Pixel-identical at 375 on all 6 pages; grid collapse / CTA stacking / no horizontal scroll all preserved |
| ARIA landmarks (header/main/nav/footer) | PASS | T-verified all four present on every page |
| Color contrast | PASS | No color changes; T-verified ratios (H2/cream 13.24:1, body/cream 6.48:1) clear the 3:1 / 4.5:1 thresholds with margin |
| No `!important` in declarations | PASS | 2 grep hits, both inside block comments |

## Static preview comparison

No static preview exists in `docs/pl2/Previews/` for the section-level treatment that cycle 2d touches. The shipped pre-cycle state is the canonical reference; AE=0 confirms identity with it on all 6 pages.

## Cross-page regression check

AC: AE=0 at 1280/768/375 on each affected page. Scope per spawn prompt: 4 newly marked pages + 2 verify-no-regression pages.

- **Newly marked (4):** /services, /open-source-projects, /contact-us, / — all AE=0 across 3 viewports = 12/12.
- **Verify-no-regression (2):** /about-us (2 pre-cycle markers; selector change only), /how-we-do-it (no P1 consumers; pure no-op) — all AE=0 across 3 viewports = 6/6.

Total: 18/18 pairs at AE=0.

## Acceptance criteria status

| Criterion | Result | Evidence |
|---|---|---|
| All P1 consumers marked | PASS | F patched 4, T verified 6/6 carry the marker; `component_version=e6079b189d228dad` on every section |
| `grep ':has(.kicker--centered)' dy-section.css` → 0 functional lines | PASS | T grep: 0 functional, 5 in block-comment historical context |
| AE=0 on each affected page at 1280/768/375 | PASS | 18/18 pairs AE=0 (this audit) |
| No regression elsewhere | PASS | /how-we-do-it (regression page) AE=0; /about-us (already-marked) AE=0 |
| No `!important` | PASS | T-verified: 2 grep hits both in comments |
| `component_version` preserved | PASS | All 6 sections `e6079b189d228dad` (T) |
| Doubled-class specificity (0,2,0) | PASS | 5 occurrences at lines 115, 122, 129, 220, 557 (T) |

**All 7 acceptance criteria met.** This closes the architectural cleanup for P1 (theme--light). Combined with cycle 2c (P2 / theme--white), the `:has(.kicker--centered)` and `:has(.dy-section__header .kicker--centered)` transition selectors are fully removed from `dy-section.css`.

## Verdict

**PASS** — all acceptance criteria met, AE=0 on every page × viewport pair, WCAG clean. Ready for O to commit.

## Advisory notes

1. **Pre-existing CSS comment 12.26:1 vs T-computed 13.24:1.** T flagged this in handoff-T (advisory 1) — cosmetic inaccuracy in a doc comment at line 1034. Non-blocking; both values pass thresholds with margin. Suggest correcting in a future doc-only cycle.
2. **Capture/baseline scripts.** `scripts/capture-cycle-2d.js` is left untracked as an audit artifact (matches prior cycles). The temp DB-revert helper `scripts/sprint11-cycle2d-p1-cleanup-remove.php` was deleted after baseline capture.
3. **Architectural close.** With cycles 2c (P2) and 2d (P1) shipped, the `dy-section.css` rule cluster is now driven exclusively by the `dy-section--centered-{light,white}` marker pattern at 0,2,0 specificity. Any future centered-light/white section just needs the marker on `additional_classes` — no CSS edit required.
