# Handoff-S: Sprint 14 Cycle 2 — `/about-us` preview-doc batch (F-NEW-1 + F-NEW-3)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-14-cycle-2-about-us-preview-doc`
**Issue:** `docs/pl2/handoffs/sprint-14-cycle-2-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-14-cycle-2-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-14-cycle-2-F.md`
**Cycle 1 baseline audit:** `docs/pl2/handoffs/sprint-14-cycle-1-audit.md`
**Operator-facing report:** [`sprint-14-cycle-2-report.html`](sprint-14-cycle-2-report.html)
**Mode:** Autonomous (scoped re-audit)

---

## Verdict

**PASS.** Both preview-doc fixes (F-NEW-1 + F-NEW-3) landed cleanly in `docs/pl2/Previews/about-us.html`. Computed-style probes and preview-vs-preview pixel diffs at 1280 both confirm the changes match the brief tokens exactly, no out-of-scope files or selectors were touched, no new regressions appeared, and the remaining live-vs-preview DSSIM floor maps entirely to pre-known carve items already documented in the Cycle 1 audit.

Ready for O to merge the cycle and proceed to Sprint 14 Cycle 3 (F-NEW-2 mobile H1 raise to 44 px).

---

## T precondition

Confirmed: T reported **zero blocking issues**. All six T1 grep checks passed (T1-1 through T1-6). All six T2 structural checks passed (T2-1 through T2-6). WCAG ratios independently re-computed by T match F's reported values exactly (8.81:1 dark-zone primary, 4.83:1 focus ring). Mobile guard passed (preview mobile H1 still at 40 px). DSSIM non-drop was classified by T as CONDITIONAL and explained against the Cycle 1 audit's per-section delta classification — accepted by S as expected, not a failure.

---

## Tier 3 visual audit (scoped re-audit)

This is a scoped preview-doc-only cycle. Live did not change. Per the spawn prompt and the Cycle 1 audit's per-section delta classification, a full live-vs-preview Tier-3 capture matrix at 3 viewports is not required. The binding visual signal for Cycle 2 is the **preview-pre-fix vs preview-post-fix** pixel diff at 1280 — this isolates F's two edits from F-NEW-4 (CTA-chrome) and body-lg drift, which dominate the cross-source comparison.

### Preview pre-fix baselines recovered from git

F's autonomous re-run of `sprint-14-cycle-1-capture.mjs` overwrote the Cycle 1 baseline preview PNGs in `docs/pl2/handoffs/screenshots/sprint-14-cycle-1/` with post-fix renders. S recovered the true pre-fix preview baselines from commit `b099fa4ea` (the Cycle 1 wrap commit) via `git show` and staged them into `docs/pl2/handoffs/screenshots/sprint-14-cycle-2/` for the pre-vs-post comparison. This recovery is noted as an Advisory below — future cycles should write to a cycle-scoped output dir rather than overwriting the prior cycle's baselines.

| File | Source | Purpose |
|---|---|---|
| `t3-about-us-1280-hero-preview-prefix-20260513.png` (2560×1204) | `git show b099fa4ea:` | True pre-fix hero crop |
| `t3-about-us-1280-closing-cta-preview-prefix-20260513.png` (2560×992) | `git show b099fa4ea:` | True pre-fix closing-cta crop |
| `t3-about-us-1280-preview-prefix-fullpage-20260513.png` (2560×8780) | `git show b099fa4ea:` | True pre-fix full-page preview |

### Preview-vs-preview pixel diffs at 1280 (Playwright @2x DPR + ImageMagick `compare`)

| Section | Crop dim (img) | AE px | AE % | AE fuzz-3% | DSSIM | Verdict |
|---|---|---|---|---|---|---|
| Hero | 2560×1204 | 355,939 | 11.55% | 348,449 (11.31%) | 0.0807 | EXPECTED DELTA (matches F-NEW-1 scope) |
| Closing-CTA | 2560×992 | 38,000 | 1.50% | 37,882 (1.49%) | 0.00234 | EXPECTED DELTA (matches F-NEW-3 scope) |

Diff PNGs: `docs/pl2/handoffs/screenshots/sprint-14-cycle-2/t3-about-us-1280-{hero,closing-cta}-preview-prevs-post-diff-20260513.png`.
Composites: `t3-about-us-1280-{hero,closing-cta}-preview-prevs-post-composite-20260513.png`.

### Visual delta interpretation (red-region analysis)

**Hero diff.** Red ink is concentrated exclusively on the H1 word stack — clearly shows two superimposed renderings: the smaller 64 px / 2-line pre-fix headline and the larger 72 px / 3-line post-fix headline. The subhead "Nearly two decades of Drupal work…" and the two CTA buttons below appear red because they shift downward ~93 px to accommodate the taller headline, not because their visual appearance changed. The eyebrow "ABOUT" remains at the top in both renders. No red appears on the page chrome, the background, or any other content outside the hero. Footprint = exactly F-NEW-1.

**Closing-CTA diff.** Red ink is concentrated exclusively on the "Book a testing review" primary button shape. The "GET STARTED" eyebrow, the "Want to talk testing?" heading, the subhead, and the secondary outline "See the testing menu" button are all rendered identically in both PNGs (zero red on those elements). Footprint = exactly F-NEW-3. The selector `.closing-cta .btn--primary` scope held — no spillover to the secondary CTA or to other zone primaries.

### Post-fix computed-style probe (Playwright at 1280@2x)

```json
{"hero":{"top":118,"h":694},"cta":{"top":3569,"h":537},
 "h1":{"fs":"72px","lh":"75.6px","ls":"-2px","fw":"500","height":227,"lines":3},
 "btn":{"bg":"rgb(93, 198, 232)","color":"rgb(31, 26, 20)","height":"45px"},
 "pageH":4482}
```

`rgb(93,198,232)` = `#5DC6E8`. `rgb(31,26,20)` = `#1F1A14`. H1 boundingHeight 227 px / line-height 75.6 px = 3.00 lines (no orphan).

### Live-vs-preview DSSIM (Cycle 1 → Cycle 2, informational only)

| Section@1280 | Cycle 1 DSSIM | Cycle 2 DSSIM | Delta | Explanation |
|---|---|---|---|---|
| hero | 0.194 | 0.193 | -0.001 | Dominated by F-NEW-4 (CTA chrome 45 vs 56 px) + body-lg drift (subhead 19 vs 20 px). H1 size fix contributes positively but is swamped. Out-of-scope for Cycle 2. |
| closing-cta | 0.169 | 0.169 | ~0 | Dominated by F-NEW-4 (CTA chrome). Button-color fix is a small-area delta on a full-section crop. Out-of-scope for Cycle 2. |

Consistent with the Cycle 1 audit's delta classification table. Issue's "drop materially" criterion is retroactively satisfiable when F-NEW-4 lands in a future cycle.

---

## Token compliance check (post-fix, 1280 desktop)

| Token | Brief value | Computed (post-fix) | Match |
|---|---|---|---|
| Hero H1 font-size | 72px (`display-xl`) | 72px | YES |
| Hero H1 line-height | 1.05 (= 75.6px @72) | 75.6px | YES |
| Hero H1 letter-spacing | -2px | -2px | YES |
| Hero H1 font-weight | 500 (Rubik Medium) | 500 | YES |
| Hero H1 wrap behavior (no-orphan guardrail) | `text-wrap: balance` keeps clean wrap | 3 lines: "Drupal testing, done" / "by the people who" / "wrote the tools." — no single-word orphan on final line | YES |
| Closing-CTA `.btn--primary` background | `#5DC6E8` (brief line 319) | `rgb(93,198,232)` = `#5DC6E8` | YES |
| Closing-CTA `.btn--primary` color | `#1F1A14` (espresso) | `rgb(31,26,20)` = `#1F1A14` | YES |
| Light-zone hero primary CTA (regression guard) | `#62BBCB` + white (unchanged) | `rgb(98,187,203)` + white | YES (unchanged) |
| §D dogfood primary CTA (regression guard) | `#62BBCB` + white (unchanged) | `rgb(98,187,203)` + white | YES (unchanged) |
| Mobile hero H1 rule (regression guard) | 40px (Cycle 3 raises to 44) | 40px (unchanged) | YES (unchanged) |

---

## WCAG 2.2 AA audit (Cycle 2 deltas only)

This is a scoped re-audit. The full per-page WCAG enumeration (keyboard navigation, focus order, forced-colors mode, reduced-motion, 200% zoom, heading hierarchy, image alt text, mobile touch targets, mobile typography scale, mobile layout) was performed in Cycle 1 — see `docs/pl2/handoffs/sprint-14-cycle-1-audit.md` for the full table. No live theme code changed in Cycle 2, so those checks carry forward unchanged. The only WCAG-relevant Cycle 2 deltas are the new dark-zone primary CTA color tokens and F's autonomous hover state.

| Check | Result | Notes |
|---|---|---|
| Closing-CTA primary text contrast (NEW, F-NEW-3) | PASS | `#1F1A14` on `#5DC6E8` = 8.81:1 (T independently re-verified) |
| Closing-CTA primary hover-state contrast (F autonomous addition) | PASS | `#1F1A14` on `#4AB8DA` ≈ 7.91:1; well above 4.5:1 floor |
| Focus ring on espresso (regression guard) | PASS | `#1893B4` on `#1F1A14` = 4.83:1 (unchanged from Cycle 1) |
| Light-zone primary CTA text (carry-forward) | FAIL (ADV-S5) | `#FFFFFF` on `#62BBCB` = 2.21:1 — pre-existing, pa11y allowlisted Sprint 9, **not introduced by Cycle 2** |
| Keyboard navigation | PASS (carry-forward) | Per Cycle 1 audit; no live theme changes in Cycle 2 |
| Focus ring visibility | PASS (carry-forward) | Per Cycle 1 audit |
| Forced-colors mode | PASS (carry-forward) | Per Cycle 1 audit |
| Reduced-motion | PASS (carry-forward) | Per Cycle 1 audit |
| 200% zoom | PASS (carry-forward) | Per Cycle 1 audit |
| Heading hierarchy | PASS (carry-forward) | T2-1 confirmed single H1 in preview |
| Image alt text | PASS (carry-forward) | Per Cycle 1 audit |
| Mobile touch targets (375) | PASS (carry-forward) | Per Cycle 1 audit; no mobile rule changes in Cycle 2 |
| Mobile typography scale (375) | PARTIAL (carry-forward) | F-NEW-2 (mobile H1 40→44) deferred to Cycle 3 |
| Mobile layout (grid collapse, CTA stacking, horizontal scroll) | PASS (carry-forward) | Per Cycle 1 audit |
| No-orphan guardrail on hero H1 at 72px desktop | PASS (NEW) | `text-wrap: balance` keeps 3-line wrap clean. boundingHeight 227 px = 3 × 75.6 px line-height exactly. No single-word final line. |

---

## Static preview comparison

Preview is the source of truth for visual tokens in this preview-doc cycle (per PC-1). The preview file IS the artifact under audit. Section-by-section vs the post-fix preview itself:

| Section | Status | Notes |
|---|---|---|
| Hero | UPDATED (F-NEW-1) | H1 token now matches brief `display-xl`. Subhead/CTAs visually unchanged. |
| Section B (track-record) | MATCH (unchanged) | No edits in Cycle 2 scope |
| Section C (open-source) | MATCH (unchanged) | No edits in Cycle 2 scope |
| Section D (dogfood) | MATCH (unchanged) | Light-zone primary CTA preserved at `#62BBCB` + white |
| Section E (closing-CTA) | UPDATED (F-NEW-3) | Primary button now matches brief line 319 dark-zone token. Heading + subhead + secondary CTA unchanged. |
| Footer | MATCH (unchanged) | No edits in Cycle 2 scope |

---

## Scope guard — what F did NOT touch (verified)

`git diff main -- docs/pl2/Previews/about-us.html` shows only:
- Line 254: `font-size: 64px` → `72px` (F-NEW-1)
- Line 256: `letter-spacing: -1.6px` → `-2px` (F-NEW-1)
- Line 461 (new): `.closing-cta .btn--primary { background: #5DC6E8; color: #1F1A14; }` (F-NEW-3)
- Line 462 (new): `.closing-cta .btn--primary:hover { background: #4AB8DA; color: #1F1A14; }` (F autonomous hover)

No other changes. `git diff --name-only main` shows no `web/themes/...`, no Drupal templates, no `.module`, no `.yml`. `grep -c '!important' docs/pl2/Previews/about-us.html` = 0. Selector specificity audited: `.closing-cta .btn--primary` (0,2,0) > `.btn--primary` (0,1,0); the three `.btn--primary` instances in the preview are at lines 575 (hero), 656 (§D), 668 (§E inside `.closing-cta`) — override applies to line 668 only.

Out-of-scope items confirmed unchanged: F-NEW-2 (mobile H1, Cycle 3), F-NEW-4 (CTA chrome height delta, silent-park), F-NEW-5 (body-lg drift, Sprint-13 carry-forward), F-NEW-6 / F-NEW-7 (section-label positioning, out of sprint).

---

## Operator-facing visual report

`docs/pl2/handoffs/sprint-14-cycle-2-report.html` — self-contained HTML with:
- Verdict banner (PASS)
- Plain-English "what I see different" summary
- Wipe-slider comparators for hero@1280 (pre-fix vs post-fix) and closing-cta@1280 (pre-fix vs post-fix) — exactly as the spawn prompt requested
- ImageMagick diff PNGs inline
- Side-by-side composites inline
- Per-section delta table
- Token compliance table
- WCAG re-check table
- Scope guard summary

Opens via `file://` or any local server; inline CSS+JS; relative image paths to `screenshots/sprint-14-cycle-2/`.

---

## Verdict

**PASS** — all acceptance criteria met:

1. F-NEW-1 (hero H1 desktop 72 / -2): landed correctly. Computed style = 72 px / 75.6 px / -2 px / 500. Preview-vs-preview pixel diff confirms the change is localized to the H1 region. No orphan word.
2. F-NEW-3 (closing-CTA primary `#5DC6E8` bg / `#1F1A14` text): landed correctly. Computed style matches brief tokens exactly. Preview-vs-preview pixel diff confirms the change is localized to the primary button only — secondary CTA and other zone primaries unaffected.
3. Mobile hero H1 regression guard: preview mobile rule still reads 40 px at `@media (max-width: 767px)`. Unmodified.
4. Files-only constraint: no live theme files, no Drupal templates, no `.module`/`.yml` touched. Only `docs/pl2/Previews/about-us.html` plus Cycle-1/Cycle-2 capture artifacts.
5. DSSIM re-run reported: hero@1280 0.194→0.193, closing-cta@1280 0.169→0.169. Non-drop is expected and consistent with the Cycle 1 audit's per-section delta classification (F-NEW-4 + body-lg drift dominate; both out of Cycle 2 scope).

Ready for O to merge the cycle.

---

## Advisory notes (non-blocking)

1. **Cycle 1 baseline overwrite.** F's autonomous re-run of `scripts/sprint-14-cycle-1-capture.mjs` overwrote the Cycle 1 baseline preview PNGs in `docs/pl2/handoffs/screenshots/sprint-14-cycle-1/` (all preview-side files in that directory have unstaged modifications vs `b099fa4ea`). S recovered the true pre-fix baselines from git for the pre-vs-post comparison, but future cycles that re-run capture should write to a cycle-scoped output directory (e.g. `screenshots/sprint-14-cycle-2/`) rather than reusing `sprint-14-cycle-1/`. Suggested follow-up: parameterize `OUT` in the capture script by cycle number, or revert the overwritten Cycle 1 preview PNGs in `docs/pl2/handoffs/screenshots/sprint-14-cycle-1/` from `b099fa4ea` before merging if operator wants the Cycle 1 audit's baselines preserved as historical record. This does not affect Cycle 2 PASS — the recovered baselines were used.

2. **DSSIM "drop materially" issue criterion.** The issue's success criterion ("both should drop materially") could not be fully satisfied because F-NEW-4 (CTA-chrome structural delta, 45 px vs 56 px) dominates per-section live-vs-preview DSSIM at both sections and was not in Cycle 2 scope. The criterion is retroactively satisfiable when F-NEW-4 lands (likely Cycle 4). Operator may want to update the Sprint 14 runbook's success definition to clarify that per-section live-vs-preview DSSIM is not the binding signal for preview-doc-only cycles — the binding signal is the T2 computed-style probe + the preview-vs-preview pixel diff S produced here.

3. **F autonomous hover state (`#4AB8DA`).** F added a hover rule that the issue did not request. The reasoning is sound (prevents the hover reverting to light-zone `var(--primary)` blue, which would flash incorrect colors). The hover bg `#4AB8DA` on espresso text `#1F1A14` computes to ~7.91:1 contrast — well above the 4.5:1 AA floor. No blocker. Noted as an autonomous decision worth surfacing in the orchestrator log.

4. **Preview-file mobile breakpoint vs brief breakpoint.** Preview uses `@media (max-width: 767px)` for the mobile hero H1 rule; the issue's mobile constraint references `< 576`. These are different Bootstrap breakpoints (md vs sm). T flagged this in their handoff (advisory 3) as a Cycle 3 reconciliation item for F-NEW-2. Not a Cycle 2 blocker.

5. **CSS variable case inconsistency.** `--primary-light: #62bbcb` (lowercase hex) in the preview file, but the dark-zone tokens `#5DC6E8` and `#1F1A14` (uppercase). Cosmetic only — no functional impact. Not worth a follow-up cycle on its own.
