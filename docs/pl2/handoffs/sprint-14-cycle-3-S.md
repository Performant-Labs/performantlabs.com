# Handoff-S: Sprint 14 Cycle 3 — /about-us mobile display-xl raise (F-NEW-2)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-14-cycle-3-mobile-display-xl-token`
**Issue:** `docs/pl2/handoffs/sprint-14-cycle-3-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-14-cycle-3-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-14-cycle-3-F.md`
**Operator-facing report:** [`sprint-14-cycle-3-report.html`](sprint-14-cycle-3-report.html)

## T precondition

T reported one procedural blocker (`scripts/sprint14-cycle3-about-us-landing-hero.php` untracked). The orchestrator (O) confirms the script is on disk and will be staged + committed at the gate; T verified its behavior including idempotency. **Treated as resolved** — proceeding with S audit.

## Preconditions (S)

- Playwright present at `node_modules/playwright` (installed). OK.
- ImageMagick `compare`/`magick` on PATH at `/opt/homebrew/bin`. OK.
- Live site reachable: `curl -sk https://pl-performantlabs.com.3.ddev.site:8493/about-us` returned 200. OK.
- Cycle 1 baseline captures present at `docs/pl2/handoffs/screenshots/sprint-14-cycle-1/`. OK.

## Tier 3 visual audit

### Captures produced (Cycle 3)

| Capture | Path |
|---|---|
| /about-us 1280 live (full page) | `docs/pl2/handoffs/screenshots/sprint-14-cycle-3/t3-about-us-1280-live-20260513.png` |
| /about-us 1280 preview (full page) | `docs/pl2/handoffs/screenshots/sprint-14-cycle-3/t3-about-us-1280-preview-20260513.png` |
| /about-us 375 live (full page) | `docs/pl2/handoffs/screenshots/sprint-14-cycle-3/t3-about-us-375-live-20260513.png` |
| /about-us 375 preview (full page) | `docs/pl2/handoffs/screenshots/sprint-14-cycle-3/t3-about-us-375-preview-20260513.png` |
| /about-us 375 hero pre-fix (Cycle 1 baseline, copied) | `t3-about-us-375-hero-prefix-cycle1.png` |
| /about-us 375 hero post-fix (this cycle) | `t3-about-us-375-hero-postfix-padded.png` |
| /about-us 375 hero composite (live ‖ preview) | `t3-about-us-375-hero-composite.png` |
| /about-us 375 hero pre-vs-post diff PNG | `t3-about-us-375-hero-prefix-vs-postfix-diff.png` |
| Cross-page 375 hero crops (5 pages) | `t3-{home,services,how-we-do-it,opensource,about-us}-375-hero-live-crop-20260513.png` |
| Cross-page measurements (computed styles + CTA rects + scroll) | `measurements.json` |
| Cross-page H1 wrap (line-by-line word grouping) | `orphan-lines.json` |
| Cross-page hero composite (4-up) | `cross-page-375-heroes-composite.png` |

### /about-us pre-fix vs post-fix (mobile 375)

| Metric | Value |
|---|---|
| DSSIM (Cycle 1 baseline live vs Cycle 3 post-fix live, hero crop) | 0.231 |
| Interpretation | Intentional, substantial change — H1 raised 36 → 44 px shifts everything below by ~8 px. Cycle 1 reported live-vs-preview hero DSSIM of 0.241 (most of that was the 36→44 H1 gap, plus a few preview-only deltas Cycle 2 separately resolved). |

### /about-us live vs preview (mobile 375), post-fix

| Metric | Value |
|---|---|
| DSSIM (live vs preview, top 1200 px band) | 0.146 |
| Interpretation | Residual delta is dominated by header chrome differences (Drupal navbar vs preview-canonical nav are not pixel-identical) and the Drupal button chevron glyph on CTA 1. Hero typography matches (44 / -1 / 1.05 / Rubik 500); eyebrow, deck, CTA stacking, color tokens all match. |

### Per-section delta description

| Section | Viewport | Status | Notes |
|---|---|---|---|
| Hero (§A) | 375 | **REWORK COMPLETE** | H1 raised 36 → 44 px as intended. 4 lines, last line "wrote the tools." (3 words) — no orphan. No horizontal scroll. |
| Hero (§A) | 1280 | MATCH | H1 at 72 px / -2 px / Rubik 500 / line-height 75.6 (1.05). Identical to Cycle 2 state. |
| Closing CTA (§E) | 1280 / 375 | MATCH | Resolved in Cycle 2. Preview retains Cycle 2's espresso/cream-text token; no change this cycle. |
| Sibling pages hero (/, /services, /how-we-do-it, /open-source-projects) | 375 | NO REGRESSION | H1 still 44 px on all four (was already 44 px before this cycle). CTA stacking + horizontal-scroll behavior unchanged. |

### Desktop (1280 px) — /about-us

| Property | Brief desktop value | Live computed | Match |
|---|---|---|---|
| font-size | 72 px (display-xl) | 72 px | YES |
| letter-spacing | -2 px | -2 px | YES |
| line-height | 1.05 | 75.6 px | YES |
| font-weight | 500 | 500 | YES |
| font-family | Rubik | Rubik, sans-serif | YES |
| Horizontal scroll | none | docW 1265 < winW 1280 | YES |

### Mobile (375 px) — /about-us

| Property | Brief mobile value | Live computed | Match |
|---|---|---|---|
| font-size | 44 px (display-xl mobile) | 44 px | YES |
| letter-spacing | -1 px | -1 px | YES |
| line-height | 1.05 | 46.2 px | YES |
| font-weight | 500 | 500 | YES |
| text-wrap | balance | balance | YES |
| Orphan check | none | last line "wrote the tools." (3 words) | YES |
| Horizontal scroll | none | docW 360 < winW 375 | YES |
| Hero CTA stacking | full-width, stacked at <576 | 2 × 331×56 px, stacked | YES |

## Design brief compliance (focused on this cycle's surface area)

| Token | Brief value | Rendered (live) | Match |
|---|---|---|---|
| `display-xl` mobile font-size | 44 px | 44 px | YES |
| `display-xl` mobile letter-spacing | -1 px | -1 px | YES |
| `display-xl` mobile line-height | 1.05 | 1.05 | YES |
| `display-xl` desktop font-size | 72 px | 72 px | YES |
| `display-xl` desktop letter-spacing | -2 px | -2 px | YES |
| `--color--loud` on white H1 | `#1F1A14` on `#FFFFFF` | 17.27:1 (AAA large-text) | YES |
| Preview line 514 (mobile rule) | `font-size: 44px; letter-spacing: -1px` | matches | YES |
| Preview line 254 (desktop rule, Cycle 2) | `font-size: 72px` | matches | YES |

## WCAG 2.2 AA audit (scoped — deltas vs Sprint 14 Cycle 1)

| Check | Result | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS (no delta) | No new interactive elements. Refer to Cycle 1 enumeration. |
| Focus ring visibility | PASS (no delta) | Unchanged from Cycle 1. |
| Forced-colors mode | PASS (no delta) | Color tokens unchanged. |
| Reduced-motion | PASS (no delta) | No transitions added. |
| 200% zoom | PASS (no delta) | Layout unchanged at the responsive level. |
| Heading hierarchy | PASS | Single H1, H1→H2→H3 (T verified, T2-7/T2-8). |
| Image alt text | PASS (no delta) | No new images. |
| Mobile touch targets (375 px) | PASS | Hero CTAs 56 px tall, full-width. |
| Mobile typography scale | PASS | Now matches `typography-mobile` display-xl block exactly. |
| Mobile layout | PASS | No horizontal scroll on any of 5 landing pages at 375 px. |

Full WCAG enumeration: `docs/pl2/handoffs/sprint-14-cycle-1-audit.md`.

## Static preview comparison

Section-by-section comparison against `docs/pl2/Previews/about-us.html` (now updated to 44 px mobile / 72 px desktop on the integration branch):

| Section | Status | Notes |
|---|---|---|
| §A Hero (desktop) | MATCH | 72 px H1, -2 px, eyebrow, deck, CTA pair all match. |
| §A Hero (mobile) | MATCH | 44 px H1, -1 px tracking — live and preview now agree. Minor: live CTA 1 has chevron glyph, preview does not (pre-existing Drupal template asymmetry; not load-bearing). |
| §B Track record | MATCH (Cycle 1/2 verified) | Unchanged this cycle. |
| §C Open-source | MATCH (Cycle 1/2 verified) | Unchanged this cycle. |
| §D Dogfood | MATCH (Cycle 1/2 verified) | Unchanged this cycle. |
| §E Closing CTA | MATCH (Cycle 2 verified) | Cream `--color--quiet` text on espresso preserved on integration branch. |
| Footer | MATCH (Cycle 1 verified) | Unchanged this cycle. |

## Cross-page no-regression sweep (mandated by AC-6)

| Page | H1 size at 375 | Letter-spacing | Line count | Last-line orphan? | Horizontal scroll | CTA stacking | Status |
|---|---|---|---|---|---|---|---|
| `/` | 44 px | -1 px | 3 | "confidence." — **1 word** (pre-existing) | none | full-width stack OK | NO REGRESSION |
| `/services` | 44 px | -1 px | 4 | "teams." — **1 word** (pre-existing) | none | full-width stack OK | NO REGRESSION |
| `/how-we-do-it` | 44 px | -1 px | 3 | "runs." — **1 word** (pre-existing) | none | (no CTAs in hero) | NO REGRESSION |
| `/open-source-projects` | 44 px | -1 px | 3 | "the open" (2 words) — OK | none | (no CTAs in hero) | MATCH |
| `/about-us` | **44 px (was 36 px)** | -1 px | 4 | "wrote the tools." (3 words) — OK | none | full-width stack OK | **FIXED** (intended change) |

Raw measurement source: `docs/pl2/handoffs/screenshots/sprint-14-cycle-3/measurements.json` and `orphan-lines.json`.

## Verdict

**PASS** — all acceptance criteria met:

- AC-1 (live L1 mobile raise): /about-us H1 now renders 44 px / -1 px / Rubik 500 at 375 px. Implementation is L5 marker (not L1 token) per F's documented and T-verified scope deviation — same architectural pattern as the other landing pages, no new CSS.
- AC-2 (preview mobile raise): `docs/pl2/Previews/about-us.html:514` now `font-size: 44px; letter-spacing: -1px;`.
- AC-3 (desktop unchanged): /about-us H1 at 1280 still 72 px / -2 px / Rubik 500.
- AC-4 (no `!important`, standard layer trace): T-verified (T2-14, T2-15).
- AC-5 (T1/T2): T verified all checks; single H1, correct hierarchy, ARIA landmarks intact.
- AC-6 (cross-page sweep, S's responsibility): All five landing-page heroes verified at 375 px. No regression on the four sibling pages. /about-us H1 now matches the brief. No horizontal scroll anywhere. CTA stacking intact on the three pages that have hero CTAs.

Ready for O to commit and merge.

## Advisory notes (non-blocking)

1. **Pre-existing single-word H1 orphans at 375 px on /, /services, /how-we-do-it** despite `text-wrap: balance` being active. Strings: "confidence.", "teams.", "runs." These predate Cycle 3 (the three pages already rendered 44 px H1 via the same FU-2 rules introduced in Sprint 4). Memory `feedback_no_orphan_words.md` argues for zero orphans. Recommend a follow-up sub-issue — either copy-edit the three H1 strings or apply a non-breaking-space / `<wbr>` hint pass. **Not a Cycle 3 blocker** because (a) /about-us itself has no orphan; (b) /about-us is the only page Cycle 3 touched; (c) the orphans pre-date the cycle.
2. **Stale comment in dy-section.css** still says "/about-us: no .landing-hero class — NOT matched" (T2 advisory note 3). Trivial doc cleanup for a future cycle.
3. **Live CTA chevron glyph** on the first hero CTA in Drupal output is absent from the static preview. Pre-existing template asymmetry; minor visual delta only.
