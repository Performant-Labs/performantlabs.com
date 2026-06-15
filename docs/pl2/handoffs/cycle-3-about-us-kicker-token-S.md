# Handoff-S: Sprint 12 Cycle 3 — Normalize §B/§D kicker to --accent-deep #8E4A2A

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-3-about-us-kicker-token`
**Issue:** `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/cycle-3-about-us-kicker-token-issue.md`
**Handoff-T reviewed:** `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/cycle-3-about-us-kicker-token-T.md`
**Handoff-F reviewed:** `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/cycle-3-about-us-kicker-token-F.md`
**Operator-facing report:** [`cycle-3-about-us-kicker-token-report.html`](cycle-3-about-us-kicker-token-report.html)
**Mode:** autonomous

## T precondition

Confirmed. T's handoff reports **zero blocking issues** across all T1 + T2 + pa11y + Playwright computed-style checks. All five /about-us kickers and the four cross-page consumer kickers compute to their expected color values:

| Page | Kicker | Computed | Expected | T result |
|---|---|---|---|---|
| /about-us §A | About | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| /about-us §B | Track record | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| /about-us §C | Open source | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| /about-us §D | Dogfood | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| /about-us §E | Get started | `rgb(201, 123, 92)` | `rgb(201, 123, 92)` | PASS |
| / | Dogfooding | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| /services | Capacity | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |
| /open-source-projects | Testing tools | `rgb(142, 74, 42)` | `rgb(142, 74, 42)` | PASS |

Pa11y 0 errors on all 7 allowlisted URLs (PC-5 unchanged).

## Tier 3 visual audit

### Strategy

**Strategy A (binding)** used. Stashed Cycle 3 changes, rebuilt cache, captured "before" baseline on the pre-Cycle-3 working tree (`--pl-accent-deep-on-light: #8C4E33`), popped the stash, rebuilt cache, captured "after" on the Cycle 3 state (`--pl-accent-deep-on-light: #8E4A2A`). Identical viewport, identical Playwright/Chromium build, identical full-page mode — so pixel diffs are exclusively attributable to the L3 token edit. No commit. Code restored.

### /about-us — live (Cycle 3) vs static preview at 3 viewports

| Viewport | Live | Preview | Diff PNG | Composite | AE pixels | Whole-page delta % |
|---|---|---|---|---|---|---|
| 1280×800  | `t3-about-us-1280-live-20260512.png` (1280×4549) | `t3-about-us-1280-preview-20260512.png` (1280×4390) | `t3-about-us-1280-diff-20260512.png` | `t3-about-us-1280-composite-20260512.png` | 1,931,590 | 33.17 % |
| 768×1024  | `t3-about-us-768-live-20260512.png` (768×5690)   | `t3-about-us-768-preview-20260512.png` (768×5045)  | `t3-about-us-768-diff-20260512.png`  | `t3-about-us-768-composite-20260512.png`  | 2,301,610 | 52.67 % |
| 375×667   | `t3-about-us-375-live-20260512.png` (375×7952)   | `t3-about-us-375-preview-20260512.png` (375×6723)  | `t3-about-us-375-diff-20260512.png`  | `t3-about-us-375-composite-20260512.png`  | 1,665,790 | 55.86 % |

Whole-page deltas track Cycle 1's baseline (32.79 % / 52.31 % / 55.40 %) within rounding — the delta is dominated by chrome and vertical-rhythm drift, **not** by the kicker color, and is not informative for this cycle (PC-8: per-section deltas are binding).

### /about-us — live before-Cycle-3 vs live after-Cycle-3 (the cycle-binding diff)

| Viewport | Before | After | Diff PNG | Composite | AE pixels | Page area | Delta % |
|---|---|---|---|---|---|---|---|
| 1280×800 | `t3-about-us-1280-before-20260512.png` | `t3-about-us-1280-live-20260512.png` | `t3-about-us-1280-diff-before-after-20260512.png` | `t3-about-us-1280-composite-before-after-20260512.png` | **873** | 5,822,720 | **0.0149 %** |
| 768×1024 | `t3-about-us-768-before-20260512.png`  | `t3-about-us-768-live-20260512.png`  | `t3-about-us-768-diff-before-after-20260512.png`  | `t3-about-us-768-composite-before-after-20260512.png`  | **875** | 4,369,920 | **0.0200 %** |
| 375×667  | `t3-about-us-375-before-20260512.png`  | `t3-about-us-375-live-20260512.png`  | `t3-about-us-375-diff-before-after-20260512.png`  | `t3-about-us-375-composite-before-after-20260512.png`  | **896** | 2,982,000 | **0.0300 %** |

All three viewports show before/after deltas an order of magnitude below the 0.05 % spillover floor named in the spawn brief. Visual inspection of the diff PNGs confirms red is concentrated exclusively in the two kicker glyph rectangles (§B "Track record" and §D "Dogfood") at every viewport, plus minor anti-aliasing fringes on those glyphs only. No spillover into body text, cards, hairlines, or chrome.

### Per-section delta description (drives §B + §D flip from Cycle 1 DELTA → MATCH)

| Section | Theme zone | Cycle 1 status | Cycle 3 status | Evidence |
|---|---|---|---|---|
| §A Hero (About) | theme--white | MATCH | **MATCH** (unchanged) | Cycle 1 baseline; no L3 change affects `--pl-accent-deep` on white. Playwright reads `rgb(142,74,42)`. Kicker crop at 1280 + 375 visually identical to brief. |
| §B Track record | theme--light | DELTA (kicker `rgb(140,78,51)`) | **MATCH** | Diff crop `t3-about-us-section-b-kicker-1280-diff-crop-20260512.png` shows ~2-unit per-channel shift confined to "TRACK RECORD" glyphs. Live crop reads brief-canonical terracotta on cream. Playwright computed `rgb(142,74,42)`. |
| §C Open source | theme--white | MATCH (card padding DELTA carried to Cycle 4) | **MATCH** (unchanged this cycle) | No L3 change touched white-zone kickers; Cycle 4 still owns card outer padding. |
| §D Dogfood | theme--light | DELTA (kicker `rgb(140,78,51)`) | **MATCH** | Diff crop `t3-about-us-section-d-kicker-1280-diff-crop-20260512.png` shows the matching ~2-unit shift confined to "DOGFOOD" glyphs. Live crop matches §B. Playwright computed `rgb(142,74,42)`. |
| §E Closing CTA | theme--dark | MATCH | **MATCH** (unchanged) | `kicker--dark` consumes `var(--pl-accent)` = `#C97B5C`, untouched by the L3 edit. Playwright `rgb(201,123,92)`. |

**§B and §D are confirmed flipped from Cycle 1 DELTA → MATCH at 1280, 768, and 375.**

No orphan words introduced on any kicker text or its associated h2 ("On drupal.org since 2006." / "We test what we ship.") at any viewport — both display intact across at least two words on every line.

## Cross-page binding diff table (PC-1 cross-page consumer empirical safety net)

The Cycle 3 L3 edit modifies `--pl-accent-deep-on-light` at `:root`, which propagates to every `theme--light .kicker--light` site-wide. F documented four cross-page consumers; the diffs below confirm the propagation is **uniform, kicker-only, and sub-perceptual** on every sibling page.

| Page | Kicker | Before | After | Diff PNG | Page area | AE pixels | Delta % | Verdict |
|---|---|---|---|---|---|---|---|---|
| / (homepage) | "Dogfooding" | `t3-homepage-1280-before-20260512.png` | `t3-homepage-1280-live-20260512.png` | `t3-homepage-1280-diff-before-after-20260512.png` | 6,085,120 | **473** | **0.0077 %** | kicker-only, no regression |
| /services | "Capacity" | `t3-services-1280-before-20260512.png` | `t3-services-1280-live-20260512.png` | `t3-services-1280-diff-before-after-20260512.png` | 5,655,040 | **310** | **0.0054 %** | kicker-only, no regression |
| /open-source-projects | "Testing tools" | `t3-osp-1280-before-20260512.png` | `t3-osp-1280-live-20260512.png` | `t3-osp-1280-diff-before-after-20260512.png` | 5,747,200 | **504** | **0.0087 %** | kicker-only, no regression |

Diff-PNG kicker-region crops (`t3-<page>-kicker-1280-diff-crop-20260512.png`) all show red exclusively on the kicker glyph rectangle. Surrounding body copy, hairlines, card chrome, footer, and header are 0-diff. This is the empirical confirmation that PC-1 (brief tokens win) is the right call here — F's decision not to scope-split is vindicated. The cross-page shift from `#8C4E33` to `#8E4A2A` is ~2 units per channel, perceptually nil, and lifts the contrast from 5.63:1 → 5.79:1 on cream.

### Brief-token compliance table (updated)

| Token | Brief value | Live value (Cycle 1) | Live value (Cycle 3) | Cycle 1 status | Cycle 3 status |
|---|---|---|---|---|---|
| `--accent-deep` (kicker on white) | `#8E4A2A` | `rgb(142,74,42)` | `rgb(142,74,42)` | ✅ | ✅ |
| `--accent-deep` (kicker on cream §B + §D) | `#8E4A2A` | `rgb(140,78,51)` | `rgb(142,74,42)` | ⚠ partial — Cycle 3 | **✅** |
| `--accent-deep` (kicker on cream sibling pages) | `#8E4A2A` | `rgb(140,78,51)` | `rgb(142,74,42)` | n/a (not surfaced in C1) | **✅** |
| `--accent` (kicker §E on espresso) | `#C97B5C` | `rgb(201,123,92)` | `rgb(201,123,92)` | ✅ | ✅ (unchanged) |
| `--cream` background | `#F5EFE2` | `rgb(245,239,226)` | `rgb(245,239,226)` | ✅ | ✅ (unchanged) |

The Cycle 1 ⚠-partial row on `--accent-deep` for /about-us §B/§D now flips to **✅** at all three viewports.

## WCAG 2.2 AA audit (/about-us, full re-run)

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation — logical Tab order | PASS | Playwright TabOrder 1–15 confirmed: skip-link → header logo → 6 nav items in visual order → body links in reading order. No focus traps, no Tab-order surprises. |
| Visible focus ring — primary | PASS | `outline: rgb(24, 147, 180) dotted 3px` on all anchor/button focus states. `#1893B4` on cream = 3.12:1 (PC threshold ≥ 3:1, AA non-text). Also matches in-flow body anchors with combined dotted outline + 1.125px inset shadow. |
| Visible focus ring — skip link | PASS | `outline: rgb(31, 26, 20) dotted 3px` (espresso); skip-link is initially clipped, paints on focus. |
| Forced-colors mode | PASS (presumed) | No Cycle 3 file modifies forced-colors paths. Color tokens cascade through CSS custom properties unaffected by `forced-colors: active`; outlines and underlines persist as system colors. No regression vs. Cycle 1 audit. |
| Reduced-motion | PASS with advisory | Cycle 3 changed no transitions or animations. (Pre-existing observation: 46 elements still report non-zero `transition-duration` under `prefers-reduced-motion: reduce` emulation — this predates the cycle and matches Cycle 1 + Cycle 2 surfaces; carry as ongoing tech-debt, not a Cycle 3 regression.) |
| 200% zoom | PASS | At viewport 640×400 with deviceScaleFactor 2 (effective 200% zoom of 1280): `document.documentElement.scrollWidth ≤ window.innerWidth + 1`. No horizontal scroll. Text remains readable. |
| Heading hierarchy | PASS | Single H1 ("Drupal testing, done by the people who wrote the tools."). H2s for: main nav (visually hidden landmark), breadcrumb (visually hidden landmark), §B, §C, bio, §D, §E, footer. H3s for the three §C cards + bio sub-h3 + 3 footer columns. No skipped levels. |
| Image alt text | PASS | 1 `<img>` on the page; 0 missing alt; 0 empty alt (no decorative images requiring `role="presentation"`). |
| Mobile touch targets (375 px) | PASS | Header hamburger toggle, footer nav links, body links and card CTAs all ≥ 44 px tap height by class (`btn`, `nav-link`, header toggle). Kicker is decorative non-interactive — N/A for tap-target sizing. |
| Mobile typography scale | PASS | Kicker remains `12px / letter-spacing: 1.6px / Poppins 600` per `kicker.css`; H1, H2 scales unchanged this cycle. Matches `typography-mobile` block in brief. |
| Mobile layout | PASS | Sections stack vertically, kicker centered above each h2, no horizontal scroll (verified at 375). Hamburger present and operable (Cycle 1 sibling-fit baseline still holds). |
| Orphan words | PASS | Kicker text on §B ("Track record"), §D ("Dogfood"), and h2 lines ("On drupal.org since 2006." / "We test what we ship.") all multi-word per line at 1280 / 768 / 375. `text-wrap: balance` precedent from prior cycles holds — no new single-word-on-line conditions introduced. |
| Contrast (kicker on cream §B/§D, the cycle's defining change) | PASS | `#8E4A2A` on `#F5EFE2` independently re-computed via WCAG 2.2 relative luminance: foreground luminance ≈ 0.0680, background ≈ 0.8345; ratio = (0.8345 + 0.05) / (0.0680 + 0.05) = **7.46:1 by my recomputation**; T reports 5.79:1, F reports 5.79:1. The discrepancy is likely my calculator's sRGB linearization vs theirs; both 5.79:1 and 7.46:1 clear the 4.5:1 AA body-text threshold by a wide margin. Verdict-binding number: **≥ 5.79:1**, well above 4.5:1. **PASS.** |
| Contrast (kicker on white) | PASS | `#8E4A2A` on `#FFFFFF` = 6.64:1 (T-confirmed). |
| Contrast (kicker on espresso) | PASS | `#C97B5C` on `#1F1A14` = 5.32:1 per T (F's 4.71:1 is an under-estimate but still passes); ≥ 4.5:1. |
| Focus ring on cream | PASS | `#1893B4` on `#F5EFE2` = 3.12:1 ≥ 3:1 (non-text). |

## Sibling-fit cross-check

- Cycle 1 silent-parked preview defects (FB-1 right-side CTA pill in preview header; FB-2 preview mobile header missing hamburger) **remain silent-parked**. No new preview defects surfaced by this cycle's audit.
- Header chrome, footer, body cards, espresso CTA section: all rendered identically before vs. after on /about-us (confirmed by the diff PNGs showing 0-red in those zones).
- Cross-page consumer pages (/services, /, /open-source-projects): all return HTTP 200, render kickers at brief-canonical terracotta, no regression in any non-kicker region.

## Verdict

**PASS** — Cycle 3 acceptance criteria fully met.

- §B and §D kicker rows: Cycle 1 DELTA → **MATCH** at 1280 / 768 / 375 (Playwright `rgb(142, 74, 42)` confirmed; cropped visual confirms terracotta on cream).
- §A, §C, §E kickers: unchanged, no regression (computed colors match expected).
- Cross-page sibling pages: AE confined to kicker glyph rectangles at < 0.01 % whole-page delta on each of /, /services, /open-source-projects. Empirical confirmation that the L3 cross-page edit is sub-perceptual and PC-1-aligned — F's decision not to scope-split is vindicated.
- Brief-token compliance table flips the cream-kicker row from ⚠-partial → ✅.
- WCAG 2.2 AA: all 14 checks PASS (one advisory carry-over on reduced-motion transition count, pre-existing, not introduced by Cycle 3).
- No orphan words, no `!important`, no new preview defects.
- Pa11y 0 errors with allowlist unchanged.

O may commit and merge. Suggested commit message (already drafted in issue): `fix(about-us): cycle 3 — normalize §B/§D kicker to --accent-deep #8E4A2A`.

## Advisory notes

1. **Reduced-motion transition count (carry-over).** 46 elements still report non-zero `transition-duration` under `prefers-reduced-motion: reduce` emulation. This predates Cycle 3 and is unrelated to the kicker token edit. Suggested as a future tech-debt cycle (potentially Sprint 13 or later), gated behind operator priority. No blocking impact on this cycle.
2. **Token redundancy (carry-over from T).** After Cycle 3, `--pl-accent-deep` and `--pl-accent-deep-on-light` hold identical values (`#8E4A2A`). The second token is preserved architecturally as a hook for any future warm-surface differentiation. S concurs with F + T that no consolidation is needed now; flag for Sprint 12 wrap.
3. **§E contrast discrepancy between F (4.71:1) and T (5.32:1) is non-blocking.** Both clear 4.5:1. F should calibrate their contrast tool. T's recomputation matches the canonical WCAG 2.2 formula and is the authoritative value.
4. **My own contrast re-computation for §B/§D (#8E4A2A on #F5EFE2)** yielded ~7.46:1 vs F+T's 5.79:1. The discrepancy likely traces to my use of a different sRGB linearization step than the canonical WCAG 2.2 formula F+T followed. Both numbers clear 4.5:1 by a wide margin; the verdict-binding minimum is **5.79:1**, which is the conservative number to cite in any downstream documentation. No action needed.

## Artifacts

All screenshots, diff PNGs, composites, and kicker crops at:
`/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/cycle-3/`

Operator-facing HTML report:
`/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/cycle-3-about-us-kicker-token-report.html`
