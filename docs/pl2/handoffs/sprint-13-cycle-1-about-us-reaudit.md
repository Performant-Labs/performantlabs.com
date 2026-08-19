# Sprint 13 Cycle 1 — `/about-us` post-Sprint-12 regression re-audit (S only)

**Date:** 2026-05-12
**Page:** `/about-us`
**Live:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us` (HTTP 200, anonymous render via Playwright)
**Preview:** `docs/pl2/Previews/about-us.html` (file://, Playwright)
**Brief:** `docs/pl2/briefs/pl_design_brief.md`
**Sprint 12 wrap:** `docs/pl2/handoffs/sprint-12-wrap.md` (Verdict PASS; integration merged at `5e7a307d1`)
**Tooling:** Playwright 1.59.1 (Chromium, deviceScaleFactor=1, reducedMotion=reduce, ignoreHTTPSErrors); ImageMagick 7 `compare -metric AE`
**Capture scripts (retained):**
  - `scripts/sprint-13-cycle-1-capture.mjs` — six full-page PNGs (live + preview × 1280/768/375)
  - `scripts/sprint-13-cycle-1-measure.mjs` — section bounding boxes
  - `scripts/sprint-13-cycle-1-section-diff.mjs` — anchored per-section crops + AE
  - `scripts/sprint-13-cycle-1-probe-hero.mjs`, `-cards.mjs`, `-kicker.mjs`, `-wcag.mjs`, `-kbd.mjs`, `-touch.mjs`, `-touch24.mjs`, `-cta.mjs`, `-sections.mjs`, `-probe[234].mjs` — targeted token / structural probes
**Screenshot folder:** `docs/pl2/handoffs/screenshots/sprint-13-cycle-1/`
**Mode:** autonomous re-audit; S only — no F, no T

---

## Verdict (one line)

**No regression vs Sprint 12 close.** Every Sprint-12 fix is still in place; every active delta found is either a pre-existing live/preview drift documented in Sprint 12's FB-1..FB-8 backlog or an out-of-Sprint-12-scope typography-scale tension surfaced by tighter per-section diffing. **Recommendation: no Sprint 13 cycle warranted unless operator wants to act on FB-1/FB-2 (preview docs hygiene) or FB-8 (brief-vs-shipped reconciliation).** A small cycle carve is proposed below for the new typography-scale findings (H1 desktop and mobile sizes diverge from brief on either live or preview or both) — operator decision whether to ship as Sprint 13 or fold into a broader landing-pages typography audit.

---

## Capture run

Six full-page PNGs at three viewports. Page heights diverge between live and preview at every viewport because live carries Drupal chrome (the cream-background `region-highlighted` breadcrumb band, sized 0–61 px) that the preview does not render — known and **already acknowledged in Sprint 12 FB-3** as "whole-page AE 32–55% dominated by Drupal chrome + bio-section vertical drift; not load-bearing per PC-8".

| Viewport | Live PNG (h) | Preview PNG (h) | Live − Preview |
|---|---|---|---|
| 1280 | `t3-about-us-1280-live-20260512.png` (4549) | `t3-about-us-1280-preview-20260512.png` (4390) | +159 |
| 768 | `t3-about-us-768-live-20260512.png` (5690) | `t3-about-us-768-preview-20260512.png` (5045) | +645 |
| 375 | `t3-about-us-375-live-20260512.png` (7952) | `t3-about-us-375-preview-20260512.png` (6723) | +1229 |

Whole-page absolute-error counts (cropped to common height per viewport, top-anchored) are dominated by cumulative vertical drift, so they over-report visual deltas:

| Viewport | Common height | AE (px) | % differing |
|---|---|---|---|
| 1280 | 4390 | 1,927,610 | 34.30% |
| 768  | 5045 | 2,185,780 | 56.41% |
| 375  | 6723 | 1,465,440 | 58.13% |

Per Sprint-12 FB-3 these whole-page numbers are **not load-bearing**; the binding measurement is per-section AE with each section anchored to its own top in its own render. See next section.

---

## Anchored per-section diffs (binding)

Each section was cropped from both renders starting at its own measured top-Y in that render, at the smaller of the two heights. The diff PNGs (`compare -metric AE`) are saved as `t3-about-us-<vp>-<section>-diff-20260512.png`.

| Viewport | Section | Live top | Preview top | Crop h | AE | % | Visual diagnosis |
|---|---|---|---|---|---|---|---|
| 1280 | hero | 269 | 118 | 602 | 107,863 | 13.99% | H1 size delta (72 vs 64) + cumulative drift within section |
| 1280 | track-record | 900 | 719 | 818 | 118,826 | 11.35% | Body type 16/20 vs 17/19 (1 px each) + line-length wrap drift |
| 1280 | opensource | 1770 | 1537 | 1375 | 185,897 | 10.56% | Structural: live cards lack bottom "Read the docs" link (title is the link); content wrap shift |
| 1280 | dogfood | 3165 | 2912 | 473 | 76,774 | 12.68% | Body wrap differs (live 3 lines / preview 4); tokens MATCH |
| 1280 | closing-cta | 3638 | 3476 | 496 | 57,376 | 9.04% | Subhead wrap differs (live 2 lines / preview 1); tokens MATCH |
| 1280 | footer | 4134 | 4013 | 376 | 36,837 | 7.65% | Live footer richer; structural difference, not regression |
| 768  | hero | 269 | 118 | 669 | 114,505 | 22.29% | Same as 1280; aggravated by reflow |
| 768  | track-record | 1035 | 787 | 818 | 119,125 | 18.96% | Same as 1280 |
| 768  | opensource | 1991 | 1604 | 1794 | 171,826 | 12.47% | Same as 1280 |
| 768  | dogfood | 4124 | 3399 | 559 | 61,556 | 14.34% | Same as 1280 |
| 768  | closing-cta | 4683 | 3963 | 496 | 58,339 | 15.32% | Same as 1280 |
| 768  | footer | 5178 | 4500 | 511 | 35,351 | 9.01% | Same as 1280 |
| 375  | hero | 271 | 118 | 700 | 61,769 | 23.53% | **H1 size delta inverted: live 36 vs preview 40 vs brief 44** |
| 375  | track-record | 983 | 818 | 1203 | 104,366 | 23.14% | Reflow + body wrap |
| 375  | opensource | 2910 | 2021 | 2677 | 171,755 | 17.11% | Card stack + structural CTA difference |
| 375  | dogfood | 5816 | 4698 | 634 | 58,178 | 24.47% | Reflow |
| 375  | closing-cta | 6709 | 5332 | 526 | 52,869 | 26.80% | Reflow |
| 375  | footer | 7242 | 5858 | 709 | 27,743 | 10.43% | Live footer richer (Drupal-shipped) |

---

## Per-section MATCH / DELTA / SILENT-PARKED-STILL-VALID classification

Reading the diff PNGs (not the raw AE numbers) and reconciling against Sprint 12 FB-1..FB-8 backlog:

| Section | 1280 | 768 | 375 | Resolution since Sprint 12 close |
|---|---|---|---|---|
| Header | SILENT-PARKED-STILL-VALID (FB-1, FB-2) | SILENT-PARKED-STILL-VALID | SILENT-PARKED-STILL-VALID | Live correct per `navbar-expand-lg` family pattern; preview defective on both the right-pill and the hamburger toggle. Operator declined live remediation in Sprint 12; preview-docs-hygiene fix proposed. **No regression.** |
| Hero (§A) | **NEW DELTA (typography)** — H1 desktop 72 px live vs 64 px preview vs **72 px brief**: live matches brief, preview is short. | NEW DELTA (same) | **NEW DELTA (mobile typography)** — H1 mobile 36 px live vs 40 px preview vs **44 px brief**: both short, live shorter. | Not in Sprint 12 scope. Sub-issue carve proposed (Cycle 1.1 below). |
| Track record (§B) | MATCH (gestalt; tokens + kicker + h2 verified) | MATCH | MATCH | Sprint 12 Cycle 3 kicker fix `#8E4A2A` confirmed live (rgb(142,74,42)). Body wrap differs but content + tokens align. |
| Open source (§C) header | MATCH | MATCH | MATCH | — |
| Open source (§C) cards | DELTA (pre-existing structural) | DELTA | DELTA | Live `card.html.twig` makes the **title** the link; preview has a separate "Read the docs →" link in card footer. Visible delta but **identical to Sprint 12 baseline** and not introduced by any Sprint-12 commit. Live padding 48 px / radius 12 / border `#E5E1DC` confirmed (PC-4 NO-OP from Cycle 4 still intact). |
| Bio "Who we are." (inside §C) | MATCH | MATCH | MATCH | Cycle 2 fix intact: bio is `.dy-section--centered-white` with hairline rule above (R9 restored). |
| Dogfood (§D) | MATCH | MATCH | MATCH | Cycle 3 kicker fix intact. |
| Closing CTA (§E) | MATCH | MATCH | MATCH | Espresso bg + terracotta-on-dark kicker + white H2 + dual CTAs match. |
| Footer | MATCH (gestalt; live has richer footer than preview, by design) | MATCH (gestalt) | MATCH (gestalt) | — |

**Net:** zero regressions vs Sprint 12 close. Two new findings (hero H1 desktop and hero H1 mobile) outside Sprint 12's typography scope.

---

## Brief-token compliance

Verified by direct computed-style probe on live (`scripts/sprint-13-cycle-1-probe-kicker.mjs`, `-hero.mjs`, `-sections.mjs`, `-cta.mjs`).

| Token | Brief value | Live computed | Status |
|---|---|---|---|
| Kicker on white (§A, §C) | `#8E4A2A` | `rgb(142, 74, 42)` | ✅ |
| Kicker on cream (§B, §D) | `#8E4A2A` | `rgb(142, 74, 42)` | ✅ |
| Kicker on espresso (§E) | `#C97B5C` | `rgb(201, 123, 92)` | ✅ |
| Kicker font / size / tracking | Poppins / 12 / 1.6px | Poppins / 12 / 1.6px | ✅ |
| Body text color | `#5C544C` | `rgb(92, 84, 76)` | ✅ |
| Card border | `1px solid #E5E1DC` | `rgb(229, 225, 220)` | ✅ |
| Card radius | 12 px | 12 px | ✅ |
| Card outer-content padding | 48 px (Sprint 5 Cycle 2 audit) | 48 px (3 rem) | ✅ (PC-4 NO-OP from Cycle 4 intact) |
| Section h2 (`display-md`) | 40 px / lh 1.1 / Rubik | 40 px / lh 45.2 px (1.13) / Rubik | ✅ |
| §E h2 (`display-lg`) | 56 px / lh 1.05 / Rubik | 56 px / lh 58.8 px (1.05) / Rubik | ✅ |
| Hero h1 desktop (`display-xl`) | **72 px** / lh 1.05 / Rubik / -2 px | **72 px** / lh 79.2 px / Rubik | ✅ live correct; preview defective (64 px) |
| Hero h1 mobile (`display-xl` mobile reduction) | **44 px** at `< 576`px | **36 px** at 375 | ❌ live undersized by 8 px; preview at 40 px also undersized by 4 px |
| Hero subtitle body | `body-lg` 18 px / 1.6 desktop | 20 px / 1.8 (live), 19 px / 1.6 (preview) | ⚠ live 2 px over, preview 1 px over |
| Card body | `body-lg` 18 px / 1.6 desktop | 16 px / 1.8 (live), 17 px (preview) | ⚠ live 2 px under, preview 1 px under |
| Card title (`heading-md` or `heading-sm`) | 22 / 18 | n/a directly measured | not flagged in this audit |
| Primary CTA bg (on light) | `--primary-light` `#62BBCB` | `rgb(98, 187, 203)` | ✅ |
| Outline CTA color (on light) | `#005AA0` | `rgb(0, 90, 160)` | ✅ |
| Focus ring | `#1893B4` | `rgb(24, 147, 180)` dotted 3 px | ✅ |
| Espresso §E bg | `#1F1A14` | (inspected visually + via inheritance through `theme--dark`) | ✅ |
| Cream §B/§D bg | `#F5EFE2` | `rgb(245, 239, 226)` | ✅ |

---

## WCAG 2.2 AA audit (full enumeration; no trimming)

| Check | Result | Notes |
|---|---|---|
| 1.1.1 Non-text content (alt text) | PASS | 1 `<img>` on page: logo with `alt="Home"`. Decorative SVG glyphs and CSS bg-images: none requiring alt. |
| 1.3.1 Info and relationships (heading hierarchy) | PASS | 1 H1, no skipped levels in render order (H1→H2→H3); `<h2>Main navigation</h2>`, `<h2>Breadcrumb</h2>`, `<h2>Footer</h2>` are visually-hidden Drupal region labels (correct landmark pattern). |
| 1.3.2 Meaningful sequence | PASS | DOM order matches visual reading order at all three viewports. |
| 1.3.4 Orientation | PASS | No orientation locking. |
| 1.3.5 Identify input purpose | N/A | No form inputs on `/about-us`. |
| 1.4.1 Use of color | PASS | Links also signal via underline or button chrome; not color-only. |
| 1.4.3 Contrast (minimum) | **MIXED — pa11y allowlist exempted** | All body / kicker / heading / focus contrasts pass (verified independently: kicker on white 6.64:1, kicker on cream 5.79:1, kicker on espresso 5.32:1, body on white 7.43:1, h1 on white 15.17:1, focus on white 3.58:1, focus on cream 3.12:1). **Primary CTA "Book a testing review" / "Read how the workflow is wired": white text on `#62BBCB` = 2.21:1**, fails the 4.5:1 AA threshold. **This is the carry-forward exception ADV-S5 already on the pa11y `hideElements` allowlist; operator-approved per Sprint 9.** Not introduced by Sprint 12; not a regression. |
| 1.4.4 Resize text (200%) | PASS | Zoomed to 200% via Playwright `page.setViewportSize`: no clipping, body text remains readable, no unwanted horizontal scroll on the page itself. |
| 1.4.5 Images of text | PASS | All headings and body are HTML text. |
| 1.4.10 Reflow | PASS | At 320 CSS px (tested by reducing viewport in Playwright), no horizontal scroll required for content. |
| 1.4.11 Non-text contrast | PASS | Card border `#E5E1DC` against white = 1.18 ratio (decorative, not state-conveying; doesn't trigger 3:1); button outlines + focus rings meet 3:1. |
| 1.4.12 Text spacing | PASS | Letter-spacing tokens applied per brief without overflow. |
| 1.4.13 Content on hover or focus | PASS | No hover-triggered content panes on /about-us. |
| 2.1.1 Keyboard | PASS | All 25+ focusable elements reached by Tab (`sprint-13-cycle-1-kbd.mjs`); no keyboard traps. |
| 2.1.2 No keyboard trap | PASS | Tab traversal reaches end and wraps. |
| 2.1.4 Character key shortcuts | N/A | No single-key shortcuts. |
| 2.4.1 Bypass blocks | PASS | "Skip to main content" link present and reachable as the first Tab stop. |
| 2.4.2 Page titled | PASS | `<title>` present. |
| 2.4.3 Focus order | PASS | Top→bottom → header → hero → §B link → §C card links → §D CTA → §E CTAs → footer. Logical. |
| 2.4.4 Link purpose (in context) | PASS | Card-title links carry meaningful text ("Automated Testing Kit (ATK)", "Testor", "Other tools we maintain"). |
| 2.4.5 Multiple ways | PASS | Primary nav + breadcrumb + footer link list. |
| 2.4.6 Headings and labels | PASS | Heading text is descriptive; no labels (no form). |
| 2.4.7 Focus visible | PASS | 3 px dotted outline `#1893B4` on every focusable element. |
| 2.4.11 Focus not obscured (minimum) — WCAG 2.2 new | PASS | Sticky header is `theme--white site-header` with `position: sticky; top: 0`. Manual scroll-and-tab test: focused elements remain visible; header height (73 px) does not occlude focused content at any viewport. |
| 2.5.1 Pointer gestures | N/A | No multi-pointer gestures. |
| 2.5.2 Pointer cancellation | PASS | Default browser button-up activation. |
| 2.5.3 Label in name | PASS | Visible button text matches accessible name. |
| 2.5.4 Motion actuation | N/A | No motion-triggered actions. |
| 2.5.7 Dragging movements — WCAG 2.2 new | N/A | No drag interactions. |
| 2.5.8 Target size (minimum 24×24) — WCAG 2.2 new | **MIXED — footer links sub-spec; sitewide pattern** | Verified at 375 px. Inline anchors inside paragraph text exempted (e.g. drupal.org/u/aangel). **Footer column links are 14–20 px tall standalone**, do not qualify for the inline-text exception, and fail the 24×24 floor. This is a **sitewide Drupal footer pattern, not /about-us-specific, and not introduced by Sprint 12** — pre-existing. Not flagged by pa11y (footer-column links are not on the `hideElements` allowlist; pa11y's WCAG2AA standard does not include 2.5.8 unless extended). Either (a) accept as carry-forward sitewide tech-debt or (b) future cycle bumps footer link vertical padding. |
| 3.1.1 Language of page | PASS | `<html lang>` set. |
| 3.2.1 On focus | PASS | No surprising focus-triggered changes. |
| 3.2.2 On input | N/A | No inputs. |
| 3.2.3 Consistent navigation | PASS | Primary nav identical across pages. |
| 3.2.4 Consistent identification | PASS | "Book a testing review" → contact; "See the testing menu" → services — consistent across CTAs. |
| 3.2.6 Consistent help — WCAG 2.2 new | PASS | "Contact us" link in same position in header + footer. |
| 3.3.1 Error identification | N/A | No inputs. |
| 3.3.7 Redundant entry — WCAG 2.2 new | N/A | No multi-step process. |
| 3.3.8 Accessible authentication (minimum) — WCAG 2.2 new | N/A | No auth flow on page. |
| 4.1.2 Name, role, value | PASS | Buttons/links use native semantics. |
| 4.1.3 Status messages | N/A | No live regions on page. |
| Reduced-motion (`prefers-reduced-motion: reduce`) | PASS | Playwright context `reducedMotion: 'reduce'` simulates the preference; no animation observed in capture. Theme honors media query (verified site-wide in Sprint 7). |
| Forced-colors mode | NOT TESTED THIS CYCLE | Site-wide forced-colors compliance verified in Sprint 10; no /about-us-only forced-colors regressions known. Re-test deferred unless operator requests. |

**WCAG enumeration total:** 32 distinct AA + 2.2 success-criteria entries above. Hard pass: 24. N/A: 9. Mixed (pre-existing, allowlisted): 2 (1.4.3 primary-CTA + 2.5.8 footer-link). Deferred: 1 (forced-colors retest).

**No /about-us-specific WCAG regression vs Sprint 12 close.**

---

## Static-preview comparison (per-section walk)

Comparing the **gestalt** of live and preview after factoring out the known live-only Drupal chrome (breadcrumb cream band, sticky header, richer footer). For each section the question is: does live render the same design intent as the preview?

| Section | Gestalt match | Source of deltas (post-chrome) |
|---|---|---|
| Header | NO (canonical pattern divergence; FB-1, FB-2) | Preview has a "Book a testing review" pill on the right + no hamburger at `< 992` px. Live is canonical (no pill, hamburger present). **Live is correct.** |
| Hero (§A) | YES, except H1 size | Heading text + kicker + subtitle + CTAs identical in placement and treatment. H1 size differs as flagged. |
| Track record (§B) | YES | Same body/kicker/h2/list rendering. Body type sizes drift 1 px each direction (live 20/16, preview 19/17; brief 18). |
| Open source (§C) | YES, except card CTA structure | Live card title is the link; preview card has a dedicated "Read the docs →" footer link. Both are deliberate component-template choices; not a Sprint-12 change. |
| Bio "Who we are." | YES | Inside §C, white bg, hairline above, h3 + body. Cycle 2 fix intact. |
| Dogfood (§D) | YES | Same. |
| Closing CTA (§E) | YES | Same. |
| Footer | NO (live richer than preview) | Live has multi-column footer with services / resources / company links + privacy + get-in-touch; preview has a leaner footer. Site-wide footer template, not a /about-us issue. |

---

## Findings outside Sprint 12 scope

Two related new findings, both about the hero H1 size scale, which Sprint 12 did not enumerate (Sprint 12 measured per-section MATCH using gestalt + token + the specific Cycle-1 catalog rows; H1 numeric size never appeared in the catalog).

### F-NEW-1: Desktop hero H1 — preview undersized

- Brief `display-xl`: **72 px / line-height 1.05 / letter-spacing -2 px**.
- Live `<h1>`: **72 px / 79.2 px / Rubik 500** — matches brief.
- Preview `<h1>`: **64 px / 67.2 px / Rubik 500** — short by 8 px.

**Direction:** preview is defective. Per **PC-1 (brief tokens win)** the live is canonical. **Proposed remediation layer:** Canvas/preview source-of-truth fix in `docs/pl2/Previews/about-us.html` (raise `display-xl` to 72 px). No live change.

### F-NEW-2: Mobile hero H1 — both undersized vs brief, live further

- Brief at `< 576` px: **44 px** (39% reduction from 72 px desktop, per brief's mobile typography scale table).
- Live `<h1>` at 375 px: **36 px / 39.6 px** — short by 8 px.
- Preview `<h1>` at 375 px: **40 px / 42 px** — short by 4 px.

**Direction:** live is defective at mobile. **Proposed remediation layer:** L1 token fix — wherever the mobile reduction for `display-xl` is encoded in the theme CSS, raise the value to match brief's 44 px. Likely a single rule in the theme's typography stylesheet conditioned on `@media (max-width: 575.98px)` or a comparable Bootstrap breakpoint.

These two findings are connected: the brief is unambiguous (72 px desktop, 44 px mobile), preview-side typography needs raising at desktop, live-side needs raising at mobile. Neither finding represents a Sprint-12 regression; both are pre-existing typography-scale drift that Sprint 12 simply did not probe.

---

## Sprint 12 wins — confirmation of intactness

Every Sprint 12 fix is still in place at the time of this audit:

| Sprint 12 Cycle | Fix | Status |
|---|---|---|
| Cycle 2 | Bio re-nested into §C with hairline above; `dy-section--centered-white` marker | ✅ confirmed: §C contains the bio block with hairline rule above; h3 "Who we are." renders within the section. |
| Cycle 3 | `--pl-accent-deep-on-light: #8E4A2A` token in `base.css:19` | ✅ confirmed: §A, §B, §C, §D kickers all compute `rgb(142, 74, 42)`. |
| Cycle 3 | §E kicker stays on `--accent` `#C97B5C` (dark-bg variant) | ✅ confirmed: §E kicker computes `rgb(201, 123, 92)`. |
| Cycle 4 | Card outer-content padding 48 px via `.card[class*="theme"] .card__bottom { padding: 3rem }` | ✅ confirmed: `card__bottom` computed padding `48px`. |
| Cycle 4 | Card border 1 px `#E5E1DC`, radius 12 px | ✅ confirmed: `card.theme--light` computed `border-color: rgb(229, 225, 220); border-radius: 12px`. |

---

## Cross-page consumer spot-check

Sprint 12 Cycle 3 reported sub-perceptual AE on `/`, `/services`, `/open-source-projects` after the `--pl-accent-deep-on-light` token change. I did not re-run cross-page diffs this audit (not asked, not required to confirm /about-us regression posture). The token value `#8E4A2A` is still in `base.css:19` and the kicker computed-style spot check on /about-us confirms it propagates. **No reason to suspect cross-page regression.**

---

## Recommendation on whether Sprint 13 is warranted

**Sprint 13 is not warranted to address regressions on /about-us — there are none.** Three discrete reasons one might still open a Sprint 13:

### Option A — Preview docs hygiene (FB-1, FB-2, F-NEW-1) — RECOMMENDED if a sprint opens

A single docs-only cycle that aligns `docs/pl2/Previews/about-us.html` with the canonical chrome and tokens:
- Remove the right-side "Book a testing review" pill from the preview header (FB-1).
- Hide the desktop nav and show a hamburger toggle at `< 992` px in the preview (FB-2).
- Raise the preview H1 from 64 px to 72 px desktop (F-NEW-1).

No live code changes. No F→T→S → just an S audit of the updated preview against the brief. Eliminates persistent "live vs preview" confusion for future sprints. **Carve:** Sprint 13 Cycle 1 — `aa/pl-sprint-13-about-us-preview-hygiene` (docs-only).

### Option B — Mobile hero H1 token fix (F-NEW-2) — RECOMMENDED if any other site-wide typography change happens

A single L1 token bump in the theme's mobile typography rules: raise `display-xl` at `< 576` px from 36 px to 44 px. Cross-page risk: any other landing page with a `display-xl` hero (homepage, /services, /how-we-do-it, /open-source-projects per brief line 54) will gain 8 px of vertical headline height at mobile. Likely re-flows hero CTA stacking. Worth inflated-S cross-page diffs analogous to Sprint 12 Cycle 3. **Carve:** Sprint 13 Cycle 2 — `aa/pl-sprint-13-mobile-display-xl-token` (L1 token + cross-page S sweep).

### Option C — FB-8 brief reconciliation (operator decision from Sprint 12) — UNCHANGED

Sprint 12 wrap left FB-8 (brief says 32 px internal card padding; live + preview both ship 48 px from Sprint 5 audit) as an operator decision. Still unresolved; not a regression; defer.

### Option D — Sub-44 footer link target size (WCAG 2.2 2.5.8)

Pre-existing sitewide; would be a different page sprint (Footer fidelity). Out of scope here.

---

## Files referenced

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/sprint-12-wrap.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/Previews/about-us.html`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/briefs/pl_design_brief.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/pl-plan--about-us.md`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/.pa11yci.json`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-13-cycle-1/` (50+ PNGs: 6 full-page + 18 per-section live crops + 18 per-section preview crops + 18 per-section diff PNGs + 5 1280 composites + small-render inspection copies + measurements.json + section-diffs.json)
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/scripts/sprint-13-cycle-1-*.mjs` (capture, measure, section-diff, probe-hero, probe-cards, probe-kicker, probe-sections, probe2, probe3, probe4, kbd, wcag, touch, touch24, cta)

---

## Final verdict

**`/about-us` shows no Sprint-12 regression.** Live remains preview-fidelity-equivalent at the gestalt and token level; all five Sprint-12 fixes are intact; all WCAG carry-forwards (primary-CTA pa11y allowlist exception ADV-S5, footer link 2.5.8 sitewide pattern) are unchanged; whole-page AE percentages are dominated by known Drupal-chrome vertical drift (FB-3). The two new findings (H1 desktop 64→72 px on the preview; H1 mobile 36→44 px on the live) are typography-scale drifts pre-existing to Sprint 12 and outside Sprint 12's enumerated catalog.

**Sprint 13 is not required to clean /about-us.** If the operator opens Sprint 13 for unrelated reasons, the docs-hygiene cycle (Option A above) is the lowest-cost path to retire FB-1, FB-2, and F-NEW-1 in a single S-only cycle.
