# Handoff-S: Phase 8 — Global parity re-audit (pre-activation gate)

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8-global-reaudit`
**Issue:** `docs/pl2/handoffs/phase-8-global-reaudit-issue.md`
**Handoff-T reviewed:** N/A — audit-only cycle (O → S → O), no F or T work in this cycle
**Handoff-F reviewed:** N/A
**Operator-facing report:** [`phase-8-global-reaudit-report.html`](phase-8-global-reaudit-report.html)

## T precondition
N/A — audit-only cycle. All six sub-cycles (8.1–8.6) closed PASS prior to this re-audit.

## Preview sanity check

Scanned `docs/pl2/Previews/homepage.html` (731 lines). Heading hierarchy is clean (single H1; H2/H3/H4 cascade). Color tokens defined: `--primary #1893B4`, `--primary-light #62BBCB`, `--primary-deep #005AA0`. The preview's primary CTA is bound to `var(--primary-light)` (line 110). Known-stale brief disagreements (feature cards at md: brief says 3→2 vs preview 3→1; logo bar at md: brief says 2 rows of 3 vs preview 4+2 + 3×2 at 375) are documented as known-not-blocking per the issue file — flagged here, not REWORK input.

**No new preview defect found.** No ADVISORY-HOLD trigger.

## Tier 3 tooling preconditions

- Playwright: present at `node_modules/playwright`; capture script ran cleanly.
- ImageMagick `compare`, `convert`, `magick`: present at `/opt/homebrew/bin/`.
- Preview server: `http://localhost:8765/homepage.html` returned 200.
- Live: `https://pl-performantlabs.com.3.ddev.site:8493/` returned 200 (HTTPS, self-signed cert accepted via `ignoreHTTPSErrors`).

## Tier 3 visual audit

### Captures

Stored at `docs/pl2/handoffs/screenshots/cycle-8-global-reaudit/`. Naming: `t3-homepage-[vp]-{live,preview}-20260511.png`.

| Viewport | Live (W×H) | Preview (W×H) | Height delta |
|---|---|---|---|
| 1280×800   | 1280×5266 | 1280×4341 | live +925 px taller |
| 768×1024   | 768×6254  | 768×4904  | live +1350 px taller |
| 375×667    | 375×7261  | 375×6163  | live +1098 px taller |

The consistent extra height on live (≈ 900–1350 px across all viewports) is the dominant whole-page difference and inflates the AE counts — it cascades all section positions downward and pixel-diffs anything not perfectly aligned. This is the binding finding: **live has substantially more vertical whitespace than preview**, concentrated in inter-section gaps (logo-bar → "What we ship", feature cards → heal-flow, and below the heal-flow band).

### Visual diff results (whole-page, informational)

Captures were normalized to the shorter (preview) height before diffing, so the AE is over the common region only — still inflated by vertical-offset cascade because intermediate sections do not align.

| Viewport | Pixels different (AE) | Common-region pixels | Whole-region delta % | Diff PNG | Composite |
|---|---|---|---|---|---|
| 1280×800 | 2,786,900 | 5,556,480 | **50.2%** | `t3-homepage-1280-diff-20260511.png` | `t3-homepage-1280-composite-20260511.png` |
| 768×1024 | 1,925,460 | 3,766,272 | **51.1%** | `t3-homepage-768-diff-20260511.png` | `t3-homepage-768-composite-20260511.png` |
| 375×667  | 1,256,820 | 2,311,125 | **54.4%** | `t3-homepage-375-diff-20260511.png` | `t3-homepage-375-composite-20260511.png` |

These whole-region percentages cross the >5% REWORK presumption threshold, but per the canonical S protocol the per-section crop diffs are the binding evidence — the whole-region inflation is dominated by the vertical-offset cascade described above. Per-section verdict below.

### Per-section verdict table (the binding evidence)

| # | Section | 1280 | 768 | 375 | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | Header | match | match | match | **MATCH** | 8.1 sub-cycle result holds. Pill removed, h≈73 px, 6 nav items + logo. |
| 2 | Hero band | DELTA (CTA color, H1 wrap) | DELTA (CTA color) | DELTA (CTA color, H1 wrap) | **DELTA** | H1 copy & layout match; CTA color is wrong shade (see CTA section); H1 wraps differ at 1280 and 375 (minor, font-metric driven). |
| 3 | Logo bar | match | match | match | **MATCH** | 8.3 sub-cycle holds. 3×2 grid at 375 confirmed (initial impression of "2-row grid" was a mis-read — verified by tight crop). |
| 4 | Feature cards | match | match | match | **MATCH** | 8.4 sub-cycle holds. 3→1→1 progression visible. |
| 5 | Heal-flow | DELTA | DELTA | DELTA | **DELTA** | At 375 live renders SVG at full width inside a horizontally-scrollable container showing only node 01; preview shrinks SVG to fit. Live is brief-compliant ("horizontal scroll inside container"); preview is the known-stale specimen. **Not a regression — flag for preview update.** |
| 6 | Built-for checklist | DELTA (H2 wrap) | match | DELTA (H2 wrap) | **DELTA** | Content matches. H2 wraps differ ("Built for the whole / Drupal team." live vs different breaks on preview at 375). Minor, font-metric driven. |
| 7 | FAQ accordion | match | match | match | **MATCH** | Four collapsed items, accent +, headings match. |
| 8 | Footer-CTA | DELTA (CTA color) | DELTA (CTA color) | DELTA (CTA color) | **DELTA** | Closing primary CTA same wrong shade as hero CTA. Otherwise identical. |
| 9 | Footer | match | match | match | **MATCH** | Three columns + signature column, ©2026 line, "Privacy Policy" link. |

### CTA color resolution (specifically in scope)

Pixel-sampled the centre of the primary CTA button ("Book a testing review") at 1280 on both live and preview:

| Side | Sampled sRGB | Hex | Token match |
|---|---|---|---|
| Live    | `srgb(15,111,138)` | **#0F6F8A** | None of the brief's three primary tokens. Darker than `--primary #1893B4` and far darker than `--primary-light #62BBCB`. |
| Preview | `srgb(98,187,203)` | **#62BBCB** | Matches `--primary-light` exactly (the preview's bound token). |

The closing-section primary CTA shows the same `#0F6F8A` on live (visually confirmed in the side-by-side composite).

**Resolution:** This is an unresolved real delta. The preview is brief-compliant; live is rendering a different teal that doesn't match any of the brief's defined primary tokens. **Binding REWORK item** (single root cause: primary-button background token; one CSS fix likely resolves it everywhere).

### Whitespace / section padding delta

Live is ~900–1350 px taller than preview at every viewport. Visually inspected:

- Larger gap between trusted-by logo bar and "What we ship / Tools, AI, and experts" headline on live (≈ +200 px at 1280).
- Larger gap between feature cards section and heal-flow section on live (≈ +150 px at 1280).
- Larger gap below the heal-flow band before "Built for the whole Drupal team." on live (≈ +200 px at 1280).
- At 375 the same pattern compounds across more sections — total +1098 px.

This is a **second binding REWORK item** distinct from the CTA color: live's section-padding tokens are too generous relative to preview spec. Most likely a single shared `--space-section` (or equivalent) needs tightening. The visual effect is significant — the page feels "looser" than the canonical reference at every viewport.

## Design brief compliance

Token-level audit at 1280:

| Token | Brief value | Rendered (live) | Match |
|---|---|---|---|
| Primary CTA bg | `--primary-light` `#62BBCB` (per preview) | `#0F6F8A` | **NO** |
| Body text | Espresso (`#2A2520` / `#1F1A14`) | Matches visually | YES |
| Accent (eyebrows, terracotta) | `#C97B5C` / `#8E4A2A` | Matches "DRUPAL TESTING" eyebrow | YES |
| Surface warm (heal-flow band) | `#F5EFE2` cream | Matches | YES |
| Espresso closing band | `#1F1A14` | Matches | YES |
| Section padding rhythm | Tight, per preview | Larger on live | **NO** |

## WCAG 2.2 AA audit

Audited via inspection of the rendered live captures and preview reference. Live was not interactively probed (no keyboard run); items marked PASS visually and FAIL where the capture shows the failure.

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS (presumed) | Not interactively probed in this audit; no tab-order issues visible in static rendering. Header nav, hero CTAs, FAQ disclosures, footer links all standard `<a>` / `<button>` per preview HTML. |
| Focus ring visibility | PASS (presumed) | Preview defines `:focus-visible` outline; not measured on live. Flag for next audit. |
| Forced-colors mode | PASS (presumed) | No background-image-only text elements visible. Not actively simulated. |
| Reduced-motion | PASS (presumed) | No CSS transitions visible in the static capture. Preview honors `prefers-reduced-motion` per code review. |
| 200% zoom | PASS | No fixed-width text containers visible that would clip; layout uses relative units. |
| Heading hierarchy | PASS | One H1 (hero), then H2 for each major section, H3 inside feature cards, H4 in footer columns. No skipped levels in preview source. |
| Image alt text | PASS | Logo grid logos have descriptive alt; decorative SVG diagram has `role="img" aria-label="…"`. |
| Mobile touch targets (375) | PASS | CTA buttons measured at ≈ 48 px tall; nav hamburger ≈ 44 px; FAQ disclosure rows tall enough. |
| Mobile typography scale | PASS | H1 at 375 wraps to 2 lines, body text legible at standard sizes per brief `typography-mobile`. |
| Mobile layout | PASS | No horizontal scroll on page itself; heal-flow horizontal scroll is contained (brief allows). |

## Static preview comparison

Section-by-section against `docs/pl2/Previews/homepage.html`:

1. **Header** — MATCH.
2. **Hero band** — DELTA (primary CTA color #0F6F8A vs #62BBCB; H1 wraps differently at 1280 and 375 — minor).
3. **Logo bar** — MATCH at all three viewports including the 3×2 mobile grid.
4. **Feature cards** — MATCH (3/1/1 progression confirmed).
5. **Heal-flow** — DELTA (live: brief-compliant horizontal scroll; preview: shrink-to-fit at 375). This is a known-stale preview situation per the issue's known-not-blocking list, but the delta is real and worth noting in the report.
6. **Built-for checklist** — MATCH on content; H2 wrap differs minor.
7. **FAQ accordion** — MATCH.
8. **Footer-CTA** — DELTA (same CTA color issue as hero).
9. **Footer** — MATCH.

Cross-cutting: live runs ~900–1350 px taller across viewports due to looser section padding. Not section-specific but pervasive.

## Verdict

**REWORK** — the following must be addressed before activating `performant_labs_20260502` as default theme:

1. **Primary CTA background color.** Live renders all primary `.btn--primary` pills (hero "Book a testing review", footer-CTA "Book a testing review") at `#0F6F8A`. Preview and brief token are `#62BBCB` (`--primary-light`). This is a single-token / single-selector fix in the theme CSS. Verify by re-sampling the same pixel on live after the fix and matching `#62BBCB` ± 3 per channel.

2. **Inter-section vertical padding.** Live is consistently 900–1350 px taller than preview at every viewport (1280, 768, 375). Visually concentrated in the gaps between trusted-by → "What we ship", feature cards → heal-flow, and heal-flow → built-for. Likely a single `--space-section` or equivalent token over-set. Audit the spacing scale against the preview and bring the rhythm in. Acceptance: re-capture at 1280 should produce a live PNG within ±200 px height of preview's 4341 px.

3. **Optional / preview-side follow-up (NOT blocking activation if 1 + 2 land).** The mobile heal-flow `<svg>` rendering difference (live = brief-correct horizontal scroll; preview = shrink-to-fit) suggests updating the preview to match live's brief-compliant behavior. Flag as a separate doc-only update cycle.

## Advisory notes (non-blocking)

- Hero H1 wrap at 1280 differs by one line; almost certainly font-metric-driven (Rubik rendering on live's WebKit vs Chromium-headless on preview). Out of scope for this audit. If desired, pin with `max-width` and `text-wrap: balance` in a future polish cycle.
- Built-for H2 wrap at 375 differs by one line — same root cause.
- The WCAG checks marked "presumed PASS" should be actively re-probed (keyboard, focus rings, forced-colors simulation) before activation. This audit was visual-parity-focused; a deeper a11y pass is recommended as a final pre-launch step.
- Once REWORK items 1 + 2 land, a tight re-audit (1280 + 375 only, CTA-color + height-delta verification) should be sufficient — no need for a full nine-section sweep.
