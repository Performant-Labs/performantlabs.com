# Handoff-F: px→rem conversion + base font-size 15% bump

**Date:** 2026-07-22
**Branch:** `feat/base-font-size-15pct`
**Issue prefix:** `[rem-refactor]`

## Confirmation table

| Field | Value |
|---|---|
| Page/scope | Site-wide typography (`performant_labs_v2` subtheme CSS only) |
| GitHub issue number | N/A — spawned directly by O with a task brief, no numbered issue in this thread |
| Working branch | `feat/base-font-size-15pct` (existed locally off `main`, zero commits — reused, two commits added) |
| Runbook phase | Follow-up to the font-size single-place audit (`docs/pl2/handoffs/font-size/handoff-F.md`) |
| Input documents read | `docs/pl2/handoffs/font-size/handoff-F.md` (prior diagnosis), `~/Projects/playbook/pipelines/website-frontend/adapters/drupal-canvas-sdc.md`, `docs/pl2/frontend-pipeline-profile.md`, `docs/pl2/theme-change--workflow.md` (7-step), `web/themes/dripyard_themes/dripyard_base/css/base/base.css` (parent anchor) |
| Acceptance criteria count | 6 numbered work items across Phase 1 (steps 1–3) and Phase 2 (steps 4–6) in the task brief |
| Handoff document path | `docs/pl2/handoffs/rem-refactor/handoff-F.md` (this file) |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` (7-step) |
| Component schema source of truth | N/A this cycle — pure token/typography-value change, no component prop/slot referenced |

## What was done

**Phase 1 — px→rem conversion (14 files, 83 declarations):**
- `web/themes/custom/performant_labs_v2/components/article-card/article-card.css` — 7 px `font-size` → rem
- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.css` — 3 → rem
- `web/themes/custom/performant_labs_v2/components/chapter-index/css/chapter-index.css` — 7 → rem
- `web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.css` — 1 → rem (0.78125rem, see precision note below)
- `web/themes/custom/performant_labs_v2/components/kicker/kicker.css` — 1 → rem
- `web/themes/custom/performant_labs_v2/css/components/article-full.css` — 10 → rem (includes the main article-body prose selector)
- `web/themes/custom/performant_labs_v2/css/components/articles-view.css` — 4 → rem
- `web/themes/custom/performant_labs_v2/css/components/book-landing.css` — 18 → rem
- `web/themes/custom/performant_labs_v2/css/components/button.css` — 1 → rem (`--button-font-size`)
- `web/themes/custom/performant_labs_v2/css/components/docs-page.css` — 20 → rem
- `web/themes/custom/performant_labs_v2/css/components/header-article.css` — 3 → rem
- `web/themes/custom/performant_labs_v2/css/components/header.css` — 3 → rem (includes `--top-level-link-font-size`)
- `web/themes/custom/performant_labs_v2/css/components/hero.css` — 2 → rem
- `web/themes/custom/performant_labs_v2/css/components/page-title.css` — 3 → rem

**Phase 2 — the bump:**
- `web/themes/custom/performant_labs_v2/css/base.css` — added `html { font-size: 115%; }` (line 20) with a dated comment.

**Verification artifacts (not committed to git — read for evidence, referenced below):**
- 24 baseline screenshots (`*-before.png`), 24 post-Phase-1 screenshots (`*-after-phase1.png`), 24 post-Phase-2 screenshots (`*-after-phase2.png`) in `docs/pl2/handoffs/rem-refactor/shots/` (8 pages × 3 viewports × 3 stages).

## Layer decisions

**Phase 1 (px→rem conversion) — mechanical, no layer question.** Each declaration was converted in place (`Npx` → `(N/16)rem`), same file, same selector, same specificity. No layer change — this only changes the *unit*, not where the rule lives.

**Phase 2 (the bump) — trace worksheet:**

```
Pass 1 — bottom-up:
Property:      font-size on <html> (root)
Traces to:     dripyard_base/css/base/base.css:24  html { font-size: 100%; }
Downstream:    every --h1-size … --body-s-size / --title-size token
               (neonbyte/css/_variables/variables-typography.css) is rem-based
               and rooted at this value; after Phase 1, every component-local
               font-size in performant_labs_v2 is rem-based too.

Pass 2 — top-down eligibility:
Layer 1 (config):     No config key controls root font-size. RULED OUT.
Layer 2 (OKLCH):       N/A — not a color token. RULED OUT.
Layer 3 (theme token): html { font-size } override in the CHILD theme's own
                       css/base.css. CORRECT LAYER — this is exactly the
                       "single place" the brief asks for: one line, at the
                       subtheme's own base layer, that the parent's 100%
                       anchor cascades from. No `.theme--*` zone wrapper
                       needed since root font-size is not zone-specific
                       (it's a document-root property, unlike --theme-*
                       color tokens which are zone-scoped by design).
Layer 5 (component):  N/A — a root font-size change is definitionally not
                       component-scoped.
Layer 4 (rendered):   Never patched directly — not applicable here.

→ Chosen: Layer 3, `html { font-size: 115%; }` in
  performant_labs_v2/css/base.css:20, unscoped (no `.theme--*` wrapper).
```

**Component reuse check (Step 0):** N/A both phases — no new component was created or considered; this is a pure CSS-value/token change across existing component stylesheets.

## Architecture notes for A

- **Two commits, cleanly separated** per the brief: `002891f098` (px→rem conversion, 83 lines across 14 files) and `9320eba8b1` (the one-line 15% bump). Reviewing the second commit in isolation shows exactly one file, one rule, 11 lines (10 comment + 1 rule) changed.
- **No `!important` anywhere in either commit.** No selector specificity changes — Phase 1 preserves every existing selector, property name, and declaration order; only the value's unit changed.
- **Precision note (the one non-mechanical judgment call):** the conversion script's initial run produced `font-size: 0.7812rem` for a `12.5px` source value in `code-snippet.css`. `0.7812 × 16 = 12.4992px`, a sub-pixel rounding drift that the no-op measurement (see below) caught immediately. Fixed to the exact value `0.78125rem` (12.5/16 = 0.78125 exactly, terminates at 5 decimal places). No other conversion in the 83 needed this — a defensive sweep confirmed all other 82 values round-trip to their exact original px value at their emitted precision (checked programmatically, zero further issues).
- **No Canvas `component_version` handling in this cycle** — no `.component.yml` referenced, no Canvas assembly script touched, no `inputs`/`additional_classes` patched. This is pure CSS-file editing.
- **Cross-component effect (the intended one):** every component whose font-size previously bypassed the rem token scale (article body prose, docs-page, book-landing, card labels, header nav text, buttons, pills, code snippets) now scales uniformly with the root. This was the explicit goal — a "single place" that previously covered only 30% of the theme's typography now covers all of it.
- **No new dependencies introduced.**

## Deviations from spec

None on the substance of the two-phase plan. One conservative interpretation applied: the brief said "Skip any font-size inside @media print blocks only if conversion would change meaning (it won't — convert those too)" — no `@media print` blocks with font-size declarations were found in the scanned files, so this clause was moot in practice, not skipped.

One count correction, recorded for accuracy rather than as a deviation: the prior handoff's file-by-file breakdown was stale (it counted 83 across 14 files using a slightly different filter). Re-deriving independently (per the brief's explicit instruction not to trust the stale count) found the same total, 83 real declarations across the same 14 files, once comment-only `font-size:` mentions (in `header.css`, `hero.css`, `dy-section.css`, `card.css`) were excluded from the raw grep. `dy-section.css` and `card.css` had zero real declarations (comment-only) and were correctly excluded from the edit set.

## Verification results (T1 + T2)

**T1 — cache clear + live CSS confirmation:**
```
$ ddev drush cr
[success] Cache rebuild complete.

$ curl -sk https://performant-labs.ddev.site:8493/themes/custom/performant_labs_v2/css/base.css | grep -A2 "^html {"
html {
  font-size: 115%;
}
```

**T1/T2 — the no-op proof (Phase 1), the critical check:**

Measured computed `font-size`/`line-height` via headless Playwright on h1/h2/h3/body-p/article-body-prose/button/nav-link/card-title/pill/code-snippet/footer-text/docs-page/book-landing across 8 pages (`/`, `/aftersight`, `/services`, `/how-we-do-it`, `/open-source-projects`, an article page, a book-landing page `/layout-builder-kit`, and a docs/book-chapter page `/layout-builder-kit/introduction` — added the last two beyond the brief's list specifically to exercise `book-landing.css` and `docs-page.css`, the two highest-px-count files).

- Before conversion vs. after conversion (cache cleared between): **byte-identical** on every measured value across all 8 pages, after fixing the one rounding artifact (see Architecture notes). Confirmed programmatically (`python3` dict-diff over the two JSON captures) → `IDENTICAL — no-op proof PASSES across all measured elements/pages`.
- 3-viewport (360/768/1280) full-page screenshots, before vs. after conversion: **pixel-identical** on all 24 (`PIL.ImageChops.difference` bbox = `None` for all 24 pairs) → `ALL IDENTICAL`.

**T1/T2 — the bump verification (Phase 2):**

- Re-measured the same 313 font-size data points post-bump vs. post-conversion: **every value scaled by exactly 1.15×** (checked within 0.05px rounding tolerance, 0 mismatches out of 313).
- Blast-radius / structural check (custom Playwright script) across all 8 pages × 3 viewports:
  - Horizontal overflow (`scrollWidth > innerWidth`): **0 instances** on any page/viewport.
  - Desktop nav (≥992px): hamburger correctly hidden on all 8 pages at 1280.
  - Mobile nav (<992px): hamburger correctly visible on all 8 pages at 360/768.
  - Card/code-snippet/pill clipping (`overflow:hidden` + `scrollHeight > clientHeight`): **0 instances**.
  - Touch targets <44×44 CSS px at 360: 2 found, both on non-interactive `.pill` badges (see Known issues — not a regression, pre-existing, out of WCAG touch-target scope).
- Visual spot-check (read a sample of the after-phase2 screenshots at 360/1280 for home, article, book-landing, docs-page): nav intact, CTAs full-width and legible at 360, cards un-clipped, code-snippet block renders cleanly, footer columns intact.

No T2 ARIA-tree check applies beyond the nav-visibility DOM check above — no heading hierarchy or ARIA attributes were touched by either commit (values-only change).

## WCAG contrast ratios

A font-size change cannot alter color/background tokens, so no ratio changes are expected; verified numerically anyway per the brief's instruction to spot-check 3 pairings:

| Element | Foreground | Background | Ratio | Pass/fail |
|---|---|---|---|---|
| Code-snippet link text (black-zone) | `#5DC6E8` | `#0E1014` | 9.71:1 | Pass (AAA) — unchanged |
| Pill text (white hero) | `#8E4A2A` | `#FFFFFF` | 6.64:1 | Pass (AAA) — unchanged |
| Accent-deep on cream baseline | `#8E4A2A` | `#F5EFE2` | 5.79:1 | Pass (AA/AAA large+body) — unchanged |

All three recomputed independently via the WCAG relative-luminance formula (not just re-cited from code comments) — values match the documented figures exactly, confirming no regression.

## Mobile responsive behavior

- **What changes:** every font-size in the theme (base tokens + the 83 now-converted component declarations) scales by 1.15× uniformly at every breakpoint, because the bump lives at the `html` root and every downstream value is `rem`-relative. This includes the subtheme's existing mobile-typography `@media (max-width: 576px)` block in `css/base.css` (lines ~248–261 post-insert), which was already rem-based before this cycle and required no separate edit — it inherits the root scale automatically.
- **At which breakpoint:** applies uniformly at all breakpoints (360/768/1280 all verified) — this is a root-level change, not a breakpoint-specific one.
- **How verified:** 3-viewport screenshot set (360/768/1280) for all 8 pages, before/after Phase 2; blast-check script confirmed no horizontal overflow, correct nav breakpoint behavior, and no clipping at any of the three viewports; touch-target check run specifically at 360.

## Autonomous decisions

- **Re-derived the file/count list independently rather than trusting the prior handoff's numbers**, per the brief's explicit instruction ("re-derive your own list, don't trust stale"). Found 89 raw `font-size:...px` grep matches but only 83 were real declarations (6 were inside comments in `header.css`, `hero.css`, `dy-section.css`, `card.css`) — used the real count, matching the prior handoff's total by coincidence but arrived at independently.
- **Fixed a sub-pixel rounding artifact in the mechanical conversion** (`12.5px → 0.7812rem` rounds to `12.4992px`, not exactly `12.5px`) by using the exact terminating decimal (`0.78125rem`) instead of accepting a 4-decimal truncation. This was caught by the no-op proof itself (the whole point of running it before proceeding) and fixed before Phase 1 was considered done, per the brief's "any delta = a conversion error; fix before proceeding" instruction.
- **Chose 2 additional pages beyond the brief's explicit 6-page list** (`/layout-builder-kit` and `/layout-builder-kit/introduction`) to directly exercise `book-landing.css` and `docs-page.css` — the two files with the most px declarations (18 and 20 respectively) — since none of the brief's 6 listed pages render those templates. This is an additive, more-conservative choice (more coverage, not less) and required no interpretation call against the brief.
- **Did not flag the `.pill` touch-target finding as a blocking issue** — determined it is a non-interactive `<div>` (dripyard_base's `pill` component, no click handler/role/href) and therefore out of WCAG 2.5.5's touch-target scope, and confirmed it was already below 44px before the bump (pre-existing, not a regression). Recorded as a known issue rather than silently dropped or over-escalated.

## Known issues

- **`.pill` badges below 44×44 CSS px at 360 viewport** (`home` page: 26px and 25px tall; `article` page: 44px tall × 97px wide, borderline). These are non-interactive `<div class="pill">` elements (dripyard_base component, no link/button semantics) rendering informational badges ("Now in development", "MIT licensed", category tag) — not touch targets under WCAG 2.5.5, which applies to interactive controls. Pre-existing before this cycle (heights were already below 44px pre-bump: 22.6px/38.3px), unrelated to the font-size change itself (a padding/line-height sizing choice in `hero.css`/`article-card.css`'s pill overrides). Not fixed in this cycle — out of scope for a font-size-only change, and fixing it would mean touching padding/line-height in files this cycle is not authorized to alter for that purpose. Flagging for a follow-up if André wants pills brought inside the touch-target guideline defensively despite being non-interactive.
- No other known issues. All acceptance criteria for both phases were met.

## Files changed

**Phase 1 commit (`002891f098`):**
- `web/themes/custom/performant_labs_v2/components/article-card/article-card.css`
- `web/themes/custom/performant_labs_v2/components/browser-chrome/browser-chrome.css`
- `web/themes/custom/performant_labs_v2/components/chapter-index/css/chapter-index.css`
- `web/themes/custom/performant_labs_v2/components/code-snippet/code-snippet.css`
- `web/themes/custom/performant_labs_v2/components/kicker/kicker.css`
- `web/themes/custom/performant_labs_v2/css/components/article-full.css`
- `web/themes/custom/performant_labs_v2/css/components/articles-view.css`
- `web/themes/custom/performant_labs_v2/css/components/book-landing.css`
- `web/themes/custom/performant_labs_v2/css/components/button.css`
- `web/themes/custom/performant_labs_v2/css/components/docs-page.css`
- `web/themes/custom/performant_labs_v2/css/components/header-article.css`
- `web/themes/custom/performant_labs_v2/css/components/header.css`
- `web/themes/custom/performant_labs_v2/css/components/hero.css`
- `web/themes/custom/performant_labs_v2/css/components/page-title.css`

**Phase 2 commit (`9320eba8b1`):**
- `web/themes/custom/performant_labs_v2/css/base.css`

**Handoff/evidence (this cycle, not part of either code commit — untracked, left in working tree for O/André to inspect or add):**
- `docs/pl2/handoffs/rem-refactor/handoff-F.md` (this file)
- `docs/pl2/handoffs/rem-refactor/shots/*.png` (72 screenshots: 24 before / 24 after-phase1 / 24 after-phase2, across 8 pages × 3 viewports)
