# Header re-assessment — 2026-05-10

**Scope:** Site header band only, live vs updated preview. Diagnostic re-read for sub-cycle 8.1 scoping. Not a PASS/REWORK verdict.

**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/`
**Preview URL:** `http://localhost:8765/homepage.html` (served from `docs/pl2/Previews/`)
**Operator-facing report:** [`header-reassess-20260510-report.html`](header-reassess-20260510-report.html)

## Preconditions confirmed

- Playwright present at `node_modules/playwright`; chromium launches cleanly.
- ImageMagick `compare` and `convert` resolved on PATH (`/opt/homebrew/bin/compare`, `/opt/homebrew/bin/convert`).
- Preview server running on `:8765` (Python `http.server` from `docs/pl2/Previews/`); HTTP 200 on `/homepage.html`.
- Live ddev URL responds HTTP 200; Playwright navigates with `ignoreHTTPSErrors: true`.
- Captured top-400 px crops at 1280×400, 768×400, 375×400 for both targets via Playwright `clip` parameter. 12 PNGs total in `docs/pl2/handoffs/screenshots/header-reassess-20260510/`.

## Per-viewport pixel-diff (header crop, top 400 px)

| Viewport | Crop area (px²) | Pixels different (AE) | Delta % |
|---|---:|---:|---:|
| 1280×400 | 512,000 | 61,345 | 11.98% |
| 768×400  | 307,200 | 44,646 | 14.53% |
| 375×400  | 150,000 | 24,333 | 16.22% |

The deltas grow as viewport narrows. Note: a meaningful fraction of the red region in each diff PNG is below the header band itself — the hero section starts at a different Y on live vs preview because the header consumes ~25 px more vertical space on live, which shifts the entire eyebrow + H1 down inside the 400 px crop. The header-only delta is smaller than the raw numbers suggest.

## Per-viewport visual delta description

### 1280×400

Live carries the full primary nav (Services, How we do it, Articles, Open source projects, About us, Contact us) **plus** a teal "Book a testing review" pill on the right. Preview has the same nav order and labels but **no right-side CTA**. Because the pill steals horizontal space on live, "How we do it" and "Open source projects" wrap to two lines on live, while preview renders every nav label on a single line. Live header measures 98 px tall; preview 73 px. Wordmark style matches.

### 768×400

Live collapses the nav into a hamburger icon on the right and shows the wordmark on the left. Preview shows only the wordmark — nav is hidden via `@media (max-width: 991px) { display: none }` and there is **no hamburger affordance**, so on a tablet visitor the preview offers no way to reach navigation. Live header 82 px, preview 73 px. Wordmark text "performant labs" is present on both (the earlier audit's "P-only badge at 768" claim does not reproduce here).

### 375×400

Same pattern as 768. Live shows wordmark + hamburger; preview shows wordmark only and no nav affordance. Heights: live 82 px, preview 73 px. Wordmark wraps cleanly on both at 375.

## Recommended scope for sub-cycle 8.1

Given the corrected reading of the preview (full primary nav at >=992px, nav hidden under 992px), the remaining header parity work for F is:

- **Remove the "Book a testing review" CTA pill from the live header** at all viewports, including the markup that produces it and any associated `.site-header__cta` styling. Once the pill is gone, "How we do it" and "Open source projects" should fit on a single line at 1280, matching preview.
- **Reduce live header vertical padding** so the header band measures ~73 px (preview) rather than 82–98 px. This is most likely a padding or row-height token mismatch on the live `.site-header` rule.
- **Decide the tablet/mobile nav strategy** — the operator must choose. The preview hides nav entirely under 992px with no hamburger, which means no navigation affordance below desktop. The live header has a hamburger. Either the preview needs a hamburger added (parity-toward-live) or the live header needs the hamburger removed (parity-toward-preview). This is an operator call, not an F-implementation call.
- **Verify nav order, labels, and `display:none` breakpoint** at 992px after the above changes; current order/labels already match.

Out of scope for 8.1: any change to the wordmark mark/text, hero band, or hero-to-logo transition (already matched per phases 8.2/8.4/8.5).

## Outstanding questions for the operator

1. **Mobile/tablet nav affordance** (the binding question above): should the preview gain a hamburger to match live, or should live drop the hamburger to match the preview's "hide nav under 992px" behaviour? Until this is decided, F cannot complete 8.1.
2. **Header height target:** confirm 73 px (preview) is the intended target for live, vs the live's current 82–98 px range. The earlier audit referenced ~50 px and ~80 px which both differ from current measurements.
