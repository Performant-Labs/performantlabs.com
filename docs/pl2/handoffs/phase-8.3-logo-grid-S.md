# Handoff-S: Phase 8.3 - Logo grid presentation parity

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8.3-logo-grid`
**Issue:** `docs/pl2/handoffs/phase-8.3-logo-grid-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/phase-8.3-logo-grid-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-8.3-logo-grid-F.md`
**Operator-facing report:** [`phase-8.3-logo-grid-report.html`](phase-8.3-logo-grid-report.html)

---

## T precondition

Confirmed: T reported zero blocking issues. 6/6 acceptance criteria pass; 5/5 regression checks pass. T deferred the 4+2 vs 3+3 wrap-pattern question to S for visual corroboration — addressed below.

## Preconditions

- Playwright: present at `node_modules/playwright`, browsers installed.
- ImageMagick `compare`: `/opt/homebrew/bin/compare`.
- Preview server: `http://localhost:8765/homepage.html` → 200; `http://localhost:8765/client-logos/CBS-Interactive-logo.png` → 200. New client-logos PNGs are served.
- Live: `https://pl-performantlabs.com.3.ddev.site:8493/` → 200.

All preconditions met.

---

## Tier 3 visual audit

### Visual diff results (logo bar, aligned crops)

The primary evidence for sub-cycle 8.3 is the **aligned logo-bar crop** — both crops sized to match the logo container vertically, so the pixel diff isolates the logo bar itself from section-spacing differences.

| Viewport | Live (full page) | Preview (full page) | Logo-bar live crop | Logo-bar preview crop | Aligned diff PNG | Aligned composite | AE pixels | Aligned delta % |
|---|---|---|---|---|---|---|---|---|
| 1280×800  | `t3-homepage-1280-live-20260511.png` | `t3-homepage-1280-preview-20260511.png` | `t3-homepage-logobar-aligned-1280-live-20260511.png` | `t3-homepage-logobar-aligned-1280-preview-20260511.png` | `t3-homepage-logobar-aligned-1280-diff-20260511.png` | `t3-homepage-logobar-aligned-1280-composite-20260511.png` | 11,705 / 138,240 | **8.47 %** |
| 768×1024  | `t3-homepage-768-live-20260511.png`  | `t3-homepage-768-preview-20260511.png`  | `t3-homepage-logobar-aligned-768-live-20260511.png`  | `t3-homepage-logobar-aligned-768-preview-20260511.png`  | `t3-homepage-logobar-aligned-768-diff-20260511.png`  | `t3-homepage-logobar-aligned-768-composite-20260511.png`  | 12,227 / 129,024 | **9.48 %** |
| 375×667   | `t3-homepage-375-live-20260511.png`  | `t3-homepage-375-preview-20260511.png`  | `t3-homepage-logobar-aligned-375-live-20260511.png`  | `t3-homepage-logobar-aligned-375-preview-20260511.png`  | `t3-homepage-logobar-aligned-375-diff-20260511.png`  | `t3-homepage-logobar-aligned-375-composite-20260511.png`  | 13,969 / 79,500 | **17.57 %** |

All paths relative to `docs/pl2/handoffs/screenshots/cycle-8.3/`.

**Whole-page delta is informational only** (not binding for 8.3): live page is ~1000 px taller than preview at every viewport because of section-spacing differences in hero, feature-card block, FAQ, and footer regions. Those belong to cycle 8.6, not 8.3. Whole-page percentages (50–54 %) reflect that shift, not logo-bar issues.

### What's actually different in the aligned diff

Visual inspection of every aligned diff PNG (red overlay) — the delta is concentrated **entirely** in horizontal position shifts of identical logo content:

- **Treatment is identical**: filter `grayscale(1)`, opacity `0.7`, height `28 px`, `object-fit: contain` on every logo, every viewport. Measured via Playwright `getBoundingClientRect` + `getComputedStyle`. (See `measurements-20260511.json`.)
- **Wrap pattern is identical** at every viewport — see resolution table below.
- **Per-logo x-position differs** because live applies a uniform 140 px cell (`.logo-grid .logo-item img { width: 140px }`) while preview uses each logo's intrinsic width (CBS = 145, DocuSign = 99, Orange = 28, Renesas = 168, Robert Half = 200, Tesla = 22). At 1280 the row uses `space-between` on both sides; live's cells distribute evenly via the cell box, preview's distribute evenly via the intrinsic widths. The logo content shifts by a few dozen px each.
- **At 375** the delta percentage is higher because live's mobile rule (`.logo-grid .logo-item { flex: 0 1 calc(50% - 0.75rem); width: 100% }`) fills each 50 % cell, while preview's mobile rule leaves logos at intrinsic width inside 50 % cells. The visual outcome is two columns either way, but live's logos appear larger in horizontal extent.

This per-logo x-position delta is **F's documented infrastructure deviation #1**: Drupal's Canvas responsive image system applies `sizes="auto 100vw"` on `<img>` srcset, which fails to resolve a layout width without an explicit CSS width — producing 0×0 images. The 140 px box with `object-fit: contain` is the minimum-viable accommodation. The visual impact is uniform cell spacing instead of variable spacing; the logo treatment, set, and wrap pattern all match preview. F's handoff §"Known issues" #1 documents both the constraint and the L4 Twig alternative (modifying Canvas template) which is out of scope for a CSS-only cycle.

### 768 wrap-pattern resolution (the binding question for 8.3)

| Site | Measured pattern at 768 | Container width | Items per row |
|---|---|---|---|
| Live | 4 + 2 | 693 px | 4, then 2 |
| Preview | 4 + 2 | 720 px | 4, then 2 |
| Brief | 3 + 3 ("two rows of three at md") | — | — |

**Live = preview at 768.** Per operator rule "preview is canonical", this resolves to **PASS for 8.3**. The brief is stale; flag as advisory follow-up for a doc-only brief-update cycle.

### Per-section delta description

| Section | Viewport(s) | Visual difference | F documented as intentional? | Verdict |
|---|---|---|---|---|
| Logo bar — wrap pattern | 1280, 768, 375 | Matches preview at every viewport (6 / 4+2 / 2+2+2) | N/A — matches | MATCH |
| Logo bar — treatment | 1280, 768, 375 | Grayscale 1, opacity 0.7, height 28 px, object-fit contain — identical | N/A — matches | MATCH |
| Logo bar — per-logo x-position | 1280, 768, 375 | Live uses uniform 140 px cells; preview uses intrinsic widths. Each logo shifts by a few dozen px | YES — F handoff §Deviations #1 (Canvas sizes="auto" infrastructure constraint) | DELTA (accepted) |
| Section-spacing — label-to-logos vertical gap | 768, 375 | Live ~140 px gap label-to-first-row, preview ~20 px | Out of scope for 8.3 (belongs to 8.6 polish cycle) | DELTA (out of scope) |
| Whole-page vertical height | all | Live ~1000 px taller per viewport | Out of scope for 8.3 (belongs to 8.6 polish cycle) | DELTA (out of scope) |

### Desktop (1280px)

| Element | Verified against brief / preview | Match | Notes |
|---|---|---|---|
| Logo bar — six logos in a single row | YES | YES | flexWrap nowrap, justifyContent space-between, container 1164×28 |
| max-height 28 px | YES | YES | Computed height 28 px on every logo |
| Grayscale + opacity treatment | YES | YES | filter grayscale(1), opacity 0.7 |
| object-fit: contain | YES | YES | Each logo proportionally contained in 140 px cell |
| `space-between` distribution | YES | YES | container `justify-content: space-between` |

### Tablet (768px)

| Element | Verified | Match | Notes |
|---|---|---|---|
| Wrap pattern | YES | YES | 4+2 on both live and preview (brief 3+3 is stale) |
| Logo size 28 px | YES | YES | Same as 1280 |
| Treatment | YES | YES | grayscale 1 + opacity 0.7 |
| Row distribution | partial | partial | Live row-2 (Robert Half + Tesla) centered; preview row-2 anchored left + right via space-between. Both are within `justify-content: center` for live and `space-between` for preview. Visual difference: live row-2 looks centered, preview row-2 looks anchored. Treatment per-logo is identical. This is acceptable per "preview is canonical" given the same pattern (4+2). |

### Mobile (375px)

| Element | Verified | Match | Notes |
|---|---|---|---|
| Wrap pattern | YES | YES | 2+2+2 on both |
| Logo size 28 px height | YES | YES | All logos 28 px tall |
| Treatment | YES | YES | grayscale + opacity match |
| Touch targets | N/A | N/A | Logos are not interactive |
| Mobile typography scale ("Trusted by teams at" label) | YES | YES | Label rendered, matches preview's centered placement |
| No horizontal scroll | YES | YES | Container 331 px on live, 327 px on preview, both fit within 375 px viewport |

## Design brief compliance

| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| Logo max-height | 28 px | 28 px (computed) | YES |
| Filter | grayscale(100 %) | grayscale(1) | YES |
| Opacity | 0.7 (per preview) | 0.7 (computed) | YES |
| object-fit | contain | contain | YES |
| Desktop layout | single row, evenly spaced | flexWrap nowrap, justify-content space-between | YES |
| Tablet wrap | brief says 3+3; preview produces 4+2 | live produces 4+2 (matches preview) | YES (vs preview); NO (vs brief — brief is stale) |
| Mobile wrap | 3 rows of 2 | 2+2+2 | YES |
| Label color "Trusted by teams at" | #5C544C on #FFFFFF, 7.43:1 | same | YES |
| Alt text | descriptive | "[Company] logo" for all six | YES |

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Tab order untouched by 8.3; logos are not interactive |
| Focus ring visibility | N/A | Logos not focusable elements |
| Forced-colors mode | PASS | grayscale + opacity are CSS filter / opacity, which forced-colors honors; logos remain visible as bitmap content |
| Reduced-motion | PASS | No animations introduced by 8.3 |
| 200% zoom | PASS | Logo bar wraps gracefully; no clipping, no horizontal scroll (verified via crop inspection) |
| Heading hierarchy | PASS | T confirmed single H1, no skipped levels; 8.3 changed no headings |
| Image alt text | PASS | All six logos have descriptive "[Company] logo" alts; none "image" or empty |
| Mobile touch targets (375px) | N/A | Logos not interactive |
| Mobile typography scale | PASS | "Trusted by teams at" label matches preview |
| Mobile layout | PASS | 2+2+2 wrap, no horizontal scroll, container 331 px fits 375 px viewport |

## Static preview comparison

Compared against `docs/pl2/Previews/homepage.html` (canonical, updated in commit `6f21f8aac`).

| Section | At 1280 | At 768 | At 375 |
|---|---|---|---|
| Logo bar — wrap | MATCH | MATCH (4+2 vs 4+2) | MATCH |
| Logo bar — treatment | MATCH | MATCH | MATCH |
| Logo bar — per-logo x-position | DELTA (accepted, F #1) | DELTA (accepted, F #1) | DELTA (accepted, F #1) |
| Header | MATCH (regression check) | MATCH (hamburger) | not re-audited (in scope only as 8.1 regression) |
| Hero band | not in scope; out of 8.3 | DELTA (label-to-logos gap; defer to 8.6) | DELTA (defer to 8.6) |
| Feature cards | not in scope | MATCH (3-card stack regression) | not in scope |

## Verdict

**PASS** — sub-cycle 8.3 logo-bar parity is achieved. Ready for O to commit and merge.

Reasoning:

1. **Wrap pattern**: live = preview at every viewport (6 / 4+2 / 2+2+2). Per operator rule "preview is canonical", the 768 4+2-vs-3+3 question resolves to PASS. Brief is stale (separate doc-only update).
2. **Treatment**: filter, opacity, height, object-fit all match preview at every viewport.
3. **Logo set + alt text**: same six logos, same order, descriptive alts.
4. **Per-logo x-position delta**: 8.47/9.48/17.57 % at the aligned crops, but the entire delta is explained by F's documented infrastructure deviation (Canvas `sizes="auto"` requires explicit CSS width; uniform 140 px cells vs preview's intrinsic widths). No per-logo treatment delta. Acceptable per F handoff §"Deviations from spec" #1 and operator directive "preview is canonical" applied with infrastructure constraints noted.
5. **No regressions** on 8.1 (header — no pill, hamburger at <992), 8.2 (hero padding-inline: 0, no overflow at 768), 8.4 (feature cards 1-col stack at 768), 8.5 (hero min-height: auto, tight hero-to-next-band).
6. **No `!important`**, no L4 changes, CSS-only override at correct cascade layer (L5 component-scoped). T confirmed CSS rules in served stylesheet.

## Advisory notes

1. **Brief is stale at the 768 wrap pattern.** `docs/pl2/Briefs/pl_design_brief.md` §"Per-section mobile behavior" §"Logo bar" specifies "two rows of three at md"; both preview and live produce 4+2. Update the brief in a doc-only cycle to read e.g. "wraps naturally at md (4+2 with the current logo widths)" so future audits do not re-flag this divergence.
2. **Section-spacing deltas (label-to-logos gap, whole-page heights)** are owned by cycle 8.6 footer/FAQ/polish, not 8.3.
3. **Pre-existing unstaged file** `config/sync/views.view.articles.yml` is unrelated to 8.3 and not a blocker (T flagged in T-handoff §"Advisory notes" #1).
4. **Logo cell uniformity vs preview's variable widths** is an infrastructure constraint of Drupal Canvas `sizes="auto"`. The only true alternatives are (a) modify Canvas Twig template to drop `sizes="auto"` for logo context, or (b) use a non-responsive image style — both L4 changes and out of scope for a CSS-only cycle. If pixel-perfect variable-width logos are required in the future, prefer (b) via a logo-grid-specific image style.
