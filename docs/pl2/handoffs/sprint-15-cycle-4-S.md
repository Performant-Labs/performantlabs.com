# Handoff-S: Sprint 15 Cycle 4 — Preview mobile H2 letter-spacing sweep

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-4-preview-letter-spacing-sweep`
**Issue:** `docs/pl2/handoffs/sprint-15-cycle-4-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-15-cycle-4-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-15-cycle-4-F.md`
**Operator-facing report:** [`sprint-15-cycle-4-report.html`](sprint-15-cycle-4-report.html)

## T precondition

Confirmed. T reported zero blocking issues (handoff-T §"Blocking issues": "None"). All T1 and T2 checks PASS.

## Scope note

This is a scoped re-audit of a mechanical preview-doc sweep (Cycle 3 Advisory 1). Five preview HTML files each received a single-character letter-spacing value swap (`-0.6px → -0.8px`) on the mobile (`@media (max-width: 767px)`) `.section-head h2` (or equivalent `display-md` mobile heading) selector. Checklist below is the scoped subset; full enumeration of S checks is documented in Cycle 1 handoff `docs/pl2/handoffs/sprint-15-cycle-1-S.md`.

## Tier 3 visual audit

### Diff sanity (re-confirmed at a glance)

`git diff HEAD -- 'docs/pl2/Previews/*.html'` shows exactly 5 hunks, each a single line `-` / `+` pair changing `-0.6px` to `-0.8px` on the `letter-spacing` property. Stat: `5 files changed, 5 insertions(+), 5 deletions(-)`. Matches F's reported scope and T's T2-C verification. No selector changes, no `!important`, no structural changes.

### Render sample — `homepage.html` (representative)

Rendered via Playwright (`scripts/sprint-15-cycle-4-render.mjs`), full-page screenshots and computed-style readback on first `.section-head h2`:

| Viewport | font-size | letter-spacing | Brief expectation | Match |
|---|---|---|---|---|
| 375 (mobile, post-fix) | 32px | **-0.8px** | -0.8px (display-md mobile) | YES |
| 375 (mobile, pre-fix sanity) | 32px | -0.6px | n/a (baseline) | n/a |
| 1280 (desktop) | 40px | -1px | unchanged | YES |

Computed letter-spacing of `-0.8px` at 375 confirms the sweep landed. Desktop `-1px` confirms no regression to non-mobile contexts.

### Pixel diff (Playwright + ImageMagick AE)

| Viewport | Pixels diff | Whole-page delta % | Verdict |
|---|---|---|---|
| 375 (375×6163 full-page) | 10,149 | 0.44% | MATCH — sub-perceptual letter-spacing tightening on H2s |
| 1280 (1280×800)           | 0      | 0.00% | MATCH — desktop unaffected |

Both viewports fall well below the 2% threshold for "presumed MATCH." The mobile diff red regions in `homepage-375-diff-20260513.png` are concentrated around H2 glyph edges, consistent with a 0.2 px tightening rasterized across multiple section headings. No unexpected red regions elsewhere.

Artifacts:
- `docs/pl2/handoffs/screenshots/sprint-15-cycle-4/homepage-375-pre-20260513.png`
- `docs/pl2/handoffs/screenshots/sprint-15-cycle-4/homepage-375-post-20260513.png`
- `docs/pl2/handoffs/screenshots/sprint-15-cycle-4/homepage-375-diff-20260513.png`
- `docs/pl2/handoffs/screenshots/sprint-15-cycle-4/homepage-1280-pre-20260513.png`
- `docs/pl2/handoffs/screenshots/sprint-15-cycle-4/homepage-1280-post-20260513.png`
- `docs/pl2/handoffs/screenshots/sprint-15-cycle-4/homepage-1280-diff-20260513.png`

### Sample coverage rationale

The change is mechanically uniform across 5 files (identical value swap, identical surrounding context). Rendering one representative preview is sufficient because T already grep-verified all 5 files post-fix have `-0.8px` on the mobile `.section-head h2` selector inside an `@media (max-width: 767px)` block (handoff-T §T1-B). The other 4 files differ from `homepage.html` only in which additional sibling selectors share the rule (e.g. `services.html` adds `.nearshore h2`); these are static text content variations, not cascade variations.

## Design brief compliance

| Token | Brief value (`display-md` mobile) | Rendered value (375) | Match |
|---|---|---|---|
| Mobile H2 letter-spacing | -0.8px | -0.8px | YES |
| Mobile H2 font-size (homepage) | 32px | 32px | YES |
| Desktop H2 letter-spacing | unchanged | -1px (no regression) | YES |

## WCAG 2.2 AA audit (scoped)

| Check | Result | Notes |
|---|---|---|
| Color contrast | N/A | No color change |
| Keyboard navigation | N/A | No interactive element change |
| Focus ring visibility | N/A | No interactive element change |
| Forced-colors mode | N/A | No color change |
| Reduced-motion | N/A | No animation/transition change |
| 200% zoom | N/A | Letter-spacing is a relative typographic property; no clipping risk introduced |
| Heading hierarchy | N/A | No structural change |
| Image alt text | N/A | No image change |
| Mobile touch targets | N/A | No interactive element change |
| Mobile typography scale | PASS | Aligns mobile H2 with brief `display-md` mobile letter-spacing -0.8px |
| Mobile layout | PASS | Same media query, no breakpoint or layout change |

No WCAG implications. Letter-spacing tightening of 0.2 px does not affect contrast, target size, or readability thresholds.

## Static preview comparison

All 5 preview files are themselves the artifacts under change. The reference state is "what `how-we-do-it.html` was set to in Cycle 3" (`-0.8px` on mobile `display-md` H2). T2-C and T1-B confirm all 5 now match that reference. MATCH.

## Verdict

**PASS** — all acceptance criteria met. Mobile H2 letter-spacing on 5 preview files aligns with the brief's `display-md` mobile value (`-0.8px`), matching the Cycle 3 precedent on `how-we-do-it.html`. No desktop regression. No WCAG implications. Ready for O to commit and merge.

## Advisory notes

1. `open-source-projects.html` line 387 retains `letter-spacing: -0.6px` on the unconditional desktop `.other-modules h2` rule. This is correctly out of scope for this cycle (it is not a `display-md` mobile heading). No action required unless a future cycle audits the `.other-modules h2` token explicitly against the brief.
2. `homepage.html` mobile selector chain (`.section-head h2, .built-for h2, .faq h2`) is broader than the other 4 files — this reflects Sprint 13 canonicalization of multiple H2-bearing sections sharing the same rule. The single-line change correctly updates all three selectors atomically. Verified intentional and consistent with file's pre-existing structure.
