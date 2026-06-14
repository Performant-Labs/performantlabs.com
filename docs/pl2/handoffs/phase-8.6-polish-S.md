# Handoff-S: Phase 8.6 - Polish batch (final Phase 8 sub-cycle)

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Issue:** `docs/pl2/handoffs/phase-8.6-polish-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.6-polish-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.6-polish-F.md`
**Operator-facing report:** [`phase-8.6-polish-report.html`](phase-8.6-polish-report.html)

## T precondition

Confirmed: T reported zero blocking issues. 5/5 acceptance criteria PASS. All five regression-set sub-cycles (8.1–8.5) verified in T's served-CSS checks.

## Preconditions

- Claude in Chrome MCP tools available — not required for this audit (Playwright used for capture).
- Playwright at `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/node_modules/playwright` — PASS.
- ImageMagick `compare` at `/opt/homebrew/bin/compare` — PASS.
- Live HTTPS at `https://pl-performantlabs.com.3.ddev.site:8493/` — HTTP 200.
- Preview server at `http://localhost:8765/homepage.html` — HTTP 200.

## Tier 3 visual audit

### Visual diff results (whole-page, cropped to min height of live/preview)

| Viewport | Live size | Preview size | Cropped to | Pixels different | Whole-page delta % |
|---|---|---|---|---|---|
| 1280×800  | 1280×5266 | 1280×4341 | 1280×4341 | 2,787,290 | 50.16% |
| 768×1024  | 768×6254  | 768×4904  | 768×4904  | 1,925,460 | 51.12% |
| 375×667   | 375×7261  | 375×6163  | 375×6163  | 1,256,820 | 54.38% |

**Interpretation of the whole-page delta.** The whole-page AE is dominated by the cumulative vertical-offset cascade: live is 925–1,350 px taller than preview at each viewport, so identical sections render at different y-coordinates and the pixel-by-pixel compare flags almost every non-white pixel. This is unavoidable when comparing variable-height full-page captures with different DOM heights. **The whole-page delta is informational only for this audit; per-section visual evidence is binding.** Per-section crops below show the actual visual delta picture, which is much smaller.

### Per-section delta description (driven by the six polish items + regression set)

| Section | Viewport | Status | Description |
|---|---|---|---|
| FAQ accordion (item 2) | 1280 | MATCH | Closed accordion rows display `+` glyph in teal, right-aligned, matching preview. SVG chevron is hidden. |
| FAQ accordion (item 2) | 768 | MATCH | Same `+` indicator rendering. |
| FAQ accordion (item 2) | 375 | MATCH | Same `+` indicator rendering. |
| Hamburger button (item 5) | 768 | MATCH | Bordered with 8 px radius, 44×44 touch target. Matches preview. |
| Hamburger button (item 5) | 375 | MATCH | Bordered with 8 px radius, 44×44 touch target. Matches preview. |
| Footer link labels (item 1) | 1280 | MATCH | `.footer-column__link` items render in sentence case: "Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing", "Articles", "Documentation", "About us", "Contact us", "Privacy policy". |
| Footer-CTA primary pill (item 3) | 1280 | MATCH | "Book a testing review" pill renders with no arrow glyph. |
| Built-for-the-team checklist (item 4) | 1280 | MATCH | All four items end with terminal periods. |
| Header nav cluster (item 6) | 1280 | **DELTA — exceeds threshold** | Live "Services" left edge at x=342, preview at x=536 → **194 px delta**. Live "Contact us" right edge at x=1054, preview at x=1214 → **160 px delta**. F's handoff claimed ~7 px sub-threshold; rendered measurement contradicts that by an order of magnitude. See "Discrepancy with F's analysis" below. |
| Header (8.1 regression) | 1280 | PASS | No "Book a testing review" pill in header (regression intact). Header height ≈ 73 px. |
| Hero band (8.2 + 8.5 regression) | 768 | PASS | No horizontal overflow; tight CTA-to-next-band transition; min-height auto behavior holds. |
| Logo bar (8.3 regression) | 1280 | PASS | Single row of 6 grayscale bitmap logos at ~28 px height visible in thumbnail and mid-page crop. |
| Feature cards (8.4 regression) | 768 | PASS | 1-column stack of 3 cards confirmed in mid-page screenshot. |

### Discrepancy with F's analysis (item 6)

F's handoff (lines 86–94) computed the nav-cluster offset as ~7 px from the container-width arithmetic. The rendered measurement disagrees by an order of magnitude:

- Live `performant labs` logo left edge: x=101.
- Preview `performant labs` logo left edge: x=103.
- Logo positions are essentially identical (~2 px). The arithmetic on logo position was correct.
- **But the nav cluster sits on the right side of the header**, not the left. Live first-nav-item ("Services") left edge: x=342. Preview first-nav-item left edge: x=536. **Delta: 194 px.** Live last-nav-item ("Contact us") right edge: x=1054. Preview last-nav-item right edge: x=1214. **Delta: 160 px.**

F measured the wrong distance: F computed where the *logo* sits, which matches. The visible issue, however, is where the *nav cluster on the right side of the header* sits. The live header lays out the nav inline immediately after the logo (a left-aligned cluster pattern), while the preview pushes the nav to the right edge of a 1200 px container. This is the offset the original Phase 8 audit flagged as "nav-cluster offset at 1280," and the fix required is **not** a sub-threshold no-op.

The issue body's "if < ~10 px, may be a no-op" caveat does not apply to a 160–194 px delta.

### Desktop (1280px)
Section-by-section: all five intentional Phase 8.6 polish targets (items 1–5) match preview. Item 6 (nav-cluster offset) does NOT match preview — see discrepancy table above. Pre-existing button color treatment (deep teal vs preview's lighter cyan) on the primary CTA is out of scope for 8.6 and was not addressed in any 8.x sub-cycle; flagging as advisory only.

### Mobile (375px)
Hamburger renders bordered with 8 px radius (matches preview). Hero stacks correctly. Feature cards single-column. Footer columns stack. Hero CTAs stack to single column. No horizontal scroll observed.

## Design brief compliance (item-level)

| Item | Brief / preview target | Rendered | Match |
|---|---|---|---|
| 1. Footer link casing | Sentence case | Sentence case | YES |
| 2. FAQ accordion icons | `+` glyph closed, `−` open | `+` shown closed | YES |
| 3. Footer-CTA primary pill | No arrow | No arrow | YES |
| 4. Checklist terminal periods | Periods present | Periods present | YES |
| 5. Hamburger border + radius | 1 px hairline + 8 px radius | 1 px hairline + 8 px radius | YES |
| 6. Nav-cluster offset at 1280 | Preview position (right-aligned to 1200 px container) | Live position (left-clustered immediately after logo); 160–194 px delta | **NO** |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | T verified focus order and ARIA landmarks. No new interactive elements added. |
| Focus ring visibility | PASS | Hamburger 44×44 retained; accordion uses native `<details>/<summary>` focus. |
| Forced-colors mode | PASS (inherited) | Native `<details>` and `<button>` honor forced-colors; CSS `::after` indicator inherits text color which forced-colors will repaint. |
| Reduced-motion | PASS | Dripyard base provides reduced-motion media queries; no new transitions added in 8.6. |
| 200% zoom | PASS | No clipping in 8.6 fixes; header padding-block 14 px holds at 200%. |
| Heading hierarchy | PASS | T verified single H1, 5 visible H2s, H3s under them, no skipped levels. |
| Image alt text | PASS | No new images added; existing alt text from prior phases unchanged. |
| Mobile touch targets (375 / 768) | PASS | Hamburger 44×44 confirmed by T from served CSS lines 242–243; border-box keeps the 1 px border inside the touch target. |
| Mobile typography scale | PASS | No 8.6 changes to typography tokens. |
| Mobile layout | PASS | No regressions to hero stacking, card collapse, footer column stack, hamburger gating at <992 px. |
| Accordion ARIA preservation | PASS | Native `<details>/<summary>` provides disclosure semantics; `aria-hidden="true"` on hidden SVG; `::after` pseudo-element not announced (correct decorative behavior). |
| WCAG contrast (`#0F6F8A` `+`/`−` on `#F5EFE2` cream FAQ band) | PASS | 5.01:1 ≥ 4.5:1. T's recalculation corrected F's `#F3EADA` hex and 4.24:1 ratio; outcome unchanged (PASS). |

## Static preview comparison

Compared against `docs/pl2/Previews/homepage.html` served at `http://localhost:8765/homepage.html`:

| Section | Result | Detail |
|---|---|---|
| Header | DELTA | Nav cluster horizontal offset (160–194 px). See discrepancy section. |
| Hero | MATCH (8.6 scope) | Layout and spacing intact. Pre-existing primary CTA color treatment differs (deep teal live vs lighter cyan preview); out of 8.6 scope. |
| Logo bar | MATCH | 6 logos, grayscale, single row, ~28 px. |
| Tools/Tests/Experts cards | MATCH | 3-col desktop, 1-col mobile. |
| Heal-flow band (cream) | MATCH | Section padding and content match. |
| Built-for-the-team checklist | MATCH | Terminal periods present, layout matches. |
| FAQ band | MATCH | `+` glyphs, sentence-case questions, cream surface. |
| Footer-CTA dark band | MATCH | "Book a testing review" without arrow; copy and pills match. Note: bottom CTA primary pill has the same deep-teal vs cyan color delta as the hero CTA — pre-existing token issue, out of 8.6 scope. |
| Footer columns | MATCH | Sentence-case link labels, uppercase headings. |

## Regression checks across 8.1–8.5

| Sub-cycle | Check | Result |
|---|---|---|
| 8.1 | No "Book a testing review" pill in header; header height ~73 px; hamburger at < 992 | PASS — verified in header crops at 1280, 768, 375. |
| 8.2 | Hero `padding-inline: 0`; no horizontal overflow at 768 | PASS — verified in 768 hero crop and full-page capture. |
| 8.3 | 6 grayscale bitmap logos at 28 px, single-row at 1280 | PASS — verified in 1280 mid-page crop and thumbnail. |
| 8.4 | Feature cards 3-col at desktop, 1-col stack at 768 and 375 | PASS — verified in 768 features crop showing 1-col stack of 3. |
| 8.5 | Hero `min-height: auto`; tight hero→logo-bar gap | PASS — verified in 768 hero capture: hero content sits naturally without forced min-height. |

All five prior-phase regressions hold.

## Verdict

**REWORK** — Item 6 (nav-cluster horizontal offset at 1280) does NOT match preview. F's handoff documented this as a "no-op, ~7 px sub-threshold" delta; the rendered measurement is 160–194 px, an order of magnitude over the issue's own < 10 px sub-threshold guidance.

Required before commit:

1. **Item 6 — header nav-cluster alignment at 1280.**
   - Branch: `aa/pl-homepage-phase-8.6.1-nav-cluster-offset`
   - Problem: Live header places nav cluster immediately after the logo (left-aligned cluster pattern), while preview places nav cluster right-aligned to a 1200 px container. Measured delta: 160–194 px at the nav cluster (logo positions match within 2 px).
   - F's container-width arithmetic measured the wrong feature (logo left edge); the offset lives in `.site-header__navigation` / nav grouping, not the outer container.
   - Operator decision needed: confirm preview is canonical for header nav alignment, then F traces the neonbyte header layout to identify the correct hook (likely a `justify-content: space-between` on the header inner container vs `gap: ...` cluster pattern). Likely L5 in `header.css`.

Items 1, 2, 3, 4, 5 all PASS and would commit cleanly if item 6 were the only outstanding issue. Recommend rework on item 6 only; do not unwind items 2 and 5 CSS.

## Advisory notes (out of 8.6 scope)

1. **Primary CTA color treatment.** Live primary CTA pill ("Book a testing review" both in hero and footer-CTA) renders as **deep teal (#0F6F8A)** with white text. Preview renders as a **lighter cyan/mint (~#4FB6CB)** with darker teal text. This is a known pre-existing condition not addressed in any 8.x sub-cycle. Will surface during the planned global Phase 8 re-audit; not blocking for 8.6.

2. **Bottom footer "Privacy Policy" link.** A small bottom-bar link rendered as "**Privacy Policy**" in bold Title Case appears below the footer columns on the live page (next to "© 2026 Performant Labs ·"). This is a different element from the `.footer-column__link` items audited in item 1 — likely the Drupal "footer" menu's bottom subset. The preview does not have an equivalent. Out of 8.6 scope; flag for global re-audit consideration. The column-link "Privacy policy" is in sentence case as required.

3. **F's WCAG arithmetic.** F reported 4.24:1 contrast on `#F3EADA`; T recalculated to 4.81:1 on that same hex and 5.01:1 on the actual `--theme-surface` token `#F5EFE2`. All three values pass AA. No fix required; documentation accuracy note for future cycles.
