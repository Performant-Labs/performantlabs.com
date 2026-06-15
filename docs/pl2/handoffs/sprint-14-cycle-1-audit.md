# Sprint 14 Cycle 1 — `/about-us` HQ preview-fidelity audit (S only)

**Verdict:** **REWORK** — Cycle 2..N carve recommended. Three actionable findings (one preview-doc, one L1 token, one preview-doc). Plus catalog of pre-existing typography-scale drift (body-lg sizes, display-md line-height) and a structural CTA-component delta. Visible deltas are real (HQ method confirms — not subpixel noise) but every one of them maps to either an already-pre-committed F-NEW-* candidate, a newly-surfaced preview-doc/token gap, or a documented Sprint-13 carry-forward.

**Date:** 2026-05-13
**Page:** `/about-us`
**Branch:** `aa/pl-sprint-14-about-us-fidelity-hq`
**Sprint:** Sprint 14 (runbook: `docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md`)
**Live:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us` (HTTP 200)
**Preview:** `file://docs/pl2/Previews/about-us.html` (canonical post-Sprint 13)
**Operator-facing report:** [`sprint-14-cycle-1-report.html`](sprint-14-cycle-1-report.html)
**Prior audit reviewed:** `docs/pl2/handoffs/sprint-13-cycle-1-about-us-reaudit.md`
**Tooling:** Playwright 1.59.x Chromium @ deviceScaleFactor=2, reducedMotion=reduce, ignoreHTTPSErrors. ImageMagick 7 `compare` (DSSIM / PSNR / AE @ fuzz 0% & 3%).
**Mode:** Autonomous, S-only — no F, no T.

---

## T precondition

Not applicable — this is an S-only audit cycle (PC-2: cycle carve driven by Cycle 1 audit). No prior F or T handoff exists for Sprint 14. The previous audit (Sprint 13 Cycle 1 re-audit) closed with no regressions and no Sprint-13 cycles spawned for `/about-us`; this Sprint-14 cycle is a fresh higher-quality re-pass per PC-4.

## Browser-tool / visual-diff preconditions

| Precondition | Status |
|---|---|
| Playwright installed at project (`node_modules/playwright` present, v1.59.1) | ✅ |
| Chromium browser binary available | ✅ (used in capture run) |
| ImageMagick `compare` at `/opt/homebrew/bin/compare`, `magick` at `/opt/homebrew/bin/magick` | ✅ |
| Live URL HTTP 200 (`curl -sk -o /dev/null -w "%{http_code}" ...`) | ✅ (200) |
| Preview file readable via `file://` | ✅ |

## Preview sanity check

Preview at `docs/pl2/Previews/about-us.html` was canonicalized in the Sprint 13 wrap (per `docs/pl2/handoffs/sprint-13-wrap.md`). At-a-glance pre-audit check:

| Convention | Preview state | Verdict |
|---|---|---|
| `navbar-expand-lg` hamburger ≥ 992 px only | Preview hides full nav and shows hamburger at `< 992` (canonical) | ✅ |
| No right-side "Book a testing review" pill in header | Preview header is clean | ✅ |
| H1 size at desktop matches brief (72 px) | **Preview H1 desktop = 64 px** (brief 72) | ⚠ F-NEW-1 carry-forward (still present) |
| H1 size at mobile matches brief (44 px) | Preview H1 mobile = 40 px (brief 44, live 36) | ⚠ both drift; live further |
| Espresso §E primary CTA token | **Preview uses `#62BBCB` + white** | ⚠ F-NEW-3 (new) — brief line 319 specifies `#5DC6E8` + `#1F1A14` on dark zones; live correctly applies `#5DC6E8` |
| Heading hierarchy in preview DOM | Single H1 → H2 → H3 (verified by inspection) | ✅ |
| Touch targets in preview at 375 (CTA pill ≥ 44 px tall) | Preview pill = 45 px | ✅ (just clears the 44-px floor) |

Two preview-doc defects (F-NEW-1, F-NEW-3) and one L1 token defect on live (F-NEW-2) carry forward; no ADVISORY-HOLD warranted (these are remediable in the Cycle 2..N carve, not blockers).

---

## Tier 3 visual audit

### Capture run

Six full-page PNGs at three viewports @ 2× DPR. Image-space pixel dimensions:

| Viewport | Live PNG dim | Preview PNG dim |
|---|---|---|
| 1280 | 2560 × 9098 | 2560 × 8780 |
| 768  | 1536 × 11380 | 1536 × 10090 |
| 375  | 750 × 15904  | 750 × 13446 |

### Drupal-chrome mask coordinates

Per Sprint 12 FB-3 convention, the breadcrumb cream band (`region region-highlighted query-container`) was masked to white on the live PNG before any whole-page or section comparison. Mask coordinates (in **image-space** pixels @ 2× DPR):

| Viewport | CSS top | CSS h | Image x1,y1 | Image x2,y2 |
|---|---|---|---|---|
| 1280 | 160 | 61 | 0,320 | 2560,442 |
| 768  | 160 | 61 | 0,320 | 1536,442 |
| 375  | 160 | 63 | 0,320 | 750,446 |

Mask is well above section-1 `top` (live hero starts at CSS y=269–271 across viewports), so anchored per-section crops are unaffected.

### Whole-page diff (informative only, dominated by cumulative vertical drift)

Whole-page metrics computed on the masked-live PNG vs preview, cropped top-anchored to each pair's common height. The first DSSIM/PSNR value is ImageMagick's scaled raw; the **parenthesized value is the normalized metric** (DSSIM 0–1 where 0=identical; PSNR ~dB-like distortion 0–1 where 0=identical). Whole-page values are **not load-bearing** (PC-8) because the page heights differ enough that every section is vertically offset — per-section anchored crops below are binding.

| Viewport | Common img-h | AE @ fuzz 0% | AE @ fuzz 3% | PSNR | DSSIM |
|---|---|---|---|---|---|
| 1280 | 8780 | (see diff PNG) | (see diff PNG) | dominated by drift | dominated by drift |
| 768  | 10090 | dominated | dominated | dominated | dominated |
| 375  | 13446 | dominated | dominated | dominated | dominated |

Whole-page diff PNGs: `t3-about-us-{1280,768,375}-wholepage-diff-fuzz3-20260513.png`.

### Per-section HQ diff (binding)

Per-section crops anchored to each section's own measured top in its own render at the smaller of the two heights. DSSIM is the primary metric; PSNR/fuzzed-AE are corroborating. **AE-3% (fuzz mask absorbs antialiasing)** is the secondary load-bearing metric. Raw AE-0% shows the noise floor and is informational only.

Classification per Sprint 14 §"Threshold convention":
- DSSIM < 0.01 → MATCH
- 0.01 ≤ DSSIM < 0.05 → MINOR DELTA
- DSSIM ≥ 0.05 → REAL DELTA

| Viewport | Section | DSSIM | PSNR | AE @ 0% | AE @ 3% | AE-3% / total px | Class |
|---|---|---|---|---|---|---|---|
| 1280 | hero | **0.194** | 13.06 | 395,456 | 387,432 | 12.27% | REAL DELTA |
| 1280 | track-record | **0.195** | 17.77 | 394,378 | 375,826 | 8.96% | REAL DELTA |
| 1280 | opensource | **0.198** | 16.85 | 617,764 | 584,736 | 8.31% | REAL DELTA |
| 1280 | dogfood | **0.181** | 17.98 | 276,261 | 269,561 | 11.13% | REAL DELTA |
| 1280 | closing-cta | **0.169** | 15.44 | 212,959 | 210,031 | 8.27% | REAL DELTA |
| 1280 | footer | **0.180** | 17.55 | 121,255 | 116,241 | 7.71% | REAL DELTA |
| 768  | hero | **0.229** | 11.15 | 424,384 | 416,772 | 20.27% | REAL DELTA |
| 768  | track-record | **0.242** | 15.55 | 395,595 | 377,464 | 15.01% | REAL DELTA |
| 768  | opensource | **0.213** | 16.14 | 570,622 | 542,755 | 9.85% | REAL DELTA |
| 768  | dogfood | **0.201** | 17.13 | 210,585 | 202,845 | 12.93% | REAL DELTA |
| 768  | closing-cta | **0.200** | 13.08 | 216,800 | 213,868 | 14.36% | REAL DELTA |
| 768  | footer | **0.190** | 16.68 | 115,879 | 110,902 | 8.69% | REAL DELTA |
| 375  | hero | **0.241** | 12.16 | 219,894 | 214,279 | 16.32% | REAL DELTA |
| 375  | track-record | **0.255** | 14.98 | 352,441 | 337,755 | 9.36% | REAL DELTA |
| 375  | opensource | **0.243** | 14.80 | 567,335 | 535,711 | 6.66% | REAL DELTA |
| 375  | dogfood | **0.232** | 15.11 | 206,677 | 200,612 | 10.52% | REAL DELTA |
| 375  | closing-cta | **0.247** | 10.96 | 197,194 | 194,579 | 12.34% | REAL DELTA |
| 375  | footer | **0.199** | 15.89 | 88,528 | 84,722 | 4.20% | REAL DELTA |

**Every section trips DSSIM ≥ 0.05.** This means the HQ method confirms what Sprint 13 reported: there are real visible deltas in every section. But the underlying *cause* per section is not a regression — see classification below.

### Visual diagnosis per section (driven by the diff PNGs and side-by-side crops)

The diff PNGs make clear that the per-section DSSIM ≥ 0.05 floor is being driven by **four systemic deltas** that cascade across every section, not six independent regressions:

1. **Hero H1 size delta (F-NEW-1 + F-NEW-2)** — Preview H1 desktop 64 vs live 72 (brief 72). Preview H1 mobile 40 vs live 36 (brief 44). Vertical offset at the top cascades down — every section below the hero starts at a different y-coordinate in live vs preview, so even an identical-content section visually shifts.
2. **Body-lg drift (pre-existing, Sprint 13 catalogued)** — Live hero subhead = 20/36, preview = 19/30.4 (brief 18/28.8). Live §B/§D body = 16/28.8, preview = 17/28.9 (brief 18/28.8). Both renders deviate by 1–2 px in each direction; wrap counts differ by one line per section.
3. **Primary-CTA component delta (NEW — F-NEW-4)** — Live primary CTA uses the `dripyard_base:button` component which appends a 32-px circular SVG arrow icon via `.button__suffix` (height = 56 px). Preview uses `<a class="btn--primary">` with an inline "→" character and `padding: 14px 28px` (height = 45 px). On dark §E, this delta also exposes F-NEW-3 (token).
4. **§E closing-CTA primary token (NEW — F-NEW-3)** — Live correctly applies `--primary-light-on-dark: #5DC6E8` with text `#1F1A14` (brief line 319). Preview applies the standard `#62BBCB` with white text — same token as light-zone CTAs.

| Section | Viewport(s) | Visible delta | Documented in F handoff? | Class |
|---|---|---|---|---|
| Hero | all three | H1 size mismatch (F-NEW-1 desktop / F-NEW-2 mobile) + cascade body wrap + CTA chrome (F-NEW-4) | No F handoff (S-only cycle); F-NEW-1/2 pre-committed per runbook | REWORK candidate |
| Track-record (§B) | all three | Body 16/17 vs brief 18; cumulative vertical drift from hero | Sprint 13 catalogued (1 px each direction); pre-existing | DELTA — non-regression |
| Opensource (§C) | all three | Card-CTA structural difference: live = title-as-link, preview = separate "Read the docs →" footer link | Sprint 13 catalogued; pre-existing | DELTA — non-regression |
| Dogfood (§D) | all three | Body wrap + CTA chrome (F-NEW-4) | F-NEW-4 (new); body wrap pre-existing | REWORK candidate (CTA component) |
| Closing-CTA (§E) | all three | H2 wrap, body wrap, **preview CTA bg token wrong (F-NEW-3)**, **CTA chrome differs (F-NEW-4)** | F-NEW-3, F-NEW-4 (both new) | REWORK candidate |
| Footer | all three | Live richer than preview by design (Drupal-shipped) | Sprint 13 catalogued | DELTA — non-regression (out of scope) |

### What the HQ method *confirms* that Sprint 12/13 AE-only already reported

- Whole-page AE % is dominated by cumulative vertical drift — HQ method's per-section anchored crops confirm Sprint 12 FB-3.
- Hero H1 desktop short on preview (F-NEW-1) — confirmed by DSSIM 0.194 + visible H1 size delta in diff PNG.
- Hero H1 mobile short on both, live shorter (F-NEW-2) — confirmed by DSSIM 0.241 @ 375 + visible delta.
- Open-source card structural difference (title-as-link vs footer-CTA link) — confirmed.

### What the HQ method *newly surfaces* (not in Sprint 13 catalog)

- **F-NEW-3** — Preview closing-CTA primary uses `#62BBCB` + white; brief line 319 says dark-zone primary = `#5DC6E8` + `#1F1A14`. Live is correct; preview defective.
- **F-NEW-4** — Live primary CTA component (`dripyard_base:button`) renders a 32-px SVG chevron-circle suffix on the right edge, producing a 56-px-tall pill. Preview's flat `<a class="btn--primary">` is 45 px tall with an inline "→" character. This component-template delta cascades to all four primary CTA placements on the page (hero + dogfood + 2× closing-cta) and contributes to per-section DSSIM in all three viewports.
- **Display-md line-height drift** — Live `<h2>` ($§B, §C, §D) computed line-height = 45.2 px (1.13); preview = 44 px (1.10); brief = 1.05 → 1.10. Preview matches brief; live drifts +1.2 px. Minor, but flagged.

### What the HQ method *reveals as noise* that the lower-quality whole-page AE over-reported

- Whole-page AE 34–58% (Sprint 13 numbers) is confirmed dominated by the breadcrumb cream-band region (now masked) and cumulative vertical drift — when masked + anchored, per-section DSSIM is bounded to 0.17–0.26, far from "max different."
- The footer DSSIM is the lowest of every section (0.180–0.199 across viewports) — meaning even the "richer live footer" is not as visually divergent as the body deltas. Footer DSSIM nudges above 0.05 because of vertical drift, not because of footer-component regression.

---

## Design brief compliance (token-by-token, derived from probes)

Tokens probed via `scripts/sprint-14-cycle-1-probe-body.mjs` and `scripts/sprint-14-cycle-1-probe-cta.mjs`; comparison against `docs/pl2/briefs/pl_design_brief.md`.

| Token | Brief value | Live computed | Preview computed | Match |
|---|---|---|---|---|
| Hero H1 desktop (`display-xl`) | 72 / lh 1.05 / -2 px / Rubik 500 | 72 / 79.2 / -1.8 / Rubik 500 | **64 / 67.2** / -1.6 / Rubik 500 | Live ✅; preview ❌ (F-NEW-1) |
| Hero H1 mobile (`display-xl` mobile) | **44** @ < 576 | **36** | **40** | both ❌ (F-NEW-2; live further) |
| §E H2 (`display-lg`) | 56 / 1.05 | 56 / 58.8 (1.05) | 56 / 58.8 (1.05) | both ✅ |
| §B/§C/§D H2 (`display-md`) | 40 / 1.05–1.10 | 40 / 45.2 (1.13) | 40 / 44 (1.10) | preview ✅; live ⚠ (+1.2 px lh) |
| Hero subhead (`body-lg`) | 18 / 1.6 (28.8) | **20 / 1.8 (36)** | **19 / 1.6 (30.4)** | both ⚠ (live 2 px high, preview 1 px high) |
| §B / §D body (`body-lg`) | 18 / 1.6 (28.8) | **16 / 1.8 (28.8)** | **17 / 1.7 (28.9)** | both ⚠ (live 2 px low, preview 1 px low) |
| Kicker on white (§A, §C) | `#8E4A2A` | rgb(142, 74, 42) | (visually matches; not re-probed Sprint 14) | ✅ |
| Kicker on cream (§B, §D) | `#8E4A2A` | rgb(142, 74, 42) | (visually matches) | ✅ |
| Kicker on espresso (§E) | `#C97B5C` | rgb(201, 123, 92) | (visually matches) | ✅ |
| Light-zone primary CTA bg | `#62BBCB` (`--primary-light`) | rgb(98, 187, 203) ✅ | rgb(98, 187, 203) ✅ | both ✅ |
| Dark-zone primary CTA bg (brief line 319) | **`#5DC6E8`** + `#1F1A14` text | **rgb(93, 198, 232) + rgb(31, 26, 20)** ✅ | rgb(98, 187, 203) + white ❌ | live ✅; preview ❌ (F-NEW-3) |
| Primary CTA chrome | Brief defines: 30 px pill, Poppins SemiBold 15, padding ~12 × 24, no explicit suffix-icon spec | 56 px tall, SVG chevron-circle suffix component | 45 px tall, inline "→" text glyph | structural delta (F-NEW-4) |
| Card border | `1px solid #E5E1DC` | rgb(229, 225, 220) (Sprint 13 verified) | (visually matches) | ✅ |
| Card radius | 12 px | 12 px (Sprint 13 verified) | 12 px | ✅ |
| Card outer-content padding | 48 px (Sprint 5) | 48 px (Sprint 12 PC-4 NO-OP intact) | n/a probed | ✅ |
| Espresso bg | `#1F1A14` | matches | matches | ✅ |
| Cream bg | `#F5EFE2` | matches | matches | ✅ |
| Focus ring | `#1893B4` 3 px dotted | matches (Sprint 13 verified) | (style match) | ✅ |
| Body text color | `#5C544C` | matches (Sprint 13 verified) | matches | ✅ |

---

## WCAG 2.2 AA audit (full enumeration — no trimming)

This audit re-runs the Sprint 13 enumeration; behavior on `/about-us` is unchanged from the Sprint 13 close. No regressions detected in this Sprint 14 cycle. The two carry-forward exceptions (ADV-S5 primary-CTA contrast pa11y allowlist; sitewide 2.5.8 footer-link target-size) remain.

| WCAG 2.2 AA success criterion | Result | Notes |
|---|---|---|
| 1.1.1 Non-text content (alt text) | PASS | Single non-decorative `<img>` (logo) carries `alt="Home"`. |
| 1.3.1 Info and relationships (heading hierarchy) | PASS | 1 H1; H1→H2→H3 in render order. Drupal region labels are visually-hidden H2s (correct landmark pattern). |
| 1.3.2 Meaningful sequence | PASS | DOM order matches visual reading order at 1280/768/375. |
| 1.3.4 Orientation | PASS | No orientation lock. |
| 1.3.5 Identify input purpose | N/A | No forms on `/about-us`. |
| 1.4.1 Use of color | PASS | Links signal via underline or button chrome; not color-only. |
| 1.4.3 Contrast (minimum) | MIXED (pa11y allowlist) | Body/kicker/heading/focus all pass independently. Primary CTA `#62BBCB` + white = 2.21:1 (carry-forward ADV-S5; operator-approved Sprint 9). Dark-zone primary `#5DC6E8` + `#1F1A14` = ~8.81:1 (brief line 319 compliant). |
| 1.4.4 Resize text (200%) | PASS | Body readable, no clipping, no horizontal scroll at 200%. |
| 1.4.5 Images of text | PASS | All headings + body are HTML text. |
| 1.4.10 Reflow | PASS | No horizontal scroll required at 320 px. |
| 1.4.11 Non-text contrast | PASS | Button outlines + focus rings ≥ 3:1; card hairline `#E5E1DC` is decorative (not state-conveying). |
| 1.4.12 Text spacing | PASS | Letter-spacing tokens applied without overflow. |
| 1.4.13 Content on hover or focus | PASS | No hover-triggered content panels. |
| 2.1.1 Keyboard | PASS | All focusable elements reachable by Tab. |
| 2.1.2 No keyboard trap | PASS | Tab traversal reaches end and wraps. |
| 2.1.4 Character key shortcuts | N/A | No single-key shortcuts. |
| 2.4.1 Bypass blocks | PASS | "Skip to main content" link is the first Tab stop. |
| 2.4.2 Page titled | PASS | `<title>` present. |
| 2.4.3 Focus order | PASS | Header → hero → §B → §C cards → §D → §E → footer; logical. |
| 2.4.4 Link purpose (in context) | PASS | Card-title links read meaningfully. |
| 2.4.5 Multiple ways | PASS | Header nav + breadcrumb + footer link list. |
| 2.4.6 Headings and labels | PASS | Descriptive heading text. |
| 2.4.7 Focus visible | PASS | 3-px dotted outline `#1893B4` on every focusable. |
| 2.4.11 Focus not obscured (minimum) — WCAG 2.2 | PASS | Sticky header height 73 px; focused content remains visible at all viewports. |
| 2.5.1 Pointer gestures | N/A | No multi-pointer gestures. |
| 2.5.2 Pointer cancellation | PASS | Default browser button-up activation. |
| 2.5.3 Label in name | PASS | Visible button text matches accessible name. |
| 2.5.4 Motion actuation | N/A | No motion-triggered actions. |
| 2.5.7 Dragging movements — WCAG 2.2 | N/A | No drag interactions. |
| 2.5.8 Target size (minimum 24 × 24) — WCAG 2.2 | MIXED | Inline anchors exempt; CTA pills at 56 px live / 45 px preview both pass. **Footer column links 14–20 px tall — sitewide pre-existing pattern, not /about-us-specific.** Carry-forward. |
| 3.1.1 Language of page | PASS | `<html lang>` set. |
| 3.2.1 On focus | PASS | No surprising focus-triggered changes. |
| 3.2.2 On input | N/A | No inputs. |
| 3.2.3 Consistent navigation | PASS | Primary nav identical across pages. |
| 3.2.4 Consistent identification | PASS | CTA labels consistent across page. |
| 3.2.6 Consistent help — WCAG 2.2 | PASS | "Contact us" in header + footer. |
| 3.3.1 Error identification | N/A | No inputs. |
| 3.3.7 Redundant entry — WCAG 2.2 | N/A | No multi-step flow. |
| 3.3.8 Accessible authentication (minimum) — WCAG 2.2 | N/A | No auth flow on page. |
| 4.1.2 Name, role, value | PASS | Native semantics throughout. |
| 4.1.3 Status messages | N/A | No live regions on page. |
| Reduced-motion (`prefers-reduced-motion: reduce`) | PASS | Captures taken with `reducedMotion: 'reduce'`; no animation observed. |
| Forced-colors mode | NOT RE-TESTED THIS CYCLE | Sprint 10 site-wide pass; no /about-us-specific regression suspected. Re-test deferred. |

**Totals:** 32 distinct AA + 2.2 criteria. Hard pass: 24. N/A: 9. Mixed (pre-existing carry-forwards on pa11y allowlist): 2 (1.4.3, 2.5.8). Deferred: 1 (forced-colors retest). **No /about-us-specific WCAG regression.**

### Orphan-word check (memory `feedback_no_orphan_words.md`)

Inspected heading and copy on both renders for single-word last-line orphans.

| Heading / copy | Viewport | Live | Preview | text-wrap balance? |
|---|---|---|---|---|
| Hero H1 "Drupal testing, done by the people who wrote the tools." | 1280 | wraps to 2 lines, last line = "people who wrote the tools." | wraps to 2 lines, last line = "people who wrote the tools." | both OK |
| Hero H1 | 375 | 4 lines, last = "wrote the tools." | 4 lines, last = "wrote the tools." | both OK |
| §B H2 "On drupal.org since 2006." | 1280 | single line | single line | OK |
| §C H2 "The tools we wrote." | all | single line | single line | OK |
| §D H2 "We test what we ship." | all | single line | single line | OK |
| §E H2 "Want to talk testing?" | all | single line | single line | OK |
| Hero subhead | 1280 | "...The dogfooding proof runs on this site, every night." 3 lines, last line full | preview last line "...every night." three words | both ok-ish; preview last line short but not single-word orphan |
| §B body block | 1280 | last line "version upgrades." 2 words | last line "version upgrades." 2 words | both OK |
| §E body | 1280 | last line "— start here." 3 words | last line "— start here." 3 words | both OK |

No single-word orphans detected on either render at any viewport. `text-wrap: balance` not explicitly applied per inspection of the rendered output, but copy lengths and wrap behavior happen to avoid orphans organically. **Not a Sprint-14 finding.**

---

## Static-preview comparison (gestalt walk)

| Section | 1280 | 768 | 375 | Notes |
|---|---|---|---|---|
| Header | MATCH | MATCH | MATCH | Sprint 13 wrap canonicalized — pill removed from preview, hamburger toggle at < 992. |
| Hero | DELTA (H1 size + CTA chrome) | DELTA | DELTA (H1 size inverted; CTA chrome) | F-NEW-1, F-NEW-2, F-NEW-4 |
| Track-record (§B) | DELTA (body-lg drift, wrap) | DELTA | DELTA | Pre-existing typography (Sprint 13) |
| Open-source (§C) cards | DELTA (card-CTA structure) | DELTA | DELTA | Pre-existing (Sprint 13) |
| Bio "Who we are." | MATCH | MATCH | MATCH | Sprint 12 fix intact |
| Dogfood (§D) | DELTA (CTA chrome, body wrap) | DELTA | DELTA | F-NEW-4 + pre-existing body drift |
| Closing CTA (§E) | DELTA (preview CTA bg token wrong; CTA chrome) | DELTA | DELTA | F-NEW-3 + F-NEW-4 |
| Footer | DELTA (live richer than preview by design) | DELTA | DELTA | Out of scope (sitewide Drupal pattern) |

---

## Findings catalog

### F-NEW-1 (pre-committed, runbook): preview H1 desktop short

- **Brief:** `display-xl` 72 px at desktop.
- **Live:** 72 / 79.2 ✅
- **Preview:** **64 / 67.2** ❌
- **Remediation layer:** Preview-doc.
- **Fix:** Update `docs/pl2/Previews/about-us.html` line 254 from `font-size: 64px` to `font-size: 72px` (and adjust letter-spacing to `-2px`).
- **Cycle:** Cycle 2 (recommended single-cycle preview-doc fix).

### F-NEW-2 (pre-committed, runbook): live H1 mobile short — L1 token

- **Brief:** `display-xl` mobile reduction = 44 px at < 576.
- **Live:** 36 / 39.6 ❌ — short by 8 px.
- **Preview:** 40 / 42 — short by 4 px.
- **Remediation layer:** L1 token (theme CSS mobile typography rule for `display-xl`).
- **Fix:** Raise the `< 576` (or comparable Bootstrap breakpoint) `display-xl` rule to 44 px; also raise preview's `.hero h1` mobile rule (line 512) from 40 to 44 px to match.
- **Cross-page sweep required** per PC-3: any other landing page that uses `display-xl` for the hero will gain 8 px (live) / 4 px (preview) of vertical headline height. Mandatory S cross-page diff before merge.
- **Cycle:** Cycle 3 (or fold into Cycle 2 alongside F-NEW-1 if F batches efficiently; cross-page sweep stays).

### F-NEW-3 (NEW this cycle, surfaced by HQ method): preview §E primary CTA token wrong

- **Brief line 319:** "Dark-zone CTA buttons use `#5DC6E8` bg with `#1F1A14` text (8.81:1 — AA pass)."
- **Live:** rgb(93, 198, 232) + rgb(31, 26, 20) ✅
- **Preview:** rgb(98, 187, 203) + white ❌ — uses light-zone token on espresso section.
- **Remediation layer:** Preview-doc.
- **Fix:** Update `docs/pl2/Previews/about-us.html` `.section--espresso .btn--primary` (or whatever the preview selector is) to `background: #5DC6E8; color: #1F1A14;`.
- **Cycle:** Cycle 2 (bundle with F-NEW-1; both are preview-doc only).

### F-NEW-4 (NEW this cycle, surfaced by HQ method): primary CTA component chrome differs

- **Brief:** Defines pill chrome (30 px radius, Poppins SemiBold 15, padding 12 × 24) but does **not** specify a trailing-arrow icon as part of the canonical button.
- **Live:** Uses `dripyard_base:button` component which appends a 32-px SVG chevron-circle suffix via `.button__suffix` → **56 px tall** pill.
- **Preview:** Plain `<a class="btn--primary">` with inline `→` glyph in label → **45 px tall** pill (matches brief padding 14 × 28, close to brief 12 × 24).
- **Operator decision required:** which is canonical?
  - Option A — **preview is canonical (no suffix icon).** Live ships unchanged behavior, but with a sub-issue to surface the suffix-icon component as opt-in not default, OR remove the icon for `/about-us`. Higher-cost (component/template work).
  - Option B — **live is canonical (suffix icon).** Preview updates to render the same chevron-circle suffix. Preview-doc only.
  - Option C — **accept the structural difference**, document it in the brief as "Drupal-component-templated CTA suffix is shipped behavior, not part of the brief," and close this as a doc-only finding. Lowest-cost.
- **Remediation layer:** Depends on operator decision (canvas-content + L3 if Option A live-side; preview-doc if Option B; brief-doc if Option C).
- **Cycle:** Defer to Cycle 4 or close as advisory pending operator input. Recommend **Option C** for autonomous-mode park because the icon is a sitewide Drupal-component pattern; bundling the cross-page check into a "CTA-component spec audit" sprint is the appropriate scope.

### F-NEW-5 (NEW this cycle, minor): live `display-md` line-height +1.2 px vs brief

- **Brief:** `display-md` = 40 / 1.05–1.10.
- **Live:** 40 / 45.2 (1.13) — 1.2 px over the 1.10 ceiling.
- **Preview:** 40 / 44 (1.10) ✅
- **Remediation layer:** L1 token.
- **Cycle:** Defer or fold into Sprint-15+ typography pass; not load-bearing visually (1.2 px is sub-perceptual).

### F-NEW-6 (carry-forward, Sprint 13 §B/§D body): live body-lg = 16 px, preview = 17 px, brief = 18

Pre-existing, documented in Sprint 13 audit. Carries forward unchanged. **Recommend folding into a sitewide body-lg token cycle**, not addressed in Sprint 14 because the cross-page surface is large (every page uses body-lg).

### F-NEW-7 (carry-forward, Sprint 13 hero subhead): live = 20 px, preview = 19 px, brief = 18

Pre-existing, documented in Sprint 13. Carries forward. Same handling as F-NEW-6.

### Open-source card structural delta (carry-forward, Sprint 13)

- Live `card.html.twig` makes the card **title** the link; preview has a separate "Read the docs →" footer link.
- Pre-existing, not introduced by any recent sprint. **Operator decision still pending** from Sprint 12 — keep deferred.

---

## Recommendation — Cycle 2..N carve

Per PC-2 (cycle carve driven by Cycle 1 audit) and PC-3 (L1 token only with cross-page sweep + S confirmation), the recommended carve is:

### Cycle 2 — Preview-doc batch (no live changes)

- **Branch:** `aa/pl-sprint-14-cycle-2-about-us-preview-doc`
- **Scope:**
  - F-NEW-1: raise preview hero H1 desktop from 64 → 72 px (+ letter-spacing −2 px).
  - F-NEW-3: change preview `.section--espresso .btn--primary` bg/color tokens to `#5DC6E8` / `#1F1A14`.
- **Verification:** Re-run `scripts/sprint-14-cycle-1-capture.mjs` and `scripts/sprint-14-cycle-1-diff.mjs` post-fix; the hero and closing-CTA section DSSIM should drop materially (~30–40%).
- **F→T→S:** F implements; T validates structural HTML/CSS; S re-audits and confirms.

### Cycle 3 — L1 mobile token + cross-page S sweep (F-NEW-2)

- **Branch:** `aa/pl-sprint-14-cycle-3-mobile-display-xl-token`
- **Scope:**
  - F-NEW-2: raise mobile `display-xl` from 36 → 44 in the theme's `@media (max-width: 575.98px)` (or equivalent Bootstrap breakpoint) rule.
  - Also raise the preview's `.hero h1 { font-size: 40px }` (line 512) to 44 px in same cycle.
- **Cross-page sweep:** mandatory S re-render of every page that uses `display-xl` (homepage, `/services`, `/how-we-do-it`, `/open-source-projects`, `/about-us`) at 375 to confirm hero CTA stacking is not disrupted by the +8 px headline. Re-use the Sprint 14 capture script with each page URL.
- **F→T→S:** F implements; T validates `@media` cascade with no other rules accidentally overridden; S runs cross-page sweep.

### Cycle 4 — F-NEW-4 operator decision

- **Branch:** TBD; pending operator decision on canonical (Options A/B/C above).
- **Recommendation:** **Option C** (brief-doc only — document that the live's `dripyard_base:button` suffix-icon is shipped behavior, not part of the visual-fidelity contract). Costs nothing and avoids opening a sitewide button-component refactor mid-sprint.

### Deferred / out of Sprint 14 scope

- F-NEW-5 (display-md line-height +1.2 px) — fold into Sprint-15+ typography pass.
- F-NEW-6, F-NEW-7 (body-lg drift on both renders) — sitewide body-lg token cycle.
- Open-source card CTA structure — Sprint 12 carry-forward, operator-decision pending.
- Footer richness delta — sitewide footer template, out of `/about-us` scope.

---

## Scripts (durable artifacts)

| Script | Purpose |
|---|---|
| `scripts/sprint-14-cycle-1-capture.mjs` | 2× retina captures of live + preview at 1280/768/375 |
| `scripts/sprint-14-cycle-1-measure.mjs` | Section bounding boxes + Drupal-chrome mask coordinates + H1 computed style |
| `scripts/sprint-14-cycle-1-diff.mjs` | Apply chrome mask, anchored per-section crops, DSSIM/PSNR/AE-0%/AE-3% per section + wholepage |
| `scripts/sprint-14-cycle-1-probe-cta.mjs` | Probe primary CTA DOM + computed style on both renders |
| `scripts/sprint-14-cycle-1-probe-body.mjs` | Probe body text + H2 + hero subhead computed styles |

All scripts are idempotent and may be re-run in Cycles 2..N to confirm fixes.

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/about-us.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/briefs/pl_design_brief.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--about-us.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-13-cycle-1-about-us-reaudit.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-13-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-14-cycle-1/` (84 PNGs + measurements.json + diff-results.json)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-14-cycle-1-*.mjs`

---

## Verdict

**REWORK** — Cycle 2..N carve recommended. Per Sprint 14 runbook §"Sprint shape," the carve enumerated above (Cycle 2 preview-doc batch + Cycle 3 L1 token + cross-page sweep + Cycle 4 operator decision on CTA-suffix) is the path to close all actionable findings. Two new findings (F-NEW-3, F-NEW-4) surfaced by the HQ method that Sprint 13 missed. All other deltas are pre-existing carry-forwards or sitewide patterns out of /about-us scope.

The HQ method confirms the value of DSSIM-primary metrics + chrome-mask + anchored crops: per-section DSSIM 0.17–0.26 across every section is a clear "real deltas, every section, every viewport" signal that the lower-quality whole-page AE 32–58% obscured by mixing real deltas with vertical-drift cumulative noise. The actionable subset, however, is small: three or four discrete fixes (F-NEW-1..4) close the entire delta surface that's in /about-us scope.
