# Handoff-S: Cycle 2b.2 — /services selector-class refactor

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-2b2-services`
**Issue:** `docs/pl2/handoffs/cycle-2b2-services-refactor-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2b2-services-refactor-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b2-services-refactor-F.md`
**Operator-facing report:** [`cycle-2b2-services-refactor-report.html`](cycle-2b2-services-refactor-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. T's structural checks (T1 + T2) all PASS. Note: T did not perform a visual diff (correctly deferred to S per pipeline).

## Verification approach (cycle 2b.1 method)

The cycle branch already contains F's edits, so the pre-refactor state was reconstructed locally for true visual diff:

1. `node capture.js live` — Playwright captured fullPage PNGs at 1280×800, 768×1024, 375×667 for /services, /about-us, /how-we-do-it, /open-source-projects, /  (F's CSS + markers applied).
2. `git stash` saved F's `dy-section.css` edits.
3. `scripts/undo-markers-tmp.php` (one-shot, idempotent) removed the 4 marker classes from canvas_page id=3 `additional_classes`.
4. `ddev drush cr` cleared cache.
5. `node capture.js baseline` — captured baseline PNGs under identical conditions.
6. `git stash pop` restored F's CSS; `sprint10-cycle2b2-services-markers.php` re-applied markers; cache cleared; temp undo script deleted.
7. ImageMagick `compare -metric AE` ran against each baseline/live pair. Composites and diff PNGs produced for all 15 pairs.

Working tree restored to F's intended state at S exit. Only this cycle's documentation, screenshots, and `scripts/sprint10-cycle2b2-services-markers.php` remain added relative to HEAD.

## Tier 3 visual audit

### AE matrix

| Page | VP | Baseline dims | Live dims | AE (pixels) | % of baseline | Status |
|---|---|---|---|---|---|---|
| /services | 1280 | 1280×4418 | 1280×4514 | 360,563 | 6.38% | DELTA (cascade) |
| /services | 768 | 768×5249 | 768×5345 | 267,841 | 6.64% | DELTA (cascade) |
| /services | 375 | 375×6555 | 375×6587 | 111,468 | 4.53% | DELTA (cascade) |
| /about-us | 1280 | 1280×4549 | 1280×4617 | 922,763 | 15.85% | **REWORK (P4 regression)** |
| /about-us | 768 | 768×5690 | 768×5758 | 743,928 | 17.02% | **REWORK (P4 regression)** |
| /about-us | 375 | 375×7952 | 375×7976 | 464,221 | 15.57% | **REWORK (P4 cascade)** |
| /how-we-do-it | 1280 | 1280×5378 | 1280×5378 | 0 | 0.00% | MATCH |
| /how-we-do-it | 768 | 768×6471 | 768×6471 | 0 | 0.00% | MATCH |
| /how-we-do-it | 375 | 375×8174 | 375×8174 | 0 | 0.00% | MATCH |
| /open-source-projects | 1280 | 1280×4490 | 1280×4490 | 0 | 0.00% | MATCH |
| /open-source-projects | 768 | 768×7041 | 768×7041 | 0 | 0.00% | MATCH |
| /open-source-projects | 375 | 375×9293 | 375×9293 | 0 | 0.00% | MATCH |
| / | 1280 | 1280×4754 | 1280×4754 | 0 | 0.00% | MATCH |
| / | 768 | 768×5658 | 768×5658 | 0 | 0.00% | MATCH |
| / | 375 | 375×7065 | 375×7065 | 0 | 0.00% | MATCH |

### Per-section delta description

**/about-us hero (1280, 768) — REGRESSION**

The two CTA buttons ("Book a testing review" + "See the site test itself") render side-by-side in baseline (single flex row), and **stacked vertically** in live. The hero grows ~68 px taller in live, propagating a vertical shift down the page.

Mechanism: F removed the old P4 `:has(> .button + .button)` half of the comma-selector ("direct swap") on the premise that "P4 is /services-only." This is wrong. The /about-us hero is a `dy-section theme--white` section whose `.dy-section__content` has two consecutive `<a class="button…">` direct children — the exact DOM pattern the old P4 selector matched. The new P4 selector `.dy-section.theme--white.dy-section--cta-pair .dy-section__content` requires the `dy-section--cta-pair` marker, which is NOT on the /about-us hero (the cycle 2b.1 marker script added the marker to /about-us closing CTA only).

**/about-us at 375 — cascade only**

The buttons stack vertically in both baseline and live (mobile default flow). The remaining 24 px height drift is propagated downstream of other minor reflow; no fresh regression beyond what the 1280/768 P4 fix will resolve.

**/services (all viewports) — cascade drift**

/services hero and closing CTA both render side-by-side in baseline and live (the marker was correctly applied to both /services sections). The diff PNGs show first delta at y≈3265 (1280) — within the wordmark-strip / closing-CTA region. The page is 96 px taller in live than baseline. Likely cause: the P3 → P2 merge changed centering behavior on a section that previously got partial styling, or the wordmark strip behaves slightly differently between the old `:has(.wordmark-strip-wrapper)` selector and the new `.dy-section--wordmark-strip` marker selector for some reason not yet isolated. AE 4.53–6.64% violates the AC's "pixel-identical" requirement.

**Adjacent pages — clean**

/how-we-do-it, /open-source-projects, and / show AE = 0 at all three viewports. No regression on those pages.

### Desktop (1280px) summary

- /services: token-correct, structural-correct, 6.4% pixel cascade (not pixel-identical).
- /about-us: P4 regression — hero CTAs no longer in a flex row.
- /how-we-do-it, /open-source-projects, /: byte-identical to pre-refactor.

### Mobile (375px) summary

- /services: 4.5% pixel cascade.
- /about-us: stack layout preserved (mobile default). 15.6% AE driven by downstream cascade.
- /how-we-do-it, /open-source-projects, /: byte-identical.

## Design brief compliance

Refactor cycle — no visual change intended. All design-brief tokens (colors, typography, spacing, borders, shadows, decorative treatments) are byte-identical to the pre-refactor state (`git diff` on the CSS: every declaration value is unchanged; only selectors were edited). The regression is purely selector-coverage, not token drift.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS | DOM order unchanged across all 5 pages (T verified) |
| Focus ring visibility | PASS | No focus rules touched |
| Forced-colors mode | PASS | No color rules touched |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | The /about-us hero regression is not a zoom failure — it's a loss of stack-release at desktop. Mobile/zoom behavior unchanged. |
| Heading hierarchy | PASS | T verified single H1, no skipped levels on /services |
| Image alt text | PASS | No `<img>` elements added or modified |
| Mobile touch targets (375) | PASS | `min-height: 44px` preserved on all 4 P4/P8 button rules in F's CSS (lines 167, 182, 638, 650). /about-us hero buttons retain `.button--large` min-height even when stacked. |
| Mobile typography scale | PASS | No typography rules touched |
| Mobile layout | PASS | /about-us mobile stacks identically baseline + live |
| ARIA landmarks | PASS | T verified |
| Color contrast (7 pairs) | PASS | T independently re-computed: Dogfooding body 7.43:1, Dogfooding H2 17.27:1, Closing CTA H2 15.07:1, Closing CTA body 7.96:1, Hero H1 17.27:1, Wordmark label 7.43:1, Wordmark items 7.43:1. All ≥ threshold. F's slight numeric drift (13.07 vs 15.07 for Closing CTA H2; 7.39 vs 7.96 for Closing CTA body) is a non-blocking carry-forward error. |
| No `!important` in active rules | PASS | 0 active occurrences; 2 in comments only |
| **Visual parity: /services pixel-identical at 1280/768/375** | **FAIL** | 4.53–6.64% AE across all three viewports |
| **Visual parity: no regression on /about-us** | **FAIL** | 15.5–17.0% AE; hero CTA stack |
| Visual parity: no regression on /how-we-do-it | PASS | AE = 0 |
| Visual parity: no regression on /open-source-projects | PASS | AE = 0 |
| Visual parity: no regression on / | PASS | AE = 0 (extra cross-page check per O) |

## Static preview comparison

No static preview exists in `docs/pl2/Previews/` for /services in this state. The pre-cycle shipped state is the canonical reference; the AE matrix above is the canonical comparison.

## Cross-page regression check

Issue and brief require zero regression on /about-us, /how-we-do-it, /open-source-projects, and / (additional cross-page check per O's prompt).

- /how-we-do-it: AE = 0 at 1280/768/375 — **PASS**
- /open-source-projects: AE = 0 at 1280/768/375 — **PASS**
- / (home): AE = 0 at 1280/768/375 — **PASS**
- /about-us: 15.5–17.0% AE at 1280/768/375 — **FAIL** (P4 regression on hero)

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| All 5 affected /services sections have correct marker(s) in `additional_classes` | T verified DB read; F documented nearshore deviation | PASS |
| P2 + P4 + P10 use new marker selectors; P3 removed | T verified; F's CSS diff matches issue scope (with P2 transition deviation) | PASS |
| P8 old `:has()` half removed | T verified 0 active occurrences | PASS |
| **`/services` renders pixel-identical at 1280/768/375 vs pre-refactor** | **AE 4.53–6.64% at all three viewports — height drift cascade** | **FAIL** |
| **No regression on /about-us (P8 cleanup must not break closing CTA)** | **P8 closing CTA OK; but P4 direct swap broke /about-us HERO — AE 15.5–17.0%** | **FAIL** |
| No regression on /how-we-do-it | AE = 0 | PASS |
| No `!important` | T verified | PASS |
| Canvas `component_version` preserved | T verified all 4 sections retain `e6079b189d228dad` | PASS |
| T1 + T2 PASS | T handoff confirms | PASS |

## Verdict

**REWORK** — two AC fail:

1. **/about-us hero P4 regression (showstopper).** F's claim that "P4 is /services-only" is incorrect. The /about-us hero (canvas_page id=17 index 0) is a `dy-section.theme--white` section with two consecutive direct `.button` children — exactly the DOM pattern the old P4 `:has(> .button + .button)` selector matched. F's direct-swap removal of that `:has()` half left the /about-us hero without the flex-row layout. The two CTAs now stack vertically at desktop, growing the hero by ~68 px and cascading a shift through every section below.

2. **/services 4.5–6.6% pixel drift (AC binding).** The /services hero and closing CTA render correctly, but a 32–96 px vertical drift appears in the wordmark-strip / closing-CTA region (diff begins at y≈3265 at 1280). The page is 96 px taller in live than baseline. Root cause not yet bisected — likely a P3-merge side-effect or a P2 / P10 ordering nuance. AC says "pixel-identical" and this is not.

### Sub-issue recommendations

1. **Branch `aa/pl-sprint-10-cycle-2b2.1-aboutus-hero-cta-marker` (REWORK)**
   Add `dy-section--cta-pair` to /about-us hero §1 (canvas_page id=17, index 0) `additional_classes`. Preserve `component_version`. Extend `sprint10-cycle2b1-about-us-markers.php` or add a small one-shot following the same idempotent pattern.

2. **Branch `aa/pl-sprint-10-cycle-2b2.2-p4-coverage-audit` (REWORK, may be combined with #1)**
   Re-audit every page (`/`, `/services`, `/about-us`, `/how-we-do-it`, `/open-source-projects`, `/contact-us`, `/articles`, `/privacy`, any other) for `dy-section.theme--white` sections whose `.dy-section__content` has two consecutive direct `.button` children. Either (a) apply `dy-section--cta-pair` markers, or (b) restore P4 to a transition selector (`new marker, old :has()`) until full marker coverage is verified. F's current state is brittle either way.

3. **Branch `aa/pl-sprint-10-cycle-2b2.3-services-drift` (REWORK)**
   Bisect the CSS diff to find the source of the /services 32–96 px drift. Candidates: the P3-merge into P2's content-centering rule, the wordmark P10 direct swap, the mobile max-width rule expansion. Likely fix is to re-introduce the equivalent of the previously-pruned rule, or document the drift as acceptable and revise the AC.

4. **Operator decision needed:**
   - Is the AC "/services pixel-identical at 1280/768/375" strictly binding, or is a ≤1% drift acceptable? F's current 4.5–6.6% is unambiguously over either threshold; that question only matters once /services drift is investigated and quantified.
   - Should the rework happen on a 2b.2.x sub-branch and be merged back into 2b.2, or should 2b.2 be rolled back and the work redone in 2b.3? The mechanical answer: rework on a sub-branch is cheaper because the marker script and most CSS are correct.

## Advisory notes (non-blocking, forwarded from T)

1. F's contrast table has inaccurate carry-forward values for Closing CTA (13.07 vs 15.07; 7.39 vs 7.96). All pairs still pass WCAG threshold; T's recomputation is authoritative.
2. F's "P8 has 6 rules" doc count is off — the served CSS has 5 active selector pairs. Cosmetic; behavior correct.
3. Script idempotency was asserted by F but not independently re-run by T. The script's `strpos` check is sound.
4. The P2 transition selector keeps an extra `:has()` half active until cycle 2b.3+ applies markers to /open-source-projects. This is correct conservative behavior; no rework needed here.

## Files produced by S

- `docs/pl2/handoffs/cycle-2b2-services-refactor-S.md` (this file)
- `docs/pl2/handoffs/cycle-2b2-services-refactor-report.html`
- `docs/pl2/handoffs/screenshots/sprint-10-cycle-2b2/` — 60 PNGs (15 baseline + 15 live + 15 diff + 15 composite + 6 hero crops)
