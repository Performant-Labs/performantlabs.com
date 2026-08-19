# Handoff-S: Phase 8.6 - Polish rework (nav-cluster horizontal alignment) — Round 2

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.6-polish`
**Issue:** `docs/pl2/handoffs/phase-8.6-polish-rework-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.6-polish-T-rework.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.6-polish-F-rework.md`
**Round-1 S audit reviewed:** `docs/pl2/handoffs/phase-8.6-polish-S.md`
**Operator-facing report:** [`phase-8.6-polish-report-rework.html`](phase-8.6-polish-report-rework.html)

## T precondition

Confirmed: T-rework reports 3/3 acceptance criteria PASS, all round-1 items 1–5 regressions PASS, all 8.1–8.5 prior-phase regressions PASS, zero blocking issues. Cache cleared. HTTP 200 on live. Served CSS confirms all four round-2 nav-cluster rules at the correct specificity.

## Preconditions

- Playwright at `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/node_modules/playwright` — PASS.
- ImageMagick `compare` at `/opt/homebrew/bin/compare` — PASS.
- Live HTTPS at `https://pl-performantlabs.com.3.ddev.site:8493/` — HTTP 200.
- Preview server at `http://localhost:8765/homepage.html` — HTTP 200.

## Preview sanity check

Scanned `docs/pl2/Previews/homepage.html` and confirmed:
- Header collapses at `< 992 px` (navbar-expand-lg). Matches prior cycles.
- Hamburger button visible at narrow viewports with bordered affordance (round-1 fix).
- Single H1, no skipped heading levels.
- Touch targets ≥ 44 px (hamburger 44×44, CTA pills > 44 px tall).
- `.container { max-width: 1200px; padding: 0 24px }` is the canonical container.

No preview defects identified. Proceeding to Tier 3.

## Tier 3 visual audit

### Nav-cluster measurement at 1280 (binding scope for this round)

Playwright `getBoundingClientRect()` on the nav list element on both targets:

| Edge | Live (`.site-header .primary-menu__list--level-1`) | Preview (`.site-header__nav`) | Delta | Within 10 px? |
|---|---|---|---|---|
| Left edge  | 526.3 px | 535.0 px | **-8.7 px** | YES |
| Right edge | 1207.3 px | 1216.0 px | **-8.7 px** | YES |
| Width      | 681.0 px | 681.0 px | **0.0 px**  | YES |
| Font-size  | 15 px | 15 px | 0 | YES |
| Gap        | 32 px | 32 px | 0 | YES |
| Padding    | 0 px  | 0 px  | 0 | YES |

Header height: 73 px on both. F's reported deltas (8.7 / 8.7 / 0.0) confirmed independently. Both edges are within the 10 px acceptance threshold; the cluster width matches exactly. The residual 8.7 px symmetric offset originates from the neonbyte shadow container width (`min(92cqw, 1440px)` = 1178 px at 1280) vs preview's 1200 px flat container — a structural difference that is acceptable per the issue's `±10 px` criterion.

### Visual diff results (whole-page, cropped to min height of live/preview)

| Viewport | Live size | Preview size | Cropped to | Pixels different | Whole-page delta % |
|---|---|---|---|---|---|
| 1280×800 | 1280×5266 | 1280×4341 | 1280×4341 | 2,786,900 | 50.16% |
| 768×1024 | 768×6254  | 768×4904  | 768×4904  | 1,925,460 | 51.12% |
| 375×667  | 375×7261  | 375×6163  | 375×6163  | 1,256,820 | 54.38% |

**Interpretation.** Whole-page AE is again dominated by the vertical-offset cascade (live remains taller than preview at every viewport — same as round 1). Identical sections render at different y-coordinates so the pixel-by-pixel compare flags almost every non-white pixel. Per-section crops below are binding.

### Header band at 1280 (the binding scope)

| Crop | Pixels different | Header area | Delta |
|---|---|---|---|
| Header top-150px @ 1280 | 6,396 | 192,000 | **3.33 %** |
| Header top-150px @ 768  | 3,006 | 115,200 | 2.61 % |
| Header top-150px @ 375  | 2,627 | 56,250  | 4.67 % |

Side-by-side composite at 1280 shows live's nav cluster ("Services / How we do it / Articles / Open source projects / About us / Contact us") now right-aligned in the header, mirroring preview's nav cluster within the symmetric 8.7 px offset described above. **Round-1 REWORK item is now visually closed.** Round-1 measured 160–194 px deltas on this same selector; round 2 measures 8.7 px. Two orders of magnitude improvement.

### Per-section delta description

| Section | Viewport | Status | Description |
|---|---|---|---|
| Header nav cluster (item 6) | 1280 | **MATCH** | Live and preview both render the six-item nav right-aligned. Symmetric 8.7 px edge offset; 0 px width delta. Within 10 px threshold. |
| Header band overall | 1280 | MATCH | Logo at left (live x=101 vs preview x=103). Header height 73 px on both. |
| FAQ accordion `+` glyph (item 2) | 1280 | MATCH | Closed accordion rows display `+` indicator on the cream FAQ band. SVG chevron hidden. |
| Hamburger button (item 5) | 768 | MATCH | Live and preview both render the hamburger with 1 px border and 8 px radius; 44×44 touch target. |
| Hamburger button (item 5) | 375 | MATCH | Same border + radius rendering. |
| Footer link labels (item 1) | 1280 | MATCH | "Testing-suite takeover", "Embedded testing engineer", "Autonomous healing pilot", "Accessibility testing", "Articles", "Documentation", "About us", "Contact us", "Privacy policy" — all sentence case on live. |
| Footer-CTA primary pill (item 3) | 1280 | MATCH | "Book a testing review" renders without arrow glyph. The "Get in touch →" link on the small in-column CTA does carry an arrow (intentional, that's not the primary CTA). |
| Built-for-the-team checklist (item 4) | 1280 | MATCH | All four items end with terminal periods: "Dev teams catch regressions before users do.", "Engineers deploy with confidence, not anxiety.", "Manual test cycles drop as automated runs cover the regression surface.", "Leadership ships on schedule and on budget." |
| Hero band (8.2 + 8.5) | 768 | MATCH | No horizontal overflow; hero CTAs stack to single column; min-height auto behavior intact; tight transition to logo band. |
| Logo bar (8.3) | 1280 | MATCH | Single row of 6 grayscale bitmap logos (CBS Interactive, DocuSign, orange, Renesas, Robert Half, Tesla) on both live and preview at ~28 px height. |
| Feature cards (8.4) | 768 | MATCH | 1-column stack of 3 cards: "Tools the Drupal community uses", "Tests that heal themselves", "Experts alongside your team" — confirmed in the cards crop. |

### Desktop (1280px)
All six 8.6 polish targets (items 1–6) now match preview. Round-1 PASS items 1–5 remain visually intact. Item 6 — previously REWORK at 160–194 px — is now within the 10 px acceptance threshold (8.7 px symmetric).

### Mobile (375px)
Hamburger renders bordered with 8 px radius. Hero stacks. Feature cards single-column. Footer columns stack. No horizontal scroll observed.

## Design brief compliance (header band, the binding scope)

| Item | Brief / preview target | Rendered | Match |
|---|---|---|---|
| Nav font-size | 15 px Poppins | 15 px Poppins | YES |
| Nav link padding | 0 (gap-based layout) | 0 | YES |
| Nav list gap | 32 px (`--space-xl`) | 32 px | YES |
| Nav cluster alignment | Right edge of 1200 px container | Right edge of 1178 px shadow container; symmetric 8.7 px offset | YES (within 10 px) |
| Header height | 73 px | 73 px | YES |
| Logo position | Left edge at ~24 px container padding | Left edge at ~101 px (vs preview ~103 px) | YES (2 px) |
| Active-trail color | `--theme-link-color` (#0F6F8A) | `--theme-link-color` | YES |
| Six nav labels | Services / How we do it / Articles / Open source projects / About us / Contact us | Same six labels in same order | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | T verified focus order and ARIA landmarks intact; no new interactive elements added in round 2. |
| Focus ring visibility | PASS | Hamburger 44×44 retained; accordion uses native `<details>/<summary>` focus. |
| Forced-colors mode | PASS (inherited) | Round-2 changes are font-size / spacing / display only; no new color rules to break forced-colors painting. |
| Reduced-motion | PASS | No new transitions added in round 2. |
| 200% zoom | PASS | Header padding tokens unchanged at mobile; reduced inline padding (20 → 14 px) at wide viewport remains comfortable at 200%. |
| Heading hierarchy | PASS | T verified single H1, 7 H2s, 6 H3s, 0 H4s. No skipped levels. |
| Image alt text | PASS | No new images. |
| Mobile touch targets (375 / 768) | PASS | Hamburger 44×44 confirmed with 1 px border-box inside the touch target. |
| Mobile typography scale | PASS | No round-2 mobile changes. |
| Mobile layout | PASS | Round-2 scoped to `@media (width > 1000px)`; no mobile regressions. |
| Nav contrast (resting) | PASS (AAA) | `#2A2520` on `#FFFFFF` = 14.68:1 (F) / 15.17:1 (T). Both AAA. |
| Nav contrast (hover / active-trail) | PASS (AA) | `#0F6F8A` on `#FFFFFF` = 5.74:1. |
| Accordion contrast (`+`/`−` on cream) | PASS (AA) | `#0F6F8A` on `#F5EFE2` = 5.01:1 (T-round-1 calculation). |
| ARIA landmarks | PASS | T confirmed `<header>`, `<main>`, `<footer>`, 2 `<nav>` elements present. |

## Static preview comparison

Compared against `docs/pl2/Previews/homepage.html` served at `http://localhost:8765/homepage.html`:

| Section | Result | Detail |
|---|---|---|
| Header | **MATCH** | Nav cluster horizontal alignment within 10 px (round-2 fix). Logo position within 2 px. Six nav labels right-aligned. Header height 73 px. |
| Hero | MATCH (8.6 scope) | Layout and spacing intact. Pre-existing primary CTA color treatment (deep teal vs preview's lighter cyan) remains out of 8.6 scope; flagged for global re-audit. |
| Logo bar | MATCH | 6 grayscale logos, single row, ~28 px height. |
| Tools / Tests / Experts cards | MATCH | 3-col desktop, 1-col mobile (3-stack confirmed in 768 crop). |
| Heal-flow band (cream) | MATCH | Section padding and content match. |
| Built-for-the-team checklist | MATCH | Terminal periods on all four items. |
| FAQ band | MATCH | `+` glyphs closed, sentence-case questions, cream surface. |
| Footer-CTA dark band | MATCH | "Book a testing review" without arrow; copy and pills match. Bottom CTA primary pill color delta is the same pre-existing token issue, out of 8.6 scope. |
| Footer columns | MATCH | Sentence-case link labels, uppercase column headings. |

## Regression checks across 8.1–8.5

| Sub-cycle | Check | Result |
|---|---|---|
| 8.1 | No "Book a testing review" pill in header; header height 73 px; hamburger at < 992 | PASS — verified in 1280/768/375 header crops. |
| 8.2 | Hero `padding-inline: 0`; no horizontal overflow at 768 | PASS — verified in 768 full-page capture. |
| 8.3 | 6 grayscale bitmap logos, ~28 px, single-row at 1280 | PASS — verified in 1280 logo-bar crop (CBS Interactive, DocuSign, orange, Renesas, Robert Half, Tesla). |
| 8.4 | Feature cards 1-col stack of 3 at 768 | PASS — verified in 768 cards crop (Tools / Tests / Experts). |
| 8.5 | Hero `min-height: auto`; tight hero→logo-bar gap | PASS — verified in 768 hero capture. |

All five prior-phase regressions hold.

## Verdict

**PASS** — sub-cycle 8.6 round 2.

- Item 6 (nav-cluster offset at 1280) now within 10 px of preview on both edges; cluster width 0.0 px delta. Round-1 REWORK item closed.
- Round-1 items 1–5 (footer casing, accordion `+`/`−`, footer-CTA no arrow, checklist periods, hamburger border) all visually intact.
- Prior phases 8.1–8.5 all visually intact.
- WCAG AA contrast and structural checks PASS.
- No `!important` in any added rules; no SDC schema edits.

Ready for O to commit. Phase 8.6 is complete pending O's global Phase 8 re-audit (separate task).

## Advisory notes (out of 8.6 scope, defer to global Phase 8 re-audit)

1. **Primary CTA color treatment.** Live primary CTA pill ("Book a testing review" both in hero and footer-CTA) renders deep teal (`#0F6F8A`) with white text. Preview renders lighter cyan/mint (~`#4FB6CB`) with darker teal text. Pre-existing condition, not addressed in any 8.x sub-cycle. Flag for global re-audit.

2. **Bottom footer "Privacy Policy" link.** A small bold Title-Case "Privacy Policy" link appears in the live footer's bottom bar (next to "© 2026 Performant Labs ·") that the preview does not have. Likely the Drupal "footer" menu's bottom subset. Out of 8.6 scope; flag for global re-audit. The column-link "Privacy policy" is correctly sentence case as required by item 1.

3. **`grid-wrapper.css` in `git diff main`.** T-rework noted this file appears in the diff due to a comment-only trace-comment update from a prior commit. No CSS rules changed. Benign.

4. **F's WCAG nav-resting contrast (14.68:1 vs T's 15.17:1).** Minor floating-point variance; both AAA. No fix.

5. **Header container-width residual (8.7 px).** Originates from neonbyte's `.site-header__shadow { width: min(92cqw, 1440px) }` which is shared cross-page infrastructure. F's note (lines 50–53 of F-rework handoff) correctly identifies the trade-off: closing this would require modifying shared neonbyte structural CSS that affects all pages. The 8.7 px symmetric residual is within the issue's 10 px acceptance criterion; no further action needed in 8.6.
