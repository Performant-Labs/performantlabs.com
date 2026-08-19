# Handoff-S: Sprint 5 Cycle 2 — § engagements

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-2-engagements`
**Issue:** `docs/pl2/handoffs/cycle-2-engagements-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2-engagements-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-engagements-F.md`
**Operator-facing report:** [`cycle-2-engagements-report.html`](cycle-2-engagements-report.html)
**Cycle 1 audit (delta source):** `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ engagements"

## T precondition

Confirmed — T reported zero blocking issues. T's two flagged "deviations" (E1 padding 48 px vs issue's 24 px; E6 row-gap 24 px vs issue's 48 px) are both preview-aligned per source-of-truth precedence and accepted by S under the Sprint 4 FU-2 AC-reinterpretation precedent (`feedback_sprint_autonomous_mode.md`).

## Tier 3 visual audit

### Visual diff results (engagements-section crops, height-matched trim)

| Viewport | Live capture | Preview capture | Diff (trim) PNG | Composite | AE px | Section-crop delta % |
|---|---|---|---|---|---|---|
| 1280×800 | `screenshots/sprint-5-cycle-2/t3-engagements-section-1280-live-20260511.png` | `…1280-preview-20260511.png` | `…1280-diff-trim-20260511.png` | `…1280-composite-20260511.png` | 114,885 | 10.92 % |
| 768×1024 | `…768-live-20260511.png` | `…768-preview-20260511.png` | `…768-diff-trim-20260511.png` | `…768-composite-20260511.png` | 110,058 | 12.85 % |
| 375×667 | `…375-live-20260511.png` | `…375-preview-20260511.png` | `…375-diff-trim-20260511.png` | `…375-composite-20260511.png` | 110,298 | 15.56 % |

**Section-crop delta-% interpretation.** The 10–15 % delta is driven by the section's intro block (kicker font-weight + H2 size + intro-paragraph size differ between live and preview) and by a sub-pixel typography-scale difference inside card body copy. None of the Cycle 1 catalog items (E1/E2/E3/E5/E6) shows a remaining delta. Per Cycle 1 precedent ("per-section delta classification is the binding signal"), the percentage is informative but not actionable — the per-item verdicts below are binding.

### Per-section delta description (from diff PNGs)

The red regions in the diff PNGs concentrate in three areas, in order of contribution:

1. **Section H2 + intro-paragraph block (top ~250 px of the section):** Live H2 renders smaller than preview H2; live intro-paragraph renders smaller and narrower. This is consistent with the section H2 token applied across the page and is not specific to engagements. **Out of Cycle 2 scope** — Cycle 1 closed the L3 typography-canon cycle as "not indicated."
2. **Card body copy:** A small sub-pixel scale difference exists; visible in the diff overlay but not visually disruptive in the composite. Not flagged.
3. **Card padding / border position:** Live cards have very slightly different content-bounding-box dimensions vs preview at 1280 (driven by item 2). Not visually disruptive.

**E1, E2, E3, E5, E6 zones in the diff PNG are clean** (no concentrated red).

### Desktop (1280 px) — section-by-section

| Item | Brief / preview | Rendered on live | Match |
|---|---|---|---|
| E1 — card surface | Canvas `#FFFFFF`, hairline border `#E5E1DC`, inner padding 48 px | Same | YES |
| E2 — eyebrow casing | "01 / Takeover", "02 / Embed", "03 / Pilot", "04 / a11y" (no uppercase) | Exact strings rendered; `text-transform: uppercase` removed | YES |
| E3 — H3 trailing periods | All four titles end with "." | All four rendered with trailing period | YES |
| E5 — eyebrow accent metric | 24 px eyebrow-to-title gap; terracotta hairline accent above numeral cluster | `--card-bottom-gap: 0` + `margin-block-end: var(--space-lg)` produces 24 px; hairline accent present | YES |
| E6 — row gap | Preview `gap: var(--space-lg)` = 24 px | `row-gap: 1.5rem` on `.grid-wrapper--2col .grid-wrapper__grid` | YES (preview-canonical) |
| Grid layout | 2 × 2 | 2 × 2 | YES |

### Mobile (375 px)

| Item | Result |
|---|---|
| Grid collapse | Both live and preview stack to single column. MATCH. |
| Card chrome | Surface, border, padding consistent with desktop. MATCH. |
| Eyebrow casing | Title case preserved at all viewports. MATCH. |
| Trailing periods | All four H3s end with "." at all viewports. MATCH. |
| Horizontal scroll | None induced on live. PASS. |
| Touch targets | N/A — cards are non-interactive `<article>` (matches preview design). |

### 768 px — responsive divergence (advisory, not Cycle 2 scope)

The preview's `@media (max-width: 991px)` rule collapses `.engagements__grid` to 1-column. Live keeps the 2 × 2 grid at 768 px. Cycle 1 classified E4 at 768 as MATCH; that classification was based on a different preview capture. **This is a new finding, not a regression introduced by Cycle 2**, and is out of Cycle 2 scope. Logged as advisory note for operator decision (potential follow-up cycle).

## Design brief compliance

| Token | Brief / preview value | Rendered value | Match |
|---|---|---|---|
| Card surface | `#FFFFFF` | `#FFFFFF` | YES |
| Card border | `#E5E1DC` | `#E5E1DC` | YES |
| Card padding | preview `var(--space-2xl)` = 48 px (preview-canonical) | 48 px | YES |
| Eyebrow color | `#8E4A2A` | `#8E4A2A` | YES |
| Eyebrow accent | `#C97B5C` | `#C97B5C` | YES |
| H3 color | `#1F1A14` | `#1F1A14` | YES |
| Body text | `#5C544C` | `#5C544C` | YES |
| Row gap | preview `var(--space-lg)` = 24 px (preview-canonical) | 24 px | YES |
| Card hover border | `#1893b4` | `#1893b4` | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Engagement cards are non-interactive `<article>` elements (matches preview design). No per-card focus stop expected or present. |
| Focus ring visibility | N/A (advisory) | No focusable elements inside cards. |
| Forced-colors mode | PASS | Cards remain fully legible; borders, eyebrow, H3, body all visible. See `wcag-forcedcolors-engagements-1280.png`. |
| Reduced-motion | PASS | No layout-impacting transitions on cards. |
| 200 % zoom | PASS | No horizontal scroll induced; cards reflow correctly. See `wcag-200zoom-engagements-1280.png`. |
| Heading hierarchy | PASS | H1 (hero) → H2 (section) → H3 (cards). Confirmed by T. |
| Image alt text | N/A | No `<img>` inside engagement cards. |
| Mobile touch targets (375) | N/A | Cards non-interactive by design. |
| Mobile typography scale | PASS | Body copy and H3 remain legible at 375 px. |
| Mobile layout | PASS | Single-column stack, no horizontal scroll. |
| Contrast — body text | PASS | 7.43:1 (`#5C544C` on `#FFFFFF`). |
| Contrast — H3 | PASS | 17.27:1 (AAA). |
| Contrast — eyebrow | PASS | 6.64:1. |

No new WCAG regression detected.

## Static preview comparison

Section-by-section comparison vs `docs/pl2/Previews/services.html` § engagements:

| Sub-section | At 1280 | At 768 | At 375 |
|---|---|---|---|
| Section kicker ("FOUR WAYS WE ENGAGE") | MATCH (style + content) | MATCH | MATCH |
| Section H2 ("Four ways we engage.") | DELTA (live H2 smaller than preview H2; cross-page typography token, not Cycle 2 scope) | DELTA (same root cause) | MATCH (mobile H2 token converges) |
| Intro paragraph | DELTA (live smaller / wraps differently; cross-page issue) | DELTA | MATCH |
| Card grid layout | MATCH (2×2) | DELTA (live 2×2, preview 1-col — advisory, new finding) | MATCH (1-col) |
| Card surface (E1) | MATCH | MATCH | MATCH |
| Eyebrow casing (E2) | MATCH | MATCH | MATCH |
| H3 trailing period (E3) | MATCH | MATCH | MATCH |
| Eyebrow accent (E5) | MATCH | MATCH | MATCH |
| Row gap (E6) | MATCH | MATCH | MATCH |

## AC reinterpretation cited (per memory `feedback_sprint_autonomous_mode.md` / Sprint 4 FU-2 precedent)

The Cycle 2 issue AC text specified:

- E1 inner padding = `--space-lg` (24 px)
- E6 row gap = `--space-xl` (~48 px)

F + T both verified the preview's actual CSS uses `padding: var(--space-2xl)` (48 px) and `gap: var(--space-lg)` (24 px). Per the source-of-truth precedence rule (brief tokens > preview layout > live) and the FU-2 reinterpretation precedent in Sprint 4, **the preview's layout values are canonical when the issue's AC text contradicts them**. S accepts F's preview-aligned implementation. The Cycle 1 audit's "~48 px row gap" measurement is hereby corrected: the visual gap measured included card internal padding; the actual layout token is 24 px.

## Verdict

**PASS** — every Cycle 1 catalog item for § engagements (E1, E2, E3, E5, E6) is now MATCH at all three viewports. No new WCAG regression. Brief tokens honored. AC reinterpretation on E1 padding and E6 row-gap is documented and accepted under Sprint 4 precedent. Ready for O to merge.

## Advisory notes (non-blocking)

- **768-px breakpoint divergence (new finding).** Preview collapses to 1-col at ≤ 991 px; live keeps 2×2. Out of Cycle 2 scope (catalog item E4 was incorrectly classified MATCH at 768 in Cycle 1). Recommend opening a small follow-up cycle ("aa/pl-sprint-5-cycle-2.1-engagements-768") if operator wants preview-canonical breakpoint honored, OR closing the divergence as accepted if 2×2 at tablet is preferred. Operator decision.
- **Section H2 + intro-paragraph typography scale.** Live's section H2 renders smaller than preview at 1280. This is a cross-page typography ratio question, not engagement-specific. Cycle 1 closed the L3 typography-canon cycle as "not indicated"; that decision stands. If operator later wants the preview's H2 scale on live, a dedicated typography-canon cycle is the right venue.
- **Card body copy sub-pixel scale.** Diff overlay shows the card body text on live is rendered marginally smaller than preview. Not visually disruptive in the composite. Not flagged.
- **Cycle 1 measurement correction.** Cycle 1 reported E6 visual gap as "~48 px"; the canonical preview value is 24 px (`var(--space-lg)`). The "~48 px" was a measurement that included card internal padding. F + T + S all agree on 24 px. The Cycle 1 audit's E6 row count remains correctly classified as a delta worth remediating; only the target value was off.

## Artifacts

```
docs/pl2/handoffs/
├── cycle-2-engagements-S.md (this file)
├── cycle-2-engagements-report.html (operator-facing visual report with wipe-slider comparators)
└── screenshots/sprint-5-cycle-2/
    ├── t3-engagements-{1280,768,375}-{live,preview}-20260511.png (full-page captures)
    ├── t3-engagements-section-{1280,768,375}-{live,preview}-20260511.png (section crops)
    ├── t3-engagements-section-{1280,768,375}-{diff,diff-trim,composite}-20260511.png
    ├── card1-1280-composite.png, grid-1280-composite.png (zoom verifications)
    └── wcag-{200zoom,forcedcolors,reducedmotion,keyboard-focus}-engagements-1280.png
```
