# Handoff-S: Cycle 2b.1 — /about-us selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b1-about-us`
**Issue:** `docs/pl2/handoffs/cycle-2b1-about-us-refactor-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2b1-about-us-refactor-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b1-about-us-refactor-F.md`
**Operator-facing report:** [`cycle-2b1-about-us-refactor-report.html`](cycle-2b1-about-us-refactor-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. Only non-blocking advisory notes (P8 rule-count documentation discrepancy, F vs T contrast-ratio computation differences, P9 direct-swap rationale, P1 dual-section marker decision). All advisories were resolved in F's favor or are stylistic.

## Verification approach

Since the cycle branch already contains F's edits, the pre-refactor state was reconstructed locally for true visual diff:

1. `git stash` saved F's `dy-section.css` edits.
2. A one-shot drush script removed the 4 marker classes from canvas_page id=17 `additional_classes`.
3. `ddev drush cr` cleared cache.
4. Playwright (chromium, fullPage, scroll-priming) captured baseline PNGs for /about-us, /services, /how-we-do-it, /open-source-projects at 1280×800, 768×1024, 375×667.
5. `git stash pop` restored F's CSS; the marker script restored markers; cache cleared.
6. Live PNGs captured under identical conditions.
7. ImageMagick `compare -metric AE -fuzz 1%` ran against each baseline/live pair.

All temp scripts and helper files were removed; the working tree contains only F's intended changes plus this cycle's documentation + screenshots.

## Tier 3 visual audit

### Visual diff results

| Page | Viewport | Baseline | Live | Dimensions | AE (pixels diff) | Whole-page delta | Result |
|---|---|---|---|---|---|---|---|
| /about-us | 1280×800 | t3-about-us-1280-baseline-20260512.png | t3-about-us-1280-live-20260512.png | 1280×4549 | 0 | 0.000% | MATCH |
| /about-us | 768×1024 | t3-about-us-768-baseline-20260512.png | t3-about-us-768-live-20260512.png | 768×5690 | 0 | 0.000% | MATCH |
| /about-us | 375×667 | t3-about-us-375-baseline-20260512.png | t3-about-us-375-live-20260512.png | 375×7952 | 0 | 0.000% | MATCH |
| /services | 1280×800 | (baseline) | (live) | 1280×4418 | 0 | 0.000% | MATCH |
| /services | 768×1024 | (baseline) | (live) | 768×5249 | 0 | 0.000% | MATCH |
| /services | 375×667 | (baseline) | (live) | 375×6555 | 0 | 0.000% | MATCH |
| /how-we-do-it | 1280×800 | (baseline) | (live) | 1280×5378 | 0 | 0.000% | MATCH |
| /how-we-do-it | 768×1024 | (baseline) | (live) | 768×6471 | 0 | 0.000% | MATCH |
| /how-we-do-it | 375×667 | (baseline) | (live) | 375×8174 | 0 | 0.000% | MATCH |
| /open-source-projects | 1280×800 | (baseline) | (live) | 1280×4490 | 0 | 0.000% | MATCH |
| /open-source-projects | 768×1024 | (baseline) | (live) | 768×7041 | 0 | 0.000% | MATCH |
| /open-source-projects | 375×667 | (baseline) | (live) | 375×9293 | 0 | 0.000% | MATCH |

All 12 page × viewport pairs produced **zero differing pixels** (AE=0). No diff PNG was needed since there is no delta to visualize; composites are provided in the HTML report for parallel-comparison reassurance.

### Per-section delta description

No section shows any rendered delta. The refactor is byte-identical at the pixel level across all four pages and all three breakpoints.

### Why the result is pixel-identical (mechanism)

- **P1 / P7 (centered-light):** F added a comma-separated marker selector to each existing rule. The old `.dy-section.theme--light:has(.kicker--centered)` selector still matches the same DOM (no DOM was removed); the new `.dy-section--centered-light` selector adds a parallel match for the now-marked /about-us sections. Declarations are byte-identical. Output: identical by construction.
- **P8 (cta-pair):** Same comma-selector transition pattern. Old `:has(> .button + .button)` still applies; new `.dy-section.theme--dark.dy-section--cta-pair` adds a parallel match. Identical declarations.
- **P9 (bio-block):** Direct swap, no transition selector. F verified (and audit confirms via grep on /, /services, /how-we-do-it, /open-source-projects) that the DOM pattern `theme--white + grid-wrapper + heading.h3` is unique to /about-us §C. The new `.dy-section--bio-block` marker selector matches exactly the same single DOM target as the old `:has(.kicker--centered)` rule. Identical output.
- **P10 (wordmark):** Untouched in this cycle (correctly out-of-scope; wordmark is on /services).

## Design brief compliance

Refactor cycle — no visual change intended. No design-brief tokens were modified. All colors, typography, spacing, borders, shadows, and decorative treatments are byte-identical to the pre-refactor state (verified via `git diff` on the CSS: every declaration value is unchanged; only selectors were edited).

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | No DOM order changes; tab order unchanged |
| Focus ring visibility | PASS | No focus styles touched |
| Forced-colors mode | PASS | No color rules added/changed |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | Layout unchanged |
| Heading hierarchy | PASS | Single H1; H1→H2→H2→H3×3→H3→H2→H2 sequence verified (T) |
| Image alt text | PASS | No img elements added or changed |
| Mobile touch targets (375) | PASS | `min-height: 44px` preserved on `.dy-section--cta-pair` buttons at both desktop and mobile blocks |
| Mobile typography scale | PASS | No typography changes in this cycle |
| Mobile layout | PASS | Pixel-identical at 375 — grid collapse, CTA stacking, no horizontal scroll all preserved |
| ARIA landmarks (header/main/nav/footer) | PASS | T verified |
| Color contrast (5 pairs) | PASS | All pairs ≥ threshold (T independently re-computed) |
| No `!important` in declarations | PASS | 2 string matches both inside block comments |

## Static preview comparison

No static preview exists for /about-us in `docs/pl2/Previews/`. The shipped state on the pre-cycle branch is the canonical reference, and the pixel-diff above confirms identity with it.

## Cross-page regression check

The issue and brief require zero regression on /services, /how-we-do-it, /open-source-projects (which share the P1/P8 selectors via the retained `:has()` half of the comma selectors). Pixel diffs confirm AE=0 at all three viewports for all three pages — zero regression.

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| Canvas content edited: 4 sections have markers | T verified DB read for indices 6, 11, 21, 26 | PASS |
| `dy-section.css` rewritten to use marker selectors | Git diff: P1, P7, P8 use comma transitions; P9 direct swap; declarations byte-identical | PASS |
| **/about-us renders pixel-identical at 1280/768/375** | AE=0 at all three viewports (this audit) | PASS |
| No regression on /services | AE=0 at all three viewports | PASS |
| No regression on /how-we-do-it | AE=0 at all three viewports | PASS |
| No regression on /open-source-projects | AE=0 at all three viewports | PASS |
| No `!important` | T verified | PASS |
| Canvas `component_version` preserved | T verified all 4 sections retain `e6079b189d228dad` | PASS |
| T1 + T2 PASS | T handoff confirms | PASS |
| F handoff captures marker mapping + CSS diffs + verification | F handoff present and complete | PASS |

## Verdict

**PASS** — all acceptance criteria met; visual output is pixel-identical to the pre-refactor shipped state at every tested viewport on every affected and adjacent page; WCAG status unchanged. Ready for O to commit.

The CSS change is uncommitted at S's exit; O should commit the F-modified `dy-section.css`, the new marker script, and the cycle handoff docs per the runbook commit message: `refactor(architecture): cycle 2b.1 — /about-us selector-class markers (ADV-3)`.

## Advisory notes (non-blocking, forwarded from T)

1. F's documentation says P8 has "6 rules" but the served CSS shows 5 selector pairs (3 desktop, 2 mobile). The behavior is correct; the count is a documentation nit. Optionally tighten in 2b.2 wrap.
2. F's and T's contrast-ratio numbers differ (e.g. 5.53 vs 6.48 on track-record body text). Both above threshold; root cause is likely different luminance linearization. Non-blocking.
3. P9 has no transition selector (direct swap). F's rationale is sound — the bio-block DOM pattern is unique to /about-us and confirmed across the four pages tested here.
4. P1 marker applied to two sections (Track record + Dogfood). Issue listed one; F's autonomous decision to apply to both is correct because both are theme--light + kicker--centered.

## Files produced by S

- `docs/pl2/handoffs/cycle-2b1-about-us-refactor-S.md` (this file)
- `docs/pl2/handoffs/cycle-2b1-about-us-refactor-report.html`
- `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b1/` — 36 PNGs (12 baseline + 12 live + 12 composite)
