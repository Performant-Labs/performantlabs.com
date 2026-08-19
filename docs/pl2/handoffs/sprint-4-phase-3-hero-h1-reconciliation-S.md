# Handoff-S: Sprint 4 Cycle 3 — Hero H1 size reconciliation

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-3-hero-h1-reconciliation`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-F.md`
**Operator-facing report:** [`sprint-4-phase-3-hero-h1-reconciliation-report.html`](sprint-4-phase-3-hero-h1-reconciliation-report.html)

## T precondition

Confirmed: T reported zero blocking issues. T1/T2 file-grep checks all PASS. Mobile inconsistency noted as advisory, not blocking.

## Precondition checks

- Claude in Chrome MCP tools available (not used for this cycle — Playwright is the rendering authority per prompt).
- Playwright 1.59.1 installed at project root (`node_modules/playwright`).
- ImageMagick `compare`, `convert`, `magick` on PATH at `/opt/homebrew/bin/`.
- All four live URLs return HTTP 200 (verified via `ddev exec curl`).

## Tier 3 visual audit

Capture script: `scripts/sprint4-cycle3-capture.js`. Computed-style probe script: `scripts/h1-probe.js`. Both ran clean against viewport 1280×800 on both preview (`file://`) and live (`https://pl-performantlabs.com.3.ddev.site:8493`) surfaces.

### Visual diff results (hero crop, 1280×800)

| Page | Preview screenshot | Live screenshot | Diff PNG | Composite | Hero crop AE | Hero crop delta % |
|---|---|---|---|---|---|---|
| homepage              | `screenshots/sprint-4-phase-3/t3-homepage-1280-preview-hero-20260511.png`              | `…/t3-homepage-1280-live-hero-20260511.png`              | `…/t3-homepage-1280-hero-diff-20260511.png`              | `…/t3-homepage-1280-composite-20260511.png`              | 111,518 | 10.9 % |
| services              | `…/t3-services-1280-preview-hero-20260511.png`              | `…/t3-services-1280-live-hero-20260511.png`              | `…/t3-services-1280-hero-diff-20260511.png`              | `…/t3-services-1280-composite-20260511.png`              | 310,249 | 30.3 % |
| how-we-do-it          | `…/t3-how-we-do-it-1280-preview-hero-20260511.png`          | `…/t3-how-we-do-it-1280-live-hero-20260511.png`          | `…/t3-how-we-do-it-1280-hero-diff-20260511.png`          | `…/t3-how-we-do-it-1280-composite-20260511.png`          | 444,569 | 43.4 % |
| open-source-projects  | `…/t3-open-source-projects-1280-preview-hero-20260511.png`  | `…/t3-open-source-projects-1280-live-hero-20260511.png`  | `…/t3-open-source-projects-1280-hero-diff-20260511.png`  | `…/t3-open-source-projects-1280-composite-20260511.png`  | 372,731 | 36.4 % |

The pixel-delta percentages reflect total hero-crop area divergence including header height, breadcrumb band (present on live, absent on preview), eyebrow vertical offset, button-block stacking and styling. **They are not by themselves a verdict.** The cycle's intent is hero H1 area parity, not full-hero-block parity; the deltas above need to be decomposed.

### Per-section delta description

The diff PNGs (red overlay) split into three classes of difference, two of them out-of-scope and one binding:

1. **Header / chrome differences (out of scope).** Header position, breadcrumb band on live (services / how-we-do-it / open-source-projects show a red breadcrumb / hero band on live that the preview does not render), button block layout. These were not touched by Cycle 3 and are unrelated to the H1 reconciliation goal.
2. **Vertical offsets of hero content (out of scope).** On all four pages, the preview hero block sits visibly higher than the live hero. This is structural padding, not type-spec.
3. **H1 type spec (binding for this cycle).** This is what computed-style probing resolved definitively — see next subsection.

### Computed-style verification (the binding evidence)

Probed `.hero h1` with `getComputedStyle()` at viewport 1280×800:

| Page | Side | font-size | font-weight | line-height | letter-spacing | Verdict |
|---|---|---|---|---|---|---|
| homepage              | preview | 72px | 500 | 75.6px (1.05) | -2px   | MATCH |
| homepage              | live    | 72px | 500 | 75.6px (1.05) | -2px   | — |
| services              | preview | 72px | 500 | 75.6px (1.05) | -2px   | **MISMATCH on tracking + leading** |
| services              | live    | 72px | 500 | **79.2px (1.10)** | **-1.8px** | — |
| how-we-do-it          | preview | 72px | 500 | 75.6px (1.05) | -2px   | **MISMATCH on tracking + leading** |
| how-we-do-it          | live    | 72px | 500 | **79.2px (1.10)** | **-1.8px** | — |
| open-source-projects  | preview | 72px | 500 | 75.6px (1.05) | -2px   | **MISMATCH on tracking + leading** |
| open-source-projects  | live    | 72px | 500 | **79.2px (1.10)** | **-1.8px** | — |

Font family: `Rubik, sans-serif` on all eight surfaces. PASS.

### Desktop (1280) section assessment

- **Font-size 72px and font-weight 500:** PASS on all four previews and all four live pages. The cycle's headline goal is met.
- **Line-height and letter-spacing:** the previews now specify `1.05 / -2px` on all four pages; live renders `1.05 / -2px` on homepage only and `1.10 / -1.8px` on the three non-home landing pages.
- **Net effect:** Path A as written cannot satisfy both runbook ACs simultaneously. AC #1 (same 72 px size) passes. AC #2 (Previews match live) fails on three of four pages.

### Mobile (375)

Not in scope this cycle — runbook explicitly limits scope to desktop hero H1 reconciliation. T flagged a pre-existing mobile inconsistency (40 px vs 44 px) as advisory; I concur it is out of scope here.

## Design brief compliance

| Token | Brief value | Rendered (preview) | Rendered (live homepage) | Rendered (live services / HWDI / OSP) | Match preview ↔ brief | Match preview ↔ live |
|---|---|---|---|---|---|---|
| display-xl.fontFamily       | Rubik, sans-serif | Rubik, sans-serif | Rubik, sans-serif | Rubik, sans-serif | YES | YES |
| display-xl.fontSize         | 72px              | 72px              | 72px              | 72px              | YES | YES |
| display-xl.fontWeight       | 500               | 500               | 500               | 500               | YES | YES |
| display-xl.lineHeight       | 1.05              | 1.05              | 1.05              | **1.10**          | YES | YES on home, **NO** on other 3 |
| display-xl.letterSpacing    | -2px              | -2px              | -2px              | **-1.8px**        | YES | YES on home, **NO** on other 3 |

The previews comply with the brief. The brief does not comply with three of four live pages. This is the upstream defect.

## WCAG 2.2 AA audit

The cycle introduces no CSS (preview-only HTML + brief documentation). I therefore did not run a full keyboard + zoom + forced-colors audit — there is no live surface that changed. The four previews retain the same `<h1>` semantics they had pre-cycle. Heading hierarchy and image-alt scope are unchanged from the prior accepted state.

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation                | N/A — no interaction surface changed | — |
| Focus ring visibility              | N/A | — |
| Forced-colors mode                 | N/A | No color changes |
| Reduced-motion                     | N/A | No motion changes |
| 200% zoom                          | N/A | Type token only |
| Heading hierarchy                  | PASS | Single `<h1>` per preview; unchanged from prior |
| Image alt text                     | N/A | No image changes |
| Mobile touch targets (375)         | N/A | Mobile not in scope |
| Mobile typography scale            | N/A | Mobile not in scope |
| Mobile layout                      | N/A | Mobile not in scope |

## Static preview comparison

Not applicable in the usual sense — the previews ARE the artifact under review this cycle. The "static preview ↔ live" comparison IS the audit, and it is captured in the computed-style table above.

## Verdict

**ADVISORY-HOLD** — the spec source-of-truth is internally inconsistent; pipeline paused pending operator decision.

- **Defect:** the brief's `display-xl` token (`letterSpacing: -2px`, `lineHeight: 1.05`) and three of the four live landing-page hero H1s (`letterSpacing: -1.8px`, `lineHeight: 1.10`) are out of alignment. The cycle's runbook AC #1 (same 72 px size) is met; AC #2 (previews match live) is not met on services / how-we-do-it / open-source-projects.
- **Convention violated:** "single source of truth" for type tokens. The brief either applies to all landing-page heroes (current annotation says it does) or it does not.
- **Proposed fix (operator chooses one):**
  - **A.** Update brief to `-1.8px / 1.10` and update all four previews + live homepage to match.
  - **B.** Keep brief at `-2px / 1.05`; update live CSS on services / how-we-do-it / open-source-projects to match.
  - **C.** Split the token: one for homepage hero (`-2px / 1.05`), another for the other landing heroes (`-1.8px / 1.10`); reflect the split in the brief annotation F added at line 54 and revert the three previews to `-1.8px / 1.10`.
- **Why not REWORK:** F's implementation faithfully matches the source of truth F was pointed at (the brief). The divergence between brief and live exists upstream of this cycle. Asking F to flip values again without operator alignment would just re-litigate the ambiguity.

The font-size + weight portion of the cycle (the headline goal — 72 / 500 on all four heroes) is done correctly and should not be reverted.

## Advisory notes

1. **Mobile hero H1 inconsistency** persists (40 px on three previews vs 44 px on homepage). T flagged it; the operator's decision above should ideally cover the mobile token at the same time to avoid a future ADVISORY-HOLD on the same spec ambiguity at the `typography-mobile.display-xl` token.
2. **Cycle issue text said `-1.8px`.** F deviated to `-2px` citing the brief; T validated. The probe shows the issue text was actually correct for live on three of four pages — but neither value is correct for live on the fourth (homepage). The right next step is operator alignment, not "F made the wrong call".
3. **Pixel diff numbers in the table are high** (10–43 %) and would look alarming in isolation. Most of that delta is non-H1 structural divergence between the static preview HTML and the rendered Drupal page (breadcrumb band, header padding, button stacking). Computed-style probing is the binding measurement here, not the AE count.
