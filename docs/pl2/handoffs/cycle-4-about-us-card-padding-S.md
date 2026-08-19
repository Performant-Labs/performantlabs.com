# Handoff-S: Sprint 12 Cycle 4 — `/about-us` card-canvas outer padding (no-op verification)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-4-about-us-card-padding`
**Issue:** `docs/pl2/handoffs/cycle-4-about-us-card-padding-issue.md`
**Handoff-T reviewed:** N/A — no code changed (PC-4 no-op resolution; F's `getComputedStyle` evidence stands in for T1/T2 structural verification)
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-4-about-us-card-padding-F.md`
**Operator-facing report:** [`cycle-4-about-us-card-padding-report.html`](cycle-4-about-us-card-padding-report.html)
**Mode:** autonomous

## T precondition

N/A. F resolved Cycle 4 as a no-op per PC-4 ("If audit finds an item empirically resolved, close as no-op + log in orchestrator log"). No CSS, twig, YAML, config, or content changed; therefore no T1 (curl/grep) or T2 (structural / ARIA / contrast) cycle was warranted. F's `getComputedStyle` measurements across `/about-us` (3 cards), `/open-source-projects` (7 cards), plus cross-page consumer grep (homepage, /services, /how-we-do-it) provide the structural evidence in lieu of a T handoff. This S handoff cites that evidence and adds independent pixel-level visual confirmation.

## Independent pixel-inset measurement (binding evidence)

Measured via Playwright `getBoundingClientRect()` on the rendered DOM — first non-empty text node inside the first §C card on live, and inside the first `.project-card` on preview. "Inset" = distance from card outer border edge to first text glyph rect.

| Viewport | Source | Left inset | Top inset | Right inset | Border | Outer padding | Inner (`.card__bottom`) padding |
|---|---|---|---|---|---|---|---|
| 1280×800 | Live    | 49.0 px | 49.0 px | 49.0 px | 1 px | 0 px  | 48 px |
| 1280×800 | Preview | 49.0 px | 49.0 px | 49.0 px | 1 px | 48 px | —     |
| 768×1024 | Live    | 49.0 px | 49.0 px | 49.0 px | 1 px | 0 px  | 48 px |
| 768×1024 | Preview | 49.0 px | 49.0 px | 49.0 px | 1 px | 48 px | —     |
| 375×667  | Live    | 49.0 px | 49.0 px | 49.0 px | 1 px | 0 px  | 48 px |
| 375×667  | Preview | 49.0 px | 49.0 px | 49.0 px | 1 px | 48 px | —     |

**Result:** exact parity at all three viewports. Live applies the 48 px on the inner `.card__bottom` (which fills the entire card interior via `.card__layout { margin: 0; padding: 0 }`); preview applies the 48 px on the outer `.project-card`. Both produce 1 px border + 48 px padding = 49 px from card edge to first content glyph. **F's no-op claim is empirically confirmed by independent measurement.**

## Tier 3 visual audit

### §C card grid — region-level diff (informative per PC-8)

| Viewport | Live | Preview | Diff PNG | Composite | AE pixels (fuzz 2%) | Region delta % |
|---|---|---|---|---|---|---|
| 1280×800 | `t3-about-us-cards-1280-live-20260512.png` (1204×706)   | `t3-about-us-cards-1280-preview-20260512.png` (1192×684)  | `t3-about-us-cards-1280-diff-20260512.png` | `t3-about-us-cards-1280-composite-20260512.png` | 108,811 | 0.128 % |
| 768×1024 | `t3-about-us-cards-768-live-20260512.png`  (732×1407)   | `t3-about-us-cards-768-preview-20260512.png`  (760×1104)  | `t3-about-us-cards-768-diff-20260512.png`  | `t3-about-us-cards-768-composite-20260512.png`  | 114,963 | 0.108 % |
| 375×667  | `t3-about-us-cards-375-live-20260512.png`  (360×1963)   | `t3-about-us-cards-375-preview-20260512.png`  (375×1830)  | `t3-about-us-cards-375-diff-20260512.png`  | `t3-about-us-cards-375-composite-20260512.png`  | 106,660 | 0.145 % |

All artifacts at `docs/pl2/handoffs/screenshots/cycle-4/`. Padded versions (`*-pad-*.png`) used for the comparator (canvas extended to the larger of the two dimensions with white background, north-west gravity).

Per PC-8, region AE is informative; the **binding measurement is the pixel-inset table above**. Region AE here is dominated by (a) different card copy / link text in live vs preview, and (b) the different grid-collapse breakpoint behaviour (live 3-up at 768, preview 1-up at 768). Neither concerns card padding cadence — both are out-of-scope content/layout differences orthogonal to Cycle 4.

### Per-section delta description

**Open source §C cards (Cycle 1 DELTA row).** Card-edge-to-content inset 49 px on both live and preview at 1280 / 768 / 375. Structural mechanism differs (live applies 48 px on `.card__bottom` inner; preview applies it on `.project-card` outer) but visually identical. **MATCH at all three viewports.**

**OSS sibling page (gestalt).** F's `getComputedStyle` on all 7 OSS cards: padding 48 px on `.card__bottom` for cards 0–5 (the 3-up grids); card 6 is full-width with 24 px padding per its container-query-driven layout — same as before Cycle 4 began. 1280 gestalt screenshot (`t3-oss-cards-1280-live-full-20260512.png`) confirms the cadence. **MATCH.**

**Cross-page consumers.** No code changed; regression mathematically impossible. 200-check confirms availability.

### §C cards row: Cycle 1 DELTA → MATCH

The Cycle 1 row "Open source §C cards — outer card wrapper `padding: 0` (inner padding handled by SDC slots) — preview specifies `padding: 48px` on the outer card. Net effect is slightly tighter body cadence on live. **DELTA — minor**" was structurally accurate but visually incorrect. The 48 px cadence is in place on the inner `.card__bottom`, which fills the card interior. **Row officially flips to MATCH at all three viewports.**

## Cross-page consumer 200-checks

```
/                     -> 200
/about-us             -> 200
/services             -> 200
/open-source-projects -> 200
/how-we-do-it         -> 200

L5 served (verified via ddev exec curl):
  .card[class*="theme"] .card__bottom { padding: 3rem; /* 48px */ }
```

No regression possible — zero code changed in Cycle 4.

## OSS sibling-fit confirmation

`t3-oss-cards-1280-live-full-20260512.png` captured at 1280. Card grid renders the same cadence as `/about-us`. Per F's `getComputedStyle`: cards 0–5 = `.card__bottom { padding: 48px }`, identical to /about-us. Card 6 (full-width) has 24 px padding per its existing container-query rule — pre-existing, out of scope.

## Design brief compliance (carry-over from Cycle 1)

No tokens changed. Card border `#E5E1DC`, radius 12 px, kicker tokens (post-Cycle-3), espresso bg `#1F1A14`, cream bg `#F5EFE2`, body `#5C544C` all match. Card padding: live 48 px effective inner, matches preview 48 px effective inner. No brief tokens regressed.

## WCAG 2.2 AA audit (carry-over)

No code changed; WCAG state inherited from Cycle 3 close. Specifically:

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS (carry-over) | No DOM/markup change |
| Focus ring visibility | PASS (carry-over) | Inherits 3 px dotted teal |
| Forced-colors mode | PASS (carry-over) | No new color-only signal |
| Reduced-motion | PASS (carry-over) | No new transitions |
| 200% zoom | PASS (carry-over) | Layout unchanged |
| Heading hierarchy | PASS | Verified by F: h1 ×1, h2/h3 in order |
| Image alt text | PASS (carry-over) | Logo alt="Home" intact |
| Mobile touch targets (375) | PASS | Card link covers entire card ≥ 44 × 44 CSS px |
| Mobile typography scale | PASS (carry-over) | No type change |
| Mobile layout | PASS | 3-up → 1-up collapse verified at 768/375; no horizontal scroll |

## Static preview comparison

§C cards: card-edge-to-content inset matches at 49 px on both, all viewports. Structural source differs (outer vs inner padding) — visually identical. **MATCH.**

## Brief-vs-preview discrepancy (noted, out of Sprint-12 scope)

F flagged that the design brief (`briefs/pl_design_brief.md` lines 335 / 355 / 488) specifies 32 px card internal padding while the preview and live both use 48 px. This pre-dates Sprint 12 (established Sprint 5 Cycle 2 with explicit audit justification, audit row 2.11). Per the spawn prompt, O has logged this to follow-up backlog **FB-8** as pre-existing, out-of-scope, out-of-Sprint-12. I confirm I observed live = preview = 48 px on this cycle's binding spec (the preview), and I do **not** raise the brief reconciliation as a Cycle 4 issue.

## Acceptance criteria (Cycle 4 — no-op verification)

- [x] /about-us §C card content-to-border spacing measured at ~48 px (49 px including the 1 px border) on all four sides at 1280 / 768 / 375.
- [x] Pixel-level diff vs preview at 3 viewports: AE concentrated in card-copy / link-text content regions, NOT in card body cadence. AE per viewport reported above.
- [x] Cycle 1's "Open source §C cards" DELTA row officially flipped to MATCH at all three viewports.
- [x] OSS sibling page cards render same cadence (gestalt + F's getComputedStyle confirmation).
- [x] No 200/availability regression on cross-page consumers.
- [x] WCAG carry-over: no new regression (no code changed).
- [x] Brief-vs-preview 32 / 48 px tension noted but not acted on; FB-8 follow-up.

## Verdict

**PASS — NO-OP VERIFIED.** F's no-op resolution is correct: the 48 px cadence is already empirically achieved via Sprint 5 Cycle 2's `.card[class*="theme"] .card__bottom { padding: 3rem }` rule. Independent pixel-inset measurement at three viewports confirms 49 px content-to-border on both live and preview (1 px border + 48 px padding). Cycle 1's "Open source §C cards" DELTA row flips to MATCH at 1280 / 768 / 375. No regression risk on the four other `.card-canvas` consumer pages (no code changed). O may close Cycle 4 and merge.

## Advisory notes

1. **FB-8 (brief-vs-preview padding token).** The brief's 32 px card padding contradicts the preview's and live's 48 px. Decision deferred to operator; not in Sprint 12 scope. If reconciled, the surgical edit point is `web/themes/custom/performant_labs_20260502/css/components/card.css:83` (`.card__bottom { padding: 3rem }`) plus a brief-side update — affects all 20+ card instances across 5 pages.

2. **Structural-vs-visual divergence as legitimate state.** This cycle demonstrates that the "outer wrapper padding 0" / "preview specifies outer 48 px" structural delta is visually inert when the inner element already fills and pads the interior. Future audit cycles should measure content-to-border inset (the visual fact) rather than declare DELTA solely from the outer-wrapper declared style (the structural fact). Worth promoting to operator memory as a Tier-3 measurement convention.
