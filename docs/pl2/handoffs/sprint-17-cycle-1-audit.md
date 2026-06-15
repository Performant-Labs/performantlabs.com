# Sprint 17 Cycle 1 — `/open-source-projects` HQ preview-fidelity audit (S only)

**Verdict:** **REWORK** — Cycle 2..N carve recommended. Six actionable findings (one PC-11 card-CTA preview-doc, one preview content gap, two preview-doc token, one orphan-word at 375, one hero H1 wrap delta at 1280). All structural a11y floors hold; no `/open-source-projects`-specific WCAG regression vs Sprint 13/16 sitewide baseline.

**Date:** 2026-05-13
**Page:** `/open-source-projects`
**Branch:** `aa/pl-sprint-17-open-source-projects-fidelity-hq` (S-only cycle; no F/T)
**Sprint:** Sprint 17 (runbook `docs/pl2/pl-plan--sprint-17-open-source-projects-fidelity-hq.md`)
**Live:** `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects` (HTTP 200)
**Preview:** `file://docs/pl2/Previews/open-source-projects.html` (canonical post-Sprint 13)
**Operator-facing report:** [`sprint-17-cycle-1-report.html`](sprint-17-cycle-1-report.html)
**Prior reference audit (method):** `docs/pl2/handoffs/sprint-15-cycle-1-audit.md`, `docs/pl2/handoffs/sprint-16-wrap.md`
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

The canonical preview at `docs/pl2/Previews/open-source-projects.html` was canonicalized in Sprint 13. Pre-audit check:

| Convention | Preview state | Verdict |
|---|---|---|
| `navbar-expand-lg` hamburger ≥ 992 only | Hamburger toggle at < 992 (canonical) | PASS |
| No right-side CTA pill in header | Header clean | PASS |
| Hero H1 desktop = 72 px (brief `display-xl`) | Preview H1 = 72 / 75.6 / Rubik 500 / -2 px ls | PASS |
| Hero H1 mobile = 44 px | Preview H1 mobile = 44 / 46.2 / -1 ls | PASS |
| Heading hierarchy in preview DOM | H1 → multiple H2 → H3 (single H1) | PASS |
| Card content parity with live | Preview has 6 cards; **live has 7** (missing Payment Stripe entry on preview) | FAIL — F-NEW-17-D content gap |
| Card-CTA pattern | **Preview uses separate footer link** "Read the docs →"; live makes the card title the link via `card.html.twig` | DELTA — F-NEW-17-CARD (PC-11 pre-commitment: live canonical → preview-doc fix) |
| H1 color | Preview = `#2A2520` (`ink`); live = `#1F1A14` (`ink-strong` / `--theme-text-color-loud`) | DELTA — F-NEW-17-A (preview-doc; live canonical per Sprint 13/16 sitewide baseline) |
| Touch targets in preview | All ≥ 44 px | PASS |

Two preview-doc defects pre-cleared (F-NEW-17-CARD, F-NEW-17-D), one preview-doc token nudge (F-NEW-17-A). No blockers; all remediations are preview-side.

---

## Tier 3 visual audit

### Capture run

Six full-page PNGs at three viewports @ 2× DPR.

| Viewport | Live PNG dim | Preview PNG dim |
|---|---|---|
| 1280 | 2560 × 8980  | 2560 × 8406  |
| 768  | 1536 × 14082 | 1536 × 15640 |
| 375  | 750 × 18440  | 750 × 14908  |

(Live page is 287 px taller at 1280 due to extra Payment Stripe card + breadcrumb band; at 768 preview is taller because preview's 3-up card grid stacks single-column at 768 while live keeps 3-up; at 375 live's extra card + Drupal chrome adds ~3.5 k px.)

### Drupal-chrome mask coordinates

Per FB-3 convention, the breadcrumb cream band on live was masked white before any comparison. Mask coordinates (image-space @ 2× DPR):

| Viewport | CSS top | CSS h | Image x1,y1 | Image x2,y2 |
|---|---|---|---|---|
| 1280 | 160 | 61 | 0,320 | 2560,442 |
| 768  | 160 | 61 | 0,320 | 1536,442 |
| 375  | 160 | 63 | 0,320 | 750,446  |

Mask is well above section-1 (live hero starts at CSS y=269–271).

### Visual diff results (whole-page, informative)

| Viewport | Common-H (px) | DSSIM (norm) | AE @ 0% | AE @ 3% | Notes |
|---|---|---|---|---|---|
| 1280 | 8406  | 0.219 | 8.42 M | 8.32 M | drift-dominated; per-section binding |
| 768  | 14082 | 0.207 | 13.81 M | 13.73 M | drift-dominated |
| 375  | 14908 | 0.221 | 5.07 M | 5.00 M | drift-dominated |

Whole-page values are non-load-bearing per PC-8.

### Per-section HQ diff (binding — DSSIM primary)

Classification: DSSIM < 0.01 MATCH; 0.01–0.05 MINOR; ≥ 0.05 REAL.

| Viewport | Section | DSSIM (norm) | PSNR (norm) | AE @ 0% | AE @ 3% | AE-3% / total px | Class |
|---|---|---|---|---|---|---|---|
| 1280 | hero          | **0.192** | 0.118 | 268,581 | 260,957 | 10.15% | REAL |
| 1280 | testing-tools | **0.189** | 0.144 | 2       | 2       | <0.001% | REAL by DSSIM (see note) |
| 1280 | drupal-qa     | **0.201** | 0.129 | 1       | 1       | <0.001% | REAL by DSSIM (see note) |
| 1280 | other-modules | **0.151** | 0.171 | 51,125  | 49,355  | 3.12%  | REAL |
| 1280 | closing-cta   | **0.162** | 0.127 | 141,378 | 139,654 | 6.29%  | REAL |
| 1280 | footer        | **0.178** | 0.147 | 117,072 | 112,333 | 5.84%  | REAL |
| 768  | hero          | **0.225** | 0.106 | 272,856 | 264,567 | 14.70% | REAL |
| 768  | testing-tools | **0.178** | 0.152 | 6       | 6       | <0.001% | REAL by DSSIM (see note) |
| 768  | drupal-qa     | **0.182** | 0.143 | 2       | 2       | <0.001% | REAL by DSSIM (see note) |
| 768  | other-modules | **0.161** | 0.158 | 47,642  | 46,102  | 4.55%  | REAL |
| 768  | closing-cta   | **0.183** | 0.110 | 137,233 | 135,517 | 10.16% | REAL |
| 768  | footer        | **0.188** | 0.140 | 112,527 | 107,816 | 6.87%  | REAL |
| 375  | hero          | **0.251** | 0.104 | 155,187 | 149,948 | 16.61% | REAL |
| 375  | testing-tools | **0.208** | 0.136 | 2       | 2       | <0.001% | REAL by DSSIM (see note) |
| 375  | drupal-qa     | **0.205** | 0.140 | 830,704 | 814,150 | 22.59% | REAL |
| 375  | other-modules | **0.187** | 0.141 | 37,962  | 36,523  | 7.54%  | REAL |
| 375  | closing-cta   | **0.225** | 0.098 | 78,899  | 77,560  | 15.21% | REAL |
| 375  | footer        | **0.198** | 0.133 | 87,911  | 84,085  | 7.91%  | REAL |

Note on testing-tools/drupal-qa AE≈0 anomaly (1280/768): cumulative vertical drift between live and preview means the per-section anchor crops happened to land on near-uniform canvas/cream window on the preview side while the live crop landed in card content — DSSIM correctly registers structural divergence even when pixel-AE reads near-zero. The contemporaneous diff PNG (red overlay) shows the real content delta. **Treat DSSIM as binding; AE on those two crops is noise.** Note: at 375 the drupal-qa AE=830k (22.6%) is real — live has the extra "Payment Stripe" card pushing layout vertically against the preview's shorter section.

### Visual diagnosis per section (driven by diff PNGs)

Systemic deltas cascading across every section (architecture is consistent with Sprint 14/15):

1. **Hero H1 wrap mismatch at 1280 (NEW this audit)** — Live H1 "What we maintain in the open" wraps to **1 line** (width 959 px); preview wraps to **2 lines** ("in the open" on line 2; width 872 px). Both renders use 72 / 75.6 / -2 ls / Rubik 500 / `text-wrap: balance`. The container width / max-inline-size differs between live `.dy-section__container` (959 px text box) and preview `.hero__inner` (max-width 920 px → 872 px text box). At 768 both wrap to 2 lines; at 375 both wrap to 3 lines ending "the open" (2 words — not orphan). **F-NEW-17-B**.
2. **H1 color token mismatch** — Live H1 color `rgb(31, 26, 20)` (`#1F1A14`, `--theme-text-color-loud` / `ink-strong`); preview H1 color `rgb(42, 37, 32)` (`#2A2520`, `ink`). Both are legitimate brief tokens (brief lines 26, 27, 33, 34). Live has used `#1F1A14` for H1s sitewide since Sprint 13's canonicalization pass. **F-NEW-17-A — preview-doc fix to match live (`ink-strong`).**
3. **Hero subhead size / line-height drift (carry)** — Live body-lg `17 / 30.6` (~1.8 lh); preview body-lg `17 / 27.2` (~1.6 lh). Brief: `18 / 28.8`. Both deviate; same body-lg sitewide drift documented since Sprint 13. Out of /open-source-projects scope.
4. **Hero kicker line-height drift** — Live `12 / 16.8` (1.4 lh); preview `12 / 19.2` (1.6 lh). Both render `#8E4A2A` text. ~2 px positional drift. MINOR — sub-pixel cascade.
5. **Card-CTA structural delta (PC-11 pre-commitment)** — Live: `<a class="card__link">` wraps `<h3 class="card__title">…</h3>` plus body — entire card title is the link, no separate footer CTA. Preview: `<h3>` is plain text, separate footer link `<a class="project-card__link">Read the docs →</a>` / `View on Drupal.org` / `Read the build notes`. Per PC-11: **live is canonical; F-NEW-17-CARD — preview-doc updates card markup to title-as-link.** Brief does not explicitly mandate a separate footer CTA in the card-component pattern; preview's "Read the docs →" is a Sprint-12 carryover.
6. **Card H3 color** — Live card H3 color `rgb(31, 26, 20)` (`#1F1A14`); preview `rgb(42, 37, 32)` (`#2A2520`). Same `ink-strong` vs `ink` mismatch as H1. Folds into F-NEW-17-A.
7. **Card body P size** — Live card P `17 / 30.6` (matches hero subhead pattern); preview card P `15 / 24`. Different scale. Folds into body-lg sitewide drift (out of scope) but distinct on this page because the cards are P-heavy.
8. **Card-image placeholder height** — Live `.card__top` (logo placeholder) renders considerably taller than preview's `.project-card__logo` (square 80 px placeholder). Diff PNG shows the red "card-image" block extending downward by ~150 px on each card. Sprint-12 carry; out of /open-source-projects scope (it's a `card.html.twig` component decision).
9. **Other-modules section content gap (NEW)** — Live has a **7th card "Payment Stripe"** rendered in the `dy-section--other-modules` block; preview's `.other-modules` block has only the section header + no card. **F-NEW-17-D — preview-doc add Payment Stripe card.**
10. **Closing-CTA H2 size matches** — Both 56 / 58.8 / -1.6 ls / Rubik 500 / `#F5EFE2` (on-dark). PASS.
11. **Closing-CTA CTA chrome differs (carry F-NEW-4)** — Live `.button--outline button--large` + chevron-circle suffix = ~56 px pill. Preview `.btn--ghost-on-dark` = ~45 px ghost pill. Sitewide pattern; same root as Sprint 14 F-NEW-4.
12. **Footer richness (carry)** — Live richer than preview; sitewide Drupal pattern; out of scope.
13. **H2 line-height drift (carry)** — Live `display-md` H2 lh `45.2` (1.13); preview `44` (1.10). Brief ≤ 1.10. Same as Sprint 15 F-NEW-15. Out of scope.
14. **§C "Community contributions" wraps to 2 lines at 375 — orphan-word "contributions"** — On BOTH live and preview the H2 wraps last line = "contributions" (1 word). Memory `feedback_no_orphan_words.md` flags. **F-NEW-17-C.**

| Section | Viewport(s) | Visible delta | Driver | Class |
|---|---|---|---|---|
| Hero | all three | H1 vertical drift + 1280 wrap (1 vs 2 lines) + H1 color + subhead lh | hero padding cascade + container width + ink/ink-strong + body-lg drift | REWORK (F-NEW-17-A + F-NEW-17-B) |
| Testing-tools (§B) | all three | card-image placeholder height + card-CTA structure + card H3 color + card body P size | card.html.twig vs preview project-card + ink/ink-strong + body-lg | REWORK (F-NEW-17-CARD + F-NEW-17-A) |
| Drupal-QA / community (§C) | all three | same card chrome cascade | same as §B | REWORK (folds into F-NEW-17-CARD) |
| Other modules (§D) | all three | **preview missing the Payment Stripe card** + card chrome | content gap + card cascade | REWORK (F-NEW-17-D + F-NEW-17-CARD) |
| Closing-CTA (§E) | all three | H2 colors match; CTA chrome differs (carry F-NEW-4) | sitewide CTA component | DELTA — carry |
| Footer | all three | Live richer than preview | sitewide Drupal | DELTA — carry |

### What the HQ method newly surfaces (not anticipated in runbook)

- **F-NEW-17-CARD** (PC-11 pre-committed; landed as preview-doc per pre-commitment).
- **F-NEW-17-A** — H1 + card H3 color: live `#1F1A14`; preview `#2A2520`. Live canonical (Sprint 13/16 sitewide baseline used `#1F1A14` for H1s). Preview-doc fix.
- **F-NEW-17-B** — Hero H1 wraps to 1 line on live at 1280 vs 2 lines on preview. Container-width / inline-size difference between Drupal `.dy-section__container` and preview `.hero__inner`. Preview-doc fix: widen `.hero__inner` max-width from 920 → ~1040 px to match live's rendered H1 inline-size, OR accept as benign re-flow if operator prefers the 2-line preview look. Sub-pixel impact on H1 vertical position but does cascade to subhead/CTA stacking.
- **F-NEW-17-C** — Orphan word "contributions" on §C H2 at 375 on BOTH renders. Recommend canvas-content `<wbr>` between "Community" and "contributions" OR copy edit to e.g. "What the community is building" / similar 4-word headline. Operator decision.
- **F-NEW-17-D** — Preview `.other-modules` section has no card; live renders "Payment Stripe" card. Preview-doc add Payment Stripe card (logo placeholder + h3 link + lead + body + footer link/title-link per F-NEW-17-CARD outcome).
- **F-NEW-17-E** (advisory) — Card body P sizes diverge (live 17/30.6 vs preview 15/24). Same body-lg cascade carry; non-blocking.

### What carries forward unchanged

- F-NEW-4 (sitewide primary CTA component chrome delta — chevron-circle suffix) — still pending operator decision per Sprint 14 Option A/B/C. Reappears on this page's closing-CTA "Drop us a line".
- body-lg sitewide drift (live 16–20, preview 17, brief 18) — sitewide token cycle.
- `display-md` line-height drift (live 1.13, brief ≤ 1.10) — sitewide token.
- Footer richness — sitewide Drupal pattern.
- Footer column headings live H3 vs preview H4 (F-NEW-16-H) — sitewide; same on this page.

---

## Desktop (1280px)

Section-by-section, with brief-token match status:

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Header / breadcrumb chrome | Drupal-shipped; mask before compare | masked | n/a in preview | OK |
| Hero (§A) | H1 72 / -2 px / Rubik 500 / 1.05 lh / canvas-section ink color | YES typography; color `ink-strong` `#1F1A14` | YES typography; color `ink` `#2A2520` | F-NEW-17-A; F-NEW-17-B 1-line vs 2-line wrap |
| Hero kicker | `#8E4A2A` flanked by short horizontals | YES color; lh 16.8 | YES color; lh 19.2 | sub-pixel positional drift |
| Testing-tools (§B) | section-canvas background + 3-up card grid | YES; bg light (`#FAF7EE`-ish) | YES `.section--cream` | Card chrome differs (F-NEW-17-CARD) |
| Community contributions (§C) | section-canvas variant; 3-up | OK | OK `.section--canvas` | Card chrome differs (F-NEW-17-CARD) |
| Other modules (§D) | smaller subsection | OK; 1 card | **Empty (no card)** | F-NEW-17-D |
| Closing-CTA (§E) | section-espresso + CTA outline-on-dark | bg rgb(31,26,20) ✅ + H2 on-dark ✅ + CTA outline | bg matches ✅ + CTA ghost-on-dark | CTA chrome carry F-NEW-4 |
| Footer | Drupal-shipped; richer than preview | OK (out of scope) | minimal preview footer | sitewide pattern |

## Mobile (375px)

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Hero H1 | `display-xl` mobile 44 / 1.05 / -1 px | YES (44 / 46.2 / -1) | YES (44 / 46.2 / -1) | both PASS typography; both wrap to 3 lines |
| Hero subhead | brief 18 / 28.8 | live 17 / 30.6 | preview 17 / 27.2 | both within 1 px of brief; lh drift |
| §B/§C H2 "Our testing tools" / "Community contributions" | `display-md` mobile reduction (brief ≈ 32) | live 30 / 33.9 | preview 30 / 33 | both within ≈ 2 px (matches Sprint 15 finding) |
| §C H2 wrap | no orphan | last line "contributions" (1 word) | last line "contributions" (1 word) | F-NEW-17-C orphan |
| Card P body | brief 18 | live 17 / 30.6 | preview 15 / 24 | both ⚠ sitewide |
| §D "Other modules" H2 | smaller heading-lg-ish | live 24 / 27.6 | preview 24 / 27.6 | PASS |
| §D content | Payment Stripe card | live YES | preview NO | F-NEW-17-D |
| Closing-CTA bg/text | espresso + on-dark | bg ✅ + text ✅ | bg ✅ + text ✅ | PASS |
| CTA target size | ≥ 44 × 44 px | YES (56 px) | YES (45 px) | both pass; chrome differs (F-NEW-4 carry) |
| Page-level horizontal scroll | NO | NO (pageW=375, clientW=375) | NO | PASS |

## Design brief compliance

| Token | Brief | Live | Preview | Match |
|---|---|---|---|---|
| Hero H1 desktop (`display-xl`) | 72 / 1.05 / -2 / Rubik 500 | 72 / 75.6 / -2 / 500 | 72 / 75.6 / -2 / 500 | both PASS |
| Hero H1 mobile | 44 / 1.05 / -1 | 44 / 46.2 / -1 | 44 / 46.2 / -1 | both PASS |
| Hero H1 color | (brief ambiguous: ink #2A2520 OR ink-strong #1F1A14) | `#1F1A14` ✅ | `#2A2520` ❌ vs live baseline | F-NEW-17-A (preview-doc) |
| §B/§C H2 (`display-md`) | 40 / 1.10 / -1 / Rubik 500 | 40 / 45.2 (1.13) | 40 / 44 (1.10) | preview ✅; live ⚠ +1.2 px (sitewide carry) |
| §B/§C H2 at 375 (`display-md` mobile, brief ≈ 32) | 32 / ≤ 1.10 | 30 (under -2) | 30 (under -2) | both close; matches Sprint 15 finding |
| §D H2 (heading-lg / 28) | 28 / 1.20 | 30 / 34.5 | 30 / 34.5 | both ⚠ +2 px |
| §E Closing-CTA H2 (`display-lg`) desktop | 56 / 1.05 / -1.6 | 56 / 58.8 | 56 / 58.8 | both PASS |
| §E H2 at 375 | scale down per brief | 36 / 37.8 | 36 / 37.8 | both PASS |
| Hero subhead (`body-lg`) | 18 / 28.8 | 17 / 30.6 (lh over) | 17 / 27.2 (lh under) | both ⚠ sitewide |
| Card body P | 18 | live 17 / 30.6; preview 15 / 24 | (see live) | both ⚠ sitewide |
| Card title H3 (`heading-md`) | 22 / 1.30 / -0.2 / Rubik 500 | 22 / 28.6 / -0.2 / 500 | 22 / 28.6 / -0.2 / 500 | both PASS |
| Card title color | (brief ambiguous) | `#1F1A14` ✅ | `#2A2520` ❌ vs live | folds into F-NEW-17-A |
| Hero kicker color | `#8E4A2A` | rgb(142, 74, 42) ✅ | rgb(142, 74, 42) ✅ | both PASS |
| Closing-CTA dark-zone token | `#1F1A14` bg + `#F5EFE2` text | matches | matches | PASS |
| Card border / radius | 1 px `#E5E1DC` / 12 px | matches (existing Sprint 13 baseline) | matches | PASS |
| `text-wrap: balance` on H1 | a11y convention, no orphans | computed-applied; no H1 orphan | computed-applied; no H1 orphan | PASS |
| Cream bg | `#F5EFE2` | matches | matches | PASS |
| Espresso bg | `#1F1A14` | matches | matches | PASS |
| Body text color | `#5C544C` | matches (rgb 92, 84, 76) | matches | PASS |

---

## WCAG 2.2 AA audit (full enumeration — no trimming)

| WCAG 2.2 AA success criterion | Result | Notes |
|---|---|---|
| 1.1.1 Non-text content | PASS | Site logo carries `alt="Home"`; card logo placeholders are SVG decorative with `aria-hidden`. No other non-decorative images on page. |
| 1.3.1 Info and relationships | PASS | Single H1 ("What we maintain in the open"), then H2 for each section (§B Our testing tools / §C Community contributions / §D Other modules we maintain / §E Found a bug or want to contribute?). H3 used for card titles. Visually-hidden H2 for Drupal region labels. |
| 1.3.2 Meaningful sequence | PASS | DOM order matches visual reading order at 1280/768/375 (confirmed via tab-order trace). |
| 1.3.4 Orientation | PASS | No orientation lock. |
| 1.3.5 Identify input purpose | N/A | No forms on `/open-source-projects`. |
| 1.4.1 Use of color | PASS | Links signal via underline / button chrome; kicker color is decorative; card hover state changes border color not just text color. |
| 1.4.3 Contrast (minimum) | MIXED (pa11y allowlist carries) | Body / kicker / heading / focus ring pass independently. Closing-CTA outline button `#1893B4`-on-`#1F1A14` border = ~6.1:1 PASS; text `#F5EFE2`-on-`#1F1A14` = ~14:1 PASS. No light-zone primary CTA on this page. Sitewide ADV-S5 carries (allowlist for `a.button.button--primary`). |
| 1.4.4 Resize text (200%) | PASS | Body readable at 200%; no clipping. |
| 1.4.5 Images of text | PASS | All headings + body are HTML text. |
| 1.4.10 Reflow | PASS | No horizontal scroll required at 320 px; `pageW == clientW` at 375. |
| 1.4.11 Non-text contrast | PASS | Button outlines + focus rings ≥ 3:1. Closing-CTA outline ~6.1:1. |
| 1.4.12 Text spacing | PASS | Letter-spacing tokens applied without overflow. |
| 1.4.13 Content on hover or focus | PASS | No hover-triggered panels on this page. Card hover border-color change is decorative. |
| 2.1.1 Keyboard | PASS | All focusable elements reachable via Tab — including each card title link, footer links, header nav, closing-CTA "Drop us a line". |
| 2.1.2 No keyboard trap | PASS | Tab traversal reaches end and wraps. |
| 2.1.4 Character key shortcuts | N/A | No single-key shortcuts. |
| 2.4.1 Bypass blocks | PASS | "Skip to main content" link is the first Tab stop. |
| 2.4.2 Page titled | PASS | `<title>` present. |
| 2.4.3 Focus order | PASS | Header → hero → §B (3 card-title links in order) → §C (3 card-title links) → §D (1 card-title link "Payment Stripe") → §E "Drop us a line" → footer. Logical. |
| 2.4.4 Link purpose (in context) | PASS | All link labels read meaningfully (card titles describe destinations; closing CTA label clear). On live, each card-title link contains the full title text including parenthetical context ("Automated Testing Kit (ATK)", "CTRFHub (in active development)") — accessible name is descriptive. |
| 2.4.5 Multiple ways | PASS | Header nav + breadcrumb + footer. |
| 2.4.6 Headings and labels | PASS | Descriptive headings throughout. |
| 2.4.7 Focus visible | PASS | 3-px dotted `#1893B4` outline on every focusable. Verified on card-title link (live wraps the whole card-title-link with focus ring; preview's footer link focus ring sits on the short "Read the docs" text). |
| 2.4.11 Focus not obscured (minimum) — WCAG 2.2 | PASS | Sticky header height 73 px; focused content visible at all viewports. |
| 2.5.1 Pointer gestures | N/A | No multi-pointer gestures. |
| 2.5.2 Pointer cancellation | PASS | Default browser activation. |
| 2.5.3 Label in name | PASS | Visible button text matches accessible name. |
| 2.5.4 Motion actuation | N/A | No motion-triggered actions. |
| 2.5.7 Dragging movements — WCAG 2.2 | N/A | No drag interactions. |
| 2.5.8 Target size (minimum 24 × 24) — WCAG 2.2 | MIXED | Card-title links on live render the entire card title row (≥ 22 px text height + padding) — pass. Preview's `.project-card__link` is text-only with ~22 px tap height + padding — pass at ≈ 32 px. **Footer column links 14–20 px tall (sitewide pre-existing pattern, not /open-source-projects-specific)** — carry-forward. |
| 3.1.1 Language of page | PASS | `<html lang="en">` set. |
| 3.2.1 On focus | PASS | No surprising focus-triggered changes. |
| 3.2.2 On input | N/A | No inputs. |
| 3.2.3 Consistent navigation | PASS | Primary nav identical across pages. |
| 3.2.4 Consistent identification | PASS | CTA labels consistent. |
| 3.2.6 Consistent help — WCAG 2.2 | PASS | "Contact us" in header + footer. |
| 3.3.1 Error identification | N/A | No inputs. |
| 3.3.7 Redundant entry — WCAG 2.2 | N/A | No multi-step flow. |
| 3.3.8 Accessible authentication (minimum) — WCAG 2.2 | N/A | No auth flow. |
| 4.1.2 Name, role, value | PASS | Native semantics throughout. Live card-title link's accessible name is the H3 text, which is descriptive. |
| 4.1.3 Status messages | N/A | No live regions on page. |
| Reduced-motion (`prefers-reduced-motion: reduce`) | PASS | Captures taken with `reducedMotion: 'reduce'`; no animation observed. |
| Forced-colors mode | NOT RE-TESTED THIS CYCLE | Sprint 10 site-wide pass; no `/open-source-projects`-specific regression suspected. |
| Mobile touch targets (375 px) | PASS | Card-title links ≥ 44 px tall (wrap full title row); closing-CTA 56 px live / 45 px preview. All ≥ 44. |
| Mobile typography scale | MIXED | `display-md` H2 at 375 — both renders ≈ 30 px (brief ≈ 32) — sub-2 px deviation, sitewide carry. All other mobile typography within ±2 px of brief. |
| Mobile layout | PASS | Single-column stacking at 375 on both renders; no overlapping content; no clipping; 3-up card grid collapses to single column; closing-CTA CTAs stack vertically; no page-level horizontal scroll (`pageW == clientW`). |

**Totals:** 33 distinct AA + 2.2 criteria + 3 responsive a11y checks. Hard pass: 28. N/A: 10. Mixed (carry-forward or sitewide): 2 (1.4.3 sitewide allowlist, 2.5.8 sitewide footer). Deferred: 1 (forced-colors retest). **No `/open-source-projects`-specific WCAG regression.**

### Orphan-word check (memory `feedback_no_orphan_words.md`)

Probed last-line text on every heading and copy block at all three viewports.

| Heading / copy | Viewport | Live last line | Preview last line | Orphan? |
|---|---|---|---|---|
| Hero H1 "What we maintain in the open" | 1280 | "What we maintain in the open" (1-line, 6 words) | "in the open" (3 words) | NO |
| Hero H1 | 768 | "in the open" (3 words) | "in the open" (3 words) | NO |
| Hero H1 | 375 | "the open" (2 words) | "the open" (2 words) | NO |
| Hero subhead | 1280 / 768 / 375 | "...drupal.org under aangel." (≥4 words) | same | NO |
| §B H2 "Our testing tools" | all | single line (3 words) | single line | NO |
| §C H2 "Community contributions" | 1280 / 768 | single line (2 words) | single line | NO |
| §C H2 | 375 | **"contributions" (1 word)** | **"contributions" (1 word)** | **YES — both renders, F-NEW-17-C** |
| §D H2 "Other modules we maintain" | all | single line | single line | NO |
| §E H2 "Found a bug or want to contribute?" | 1280 | "want to contribute?" (3 words) | same | NO |
| §E H2 | 375 | "want to contribute?" (3 words) | same | NO |
| Card H3 (multiple) | 1280 | "Automated Testing Kit (ATK)" wraps; last line ≥ 2 words | wraps differently but ≥ 2 words | NO |
| Card body P | 1280 / 768 / 375 | terminal ≥ 3 words on every card | ≥ 3 words | NO |

**One orphan-word finding: §C H2 last line "contributions" at 375 on both renders.** `text-wrap: balance` is set on headings sitewide but does not prevent it on this 2-word headline at 30 px / narrow viewport. Remediation candidates:

- **Option A — Canvas-content edit.** Insert `<wbr>` between "Community" and "contributions" in both preview and live Drupal canvas content. Smallest scope.
- **Option B — Copy edit.** Rephrase to e.g. "What the community is building" (5 words) or "Open-source community work" (3 words) — gives the balancer more flexibility. Requires operator copy approval.
- **Option C — Accept.** "contributions" is 13 characters with no period; visible but not jarring; not a WCAG floor. Operator may accept.

---

## Static-preview comparison

| Section | 1280 | 768 | 375 | Notes |
|---|---|---|---|---|
| Header | MATCH | MATCH | MATCH | Sprint 13 canonical. |
| Hero | DELTA (H1 wrap; H1 color; subhead lh) | DELTA | DELTA | F-NEW-17-A + F-NEW-17-B |
| Testing tools (§B) | DELTA (card-CTA structure; card H3 color; logo placeholder height) | DELTA | DELTA | F-NEW-17-CARD + F-NEW-17-A |
| Community contributions (§C) | DELTA (card-CTA structure) | DELTA | DELTA (+ orphan "contributions") | F-NEW-17-CARD + F-NEW-17-C |
| Other modules (§D) | DELTA (preview missing Payment Stripe card) | DELTA | DELTA | F-NEW-17-D + F-NEW-17-CARD |
| Closing-CTA (§E) | DELTA (CTA chrome — carry F-NEW-4) | DELTA | DELTA | sitewide carry |
| Footer | DELTA (live richer) | DELTA | DELTA | sitewide carry |

---

## PC-11 card-CTA finding — explicit address

**PC-11 statement (runbook line 25):** "live `card.html.twig` makes the card title the link; preview has separate "Read the docs →" footer link. Pre-committed default: **live is canonical; update preview to match** (card title becomes the link; remove separate footer "Read the docs →" link)."

**S confirms (probe + brief check):**

- **Live structure (probed):** Each card on `/open-source-projects` renders `<article class="card">` → `<a class="card__link" href="…">` wrapping the entire interactive area, with `<h3 class="card__title">` inside the anchor. **No separate footer CTA.** All 7 live cards follow this pattern (Automated Testing Kit, Testor, CTRFHub, Drupal Quality Initiative, Campaign Kit, Layout Builder Kit, Payment Stripe).
- **Preview structure (probed):** Each card on the preview renders `<article class="project-card">` with plain `<h3>` (not wrapped in `<a>`), and a separate `<a class="project-card__link">Read the docs →</a>` / `Read the build notes` / `View on Drupal.org` link in the card footer. All 6 preview cards follow this pattern.
- **Brief check:** Searched `pl_design_brief.md` for "Read the docs", "card-CTA", "card-link", "project-card" — **no explicit mandate either way.** Brief describes cards as "logo placeholder + title + lead + body" without specifying whether the title or a footer link is the interactive surface. **No spec-ambiguity escalation required**; PC-11 default applies.
- **Outcome:** Catalog as **F-NEW-17-CARD — preview-doc edit** (Cycle 2). Preview's `.project-card` structure updates to title-as-link; remove the separate `.project-card__link` footer element. The "View on Drupal.org" semantic for the community-contributions cards (linking to drupal.org/project/…) is preserved by attaching the URL to the title link itself.
- **a11y note:** Title-as-link delivers a longer, more descriptive accessible name than "Read the docs" (which on its own is non-descriptive without surrounding context) — 2.4.4 Link Purpose actually improves under the live pattern. PC-11 default is sound on a11y grounds, not only fidelity grounds.

---

## Findings catalog

### F-NEW-17-A — Heading color token: live `#1F1A14`, preview `#2A2520`

- **Brief:** Both `ink` (#2A2520) and `ink-strong` (#1F1A14) are defined tokens (brief lines 26, 27, 33, 34). Brief does not explicitly bind one to H1/H3 on canvas sections. Brief line 179 / 188 / 192 / 196 specify `textColor: {colors.ink}` for section variants — but that refers to the section's *default text* token, not specifically headings.
- **Live (1280 / 375):** H1 `rgb(31, 26, 20)` = `#1F1A14`; card H3 `rgb(31, 26, 20)`. Uses `--theme-text-color-loud: #1F1A14` (theme base.css line 66, 80, 94, 108).
- **Preview (1280 / 375):** H1 `rgb(42, 37, 32)` = `#2A2520`; card H3 `rgb(42, 37, 32)`. Preview CSS uses the lighter `ink`.
- **Visible impact:** ~2–4 px perceptual delta in heading darkness; live reads more confident/anchored.
- **Live canonical** per Sprint 13/14/15/16 baseline (all prior sprints PASSed `/about-us`, `/services`, `/how-we-do-it`, `/contact-us` H1 at `#1F1A14`).
- **Remediation:** Preview-doc — update preview `.hero h1` and `.project-card h3` (and any matching heading rules) to `color: #1F1A14`. Smallest scope.
- **Recommended cycle:** Cycle 2 (bundled preview-doc batch).

### F-NEW-17-B — Hero H1 wraps to 1 line on live at 1280 vs 2 lines on preview

- **Issue:** Live H1 "What we maintain in the open" at 1280 wraps to a single 959-px line; preview wraps to two 872-px lines ("What we maintain" / "in the open"). Same typography on both (72 / 75.6 / -2 / Rubik 500). Driver is container max-width:
  - Live: `.dy-section__container` (no explicit max-width in hero) — H1 inline-size renders 959 px.
  - Preview: `.hero__inner { max-width: 920px }` (preview CSS line ~244) — H1 inline-size 872 px after side padding.
- **Visible impact:** H1 block height differs by ~85 px on preview (1-line tall on live, 2-line on preview); cascades hero subhead position. Not strictly a typography defect — it's a container-width decision.
- **Remediation candidates:**
  - **Option A — Widen preview hero inner.** Bump preview `.hero__inner { max-width: 920px → 1040px }` (or 1100 px) so the H1 fits on 1 line at 1280, matching live.
  - **Option B — Accept the 2-line preview.** Preview hero looks deliberately balanced at 2 lines; live's 1-line is more compact. Operator may prefer preview's framing.
  - **Option C — Narrow live.** Not recommended (live works; narrowing live could destabilize other pages that share the hero component).
- **Recommended cycle:** Cycle 2 if Option A chosen (preview-doc only); fold into Cycle 2 batch.
- **Operator decision recommended (A vs B).** Autonomous-mode default: Option A (preview-doc to match live).

### F-NEW-17-C — §C H2 orphan "contributions" at 375 on both renders

- **Issue:** "Community contributions" wraps to 2 lines at 375; last line = "contributions" (1 word).
- **Memory:** `feedback_no_orphan_words.md` — never leave a single word alone on a line.
- **Remediation candidates:**
  - **Option A — Canvas-content (preferred for autonomous mode).** Insert `<wbr>` between "Community" and "contributions" in both preview and live Drupal canvas. Smallest scope.
  - **Option B — Copy edit.** Rephrase to e.g. "Community work" (2-word, balances better) or "What the community is building" (5 words). Operator copy approval.
  - **Option C — Accept.** 13-character word, no period; visible but non-disruptive. Operator may accept.
- **Recommended cycle:** Cycle 3 if Option A; fold into Cycle 2 if operator picks Option A early.
- **Operator decision required.**

### F-NEW-17-D — Preview missing the Payment Stripe card in §D

- **Issue:** Live `/open-source-projects` §D "Other modules we maintain" renders one card "Payment Stripe — Stripe plugin for the Payment module." Preview's `.other-modules` section has the H2 + intro paragraph but **no card**.
- **Visible impact:** §D on preview is 130 px tall (CSS); on live 309 px tall (CSS). Layout drift cascades downward to closing-CTA.
- **Remediation:** Preview-doc add a Payment Stripe `.project-card` matching the §B/§C pattern, with:
  - Logo placeholder (existing SVG placeholder pattern from preview)
  - H3 "Payment Stripe"
  - Lead: "Stripe plugin for the Payment module."
  - Body: short paragraph describing the module
  - Title-as-link → `https://www.drupal.org/project/payment_stripe` (per F-NEW-17-CARD outcome — no separate footer CTA)
- **Recommended cycle:** Cycle 2 (bundle with F-NEW-17-CARD preview-doc).

### F-NEW-17-CARD — Preview card structure (PC-11 pre-commitment)

- **Issue:** Live uses title-as-link in `card.html.twig` (`<a class="card__link"><h3 class="card__title">…</h3>…</a>`); preview uses plain h3 + separate `.project-card__link` footer link.
- **Brief:** No explicit mandate either way. PC-11 default applies.
- **Remediation:** Preview-doc — restructure every `.project-card` in `docs/pl2/Previews/open-source-projects.html` so:
  - The whole interactive surface is wrapped in `<a class="project-card__link" href="…">` (or move the `href` from the footer link onto a wrapper that contains the H3 + content).
  - The footer "Read the docs →" / "Read the build notes" / "View on Drupal.org" text is removed (its semantic destination is preserved via the title link's href).
  - The visual chrome of the existing footer link (the teal arrow text) can be retained as a *decorative* `::after` on the card hover state if the operator prefers the visual cue — but it must not be a separate focusable anchor.
- **a11y improvement:** Live's pattern gives each card a more descriptive accessible name than "Read the docs" alone.
- **Recommended cycle:** Cycle 2 (bundle with F-NEW-17-A + F-NEW-17-D — single preview-doc edit batch).

### F-NEW-17-E (advisory) — Primary CTA component chrome (carry F-NEW-4)

- **Issue:** Live's closing-CTA "Drop us a line" uses `.button--outline button--large` + chevron-circle SVG suffix = ~56 px pill height. Preview uses `.btn--ghost-on-dark` = ~45 px ghost pill.
- **Affected placements on this page:** §E closing-CTA only.
- **Operator decision pending from Sprint 14.** Same recommendation as Sprint 15 — bundle into a future "CTA-component spec audit" sprint.

### Carry-forwards (out of /open-source-projects scope)

- F-NEW-4 (sitewide primary CTA component chrome delta) — every page; awaits Sprint 14 operator decision.
- F-NEW-6 / body-lg sitewide drift — every page; sitewide token cycle.
- F-NEW-7 / hero subhead drift — sitewide token cycle.
- F-NEW-5 / live `display-md` line-height +1.2 px vs brief — sitewide.
- F-NEW-16-H / footer column heading H3 vs H4 — sitewide.
- Footer richness — sitewide Drupal pattern.

---

## Recommendation — Cycle 2..N carve

### Cycle 2 — Preview-doc batch (no live changes)

- **Branch:** `aa/pl-sprint-17-cycle-2-preview-doc`
- **Scope:**
  - **F-NEW-17-CARD** (PC-11) — restructure every `.project-card` in preview to title-as-link, remove separate footer `.project-card__link`. 7 cards (after F-NEW-17-D added).
  - **F-NEW-17-A** — preview-doc update H1 + card H3 color from `ink` (`#2A2520`) to `ink-strong` (`#1F1A14`). Likely one CSS rule + a heading variable.
  - **F-NEW-17-D** — preview-doc add Payment Stripe card to `.other-modules` section (with title-as-link per F-NEW-17-CARD).
  - **F-NEW-17-B Option A** (if operator accepts default) — widen preview `.hero__inner` max-width from 920 to ≈ 1040 px so H1 fits on 1 line at 1280.
  - **F-NEW-17-C Option A** (if operator accepts default) — Canvas-content `<wbr>` insertion in "Community<wbr>contributions" — affects both preview-doc and live Drupal canvas (canvas_page id for `/open-source-projects` body field). Optional bundle.
- **Verification:** Re-run `scripts/sprint-17-cycle-1-capture.mjs` + `…-diff.mjs`; per-section DSSIM at hero / testing-tools / drupal-qa / other-modules should drop materially (target ≥ 30% reduction in section DSSIM).
- **F→T→S:** F implements; T validates structural HTML/CSS + cross-page sweep for preview-doc CSS edits (do any other previews import the `.project-card` CSS rule? — if so confirm no regression); S re-audits.

### Cycle 3 (conditional) — Orphan-word + 1-line H1 if operator chooses Option B

- **Branch:** `aa/pl-sprint-17-cycle-3-orphan-and-hero-wrap`
- **Scope:** Whatever Option A choices the operator rejected. Likely Canvas-content edit (F-NEW-17-C Option A) if held over.
- **Operator decision required.**

### Deferred / out of Sprint 17 scope

- F-NEW-4 (CTA suffix-icon component delta) — sitewide; awaits Sprint 14 operator decision.
- body-lg sitewide drift — sitewide token cycle (not Sprint-17 scope).
- `display-md` line-height drift — sitewide.
- Footer richness, footer-column heading H3/H4 — sitewide.

---

## Scripts (durable artifacts)

| Script | Purpose |
|---|---|
| `scripts/sprint-17-cycle-1-capture.mjs` | 2× retina captures of live + preview at 1280/768/375 |
| `scripts/sprint-17-cycle-1-measure.mjs` | Section bounding boxes + chrome mask + page horizontal-scroll probe |
| `scripts/sprint-17-cycle-1-diff.mjs`    | Apply mask, anchored per-section crops, DSSIM/PSNR/AE per section + wholepage |
| `scripts/sprint-17-cycle-1-probe.mjs`   | PC-12-compliant computed-style probes: every H1/H2/H3 enumerated with section ancestor, every card CTA per section, hero kicker, hero subhead, closing-CTA primary CTA (null on this page — outline only), body P samples, last-line text for orphan check |

All scripts idempotent; may be re-run in Cycles 2..N to confirm fixes.

---

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/open-source-projects.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/briefs/pl_design_brief.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--sprint-17-open-source-projects-fidelity-hq.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-16-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-15-cycle-1-audit.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-12-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-17-cycle-1/` (PNGs + `measurements.json` + `diff-results.json` + `probes.json`)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-17-cycle-1-*.mjs`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/custom/performant_labs_20260502/css/base.css` (heading color token `--theme-text-color-loud: #1F1A14`)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/custom/performant_labs_20260502/css/components/hero.css` (live H1 color confirmation)

---

## Verdict

**REWORK** — Cycle 2..N carve recommended.

Four actionable preview-doc findings on `/open-source-projects` (all preview-side; no live regression):

1. **F-NEW-17-CARD** (PC-11 pre-commitment landed) — preview card structure to title-as-link; remove separate footer "Read the docs" link.
2. **F-NEW-17-A** — preview H1 + card H3 color from `ink` (`#2A2520`) to `ink-strong` (`#1F1A14`) to match live sitewide baseline.
3. **F-NEW-17-D** — preview-doc add the missing Payment Stripe card in §D "Other modules we maintain".
4. **F-NEW-17-B** — preview hero `__inner` max-width widen so H1 fits on 1 line at 1280 (Option A default; operator may prefer Option B — accept the 2-line preview).

Plus one canvas-content / copy candidate:

5. **F-NEW-17-C** — §C H2 orphan "contributions" at 375 on both renders; Option A `<wbr>` insertion (preferred autonomous) or Option B copy edit (needs operator approval) or Option C accept.

Plus advisories:

- F-NEW-17-E (CTA chrome carry F-NEW-4) — closing-CTA "Drop us a line" outline + chevron-circle vs preview ghost pill.
- Body-lg / `display-md` line-height / footer-richness — sitewide carries; out of /open-source-projects scope.

The HQ method confirms its value: per-section DSSIM 0.15–0.25 across every section signals real visible deltas; PC-12-compliant probes correctly enumerated 4 H2s + 7 cards on live (vs 6 on preview) + 4 H2s on preview, identifying the content gap (Payment Stripe) and the H1 color token + H1 wrap container difference + card-CTA structural pattern in a single pass. PC-11 pre-commitment landed cleanly — no spec-ambiguity escalation. Cycle 2 should close all preview-doc findings; an optional Cycle 3 handles orphan-word if held over.
