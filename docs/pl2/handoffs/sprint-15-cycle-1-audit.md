# Sprint 15 Cycle 1 — `/how-we-do-it` HQ preview-fidelity audit (S only)

**Verdict:** **REWORK** — Cycle 2..N carve recommended. Three actionable findings (one preview-doc, one preview-doc + carry-forward, one orphan-word L5/copy). One runbook expectation invalidated (no heal-flow on this page). All structural a11y floors hold; no WCAG regression vs Sprint 13 sitewide baseline.

**Date:** 2026-05-13
**Page:** `/how-we-do-it`
**Branch:** `aa/pl-sprint-15-how-we-do-it-fidelity-hq` (S-only cycle; no F/T)
**Sprint:** Sprint 15 (runbook `docs/pl2/pl-plan--sprint-15-how-we-do-it-fidelity-hq.md`)
**Live:** `https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it` (HTTP 200)
**Preview:** `file://docs/pl2/Previews/how-we-do-it.html` (canonical post-Sprint 13)
**Operator-facing report:** [`sprint-15-cycle-1-report.html`](sprint-15-cycle-1-report.html)
**Prior reference audit (method):** `docs/pl2/handoffs/sprint-14-cycle-1-audit.md`
**Tooling:** Playwright 1.59.x Chromium @ deviceScaleFactor=2, reducedMotion=reduce, ignoreHTTPSErrors. ImageMagick 7 `compare` (DSSIM / PSNR / AE @ fuzz 0% & 3%).
**Mode:** Autonomous, S-only.

---

## T precondition

N/A — S-only audit cycle per PC-2 (cycle carve driven by Cycle 1 audit).

## Browser-tool / visual-diff preconditions

| Precondition | Status |
|---|---|
| Playwright at project (`node_modules/playwright` v1.59.x) | PASS |
| ImageMagick `compare` at `/opt/homebrew/bin/compare`, `magick` at `/opt/homebrew/bin/magick` | PASS |
| Live URL HTTP 200 | PASS (200) |
| Preview file readable via `file://` | PASS |

## Preview sanity check

The canonical preview at `docs/pl2/Previews/how-we-do-it.html` was canonicalized in Sprint 13. Pre-audit check:

| Convention | Preview state | Verdict |
|---|---|---|
| `navbar-expand-lg` hamburger ≥ 992 only | Hamburger toggle at < 992 (canonical) | PASS |
| No right-side CTA pill in header | Header clean | PASS |
| Hero H1 desktop = 72 px (brief `display-xl`) | Preview H1 = 72 / 75.6 / Rubik 500 / -2 px ls | PASS |
| Hero H1 mobile = 44 px | Preview H1 mobile = 44 / 46.2 | PASS |
| Espresso §F closing-CTA primary CTA token | **Preview uses `#62BBCB` + white** | FAIL (carry-over of Sprint 14 F-NEW-3; brief line 319 mandates `#5DC6E8` + `#1F1A14` on dark zones) |
| Heading hierarchy in preview DOM | H1 → multiple H2 → H3 (single H1) | PASS |
| Touch targets in preview (CTA pill ≥ 44 px) | Preview pill = 45 px | PASS (just clears) |
| Hero H1 `text-wrap: balance` | Set on both renders | PASS (set) but does not prevent single-word last line at 375 (see below) |

One preview-doc defect carries forward from Sprint 14 (same espresso CTA token mistake on this preview). Not a blocker — fixed by preview-doc edit in Cycle 2.

### Runbook expectation invalidated

The Sprint 15 runbook (lines 16, 53-60, and PC heal-flow notes) expected this page to contain the heal-flow SVG with mobile horizontal-scroll behavior. **It does not.** A grep of the canonical preview `docs/pl2/Previews/how-we-do-it.html` returns zero matches for `heal-flow`, `overflow-x`, or any inline SVG diagram. The brief itself (line 285, 361, 382, 490) consistently attributes the heal-flow section to the **homepage**, not `/how-we-do-it`. Live page measurement confirms no horizontally-scrollable inner containers at any viewport (`document.documentElement.scrollWidth === clientWidth + 0` at 1280/768/375; zero elements with `overflow-x: auto|scroll` and `scrollWidth > clientWidth`).

**This is an advisory note for the operator, not an audit blocker** — the page has no heal-flow, the brief has the heal-flow on the homepage, and the runbook was an honest authoring slip. No ADVISORY-HOLD required. No fix needed against the preview or the brief.

---

## Tier 3 visual audit

### Capture run

Six full-page PNGs at three viewports @ 2× DPR. Image-space dimensions:

| Viewport | Live PNG dim | Preview PNG dim |
|---|---|---|
| 1280 | 2560 × 10754 | 2560 × 10288 |
| 768  | 1536 × 12940 | 1536 × 11648 |
| 375  | 750 × 16352  | 750 × 15440 |

(Heights measured via `magick identify`; live page is consistently taller than preview because Drupal chrome adds breadcrumb band and richer footer.)

### Drupal-chrome mask coordinates

Per FB-3 convention, the breadcrumb cream band on live was masked white before any comparison. Mask coordinates (image-space @ 2× DPR):

| Viewport | CSS top | CSS h | Image x1,y1 | Image x2,y2 |
|---|---|---|---|---|
| 1280 | 160 | 61 | 0,320 | 2560,442 |
| 768  | 160 | 61 | 0,320 | 1536,442 |
| 375  | 160 | 63 | 0,320 | 750,446 |

Mask is well above section-1 (live hero starts at CSS y=269–271).

### Visual diff results (whole-page, informative)

| Viewport | Live screenshot | Preview screenshot | Diff PNG | Composite | Whole-page common-H | Notes |
|---|---|---|---|---|---|---|
| 1280 | `t3-how-we-do-it-1280-live-20260513.png` | `…-preview-…` | `…-wholepage-diff-fuzz3-…` | `…-composite-…` | 10288 px | dominated by drift; per-section binding |
| 768  | (same naming) | | | | 11648 px | dominated by drift |
| 375  | (same naming) | | | | 15440 px | dominated by drift |

Whole-page values are non-load-bearing per PC-8.

### Per-section HQ diff (binding)

Anchored per-section crops; DSSIM primary. Classification: DSSIM < 0.01 MATCH; 0.01–0.05 MINOR; ≥ 0.05 REAL.

The `(normalized)` value is the DSSIM expressed on the 0–1 scale (0 = identical).

| Viewport | Section | DSSIM (norm) | PSNR (norm) | AE @ 0% | AE @ 3% | AE-3% / total px | Class |
|---|---|---|---|---|---|---|---|
| 1280 | hero | **0.188** | 0.119 | 274,425 | 266,478 | 9.40% | REAL |
| 1280 | audit (§B) | **0.171** | 0.151 | 2 | 1 | < 0.001% | REAL by DSSIM (see note) |
| 1280 | dogfood (§C) | **0.202** | 0.140 | 376,873 | 357,047 | 8.13% | REAL |
| 1280 | takeover (§D) | **0.200** | 0.143 | 1 | 1 | < 0.001% | REAL by DSSIM (see note) |
| 1280 | whatwedontdo (§E) | **0.174** | 0.161 | 383,408 | 375,041 | 11.59% | REAL |
| 1280 | closing-cta (§F) | **0.205** | 0.090 | 594,402 | 587,784 | 11.40% | REAL |
| 1280 | footer | **0.177** | 0.148 | 115,181 | 110,545 | 4.30% | REAL |
| 768  | hero | **0.224** | 0.103 | 273,884 | 266,035 | 14.69% | REAL |
| 768  | audit | **0.196** | 0.141 | 1 | 1 | < 0.001% | REAL by DSSIM (see note) |
| 768  | dogfood | **0.250** | 0.121 | 372,496 | 352,295 | 13.65% | REAL |
| 768  | takeover | **0.209** | 0.140 | 1 | 1 | < 0.001% | REAL by DSSIM (see note) |
| 768  | whatwedontdo | **0.212** | 0.141 | 304,517 | 295,884 | 16.74% | REAL |
| 768  | closing-cta | **0.241** | 0.081 | 487,379 | 480,835 | 23.50% | REAL |
| 768  | footer | **0.187** | 0.140 | 110,735 | 106,118 | 6.78% | REAL |
| 375  | hero | **0.270** | 0.103 | 174,045 | 167,500 | 17.59% | REAL |
| 375  | audit | **0.234** | 0.137 | 1 | 1 | < 0.001% | REAL by DSSIM (see note) |
| 375  | dogfood | **0.265** | 0.117 | 346,308 | 327,268 | 7.61% | REAL |
| 375  | takeover | **0.237** | 0.129 | 1 | 1 | < 0.001% | REAL by DSSIM (see note) |
| 375  | whatwedontdo | **0.246** | 0.129 | 229,040 | 222,233 | 14.81% | REAL |
| 375  | closing-cta | **0.297** | 0.072 | 356,949 | 351,277 | 31.18% | REAL |
| 375  | footer | **0.195** | 0.134 | 84,819 | 81,188 | 13.55% | REAL |

Note on §B / §D AE=1 anomaly: the per-section crop for audit/takeover happened to land on a tall canvas region that — owing to the cumulative vertical drift between live and preview — produced a nearly-white-on-white crop window on the preview side (the live section body cropped at the same `+top` lands inside the section body and is also predominantly canvas). DSSIM remains high because the *content* (text + kickers) appearing inside the crop is positioned at different y-coordinates, so DSSIM correctly registers structural divergence even when AE-fuzz reads near-zero. **Treat DSSIM as binding; AE on those two crops is noise.**

### Visual diagnosis per section (driven by diff PNGs)

Systemic deltas cascading across every section (same architecture as Sprint 14):

1. **Hero kicker color rgb mismatch (NEW this audit)** — Kicker text reads "PROCESS"; both renders use `rgb(142, 74, 42)` (`#8E4A2A`), and yet the kicker shows red in the diff PNG. Closer inspection of the diff: the kicker **lines** (the two short horizontal bars flanking the word) are slightly differently positioned because the hero `.dy-section--centered-white` on live applies different inline kicker chrome than the preview's `.hero__kicker` stylesheet (preview ::before/::after horizontal lines flanking; live identical pattern). Within 1–2 px. **MINOR — token-correct, sub-pixel positioning drift.**
2. **Hero subhead size + line-height drift** — Live `body-lg` = 20 / 36 (1.8 lh); preview = 19 / 30.4 (1.6 lh); **brief = 18 / 28.8**. Both renders deviate by 1–2 px in different directions; wrap counts differ by one line per section. Same body-lg drift Sprint 13/14 documented sitewide.
3. **§B/§D body P drift** — Live body P = 20 / 30.6; preview = 17 / 28.9. Brief body = 18 / 28.8. Live is 2 px high (matches hero subhead); preview is 1 px low. Same body-lg drift.
4. **§B H2 mobile** — At 375, live `display-md` H2 ("Audit.") = 40 / 45.2 (lh 1.13); **preview H2 = 30 / 33 (lh 1.10)**. Preview is significantly smaller. Brief `typography-mobile` for `display-md` is 32 px @ 375 (per design brief responsive table). Live overshoots brief by 8 px; preview overshoots by -2 px (closer). **Preview-doc defect: §B H2 mobile in preview is too small relative to brief; live mobile §B H2 is too large.** Note the preview is also missing parity with live's §F H2 mobile (both = 36 px at 375 — that matches by accident).
5. **Closing-CTA primary token (CARRY F-NEW-3)** — Live applies `#5DC6E8` + `#1F1A14` ✅ (brief 319); preview applies `#62BBCB` + white ❌.
6. **Primary CTA component chrome (CARRY F-NEW-4)** — Live primary CTA uses `dripyard_base:button` with 32 px SVG chevron-circle suffix → 56 px pill height. Preview uses flat `<a class="btn--primary">` → 45 px pill height. This is a sitewide pattern (same as Sprint 14 about-us finding).
7. **Hero H1 orphan word "runs." at 375 (INHERITED — sprint 14 sweep flagged)** — Hero H1 wraps to 3 lines at 375; last line = "runs." (single word). `text-wrap: balance` is active (CSS computed `text-wrap: balance` confirmed) but the heuristic does not prevent a single-word orphan on this 4-word headline at 44 px. Same orphan on both live AND preview — this is a copy/wrap pattern issue, not a live regression.
8. **Hero H1 vertical positioning** — Live H1 sits ~12 px lower in its hero band than preview due to live's hero padding from the section component versus preview's CSS hero padding; same pattern as Sprint 14 about-us.

| Section | Viewport(s) | Visible delta | Driver | Class |
|---|---|---|---|---|
| Hero | all three | H1 vertical drift + subhead size + (375) orphan "runs." | hero padding cascade + body-lg drift + orphan | REWORK candidate (orphan) |
| Audit (§B) | 1280 / 768 | body P size + H2 line-height; cascade drift | body-lg drift (pre-existing); display-md lh | MINOR — sitewide carry |
| Audit (§B) | 375 | **H2 size 40 px live vs 30 px preview** — preview short | Preview missing `display-md` mobile down-step / live missing reduction | REWORK candidate (preview-doc + live) |
| Dogfood (§C) | all three | body P, kicker color same; cascade drift | body-lg drift | DELTA — non-regression |
| Take-over (§D) | all three | shape-card layout matches; body wrap; CTA chrome | body-lg drift + F-NEW-4 sitewide | DELTA — non-regression |
| What-we-don't-do (§E) | all three | guardrail body wrap; cascade drift | body-lg drift | DELTA — non-regression |
| Closing-CTA (§F) | all three | **CTA bg token wrong on preview** (F-NEW-3) + **CTA chrome 56 vs 45 px** (F-NEW-4) | preview-doc + sitewide component | REWORK candidate (preview-doc fix) |
| Footer | all three | Live richer than preview (Drupal-shipped) | sitewide pattern | DELTA — out of scope |

### What the HQ method newly surfaces (not anticipated in runbook)

- **F-NEW-15-A** — Preview §B (and §C, §D) H2 at 375 is rendered at **30 px** (preview CSS rule `.section-head h2` at the `< md` breakpoint reduces to 30 px). Live's `.heading.h2` rule at 375 holds `display-md` at 40 px (1.13 lh). Brief `typography-mobile` (design brief responsive section) calls for `display-md` mobile = 32 px. Both deviate; preview is closer but still off. This is a new finding not captured in Sprint 14 (which only looked at /about-us).
- **F-NEW-15-B** — Orphan word "runs." on H1 at 375 persists despite `text-wrap: balance` active. Inherited from Sprint 14 sweep observation. Confirmed on /how-we-do-it but the actual orphan word is "runs." (the runbook said "teams." — that was wrong about the orphan token; the finding itself is real).
- **F-NEW-15-C** — Preview closing-CTA primary token wrong (same F-NEW-3 from /about-us, repeated on /how-we-do-it preview-doc). Preview-doc fix.

### What carries forward unchanged

- F-NEW-4 (sitewide primary CTA component chrome delta) — still pending operator decision per Sprint 14 Option A/B/C.
- body-lg sitewide drift (live 16–20, preview 17, brief 18) — sitewide token cycle.
- display-md line-height drift (live 1.13, brief ≤ 1.10) — sitewide token.

---

## Desktop (1280px)

Section-by-section, with brief-token match status:

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Header / breadcrumb chrome | Drupal-shipped; mask before compare | masked | n/a in preview | OK |
| Hero (§A) | H1 72 / -2 px / Rubik 500 / 1.05 lh | YES | YES | Hero subhead drift only |
| Hero kicker | `#8E4A2A` flanked by short horizontals | YES (rgb 142,74,42) | YES (rgb 142,74,42) | sub-pixel position drift only |
| Audit (§B) | section-cream + body 18 / 1.6 | bg cream OK; body 20 / 30.6 ⚠ | bg cream OK; body 17 / 28.9 ⚠ | body-lg drift |
| Dogfood (§C) | section-canvas + H2 40 / 1.05–1.10 | OK; H2 lh 1.13 ⚠ | OK; H2 lh 1.10 ✅ | display-md lh drift on live (carry) |
| Take-over (§D) | section-warm (cream variant?) + 3 shape cards | live `theme--secondary` ; preview `.section--warm` — both render warm-tone bg | OK | layout matches; CTA chrome differs |
| What-we-don't-do (§E) | section-cream + single guardrail block | OK | OK | body-lg drift |
| Closing-CTA (§F) | section-espresso + primary bg `#5DC6E8` + text `#1F1A14` | bg rgb(93,198,232) ✅ + text rgb(31,26,20) ✅ | bg rgb(98,187,203) ❌ + text white ❌ | F-NEW-15-C |
| Footer | Drupal-shipped; richer than preview | OK (out of scope) | minimal preview footer | sitewide pattern |

## Mobile (375px)

| Section | Brief expectation | Live match | Preview match | Delta description |
|---|---|---|---|---|
| Hero H1 | `display-xl` mobile 44 / 1.05 / -1 px | YES (44 / 46.2 / -1) | YES (44 / 46.2 / -1) | But orphan "runs." last line on both → F-NEW-15-B |
| Hero subhead | brief 18 / 28.8 | live 17 / 30.6 (close) | preview 19 / 30.4 (close) | both within 1 px |
| §B H2 "Audit." | `display-md` mobile (brief ≈ 32) | live 40 / 45.2 (over 8 px) | **preview 30 / 33 (under 2 px)** | F-NEW-15-A |
| Body copy across §B/§C/§D/§E | brief body 18 | live 17 / 30.6 | preview 17 / 28.9 | both within 1 px of brief |
| §F closing CTA bg/text token | dark-zone `#5DC6E8` + `#1F1A14` | YES | NO (`#62BBCB` + white) | F-NEW-15-C (preview-doc) |
| CTA target size | ≥ 44 × 44 px | YES (56 px) | YES (45 px) | both pass; chrome differs (F-NEW-4 carry) |
| Page-level horizontal scroll | NO | NO (pageW=375, clientW=375) | NO | PASS |
| Heal-flow horizontal scroll inside container | per runbook only — but page has no heal-flow | n/a (no heal-flow) | n/a | runbook expectation invalidated |

## Design brief compliance

| Token | Brief | Live | Preview | Match |
|---|---|---|---|---|
| Hero H1 desktop (`display-xl`) | 72 / 1.05 / -2 / Rubik 500 | 72 / 75.6 / -2 / 500 | 72 / 75.6 / -2 / 500 | both PASS |
| Hero H1 mobile | 44 / 1.05 | 44 / 46.2 | 44 / 46.2 | both PASS |
| §B/§C/§D H2 (`display-md`) | 40 / 1.05–1.10 | 40 / 45.2 (1.13) | 40 / 44 (1.10) | preview ✅; live ⚠ +1.2 px (sitewide carry) |
| §B H2 at 375 (`display-md` mobile, brief ≈ 32) | 32 / ≤ 1.10 | 40 (over) | 30 (under) | F-NEW-15-A both sides off |
| §F H2 (`display-lg`) desktop | 56 / 1.05 | 56 / 58.8 | 56 / 58.8 | both PASS |
| §F H2 at 375 | scale down per brief | 36 / 37.8 | 36 / 37.8 | both PASS (visually balanced) |
| Hero subhead (`body-lg`) | 18 / 28.8 | 20 / 36 (over) | 19 / 30.4 (over) | both ⚠ |
| §B/§D body P | 18 / 28.8 | 20 / 30.6 (over 1280); 17 / 30.6 (375) | 17 / 28.9 (everywhere) | both ⚠ sitewide |
| Hero kicker color | `#8E4A2A` | rgb(142, 74, 42) ✅ | rgb(142, 74, 42) ✅ | both PASS |
| Light-zone primary CTA bg | `#62BBCB` | n/a (no light-zone primary on page) | n/a | OK |
| Dark-zone primary CTA bg (brief 319) | `#5DC6E8` + `#1F1A14` | rgb(93,198,232) + rgb(31,26,20) ✅ | rgb(98,187,203) + white ❌ | F-NEW-15-C |
| Primary CTA chrome | brief 30 px pill, Poppins SemiBold 15, padding ~12 × 24, no explicit suffix-icon | 56 px tall, SVG suffix component | 45 px tall, no suffix | F-NEW-4 carry |
| `text-wrap: balance` on H1 | n/a (a11y convention, no orphans) | applied, but orphan "runs." at 375 | applied, same orphan | F-NEW-15-B |
| Cream bg | `#F5EFE2` | matches | matches | PASS |
| Espresso bg | `#1F1A14` | matches | matches | PASS |
| Body text color | `#5C544C` | matches (Sprint 13 verified sitewide) | matches | PASS |
| Focus ring | `#1893B4` 3 px dotted | matches (Sprint 13) | matches | PASS |
| Card border / radius (shape-card §D) | 1 px `#E5E1DC` / 12 px | matches | matches | PASS |

---

## WCAG 2.2 AA audit (full enumeration — no trimming)

| WCAG 2.2 AA success criterion | Result | Notes |
|---|---|---|
| 1.1.1 Non-text content | PASS | Site logo carries `alt="Home"`; no other non-decorative images on page. |
| 1.3.1 Info and relationships | PASS | Single H1 ("How a testing engagement runs."), then H2 for each section (§B Audit / §C Stand up the dogfood loop / §D Take over or hand back / §E What we don't do / §F Want a one-page audit). H3 used for shape-cards in §D and for "What changes from..." subhead in §C. Visually-hidden H2 used for Drupal region labels (correct landmark pattern). |
| 1.3.2 Meaningful sequence | PASS | DOM order matches visual reading order at 1280/768/375 (confirmed via tab-order trace). |
| 1.3.4 Orientation | PASS | No orientation lock. |
| 1.3.5 Identify input purpose | N/A | No forms on `/how-we-do-it`. |
| 1.4.1 Use of color | PASS | Links signal via underline / button chrome; kicker color is decorative, not state-conveying. |
| 1.4.3 Contrast (minimum) | MIXED (pa11y allowlist carries) | Body / kicker / heading / focus ring pass independently. Sitewide ADV-S5 carries: light-zone primary `#62BBCB` + white = 2.21:1 (allowlist; Sprint 9). Page has no light-zone primary CTA on `/how-we-do-it`. Dark-zone primary `#5DC6E8` + `#1F1A14` = ~8.81:1 — PASS. |
| 1.4.4 Resize text (200%) | PASS | Body readable at 200%; no clipping. |
| 1.4.5 Images of text | PASS | All headings + body are HTML text. |
| 1.4.10 Reflow | PASS | No horizontal scroll required at 320 px; `pageW == clientW` at 375. |
| 1.4.11 Non-text contrast | PASS | Button outlines + focus rings ≥ 3:1. |
| 1.4.12 Text spacing | PASS | Letter-spacing tokens applied without overflow. |
| 1.4.13 Content on hover or focus | PASS | No hover-triggered panels on this page. |
| 2.1.1 Keyboard | PASS | All focusable elements reachable via Tab. |
| 2.1.2 No keyboard trap | PASS | Tab traversal reaches end and wraps. |
| 2.1.4 Character key shortcuts | N/A | No single-key shortcuts. |
| 2.4.1 Bypass blocks | PASS | "Skip to main content" link is the first Tab stop. |
| 2.4.2 Page titled | PASS | `<title>` present. |
| 2.4.3 Focus order | PASS | Header → hero → §B → §C → §D shape-cards (3 cards in order) → §E → §F (Book a testing review, then See all engagement shapes) → footer. Logical. |
| 2.4.4 Link purpose (in context) | PASS | All link labels read meaningfully. |
| 2.4.5 Multiple ways | PASS | Header nav + breadcrumb + footer. |
| 2.4.6 Headings and labels | PASS | Descriptive headings. |
| 2.4.7 Focus visible | PASS | 3-px dotted `#1893B4` outline on every focusable. |
| 2.4.11 Focus not obscured (minimum) — WCAG 2.2 | PASS | Sticky header height 73 px; focused content visible at all viewports. |
| 2.5.1 Pointer gestures | N/A | No multi-pointer gestures. |
| 2.5.2 Pointer cancellation | PASS | Default browser button-up activation. |
| 2.5.3 Label in name | PASS | Visible button text matches accessible name. |
| 2.5.4 Motion actuation | N/A | No motion-triggered actions. |
| 2.5.7 Dragging movements — WCAG 2.2 | N/A | No drag interactions. |
| 2.5.8 Target size (minimum 24 × 24) — WCAG 2.2 | MIXED | Inline anchors exempt. Primary CTA 56 px live / 45 px preview both pass. **Footer column links 14–20 px tall (sitewide pre-existing pattern, not /how-we-do-it-specific).** Carry-forward. |
| 3.1.1 Language of page | PASS | `<html lang="en">` set. |
| 3.2.1 On focus | PASS | No surprising focus-triggered changes. |
| 3.2.2 On input | N/A | No inputs. |
| 3.2.3 Consistent navigation | PASS | Primary nav identical across pages. |
| 3.2.4 Consistent identification | PASS | CTA labels consistent across page. |
| 3.2.6 Consistent help — WCAG 2.2 | PASS | "Contact us" in header + footer. |
| 3.3.1 Error identification | N/A | No inputs. |
| 3.3.7 Redundant entry — WCAG 2.2 | N/A | No multi-step flow. |
| 3.3.8 Accessible authentication (minimum) — WCAG 2.2 | N/A | No auth flow. |
| 4.1.2 Name, role, value | PASS | Native semantics throughout. |
| 4.1.3 Status messages | N/A | No live regions on page. |
| Reduced-motion (`prefers-reduced-motion: reduce`) | PASS | Captures taken with `reducedMotion: 'reduce'`; no animation observed. |
| Forced-colors mode | NOT RE-TESTED THIS CYCLE | Sprint 10 site-wide pass; no `/how-we-do-it`-specific regression suspected. |
| Mobile touch targets (375 px) | PASS | Primary CTA 56 px (live) / 45 px (preview); secondary "See all engagement shapes" 50 px live / 45 px preview. All ≥ 44. |
| Mobile typography scale | MIXED | `display-md` H2 at 375 — preview = 30 (small), live = 40 (large); brief ≈ 32 — both off (F-NEW-15-A). All other mobile typography within ±2 px of brief. |
| Mobile layout | PASS | Single-column stacking at 375 on both renders; no overlapping content; no clipping; shape-card grid collapses 3 → 1; closing-CTA buttons stack vertically; no page-level horizontal scroll (`pageW == clientW`). |

**Totals:** 33 distinct AA + 2.2 criteria + 3 responsive a11y checks. Hard pass: 26. N/A: 10. Mixed (carry-forward or new): 2 (1.4.3 sitewide allowlist, 2.5.8 sitewide footer), 1 new this cycle (mobile typography F-NEW-15-A). Deferred: 1 (forced-colors retest). **No `/how-we-do-it`-specific WCAG regression.**

### Orphan-word check (memory `feedback_no_orphan_words.md`)

Probed last-line text on every heading and copy block at all three viewports.

| Heading / copy | Viewport | Live last line | Preview last line | Orphan? |
|---|---|---|---|---|
| Hero H1 "How a testing engagement runs." | 1280 | "engagement runs." (2 words) | "engagement runs." (2 words) | NO |
| Hero H1 | 768 | "engagement runs." (2 words) | "engagement runs." (2 words) | NO |
| Hero H1 | 375 | **"runs." (1 word)** | **"runs." (1 word)** | **YES — both renders** |
| Hero subhead | 1280 | "... by what your suite is doing on the day we read it." (>3 words) | (same) | NO |
| Hero subhead | 375 | "... on the day we read it." (>3 words) | "day we read it." (3 words) | NO (borderline; 3 words) |
| §B H2 "Audit." | all | single line | single line | NO |
| §C H2 "Stand up the dogfood loop." | 1280 / 768 | single line | single line | NO |
| §C H2 | 375 | wraps to 2 lines; last "dogfood loop." (2 words) | same | NO |
| §D H2 "Take over or hand back." | 1280 / 768 | single line | single line | NO |
| §D H2 | 375 | wraps to 2 lines; last "hand back." (2 words) | same | NO |
| §E H2 "What we don't do." | all | single line | single line | NO |
| §F H2 "Want a one-page audit of your testing surface?" | 1280 | "of your testing surface?" (4 words) | (same) | NO |
| §F H2 | 375 | "testing surface?" (2 words) | (same) | NO |
| §F body "...No sales pitch. No obligation." | all | "No obligation." (2 words) | same | NO |
| §B body P last line | 1280 | content terminus 3+ words | same | NO |
| §C body P last line | all | 3+ words | same | NO |
| §D shape-card #3 P last line | 375 | "around our tools." (3 words) | same | NO |

**One orphan-word finding: Hero H1 last line "runs." at 375 on both renders.** `text-wrap: balance` is set (computed-style confirmed) but does not prevent it on this 4-word headline at 44 px. Remediation candidates:
- Copy-edit: insert `<wbr>` between "engagement" and "runs." to discourage that break, or rephrase to e.g. "How a testing engagement actually runs." (adds a word, gives the balancer more flexibility).
- L5 CSS: add explicit `<br>` after "engagement" at the `< md` breakpoint (fragile).
- Accept: orphan is a single 5-character word with a period; visually muted; not a WCAG floor. Operator may accept.

---

## Static-preview comparison

| Section | 1280 | 768 | 375 | Notes |
|---|---|---|---|---|
| Header | MATCH | MATCH | MATCH | Sprint 13 canonical. |
| Hero | DELTA (subhead drift; H1 vertical position) | DELTA | DELTA (+ orphan "runs.") | F-NEW-15-B |
| Audit (§B) | DELTA (body P size) | DELTA | DELTA (**H2 size**) | F-NEW-15-A |
| Dogfood (§C) | DELTA (body P; H2 lh) | DELTA | DELTA | sitewide carry |
| Take-over (§D) | DELTA (CTA chrome cascade — though no primary CTA in §D on this page; body wrap) | DELTA | DELTA | body-lg carry |
| What-we-don't-do (§E) | DELTA (body wrap) | DELTA | DELTA | body-lg carry |
| Closing-CTA (§F) | DELTA (**preview CTA bg token wrong**; CTA chrome) | DELTA | DELTA | F-NEW-15-C + F-NEW-4 carry |
| Footer | DELTA (live richer; sitewide Drupal) | DELTA | DELTA | out of scope |

---

## Findings catalog

### F-NEW-15-A — §B H2 mobile size: preview 30 px vs live 40 px (brief ≈ 32 px)

- **Brief:** `display-md` mobile reduction (brief `typography-mobile` block; in design brief responsive section).
- **Live (375):** H2 = 40 / 45.2 (no mobile reduction applied).
- **Preview (375):** H2 = 30 / 33 (preview CSS reduces below `md`).
- **Visible impact:** §B "Audit." headline is ~10 px (CSS) taller on live than preview at mobile; cascades to §C "Stand up the dogfood loop." (which on live wraps differently because the bigger H2 fills more width).
- **Remediation layer:**
  - L1 token (theme display-md mobile rule) on live: add `@media (max-width: 575.98px) { .heading.h2, .dy-section .h2 { font-size: 32px; line-height: 1.10; } }` or equivalent Bootstrap breakpoint to bring live in line with brief.
  - Preview-doc on preview: bump preview's `.section-head h2` mobile rule from 30 → 32 to match brief.
- **Cross-page sweep required (PC-3):** any page that uses `display-md` (every page with non-hero H2s) gains/loses vertical headline height. Mandatory S cross-page diff before merge of any L1 change. (Sprint 14 carry-forward F-NEW-5 also touches `display-md` — fold into same cycle.)
- **Recommended cycle:** Cycle 2 if L1 token change accepted; cross-page sweep PC-3 mandatory.

### F-NEW-15-B — Hero H1 orphan "runs." at 375 on both renders

- **Issue:** Hero H1 "How a testing engagement runs." wraps to 3 lines at 375 with single-word last line "runs." `text-wrap: balance` is computed-active.
- **Memory:** `feedback_no_orphan_words.md` — never leave a single word alone on a line.
- **Remediation candidates:**
  - **Option A — Canvas-content (preferred for autonomous mode).** Insert `<wbr>` between "engagement" and "runs." in both preview and live Drupal canvas content. Smallest scope.
  - **Option B — Copy edit (preferred for editorial review).** Rephrase H1 to a length that balances cleanly, e.g. "How a testing engagement runs, week by week." (8 words; 4-word lines on 375). Requires operator copy approval.
  - **Option C — Accept.** Single-character orphan with terminal period; visually muted; not a WCAG floor. Operator may accept.
- **Layer:** Canvas-content (Option A) or content brief (Option B).
- **Recommended cycle:** Cycle 3 or fold into Cycle 2 if operator picks Option A — Canvas edit only.
- **Operator decision required.**

### F-NEW-15-C — Closing-CTA preview-doc primary token wrong (carry from Sprint 14 F-NEW-3 pattern)

- **Brief line 319:** Dark-zone primary CTA = `#5DC6E8` + `#1F1A14` text (~8.81:1, AA pass).
- **Live:** rgb(93, 198, 232) + rgb(31, 26, 20) ✅ correct.
- **Preview:** rgb(98, 187, 203) + white ❌ — uses light-zone token on espresso section.
- **Remediation layer:** Preview-doc (`docs/pl2/Previews/how-we-do-it.html` — find the `.closing-cta .btn--primary` rule and update bg/color).
- **Recommended cycle:** Cycle 2 (bundle with any other preview-doc edits).

### F-NEW-15-D (informational/advisory) — Primary CTA component chrome (carry F-NEW-4)

- **Issue:** Live's primary CTA uses the `dripyard_base:button` component which appends a 32-px SVG chevron-circle suffix → 56 px pill height. Preview uses a flat `<a class="btn--primary">` → 45 px pill height.
- **Affected placements on this page:** §F closing-CTA primary "Book a testing review" only (other section CTAs are text or in footer).
- **Operator decision pending from Sprint 14.** Recommend the Sprint 14 Option C (brief-doc: document the suffix-icon as shipped Drupal-component behavior, not part of the visual-fidelity contract). Same recommendation — bundle into a future "CTA-component spec audit" sprint.

### F-NEW-15-E (advisory, informational) — Runbook expected heal-flow on this page; page has none

- **Issue:** The Sprint 15 runbook called for special attention to the heal-flow SVG with mobile horizontal scroll. The canonical preview and the live page both have **zero** heal-flow content. The brief consistently places heal-flow on the **homepage**, not `/how-we-do-it`.
- **Remediation:** **None required.** Documentation slip in runbook; not a defect. Could update the runbook to remove the heal-flow section in a doc-only edit if desired.

### Carry-forwards (out of /how-we-do-it scope)

- F-NEW-6 (body-lg sitewide drift) — every page; sitewide token cycle.
- F-NEW-7 (hero subhead drift) — sitewide token cycle.
- F-NEW-4 (CTA suffix-icon component delta) — pending Sprint 14 operator decision.
- F-NEW-5 (live `display-md` line-height +1.2 px vs brief) — fold into a sitewide typography pass; same root cause as F-NEW-15-A's live-side overshoot.
- Footer richness — sitewide Drupal pattern.

---

## Recommendation — Cycle 2..N carve

### Cycle 2 — Preview-doc batch (no live changes)

- **Branch:** `aa/pl-sprint-15-cycle-2-preview-doc`
- **Scope:**
  - F-NEW-15-C: change preview's `.closing-cta .btn--primary` bg/color tokens to `#5DC6E8` / `#1F1A14`.
  - **Optional bundle:** F-NEW-15-B Option A (canvas-content `<wbr>` insertion) if operator chose that fix path — requires both preview-doc and Drupal canvas edit.
- **Verification:** Re-run `scripts/sprint-15-cycle-1-capture.mjs` + `…-diff.mjs`; the closing-CTA section DSSIM at 1280/768/375 should drop materially (~30–40%).
- **F→T→S:** F implements; T validates structural HTML/CSS; S re-audits and confirms.

### Cycle 3 — F-NEW-15-A `display-md` mobile token + cross-page S sweep

- **Branch:** `aa/pl-sprint-15-cycle-3-display-md-mobile-token`
- **Scope:**
  - **L1 token (live):** add a mobile reduction rule for `.heading.h2` / `.dy-section .h2` at `< 576 px` to 32 / 1.10 (or whatever brief dictates).
  - **Preview-doc (preview):** bump preview's `.section-head h2` mobile rule from 30 → 32.
- **Cross-page sweep mandatory (PC-3):** every page that uses `display-md` H2 (homepage, /services, /about-us, /open-source-projects, /how-we-do-it, articles) gains/loses headline height at 375 — must verify no CTA stacking disruption.
- **F→T→S:** F implements; T validates @media cascade; S runs cross-page sweep.

### Cycle 4 — F-NEW-15-B orphan-word remediation

- **Branch:** `aa/pl-sprint-15-cycle-4-h1-orphan-runs`
- **Scope:** Depends on operator choice (Options A/B/C above). If Option A — Canvas-content `<wbr>` insert (recommended for autonomous mode). If Option B — copy edit needs editorial approval. If Option C — close as accept.
- **Operator decision required.**

### Deferred / out of Sprint 15 scope

- F-NEW-15-D (CTA suffix-icon component delta) — sitewide; awaits Sprint 14 operator decision.
- Body-lg sitewide drift — sitewide token cycle (not Sprint-15 scope).
- Footer richness — sitewide.

---

## Scripts (durable artifacts)

| Script | Purpose |
|---|---|
| `scripts/sprint-15-cycle-1-capture.mjs` | 2× retina captures of live + preview at 1280/768/375 |
| `scripts/sprint-15-cycle-1-measure.mjs` | Section bounding boxes + chrome mask + page horizontal-scroll probe |
| `scripts/sprint-15-cycle-1-diff.mjs` | Apply mask, anchored per-section crops, DSSIM/PSNR/AE per section + wholepage |
| `scripts/sprint-15-cycle-1-probe.mjs` | Computed-style probes (H1, subhead, H2, body P, primary CTA, kicker) + line-count + last-line text for orphan check |

All scripts idempotent; may be re-run in Cycles 2..N to confirm fixes.

---

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/how-we-do-it.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/briefs/pl_design_brief.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--sprint-15-how-we-do-it-fidelity-hq.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-14-cycle-1-audit.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-14-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-15-cycle-1/` (PNGs + measurements.json + diff-results.json + probes.json)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-15-cycle-1-*.mjs`

---

## Verdict

**REWORK** — Cycle 2..N carve recommended.

Three actionable findings on `/how-we-do-it`:
1. **F-NEW-15-A** — `display-md` H2 mobile size mismatch (live too big, preview too small vs brief). L1 token + preview-doc + cross-page sweep.
2. **F-NEW-15-B** — H1 orphan "runs." at 375 on both renders. Canvas-content `<wbr>` (recommended) or copy edit.
3. **F-NEW-15-C** — Preview closing-CTA primary token wrong (same defect as Sprint 14's preview-doc). Preview-doc only.

Plus advisories:
- Runbook expected a heal-flow on this page; it doesn't exist (heal-flow is on homepage). No fix needed.
- Sprint 14 F-NEW-4 CTA suffix-icon component delta still pending operator decision; reappears on this page's §F.
- Body-lg sitewide drift persists across both renders — sitewide token cycle, out of /how-we-do-it scope.

The HQ method confirms its value: per-section DSSIM 0.17–0.30 across every section signals real visible deltas; the actionable subset is small (three discrete fixes close the entire delta surface in /how-we-do-it scope).
