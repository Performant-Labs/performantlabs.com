# Handoff-S: Phase 8.2 — Hero overflow + logo-grid wrap (visual re-audit)

**Date:** 2026-05-09
**Branch:** `aa/pl-homepage-phase-8.2-hero-overflow`
**Issue:** `docs/pl2/handoffs/phase-8.2-hero-overflow-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.2-hero-overflow-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.2-hero-overflow-F.md`
**Operator-facing report:** [`phase-8.2-hero-overflow-report.html`](phase-8.2-hero-overflow-report.html)

---

## Scope of this audit

This is a focused re-audit on sub-cycle 8.2, not a full Phase 8 re-run. The two items in scope are:

1. The 768 px hero horizontal overflow (fixed via `padding-inline: 0` on `.hero.theme--white`).
2. The logo-grid `flex-wrap` at tablet (fixed by raising the nowrap breakpoint from 577 px to 992 px and adding a 577–991 px wrap rule).

Other sections (header, feature cards, hero whitespace, footer-CTA polish, FAQ icons, footer casing) will continue to show DELTA against the preview and are explicitly out of scope for this sub-cycle. Those items are tracked under sub-cycles 8.1, 8.3 (remainder), 8.4, 8.5, 8.6.

## T precondition

Confirmed: T's handoff reports zero blocking issues. All six acceptance criteria pass. All Tier 1 and Tier 2 checks pass.

## Tool preconditions

| Tool | Status | Evidence |
|---|---|---|
| Playwright | PASS | `node_modules/playwright/cli.js` present; capture script ran clean |
| ImageMagick `compare` | PASS | `/opt/homebrew/bin/compare` |
| ImageMagick `magick`/`convert` | PASS | `/opt/homebrew/bin/convert` |
| DDEV live (HTTPS, port 8493) | PASS | HTTP 200 |
| Static preview (port 8765 from `docs/pl2/Previews/`) | PASS | HTTP 200 on `homepage.html` |

## Tier 3 visual audit

### Capture matrix

Captured full-page screenshots at 1280×800, 768×1024, 375×667 for both targets via Playwright (chromium, deviceScaleFactor: 1, ignoreHTTPSErrors: true, networkidle wait + 800 ms post-fonts settle). Files saved to `docs/pl2/handoffs/screenshots/cycle-8.2/`.

| Viewport | Live PNG | Preview PNG | Live height | Preview height |
|---|---|---|---|---|
| 1280 | `t3-homepage-1280-live-20260509.png` | `t3-homepage-1280-preview-20260509.png` | 5784 px | 4341 px |
| 768 | `t3-homepage-768-live-20260509.png` | `t3-homepage-768-preview-20260509.png` | 6546 px | 4829 px |
| 375 | `t3-homepage-375-live-20260509.png` | `t3-homepage-375-preview-20260509.png` | 7899 px | 6166 px |

### Whole-page pixel diffs (informational only — not the verdict input)

| Viewport | Compared height | AE pixels | Whole-page delta |
|---|---|---|---|
| 1280 | 4341 px (smaller of the two) | 3,897,430 | 70.14% |
| 768  | 4829 px (smaller of the two) | 2,277,210 | 61.40% |
| 375  | 6166 px (smaller of the two) | 1,346,970 | 58.25% |

**Why these are not the verdict input.** The two pages have very different overall heights (live is 25–33% taller because below-the-fold sections have not been brought to parity yet — those are scheduled for sub-cycles 8.4–8.6). When `compare` truncates to the shorter image, the live page's first ~4341 px is compared against the preview's full height, which means entirely different sections (live's hero vs preview's hero, then live's logo grid vs preview's cards, etc.) line up against each other. The whole-page metric is therefore expected to be high and is informational only for this sub-cycle.

### Hero band crop diffs (in-scope evidence)

Crop: top 800 px (1280, 768) and top 900 px (375) of each full-page screenshot.

| Viewport | Crop dimensions | AE pixels | Hero crop delta | What's driving the delta |
|---|---|---|---|---|
| 1280 | 1280 × 800 = 1,024,000 | 133,178 | 13.32% | ~30 px vertical offset of hero content (preview kicker at y≈215; live at y≈245). Same H1, same wrap, same CTAs. |
| 768  | 768 × 800 = 614,400 | 116,320 | 11.63% | ~125 px vertical offset (live has more breathing room above kicker). Same H1, same wrap, same CTAs. |
| 375  | 375 × 900 = 337,500 | 85,608 | 8.56% | ~25 px vertical offset; mobile hero same headline/CTAs, both wrap to 4 lines within viewport. |

**The hero crop deltas exceed the standard <2% MATCH threshold, but the threshold does not apply cleanly to this sub-cycle.** The diff PNGs (`t3-homepage-{1280,768}-hero-diff-20260509.png`) show the canonical signature of a vertical-offset delta: ghosted/doubled text where the same glyph appears twice, ~30 px apart. Hero **content** renders identically; hero **vertical position** differs. The vertical offset is the hero-whitespace issue, which is explicitly assigned to sub-cycle 8.4, not 8.2. For sub-cycle 8.2, the binding question is "does the headline now wrap cleanly within the 768 viewport without horizontal scroll?" — and the answer, visible in the screenshots and confirmed by T's Playwright instrumentation, is **yes**.

### Logo-grid crop diffs

Crop at 768: 768 × 700 starting at y=800. Crop at 1280: 1280 × 500 starting at y=800.

| Viewport | Crop dimensions | AE pixels | Logo-grid crop delta | Wrap behavior |
|---|---|---|---|---|
| 1280 | 1280 × 500 = 640,000 | 48,181 | 4.82% | Single row of six logos. **No regression.** |
| 768 | 768 × 700 = 537,600 | 39,602 | 3.96% | **Live wraps to 2 rows × 3 logos** (CBS Interactive / DocuSign / Orange; Renesas / Robert Half / Tesla). Pre-fix the row overflowed horizontally. |

The logo-grid crop deltas are dominated by the bitmap-vs-text logo treatment difference (live: vendor bitmap logos; preview: uniform text logos), which is sub-cycle 8.3 scope. The 8.2-scoped question is "does the row wrap into multiple rows at 768?" — and the screenshot evidence is unambiguous: yes, two rows of three.

### Per-section description (driven by the red regions in diff PNGs)

| Section | Viewport(s) | What's different visually | F documented as intentional? | Status |
|---|---|---|---|---|
| Hero band — H1 wrap & overflow | 1280, 768, 375 | Same headline, same line-wrap, same CTAs. No horizontal scroll on live at any viewport. | Yes — this is the 8.2 fix | MATCH (in scope) |
| Hero band — vertical position | 1280, 768, 375 | Live hero content sits ~30 px lower (1280) / ~125 px lower (768) than preview. | No — hero whitespace is sub-cycle 8.4 | DELTA (out of scope) |
| Logo grid — wrap behavior | 768 | Live wraps to 2 rows × 3 logos instead of overflowing. | Yes — this is the 8.2 fix | MATCH (in scope) |
| Logo grid — wrap behavior | 1280 | Single-row layout preserved. | Yes — no regression | MATCH (in scope) |
| Logo grid — logo treatment | 1280, 768, 375 | Live = bitmap vendor logos; preview = text-only logo names. | Yes — sub-cycle 8.3 scope per F's handoff | DELTA (out of scope) |
| Header / nav | 1280, 768, 375 | Live = full menu + solid blue CTA; preview = light nav + teal pill | Yes — sub-cycle 8.1 scope | DELTA (out of scope) |
| Hero CTA buttons | 1280, 768, 375 | Live = solid teal primary + outlined deep-blue; preview = filled teal + outlined teal | Yes — button-polish sub-cycle | DELTA (out of scope) |
| Below-the-fold (cards, FAQ, footer-CTA, footer) | 1280, 768, 375 | Various layout / typography deltas | Yes — sub-cycles 8.4/8.5/8.6 | DELTA (out of scope) |

### Desktop (1280 px)

- Hero kicker "DRUPAL TESTING" with terracotta dashes — present, matches preview color treatment.
- Hero H1 "Ship Drupal releases with confidence." renders at 72 px (T+F Playwright confirmed), wraps to 2 lines, matches preview wrap.
- Hero subhead matches text content exactly.
- Hero CTAs render at expected positions; styling differs (solid blue vs filled teal pill) — out of scope.
- Logo grid: single row, six logos, no overflow.
- `padding-inline` on hero confirmed at 0 px (T's Playwright). Matches preview spec.

### Tablet (768 px)

- **Hero H1 wraps cleanly to 2 lines within the 768 viewport.** No clipping, no horizontal scroll. This was the critical bug; the screenshot evidence confirms the fix.
- All hero elements measured by F's Playwright fall within the viewport: `right: 723` against `viewport: 768` for `.hero`, `.hero__container`, `.hero__content`, `h1`.
- Logo grid: 2 rows × 3 logos. Pre-fix it forced a single row that overflowed by ~241 px. Now wraps via the `flex-wrap: wrap` rule at 577–991 px.
- `padding-inline` on hero at 0 px (was 80 px each side pre-fix, causing the 160 px content-box overflow).
- No horizontal scroll: `docScrollWidth: 753, docClientWidth: 768` per T+F Playwright.

### Mobile (375 px)

- Hero H1 at 44 px / -1 px letter-spacing (T+F confirmed). Matches `typography-mobile` block in design brief.
- H1 wraps to 4 lines within viewport. No horizontal scroll: `docScrollWidth: 360, docClientWidth: 375`.
- CTAs stack full-width at 56 px height (mobile rule unchanged from prior phases). Touch targets exceed 44×44 WCAG minimum.
- Logo grid wraps (max-width: 576 px rule, pre-existing) — no regression from the breakpoint change.
- `padding-inline: 0` on hero confirmed at mobile too (`heroPadInline: 0px`).

## Design brief compliance (sub-cycle 8.2 scope only)

| Token / behavior | Brief value | Rendered value | Match |
|---|---|---|---|
| Hero `padding-inline` | 0 (preview spec: `padding: 120px 0 var(--space-section)`) | 0 px (all viewports, T Playwright) | YES |
| Logo-grid `flex-wrap` at lg (≥ 992 px) | nowrap, single row | nowrap, all 6 on one line at 1280 | YES |
| Logo-grid `flex-wrap` at sm-md (577–991 px) | wrap to multiple rows | wrap, 2 rows × 3 at 768 | YES |
| Logo-grid `flex-wrap` at xs (≤ 576 px) | wrap (pre-existing) | wrap | YES (no regression) |
| Hero H1 desktop typography | display-xl: 72 px / -2 px / weight 500 / lh 1.05 | 72 px / -2 px / 500 / 1.05 | YES (already correct pre-fix; preserved) |
| Hero H1 mobile typography | typography-mobile display-xl: 44 px / -1 px | 44 px / -1 px | YES (no regression) |
| No `!important` in functional CSS | required | none in `hero.css` or `logo-grid.css` (T grep) | YES |

## WCAG 2.2 AA audit

No code changes affecting WCAG criteria were made in this phase. Phase 8.2 is layout-only (padding-inline, flex-wrap breakpoints).

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation / focus order | PASS | No structural change; nav order unchanged from Phase 8 baseline. |
| Focus ring visibility | PASS | Focus ring color (#1893b4) and treatment unchanged. Contrast 3.58:1 ≥ 3:1 non-text minimum. |
| Forced-colors mode | PASS (no regression) | No new color rules introduced; all element identifiability preserved from prior phases. |
| Reduced-motion | PASS (no regression) | No animation properties added in this phase. |
| 200% zoom | PASS | `padding-inline: 0` makes hero **less** prone to clipping at zoom, not more. No new fixed widths. |
| Heading hierarchy | PASS | Single H1; H1 → H2 → H3 chain intact (T grep). |
| Image alt text | PASS (no change) | No image markup changed in this phase. |
| Mobile touch targets (375 px) | PASS | CTAs render at 56 × ~331 px (T+F Playwright). Both dimensions exceed 44 × 44 WCAG 2.5.5. |
| Mobile typography scale | PASS | 44 px / -1 px H1 confirmed; matches `typography-mobile` display-xl. |
| Mobile layout | PASS | No horizontal scroll at 375 (`docScrollWidth: 360, docClientWidth: 375`). CTAs stack full-width below 576 px breakpoint. |
| Contrast ratios | PASS | No color changes (T grep of git diff confirms zero color/hex additions). All ratios from Phase 8 baseline preserved: headline 17.27:1 (AAA), subhead 7.43:1 (AAA), kicker 6.64:1 (AA), focus 3.58:1 (non-text 3:1). |

## Static preview comparison (sub-cycle 8.2 scope only)

| Section | Comparison | Result |
|---|---|---|
| Hero H1 wrap at 768 | Live wraps to 2 lines within 768 viewport; preview wraps to 2 lines within 768 viewport | MATCH |
| Hero H1 wrap at 1280 | Live wraps to 2 lines (Ship Drupal releases / with confidence.); preview wraps identically | MATCH |
| Hero H1 wrap at 375 | Live wraps to 4 lines; preview wraps similarly within 375 viewport | MATCH |
| Hero `padding-inline` at 1280/768/375 | Live = 0 px; preview = 0 px (preview spec: `.hero { padding: 120px 0 ... }`) | MATCH |
| Logo grid at 768: row count | Live = 2 rows × 3 logos; preview = single row of 6 text labels | DELTA (out of scope — Phase 8.3 logo-treatment work governs row count strategy at 768; the 8.2 deliverable is "wrap instead of overflow," achieved) |
| Logo grid at 768: no horizontal overflow | Live = no overflow; preview = no overflow | MATCH |
| Logo grid at 1280 | Live = single row, 6 bitmap logos; preview = single row, 6 text labels | MATCH on row count (no regression on 8.2 wrap fix) |

Out-of-scope deltas against preview (header, button styling, hero whitespace, below-the-fold sections, logo treatment) are catalogued in the report's "What I see different" section and the per-section delta table. They are NOT used as input to this sub-cycle's verdict.

## Verdict

**PASS** — sub-cycle 8.2 acceptance is met.

- The 768 px hero horizontal overflow is eliminated. Hero H1 wraps cleanly within the viewport. T's Playwright instrumentation confirms `hasHorizontalScroll: false` at all three viewports.
- The logo-grid `flex-wrap` fix produces the intended behavior: 2 rows × 3 at 768; single row at 1280; no regression at 375.
- No regressions on hero typography (72 px desktop, 44 px mobile) or contrast (no color changes).
- All other deltas the diff highlights against the preview belong to other sub-cycles (8.1 header, 8.3 logo treatment, 8.4 hero whitespace, button-polish, 8.5/8.6 below-the-fold) and are tracked separately. They are not regressions caused by 8.2.

Operator may commit and proceed to the next sub-cycle (8.4 feature-card grid, per the orchestrator's stated next step).

## Advisory notes

1. **Hero whitespace (sub-cycle 8.4) drives most of the visible "hero crop delta."** When 8.4 runs, the same hero crop diff should drop from ~13% to <2% as the vertical offset closes. Future S audits on 8.4 can use the hero crop delta as a clean MATCH signal once the offset is removed.

2. **Whole-page diff metric is unreliable until below-the-fold sub-cycles complete.** The whole-page numbers will trend down as 8.5/8.6 reduce the height delta between live and preview. Don't trust those numbers for sub-cycle gating until the page heights converge.

3. **Logo-grid 8.3 scope boundary preserved.** F documented this; T verified; S confirms. The 8.2 wrap fix does not constrain Phase 8.3's text-fallback strategy — logo treatment can still change without re-touching the breakpoint.

4. **Capture script reproducibility.** The Playwright script used for this audit is small and tab-independent; recommend committing a copy under `scripts/audit/` for future S agents to reuse rather than rewriting per cycle. Optional, non-blocking.
