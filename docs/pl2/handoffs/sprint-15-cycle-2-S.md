# Handoff-S: Sprint 15 Cycle 2 — `/how-we-do-it` preview §E CTA token (F-NEW-15-C)

**Verdict:** **PASS**

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-2-preview-doc`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-2-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-15-cycle-2-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-15-cycle-2-F.md`
**Operator-facing report:** [`sprint-15-cycle-2-report.html`](sprint-15-cycle-2-report.html)
**Scope:** Preview-doc only. Two CSS rules added at lines 428-429 of `docs/pl2/Previews/how-we-do-it.html`. Same fix pattern as Sprint 14 Cycle 2 (F-NEW-3) on `about-us.html`. Scoped re-audit; full Cycle 1 capture matrix not re-run per operator guidance.

## T precondition

Confirmed: T reported zero blocking issues. All Tier 1 (5/5) and Tier 2 (4/4) checks PASS. Contrast independently verified (8.81:1 primary, 7.53:1 hover — both well above AA 4.5:1).

## Preconditions

| Precondition | Status |
|---|---|
| Playwright at project (`node_modules/playwright` v1.59.x) | PASS |
| ImageMagick `compare` at `/opt/homebrew/bin/compare`, `magick` available | PASS |
| Preview file readable via `file://`, HTTP 200 not required (preview-doc cycle) | PASS |

## Scope-1 — git diff verification

```
$ git diff main -- docs/pl2/Previews/how-we-do-it.html
@@ -425,6 +425,8 @@
       line-height: 1.6;
     }
     .closing-cta__ctas { display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap; }
+    .closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }
+    .closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }

     /* ---------- Footer ---------- */
     .footer {
```

| Check | Result |
|---|---|
| Exactly two new rules added | PASS |
| Selectors are `.closing-cta .btn--primary` and `.closing-cta .btn--primary:hover` | PASS |
| No other selectors touched | PASS |
| No `!important` | PASS |
| No live theme files touched | PASS (`git diff --name-only main` shows only `how-we-do-it.html` plus pre-existing Cycle 1 artifacts) |

## Scope-2 — post-fix preview re-render @ 1280×800 @ 2× DPR (Playwright)

Captured via `scripts/sprint-15-cycle-2-verify.mjs`. Closing-cta `.btn--primary` ("Book a testing review") computed styles:

| Property | Computed | Expected (brief L319) | Match |
|---|---|---|---|
| `background-color` | `rgb(93, 198, 232)` = `#5DC6E8` | `#5DC6E8` | YES |
| `color` | `rgb(31, 26, 20)` = `#1F1A14` | `#1F1A14` | YES |
| pill width × height | 220.14 × 45 px | ≥ 44 px tap height | YES |

Visual confirmation of the post-fix crop: light-blue (`#5DC6E8`) pill with dark espresso text sits on the espresso `.closing-cta` band, beside the ghost-on-dark "See all engagement shapes" sibling. Brief line 319 visually satisfied.

## Scope-3 — preview-vs-preview pixel diff (Cycle 1 baseline vs Cycle 2 post-fix)

Baseline preview crop recovered from cycle-1 commit `683958c98` (closing-cta@1280) to avoid the in-tree regenerated artifacts.

| Metric | Value |
|---|---|
| AE (absolute-error pixel count) | 38,000 |
| Crop area (2560 × 1300 @ DPR 2) | 3,328,000 px |
| Delta % | **1.142%** |
| Where the red appears (inspected diff PNG) | Entirely confined to the §E primary CTA pill footprint. Headline, eyebrow, body copy, ghost-on-dark sibling, and surrounding band are pixel-identical. |

This is the textbook signature for a clean token-only override fix: no spillover, no layout shift, no chrome regression. Delta is bounded to the button face exactly as F predicted.

## Scope-4 — light-zone non-regression

`document.querySelectorAll('.btn--primary')` on the post-fix preview returns **one** element only, and it is inside `.closing-cta`. There are no light-zone `.btn--primary` instances on `/how-we-do-it` (hero has no CTA button; §B/§C/§D contain no primary CTAs). The override selector `.closing-cta .btn--primary` (specificity 0,2,0) therefore cannot affect any other primary CTA on this page. Light-zone non-regression is trivially satisfied.

For full sitewide confidence the `.btn--primary` base rule (line 138) still resolves to `var(--primary-light)` = `#62BBCB` + white, unchanged.

## Scope-5 — out-of-scope deltas explicitly unchanged

| Carry-forward finding | Cycle 2 scope? | Status this cycle |
|---|---|---|
| F-NEW-4 (live CTA chrome uses dripyard pill+chevron; preview uses flat pill) | No — sitewide live-theme work | Unchanged. Drives section DSSIM at 0.205/0.241/0.297 across viewports (informational; F documented). |
| F-NEW-15-A (H2 mobile spec mismatch at 375) | No — Cycle 3 | Unchanged. |
| F-NEW-15-B (orphan word "runs." in §"What we don't do") | No — Cycle 4 | Unchanged. The §E content does not introduce a new orphan; `.closing-cta h2` has `text-wrap: balance` from the global `h*` rule. |

## WCAG 2.2 AA audit (scoped to the affected element)

| Check | Result | Notes |
|---|---|---|
| Closing-CTA primary button text contrast | PASS | `#1F1A14` on `#5DC6E8` = **8.81:1** (T-verified, matches F) — clears AA 4.5:1 by ~96%. |
| Closing-CTA primary button hover contrast | PASS | `#1F1A14` on `#4AB8DA` = **7.53:1** (T-verified). F handoff overstated this as 9.39:1; both values clear AA by a wide margin so it is informational only. Flagged to F for future-handoff hygiene. |
| Focus ring contrast vs espresso band | PASS | `#1893B4` on `#1F1A14` = **4.83:1** ≥ 3:1 non-text AA. |
| Touch target ≥ 44 px | PASS | Rendered pill = 45 px tall. |
| No motion / transition regression | PASS | Color-only token change; no transition, transform, or animation added. |
| No layout shift | PASS | Padding, font-size, border-radius unchanged; pill geometry identical pre/post fix. |
| Single H1, heading hierarchy | PASS | No DOM change. |
| `text-wrap: balance` on §E h2 | PASS | Inherits global `h*` rule; color change does not affect wrapping. No new orphan introduced. |

## Design brief compliance

| Token | Brief value (line 319) | Rendered post-fix | Match |
|---|---|---|---|
| Dark-zone CTA bg | `#5DC6E8` | `#5DC6E8` | YES |
| Dark-zone CTA text | `#1F1A14` | `#1F1A14` | YES |
| Dark-zone CTA hover bg | tonal variant per Sprint 14 Cycle 2 precedent (`#4AB8DA`) | `#4AB8DA` (computed-style not exercised at rest, verified via CSS rule + T1 grep) | YES |
| Light-zone CTA tokens (sitewide var `--primary-light` = `#62BBCB`) | unchanged | unchanged (variable declaration intact at line 14) | YES |

## Verdict

**PASS** — All five acceptance criteria from the issue are met:

1. ✅ §E primary button uses `background: #5DC6E8` and `color: #1F1A14` (brief line 319, 8.81:1 AA verified independently).
2. ✅ Hover state = `background: #4AB8DA; color: #1F1A14;` (Sprint 14 Cycle 2 precedent).
3. ✅ Light-zone primary buttons unchanged — and the page contains no light-zone `.btn--primary` element to regress.
4. ✅ No other preview file modified; no live code modified.
5. ✅ DSSIM re-run done; closing-cta@1280 score acknowledged at 0.205 (non-drop explained by pre-existing F-NEW-4 CTA-chrome structural delta dominating the section crop — identical pattern accepted in Sprint 14 Cycle 2). Binding verification is the targeted preview-vs-preview crop diff: **1.142% delta, bounded exclusively to the button footprint**, confirming the fix landed cleanly.

Ready for O to commit.

## Advisory notes (non-blocking)

1. **Hover ratio overstatement carry-forward.** F's handoff lists 9.39:1 for the hover contrast; correct value is 7.53:1 per independent recomputation (T and S agree). No WCAG impact. F should adopt the correct figure in future handoffs to avoid inflating confidence in the margin.
2. **F-NEW-4 still drives section DSSIM.** Closing-cta@1280 DSSIM is unchanged at 0.205 because the live CTA pill uses the dripyard `button` component with a 32 px SVG chevron-circle suffix, producing a 56 px pill vs the preview's 45 px flat pill. That live-theme work is out of scope for this preview-doc cycle and was correctly deferred. Sprint 15 Cycle 3 or a follow-on sprint can address it.
3. **Cycle-1 artifact churn.** F's run of the capture/diff scripts re-wrote ~151 cycle-1 PNG/JSON artifacts in-place (PNG byte deltas are stochastic from font-rendering jitter; per-section DSSIM/PSNR numbers are unchanged). This is benign but operator should consider whether O should `git checkout` the cycle-1 artifact directory before merge, or accept the regenerated set. S did not modify these files.
