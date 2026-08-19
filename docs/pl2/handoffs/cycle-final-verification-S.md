# Handoff-S: Sprint 5 — Final Cycle — Cross-section Verification + WCAG

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-final-verification`
**Issue:** `docs/pl2/handoffs/cycle-final-verification-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-final-verification-T.md` (PASS, 0 blocking)
**Handoff-F reviewed:** N/A (verification-only; reviewed cycle-2/3/4 F handoffs by reference)
**Cycle 1 baseline:** `docs/pl2/handoffs/cycle-1-audit-services-S.md`
**Operator-facing report:** [`cycle-final-verification-report.html`](cycle-final-verification-report.html)

## Preconditions

| Check | Result |
|---|---|
| T handoff: zero blocking issues | PASS |
| `mcp__Claude_in_Chrome__*` tools available + tab group bootstrapped | PASS (tabId 2114205407) |
| Playwright installed at `node_modules/playwright` | PASS |
| ImageMagick `compare` + `magick` on PATH | PASS |
| Live URL HTTP 200 (`/services`) | PASS |
| Preview served via `python3 -m http.server 8765` from `docs/pl2/Previews/` | PASS |

## Tier 3 visual audit

### Whole-page visual diff results

Live captured via Playwright `chromium.launch()` → `newContext({viewport, ignoreHTTPSErrors})` → `page.goto({waitUntil:'networkidle'})` → transition/animation suppression via injected CSS → `page.screenshot({fullPage:true})`. Both live and preview padded to the max of either height; AE diff via ImageMagick `compare -metric AE`.

| Viewport | Live h | Preview h | Pad h | AE pixels | Total pixels | Delta % |
|---|---:|---:|---:|---:|---:|---:|
| 1280×800  | 4418 | 4067 | 4418 | 2,034,610 | 5,655,040 | 36.0% |
| 768×1024  | 5054 | 4744 | 5054 | 1,314,150 | 3,881,472 | 33.9% |
| 375×667   | 6555 | 6360 | 6555 | 825,885   | 2,458,125 | 33.6% |

**Whole-page % is non-actionable** for the same reason as cycle 1: the live page includes the full Drupal site chrome (header, breadcrumb, footer) absent from the preview, vertically offsetting every section below the hero by 400–600 px in the padded diff. Per-section assessment is the binding signal.

### Per-section delta description (vs cycle 1 baseline)

| Section | Cycle 1 status | Final status | Viewports | Description |
|---|---|---|---|---|
| Hero | Out of scope (FU-2) | MATCH | all | Reconciled in FU-2; not re-audited. |
| Engagement cards (4-card grid) | REWORK candidate (E1/E2/E3/E5/E6) | **MATCH** | 1280/768/375 | Live now renders eyebrows in title case ("01 / Takeover"), H3 titles end with periods ("Test-suite takeover."), card surface treatment and row-gap aligned with preview. Verified via DOM inspection — all 4 cards: `theme--light` class, eyebrow casing correct, H3 trailing periods present, `id` attributes for anchor CTAs match. |
| Nearshore (capacity) | Mostly MATCH (N2 wrap variance) | **DELTA — accepted** | 1280/768 | N2 backlog item (FU-S5-5) remains accepted-as-is. Live wraps H2 cleanly as "Senior testing capacity, / when you need more hands." (2 lines); preview wraps as "...need more / hands." with an orphan. Live is actually visually better. Not a blocker. |
| Proof / wordmark strip | REWORK (P1/P2) | **MATCH** | 1280/768/375 | Live now renders the six text wordmarks horizontally — Drupal · Playwright · Cypress · PHP · JavaScript · React — under a "WE SPEAK" small-caps label. Confirmed via DOM: `.wordmark-strip-wrapper` element present with the 6 text items. Logo-grid SDC retired. |
| Closing CTA | REWORK (C1/C2/C3) | **MATCH** | 1280/768/375 | Element order is kicker → centered H2 → body → CTA pair (primary teal + ghost-on-dark outlined) centered below. Matches preview structure. Both buttons side-by-side, centered. |

### Desktop (1280px)

| Section | Checked | Match? | Notes |
|---|---|---|---|
| Hero | H1 text, tone, image | YES | "Testing engagements for Drupal teams." (FU-2 canonical) |
| Engagements | Card grid 2×2, surfaces, eyebrows, H3 periods, row-gap | YES | All four cards conform |
| Nearshore | Cream band, kicker, H2 wrap, primary CTA | YES (DELTA-accepted) | N2 wrap acceptable |
| Proof / wordmark | Text-only strip, "WE SPEAK" label placement | YES | Cycle 4 brought this into alignment |
| Closing CTA | Element order, H2 centered, CTA cluster | YES | Cycle 3 brought this into alignment |

### Mobile (375px)

| Section | Checked | Match? | Notes |
|---|---|---|---|
| All sections | Single-column stack, touch targets, no horizontal scroll | YES | scrollWidth=360, clientWidth=375; primary 56px, secondary 44px (with padding), all >= 44px |
| Engagements | 1-col stack per `@media (max-width: 576px)` rule | YES | |
| Closing CTA | Stacked CTAs, centered text | YES | C4 from cycle 1 ("MATCH on mobile") preserved |

## Design brief compliance

| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| Card title | `display-md` / ink-strong | `#1F1A14` 17.27:1 on white | YES |
| Card body | body / 7.43:1 | `#5C544C` on `#FFFFFF` | YES |
| Eyebrow accent | terracotta-deep `#8E4A2A` 6.64:1 | confirmed | YES |
| Closing CTA bg | espresso `#1F1A14` | confirmed | YES |
| Closing CTA H2 | cream `#F5EFE2` (≥3:1 large) | 15.07:1 | YES |
| Closing CTA kicker | terracotta `#C97B5C` (≥3:1 large) | 5.32:1 | YES |
| Closing CTA body | muted `#B8AFA0` (≥4.5:1 body) | 7.96:1 | YES |
| Wordmark items | body `#5C544C` (≥4.5:1) | 7.43:1 | YES |
| Focus rings (3 surfaces) | ≥3:1 non-text | 3.12–17.27:1 | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | 28 tabbable elements; DOM order is header → content CTAs → footer; no `tabindex` overrides > 0 |
| Focus ring visibility | PASS | T's contrast table confirms all surfaces ≥ 3:1 (3.12 cream, 3.58 white, 7.80–17.27 dark) |
| Forced-colors mode | PASS | Dripyard base + custom theme rely on system colors for borders/text; no fills-only treatments |
| Reduced-motion | PASS | Dripyard base handles `prefers-reduced-motion`; sprint 5 added no animation |
| 200% zoom | PASS | No horizontal scroll at 200%; content reflows |
| Heading hierarchy | PASS | Single H1 ("Testing engagements for Drupal teams."); H1 → H2 (×4) → H3 (×7 — 4 cards + 3 footer columns); no skips |
| Image alt text | PASS | 1 page `<img>` (logo, alt="Home"); 6 page SVGs all `aria-hidden="true"` (2 extra SVGs were Claude-in-Chrome extension phantom cursor, not page content) |
| `html lang` attribute | PASS | `lang="en"` |
| Mobile touch targets (375px) | PASS | `button--large` = 56px; default `button` = 48px; `button--small` rendered height with padding `12px 8px 12px 24px` = **44px** at mobile. **Overrides T's advisory**: rendered height meets WCAG 2.5.5; T's 35px figure was the `--button-height` token, not the rendered box height. Confirmed via Playwright at viewport 375×667: `{ "secondary": { "h": 44 } }` |
| Mobile typography scale | PASS | Per T: `display-xl`=44px, `display-lg`=36px, `display-md`=30px, all matching brief's `typography-mobile` block at `max-width: 576px` |
| Mobile layout / horizontal scroll | PASS | Playwright at 375px reports scrollWidth=360, clientWidth=375; `overflow-x: clip` in `dy-section.css` |
| Pa11y on `/services` | PASS (PC-5) | 3 errors, all on PC-5 allowlist (2× button--primary 2.21:1, 1× breadcrumb 3.58:1). Zero new errors introduced by sprint 5 cycles |
| CTA routing | PASS | All 7 distinct routes return HTTP 200, including `/how-we-built-this-site` and `/contact-us?intent=*` |
| ARIA landmarks | PASS | header=1, main=1, footer=1, nav=3 |

## Static preview comparison

Section-by-section vs `docs/pl2/Previews/services.html` (also confirmed against the live `/about-us` for cross-page check):

| Section | Result | Notes |
|---|---|---|
| Hero | MATCH | FU-2 canonical |
| Engagements | MATCH | All cycle-1 catalog items E1/E2/E3/E5/E6 resolved by cycle 2 |
| Nearshore | DELTA-accepted | N2 wrap variance, FU-S5-5 backlog; live wrap is acceptable |
| Proof / wordmark | MATCH | P1/P2 resolved by cycle 4 |
| Closing CTA (`/services`) | MATCH | C1/C2/C3 resolved by cycle 3 |
| Closing CTA (`/about-us`) | MATCH | Cycle 3 cross-page change intact — cream H2 centered, ~640px body, primary+ghost CTA pair |

## Cycle 1 catalog completion

| Item | Section | Status |
|---|---|---|
| E1 | Card surface | DONE (cycle 2) |
| E2 | Eyebrow casing | DONE (cycle 2) |
| E3 | H3 trailing periods | DONE (cycle 2) |
| E5 | Eyebrow accent | DONE (cycle 2) |
| E6 | Row gap | DONE (cycle 2) |
| C1 | CTA element order | DONE (cycle 3) |
| C2 | H2 centered | DONE (cycle 3) |
| C3 | CTA cluster placement | DONE (cycle 3) |
| P1 | Text-only wordmark strip | DONE (cycle 4) |
| P2 | "WE SPEAK" label placement | DONE (cycle 4) |
| N2 | Nearshore H2 wrap | BACKLOG FU-S5-5 — accepted as-is |
| FU-6 | Heal-flow section | CLOSED — services does not need heal-flow |

## Verdict

**PASS** — all acceptance criteria met. Sprint 5 ships.

- `/services` HTTP 200; all 5 visible sections render.
- Heading hierarchy clean (single H1, no skipped levels).
- ARIA landmarks present.
- T3 visual: every section MATCH (or DELTA-accepted with backlog item).
- WCAG 2.2 AA: all rows PASS; pre-approved brand deviations allowlisted via PC-5.
- Pa11y: 0 new errors introduced.
- Keyboard nav, focus rings, forced-colors, reduced-motion, 200% zoom all PASS.
- Mobile (375px): touch targets ≥ 44 CSS px; no horizontal scroll.
- Cross-page regression check: `/`, `/about-us`, `/articles` all clean; `/about-us` closing CTA retains the brief-aligned cream-H2 + 640px-body state from cycle 3.

Ready for O to commit `chore(services): sprint 5 final cycle — cross-section verification + WCAG audit` and merge.

## Advisory notes (non-blocking, carry-forward)

1. **FU-S5-5 (nearshore H2 container-cap)** — accepted as-is; live wrap is actually cleaner than preview at this section.
2. **FU-S5-1 (768px engagement grid stays 2×2)** — not in final-cycle scope; logged for sprint 6+ consideration.
3. **FU-7b (`/articles` H1 → H3 skip)** — pre-existing, out of sprint 5 scope.
4. **F's contrast rounding discrepancies** — kicker reported 4.47:1 vs T's 5.32:1; H2 cream reported 13.07:1 vs T's 15.07:1. Both well above thresholds either way. Used T's independently computed values.
5. **T's `button--small` 35px touch-target advisory is superseded.** T computed against the `--button-height: 35px` token. The actual rendered box height — with `padding: 12px 8px 12px 24px` — is **44px** at mobile (verified via Playwright at 375×667 and at desktop via the live DOM). Meets WCAG 2.5.5. No follow-up needed.
6. **Mobile nav `aria-expanded`** — set dynamically by `primary-menu.js`; standard progressive-enhancement pattern. Not a blocker.

## Artifacts

```
docs/pl2/handoffs/screenshots/sprint-5-final/
├── t3-services-{1280,768,375}-{live,preview}-20260511.png   (raw captures)
├── t3-services-{1280,768,375}-{live,preview}-pad.png        (height-padded for diff)
├── t3-services-{1280,768,375}-diff-20260511.png             (ImageMagick AE diff overlay)
├── t3-services-{1280,768,375}-composite-20260511.png        (side-by-side composite)
├── t3-about-us-{1280,768,375}-{live,preview}-20260511.png   (cross-page captures)
├── t3-about-us-{1280,768,375}-{live,preview}-pad.png        (padded)
├── t3-about-us-{1280,768,375}-{composite,diff}-*.png        (cross-page diffs/composites)
└── cmp-{engagements,nearshore,proof,cta}-1280.png           (per-section side-by-sides)
```
