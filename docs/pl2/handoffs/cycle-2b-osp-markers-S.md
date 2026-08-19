# Handoff-S: Sprint 11 Cycle 2b — /open-source-projects centered-white markers + P2 transition cleanup

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2b-osp-markers`
**Issue:** `docs/pl2/handoffs/cycle-2b-osp-markers-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2b-osp-markers-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2b-osp-markers-F.md`
**Operator-facing report:** [`cycle-2b-osp-markers-report.html`](cycle-2b-osp-markers-report.html)
**Mode:** autonomous

## T precondition

Confirmed — T reported zero blocking issues. One acceptance criterion (P2 `:has()` half drop) is logged as an intentional documented deviation with a forward follow-up path; T explicitly forwards that decision to S. Per the spawn prompt, this deviation is accepted with the open follow-up flagged in §"Acceptance criteria status" below.

## Verification approach (Sprint 10 stash-baseline method)

This is a refactor cycle; AC binding is pixel-identity vs the pre-refactor state on `/open-source-projects` plus zero regression on four cross-page consumers. The cycle branch already contains F's edits, so the pre-refactor state was reconstructed locally:

1. `git stash` saved F's `dy-section.css` edits.
2. A one-shot drush script (`scripts/sprint11-cycle2b-osp-markers-remove.php`, deleted after audit) stripped the `dy-section--centered-white` marker from canvas_page id=5 deltas 0 and 11.
3. `ddev drush cr` cleared cache.
4. Playwright (chromium, fullPage, scroll-primed) captured baseline PNGs for `/open-source-projects`, `/services`, `/about-us`, `/how-we-do-it`, and `/` at 1280×800, 768×1024, 375×667.
5. `git stash pop` restored F's CSS; F's marker script re-applied the markers; cache cleared.
6. Live PNGs captured under identical conditions.
7. `compare -metric AE -fuzz 1%` ran on each baseline/live pair.

All temp scripts and helper files were removed; the working tree contains F's intended CSS change, F's marker script, S's handoff + report + screenshots, and the pre-existing handoff docs. No stray edits.

## Tier 3 visual audit

### Visual diff matrix — AE pixel counts

| Page | Viewport | Dimensions | AE (pixels diff) | Whole-page delta | Result |
|---|---|---|---|---|---|
| /open-source-projects | 1280×800  | 1280×4490 | 0 | 0.000% | MATCH |
| /open-source-projects | 768×1024  | 768×7041  | 0 | 0.000% | MATCH |
| /open-source-projects | 375×667   | 375×9293  | 0 | 0.000% | MATCH |
| /services             | 1280×800  | 1280×3854 | 0 | 0.000% | MATCH |
| /services             | 768×1024  | 768×4266  | 0 | 0.000% | MATCH |
| /services             | 375×667   | 375×5059  | 0 | 0.000% | MATCH |
| /about-us             | 1280×800  | 1280×4549 | 0 | 0.000% | MATCH |
| /about-us             | 768×1024  | 768×5690  | 0 | 0.000% | MATCH |
| /about-us             | 375×667   | 375×7952  | 0 | 0.000% | MATCH |
| /how-we-do-it         | 1280×800  | 1280×5378 | 0 | 0.000% | MATCH |
| /how-we-do-it         | 768×1024  | 768×6471  | 0 | 0.000% | MATCH |
| /how-we-do-it         | 375×667   | 375×8174  | 0 | 0.000% | MATCH |
| /                     | 1280×800  | 1280×4754 | 0 | 0.000% | MATCH |
| /                     | 768×1024  | 768×5658  | 0 | 0.000% | MATCH |
| /                     | 375×667   | 375×7065  | 0 | 0.000% | MATCH |

All 15 page × viewport pairs produced zero differing pixels (AE=0, fuzz 1%). Diff PNGs were generated (all blank) and side-by-side composites are referenced in the HTML report for parallel-comparison reassurance.

### Per-section delta description

No section shows any rendered delta on any page at any viewport. The refactor is byte-identical at the pixel level.

### Why the result is pixel-identical (mechanism)

- **OSP delta 0 (Hero) and delta 11 (Community):** Pre-refactor, header centering on these `theme--white + kicker--centered` sections came from the P2 `:has(.dy-section__header .kicker--centered)` half of each rule. Post-refactor, the marker `.dy-section.dy-section--centered-white` matches the same DOM; F retained the `:has()` half (deviation #1 — see §Acceptance criteria status). Two parallel selectors now match the same elements with identical declarations -> identical computed styles -> identical paint.
- **Specificity update (single-class -> doubled-class):** Specificity rose from 0,1,0 to 0,2,0 on the marker selectors. No other rule in the cascade targets the same properties with intermediate specificity, so the computed style is unchanged. Verified by AE=0 across all viewports.
- **Cross-page consumers (/services "Four ways we engage", /how-we-do-it hero, /about-us cta-pair + bio-block):** None of those sections received a marker in this cycle. They continue to be centered by the retained `:has()` half. AE=0 on all three pages at all three viewports confirms no regression. Homepage `/` likewise unaffected (no P2 consumer there) — AE=0 confirms.

## Design brief compliance

Refactor cycle — no visual change intended; no design-brief tokens were modified. F's git diff on `dy-section.css` is selector-only (single-class -> doubled-class) plus one comment block update. Every declaration value is unchanged. Pixel-identity (AE=0) is the operative verification: colors, typography, spacing, borders, shadows, decorative treatments are all byte-identical to the pre-refactor state.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | No DOM order changes; tab order unchanged (refactor is class-list + selector edits only) |
| Focus ring visibility | PASS | No focus styles touched |
| Forced-colors mode | PASS | No color rules added/changed |
| Reduced-motion | PASS | No motion rules touched |
| 200% zoom | PASS | Layout unchanged (AE=0 at every viewport implies same wrapping/clipping behavior) |
| Heading hierarchy | PASS | Single H1; H1 → H2 × 4 → H3 × 7 sequence verified by T |
| Image alt text | PASS | No `<img>` elements added or changed |
| Mobile touch targets (375) | PASS | No interactive elements touched |
| Mobile typography scale | PASS | No typography rules changed; AE=0 at 375 confirms |
| Mobile layout | PASS | Pixel-identical at 375 on all 5 pages; grid collapse / CTA stacking / no horizontal scroll all preserved |
| ARIA landmarks (header/main/nav/footer) | PASS | T verified all four present |
| Color contrast | PASS | No color changes; existing ratios re-verified by T (espresso/white 17.27:1, body/white 7.43:1) |
| No `!important` in declarations | PASS | 2 string matches both inside block comments |

## Static preview comparison

No static preview exists for `/open-source-projects` in `docs/pl2/Previews/`. The shipped pre-cycle state is the canonical reference, and AE=0 confirms identity with it.

## Cross-page regression check

AC: "No regression on /services / /about-us / /how-we-do-it / homepage." All four pages produced AE=0 at all three viewports — zero regression. The retained `:has()` half of P2 keeps the four cross-page consumers (`/services` "Four ways we engage", `/how-we-do-it` hero, `/about-us` cta-pair + bio-block) centered as before.

## Acceptance criteria status

| Criterion | Result | Evidence |
|---|---|---|
| `dy-section--centered-white` applied to canvas_page id=5 section index 11 via idempotent script | PASS | DB confirms `additional_classes` contains marker for delta 11; T verified idempotency re-run |
| P2 transition `:has` half dropped from `dy-section.css` lines 133/141/152 | **NOT MET — accepted deviation** | F retained the `:has()` half because 4 cross-page consumers across /services, /how-we-do-it, /about-us still depend on it. Rationale is sound (dropping would cause visible centering regression on three other pages). **Follow-up flagged below.** |
| `/open-source-projects` AE=0 at 1280/768/375 vs pre-refactor baseline | PASS | AE=0 at all three viewports (this audit) |
| No regression on /services / /about-us / /how-we-do-it / homepage | PASS | AE=0 on all four pages at all three viewports (12 pairs) |
| No `!important` | PASS | T verified — 2 grep hits in comments only |
| `component_version` preserved | PASS | T verified `e6079b189d228dad` on both delta 0 and delta 11 post-patch |
| Specificity-safe doubled-class marker `.dy-section.dy-section--centered-white` (Sprint 10 codification) | PASS | 4 rule selectors at source lines 133/141/152/213 confirmed in served CSS at specificity 0,2,0 |

**6 of 7 criteria PASS; 1 accepted deviation with open follow-up.**

## Open follow-up (forwarded from F + T, blocking eventual `:has()` removal)

Before the P2 `:has()` half can be dropped, these 4 sections must receive `dy-section--centered-white` markers:

| Page | Section | Current classes | Notes |
|---|---|---|---|
| /services | "Four ways we engage" | `theme--white` (no marker) | Has grid-wrapper content; only needs header centering (lines 133/141), not content centering (line 152 already excluded by `:not(:has(.grid-wrapper))`) |
| /how-we-do-it | Hero | `landing-hero theme--white` | Needs both header centering |
| /about-us | Hero | `dy-section--cta-pair theme--white` | Has own CTA-pair marker but no centered-white marker |
| /about-us | Bio block | `dy-section--bio-block theme--white` | Has own bio-block marker but no centered-white marker |

Suggested next-cycle slug: `cycle-2c-cross-page-centered-white-markers` followed by `cycle-2d-p2-has-drop`.

## Verdict

**PASS** — all binding AC met; the refactor is pixel-identical to the pre-refactor shipped state at every tested viewport on the target page and on every cross-page consumer; WCAG status unchanged. The single unmet AC (`:has()` drop) is an intentional, well-documented deviation with a sound technical rationale (would regress three other pages); both F and T flagged it for follow-up. S accepts the deviation per O's spawn instruction.

Ready for O to commit. Per the runbook, the commit message is `refactor(architecture): cycle 2b — /open-source-projects centered-white marker + P2 transition cleanup`. O should commit:

- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` (F's modification)
- `scripts/sprint11-cycle2b-osp-markers.php` (F's new marker script)
- `docs/pl2/handoffs/cycle-2b-osp-markers-issue.md`, `-F.md`, `-T.md`, `-S.md`, `-report.html`
- `docs/pl2/handoffs/screenshots/sprint-11-cycle-2b/` (60 PNGs: 15 baseline + 15 live + 15 diff + 15 composite)

## Advisory notes (non-blocking)

1. F's CSS line-number references (132/140/151/212) are off-by-one against actual source lines (133/141/152/213). Documentation nit; selectors and behavior are correct. T flagged this in their advisory; restating here for the cycle wrap.
2. F applied the marker to delta 0 (Hero) in addition to issue-specified delta 11 (Community). Both are legitimate P2 consumers; this is forward preparation for the eventual `:has()` removal and follows the cycle 2b.1 precedent (P1 marker applied to both Track-record and Dogfood). Approved.
3. `/services` "Four ways we engage" is currently the most exposed `:has()` consumer (no marker of any kind). Prioritize it in the cycle-2c follow-up.

## Files produced by S

- `docs/pl2/handoffs/cycle-2b-osp-markers-S.md` (this file)
- `docs/pl2/handoffs/cycle-2b-osp-markers-report.html`
- `docs/pl2/handoffs/screenshots/sprint-11-cycle-2b/` — 60 PNGs (15 baseline + 15 live + 15 diff + 15 composite)
