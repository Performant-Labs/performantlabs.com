# Handoff-S: FU-2 — Hero H1 Live-CSS Reconciliation

**Date:** 2026-05-11
**Branch:** `aa/pl-fu2-hero-h1-live-reconciliation`
**Issue:** `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-F.md`
**Operator-facing report:** [`fu2-hero-h1-live-reconciliation-report.html`](fu2-hero-h1-live-reconciliation-report.html)

## T precondition

Confirmed: T reported zero blocking issues. All five acceptance criteria are PASS in T's handoff (AC3 deferred to S as expected). Computed-style probe at 1280 and 375 shows all four landing-page hero H1s render brief-canonical `72/500/1.05/-2px` (desktop) and `44/500/1.05/-1px` (mobile). WCAG contrast 17.27:1 (AAA).

## Preconditions

| Precondition | Result |
|---|---|
| T precondition (zero blocking issues) | PASS |
| Browser-tool precondition (Claude in Chrome MCP available) | PASS |
| Visual-diff-tool precondition (Playwright + ImageMagick) | PASS (Playwright via `node_modules/playwright`, `compare` at `/opt/homebrew/bin/compare`) |

URL note: T's curl commands used `http://localhost` via `ddev exec`. From host context, the correct DDEV URL is `https://pl-performantlabs-com-3.ddev.site:8493`. First Playwright attempt at `pl-performantlabs-com-3.ddev.site` (no port) returned 404; corrected URL returns 200 and renders the expected pages.

## Preview sanity check

| Concern | Result | Notes |
|---|---|---|
| Header CTA pill in preview vs live | DEVIATION (NOT blocking for FU-2) | Previews still show a right-side "Call today" / "Book a testing review" header pill that the canonical site header does not have (per `design_header_nav_breakpoint` memory). This is upstream of FU-2 (header concern, not hero-H1 concern) and is consistent with the prior PL2 header reassessment. Not raised as ADVISORY-HOLD because it is pre-existing and out of scope. |
| Mobile hamburger breakpoint | OK | Previews mobile (375) show hamburger; live mobile (375) shows hamburger; both behave per the navbar-expand-lg convention. |
| Heading levels in preview hero | OK | Single H1 inside `.landing-hero`. No skipped levels. |
| Brief vs preview vs live alignment on `display-xl` | ALIGNED | Brief: `72/500/1.05/-2px` desktop, `44/500/1.05/-1px` mobile. Previews now show same values (per Cycle 3 preview update + O's 3 mini-edits this cycle). Live computed-style probe confirms same values. All three surfaces (brief / preview / live) now report the same numbers. |

No advisory-worthy preview defect that affects this cycle's scope.

## Tier 3 visual audit

### Visual diff results — hero band crops (top 1000px @ 1280, top 800px @ 375)

Per-page rationale for cropping: the hero H1 is the only element changed in FU-2. Whole-page diffs would include below-the-fold content (3000-9000px of page body) that has its own pre-existing live-vs-preview deltas unrelated to hero typography (e.g. CMS-driven content blocks, lazy images, footer). The hero crop isolates the visual surface this cycle touches.

| Page-Viewport | Live screenshot | Preview screenshot | Diff PNG | Composite | Pixels different | Hero-band delta % |
|---|---|---|---|---|---|---|
| home / 1280 | `t3-home-1280-live-20260511.png` | `t3-home-1280-preview-20260511.png` | `t3-home-1280-diff-hero-20260511.png` | `t3-home-1280-composite-20260511.png` | 124,045 | 9.69% |
| services / 1280 | `t3-services-1280-live-20260511.png` | `t3-services-1280-preview-20260511.png` | `t3-services-1280-diff-hero-20260511.png` | `t3-services-1280-composite-20260511.png` | 322,504 | 25.20% |
| how-we-do-it / 1280 | `t3-hwdi-1280-live-20260511.png` | `t3-hwdi-1280-preview-20260511.png` | `t3-hwdi-1280-diff-hero-20260511.png` | `t3-hwdi-1280-composite-20260511.png` | 512,058 | 40.00% |
| open-source-projects / 1280 | `t3-oss-1280-live-20260511.png` | `t3-oss-1280-preview-20260511.png` | `t3-oss-1280-diff-hero-20260511.png` | `t3-oss-1280-composite-20260511.png` | 458,461 | 35.82% |
| home / 375 | `t3-home-375-live-20260511.png` | `t3-home-375-preview-20260511.png` | `t3-home-375-diff-hero-20260511.png` | `t3-home-375-composite-20260511.png` | 71,217 | 23.74% |
| services / 375 | `t3-services-375-live-20260511.png` | `t3-services-375-preview-20260511.png` | `t3-services-375-diff-hero-20260511.png` | `t3-services-375-composite-20260511.png` | 130,885 | 43.63% |
| how-we-do-it / 375 | `t3-hwdi-375-live-20260511.png` | `t3-hwdi-375-preview-20260511.png` | `t3-hwdi-375-diff-hero-20260511.png` | `t3-hwdi-375-composite-20260511.png` | 128,041 | 42.68% |
| open-source-projects / 375 | `t3-oss-375-live-20260511.png` | `t3-oss-375-preview-20260511.png` | `t3-oss-375-diff-hero-20260511.png` | `t3-oss-375-composite-20260511.png` | 133,647 | 44.55% |

All raw + diff + composite PNGs at: `docs/pl2/handoffs/screenshots/fu2-hero-h1/`.

### Per-section delta description (driven by red regions in the diff PNGs)

The raw delta percentages are high (10-45%), but **the hero H1 itself is not what drives the red**. Visual inspection of each composite shows the following pre-existing differences (not introduced by FU-2):

1. **Hero band background color.** Live: cream/off-white (`#F3EBD8`-ish). Preview: pure white. Affects the full hero band. *Pre-existing, unrelated to FU-2.* Driver of ~40% of the red.
2. **Breadcrumb row.** Live: "Home > Services" breadcrumb above the hero. Preview: no breadcrumb. *Pre-existing CMS chrome.* Driver of a horizontal stripe of red near top.
3. **Header right-side CTA pill.** Preview: "Call today" / "Book a testing review" pill. Live: no pill (canonical header, per memory). *Pre-existing header reassessment outcome.* Driver of a red square in the upper-right.
4. **Subtle horizontal centering offset.** The hero H1 visual bounding box is at the same vertical position in both, but the surrounding hero band layout shifts the centroid slightly. Sub-pixel.

**The hero H1 typography itself matches.** Across all four pages and both viewports:
- Same character width: e.g. "Testing engagements / for Drupal teams." wraps to the same 4 lines on mobile in live and preview.
- Same line-height: tight stack with `1.05` ratio — no extra inter-line whitespace gap visible in either.
- Same letter-spacing: tight `-2px` (desktop) / `-1px` (mobile) — visually identical kerning.
- Same font weight: medium (500) — visually identical stroke weight.
- Same font color: `#1F1A14` near-black on both surfaces.

**Per-section MATCH/DELTA assignment** (where the only thing that matters for this cycle is the hero H1 typography):

| Section | Viewport | Status | Description |
|---|---|---|---|
| Hero H1 typography | 1280 home | MATCH | 72px, weight 500, -2px LS, 1.05 LH — identical visual scale to preview. |
| Hero H1 typography | 1280 services | MATCH | Same. Multi-line wrap "Testing engagements / for Drupal teams." identical. |
| Hero H1 typography | 1280 how-we-do-it | MATCH | Same. "How a testing / engagement runs." wrap identical. |
| Hero H1 typography | 1280 oss | MATCH | Same. "What we maintain in / the open" wrap identical. |
| Hero H1 typography | 375 home | MATCH | 44px, -1px, 1.05 — identical visual scale. |
| Hero H1 typography | 375 services | MATCH | 4-line wrap "Testing / engagements / for Drupal / teams." identical. |
| Hero H1 typography | 375 how-we-do-it | MATCH | Same. |
| Hero H1 typography | 375 oss | MATCH | Same. |
| Hero band background | all | DELTA (pre-existing) | Live cream, preview white. Out of FU-2 scope. |
| Breadcrumb row | all | DELTA (pre-existing) | Live has it, preview does not. Out of FU-2 scope. |
| Header CTA pill | all | DELTA (pre-existing) | Preview has it, live does not. Out of FU-2 scope (canonical header per `design_header_nav_breakpoint`). |
| Visual hierarchy | all | MATCH | No ascender/descender clipping. The 1.05 line-height does not visually crowd; multi-line headings read cleanly. |

### Desktop (1280) section-by-section

- **Hero band:** layout matches; only background-color differs (pre-existing).
- **Hero H1:** typography matches brief (`72px / 500 / 1.05 / -2px / Rubik`). Visual rendering on live is indistinguishable in size, weight, tracking, leading from preview.
- **Hero body/CTA group:** layout matches.
- **Below-the-fold:** out of scope (this cycle touched only `.landing-hero .heading.h1`).

### Mobile (375) section-by-section

- **Hero H1:** typography matches brief (`44px / 500 / 1.05 / -1px`). The FU-7 mobile parallel inconsistency (previously 36px from neonbyte defaults) is now resolved.
- **Multi-line wrap behavior:** identical between live and preview across all three target pages.
- **Touch targets:** H1 is non-interactive; not subject to 44px tap target rule. Hero CTAs unchanged by FU-2.
- **Horizontal scroll:** none detected at 375.

## Design brief compliance

| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| `display-xl.fontSize` desktop | 72px (4.5rem) | 72px (Playwright probe, 4 pages) | YES |
| `display-xl.fontWeight` | 500 | 500 (Playwright probe, 4 pages) | YES |
| `display-xl.letterSpacing` desktop | -2px | -2px (Playwright probe, 4 pages) | YES |
| `display-xl.lineHeight` desktop | 1.05 | 1.0500 (75.6/72) (Playwright probe, 4 pages) | YES |
| `display-xl.fontFamily` | Rubik | Rubik (via `var(--font-family)`) | YES |
| `typography-mobile.display-xl.fontSize` | 44px | 44px (Playwright probe @ 375, 4 pages) | YES |
| `typography-mobile.display-xl.letterSpacing` | -1px | -1px (Playwright probe @ 375, 4 pages) | YES |
| `typography-mobile.display-xl.lineHeight` | (unspecified; inherits 1.05) | 1.0500 (Playwright probe @ 375, 4 pages) | YES |
| `color` (hero H1 in white zone) | `#1F1A14` (`--theme-text-color-loud`) | `#1F1A14` (per T's DOM verification) | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Hero H1 contrast (large text, 3:1 threshold) | PASS | 17.27:1 (T's computation) / 17.29:1 (F's computation). AAA. |
| Hero H1 contrast (re-confirmed in S) | PASS | Hex unchanged; color values from prior cycles still apply. |
| Heading hierarchy | PASS | Single H1 inside `.landing-hero` on each target page. No level skips introduced. |
| Keyboard navigation (hero region) | N/A for FU-2 | Hero H1 is non-interactive; no keyboard interaction added or removed. Surrounding CTAs untouched. |
| Focus ring visibility | N/A for FU-2 | No focus-bearing element touched. |
| Forced-colors mode | N/A for FU-2 | Letter-spacing and line-height are not affected by forced-colors. No new colors introduced. |
| Reduced-motion | N/A for FU-2 | No animations added. |
| 200% zoom | PASS | Hero H1 at 72px @ 200% zoom = 144px effective; `text-wrap: balance` keeps wrap controlled; no clipping observed in spot-check. |
| Image alt text | N/A for FU-2 | No images touched. |
| Mobile touch targets (375) | N/A for H1 | H1 is non-interactive. |
| Mobile typography scale | PASS | Matches `typography-mobile.display-xl` (44px / -1px / 1.05) per Playwright probe. |
| Mobile layout | PASS | No horizontal scroll, hero H1 wraps cleanly across 4 lines on /services /how-we-do-it /open-source-projects at 375. |

## Static preview comparison

| Page | Section | Status | Notes |
|---|---|---|---|
| `/` | Hero H1 | MATCH | 72/500/1.05/-2px desktop; 44/500/1.05/-1px mobile. No regression — this was the reference page (already correct pre-FU-2). |
| `/services` | Hero H1 | MATCH | The Cycle 3 divergence (`-1.8px / 1.10`) is GONE. Now matches preview. |
| `/how-we-do-it` | Hero H1 | MATCH | Same. |
| `/open-source-projects` | Hero H1 | MATCH | Same. |
| `/articles` | H1 | N/A | No `.heading` H1 (bare `<h1>`); not in this cycle's scope. |
| `/contact-us` | Hero H1 | N/A | Different class (`contact-us-hero`), different display token. Not affected. |
| `/about-us` | Hero H1 | N/A | Not assigned `.landing-hero`; remains on neonbyte default. Per F's autonomous decision §5, this is correct — about-us has its own display-md spec, not display-xl. Not a regression. |

## Verdict

**PASS** — all acceptance criteria met.

- AC1 (Playwright at 1280 reports `-2px / 1.05` on the three target pages): confirmed by T and re-verified by S.
- AC2 (homepage `/` still reports `-2px / 1.05`): confirmed by T and re-verified by S. No regression.
- AC3 (cross-page T3 visual diff): hero H1 typography is visually indistinguishable between live and preview at both 1280 and 375. The remaining hero-band deltas (background color, breadcrumb, header CTA pill) are pre-existing and out of FU-2 scope.
- AC4 (no regression on `/articles`, `/about-us`, `/contact-us`): no `.landing-hero` class on these pages; CSS rule is correctly scoped; T's DOM and HTTP checks confirm zero regression.
- AC5 (trace comment + change log): F documented the L5 layer choice in handoff "Layer decisions"; T verified `dy-section.css` lines 556-607 trace block and `css-change-log.md` line 87-88 FU-2 entry.

Visual hierarchy is clean: the `1.05` line-height does not introduce ascender/descender clipping on multi-line H1s. Multi-line wraps render legibly on all four pages at both viewports.

Ready for O to commit.

## Advisory notes (non-blocking)

1. **Preview header CTA pill.** The preview HTMLs still show a right-side header CTA pill that the canonical live header does not have (per the `design_header_nav_breakpoint` memory). This is pre-existing from prior cycles and unrelated to FU-2 — but it means future cross-page T3 audits will continue to show ~5-10% delta from the header strip alone. A future cleanup could update the preview HTMLs to match the canonical header (no CTA pill) so visual diffs more cleanly isolate body deltas.

2. **Hero band background color.** Live renders the hero on a cream surface; previews use white. This is a separate design decision (likely a `theme--cream` or container-level surface treatment) that is out of FU-2's scope. Not raised as REWORK; flagging for visibility in case the operator wants to address it in a follow-up.

3. **Cropped vs full-page diffs.** Whole-page diffs were not computed because below-the-fold content has pre-existing live-vs-preview deltas (CMS-driven content blocks vs static preview content) that would dominate the delta percentage and obscure the hero-band signal this cycle audits. The hero-band crop (top 1000px @ 1280, top 800px @ 375) is the right scope for this cycle. Full PNGs remain on disk if a deeper audit is desired.
