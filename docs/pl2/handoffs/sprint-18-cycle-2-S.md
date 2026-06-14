# Handoff-S: Sprint 18 Cycle 2 — `/articles` preview-doc batch (scoped re-audit)

**Verdict:** **PASS**

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-18-cycle-2-preview-doc-batch`
**Mode:** autonomous · scoped re-audit (no Cycle-1 full-matrix re-run)
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-18-cycle-2-T.md` (zero blocking issues)
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-18-cycle-2-F.md`
**Cycle-1 audit:** `docs/pl2/handoffs/sprint-18-cycle-1-audit.md`
**Operator-facing report:** [`sprint-18-cycle-2-report.html`](sprint-18-cycle-2-report.html)
**Tooling:** Playwright 1.59.x Chromium @ DPR=2, reducedMotion=reduce; ImageMagick 7 `compare` (DSSIM / AE).

## Preconditions

| Precondition | Status |
|---|---|
| T reported zero blocking issues | PASS |
| Playwright at project | PASS |
| ImageMagick `compare` / `magick` on PATH | PASS |
| Live URL HTTP 200 | PASS |
| Preview file readable via `file://` | PASS |

## 1. Diff sanity

`git diff --name-only` against `main` reports only:
- `docs/pl2/Previews/articles.html` (preview-doc).

Untracked: `sprint-18-cycle-2-{F,T,issue}.md` handoff files. **No live theme files changed.** PASS.

## 2. Post-fix preview re-render — DOM/computed-style probes

Probes captured at 1280 and 375, output in
`docs/pl2/handoffs/screenshots/sprint-18-cycle-2/probes.json`.

| Fix | Probe | Expected | 1280 | 375 | Result |
|---|---|---|---|---|---|
| A | `.chip.is-active` bg | `rgb(0,90,160)` | `rgb(0,90,160)` | `rgb(0,90,160)` | PASS |
| A | `.pagination .is-current` bg | `rgb(0,90,160)` | `rgb(0,90,160)` | `rgb(0,90,160)` | PASS |
| B | `.article-card` border-color | `rgb(142,134,122)` | `rgb(142,134,122)` | `rgb(142,134,122)` | PASS |
| C | `.article-card h3 a` color | `rgb(31,26,20)` | `rgb(31,26,20)` | `rgb(31,26,20)` | PASS |
| D | Chip DOM order | All / Automated Testing / Cypress / Open source / Talks | matches | matches | PASS |
| E | Chip rendered height at 375 | ≥ 44 px | 34 px (desktop MQ) | **46 px** | PASS |
| F | Skip-link `href` | `#main-content` | `#main-content` | `#main-content` | PASS |
| F | Skip-link target | `<a id="main-content" tabindex="-1">` in `<main>` | tag=A, tabindex=-1 | tag=A, tabindex=-1 | PASS |
| F | `<main>` has no `id` | `null` | `null` | `null` | PASS |
| — | H1 count | 1 | 1 | 1 | PASS |
| — | Horizontal scroll | none | `scrollWidth == clientWidth` | same | PASS |

Visual spot-check of the chip strip crop at 1280 confirms the "All" pill is now the deep
blue `#005AA0` (was teal) and the last two chips are in order **Open source / Talks**
(was Talks / Open source). Live capture at 1280 with the same crop shows identical
appearance for the chip strip — fixes A + D are live-congruent.

## 3. Scoped DSSIM — post-fix preview vs Cycle-1 preview

Per-section diffs at 1280 and 375. Section bounding boxes come from
Cycle-1 `measurements.json` (preview side); crop anchors are the preview's own
section tops, so AE/DSSIM measure the chrome delta between Cycle-1 preview and
post-fix preview directly.

### 1280

| Section | AE | DSSIM (norm) | Interpretation |
|---|---|---|---|
| page-title    | 0       | 0.0000 | MATCH (untouched) |
| articles-view | 155,540 | 0.0049 | scoped non-zero (chip is-active color + chip order) |
| grid          | 139,195 | 0.0051 | scoped non-zero (card border + H3 color) |
| pagination    | 5,094   | 0.0039 | scoped non-zero (current-page color) |
| footer        | 0       | 0.0000 | MATCH (untouched) |
| whole-page    | 155,540 | 0.0035 | scoped non-zero, contained to chip/card/pagination |

### 375

| Section | AE | DSSIM (norm) | Interpretation |
|---|---|---|---|
| page-title    | 0       | 0.0000 | MATCH (untouched) |
| articles-view | 715,608 | 0.0930 | chip color/order + chip-row pad-bump shifts content below by +12 px |
| grid          | 667,810 | 0.0958 | positional drift from chip-pad bump + border/H3 chrome |
| pagination    | 9,018   | 0.0833 | positional drift + current-page color |
| footer        | 97,225  | 0.0917 | positional drift only (footer chrome unchanged) |
| whole-page    | 812,833 | 0.0827 | scoped non-zero, all attributable to F-NEW-18-E padding bump cascade |

At 375 the chip-strip padding bump (Fix E) lifts every chip-row by 6 px each, plus chip-row-height
adds ~12 px to the toolbar block; everything below shifts by ~12 px (one wrapped chip row in
practice). DSSIM correctly registers this as structural drift. **None of the deltas come from
unintended chrome changes** — all are downstream of Fix E. Verified by spot-checking the diff
PNGs (`*-prev-pre-vs-post-diff-20260513.png`).

## 4. Live (Cycle 1) vs post-fix preview @ 1280

| Comparison | AE | DSSIM (norm) | Δ |
|---|---|---|---|
| Cycle 1: live vs preview (pre-fix)  | 7.35 M | 0.502 | baseline |
| Cycle 2: live vs preview (post-fix) | 7.34 M | **0.205** | **−59% DSSIM** |

AE is dominated by PC-13 article-content drift (different lead article on live vs preview); AE
near-equality is expected. DSSIM, the binding metric for this carve, drops materially.
**Chip + card + pagination chrome now visually closer to live**, as required.

## 5. Sprint 9 a11y fix — live re-verification

Live DOM probed at 1280:

| Text | Classes | Status |
|---|---|---|
| Main navigation | `visually-hidden h3 menu-block__title` | in-flow |
| Breadcrumb | `visually-hidden` | in-flow |
| **Articles** | `visually-hidden` | **in-flow — Sprint 9 fix intact** |
| Footer | `visually-hidden h3 menu-block__title` | in-flow |

Cycle 2 touched no live theme files; this is a sanity re-check. PASS.

## 6. Out-of-scope items — re-confirmed

| Item | Status |
|---|---|
| F-NEW-18-G — H1 rect-height delta (live 50 / preview 59 at 1280) | Cosmetic; same font-size + line-height on both. Accepted, not flagged. |
| PC-13 — views-listing card-content fluctuation | Acknowledged; not a fix candidate. |
| F-NEW-16-H — footer column heading H3 vs H4 sitewide | Sitewide carry; out of /articles scope. |

No out-of-scope regression introduced by Cycle 2.

## Verdict

**PASS** — all six fixes (A–F) verified via DOM probe at 1280 + 375 and visually
confirmed in the chip-strip / card-section wipe-slider comparators. Per-section
DSSIM is scoped to the intended surfaces (chip strip / card chrome / pagination)
with zero delta on page-title and footer chrome at 1280. Live-vs-preview-post-fix
DSSIM at 1280 drops 59 % vs the Cycle 1 baseline. Sprint 9 visually-hidden
`<h2>Articles</h2>` on live remains intact. No out-of-scope regression.

Ready for O to commit.

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/articles.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-18-cycle-2-F.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-18-cycle-2-T.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-18-cycle-1-audit.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-18-cycle-2-report.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-18-cycle-2/`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-18-cycle-2-capture.mjs`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-18-cycle-2-probe.mjs`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-18-cycle-2-diff.mjs`
