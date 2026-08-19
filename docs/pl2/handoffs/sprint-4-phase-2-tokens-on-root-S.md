# Handoff-S: Sprint 4 Cycle 2 — Brand tokens on `:root`

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-2-tokens-on-root`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-2-tokens-on-root-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-4-phase-2-tokens-on-root-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-4-phase-2-tokens-on-root-F.md`
**Operator-facing report:** [`sprint-4-phase-2-tokens-on-root-report.html`](sprint-4-phase-2-tokens-on-root-report.html)

## T precondition

Confirmed: T reported zero blocking issues. T1 (cache clear, HTTP status, token presence) and T2 (source order, specificity, inline-style conflict, computed-style probe) all PASS.

## Browser-tool & visual-diff preconditions

Playwright 1.59.1 with Chromium present; `compare` (ImageMagick 7.1.2-21) on PATH; Playwright accepts the DDEV mkcert cert without `ignoreHTTPSErrors`. All preconditions met.

## Tier 3 visual audit

### Methodology

- Captured current branch state (uncommitted F changes in working tree) at 1280×800 and 375×667 for `/`, `/articles`, `/contact-us`, `/open-source-projects`.
- `git stash` of `web/themes/custom/performant_labs_20260502/css/base.css` only, `ddev drush cr`, verified Sprint-4-Cycle-2 block absent.
- Captured baseline state at the same 8 URLs+viewports.
- `git stash pop`, `ddev drush cr`, confirmed branch state restored.
- ImageMagick `compare -metric AE` for pixel-level diff per pair; full-page screenshots with animations / transitions disabled and `document.fonts.ready` awaited before capture.

### Visual diff results

| Page | Viewport | Total pixels | Differing pixels | Delta % | Verdict (literal AC) |
|---|---|---:|---:|---:|---|
| `/`                       | 1280×800  | 6,085,120 | 0       | 0.0000% | MATCH |
| `/`                       | 375×667   | 2,680,875 | 0       | 0.0000% | MATCH |
| `/articles`               | 1280×800  | 3,668,480 | 193,644 | 5.2786% | DELTA |
| `/articles`               | 375×667   | 1,594,500 | 55,606  | 3.4874% | DELTA |
| `/contact-us`             | 1280×800  | 4,341,760 | 193,644 | 4.4600% | DELTA |
| `/contact-us`             | 375×667   | 2,322,000 | 55,606  | 2.3947% | DELTA |
| `/open-source-projects`   | 1280×800  | 5,779,200 | 193,644 | 3.3507% | DELTA |
| `/open-source-projects`   | 375×667   | 3,483,750 | 55,606  | 1.5962% | DELTA |

Identical differing-pixel counts across the three affected pages (193,644 @ 1280; 55,606 @ 375) confirms the delta is in a shared site-chrome region, not page-specific content.

### Per-section delta description

| Section | Pages affected | Viewport(s) | What changed visually | Documented in F handoff? | Verdict |
|---|---|---|---|---|---|
| Breadcrumb / page-title / region-highlighted band (under site-header, above page body) | `/articles`, `/contact-us`, `/open-source-projects` | 1280 + 375 | Background flips from cool pale-lavender (Dripyard's `oklch(0.97 0.008 264.051)` neutral-50 derived from legacy `--primary: #0000d9`) to warm brand cream `#F5EFE2` (the value F declared at `:root --theme-surface-alt`). | No — F handoff says "no visual change expected" | DELTA (intent-aligned but contradicts literal AC) |
| Site header strip itself | none | — | Unchanged (white in both states; `theme--white` zone always controlled it). | n/a | MATCH |
| Page-body content area, footer, all other regions | none | — | Unchanged. No layout, sizing, spacing, or text regression observed. | n/a | MATCH |

### Root cause (Playwright probe of computed styles, `/articles`)

**Baseline state** (no `:root` block):
- `:root --theme-surface-alt` = `oklch(from #0000d9 0.97 2% h)` — Dripyard's derivation chain from legacy `--primary`.
- `div.region-highlighted.query-container` computed `background: oklch(0.97 0.008 264.051)` — the cool pale-lavender visible in baseline screenshots.

**Branch state** (F's `:root` block active):
- `:root --theme-surface-alt` = `#F5EFE2`.
- `div.region-highlighted.query-container` computed `background: rgb(245, 239, 226)` = `#F5EFE2`.
- `section.page-title` computed `background: rgb(245, 239, 226)` = `#F5EFE2` (was `rgb(245, 239, 226)` already in baseline — but the breadcrumb-band div above it was Dripyard-cool, producing the visible two-tone in baseline that flattens to single-cream in branch).

The `:root` backstop **is** actively feeding into element backgrounds outside `.theme--*` zones — which is exactly what the issue's "Why this matters" section says the cycle is for. The visual delta is real and intentional in effect.

### Desktop (1280px)

- `/` — pixel-identical, MATCH.
- `/articles`, `/contact-us`, `/open-source-projects` — single concentrated red band in the diff PNG, corresponding to the breadcrumb / page-title region. No other deltas.

### Mobile (375px)

- `/` — pixel-identical, MATCH.
- All three other pages — same band-only delta, smaller pixel count because the band is narrower at 375px.

## Design brief compliance

| Token / surface | Brief value | Rendered (branch) | Match |
|---|---|---|---|
| `--theme-surface` at `:root` | `#FFFFFF` (white surface canonical) | `#FFFFFF` | YES |
| `--theme-surface-alt` at `:root` | `#F5EFE2` (cream emphasis) | `#F5EFE2` | YES |
| `--theme-text-color-primary` at `:root` | `#2A2520` (ink) | `#2A2520` | YES |
| `--theme-link-color` at `:root` | `var(--pl-primary)` → `#1893b4` | `#1893b4` | YES |
| Themed-zone overrides (`.theme--white`, `.theme--light`, etc.) | unchanged from Phase 8.7 | unchanged (specificity wins) | YES |
| Page-title / breadcrumb band background (non-home pages, outside `.theme--*` zone) | **brief does not specify** — this surface is not in the design brief's color tokens table | `#F5EFE2` (cream) | UNSPECIFIED — see ADVISORY |

## WCAG 2.2 AA audit

Deferred pending operator resolution of the ADVISORY-HOLD. If the cream-band delta is accepted as intentional, the only contrast item to re-audit is breadcrumb-link text rendered on `#F5EFE2` (Phase 8.7 pre-approved deviation: `#1893b4` on `#F5EFE2` = 3.07:1 for normal body text — already documented and accepted). If the delta is reverted, no WCAG impact.

All other WCAG dimensions (keyboard navigation, focus rings, forced-colors, reduced-motion, 200% zoom, heading hierarchy, alt text, touch targets) are out of scope for this cycle — no DOM, layout, or interactive-element changes were made; only CSS custom-property defaults at `:root`.

## Static preview comparison

N/A for this cycle per the operator's instruction: the comparator is the integration branch baseline (`aa/pl-sprint-4-pre-services-foundation`), not a preview HTML file. Captured and diffed as described above.

## Acceptance criteria status

| AC | Status | Notes |
|---|---|---|
| `:root` block defines every brand token with brand-canonical default | PASS | base.css lines 62–73; 10 tokens declared. |
| `--ink` returns brand ink (not empty) | REFRAMED PASS | Token is conceptual; equivalent `--theme-text-color-primary = #2A2520` at `:root` per T's Playwright probe. |
| `--primary` returns brand teal (not `#0000d9`) | REFRAMED PASS | Dripyard inline style fixes `--primary: #0000d9` (specificity 1,0,0,0). Equivalent `--theme-link-color` resolves to `#1893b4` at `:root`. |
| Visual diff against current live = zero delta on 4 pages | **FAIL (literal)** | 3 of 4 pages show 1.6–5.3% delta in breadcrumb / page-title band. |
| T1 grep confirms `:root` selectors land in served CSS | PASS | T confirmed. |
| No regressions on any themed surface | PASS | Themed surfaces (inside `.theme--*`) override correctly; specificity cascade intact. The visual delta is on surfaces that were *always* outside themed zones — those are not "themed surfaces." |

## Verdict

**ADVISORY-HOLD**

- **Defect:** the runbook's acceptance criteria are internally inconsistent against the actual DOM. AC2/AC3 explicitly require that token resolution at `:root` change from empty/legacy to brand values; AC4 requires zero visual delta on four pages. These cannot both hold because `/articles`, `/contact-us`, and `/open-source-projects` each contain at least one rendered element (`div.region-highlighted`, `section.page-title`) that reads a `--theme-*` token outside any `.theme--*` zone, and that element therefore *must* change color when the `:root` backstop is added.
- **Convention violated:** internal consistency of acceptance criteria within the same runbook cycle. ACs that simultaneously demand "change token resolution outside themed zones" AND "produce zero visual delta" are well-formed only if every rendered element on the audited pages is inside a themed zone — which is empirically false here.
- **Proposed fix (smallest scope):** operator amends the runbook to clarify AC4 reads "no *unintended* visual delta; surfaces outside themed zones may shift from Dripyard's legacy-derived neutrals to brand-canonical values, which is the cycle's intent." With that amendment, S's verdict becomes PASS.
- **Alternative fix (largest scope):** operator confirms AC4 was literal. Then F must scope the `:root` backstop so it does not feed into the breadcrumb / page-title band — see sub-issue recommendation in the HTML report. This largely defeats the cycle's stated purpose, so the operator should pick consciously.
- **Why not REWORK:** F's implementation faithfully matches every other AC and matches the cycle's stated intent (issue §"Why this matters"). The only failure is against a literal reading of AC4 that contradicts AC2/AC3. That's an upstream spec defect, not an F defect.

## Advisory notes

1. The diff-PNG red regions and the Playwright DOM probe both point to the same finite set of elements (`div.region-highlighted.query-container`, `section.page-title`, and likely their inner containers). If the operator selects "accept the delta," these surfaces should be added to the design brief's color tokens table so future cycles know they're brand-cream-by-design rather than accidental.

2. F's interpretation of AC2/AC3 (the `--ink` / `--primary` conceptual reframing) is sound and T verified it. If these AC names persist in future runbooks, the runbook author should update them to literal token names to remove ambiguity.

3. The `--theme-setting-*` inline-style variables on `<html>` (set by Dripyard config) do not contain any `--theme-*` token, so there's no specificity conflict with the new `:root` block. This was confirmed by T1 curl inspection.

4. Home renders pixel-identical because its hero is wrapped in an explicit `.theme--white` zone that owns every surface — there is no element on `/` that reads a `--theme-*` token outside a themed zone. This is the configuration the runbook AC4 implicitly assumed for all four pages; it does not hold for non-home pages.

5. If the operator selects REWORK with Option 2 (wrap the breadcrumb / page-title region in `.theme--white` at the template layer), that's architecturally cleaner long-term but is template work, not base.css work — outside the cycle's stated file-scope and worthy of its own phase.
