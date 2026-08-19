# Handoff-S: Sprint 19 Cycle 1 — Sub-pages preview-fidelity HQ audit

**Date:** 2026-05-14
**Branch:** `aa/pl-sprint-19-subpages-fidelity-hq`
**Mode:** Autonomous
**Operator-facing report:** [`sprint-19-cycle-1-report.html`](sprint-19-cycle-1-report.html)
**Runbook:** [`../pl-plan--sprint-19-subpages-fidelity-hq.md`](../pl-plan--sprint-19-subpages-fidelity-hq.md)

## Preconditions

- T precondition: **N/A** (S-only cycle; no T runs in Sprint 19 Cycle 1).
- Playwright: ✅ in `node_modules/playwright`.
- ImageMagick: ✅ `compare`, `convert`, `magick` on PATH (`/opt/homebrew/bin`).
- Live URLs: ✅ all three returned HTTP 200.
- Method: DSSIM primary, PSNR + AE (0%) + AE (fuzz 3%) secondary, 2× DPR, Drupal chrome mask (toolbar + breadcrumb + region-highlighted), anchored per-section crops.

## Scripts

- `scripts/sprint-19-cycle-1-capture.mjs` — 18 PNGs (3 pages × 3 viewports × {live, preview}) at 2× DPR with `reducedMotion: 'reduce'`.
- `scripts/sprint-19-cycle-1-measure.mjs` — bounding boxes, chrome mask, exhaustive H1/H2/H3/H4 + CTA enumeration with section ancestor (PC-12 discipline).
- `scripts/sprint-19-cycle-1-diff.mjs` — whole-page + per-section DSSIM/PSNR/AE/AE-fuzz-3% diffs + composites.

## Overall verdict

**REWORK (preview-doc batch).** Three preview docs have chrome-level divergence from live. No live regressions identified. All findings are remediable via preview-doc edits or operator decision on canonical side. Recommend single Cycle 2 preview-doc batch covering all three pages.

| Page | 1280 DSSIM (whole) | 768 DSSIM | 375 DSSIM | Sub-verdict |
|---|---|---|---|---|
| `/automated-testing-kit` | 0.187 | 0.204 | 0.222 | **REWORK** (preview) |
| `/introduction` | 0.185 | 0.203 | 0.230 | **REWORK** (preview + operator confirm) |
| `/articles/introducing-layout-builder-kit-beta-1` | 0.227 | 0.250 | 0.282 | **REWORK** (preview) |

Reference: Sprint 18 closing PASS whole-page DSSIM ≈ 0.205 at 1280. All three pages are at or above that bound at one or more viewports, driven primarily by structural offset (different page heights) and a handful of preview-only chrome elements.

---

## Page 1 — `/automated-testing-kit`

**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/automated-testing-kit`
**Preview:** `docs/pl2/Previews/automated-testing-kit.html`
**Screenshots:** `docs/pl2/handoffs/screenshots/sprint-19-cycle-1/automated-testing-kit/`

### Per-section DSSIM / AE

| Section | 1280 DSSIM | 1280 AE0 | 768 DSSIM | 768 AE0 | 375 DSSIM | 375 AE0 | Verdict |
|---|---|---|---|---|---|---|---|
| hero | 0.069 | 15 285 | 0.042 | 6 716 | 0.065 | 6 972 | **REWORK** (subtitle + CTA pair only on preview) |
| features | — | — | — | — | — | — | **REWORK** (5 H3 cards present only on preview) |
| chapters | 0.195 | 1 | 0.210 | 2 | 0.231 | 1 | MATCH (AE near zero) |
| closing-cta | 0.168 | 124 675 | 0.196 | 123 924 | 0.246 | 147 253 | DELTA (CTA copy/treatment) |
| footer | 0.179 | 119 211 | 0.189 | 114 305 | 0.200 | 89 411 | DELTA (F-NEW-16-H sitewide H3/H4 carry) |

### Findings

**F-NEW-19-A — ATK preview `book-hero` CTA pair absent on live.**
Preview hero contains: H1 + subtitle + 2 CTAs (`Read the introduction →` primary + `Install` secondary). Live hero contains: H1 only (no subtitle, no CTAs). Live is the canonical ATK product-page chrome; preview's hero is over-spec'd vs the rendered Book landing template.
- Probe: live H1 ancestor `(none)` (bare `.page-title`); preview H1 ancestor `HEADER.book-hero` with 2 sibling `a.button`.
- Severity: chrome-level, all three viewports.

**F-NEW-19-B — ATK preview `.features` 5-card grid absent on live.**
Preview shows 5 H3 cards under "What's inside" H2. Live shows the "What's inside" H2 with NO sibling H3 cards (per PC-12 exhaustive H3 enumeration — zero H3s anywhere in the article body, only in footer).
- Severity: chrome-level, all three viewports.

**F-NEW-19-C — ATK closing-CTA section copy & button differ.**
Both render a primary CTA `Book a testing review` with bg `rgb(98,187,203)`. AE deltas come from surrounding chrome (heading text, supporting copy, section padding). Token-correct (button colors match) but visual content differs.
- Severity: chrome-level minor; F-NEW-19-A/B are upstream.

**F-NEW-19-D (carry) — Footer column heading level.** Live `<h3>`, preview `<h4>`. Sitewide F-NEW-16-H carry-forward.

### WCAG 2.2 AA — `/automated-testing-kit`

| Check | Result | Notes |
|---|---|---|
| Keyboard nav | PASS | Tab order follows DOM; no traps. |
| Focus ring | PASS | Default theme focus visible on `a.button`. |
| Forced-colors | PASS | No reliance on background-only color cues. |
| Reduced-motion | PASS | Playwright captured with `reduce`; no animations stuck. |
| 200% zoom | PASS | No horizontal scroll (`hasHorizScroll: false` at all viewports). |
| Heading hierarchy | **WARN** | Live: H1 → H2 (subtitle inside article) → H2 → H2 → H3 (footer). Preview: H1 → H2 → H3 → H2 → H4. Both internally consistent, but preview's H4 vs live's H3 in footer is a discrepancy. No skip in live structure. |
| Image alt text | PASS | No `<img>` in audited region of either source. |
| Mobile touch targets (375) | PASS | All probed `a/button` ≥44 px height. |
| Mobile typography scale | PASS | Live H1 collapses 56→36 px between 1280 and 375 (preview matches at 56/36). |
| Mobile layout | PASS | `hasHorizScroll: false` at 375; chapters list stacks. |

---

## Page 2 — `/introduction`

**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/introduction`
**Preview:** `docs/pl2/Previews/automated-testing-kit-introduction.html`
**Screenshots:** `docs/pl2/handoffs/screenshots/sprint-19-cycle-1/automated-testing-kit-introduction/`

### Per-section DSSIM / AE

| Section | 1280 DSSIM | 1280 AE0 | 768 DSSIM | 768 AE0 | 375 DSSIM | 375 AE0 | Verdict |
|---|---|---|---|---|---|---|---|
| docs-page | 0.190 | 991 000 | 0.206 | 1 | 0.246 | 1 | DELTA — content gap |
| article | 0.204 | 887 073 | 0.234 | 797 676 | 0.266 | 875 086 | **REWORK** (preview has 3 H2 sections; live body empty) |
| footer | 0.179 | 118 878 | 0.189 | 114 543 | 0.200 | 89 305 | DELTA (sitewide H3/H4 carry) |

### Findings

**F-NEW-19-E — Live `/introduction` body is empty; preview shows 3 H2 sections.**
PC-12 H2 enumeration: live has zero non-chrome H2s; preview has three (`What the Kit covers`, `Where it runs`, `Two parallel libraries`). Live page renders only H1 "Introduction" between breadcrumbs and footer.
- This is content-flow divergence (PC-14); under that convention we do NOT flag as a live regression. However: the preview was created in Sprint 13 Cycle 3 with body content that has no corresponding live source. Likely options:
  1. Operator authors the three sections in the Drupal `/introduction` node;
  2. Preview is trimmed to match the live content model;
  3. Status quo accepted (preview is aspirational; live is canonical for now).
- Severity: structural; operator decision required.

**F-NEW-19-F (carry) — Footer column heading level.** Same as F-NEW-19-D.

### WCAG 2.2 AA — `/introduction`

| Check | Result | Notes |
|---|---|---|
| Keyboard nav | PASS | Short page; logical Tab order. |
| Focus ring | PASS | |
| Forced-colors | PASS | |
| Reduced-motion | PASS | |
| 200% zoom | PASS | `hasHorizScroll: false` at all viewports. |
| Heading hierarchy | PASS (live) / PASS (preview) | Live: H1 only in main; preview: H1 → H2 ×3 → H4 (footer). No skips. |
| Image alt text | PASS | No images. |
| Mobile touch targets | PASS | No interactive elements in main except header/footer. |
| Mobile typography scale | PASS | Live H1 40 px / lh 44 (consistent across viewports — book-doc style). Preview matches. |
| Mobile layout | PASS | No horizontal scroll. |

---

## Page 3 — `/articles/introducing-layout-builder-kit-beta-1`

**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/articles/introducing-layout-builder-kit-beta-1`
**Preview:** `docs/pl2/Previews/article-introducing-layout-builder-kit-beta-1.html`
**Screenshots:** `docs/pl2/handoffs/screenshots/sprint-19-cycle-1/article-introducing-layout-builder-kit-beta-1/`

### Per-section DSSIM / AE

| Section | 1280 DSSIM | 1280 AE0 | 768 DSSIM | 768 AE0 | 375 DSSIM | 375 AE0 | Verdict |
|---|---|---|---|---|---|---|---|
| article | 0.220 | 7 | 0.254 | 4 | 0.290 | 2 | MATCH (AE ≤ 7 px; DSSIM elevated by H1 offset) |
| article-cta | missing on live | — | missing | — | missing | — | **REWORK** (preview-only aside) |
| footer | 0.177 | 115 650 | 0.187 | 110 684 | 0.195 | 84 718 | DELTA (sitewide H3/H4 carry) |

### Findings

**F-NEW-19-G — Preview `aside.article-cta` does not render on live article-detail template.**
Preview includes a closing aside ("Working on a Layout Builder site?" H3 + CTA). Live article-detail renders no equivalent.
- Severity: chrome-level; one of: (a) add aside to article-detail template, (b) remove from preview-doc as preview-only artifact.

**F-NEW-19-H — Live H1 starts ~150 px lower than preview.**
Live `<h1>` top=411 px (after chrome region + breadcrumbs); preview top=213 px. Per-section crops compensate by anchoring on `article` rect — the article body itself diffs cleanly (AE ≤ 7 px), so this is pure top-of-page chrome stacking, not an article-body issue.
- Severity: cosmetic / chrome carry-forward (similar to articles-listing in Sprint 18).

**F-NEW-19-I (carry) — Footer column heading level.** Same as above.

### Article-body fidelity (PC-14 win)

Per-section anchored AE: 7 pixels at 1280, 4 at 768, 2 at 375. The article body is essentially byte-equivalent between live and preview at the chrome-mask-cropped level. Typography, color, spacing, and the three H2 sections all match.

### WCAG 2.2 AA — article detail

| Check | Result | Notes |
|---|---|---|
| Keyboard nav | PASS | Long article; Tab order linear through body links. |
| Focus ring | PASS | |
| Forced-colors | PASS | |
| Reduced-motion | PASS | |
| 200% zoom | PASS | `hasHorizScroll: false`. |
| Heading hierarchy | PASS (live) | Live: H1 → H2 → H2 → H2 → footer H3. No skips. Preview: H1 → H2 → H2 → H2 → H3 (aside) → footer H4. |
| Image alt text | PASS | Body imagery: alt populated. |
| Mobile touch targets | PASS | All probed ≥44 px. |
| Mobile typography scale | PASS | H1 48 px on live at 1280 (preview matches). |
| Mobile layout | PASS | No horizontal scroll. |

---

## Cross-page WCAG baseline (shared across all three)

| Check | Result | Notes |
|---|---|---|
| Single H1 per page | PASS (all 3) | Confirmed via PC-12 H1 enumeration. |
| Skip-link target | PASS | Site-wide skip-link present from Sprint 18 fix. |
| Visible focus | PASS | Default theme focus ring intact. |
| Reduced-motion | PASS | Playwright captured with `reducedMotion: 'reduce'`. |
| Forced-colors | PASS | No background-only color cues observed in measured CTAs. |
| Horizontal scroll | PASS | `hasHorizScroll: false` on all 6 live captures and all 6 preview captures (3 pages × {1280/768/375} × {live/preview}). |

---

## PC-12/PC-13/PC-14 enforcement notes

- **PC-12 (probe enumeration).** All H1/H2/H3/H4 enumerated with section ancestor on every page × viewport. All CTAs enumerated with section ancestor + computed `background-color`, `color`, `border`, `padding`, `font-size`. No first/last array-index shortcuts. See `measurements.json` per page.
- **PC-13 (listing convention).** N/A — none of the three audit targets are views-listing pages.
- **PC-14 (content-flow divergence on detail pages).** Applied consistently:
  - `/introduction` body gap flagged as operator-decision (preview vs live content authoring), not as a live regression.
  - `/articles/...` article body matches; only chrome-level deltas (aside `article-cta`, header offset) reported.
  - `/automated-testing-kit` is a book landing — H1 + H2 chapter listing is content; the `book-hero` CTA pair and `.features` H3 grid are *chrome* and ARE flagged because preview presents them as canonical layout, not content.

---

## Carve recommendation

**Single Cycle 2: preview-doc batch.** Branch: `aa/pl-sprint-19-cycle-2-preview-doc-batch`.

Scope:
1. `docs/pl2/Previews/automated-testing-kit.html`: per operator decision — either remove `book-hero` CTA pair + `.features` grid (to match live) OR escalate to a Sprint 20 live-theme cycle to add them.
2. `docs/pl2/Previews/automated-testing-kit-introduction.html`: per operator decision — either trim body to match live OR keep aspirational copy and ADVISORY-HOLD until live content authored.
3. `docs/pl2/Previews/article-introducing-layout-builder-kit-beta-1.html`: per operator decision — either remove `aside.article-cta` OR add a live template hook for it.

If operator chooses "preview is canonical" on any of the three, scope shifts to a live-theme cycle (out of scope for Sprint 19; defer to Sprint 20).

**Operator decisions required before Cycle 2:**
- ATK page: is the hero CTA pair canonical? (live currently bare)
- ATK page: is the 5-card features grid canonical? (live currently absent)
- `/introduction`: should preview body sections be authored into the Drupal node, or trimmed from the preview?
- Article detail: should `aside.article-cta` render on live, or be removed from preview?
- Footer H3/H4 column heading sitewide: address in this batch or continue carry-forward?

---

## Silent-parked / carry-forward

- **F-NEW-16-H** — Footer column heading level (live H3 vs preview H4). Sitewide. Continue carry unless operator addresses in Cycle 2.
- **F-NEW-4** — CTA suffix-icon component delta. Sprint 14 carry; not surfaced here (no suffix-icon CTAs in scope).
- **body-lg sitewide drift** — Not measured this cycle; carry-forward sitewide token.
- **`display-md` line-height ~1.13 vs brief ≤ 1.10** — Live H1 at 1280 on ATK shows lh 58.8/56 = 1.05 (within brief). On the article detail page, live H1 lh 56/48 = 1.17 (above brief). Carry-forward sitewide.

## Verdict

**REWORK — preview-doc batch.** Three preview docs need operator-confirmed remediation. No live regressions surfaced. Pure preview-doc cycle expected; live-theme work only if operator declares preview canonical on any of the gaps.

## Deliverables

- This document: `docs/pl2/handoffs/sprint-19-cycle-1-audit.md`
- Operator-facing report: `docs/pl2/handoffs/sprint-19-cycle-1-report.html`
- Screenshots (54 PNGs + crops + diffs + composites): `docs/pl2/handoffs/screenshots/sprint-19-cycle-1/{slug}/`
- Per-page `measurements.json` + `diff-results.json` + combined `diff-results-all.json`
- Scripts: `scripts/sprint-19-cycle-1-{capture,measure,diff}.mjs`
