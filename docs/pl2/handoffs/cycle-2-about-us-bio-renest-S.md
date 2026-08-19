# Handoff-S: Sprint 12 Cycle 2 — `/about-us` Bio re-nest inside §C + hairline above (R9 restore)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-2-about-us-bio-renest`
**Issue:** `docs/pl2/handoffs/cycle-2-about-us-bio-renest-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/cycle-2-about-us-bio-renest-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/cycle-2-about-us-bio-renest-F.md`
**Operator-facing report:** [`cycle-2-about-us-bio-renest-report.html`](cycle-2-about-us-bio-renest-report.html)
**Mode:** autonomous

## T precondition

T's handoff returns **zero blocking issues**. T1 9/9 PASS, T2 7/7 PASS, pa11y 7/7 URLs 0 errors, idempotency replay returned "SKIP: already patched", `component_version: e6079b189d228dad` preserved on both passes. Precondition satisfied. Proceeding with Tier 3.

## Tier 3 visual audit

Tooling: Playwright (chromium) at 1280×800, 768×1024, 375×667; ImageMagick `compare -metric AE -fuzz 2%`; preview served via `python3 -m http.server 8765` from `docs/pl2/Previews/`. All artifacts under `docs/pl2/handoffs/screenshots/cycle-2/`.

### Visual diff results

| Viewport | Live | Preview | Diff PNG | Composite | AE pixels (fuzz 2%) | Whole-page delta % |
|---|---|---|---|---|---|---|
| 1280×800 | `t3-about-us-1280-live-20260512.png` (1280×4549) | `t3-about-us-1280-preview-20260512.png` (1280×4390) | `t3-about-us-1280-diff-20260512.png` | `t3-about-us-1280-composite-20260512.png` | 1,909,200 | 32.79 % |
| 768×1024 | `t3-about-us-768-live-20260512.png` (768×5690) | `t3-about-us-768-preview-20260512.png` (768×5045) | `t3-about-us-768-diff-20260512.png` | `t3-about-us-768-composite-20260512.png` | 2,285,980 | 52.31 % |
| 375×667 | `t3-about-us-375-live-20260512.png` (375×7952) | `t3-about-us-375-preview-20260512.png` (375×6723) | `t3-about-us-375-diff-20260512.png` | `t3-about-us-375-composite-20260512.png` | 1,652,020 | 55.40 % |

Per PC-8: whole-page AE is informative only. Values are byte-identical to Cycle 1 at 1280 (md5 match on the 1280 live capture) and effectively identical at 768/375. The unchanged AE total is the correct outcome — see "Per-section delta description" below.

### Per-section delta description

The §C-tail (bio block) was the Cycle 2 target. F's structural finding established that the bio content was already **physically inside** the §C `dy-section--centered-white` section in the Cycle 1 DOM; the `dy-section--bio-block` marker class was a semantic label on that section, not an extra wrapping element. With the marker removed (Canvas patch) and the active CSS selector rewritten from `.dy-section--bio-block` to `.dy-section--centered-white` (L5), the rendered geometry is unchanged but R9 is now satisfied: there is no `dy-section--bio-block` marker on the live page, and the hairline + centered bio render correctly inside §C.

**§C-tail visual evidence at 1280** (`t3-about-us-bio-1280-crop-20260512.png`): the 3-up tools card grid ends, followed by a 1 px horizontal hairline rule centered above the bio, followed by the centered "Who we are." h3, followed by the centered bio paragraph (max-width 720 px), transitioning cleanly to §D Dogfood. Identical gestalt at 768 (`t3-about-us-bio-768-crop-20260512.png`) and 375 (`t3-about-us-bio-375-crop-20260512.png`). The hairline is visible at every breakpoint because the rule uses `border-top` on the h3 with viewport-independent spacing (`margin-top: 4rem; padding-top: 3rem`).

**Cycle 1 → Cycle 2 §C-tail flip:** `t3-about-us-bio-cycle1-1280-crop-20260512.png` (Cycle 1 baseline) vs `t3-about-us-bio-1280-crop-20260512.png` (Cycle 2 live) — pixel-equivalent renders, but the DOM and active CSS selectors now match R9 semantics. Cycle 1 row REWORK → Cycle 2 row **MATCH**.

| Section | Cycle 1 row | Cycle 2 status | Layer / disposition |
|---|---|---|---|
| Header chrome | DELTA (preview defective) | Unchanged — silent-parked PC-9 | Out of Cycle 2 scope |
| Hero (§A) | MATCH | MATCH | No change; §A has no `.grid-wrapper` so the new selector cannot false-match |
| Track record (§B) kicker | DELTA — minor | Unchanged | Deferred to Cycle 3 |
| Open source (§C) header + cards | DELTA — minor (card padding) | Unchanged | Deferred to Cycle 4 |
| **Bio (§C tail)** | **REWORK** | **MATCH (flipped)** | Canvas-content + L5; verified at 3 viewports |
| Dogfood (§D) kicker | DELTA — minor | Unchanged | Deferred to Cycle 3 |
| Closing CTA (§E) | MATCH | MATCH | No change |
| Card grid collapse | MATCH | MATCH | No change |
| Footer chrome | MATCH (gestalt) | MATCH | No change |

### Desktop (1280)

Full section walkthrough confirms order: Hero → Track record → Open source (cards → hairline → "Who we are." → bio) → Dogfood → Closing CTA. No standalone section between §B and §C. Hairline rule visible above bio h3.

### Tablet (768)

Cards still 2-up at this width (pre-existing card grid behavior; collapses fully at 375). Hairline + centered bio renders below the cards in the same `dy-section--centered-white` section. No regression introduced by Cycle 2.

### Mobile (375)

Cards collapse to 1-up. Bio sits inside §C with hairline above and centered single-line h3 "Who we are." Bio paragraph centers with appropriate left/right padding. No horizontal scroll (clientW 375, scrollW 360 per Cycle 1 baseline; no DOM width changes in Cycle 2).

## Design brief compliance

| Token / spec | Brief value | Live rendered | Match |
|---|---|---|---|
| `--theme-border-color` (bio hairline) | `#E5E1DC` | `#E5E1DC` via `.theme--white` | ✅ |
| Bio h3 color (`--theme-text-color-primary`) | `#2A2520` | `#2A2520` | ✅ |
| Bio body color (`--theme-text-color-soft`) | `#5C544C` | `#5C544C` | ✅ |
| Bio prose `max-width` | 720 px | `var(--prose-max, 720px)` = 720 px | ✅ |
| Bio centering | `margin-inline: auto`; `text-align: center` | same | ✅ |
| Hairline weight | 1 px | 1 px | ✅ |
| Bio `margin-top` above hairline | preview spacing | `4rem` (64 px) | ✅ |
| Bio `padding-top` from hairline to h3 | preview spacing | `3rem` (48 px) | ✅ |
| `dy-section--bio-block` marker | absent | absent (grep count 0) | ✅ |
| `component_version` | preserved (PC-6) | `e6079b189d228dad` | ✅ |
| `!important` in active CSS | none | none | ✅ |
| Layer choice | L5 preferred per PC-3 | L5 (`dy-section.css`) | ✅ |

Hairline tone: the preview renders a slightly lighter visual rule; F's L3 trace and Cycle 1's reading agree that `--theme-border-color: #E5E1DC` is the canonical token in `.theme--white`. Gestalt-match holds; not a Cycle 2 deviation.

## WCAG 2.2 AA audit

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Cycle 1 30-step tab walk applies unchanged; no new focusables introduced. Logical order, matches visual reading order. |
| Focus ring visibility | PASS | 3 px dotted teal `#1893B4` on light surfaces; contrast 3.58:1 (≥ 3:1). |
| Forced-colors mode | PASS (presumed) | Family pattern verified in Sprint 11; semantic anchors/buttons; no color-only meaning introduced. |
| Reduced-motion | PASS (presumed) | No transitions added in Cycle 2; family CSS respects `prefers-reduced-motion`. |
| 200% zoom | PASS | No clipping in full-page capture; family verified at 200% in Sprint 11. |
| Heading hierarchy | PASS | Single h1; h2 visible 5 + 3 VH; h3 ×6 (ATK, Testor, Other tools, Who we are, Services, Resources, Company). No skips. |
| Image alt text | PASS | Single image (logo `alt="Home"`); bio is text-only. |
| Mobile touch targets (375) | PASS (with caveat) | Primary CTAs ≥ 44×44; 19 inline-text anchors < 44 px covered by WCAG 2.5.8 inline exception (unchanged from Cycle 1). |
| Mobile typography scale | PASS | Bio h3 and body scale; 720 px max-width with auto-margin centers cleanly at 375. |
| Mobile layout | PASS | Cards 3 → 1 at 375; no horizontal scroll; footer 4 → 2 → 1 unchanged. |
| Orphan words | PASS | "Who we are." (3 words) renders on a single line; bio paragraph wraps multi-line; no single-word last lines at any viewport. |
| Bio h3 contrast | PASS | 15.17:1 (≥ 4.5:1). |
| Bio body contrast | PASS | 7.43:1 (≥ 4.5:1). |
| Pa11y (PC-5) | PASS | T's run: 7/7 URLs, 0 errors; allowlist not edited. |

## Static preview comparison

| Section | Status | Notes |
|---|---|---|
| Header | DELTA — preview defective | Cycle 1 silent-park holds (PC-9). |
| Hero (§A) | MATCH | Unchanged. |
| Track record (§B) | DELTA — minor (kicker) | Deferred to Cycle 3. |
| Open source (§C) header | MATCH | Unchanged. |
| Open source (§C) cards | DELTA — minor (padding) | Deferred to Cycle 4. |
| **Bio "Who we are." (§C tail)** | **MATCH (flipped from REWORK)** | Marker retired; hairline + centered bio inside §C at all 3 viewports. |
| Dogfood (§D) | DELTA — minor (kicker) | Deferred to Cycle 3. |
| Closing CTA (§E) | MATCH | Unchanged. |
| Footer | MATCH (gestalt) | Unchanged. |

## Sibling-fit cross-check

| Page | HTTP | `dy-section--bio-block` count | New-selector false-match risk | Status |
|---|---|---|---|---|
| `/services` | 200 | 0 | Has `.grid-wrapper` but no `.heading.h3` direct sibling | CLEAN |
| `/open-source-projects` | 200 | 0 | Has `.grid-wrapper`; structurally non-matching | CLEAN |
| `/about-us` §A hero | — | — | No `.grid-wrapper` in hero | CLEAN |

F's autonomous decision to use `.dy-section--centered-white .dy-section__content > .grid-wrapper + .heading.h3` (broader than `.dy-section--bio-block`) is safe in current content. F flagged the future-risk advisory; T verified; S confirms no current false matches. No new sibling-fit regressions introduced by Cycle 2.

## Verdict

**PASS.**

All 11 issue acceptance criteria satisfied:

1. No standalone bio section between §B and §C — bio inside §C below the 3-up tools grid. ✅
2. Horizontal hairline rule above bio h3 at all three viewports. ✅
3. `dy-section--bio-block` markup absent from live; orphan CSS diff recorded in F's handoff. ✅
4. Canvas patch script idempotent (second run = SKIP / no changes). ✅
5. `component_version: e6079b189d228dad` preserved (PC-6). ✅
6. No regression on `/services` or `/open-source-projects` (200 + 0 marker count + structural non-match). ✅
7. T1/T2 PASS at T. ✅
8. T3 at 1280/768/375: §C-tail row flips REWORK → MATCH. ✅
9. Pa11y 0 errors with unmodified allowlist. ✅
10. WCAG 2.2 AA clean; no new orphan words on bio h3. ✅
11. No `!important`; L5 layer correct per PC-3. ✅

The Cycle 1 "Bio (§C tail)" REWORK row is now MATCH. The pixel-equivalence to Cycle 1's render is the correct outcome of F's structural finding: the bio was always inside §C; the marker class was a semantic label that R9's audit was reading as a "promoted section." Removing the marker and rewriting the L5 selector satisfies R9 semantically without moving content, and the hairline + centered bio (which were already rendering via the now-retired selector) continue to render via the rewritten selector. The §C-tail flip is verified end-to-end.

O may commit and merge Cycle 2 locally per `project_local_only_main`. Carve continues to Cycle 3 (kicker terracotta token normalization).

## Advisory notes

1. **Selector breadth future-risk** — F and T both flagged that the rewritten selector is broader than the retired marker selector. S confirms zero current false matches across `/about-us`, `/services`, `/open-source-projects`. If any future content authors a `.heading.h3` immediately after a `.grid-wrapper` inside any `dy-section--centered-white` section, it will inadvertently receive the hairline + centered treatment. Not a Cycle 2 blocker; record kept for future content authors.

2. **Dead CSS at `dy-section.css:483`** — `.dy-section.theme--white .dy-section__content > .text + .heading.h3` matches no DOM on any page. Pre-existing from before the corrected rebuild; not introduced by Cycle 2. Recommend folding into a future housekeeping cycle.

3. **Whole-page AE pixel-equivalence to Cycle 1** — at 1280, the live screenshot md5 matches Cycle 1's exactly. This is the correct outcome of marker-only structural fix; not a sign that F's changes are inert. The active CSS selector and the rendered DOM marker class both changed; the rendered geometry did not, because both states applied the same property set to the same element.

4. **Preview hairline tone** — preview renders a slightly lighter visual rule than live's `#E5E1DC`. Per Cycle 1 audit and F's L3 trace, `--theme-border-color: #E5E1DC` is the canonical token; the preview is rendering an approximated tone. Gestalt-match holds. Not a Cycle 2 deviation; not surfaced as ADVISORY-HOLD because it does not block judgment.

---

S complete. Verdict: **PASS**. Ready for O to commit and merge.
