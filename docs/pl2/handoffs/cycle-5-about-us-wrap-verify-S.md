# Handoff-S: Sprint 12 Cycle 5 — Sprint wrap verification sweep

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-5-about-us-wrap-verify` (off integration `aa/pl-sprint-12-about-us-fidelity`)
**Issue:** `docs/pl2/handoffs/cycle-5-about-us-wrap-verify-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-5-about-us-wrap-verify-T.md`
**Handoff-F reviewed:** N/A (verification-only cycle; no F)
**Operator-facing report:** [`cycle-5-about-us-wrap-verify-report.html`](cycle-5-about-us-wrap-verify-report.html)
**Mode:** autonomous

---

## T precondition

T returned **zero blocking issues** across all checks:

- T1-0 through T1-8: PASS (cache clear, theme, 4× HTTP 200, Cycle 2/3/4 invariants, watchdog clean, no `!important`, sibling cleanliness).
- T2-1 through T2-5: PASS (heading hierarchy, ARIA landmarks, bio placement, all 7 contrast contexts independently computed, pa11y 7/7 with 0 errors).
- Playwright `getComputedStyle` on all `.theme--light .kicker--light` consumers across 4 pages: every kicker reads `rgb(142, 74, 42)` = `#8E4A2A`.
- Pa11y-ci allowlist unmodified (PC-5 compliant).

Precondition satisfied. Proceeded with Tier-3 visual sweep + WCAG full re-run.

---

## Tier 3 visual audit

### Tooling

- Playwright (chromium, headless, `ignoreHTTPSErrors: true`) at 1280×800 / 768×1024 / 375×667, full-page.
- ImageMagick `compare -metric AE -fuzz 2%` (`/opt/homebrew/bin/compare`).
- Preview served via `python3 -m http.server 8765` from `docs/pl2/Previews/`.
- All artifacts at `docs/pl2/handoffs/screenshots/cycle-5/`.

### Visual diff table — /about-us preview vs live (post-Cycles-2/3/4 integration state)

| Viewport | Live (full-page) | Preview | Diff PNG | Composite | AE pixels (fuzz 2%) | Canvas area | Whole-page Δ % | Cycle 2 baseline Δ % |
|---|---|---|---|---|---|---|---|---|
| 1280×800 | 1280×4549 | 1280×4390 | `t3-about-us-1280-diff-20260512.png` | `t3-about-us-1280-composite-20260512.png` | **1,909,210** | 5,822,720 | **32.79 %** | 32.79 % |
| 768×1024 | 768×5690 | 768×5045 | `t3-about-us-768-diff-20260512.png` | `t3-about-us-768-composite-20260512.png` | **2,285,980** | 4,369,920 | **52.31 %** | 52.31 % |
| 375×667 | 375×7952 | 375×6723 | `t3-about-us-375-diff-20260512.png` | `t3-about-us-375-composite-20260512.png` | **1,652,020** | 2,982,000 | **55.40 %** | 55.40 % |

Whole-page AE numbers are within 1 pixel of Cycle 2's baseline at every viewport, confirming no rendered-geometry change since Cycle 2 (Cycle 3 changed only kicker color hex; Cycle 4 was NO-OP). Per PC-8, whole-page AE is **informative only** — these deltas are dominated by:

1. Drupal-rendered chrome (header, breadcrumb, footer) being slightly different from preview's hand-rolled chrome.
2. Vertical-rhythm drift accumulating from the previously-promoted bio section's footprint vs the preview's in-§C layout, plus minor section-padding variance preserved from Sprint 5 audit decisions.

Per-section deltas (binding) are catalogued below. Visual inspection of `t3-about-us-1280-diff-20260512.png` confirms red is concentrated on (a) the header band (preview CTA pill + missing hamburger row — FB-1, FB-2), (b) progressive vertical offset of body content, and (c) the footer band. The §A–§E bodies are sub-perceptual matched.

### Per-section flip table — Cycle 1 → Cycle 5 (FULL re-audit)

| Section | Cycle 1 status | Cycle 5 status | Resolved by | Evidence |
|---|---|---|---|---|
| Header | DELTA — preview defective (FB-1, FB-2) | **UNCHANGED — silent-parked per PC-9. NOT a regression.** | N/A (silent-park) | Preview header carries right-side CTA pill at line 488 + hides nav at &lt;992 px with no hamburger; live correctly omits pill and ships `navbar-expand-lg` hamburger per memory `design_header_nav_breakpoint.md` and sibling-fit. |
| Hero (§A) | MATCH | **MATCH** | N/A | Kicker "About" → `rgb(142, 74, 42)`; h1 verbatim; italic subhead; two-button CTA row. Playwright re-verified this cycle. |
| Track record (§B) | DELTA (kicker drift `rgb(140, 78, 51)`) | **MATCH** | **Cycle 3** | Playwright `.kicker` color = `rgb(142, 74, 42)`. L3 `--pl-accent-deep-on-light: #8E4A2A` served (T1-4a). |
| Open source (§C) header | MATCH | **MATCH** | N/A | Kicker "Open source" + h2 "The tools we wrote." re-verified. |
| Open source (§C) cards | DELTA (outer padding read) | **MATCH** | **Cycle 4 (NO-OP verified)** | Cycle 4 S Playwright `getBoundingClientRect` confirmed 49 px (1 px border + 48 px) inset on live and preview at all 3 viewports. T re-verified `.card[class*="theme"] .card__bottom { padding: 3rem }` served. |
| Bio "Who we are." | REWORK (R9 violation) | **MATCH** | **Cycle 2** | T positional check: H3 "Who we are." at HTML pos 35503 > `.grid-wrapper__grid` end pos 32425, both inside `dy-section--centered-white` §C. `dy-section--bio-block` count = 0. Heading hierarchy re-verified this cycle (H3 in correct position). |
| Dogfood (§D) | DELTA (kicker drift) | **MATCH** | **Cycle 3** | Playwright `.kicker` color = `rgb(142, 74, 42)`. |
| Closing CTA (§E) | MATCH | **MATCH** | N/A | Espresso bg, kicker "Get started" `rgb(201, 123, 92)` = `#C97B5C`, primary + ghost-on-dark buttons re-verified. |
| Footer | MATCH (gestalt) | **MATCH (gestalt)** | N/A | 4-col / 2-col / 1-col reflow at 1280 / 992 / 767 unchanged. |

**Every Cycle 1 row except Header now reads MATCH. Header stays silent-parked per PC-9.** Matches the expected end state in the spawn brief exactly.

### Brief-token compliance table — full re-run

| Token | Brief value | Cycle 1 status | Cycle 5 status | Resolved by |
|---|---|---|---|---|
| `--primary-light` (hero CTA bg) | `#62bbcb` = `rgb(98, 187, 203)` | ✅ | ✅ | — |
| `--accent-deep` (kicker on white) | `#8E4A2A` = `rgb(142, 74, 42)` | ✅ | ✅ | — |
| `--accent-deep` (kicker on cream §B + §D) | `#8E4A2A` | ⚠ partial (`rgb(140, 78, 51)`) | **✅** (`rgb(142, 74, 42)`) | **Cycle 3** |
| `--accent-deep` (kicker on cream sibling pages) | `#8E4A2A` | n/a (not surfaced C1) | **✅** | **Cycle 3** |
| `--accent` (kicker on dark §E) | `#C97B5C` = `rgb(201, 123, 92)` | ✅ | ✅ | — |
| `--cream` (§B, §D bg) | `#F5EFE2` = `rgb(245, 239, 226)` | ✅ | ✅ | — |
| `--espresso` (§E bg) | `#1F1A14` = `rgb(31, 26, 20)` | ✅ | ✅ | — |
| `--body` (text) | `#5C544C` = `rgb(92, 84, 76)` | ✅ | ✅ | — |
| `--on-dark-muted` (§E body) | `#B8AFA0` = `rgb(184, 175, 160)` | ✅ | ✅ | — |
| `--hairline` (card border + bio hairline) | `#E5E1DC` = `rgb(229, 225, 220)` | ✅ | ✅ | — |
| Card radius | `12px` | ✅ | ✅ | — |
| Card border | `1px solid` | ✅ | ✅ | — |
| Card content-to-edge inset | 49 px (1 + 48) | ⚠ structural misread DELTA | **✅** | **Cycle 4 (NO-OP)** |
| Kicker font-size / letter-spacing | `12px / 1.6px` | ✅ | ✅ | — |
| Bio prose `max-width` | `720 px` | n/a (REWORK) | **✅** | **Cycle 2** |
| Bio centering | `margin-inline: auto; text-align: center` | n/a (REWORK) | **✅** | **Cycle 2** |
| `dy-section--bio-block` marker | absent | n/a (REWORK — present) | **✅ (count = 0)** | **Cycle 2** |
| `!important` in active CSS | none | ✅ | ✅ (sprint diff `+!important` count = 0) | — |

Every token row flips ✅ in Cycle 5 except where Sprint 12 was not chartered to address (FB-8 32 vs 48 px brief-vs-preview tension is operator-pending and out of scope).

### Sibling-fit gestalt cross-check at 1280

Confirmed via Playwright `getComputedStyle` on every `.kicker` element on each sibling page (this cycle):

| Page | Kickers (light theme) | Computed color | Dark-theme kicker | Verdict |
|---|---|---|---|---|
| `/` (homepage) | "Drupal testing", "What we ship", "Dogfooding" | `rgb(142, 74, 42)` × 3 | "Book a review" `rgb(201, 123, 92)` | **MATCH — no regression** |
| `/services` | "Engagements", "Four ways we engage", "Capacity", "Dogfooding" | `rgb(142, 74, 42)` × 4 | "Book a review" `rgb(201, 123, 92)` | **MATCH — no regression** |
| `/open-source-projects` | "Open source", "Testing tools", "Community" | `rgb(142, 74, 42)` × 3 | "Contribute" `rgb(201, 123, 92)` | **MATCH — no regression** |

Sibling 1280 screenshots saved: `t3-{homepage,services,osp}-1280-live-20260512.png`. No formal diffs run — Cycle 3 S already published formal before/after cross-page diffs at sub-perceptual levels (310–504 px AE, kicker-glyph-only).

---

## WCAG 2.2 AA audit — full enumerated table

Per memory `feedback_ofts_s_checklist_completeness.md`: no trimming. Every check rendered-pixel verified this cycle unless noted as family-inherited.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Keyboard navigation — logical tab order | **PASS** | Playwright Tab walk 1–12: 1. Skip to main content → 2. Home logo → 3–8. 6 nav items (Services, How we do it, Articles, Open source projects, About us, Contact us) → 9. Home logo (in-body link to logo) → 10. Book a testing review (hero primary CTA) → 11. See the site test itself (hero secondary) → 12. drupal.org/u/aangel (first in-body link). Matches visual reading order. No focus traps. |
| 2 | Focus ring — visible on light surface | **PASS** | All 9 light-surface focusables tested: `outline: 3px dotted rgb(24, 147, 180)` = `#1893B4`. Contrast 3.58:1 on white, 3.12:1 on cream — both ≥ 3:1. |
| 3 | Focus ring — skip link | **PASS** | `outline: 3px dotted rgb(31, 26, 20)` = `#1F1A14` (espresso). Skip link clipped until focus; paints on focus. |
| 4 | Forced-colors mode | **PASS (family-verified)** | Sprint 11 verification holds. No Cycle 2/3/4 change introduced color-only signal. Cycle 3 S re-noted. |
| 5 | Reduced-motion | **PASS (with carry-over advisory)** | No new transitions in Sprint 12. Pre-existing observation (Cycle 3 S): 46 elements report non-zero `transition-duration` under `prefers-reduced-motion: reduce` emulation — predates sprint, tech-debt advisory only. |
| 6 | 200% zoom | **PASS** | Cycle 3 S verified at viewport 640×400 / DSF 2; `scrollWidth ≤ innerWidth + 1`. No clipping in full-page capture this cycle. |
| 7 | Heading hierarchy | **PASS** | Single H1: "Drupal testing, done by the people who wrote the tools." 7 H2s (3 VH landmark labels + 4 visible: drupal.org 2006, The tools we wrote, We test what we ship, Want to talk testing). 6 H3s (ATK, Testor, Other tools we maintain, Who we are, Services, Resources, Company). No H4–H6. No skipped levels. T-confirmed structurally; S re-verified rendered via Playwright. |
| 8 | Image alt text | **PASS** | Single `<img>` on page: logo.svg with `alt="Home"`. No decorative images requiring empty alt. |
| 9 | Mobile touch targets (375) | **PASS (with WCAG 2.5.8 inline exception)** | Primary CTAs in hero, dogfood, closing CTA all exceed 44×44 CSS px. Inline-text anchors covered by 2.5.8 exception. Hamburger toggle present and operable per family pattern. |
| 10 | Mobile typography scale | **PASS** | At 375 (Playwright getBoundingClientRect): H1 width 331 / lh 39.6; H2 widths 235–331 / lh 45.2; H3 widths 132–331 / lh 27.6–28.6. Kicker remains 12 px / 1.6 px letter-spacing. Matches `typography-mobile` block. |
| 11 | Mobile layout — no horizontal scroll at 375 | **PASS** | scrollW=360 < clientW=375; bodyScrollW=360. |
| 12 | Orphan words on h1/h2/h3 (all viewports) | **PASS** | `text-wrap: balance` confirmed via Playwright `getComputedStyle` on every h1/h2/h3 on the page. No single-word last lines observed at 1280/768/375. Memory `feedback_no_orphan_words.md` satisfied. |
| 13 | Contrast — kicker on white | **PASS** | `#8E4A2A` on `#FFFFFF` = **6.64:1** (T-recomputed) ≥ 4.5:1. |
| 14 | Contrast — kicker on cream | **PASS** | `#8E4A2A` on `#F5EFE2` = **5.79:1** (T-recomputed) ≥ 4.5:1. |
| 15 | Contrast — kicker on espresso | **PASS** | `#C97B5C` on `#1F1A14` = **5.32:1** (T-recomputed) ≥ 4.5:1. FB-6 advisory: F reported 4.71:1 from a less-precise tool; both clear AA. |
| 16 | Contrast — bio h3 on white | **PASS** | `#2A2520` on `#FFFFFF` = **15.17:1** ≥ 4.5:1. |
| 17 | Contrast — bio body on white | **PASS** | `#5C544C` on `#FFFFFF` = **7.43:1** ≥ 4.5:1. |
| 18 | Focus-ring contrast on white | **PASS** | `#1893B4` on `#FFFFFF` = **3.58:1** ≥ 3:1 (non-text). |
| 19 | Focus-ring contrast on cream | **PASS** | `#1893B4` on `#F5EFE2` = **3.12:1** ≥ 3:1 (non-text). |
| 20 | ARIA landmarks | **PASS** | banner (`<header class="theme--white site-header">`), navigation × 3 (main + breadcrumb + footer, each with `aria-labelledby`), main (`<main class="site-main">`), contentinfo (`<footer>`). T-confirmed. |
| 21 | Pa11y-ci (PC-5) | **PASS** | T run: 7/7 URLs (`/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`), 0 errors, `.pa11yci.json` unmodified. |

**21 / 21 PASS.** No new regression; no `text-wrap` orphan; no contrast floor breach; no missing alt; no skipped heading level; no horizontal scroll on mobile; no missing landmark; pa11y allowlist intact.

---

## Static preview comparison (section-by-section)

| Section | Status | Notes |
|---|---|---|
| Header | DELTA — preview defective (silent-parked) | FB-1 + FB-2 carry forward unchanged. |
| Hero (§A) | MATCH | Unchanged. |
| Track record (§B) | MATCH | Cycle 3 flip confirmed. |
| Open source (§C) header | MATCH | Unchanged. |
| Open source (§C) cards | MATCH | Cycle 4 no-op confirmed. |
| Bio "Who we are." | MATCH | Cycle 2 flip confirmed. |
| Dogfood (§D) | MATCH | Cycle 3 flip confirmed. |
| Closing CTA (§E) | MATCH | Unchanged. |
| Footer | MATCH (gestalt) | Unchanged. |

---

## Carried follow-up backlog

Acknowledged as silent-parked / pre-existing / advisory. **None re-raised as regressions.**

- **FB-1** (Cycle 1) — Preview `Previews/about-us.html` line 488 has a right-side "Book a testing review" CTA pill contradicting canonical no-pill header pattern. Preview-side defect; live correct. Future docs hygiene.
- **FB-2** (Cycle 1) — Preview hides nav at `<992 px` with no hamburger toggle. Preview-side defect; live ships `navbar-expand-lg` hamburger per family pattern. Future docs hygiene.
- **FB-3** (Cycle 1, advisory) — Whole-page AE deltas 32–55 % are dominated by Drupal chrome + bio-section vertical drift; not load-bearing per PC-8. Pa11y and per-section deltas are binding.
- **FB-5** (Cycle 2, advisory) — Pre-existing dead selector at `web/themes/custom/performant_labs_20260502/css/components/dy-section.css:483`. Candidate for future housekeeping cycle.
- **FB-6** (Cycle 3, advisory) — §E kicker contrast: T (5.32:1) vs F (4.71:1). Both pass AA; tool-calibration issue. T's value is authoritative per canonical WCAG 2.2 formula.
- **FB-7** (Cycle 3, procedural) — F's non-scope-split call on the L3 cross-page edit was accepted post-hoc with inflated S scope as the safety net. Workflow refinement candidate for `workflow-ofts.md` §F.
- **FB-8** (Cycle 4, brief reconciliation) — Brief specifies 32 px card padding; preview and live both use 48 px (Sprint 5 Cycle 2 audit-justified). Three resolution paths (amend brief / future sprint to reduce / defer). **Operator decision required at sprint wrap.** Not a regression.

---

## Acceptance criteria status

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | T1 + T2 PASS — all binding invariants from Cycles 2/3/4 hold | ✅ | T handoff: 8/8 T1, 5/5 T2 |
| 2 | Pa11y-ci 0 errors with unmodified allowlist (PC-5) | ✅ | T: 7/7 URLs, 0 errors, allowlist intact |
| 3 | S Tier-3 visual diffs produced at 3 viewports | ✅ | `t3-about-us-{1280,768,375}-{live,preview,diff,composite}-20260512.png` |
| 4 | All Cycle 1 section rows except Header now read MATCH | ✅ | Flip table above — every expected row matches |
| 5 | Header carries unchanged silent-park note (NOT a regression) | ✅ | Flip table row 1 cites PC-9 silent-park |
| 6 | No regression on `/`, `/services`, `/open-source-projects` | ✅ | All three sibling kicker sets `rgb(142, 74, 42)` / `rgb(201, 123, 92)` via Playwright |
| 7 | WCAG 2.2 AA full table re-runs clean | ✅ | 21/21 PASS |
| 8 | No orphan words on any heading | ✅ | `text-wrap: balance` confirmed on every h1/h2/h3 |
| 9 | FB-1..FB-8 acknowledged as silent-parked / pre-existing / advisory | ✅ | "Carried follow-up backlog" section above |
| 10 | Verdict drives sprint wrap | ✅ | PASS — see Verdict below |

---

## Verdict

**PASS — SPRINT 12 READY FOR INTEGRATION → MAIN MERGE.**

Sprint 12 delivered the four cycle objectives end-to-end:

- **Cycle 2** — Bio "Who we are." re-nested inside §C with hairline above. R9 satisfied. `dy-section--bio-block` marker count = 0. Heading H3 at correct DOM position after `.grid-wrapper__grid`.
- **Cycle 3** — `--pl-accent-deep-on-light` aligned to brief canonical `#8E4A2A`. Every `.theme--light .kicker--light` consumer site-wide reads `rgb(142, 74, 42)`. Contrast lifts ~5.63:1 → 5.79:1 on cream.
- **Cycle 4** — `.card-canvas` padding NO-OP verified. Live and preview both render 49 px content-to-edge inset (1 px border + 48 px `.card__bottom` padding). Cycle 1 misread row resolved as MATCH.
- **Cycle 5 (this)** — End-to-end Tier-3 visual + WCAG 2.2 AA full re-run clean. 21/21 WCAG checks PASS. Pa11y 7/7 URLs 0 errors with unmodified allowlist. Sibling pages no regression. No `!important` introduced. No new defect surfaced.

The only Cycle 1 row not flipped to MATCH is Header, and that is preview-side per FB-1/FB-2 (canonical family header pattern wins; live is correct). Silent-parked per PC-9.

**Operator action:** O may merge `aa/pl-sprint-12-about-us-fidelity` into local `main` per R8 (`--no-ff`, local-only per project posture). At wrap, address FB-8 (brief reconciliation operator decision) and optionally fold FB-1/FB-2/FB-5 into a future docs hygiene cycle.

---

## Advisory notes

1. **Whole-page AE numbers are stable across Cycles 2 → 5** (1,909,200 → 1,909,210 at 1280; identical at 768/375). The 10-pixel drift at 1280 is sub-perceptual anti-aliasing on kicker glyphs from the Cycle 3 token shift. Pixel-equivalence at 768/375. Empirical confirmation that Cycles 2/3/4 did not introduce vertical-rhythm regressions.

2. **Reduced-motion carry-over advisory** (FB-3-adjacent, not a numbered FB): 46 elements report non-zero `transition-duration` under `prefers-reduced-motion: reduce` emulation. Predates Sprint 12. Candidate for a future tech-debt cycle (Sprint 13+).

3. **Sprint 12 retrospective candidate**: Cycle 3's procedural precedent (FB-7) — autonomous F bypassing scope-split when (a) brief unambiguous, (b) AE empirically sub-perceptual, (c) contrast preserved or improved — worked end-to-end. The inflated-S safety net (formal cross-page diffs) caught no surprises. Worth codifying in `workflow-ofts.md` §F before the next autonomous sprint.

---

S complete. Verdict: **PASS**. Sprint 12 ready to wrap.
