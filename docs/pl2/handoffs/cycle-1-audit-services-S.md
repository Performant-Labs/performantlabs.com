# Handoff-S: Sprint 5 — Cycle 1 — Preview-vs-Live Audit (`/services`)

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-5-cycle-1-audit`
**Issue:** `docs/pl2/handoffs/cycle-1-audit-services-issue.md`
**Sprint runbook:** `docs/pl2/pl-plan--sprint-5-services-fidelity.md`
**Mode:** autonomous
**Pipeline shape:** O → S → O (audit-only; no F, no T, no commit)
**Operator-facing report:** [`cycle-1-audit-services-report.html`](cycle-1-audit-services-report.html)

## T precondition

N/A — audit-only cycle (no T ran). Per issue §"Special notes," skipping T-handoff check.

## Browser-tool + visual-diff preconditions

| Check | Result |
|---|---|
| Playwright installed (`node_modules/playwright`) | PASS |
| `compare` on PATH | PASS (`/opt/homebrew/bin/compare`) |
| `magick` / `convert` on PATH | PASS (`/opt/homebrew/bin/convert`) |
| Live URL HTTP 200 | PASS (`https://pl-performantlabs.com.3.ddev.site:8493/services`) |
| Preview served via `python3 -m http.server 8765` | PASS (`http://localhost:8765/services.html`) |

## Tier 3 visual audit

### Capture method

Playwright `chromium.launch()` → `newContext({viewport})` → `page.goto({waitUntil:'networkidle'})` → animation/transition CSS injected → `page.screenshot({fullPage:true})`. Both live and preview were captured at 1280×800, 768×1024, 375×667 with `deviceScaleFactor:1`.

### Visual diff results (whole-page, full height padded to max of both)

| Viewport | Live PNG h | Preview PNG h | Padded h | Diff pixels (AE) | Total pixels | Delta % |
|---|---:|---:|---:|---:|---:|---:|
| 1280 × 800   | 4583 | 4067 | 4583 | 3,150,090 | 5,866,240 | **53.70 %** |
| 768  × 1024  | 5396 | 4744 | 5396 | 2,131,700 | 4,144,128 | **51.44 %** |
| 375  × 667   | 7065 | 6360 | 7065 | 1,406,880 | 2,649,375 | **53.10 %** |

Files in `docs/pl2/handoffs/screenshots/sprint-5-cycle-1/`:

- `t3-services-{1280,768,375}-{live,preview}-20260511.png` (raw)
- `t3-services-{1280,768,375}-diff-20260511.png` (red-overlay diff)
- `t3-services-{1280,768,375}-composite-20260511.png` (side-by-side)
- Section crops: `{live,prev}-{engagements,nearshore,proof,cta}-1280-composite.png` + `diff-{engagements,nearshore,proof,cta}-1280.png`

### Why the whole-page delta is ~53 % at every viewport

The preview is a standalone HTML file with minimal chrome (slim header, minimal footer). The live page is the full Drupal-themed site with a wide site header (logo + 6-label nav), breadcrumb component, hero with `?theme=` background not applicable, and a multi-column site footer. Even where sections align in content, the live total height is ~12–14 % taller, so when both are top-aligned for diff, sections below the hero are vertically offset by ~50–100 px and almost every pixel below the hero registers as a delta. **The whole-page % is therefore non-actionable; the per-section delta classification below is the binding signal.**

### FU-6 answer — does the preview contain a heal-flow section?

**No.** The preview at `docs/pl2/Previews/services.html` contains five `<section>` elements:

| # | `<section>` class | Purpose |
|---|---|---|
| 1 | `hero` | Out of scope (FU-2 canonical) |
| 2 | `engagements` | Four-card grid |
| 3 | `nearshore` | Cream-banded capacity section |
| 4 | `proof` | Dogfooding pitch + "We Speak" text-only logo strip |
| 5 | `closing-cta` | Espresso-banded final CTA |

No `heal-flow`, `healing`, or similar section exists. The string `healing` appears only inside engagement-card #3 body copy ("Autonomous-healing pilot") and in nearshore body copy.

**Resolution per sprint runbook §"Approval Checkpoints":** close FU-6 as "Services does not need heal-flow." Do not open a dedicated heal-flow cycle.

### Per-section delta catalog (binding output)

Sections audited at 1280, 768, 375. Each delta classified as TYPO / LAYOUT / COPY / COMPONENT / TOKEN / WCAG and tagged with a proposed remediation layer (L1 config / L3 base.css / L5 component CSS / Canvas content).

#### § engagements (4-card grid)

| # | Delta | Viewports | Category | Remediation layer | Notes |
|---|---|---|---|---|---|
| E1 | Card surface: live has skeletal "hairline top rule only, transparent background" treatment; preview has subtle cream/canvas card surface with inner padding and softer card containment. | 1280, 768, 375 | TOKEN + COMPONENT | L5 (card-canvas CSS) | Brief §"surfaces" describes card surfaces as `--surface-cream` with `--space-lg` inner padding. Live `card-canvas` SDC currently uses transparent bg. |
| E2 | Eyebrow numerals: live reads "01 / TAKEOVER" (uppercase TAKEOVER); preview reads "01 / Takeover" (title-case). Same on all four cards (Embed/Pilot/a11y). | 1280, 768, 375 | TYPO + COPY | Canvas content (per-card field) | Casing difference is a per-card text value, not a CSS transform — confirmed by checking preview `.engagement-card__num` block — no `text-transform` is applied. |
| E3 | H3 trailing periods: preview h3 texts all end with `.` ("Test-suite takeover.", "Embedded testing engineer.", "Autonomous-healing pilot.", "Accessibility testing."). Live h3 has no trailing period. | 1280, 768, 375 | COPY | Canvas content | One-character per-card edit. |
| E4 | Grid: 1280 — both render 2×2 at desktop; matches. 768 — both render 2×2; matches. 375 — both stack 1-col; matches. | all | LAYOUT | — (MATCH) | Grid is fine; only card chrome differs. |
| E5 | Eyebrow underline/accent: preview eyebrow uses single hairline underline accent in terracotta beneath the numeral cluster. Live shows terracotta accent already but with slightly thinner stroke and different spacing relative to the h3. | 1280 | TOKEN | L5 (card-canvas CSS) | Likely a 1–2 px metric tweak rather than a redesign. |
| E6 | Inter-card vertical breathing: live shows ~32 px between rows in the 2×2 grid; preview shows ~48 px gap. | 1280 | LAYOUT | L5 (card-canvas grid CSS) | Brief spacing scale: `--space-lg` (32) vs `--space-xl` (48). |

**Section verdict:** REWORK candidate; coherent enough for **a single cycle** focused on engagement-card visual fidelity. Most weight on E1 (card surface) and secondarily E5/E6 (spacing/accent metrics). E2/E3 are trivial Canvas-content edits that can ride along.

#### § nearshore (Capacity, cream band)

| # | Delta | Viewports | Category | Remediation layer | Notes |
|---|---|---|---|---|---|
| N1 | Section background & kicker: both render cream-banded with terracotta "CAPACITY" kicker centered above H2. MATCH at desktop. | 1280, 768 | — | — (MATCH) | Treatment is consistent enough. |
| N2 | H2 wrap: live wraps as "Senior testing capacity, when you need more hands." on one or two lines depending on container; preview wraps to two lines `("Senior testing capacity, / when you need more hands.")`. At 1280 the live wraps differently than preview; verify after any container max-width change. | 1280 | LAYOUT | L5 (nearshore CSS) | Likely caused by different container `max-width` (preview uses ~640 px content-cap; live likely uses page-level container at 1140). Adjust to a content-cap on this section. |
| N3 | CTA "Talk about capacity": both show a primary teal pill with right-arrow icon. Sizes appear close. MATCH within ~2 % at 1280. | 1280, 768, 375 | — | — (MATCH) | No work needed. |
| N4 | Mobile (375): both stack to single column with H2 wrapping naturally; matches. | 375 | — | — (MATCH) | |

**Section verdict:** Mostly MATCH. **N2 is a small, low-risk metric tweak.** Could be folded into the engagement-cards cycle if F's scope cap allows, or handled by the closing-cta cycle. Standalone cycle not required.

#### § proof (dogfooding pitch + "We Speak" logo strip)

| # | Delta | Viewports | Category | Remediation layer | Notes |
|---|---|---|---|---|---|
| P1 | "We Speak" logo strip is a **text-only inline wordmark row** in preview (six wordmarks: Drupal · Playwright · Cypress · PHP · JavaScript · React, plain text in body-text weight, horizontally distributed in a hairline-bounded strip with "WE SPEAK" small caps label demoted above). | 1280, 768, 375 | COMPONENT + TOKEN | Canvas content + L5 (new CSS or SDC) | Live uses `dripyard_base:logo-grid` SDC with raster `logo-item` images for ~8 marks (Drupal, Playwright, Cypress, PHP, JS, React, Anthropic "A", plus one more). The preview deliberately demotes this to a text-only strip — substantial structural delta. **Either (a) swap the component to a new text-based SDC, or (b) restyle/override `logo-grid` to render text labels.** Recommend (a) for cleanliness. |
| P2 | "We Speak" label placement: preview demotes label INSIDE the hairline-bounded strip, ABOVE the wordmark row, centered small-caps. Live places "WE SPEAK" as a small centered label BELOW the dogfooding body copy and ABOVE the (image) logo strip, with no hairline bounding. | 1280, 768, 375 | LAYOUT | L5 | Tied to P1 — reworking the strip subsumes this. |
| P3 | Dogfooding H2 "These aren't services we're spinning up. They're how we already work." — copy matches between preview and live. MATCH. | all | — | — (MATCH) | |
| P4 | Dogfooding body copy: matches between preview and live within minor copy-edit tolerance. MATCH. | all | — | — (MATCH) | |
| P5 | Dogfooding CTA "See how we test this site": both render as outlined/ghost pill with arrow chip. MATCH. | all | — | — (MATCH) | |
| P6 | Kicker "DOGFOODING": preview kicker reads `Dogfooding` (title case in the source HTML, displayed in caps via small-caps treatment); live shows `DOGFOODING`. Final visual is identical small-caps. MATCH. | all | — | — (MATCH) | |

**Section verdict:** REWORK; **single cycle for the logo strip overhaul**. P1 is the substantive item; P2 rides along.

#### § closing-cta (espresso final CTA)

| # | Delta | Viewports | Category | Remediation layer | Notes |
|---|---|---|---|---|---|
| C1 | Element order: preview is `kicker → H2 → body copy → CTA cluster (2 buttons)`. Live is `kicker → body copy → H2 → CTA cluster (split: primary button beside H2, secondary CTA below, centered)`. | 1280 | LAYOUT + COMPONENT | Canvas content (reorder fields) + L5 (override `title-cta` styling) | Most visible structural delta on this section. |
| C2 | H2 alignment: preview centers the H2 within the espresso panel; live left-aligns the H2 (with primary CTA pushed to the right of it). | 1280 | LAYOUT | L5 (`title-cta` override or new closing-cta CSS) | |
| C3 | CTA cluster: preview shows both buttons side-by-side, centered below body copy: primary "Book a testing review" (teal pill) + ghost-on-dark "Or start with the tools" (outlined pill). Live shows primary button positioned right of H2 (separate row from secondary), and secondary "Or start with the tools" centered alone below. | 1280 | LAYOUT | L5 | Tied to C1/C2; resolved together. |
| C4 | Mobile (375): both render with centered text and stacked CTAs. Largely MATCH on mobile because the desktop layout differences collapse out. | 375 | — | — (MATCH on mobile) | |
| C5 | Token: espresso bg, terracotta kicker "BOOK A REVIEW," cream H2 text — color tokens MATCH between live and preview. | all | — | — (MATCH on tokens) | |
| C6 | Ghost-on-dark secondary button variant: live and preview both use an outlined pill on dark; matches in token, differs only in placement (C3). | all | — | — (MATCH on variant) | |

**Section verdict:** REWORK; **single cycle for closing-cta reorder + alignment**. Cleanest cycle of the four — purely layout/alignment work, no new component, no new tokens.

### Cross-section TYPO/TOKEN sweep

Spot-checked H2 sizing across § engagements, § nearshore, § proof, § closing-cta:

- Brief desktop H2 token (per `pl_design_brief.md`): visually checked at 56 / 500 / 1.1 / -1.2 px. Live and preview render close to the same H2 size; no canon drift detected at 1280.
- H3 token (engagement cards): both render at ~24–26 px; close match. No L3 canon change indicated.
- Kicker treatment (small-caps + terracotta): consistent between live and preview across all four sections.

**No L3 base.css typography canon change indicated by this audit.** Sprint runbook's pre-committed "Cycle 5 — Typography canon" can be closed as not-needed unless a downstream cycle surfaces drift.

## WCAG 2.2 AA quick-pass (page-level, advisory)

This is an audit-only cycle; WCAG enforcement happens at the final cycle per the runbook. Spot-check observations:

| Check | Result | Notes |
|---|---|---|
| Single H1 | PASS (advisory) | Hero contains the single H1. |
| Heading hierarchy | PASS (advisory) | H1 → H2 per section → H3 per engagement card. No skipped levels. |
| Image alt text | PARTIAL | Logo-grid `logo-item` raster images on live need confirmed alt text in remediation (P1 cycle). Preview is text-only, so this concern only applies if live keeps `logo-grid` SDC. |
| Touch targets ≥ 44×44 (375) | PASS (advisory) | CTAs render at adequate hit-area on both live and preview. |
| Color contrast — primary button | Pre-existing accepted deviation (ADV-S5 from `pl-plan--services.md`); not re-flagged. |
| Forced-colors / reduced-motion / 200 % zoom | Not exercised in this cycle (S-only audit; defer to final cycle). |

**Conclusion:** No new WCAG regressions surfaced by this audit. The final-cycle verification will re-run the full sweep.

## Pre-existing accepted deviations (NOT re-flagged)

Per issue §"Special notes" and `pl-plan--services.md` §"Final advisory carry-forward":

- R8 mobile hero overflow — separate cycle-debt branch.
- ADV-S5 primary-button contrast — operator-accepted.
- F.8 / F.9 footer items — out of Sprint 5 scope.
- Hero image retirement (FU-2 canonical) — shipped.

None of these surface as new deltas in this audit.

## Static-preview internal consistency check

The preview itself was inspected for upstream defects before running diffs:

- Responsive breakpoints in `services.html` `@media` queries are consistent with brief §"Breakpoints" — no contradiction.
- Heading hierarchy in preview DOM: H1 (hero) → H2 (section) → H3 (engagement cards). No skipped levels.
- Color tokens in preview match `--canvas`, `--cream`, `--espresso`, `--ink`, `--terracotta` from `pl_design_brief.md`.
- No hamburger-at-desktop or touch-target-too-small issues in the preview itself.

**Preview is internally consistent. No `ADVISORY-HOLD` warranted.**

## Verdict

**PASS** — audit completed, catalog is usable for carving Sprint 5 Cycle 2..N.

Per issue §"Verdict mapping," PASS here means "audit completed; catalog usable" and does not require zero deltas.

## Recommended cycle carve (input to O)

Based on the delta catalog above, the following cycle ordering optimizes for (i) largest visible delta first, (ii) coherent single-section remediation per cycle, (iii) F scope-cap respected (≤ 6 files / one component family per cycle):

| Cycle | Section | Primary deltas | Remediation layer | F file-budget estimate |
|---|---|---|---|---|
| **2** | § engagements (4-card grid) | E1 card surface, E5 eyebrow accent, E6 row gap; ride-along E2 casing + E3 trailing periods (Canvas content) | L5 component CSS (card-canvas) + Canvas content edits | ~3–4 files |
| **3** | § closing-cta | C1 element order, C2 H2 alignment, C3 CTA cluster placement | L5 component CSS (title-cta override or new closing-cta CSS) + Canvas content reorder | ~3–4 files |
| **4** | § proof / logo strip | P1 text-only wordmark strip (component swap), P2 label placement | Canvas content (replace logo-grid SDC with text variant) + L5 (new CSS class) — potentially L1 if a new SDC is registered | ~4–6 files |
| **5** | § nearshore (optional) | N2 H2 wrap container-cap | L5 component CSS | ~1–2 files. Could be folded into Cycle 2 or 3 if scope-cap allows. |
| **Final** | Whole-page integration + WCAG | Cross-section verification | T → S | per runbook |

**Carve rationale:**

- **Cycle 2 first**: engagement-cards have the highest visible weight (largest section, most-cited delta in Sprint 4 history), and the remediation is contained to one component family (`card-canvas`) — cleanest cycle to start with.
- **Cycle 3 second**: closing-cta is small, contained, layout-only — fast win, no new tokens, no new components.
- **Cycle 4 third**: logo-strip is the most architecturally invasive (component swap/replacement) so it goes last and benefits from the warm-up of two prior cycles.
- **Cycle 5 (nearshore)**: low-priority; recommend folding into Cycle 2 or 3 if F's scope-cap allows; otherwise close as no-op.
- **FU-6**: close as "Services does not need heal-flow" — no dedicated cycle.
- **Typography canon cycle (pre-committed Cycle 5 in runbook)**: not indicated by this audit; close as no-op unless a later cycle surfaces drift.

## Advisory notes

- Live page contains an 8th logo mark ("A" — Anthropic) that is not present in the preview's six-wordmark list. When the logo-strip cycle reworks this, operator should confirm the canonical wordmark set (preview's 6 vs live's 8).
- Per memory `feedback_no_orphan_words.md`: when rewrapping nearshore H2 (N2) and closing-cta H2 (C2), apply `text-wrap: balance` to prevent orphan words at the new container width.
- Per memory `design_header_nav_breakpoint.md`: the live site header (with 6 labels) uses `navbar-expand-lg` — confirmed unchanged by this audit. No header work in Sprint 5.

## Artifacts inventory

```
docs/pl2/handoffs/screenshots/sprint-5-cycle-1/
├── t3-services-{1280,768,375}-live-20260511.png       (raw live captures)
├── t3-services-{1280,768,375}-preview-20260511.png    (raw preview captures)
├── t3-services-{1280,768,375}-diff-20260511.png       (ImageMagick AE diff)
├── t3-services-{1280,768,375}-composite-20260511.png  (side-by-side +append)
├── {live,prev}-{engagements,nearshore,proof,cta}-*.png  (per-section crops at 1280)
├── diff-{engagements,nearshore,proof,cta}-1280.png    (per-section diff crops)
└── (etc.)
```
