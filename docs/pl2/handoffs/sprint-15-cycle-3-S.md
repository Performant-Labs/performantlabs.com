# Handoff-S: Sprint 15 Cycle 3 — display-md H2 mobile source-order fix (F-NEW-15-A)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-3-display-md-mobile`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-3-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-15-cycle-3-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-15-cycle-3-F.md`
**Operator-facing report:** [`sprint-15-cycle-3-report.html`](sprint-15-cycle-3-report.html)
**Mode:** Autonomous

## T precondition

Confirmed: T reported zero blocking issues. All T1 (6/6) and T2 (7/7) checks PASS. T explicitly defers the cross-page pixel sweep to S per PC-3.

## Browser-tool + visual-diff preconditions

- Playwright present at `node_modules/playwright/package.json`; `chromium.launch()` succeeds.
- ImageMagick `magick` available; `compare -metric AE` returns numeric counts.
- 18 captures completed (6 pages × 3 viewports) at 2× DPR.
- Pre-fix baselines re-captured for the same 6 pages at 375 by temporarily stashing the base.css fix, running Playwright, then restoring (verified via `grep min-width: 577` post-stash-pop).

## Tier 3 visual audit

### 375 px (binding viewport) — pre-fix vs post-fix diffs

| Page | Width | Height | Pixels different | Total pixels | Whole-page delta % | Verdict |
|---|---|---|---|---|---|---|
| `/`                       | 750 | 14130 | 1,851,930 | 10,597,500 | 17.48% | PASS (intent) |
| `/services`               | 750 | 13110 | 2,003,830 | 9,832,500  | 20.38% | PASS (intent) |
| `/about-us`               | 750 | 16034 | 2,036,570 | 12,025,500 | 16.94% | PASS (intent) |
| `/how-we-do-it`           | 750 | 16348 | 2,463,850 | 12,261,000 | 20.10% | PASS (intent) |
| `/open-source-projects`   | 750 | 18586 | 1,591,780 | 13,939,500 | 11.42% | PASS (intent) |
| `/contact-us`             | 750 | 12192 | 1,327,230 | 9,144,000  | 14.51% | PASS (intent) |

Whole-page delta is >5% on every page. Per Step 4d, this requires every contributing section to be documented as intentional. **All deltas are attributable to a single change:** display-md H2 shrinks from 40 px → 30 px and downstream content reflows upward. Visual inspection of every diff PNG confirms:

- Red pixels cluster on H2 lines and the body-paragraph reflow immediately below them.
- No red in hero block / H1 (unchanged on all pages).
- No red in headers, footers, CTAs, image regions outside the reflow band.
- Closing-CTA H2 (display-lg) shows no red — unchanged at 36 px.

F's handoff (lines 144-167, cross-page consumer list lines 210-220) explicitly documents this as the intended L3 sitewide cascade. Verdict: **intent-only deltas, PASS.**

### 1280 px (desktop sanity) — pre-fix vs post-fix diffs

| Page | Pixel diff | Total pixels | Delta % | Verdict |
|---|---|---|---|---|
| `/`                       | **0** | 24,340,480 | 0.000% | MATCH (bit-identical) |
| `/how-we-do-it`           | **0** | 27,535,360 | 0.000% | MATCH (bit-identical) |
| `/services`               | not diffed | — | — | MATCH (computed-style probe) |
| `/about-us`               | not diffed | — | — | MATCH (computed-style probe) |
| `/open-source-projects`   | not diffed | — | — | MATCH (computed-style probe) |
| `/contact-us`             | not diffed | — | — | MATCH (computed-style probe) |

Bit-identical pre/post at 1280 on the two sampled pages confirms the `@media (min-width: 577px)` wrapping is correct — desktop is genuinely untouched. Other four pages confirmed by computed-style probe (40 px / -1 px on every display-md H2).

### 768 px (above mobile breakpoint)

Computed-style probes show 40 px / -1 px on every display-md H2 across all 6 pages — identical to 1280 path. No diff captured (above breakpoint, no change expected).

### Per-section delta description

For each page at 375 px, the red regions in the diff PNG land where expected:

| Page | Section(s) with red | What changed |
|---|---|---|
| `/` | §B "Tools, AI, and experts. All there.", §C "We heal our own tests nightly.", §D "Built for the whole Drupal team.", §E "Frequently asked questions." + each body reflow band | H2 40→30 px / -1→-0.8 px ls; body reflows up |
| `/services` | §B "Four ways we engage.", §C "Senior testing capacity…", §D summary | Same H2 cascade + body reflow |
| `/about-us` | §B "On drupal.org since 2006.", §C "The tools we wrote.", §D "We test what we ship." | Same |
| `/how-we-do-it` | §B "Audit.", §C "Stand up the dogfood loop.", §D "Take over or hand back.", §E "What we don't do." | Same — primary target of cycle |
| `/open-source-projects` | §B "Our testing tools", §C "Community contributions" | Same |
| `/contact-us` | §C "What to expect from the other side of this form." | Same (only one display-md H2 on this page) |

Closing CTA H2 (display-lg / 36 px mobile) showed no red on any page → confirms unchanged.

### Desktop (1280 px) — section-by-section

Computed styles across 6 pages, all display-md H2s:
- font-size: 40 px (matches brief)
- letter-spacing: -1 px (matches brief)
- line-height: 45.2 px (1.13 — Dripyard default; brief target 1.05-1.10; pre-existing, flagged as known issue by F)

All closing-CTA H2s (display-lg):
- font-size: 56 px (matches brief)
- letter-spacing: -1.6 px (matches brief)

No drift introduced.

### Mobile (375 px) — section-by-section

All display-md section H2s across all 6 pages:
- font-size: **30 px** (was 40 px pre-fix; brief value, FIXED)
- letter-spacing: **-0.8 px** (was -1 px pre-fix; brief value, FIXED)
- line-height: 33.9 px (1.13 — Dripyard default, known issue carry-forward)

All closing-CTA H2s (display-lg):
- font-size: 36 px (unchanged)
- letter-spacing: -1.2 px (unchanged)

Horizontal scroll: `scrollWidth ≤ clientWidth` on all 6 pages at 375 px. T also confirmed at 320 px on `/how-we-do-it`.

## Design brief compliance

| Token | Brief value | Rendered value (post-fix) | Match |
|---|---|---|---|
| display-md mobile font-size | 30 px | 30 px (all 6 pages, 375 px) | YES |
| display-md mobile letter-spacing | -0.8 px | -0.8 px (all 6 pages, 375 px) | YES |
| display-md desktop font-size | 40 px | 40 px (all 6 pages, 1280 px) | YES |
| display-md desktop letter-spacing | -1 px | -1 px (all 6 pages, 1280 px) | YES |
| display-md mobile line-height | ≤ 1.10 | 1.13 (Dripyard default) | NO — pre-existing carry-forward, not introduced by this cycle |
| display-lg mobile font-size | 36 px | 36 px | YES |
| display-lg desktop font-size | 56 px | 56 px | YES |
| Hero H1 mobile font-size (375) | 44 px (Sprint 14 C3 fix) | 44 px on `/how-we-do-it` | YES — Sprint 14 fix intact |
| No `!important` introduced | (none) | (none) | YES |

## WCAG 2.2 AA audit (scoped re-audit)

Full enumeration was performed at Cycle 1 (see `docs/pl2/handoffs/sprint-15-cycle-1-audit.md`). This cycle only modifies font-size + letter-spacing tokens scoped to a media query; the scoped checks below cover all surfaces touched by the change.

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | N/A this cycle | No interactive selectors touched. Cycle 1 audit holds. |
| Focus ring visibility | N/A this cycle | No focusable elements modified. |
| Forced-colors mode | N/A this cycle | No color values changed. |
| Reduced-motion | N/A this cycle | No animation properties changed. |
| 200% zoom | PASS (inferred) | No fixed widths added; tokens scale via existing root font-size. |
| Heading hierarchy | PASS | T-verified single H1 → H2 → H3 across all probed pages. |
| Image alt text | N/A this cycle | No image markup changed. |
| Mobile touch targets (375 px) | N/A | H2 elements are non-interactive. |
| Mobile typography scale (display-md = 30 px / -0.8 px) | PASS | Matches brief `typography-mobile` block. |
| Mobile layout (no hScroll, no clipping, CTA stacking) | PASS | All 6 pages: scrollWidth ≤ clientWidth at 375; T verified 320 too. |
| Color contrast at new 30 px (large-text threshold 3:1) | PASS | `#1F1A14` on white = 17.27:1; on `#F5EFE2` = 15.07:1 (independently computed). |
| Orphan-word regression at new H2 size | PASS | Visually inspected /how-we-do-it and /services H2s at 30 px; all wrap with ≥2 words on tail line or fit one line. F-NEW-15-B (hero "runs." orphan) is out-of-scope carry-forward, not regressed. |

## Static preview comparison

Cycle 3 F change to `docs/pl2/Previews/how-we-do-it.html` (line 482) brings `.section-head h2` mobile `letter-spacing` to -0.8 px, matching brief. Preview font-size was already 30 px (audit's "~32" guess was incorrect).

Section-by-section comparison of `/how-we-do-it` live vs preview at 375 px:

| Section | Live | Preview | Match |
|---|---|---|---|
| §A hero H1 | 44 px (Sprint 14 fix) | matches | YES |
| §B "Audit." H2 | 30 px / -0.8 px | 30 px / -0.8 px | YES |
| §C-E section H2s | 30 px / -0.8 px | 30 px / -0.8 px | YES |
| §F closing-CTA H2 | 36 px / -1.2 px | 36 px (Cycle 2 preview fix) | YES |
| §A orphan "runs." | present (F-NEW-15-B, Cycle 4 scope) | present | known carry-forward, both renders agree |

## `/how-we-do-it`-specific re-audit (Cycle 1 findings)

- **F-NEW-15-A (this cycle's target):** CLOSED. §B "Audit." at 375 = 30 px / lh ≤ 1.13 (Dripyard default, known) / Rubik 500 / -0.8 px letter-spacing. Pre-fix value was 40 px.
- **F-NEW-15-B (hero orphan "runs."):** still present at 375; Cycle 4 scope (not regressed by this cycle).
- **F-NEW-15-C (§F closing CTA token):** confirmed still resolved from Cycle 2 — closing CTA renders 36 px / -1.2 px at 375 and 56 px / -1.6 px at 1280.
- **F-NEW-4 (CTA suffix-icon sitewide):** still present, silent-parked per orchestrator memory.

## Cross-page sweep mandate (PC-3 + AC-7)

All six pages probed at 1280 + 768 + 375 px @ 2× DPR. Cells: 18 / 18 captured. All 6 page+375 cells diffed at pixel level vs pre-fix baseline (captured by stashing base.css fix, re-rendering, then restoring). Two page+1280 cells (homepage, how-we-do-it) diffed bit-identical against pre-fix (additional validation of "desktop unchanged"). Other four 1280 cells validated by computed-style probe.

No regressions detected on any page. No horizontal scroll on any page+viewport. No layout breakage. No orphan-word regressions at new H2 size.

## Verdict

**PASS** — all 7 acceptance criteria met. L3 sitewide cascade works as intended:

- AC-1 PASS: `/how-we-do-it` §B/§C/§D/§E H2 at 375 = 30 px (brief); all six pages confirm cascade.
- AC-2 PASS: preview corrected to -0.8 px letter-spacing.
- AC-3 PASS: desktop unchanged (0 pixel diff at 1280 on sampled pages; computed-style on remaining).
- AC-4 PASS: display-lg (closing CTA) unchanged at 36 / 56 px.
- AC-5 PASS: no `!important`; L3 layer; 7-step trace in F handoff.
- AC-6 PASS: T1 + T2 confirmed by T.
- AC-7 PASS: cross-page sweep covers all 6 pages at 3 viewports = 18 cells; pixel diffs at 375 confirm intent-only deltas; desktop bit-identical on sampled pages.

Ready for O to commit and merge.

## Advisory notes (non-blocking)

1. **Five other preview files retain `-0.6px` letter-spacing on mobile `.section-head h2`** (homepage, services, about-us, open-source-projects, contact-us previews). Brief specifies -0.8 px. Out of scope for this cycle; queue as a one-line preview-consistency follow-up.

2. **Mobile line-height computes 1.13 (33.9 px / 30 px), brief says ≤ 1.10.** Dripyard's `--h2-line-height: 1.13` default. Pre-existed this cycle. Operator decision on whether to file a follow-up L3 fix for `--h2-line-height` mobile override.

3. **`/open-source-projects` §C "Other modules we maintain"** renders at 30 px / -0.6 px / lh 1.15 at desktop and 24 px at 375 — uses a different (smaller) heading utility class than display-md. Not regressed by this cycle. Worth a future alignment cycle if the brief intends it to be display-md.

4. **`/contact-us` §B "Prefer a quick call?"** renders at 32 px (desktop) / 24 px (375), also not on the display-md path. Not regressed; left for future alignment.

5. **F-NEW-15-B hero orphan "runs."** in `/how-we-do-it` §A remains open per Sprint 15 Cycle 4 scope.

6. **F-NEW-4 CTA suffix-icon sitewide drift** remains silent-parked per orchestrator memory.

## Artifacts

- Screenshots: `docs/pl2/handoffs/screenshots/sprint-15-cycle-3/` (post-fix 18 captures + pre-fix 8 captures + 6 diff PNGs at 375 + 2 diff PNGs at 1280 + 6 composites at 375)
- Scripts: `scripts/sprint-15-cycle-3-capture.mjs`, `scripts/sprint-15-cycle-3-capture-prefix.mjs`, `scripts/sprint-15-cycle-3-capture-prefix-desktop.mjs`, `scripts/sprint-15-cycle-3-diff.sh`
- Operator HTML report: `docs/pl2/handoffs/sprint-15-cycle-3-report.html` (wipe-slider comparators for `/how-we-do-it` and `/services` at 375; per-page diff PNG + composite expandable sections; per-page sweep table; WCAG re-audit; AC checklist)
