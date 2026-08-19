# Handoff-S: Sprint 11 Cycle 2c — P2 transition-selector cleanup

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2c-p2-cleanup`
**Issue:** `docs/pl2/handoffs/cycle-2c-p2-cleanup-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2c-p2-cleanup-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2c-p2-cleanup-F.md`
**Operator-facing report:** [`cycle-2c-p2-cleanup-report.html`](cycle-2c-p2-cleanup-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. All Tier 1 and Tier 2 checks PASS in T's handoff, including marker counts on all 6 affected pages, P2 `:has()` removal verified (0 functional lines remain; only a single comment-block history note), idempotency verified (re-run yields all SKIP), and `component_version` preserved on all 6 sections (`e6079b189d228dad`).

## Verification approach (Sprint 10 stash-baseline method)

This is a refactor cycle; AC binds pixel-identity vs the pre-refactor state on the 6 affected pages. The cycle branch already contains F's CSS edits and F's marker patch, so the pre-refactor state was reconstructed locally:

1. `git stash` saved F's `dy-section.css` edits (CSS reverted to old P2 `:has()` half intact).
2. One-shot drush helper `scripts/sprint11-cycle2c-p2-cleanup-remove.php` (mirror of F's patch script) stripped `dy-section--centered-white` from the 6 patched sections so the DB matches the pre-refactor state.
3. `ddev drush cr` cleared cache.
4. Playwright (chromium 1.59.1, fullPage, scroll-primed) captured baseline PNGs for all 6 pages at 1280×800, 768×1024, 375×667.
5. `git stash pop` restored F's CSS; `ddev drush php:script scripts/sprint11-cycle2c-p2-cleanup.php` re-applied the markers; `ddev drush cr`.
6. Live PNGs captured under identical conditions.
7. `compare -metric AE -fuzz 1%` on each baseline/live pair; `convert +append` for side-by-side composites.

Temp helper script removed after capture. Working tree now contains F's CSS, F's marker script, S's handoff + report + screenshots, and the prior handoff docs. No stray edits.

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

All 18 page × viewport pairs produced zero differing pixels (AE=0, fuzz 1%). Every diff PNG is blank.

### Per-section delta description

No rendered delta on any page at any viewport. The refactor is byte-identical at the pixel level.

### Why the result is pixel-identical (mechanism)

- Before this cycle, header centering on the 6 P2 sections came from the `:has(.dy-section__header .kicker--centered)` half of the rules at the old lines 133/141/152 (and the mobile rule at 214).
- After this cycle, each of those sections carries the `dy-section--centered-white` marker class, and the rules retain the doubled-class marker half `.dy-section.dy-section--centered-white …` with the same declarations.
- The DOM elements targeted are identical; the property values declared are identical; the `:not(:has(.grid-wrapper))` guard on the content-centering rule preserves card-grid behaviour for `/services` "Four ways we engage" and `/` "What we ship".
- Specificity moved from 0,1,0 + 0,1,0 (the OR pair) to 0,2,0 on the marker half. No intermediate-specificity rule targets the same properties on these sections, so computed style is unchanged.
- /open-source-projects has no P2 marker changes this cycle — AE=0 confirms zero regression there.

## Design brief compliance

Refactor cycle — no visual change intended; no design-brief tokens modified. F's git diff on `dy-section.css` is selector cleanup (drop the OR'd `:has()` half) + a comment-block update. Every declaration value is unchanged. Pixel-identity (AE=0) is the operative verification: colours, typography, spacing, borders, shadows, decorative treatments are byte-identical to the pre-refactor state.

| Token / property | Pre-refactor | Post-refactor | Match |
|---|---|---|---|
| Header `max-width` | `calc(720 / 16 * 1rem)` | `calc(720 / 16 * 1rem)` | YES |
| Header `margin-inline` | `auto` | `auto` | YES |
| Header `text-align` | `center` | `center` | YES |
| Header.grid `display` | `flex; flex-direction: column; align-items: center` | unchanged | YES |
| Content `text-align` / `align-items` (non-grid sections) | `center` / `center` | unchanged | YES |
| Mobile `max-width` (≤576px) | `100%` | `100%` | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | No DOM order changes; tab order unchanged (class-list + selector edits only) |
| Focus ring visibility | PASS | No focus styles touched |
| Forced-colors mode | PASS | No color rules added or changed |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | Layout unchanged (AE=0 at every viewport implies same wrapping/clipping) |
| Heading hierarchy | PASS | Single H1 on every page (T verified) |
| Image alt text | PASS | No `<img>` elements added or changed |
| Mobile touch targets (375) | PASS | No interactive elements touched |
| Mobile typography scale | PASS | No typography rules changed; AE=0 at 375 confirms |
| Mobile layout | PASS | Pixel-identical at 375 on all 6 pages; grid collapse / CTA stacking / no horizontal scroll all preserved |
| ARIA landmarks (header/main/nav/footer) | PASS | T verified all four present |
| Color contrast | PASS | No color changes; espresso/white 17.27:1, body/white 7.43:1 (T-verified) |
| No `!important` in declarations | PASS | 2 string matches both inside block comments |

## Static preview comparison

No static preview exists in `docs/pl2/Previews/` for the 6 affected pages at the section level relevant to this cycle. The shipped pre-cycle state is the canonical reference; AE=0 confirms identity with it.

## Cross-page regression check

AC: pixel-identical at 1280/768/375 on the 6 touched pages. All 18 pairs AE=0. /open-source-projects (not modified this cycle) is included as a regression page and shows AE=0 as expected.

## Acceptance criteria status

| Criterion | Result | Evidence |
|---|---|---|
| `.dy-section--centered-white` marker on all 4 target sections (idempotent script, `component_version` preserved) | PASS | F applied to 6 sections (4 spec + 2 audit-discovered consumers); T confirmed all 6 carry `cv=e6079b189d228dad` and the script re-runs to all-SKIP |
| P2 `:has(.dy-section__header .kicker--centered)` half dropped from `dy-section.css` everywhere (grep returns 0 functional lines) | PASS | 1 grep hit, line 85, inside a `/* */` comment-block history note; 0 functional lines |
| All affected pages (/services, /how-we-do-it, /about-us, /open-source-projects, /, /contact-us) AE=0 at 1280/768/375 | PASS | AE=0 on every page × viewport (this audit, 18 pairs) |
| No `!important` | PASS | T-verified: 2 grep hits both in comments |
| Specificity-safe doubled-class form | PASS | 4 occurrences of `.dy-section.dy-section--centered-white` (0,2,0) at lines 138, 145, 154, 214 |
| `component_version` preserved | PASS | All 6 sections `e6079b189d228dad` |

**All 6 acceptance criteria met.** This closes ADV-3 architectural close for P2 (theme--white). P1 (theme--light) `:has()` consumers remain at lines 105/113/121/213/551 and are explicit out-of-scope per the issue.

## Verdict

**PASS** — all binding AC met; the refactor is pixel-identical to the pre-refactor shipped state at every tested viewport on every affected page; WCAG status unchanged; F's scope expansion (4→6 sections) and the retained `:not(:has(.grid-wrapper))` structural guard are sound and confirmed by AE=0 on the two grid-wrapper consumers (/services "Four ways we engage" and / "What we ship").

Ready for O to commit. Per the runbook, the commit message is:

`refactor(architecture): cycle 2c — P2 transition cleanup (4 remaining consumers + :has drop)`

O should commit:

- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (F's modification)
- `scripts/sprint11-cycle2c-p2-cleanup.php` (F's new marker script)
- `docs/pl2/handoffs/cycle-2c-p2-cleanup-issue.md`, `-F.md`, `-T.md`, `-S.md`, `-report.html`
- `docs/pl2/handoffs/screenshots/sprint-11-cycle-2c/` (72 PNGs: 18 baseline + 18 live + 18 diff + 18 composite)

## Advisory notes (non-blocking)

1. P1 (theme--light) `:has(.kicker--centered)` selectors remain at lines 105/113/121/213/551. Out of scope for this cycle; queue a follow-up cycle to mark P1 consumers on /services nearshore and /open-source-projects, then drop the P1 `:has()` half to complete the full architectural close on ADV-3 across both theme variants.
2. F's reported `#5C544C`/`#FFFFFF` contrast (7.22:1) differs from T's WCAG-formula value (7.43:1). Both clear 4.5:1 with margin. Calibration note for F's contrast tool; no behavioral impact.
3. The `:not(:has(.grid-wrapper))` guard on the content-centering rule is a structural guard distinct from the P2 transition pattern. It will persist until a separate marker is introduced for "sections that should center content vs only header". Out of scope for this cycle.

## Files produced by S

- `docs/pl2/handoffs/cycle-2c-p2-cleanup-S.md` (this file)
- `docs/pl2/handoffs/cycle-2c-p2-cleanup-report.html`
- `docs/pl2/handoffs/screenshots/sprint-11-cycle-2c/` — 72 PNGs (18 baseline + 18 live + 18 diff + 18 composite)
