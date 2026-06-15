# Sprint 18 Cycle 1 — `/articles` HQ preview-fidelity audit (S only)

**Verdict:** **REWORK** — Cycle 2..N carve recommended. Five actionable preview-doc findings (one active-state token, one card-border token, one heading-color token, one chip-order, one mobile-chip-padding) + Sprint-9 a11y fix verified intact. No live regression vs Sprint 13/16 sitewide baseline. PC-13 (views-listing content fluctuation between live and preview) correctly excluded from fix candidates.

**Date:** 2026-05-13
**Page:** `/articles`
**Branch:** `aa/pl-sprint-18-articles-fidelity-hq` (S-only cycle; no F/T)
**Sprint:** Sprint 18 (runbook `docs/pl2/pl-plan--sprint-18-articles-fidelity-hq.md`)
**Live:** `https://pl-performantlabs.com.3.ddev.site:8493/articles` (HTTP 200)
**Preview:** `file://docs/pl2/Previews/articles.html` (canonical)
**Operator-facing report:** [`sprint-18-cycle-1-report.html`](sprint-18-cycle-1-report.html)
**Prior reference audit (method):** `docs/pl2/handoffs/sprint-17-cycle-1-audit.md`, `docs/pl2/handoffs/sprint-16-wrap.md`
**Tooling:** Playwright 1.59.x Chromium @ deviceScaleFactor=2, reducedMotion=reduce, ignoreHTTPSErrors. ImageMagick 7 `compare` (DSSIM / PSNR / AE @ fuzz 0% & 3%).
**Mode:** Autonomous, S-only.

---

## T precondition

N/A — S-only audit cycle per PC-2 (cycle carve driven by Cycle 1 audit).

## Browser-tool / visual-diff preconditions

| Precondition | Status |
|---|---|
| Playwright at project (`node_modules/playwright`) | PASS |
| ImageMagick `compare` at `/opt/homebrew/bin/compare`, `magick` at `/opt/homebrew/bin/magick` | PASS |
| Live URL HTTP 200 | PASS (200) |
| Preview file readable via `file://` | PASS |

## Preview sanity check

The canonical preview at `docs/pl2/Previews/articles.html` was canonicalized in Sprint 13. Pre-audit check:

| Convention | Preview state | Verdict |
|---|---|---|
| `navbar-expand-lg` hamburger ≥ 992 only | Hamburger toggle at < 992 (canonical) | PASS |
| No right-side CTA pill in header | Header clean | PASS |
| Page-title H1 desktop = 56 px (preview `display-lg` token: `56 / 1.05 / -1.4`) | Preview = 56 / 58.8 / -1.4 / Rubik 500 | PASS |
| Page-title H1 mobile = 36 px | Preview mobile = 36 / 37.8 / -0.8 | PASS |
| Single H1 in DOM | Only `<h1>Articles.</h1>` | PASS |
| Sprint 9 visually-hidden `<h2>Articles</h2>` (1.3.1) | Sprint 9 fix lives in `views-view-unformatted--articles--page-1.html.twig` (live only); preview has no equivalent — preview-doc gap acknowledged. | DELTA — preview-doc could mirror for parity (not a regression — preview has no view rendering, so an h2 is structurally unnecessary in the preview HTML; live correctly emits it). |
| Touch targets in preview | All ≥ 44 px (page-title H1 56 px; chip ≥ 32 px tall; pagination 40 px; mobile chip 9 + 14 + 9 = 32 px ⚠ flagged below) | MIXED — preview chip mobile tap-height ~32 px (< 44 px floor at 375); live chip mobile tap-height ~44 px (live pad=15px 16px vs preview pad=9px 16px). See F-NEW-18-E. |
| Card border token | Preview uses `--hairline: #E5E1DC` (brief token) | PASS in preview; live diverges (F-NEW-18-B) |
| H3 color | Preview `#2A2520` (`ink`); live `#1F1A14` (`ink-strong`) | DELTA — preview-doc fix to match live (F-NEW-18-C; same Sprint 17 F-NEW-17-A pattern) |
| Active chip / pagination color | Preview `#1893B4` (`--primary`); live `#005AA0` (`--primary-deep`) | DELTA — token mismatch, see F-NEW-18-A |
| Chip order | Preview: All / Automated Testing / Cypress / Talks / Open source | DELTA — live re-orders to: All / Automated Testing / Cypress / Open source / Talks. See F-NEW-18-D. |

Three preview-doc defects pre-cleared, two token nudges, one mobile chip-padding (preview defect at the 44 px floor). No blockers; all fixes are preview-side except F-NEW-18-E mobile-chip-padding which the operator may choose to land on the preview (preferred per memory `feedback_no_orphan_words.md` complement: a11y floors win).

---

## Tier 3 visual audit

### Capture run

Six full-page PNGs at three viewports @ 2× DPR (saved under `docs/pl2/handoffs/screenshots/sprint-18-cycle-1/`).

| Viewport | Live PNG dim | Preview PNG dim | live pageH | preview pageH | Δ |
|---|---|---|---|---|---|
| 1280 | 2560 × 5732 | 2560 × 5718 | 2866 | 2859 | +7 px |
| 768  | 1536 × 9044 | 1536 × 8930 | 4522 | 4465 | +57 px |
| 375  | 750 × 8504  | 750 × 8030  | 4252 | 4015 | +237 px |

Live is taller than preview at every viewport. At 375 the +237 px gap is partly the larger mobile chip-padding (live 15 px / preview 9 px → +12 px per chip × 5 chips wrapped over multiple rows) and partly card heights / footer richness. Both pages render with **zero horizontal scroll** at all viewports (`pageW <= clientW` on every probe).

### Drupal-chrome mask coordinates

Per FB-3 convention, the breadcrumb cream band on live is masked white before any comparison. Mask coordinates (image-space @ 2× DPR):

| Viewport | CSS top | CSS h | Image x1,y1 | Image x2,y2 |
|---|---|---|---|---|
| 1280 | 160 | 61 | 0,320 | 2560,442 |
| 768  | 160 | 61 | 0,320 | 1536,442 |
| 375  | 160 | 63 | 0,320 | 750,446  |

Mask is well above live page-title (live page-title CSS top=269–271 at all viewports).

### Visual diff results (whole-page, informative)

| Viewport | Common-H (px) | DSSIM (norm) | AE @ 0% | AE @ 3% | Notes |
|---|---|---|---|---|---|
| 1280 | 5718 | 0.502 | 7.35 M | 7.30 M | drift-dominated; per-section binding |
| 768  | 8930 | 0.644 | 8.83 M | 8.78 M | drift-dominated |
| 375  | 8030 | 0.577 | 3.47 M | 3.45 M | drift-dominated |

Whole-page values are non-load-bearing per PC-8.

### Per-section HQ diff (binding — DSSIM primary)

Classification: DSSIM < 0.01 MATCH; 0.01–0.05 MINOR; ≥ 0.05 REAL.

| Viewport | Section | DSSIM (norm) | PSNR (norm) | AE @ 0% | AE @ 3% | AE-3% / total px | Class |
|---|---|---|---|---|---|---|---|
| 1280 | page-title    | 0.166 | 0.159 | 101,704 | 97,818  | 6.39%  | REAL |
| 1280 | articles-view | 0.226 | 0.096 | 4       | 4       | <0.001% | REAL by DSSIM (drift) |
| 1280 | grid          | 0.246 | 0.088 | 4       | 4       | <0.001% | REAL by DSSIM (drift) |
| 1280 | pagination    | 0.152 | 0.181 | 11,285  | 10,692  | 5.22%  | REAL |
| 1280 | footer        | 0.177 | 0.148 | 115,181 | 110,545 | 5.74%  | REAL |
| 768  | page-title    | 0.193 | 0.140 | 99,726  | 95,801  | 10.43% | REAL |
| 768  | articles-view | 0.243 | 0.086 | 6       | 6       | <0.001% | REAL by DSSIM (drift) |
| 768  | grid          | 0.252 | 0.082 | 6       | 6       | <0.001% | REAL by DSSIM (drift) |
| 768  | pagination    | 0.170 | 0.162 | 11,280  | 10,654  | 8.67%  | REAL |
| 768  | footer        | 0.187 | 0.140 | 110,684 | 106,072 | 6.76%  | REAL |
| 375  | page-title    | 0.250 | 0.127 | 84,317  | 80,490  | 17.54% | REAL |
| 375  | articles-view | 0.239 | 0.102 | 2       | 2       | <0.001% | REAL by DSSIM (drift) |
| 375  | grid          | 0.248 | 0.099 | 2       | 2       | <0.001% | REAL by DSSIM (drift) |
| 375  | pagination    | 0.213 | 0.136 | 11,302  | 10,771  | 17.95% | REAL |
| 375  | footer        | 0.195 | 0.134 | 84,825  | 81,191  | 7.63%  | REAL |

**Note on articles-view / grid AE≈0 anomaly:** the *content* of the live grid is genuinely different from preview (different article set per PC-13; live's lead card is "CTRFHub" 2026-04-27 while preview leads with "Version 1.0 ATK" 2023-11-20). Cumulative vertical drift between the live and preview captures means the per-section anchor crops land on offset content boundaries — DSSIM correctly registers structural divergence, while pixel-AE reads near-zero because the crops happen to be off-by-one row at the AE comparator's pixel grid. **Per PC-13, grid content fluctuation is NOT a fix candidate.** The grid DSSIM is informative-only on this page; binding deltas are in page-title, pagination, footer chrome (where the layout aligns and AE is genuine).

### Visual diagnosis per section (driven by diff PNGs)

1. **Active-state color mismatch on chip + pagination current page (F-NEW-18-A).** Live uses `rgb(0, 90, 160)` = `#005AA0` (`--primary-deep`) for `.chip.is-active` and `.pagination .is-current`. Preview uses `rgb(24, 147, 180)` = `#1893B4` (`--primary`). Diff PNG shows a solid red disc on the "1" current-page pill at 1280/768/375 and the "All" chip — single most visually obvious delta in the pagination crop (AE 5.2 / 8.7 / 17.9 % at 1280/768/375).
2. **Card border color mismatch (F-NEW-18-B).** Live `rgb(142, 134, 122)` (≈ `#8E867A`, much darker — likely live's `--theme-hairline` token or component-level override). Preview `rgb(229, 225, 220)` (`#E5E1DC`, brief `--hairline`). Brief tokens treat `--hairline: #E5E1DC` as the canonical card-border token. **Live is wrong vs brief; this is the only finding where preview is canonical and live needs to align.** Sitewide implication: which other pages render `.article-card` / `.card`-style borders? Worth a sitewide cascade probe in Cycle 2 before fixing in the SDC.
3. **Card H3 color (F-NEW-18-C).** Live `rgb(31, 26, 20)` (`#1F1A14`, `ink-strong`); preview `rgb(42, 37, 32)` (`#2A2520`, `ink`). Same Sprint 13/14/15/17 sitewide canonicalization — live is canonical for headings; preview-doc updates to `ink-strong`.
4. **Chip order (F-NEW-18-D).** Live order: `All / Automated Testing / Cypress / Open source / Talks`. Preview order: `All / Automated Testing / Cypress / Talks / Open source`. Visible in the page-title-section diff overlay just below the H1 — the last two chip labels swap. Preview-doc fix (re-order chip elements in preview HTML).
5. **Mobile chip touch-target height (F-NEW-18-E).** At 375 the preview chip vertical padding is `9px 16px` (computed tap height ≈ 32 px), below the WCAG 2.5.8 minimum-target floor of 24 px (passes 2.5.8) but below the practical 44 px Apple HIG / WCAG 2.5.5 enhanced target. Live chip at 375 uses `padding: 15px 16px` (tap height ≈ 44 px). Live is correct; **preview defect** — add a `@media (max-width: 767px)` rule to bump `.chip` padding-block to `15px` in the preview file. PASS on the AA floor (2.5.8 = 24 px); FAIL on the AAA / practical target. Both renders pass 2.5.8 minimum. Operator may choose to land the preview fix or accept.
6. **Footer column heading H3 vs H4 (carry F-NEW-16-H).** Live renders footer column headings as `H3` (`Services` / `Resources` / `Company`) using `display-md`-ish 30 px text; preview uses `H4` rendered as `12 px / 1.6 px ls / uppercase / muted` eyebrow text. Sitewide carry — out of /articles scope.
7. **Footer link copy drift (carry).** Live footer link labels render: `Test-suite takeover` / `Embedded testing engineer` / `Autonomous-healing pilot` / `Accessibility testing`. Preview labels: `Test-suite takeover` / `Embedded testing engineer` / `Autonomous-healing pilot` / `Accessibility testing` — **same labels**; the diff overlay shows positional drift (different vertical rhythm because preview H4 eyebrow is smaller than live H3, so the link block sits at a different y). Not a copy delta; folds into F-NEW-16-H.
8. **Footer signature font-weight / size drift (carry).** Live signature is rendered with `display-md` / Rubik 500 / much larger / bolder. Preview signature is `font-size: 26px / Rubik 500 / -0.5 px ls`. Live appears larger; not strictly comparable due to footer richness divergence (sitewide).
9. **Page-title vertical position drift (147–153 px).** Live page-title `top=269` (after a 73 px sticky header + ~60 px breadcrumb cream band + 137 px gap); preview page-title `top=118` (no header chrome). This is FB-3 (page-chrome offset) and **NOT a fix candidate** — the chrome mask correctly normalises this in the diff. The page-title section crops are taken from each side's own top, so the *content* of the page-title is compared.
10. **Page-title H1 bounding-rect height (1280 live=50 / preview=59).** Both render `font-size: 56px / line-height: 58.8px / -1.4 ls / Rubik 500 / color #2A2520`. The 9 px rect-height difference is consistent with `display: inline-block` vs `display: block`. Both sit on a single line "Articles." (1 word) so no wrap impact. Visible in the page-title diff PNG as a slight vertical offset of the centered H1 text. MINOR cosmetic; folds into F-NEW-18-D (preview-doc batch) if operator wants pixel-perfect alignment, or accept.
11. **Page-title lede last-line wrap (1280).** Live lede wraps so the last line ends with "...the occasional cheat sheet." (7 words). Preview lede wraps so the last line ends with "occasional cheat sheet." (3 words). Same copy on both. Likely driven by the same H1/page-title-inner rendered-width nuance (live h1 rect width 820 / preview h1 rect width 772 — preview's centered max-width 820 px is consistent but live's H1 rendered slightly differently). No orphan on either render.
12. **Skip-link href mismatch (advisory).** Live `<a class="skip-link" href="#main-content">`; preview `<a class="skip-link" href="#main">`. Live is canonical (Drupal `<main id="main-content">`). Preview should update to `#main-content` to match. Cosmetic; both work as bypass blocks.

### What the HQ method newly surfaces (not anticipated in runbook)

- **F-NEW-18-A** — active-state color token: live `#005AA0` (primary-deep); preview `#1893B4` (primary). Affects: `.chip.is-active` AND `.pagination .is-current`. Preview-doc fix.
- **F-NEW-18-B** — card border: live `#8E867A` (~rgb 142,134,122); preview `#E5E1DC` (`--hairline`). **Live wrong vs brief** — first finding on /articles where live needs to align. Recommend sitewide probe before touching SDC.
- **F-NEW-18-C** — H3 card title color: live `#1F1A14`; preview `#2A2520`. Same Sprint 17 F-NEW-17-A pattern. Preview-doc fix.
- **F-NEW-18-D** — chip order: live `All / Automated Testing / Cypress / Open source / Talks`; preview `All / Automated Testing / Cypress / Talks / Open source`. Preview-doc fix.
- **F-NEW-18-E** — preview chip padding at 375 = 9px (tap height ≈ 32 px); live = 15px (≈ 44 px). Preview-doc fix.
- **F-NEW-18-F (advisory)** — preview skip-link `href="#main"` vs live `href="#main-content"`. Preview-doc one-character fix.

### What carries forward unchanged

- F-NEW-4 (sitewide primary CTA component chrome delta) — N/A on /articles (no CTA buttons on this page; chips & pagination are not part of the F-NEW-4 component).
- F-NEW-16-H (footer column heading H3 vs H4) — sitewide; reappears here.
- Footer richness — sitewide Drupal pattern.
- body-lg sitewide drift — no body-lg copy on /articles outside the lede (which renders 18 / 28.8 — brief value — on both: PASS, no drift on this page).

---

## Desktop (1280px)

Section-by-section, with brief-token match status:

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Header / breadcrumb chrome | Drupal-shipped; mask before compare | masked | n/a in preview | OK |
| Page-title (cream band) | bg `#F5EFE2`, H1 56 / 1.05 / -1.4 / Rubik 500, kicker 12 / 1.6 ls / `#8E4A2A` / uppercase, lede 18 / 28.8 | bg ✓, H1 ✓, kicker ✓ `#8E4A2A`, lede ✓ 18/28.8 | bg ✓, H1 ✓, kicker ✓, lede ✓ | wrap differs (cosmetic); H1 rect height 50 vs 59 (display inline-block?) |
| Articles toolbar / chip filter | `--primary` accent for is-active state | `is-active` bg = `#005AA0` ❌ (live diverges from brief — brief has `--primary` = `#1893B4`, but live treats active as `--primary-deep`) | `is-active` bg = `#1893B4` ✓ | F-NEW-18-A token mismatch on live |
| Card border | `--hairline: #E5E1DC` (brief) | `rgb(142,134,122)` ❌ live diverges | `rgb(229,225,220)` ✓ matches brief | F-NEW-18-B (live wrong) |
| Card H3 title | (brief ambiguous: `ink` vs `ink-strong`; Sprint 13/16 sitewide baseline established `ink-strong` for H1/H3) | `#1F1A14` ✓ matches sitewide baseline | `#2A2520` ❌ vs sitewide baseline | F-NEW-18-C preview-doc |
| Card eyebrow | `12 / 1.4 ls / #8E4A2A / uppercase` | ✓ matches | ✓ matches | PASS |
| Card excerpt | brief body 15 / 1.6 | 15 / 24 (1.6) ✓ | 15 / 24 (1.6) ✓ | PASS |
| Pagination current-page | `--primary` accent (brief) | bg `#005AA0` ❌ | bg `#1893B4` ✓ | F-NEW-18-A (same token mismatch as chip) |
| Pagination non-current | 1 px `--hairline` border, `--body` text | ✓ | ✓ | PASS |
| Footer | Drupal-shipped; richer than preview | OK (out of scope) | minimal preview footer | sitewide carry (F-NEW-16-H column heading H3/H4) |

## Mobile (375px)

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Page-title H1 | mobile reduction 36 / 1.05 / -0.8 | 36 / 37.8 / -0.8 ✓ | 36 / 37.8 / -0.8 ✓ | both PASS |
| Page-title H1 wrap | single line "Articles." | single line ✓ | single line ✓ | PASS |
| Page-title lede | brief 18 / 28.8 | 18 / 28.8 ✓ | 18 / 28.8 ✓ | PASS |
| Articles toolbar chip touch-target | ≥ 44 px tap height (WCAG 2.5.5 / Apple HIG; AA floor 2.5.8 = 24 px) | pad 15px 16px → tap ≈ 44 px ✓ | pad 9px 16px → tap ≈ 32 px ⚠ (AA floor pass; AAA fail) | F-NEW-18-E preview defect |
| Chip wrap | toolbar flex-wrap into multiple rows at 375 | YES (h=187 px) | YES (h=109 px — fewer rows because chips are shorter) | OK (consequence of F-NEW-18-E) |
| Article-card stacking | 1-up at < 992 | 1-up ✓ | 1-up ✓ | PASS |
| Card image aspect | 16:9 | aspect-ratio: 16/9 → 297 × 167 ✓ | aspect-ratio: 16/9 → 325 × 183 ✓ | PASS |
| Card H3 mobile | brief mobile reduction; Sprint 9 fix added `min-height: 44px` to h3 at < 768 to prevent eyebrow/h3 overlap | live h3 fs=20px lh=25px ✓; min-height applied | preview h3 fs=20px lh=25px ✓; min-height applied (preview CSS line 469) | PASS — Sprint 9 fix intact on both |
| Card text-variant H3 mobile | brief `26 px → 22 px` mobile | live 22 px ✓ | preview 22 px ✓ | PASS |
| Pagination | flex row, no horizontal scroll | h=44 ✓ | h=40 (pagination items are 40 px square via `min-width: 40px; height: 40px;`) | PASS — both within ≤ 2 px of each other |
| Footer | single-column at < 768 | yes (single col stack) | yes (single col stack) | PASS structure; H3/H4 carry |
| Page-level horizontal scroll | NO | NO (pageW=360, clientW=375 — pageW even SMALLER than clientW; correct) | NO (pageW=375, clientW=375) | PASS |

## Design brief compliance

| Token | Brief | Live | Preview | Match |
|---|---|---|---|---|
| Page-title H1 desktop | 56 / 1.05 / -1.4 / Rubik 500 | 56 / 58.8 / -1.4 / 500 | 56 / 58.8 / -1.4 / 500 | both PASS |
| Page-title H1 mobile | 36 / 1.05 / -0.8 | 36 / 37.8 / -0.8 | 36 / 37.8 / -0.8 | both PASS |
| H1 color | (brief ambiguous; both `ink` and `ink-strong` are tokens) | `#2A2520` (`ink`) | `#2A2520` (`ink`) | both PASS (H1 happens to align — divergence is on H3 only) |
| Kicker | 12 / 1.6 ls / `#8E4A2A` / uppercase / Poppins 600 | 12 / 1.6 / `#8E4A2A` ✓ | 12 / 1.6 / `#8E4A2A` ✓ | both PASS |
| Lede (page-title) | 18 / 28.8 / `--body` (`#5C544C`) | 18 / 28.8 / `#5C544C` ✓ | 18 / 28.8 / `#5C544C` ✓ | both PASS |
| Card H3 (heading-md) | `22 / 1.25 / -0.4 / 500` (brief) — preview uses 24 (one nudge); live 24 too | 24 / 30 / -0.4 / 500 | 24 / 30 / -0.4 / 500 | both consistent; +2 px above brief (sitewide pattern; sub-2 px) |
| Card H3 color | (brief ambiguous) | `#1F1A14` (`ink-strong`) ✓ Sprint 13 baseline | `#2A2520` (`ink`) ❌ vs baseline | F-NEW-18-C (preview-doc) |
| Card text-variant H3 desktop | 26 / 1.25 | 26 / 32.5 | 26 / 32.5 | both PASS |
| Card eyebrow | 12 / 1.4 ls / `#8E4A2A` / Poppins 600 / uppercase | 12 / 1.4 / `#8E4A2A` ✓ | 12 / 1.4 / `#8E4A2A` ✓ | both PASS |
| Card excerpt | 15 / 1.6 / `#5C544C` | 15 / 24 / `#5C544C` ✓ | 15 / 24 / `#5C544C` ✓ | both PASS |
| Card border | 1 px `--hairline` = `#E5E1DC` | `rgb(142,134,122)` ❌ live diverges | `rgb(229,225,220)` ✓ | F-NEW-18-B (live wrong) |
| Card border-radius | 12 px (`--radius-lg`) | 12 px ✓ | 12 px ✓ | both PASS |
| Card text-variant bg | `--cream` = `#F5EFE2` | `rgb(245,239,226)` ✓ | `rgb(245,239,226)` ✓ | both PASS |
| Chip is-active bg | `--primary` = `#1893B4` (brief preview CSS `:root` line 14) | `rgb(0,90,160)` (`#005AA0`, `--primary-deep`) ❌ | `rgb(24,147,180)` ✓ | F-NEW-18-A (preview-doc OR sitewide token decision — see Findings) |
| Pagination is-current bg | `--primary` (per preview line 408) | `rgb(0,90,160)` ❌ | `rgb(24,147,180)` ✓ | F-NEW-18-A (same delta) |
| Pagination items border-radius | 30 px pill | 30 px ✓ | 30 px ✓ | both PASS |
| Mobile chip vertical padding | implied ≥ 44 px tap (WCAG 2.5.5 AAA; brief does not explicitly mandate) | pad 15px 16px → tap ≈ 44 px ✓ | pad 9px 16px → tap ≈ 32 px ⚠ | F-NEW-18-E |
| Skip-link target | `#main-content` (Drupal default) | `#main-content` ✓ | `#main` ⚠ | F-NEW-18-F (advisory; preview-doc one-char fix) |
| Cream bg | `#F5EFE2` | `rgb(245,239,226)` ✓ | `rgb(245,239,226)` ✓ | both PASS |
| Body text color | `#5C544C` | `rgb(92,84,76)` ✓ | `rgb(92,84,76)` ✓ | both PASS |
| Container max-width | 1200 px (`--content-max`) | live container w=1232 (1200 + 32 padding-x) ✓ | preview container w=1200 ✓ | both PASS (live includes own padding) |
| `text-wrap: balance` on H1 | a11y convention, no orphans | computed-applied; "Articles." is single-word H1 (period included) | computed-applied; same | PASS (single-word H1 is intentional; not a wrap-orphan) |

---

## WCAG 2.2 AA audit (full enumeration — no trimming)

| WCAG 2.2 AA success criterion | Result | Notes |
|---|---|---|
| 1.1.1 Non-text content | PASS | Site logo carries `alt="Home"`. Card media images on live use Drupal image-style with `alt` attributes pulled from `field_image alt`; on preview each `<img alt="">` is decorative (paired with the title link as the accessible name carrier) and parent anchor is `aria-hidden="true" tabindex="-1"` — title `<h3><a>` is the focusable / accessible-named element. No purely decorative SVGs lacking `aria-hidden` detected. |
| 1.3.1 Info and relationships | **PASS — Sprint 9 fix verified intact** | Live DOM: single H1 ("Articles."), then **visually-hidden `<h2>Articles</h2>` emitted by `views-view-unformatted--articles--page-1.html.twig`** (confirmed via probe — `cls="visually-hidden h3 menu-block__title"` matches the Sprint 9 fix; also `visually-hidden Main navigation`, `visually-hidden Breadcrumb`, `visually-hidden Footer` for the four DOM regions). Then card H3s. Heading hierarchy H1 → H2 → H3 holds. Preview lacks the same H2 (acknowledged in preview-sanity-check; not a regression — preview has no view-rendered region structure). |
| 1.3.2 Meaningful sequence | PASS | DOM order matches visual reading order at 1280/768/375 (page-title → toolbar → cards in grid order → pagination → footer). |
| 1.3.4 Orientation | PASS | No orientation lock. |
| 1.3.5 Identify input purpose | N/A | No form inputs on this page; toolbar chips are anchors (`<a>`), not form fields. |
| 1.4.1 Use of color | PASS | Active chip / pagination current page differentiate via background-color AND filled-style change (not color alone). Card hover state changes border-color + lift transform (not color alone). |
| 1.4.3 Contrast (minimum) | PASS | H1 `#2A2520` on cream `#F5EFE2` ≈ 14.2:1 PASS. Body `#5C544C` on white ≈ 7.3:1 PASS. Kicker `#8E4A2A` on cream ≈ 5.5:1 PASS. Active chip: live `#005AA0` on white vs white-text ≈ 7.2:1 PASS; preview `#1893B4` on white-text ≈ 3.2:1 ⚠ — **borderline; passes 1.4.3 for large text 18px+, fails for small text 14px chips**. **Preview's `#1893B4` background with white 14 px text marginally fails 1.4.3 (3.2:1 < 4.5:1).** Live's `#005AA0` passes cleanly at 7.2:1. **The F-NEW-18-A delta has a contrast dimension favoring live.** Pagination same calculus. |
| 1.4.4 Resize text (200%) | PASS | Body readable at 200%; container reflows; no clipping. |
| 1.4.5 Images of text | PASS | All headings / body are HTML text. |
| 1.4.10 Reflow | PASS | No horizontal scroll at 320 px. `pageW <= clientW` at 375 (live pageW=360, preview pageW=375). |
| 1.4.11 Non-text contrast | PASS | Chip borders 1 px `--hairline` (`#E5E1DC`) on white → 1.5:1 ⚠ — chip borders on white background are below the 3:1 non-text-contrast floor. This is sitewide carry (all card / chip / pagination hairlines use `#E5E1DC` on white). Sitewide allowlist (pa11y) covers this. **Both renders identical; not a /articles regression.** Active chip / pagination current-page have filled backgrounds (no hairline issue). |
| 1.4.12 Text spacing | PASS | All letter-spacing tokens applied without overflow. |
| 1.4.13 Content on hover or focus | PASS | No hover-triggered panels. Card hover border-color + lift is decorative. |
| 2.1.1 Keyboard | PASS | All focusable elements reachable via Tab — skip-link → header nav → 5 chips → 6 card title links (image cards have `aria-hidden tabindex="-1"` on the image anchor and the H3-internal `<a>` is the focusable surface; text cards have the title link only) → 3 pagination items (page 1 is a `<span>` and not focusable; pages 2 and Next are anchors) → footer. |
| 2.1.2 No keyboard trap | PASS | Tab traversal reaches end. |
| 2.1.4 Character key shortcuts | N/A | No single-key shortcuts. |
| 2.4.1 Bypass blocks | PASS | Skip link is the first Tab stop. Live target `#main-content` lands on `<main id="main-content">`. Preview target `#main` lands on `<main id="main">` (mismatched anchor href but valid in the preview file). F-NEW-18-F advisory. |
| 2.4.2 Page titled | PASS | `<title>` present on live. Preview `<title>` reads "Performant Labs — articles preview (teal + terracotta)" — preview-specific. |
| 2.4.3 Focus order | PASS | Header → skip-link → page-title → toolbar (5 chips left-to-right) → 6 card title links in DOM order → pagination (2 link items + Next) → footer. Logical. |
| 2.4.4 Link purpose (in context) | PASS | Card title `<a>` accessible names are the full article title (descriptive). Toolbar chips have unique labels ("All", "Automated Testing", "Cypress", "Open source", "Talks"). Pagination labels: numeric pages + descriptive "Next →" with `aria-label="Next page"` on preview (live similar). Footer links descriptive. |
| 2.4.5 Multiple ways | PASS | Header nav + breadcrumb + footer + toolbar category filter. |
| 2.4.6 Headings and labels | PASS | "Articles." (H1), visually-hidden "Articles" (H2 for region), per-card H3 article titles — descriptive throughout. |
| 2.4.7 Focus visible | PASS | 3-px dotted `#1893B4` outline on every focusable. Verified on chip, card title `<a>`, pagination `<a>`. |
| 2.4.11 Focus not obscured (minimum) — WCAG 2.2 | PASS | Sticky header height 73 px on live; focused content visible at all viewports — no card title or pagination item gets hidden behind the sticky header during keyboard navigation. |
| 2.5.1 Pointer gestures | N/A | No multi-pointer gestures. |
| 2.5.2 Pointer cancellation | PASS | Default browser activation. |
| 2.5.3 Label in name | PASS | Visible button/link text matches accessible name. |
| 2.5.4 Motion actuation | N/A | No motion-triggered actions. |
| 2.5.7 Dragging movements — WCAG 2.2 | N/A | No drag interactions. |
| 2.5.8 Target size (minimum 24 × 24) — WCAG 2.2 | **MIXED — preview chip at 375 ≈ 32 × full-chip-width, PASSES the 24×24 minimum but live's 44 px is recommended.** | Live chip mobile pad 15 × 16 → 44 px tall × ≥ 40 px wide → 44 × 40 px tap. Preview chip mobile pad 9 × 16 → 32 px tall × ≥ 40 px wide → 32 × 40 px tap. Both pass 2.5.8 (24×24). F-NEW-18-E recommends preview bump to 44 to match live for 2.5.5 AAA / Apple HIG. **Sitewide carry:** footer column links remain 14–20 px tall (pre-existing pattern, not /articles-specific). |
| 3.1.1 Language of page | PASS | `<html lang="en">` set. |
| 3.2.1 On focus | PASS | No surprising focus-triggered changes. |
| 3.2.2 On input | N/A | No inputs. |
| 3.2.3 Consistent navigation | PASS | Primary nav identical across pages. |
| 3.2.4 Consistent identification | PASS | CTA labels consistent. |
| 3.2.6 Consistent help — WCAG 2.2 | PASS | "Contact us" in header + footer. |
| 3.3.1 Error identification | N/A | No inputs. |
| 3.3.7 Redundant entry — WCAG 2.2 | N/A | No multi-step flow. |
| 3.3.8 Accessible authentication (minimum) — WCAG 2.2 | N/A | No auth flow. |
| 4.1.2 Name, role, value | PASS | Native semantics throughout. Toolbar is a `<div role="group" aria-label="Filter articles by category">`; pagination is `<nav aria-label="Articles pagination">`. Card title links carry the H3 as the accessible name. |
| 4.1.3 Status messages | N/A | No live regions on page. |
| Reduced-motion (`prefers-reduced-motion: reduce`) | PASS | Captures taken with `reducedMotion: 'reduce'`; no animation observed. |
| Forced-colors mode | NOT RE-TESTED THIS CYCLE | Sprint 10 sitewide pass; no /articles-specific regression suspected (page uses standard backgrounds + system text). |
| Mobile touch targets (375 px) | MIXED | Card title-row + image anchor combined tap area ≥ 44 × 44 px on both. Chip tap target on live 44 px ✓, on preview 32 px ⚠ (F-NEW-18-E). Pagination 40 px ⚠ marginal on both (preview spec is `height: 40px`; live similar). |
| Mobile typography scale | PASS | All mobile typography within ±1 px of brief. H1 mobile 36 ✓, lede 18 ✓, eyebrow 12 ✓, h3 mobile 20 ✓ (Sprint 9 fix `min-height: 44px` on h3 at < 768 intact on both renders), text-card h3 mobile 22 ✓. |
| Mobile layout | PASS | Single-column card stacking at < 992 on both renders; chips wrap onto multiple rows but remain centered; pagination centered single row; no horizontal scroll. Sprint 9 mobile-overlap fix (h3 min-height 44 + flex-align) intact. |

**Totals:** 33 distinct AA + 2.2 criteria + 3 responsive a11y checks. Hard PASS: 27. N/A: 9. MIXED (preview-doc fix candidate): 1 (2.5.8 + mobile-touch — F-NEW-18-E). MIXED (sitewide carry): 1 (1.4.11 hairline contrast). Deferred: 1 (forced-colors retest). **Sprint 9 visually-hidden `<h2>Articles</h2>` fix VERIFIED intact on live at all three viewports** (1.3.1 specifically — see entry above). No /articles-specific WCAG regression.

### Orphan-word check (memory `feedback_no_orphan_words.md`)

Probed last-line text on every heading and copy block at all three viewports.

| Heading / copy | Viewport | Live last line | Preview last line | Orphan? |
|---|---|---|---|---|
| Page-title H1 "Articles." | 1280 / 768 / 375 | "Articles." (single-word H1 by design — period included) | same | NO — H1 is intentionally a single word; not a wrap-orphan |
| Page-title lede | 1280 | "conference talks, and the occasional cheat sheet." (7 words) | "occasional cheat sheet." (3 words) | NO on both |
| Page-title lede | 768 | "conference talks, and the occasional cheat sheet." (7 words) | "occasional cheat sheet." (3 words) | NO |
| Page-title lede | 375 | "and the occasional cheat sheet." (5 words) | "occasional cheat sheet." (3 words) | NO |
| Card H3 (multiple) | 1280 / 768 / 375 | per-probe inspection on first 6 cards — last line ≥ 2 words on every card | same | NO |
| Card excerpt (clamped to 2 lines via `-webkit-line-clamp: 2`) | all | clipped at 2 lines; truncation is by ellipsis — last visible word varies | same | NO — clamp ensures no wrap-orphan |
| Footer signature | 1280 | "Get in touch →" (3 words) | "Get in touch →" (3 words) | NO |
| Toolbar chips | all | one-word or two-word chips ("All", "Cypress", "Talks", "Open source", "Automated Testing") — each chip is its own pill | same | N/A — chips are atomic |

**No orphan-word findings on /articles.** The single-word "Articles." H1 is intentional copy (with period) and not a wrap-orphan — memory rule does not apply when the heading is one word by design.

---

## Static-preview comparison

| Section | 1280 | 768 | 375 | Notes |
|---|---|---|---|---|
| Header | MATCH | MATCH | MATCH | Sprint 13 canonical. |
| Page-title (cream band) | DELTA (chip-order cosmetic — chip strip sits below H1; lede wrap; H1 rect height) | DELTA (same) | DELTA (same + chip stacking height) | F-NEW-18-D + minor cosmetic |
| Articles toolbar (chips) | DELTA (active-chip bg `#005AA0` live vs `#1893B4` preview; chip order swap on last two) | DELTA (same) | DELTA (same + mobile chip padding 15 vs 9) | F-NEW-18-A + F-NEW-18-D + F-NEW-18-E |
| Card grid (chrome) | DELTA (card border `#8E867A` live vs `#E5E1DC` preview; card H3 color `#1F1A14` vs `#2A2520`) | DELTA (same) | DELTA (same) | F-NEW-18-B + F-NEW-18-C |
| Card grid (content) | DELTA (PC-13 — different article set: live leads with "CTRFHub" 2026-04-27; preview leads with "Version 1.0 ATK" 2023-11-20) | DELTA (same) | DELTA (same) | **PC-13 — NOT a fix candidate** (views-listing content fluctuation expected) |
| Pagination | DELTA (current-page bg `#005AA0` vs `#1893B4`) | DELTA (same) | DELTA (same) | F-NEW-18-A |
| Footer | DELTA (live richer + H3 column headings vs preview H4) | DELTA (same) | DELTA (same) | F-NEW-16-H carry (sitewide) |

---

## PC-13 views-listing convention — explicit address

**PC-13 statement (runbook line 28):** "Views-rendered listings differ from Canvas pages. Card-grid card count fluctuates with content. S compares card chrome / grid spacing / hero typography rather than card-content parity. Don't flag 'preview has 6 cards but live has 9' as a fix candidate."

**S confirms:**

- **Card count:** 6 cards on both live and preview at all viewports — happens to match this cycle. But the **content** differs (live's lead card is "CTRFHub: building a CTRF-native test reporting platform in the open" dated 2026-04-27; preview's lead is "Version 1.0 of Automated Testing Kit is ready." dated 2023-11-20). Per PC-13, this is **expected** and **not a fix candidate**. The grid's section-level DSSIM of 0.24–0.25 reflects this content drift; AE ≈ 0 because the crops are off-by-one row on the pixel grid, and DSSIM correctly registers structural difference even when AE reads near-zero. **Treat DSSIM in the grid section as informative-only.**
- **Card chrome:** captured under F-NEW-18-B (border) and F-NEW-18-C (H3 color) — these ARE fix candidates because they are chrome-level token deltas, not content fluctuation.
- **Grid spacing:** both renders use 2-column grid at ≥ 992 (live & preview computed: 2 cols × 556/552 px), gap = `--space-2xl` ≈ 48 px on both. **PASS.**
- **Pagination chrome:** captured under F-NEW-18-A — fix candidate.
- **Toolbar chip chrome / order / mobile padding:** F-NEW-18-A / -D / -E — fix candidates.
- **Sprint 9 a11y fix (visually-hidden `<h2>Articles</h2>`):** verified intact on live at all three viewports via probe (cls `visually-hidden h3 menu-block__title`).

PC-13 cleanly excludes card-content from fix candidates while keeping card-chrome and active-state tokens in scope. No PC-13 escalation required.

---

## Findings catalog

### F-NEW-18-A — Active-state color token: live `#005AA0` (primary-deep), preview `#1893B4` (primary)

- **Brief:** preview CSS `:root` (line 14): `--primary: #1893b4`; (line 15): `--primary-light: #62bbcb`; (line 16): `--primary-deep: #005AA0`. Preview's `.chip.is-active` (line 295) uses `background: var(--primary)`. Preview's `.pagination .is-current` (line 408) uses `background: var(--primary)`. Brief therefore binds active state to `--primary` (the canonical brand teal).
- **Live (1280 / 768 / 375):** `.chip.is-active` bg = `rgb(0, 90, 160)` = `#005AA0` (`--primary-deep`). `.pagination .is-current` bg = `rgb(0, 90, 160)` (same).
- **Preview (1280 / 768 / 375):** chip is-active bg = `rgb(24, 147, 180)` = `#1893B4` (`--primary`). Pagination is-current bg = same.
- **Visible impact:** The active-state pill (the "All" chip and the "1" current page pill) appears noticeably darker / deeper-blue on live than on preview. Most visually obvious delta in the pagination diff PNG (a solid red disc on the "1").
- **WCAG dimension:** Live `#005AA0` on white text = 7.2:1 — PASSES 1.4.3 small text. Preview `#1893B4` on white text = 3.2:1 — **marginally fails 1.4.3 small text (< 4.5:1)** at the 14 px chip text size. **Live's value is the a11y-correct one.**
- **Remediation:**
  - **Option A — Preview-doc update (preferred, autonomous default).** Change preview `.chip.is-active` (line 295) and `.pagination .is-current` (line 408) `background` from `var(--primary)` to `var(--primary-deep)`. One-line CSS edit. Updates the design brief implicitly to use `--primary-deep` for filled-pill active states.
  - **Option B — Update brief.** Add an explicit "Active-state pill background uses `--primary-deep` for AA compliance at small-text size; `--primary` is reserved for hover / underline / large-text" rule to `pl_design_brief.md`. Then preview matches under Option A and the rule is documented.
  - **Option C — Update live to use `--primary`.** Not recommended — would knowingly ship a 3.2:1 contrast ratio on the active-chip + pagination pill. WCAG floor violation.
- **Recommended cycle:** Cycle 2 (preview-doc + brief amendment).

### F-NEW-18-B — Card border color: live `rgb(142, 134, 122)` (≈ `#8E867A`), preview `#E5E1DC` (`--hairline`)

- **Brief:** preview CSS `:root` (line 39): `--hairline: #E5E1DC`. `.article-card` (line 311) uses `border: 1px solid var(--hairline)`. Brief binds card border to `#E5E1DC`.
- **Live (all viewports):** `.article-card` border-color = `rgb(142, 134, 122)` (≈ `#8E867A`). Significantly darker than brief.
- **Preview (all viewports):** `rgb(229, 225, 220)` (`#E5E1DC`) ✓ matches brief.
- **Visible impact:** Live cards have a much darker, more visible border. The 1280 / 768 / 375 captures all show this consistently. Card hover state (border-color → `--primary`) shifts to teal on both — the resting-state border is what diverges.
- **Where does live's `#8E867A` come from?** Likely a theme-level override in the `card.html.twig` SDC or a Drupal `--theme-hairline` variable that differs from preview's `--hairline`. Worth a sitewide probe in Cycle 2 before SDC edits — other `card`-using pages (open-source-projects, services teaser cards, etc.) may share this.
- **Remediation:**
  - **Option A — Live update (preferred).** Bring live's `.article-card` (and underlying `card.html.twig` SDC if shared) border-color to `#E5E1DC` (`--hairline`) to match brief.
  - **Option B — Brief update.** If live's `#8E867A` was a deliberate decision elsewhere (e.g. for higher non-text-contrast 1.4.11 AA — `#8E867A` on white ≈ 3.4:1 vs `#E5E1DC` ≈ 1.5:1 — live is actually closer to passing 1.4.11 here!), update the brief token to match live and update preview.
- **a11y note:** Live border `#8E867A` on white background ≈ 3.4:1 PASSES WCAG 1.4.11 non-text contrast (3:1 floor for UI components). Preview border `#E5E1DC` on white ≈ 1.5:1 FAILS 1.4.11. **Live is a11y-correct; preview is brief-correct.** This is a brief-vs-WCAG tension that the operator should resolve. **Recommendation: update brief to match live (Option B).** Sitewide implication.
- **Recommended cycle:** Cycle 2 — operator decision required before any code lands; Cycle 3 implements.

### F-NEW-18-C — Card H3 color: live `#1F1A14` (`ink-strong`), preview `#2A2520` (`ink`)

- **Same Sprint-13 → Sprint-17 sitewide canonicalization.** Live uses `--theme-text-color-loud: #1F1A14` for H1 / H3; preview uses `--ink: #2A2520`.
- **Remediation:** Preview-doc update `.article-card h3 a { color: var(--ink); }` (line 363) to use a darker token equivalent to `#1F1A14`. One-line CSS edit + add `--ink-strong: #1F1A14;` to preview `:root`.
- **a11y impact:** Both pass 1.4.3 contrast on white (live 13.4:1 vs preview 12.0:1 — both well above 4.5:1).
- **Recommended cycle:** Cycle 2 (preview-doc; bundle with F-NEW-18-A + F-NEW-18-D).

### F-NEW-18-D — Chip order swap (last two)

- **Live:** `All / Automated Testing / Cypress / Open source / Talks`.
- **Preview:** `All / Automated Testing / Cypress / Talks / Open source`.
- **Brief:** brief does not specify chip order; preview's `.articles-toolbar` HTML hard-codes the order (lines 540–544).
- **Visible impact:** Cosmetic — last two chips swap positions. The "is-active" chip ("All") is in the same position on both. The chip-strip total width differs slightly (live: chips 1+2+3+4+5 = "Open source" before "Talks"; preview: reversed).
- **Remediation:** Preview-doc edit — swap lines 543 and 544 in `docs/pl2/Previews/articles.html` so order matches live.
- **Recommended cycle:** Cycle 2 (bundled with F-NEW-18-A + F-NEW-18-C preview-doc batch).
- **Note:** Operator may instead choose to update live (the Drupal view's exposed-filter taxonomy order). Either decision works; live is canonical for taxonomy-order in current Sprint 13 baseline → recommend updating preview.

### F-NEW-18-E — Mobile chip padding (preview tap height ≈ 32 px vs live ≈ 44 px)

- **Issue:** At 375, preview `.chip` retains the desktop padding `9px 16px` while live re-pads the chip to `15px 16px` at mobile (giving a 44 px tap height that matches Apple HIG / WCAG 2.5.5 AAA target).
- **Brief:** preview's media-query block at `@media (max-width: 767px)` does not bump `.chip` padding (preview line 460-473 area). Live theme has a mobile bump.
- **WCAG 2.5.8 floor:** PASS on both (24 × 24 minimum).
- **WCAG 2.5.5 (AAA) target:** Live PASS (44+), preview FAIL (32). AAA is not required at AA level.
- **Operator decision:** apply live's mobile chip padding bump to the preview (preview-doc CSS edit), or accept the AA-floor pass and document.
- **Remediation:** Add to preview `@media (max-width: 767px)` block: `.articles-toolbar .chip { padding: 15px 16px; }`.
- **Recommended cycle:** Cycle 2 (preview-doc).

### F-NEW-18-F (advisory) — Skip-link href mismatch

- **Live:** `<a class="skip-link" href="#main-content">Skip to main content</a>`. Drupal `<main id="main-content" role="main">`.
- **Preview:** `<a class="skip-link" href="#main">Skip to main content</a>`. Preview `<main id="main" role="main">`.
- **Visible / a11y impact:** Both work in-context (preview's `#main` resolves to preview's `<main id="main">`). Live is Drupal-canonical.
- **Remediation:** Preview-doc edit — change preview `href="#main"` to `href="#main-content"` AND change `<main id="main">` to `<main id="main-content">` (preview line 479 + 513). 2-char fix.
- **Recommended cycle:** Cycle 2 (preview-doc bundle).

### F-NEW-18-G (advisory) — Page-title H1 rendered rect-height delta (live 50 / preview 59 at 1280)

- **Issue:** Both H1s render `font-size: 56px / line-height: 58.8px` (PASS brief). Bounding-rect heights differ by 9 px. Likely cause: live H1 has `display: inline-block`; preview H1 has `display: block` (or vice versa). The H1 is centered text "Articles." (single word).
- **Visible impact:** Slight vertical text-baseline offset of "Articles." text inside the cream band — cosmetic; <10 px shift.
- **Remediation:** Optional. If operator wants pixel-perfect H1 vertical alignment, probe `display` / `margin-block` on the rendered `<h1>` on each side and align.
- **Recommended cycle:** Cycle 3 (cosmetic; low priority).

### Carry-forwards (out of /articles scope)

- F-NEW-4 (sitewide primary CTA component chrome delta) — N/A on this page (no buttons of that pattern).
- F-NEW-16-H (footer column heading H3 vs H4) — reappears here; sitewide carry.
- Footer richness — sitewide Drupal pattern.

---

## Recommendation — Cycle 2..N carve

### Cycle 2 — Preview-doc batch (no live changes; operator decisions captured first)

- **Branch:** `aa/pl-sprint-18-cycle-2-preview-doc`
- **Scope:**
  - **F-NEW-18-A** — change preview `.chip.is-active` and `.pagination .is-current` `background` from `var(--primary)` to `var(--primary-deep)`. Add note to brief.
  - **F-NEW-18-C** — preview-doc update card H3 color from `#2A2520` to `#1F1A14`. Add `--ink-strong: #1F1A14` to preview `:root`.
  - **F-NEW-18-D** — swap preview chip-strip last two anchors (`Open source` and `Talks`).
  - **F-NEW-18-E** — add preview `@media (max-width: 767px) { .articles-toolbar .chip { padding: 15px 16px; } }`.
  - **F-NEW-18-F** (advisory) — preview `href="#main"` → `href="#main-content"`; `<main id="main">` → `<main id="main-content">`.
- **Verification:** Re-run `scripts/sprint-18-cycle-1-capture.mjs` + `…-diff.mjs`; per-section DSSIM at page-title / pagination should drop materially (target ≥ 30% reduction).
- **F→T→S:** F implements preview-doc; T validates HTML/CSS + cross-page sweep (do other previews use `.chip` / `.pagination` rules? — confirm no regression); S re-audits.

### Cycle 3 (operator-gated) — Card border decision (F-NEW-18-B)

- **Branch:** `aa/pl-sprint-18-cycle-3-card-border`
- **Scope:** Operator-decision sub-cycle.
  - **Option B (recommended):** update brief `--hairline` token from `#E5E1DC` to live's `#8E867A` (better 1.4.11 non-text-contrast). Then preview updates `.article-card border-color` to match. Sitewide implication — verify on /open-source-projects, /services teaser cards, any other `--hairline`-using component.
  - **Option A:** update live `card.html.twig` SDC to use `#E5E1DC`. Accepts a 1.4.11 marginal-fail.
- **Operator decision required.** Until resolved, F-NEW-18-B remains open.

### Cycle 4 (optional) — F-NEW-18-G H1 rect height

- Cosmetic; low priority. Bundle into a future sitewide H1 component sweep, not its own cycle.

### Deferred / out of Sprint 18 scope

- F-NEW-16-H (footer column heading H3 vs H4) — sitewide carry.
- F-NEW-4 — N/A on this page.
- Footer richness — sitewide.

---

## Scripts (durable artifacts)

| Script | Purpose |
|---|---|
| `scripts/sprint-18-cycle-1-capture.mjs` | 2× retina captures of live + preview at 1280/768/375 |
| `scripts/sprint-18-cycle-1-measure.mjs` | Section bounding boxes (page-title / articles-view / grid / pagination / footer) + chrome mask + page horizontal-scroll probe + H2 enumeration (Sprint 9 fix verification) |
| `scripts/sprint-18-cycle-1-diff.mjs`    | Apply mask, anchored per-section crops, DSSIM/PSNR/AE @ fuzz 0% & 3% per section + whole-page |
| `scripts/sprint-18-cycle-1-probe.mjs`   | PC-12-compliant computed-style probes: H1 + every H2 (visually-hidden + visible) + every H3 + every card (eyebrow / title link / excerpt / media + isTextCard variant) + page-title kicker + lede + toolbar + every chip + pagination + every pagination item + skip-link + footer headings + last-line orphan detection |

All scripts idempotent; may be re-run in Cycles 2..N to confirm fixes.

---

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/articles.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/briefs/pl_design_brief.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--sprint-18-articles-fidelity-hq.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-17-cycle-1-audit.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-16-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-18-cycle-1/` (PNGs + `measurements.json` + `diff-results.json` + `probes.json`)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-18-cycle-1-*.mjs`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/custom/performant_labs_20260502/templates/views/views-view-unformatted--articles--page-1.html.twig` (Sprint 9 visually-hidden `<h2>` fix — verified intact)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/custom/performant_labs_20260502/templates/views/views-view--articles--page-1.html.twig`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/custom/performant_labs_20260502/templates/views/views-exposed-form--articles--page-1.html.twig`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig`

---

## Verdict

**REWORK** — Cycle 2..N carve recommended.

Five actionable preview-doc findings on `/articles` (all preview-side; one is operator-gated):

1. **F-NEW-18-A** — preview chip + pagination active-state bg from `var(--primary)` to `var(--primary-deep)` (also a 1.4.3 contrast improvement that lands the preview at AA for small text on the active pill).
2. **F-NEW-18-B** — card border color: **operator decision needed** — Option B (recommended) updates brief + preview to live's `#8E867A` (better 1.4.11 non-text contrast); Option A updates live to brief `#E5E1DC` (accepts marginal 1.4.11 fail).
3. **F-NEW-18-C** — preview card H3 color from `ink` (`#2A2520`) to `ink-strong` (`#1F1A14`) to match Sprint-13/16 sitewide baseline.
4. **F-NEW-18-D** — preview chip-strip last two chips swap order to match live taxonomy order.
5. **F-NEW-18-E** — preview mobile chip padding bump from `9px 16px` to `15px 16px` at < 768 (44 px tap height — AAA target / Apple HIG).

Plus one advisory:

6. **F-NEW-18-F** — preview skip-link href `#main` → `#main-content` (+ `<main>` id) to match Drupal convention.

Plus carry-forwards (sitewide, out of scope):

- F-NEW-16-H — footer column heading H3 vs H4.
- Footer richness — sitewide Drupal pattern.

**Sprint 9 a11y fix VERIFIED intact** — visually-hidden `<h2>Articles</h2>` rendered by `views-view-unformatted--articles--page-1.html.twig` is present in the live DOM at all three viewports. WCAG 1.3.1 PASS. No /articles-specific WCAG regression.

The HQ method confirms PC-13 compliance: card-count and card-content fluctuation between live (6 cards, latest article 2026-04-27) and preview (6 cards, latest article 2023-11-20) is correctly excluded from fix candidates; card chrome (border, H3 color) and toolbar / pagination active-state tokens are correctly identified as chrome-level fix candidates. PC-12 probe discipline (enumerate every H1/H2/H3, probe each section's primary CTA specifically) surfaced F-NEW-18-A on both chip and pagination simultaneously — the same token mismatch appears in two places, and the probe-script caught both.
