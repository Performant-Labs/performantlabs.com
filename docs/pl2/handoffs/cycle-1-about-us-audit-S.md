# Handoff-S: Sprint 12 Cycle 1 — `/about-us` Preview-vs-Live Audit

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-12-cycle-1-about-us-audit`
**Issue:** `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/cycle-1-about-us-audit-issue.md`
**Handoff-T reviewed:** N/A (audit-only cycle; no F output)
**Handoff-F reviewed:** N/A (audit-only cycle)
**Operator-facing report:** [`cycle-1-about-us-audit-report.html`](cycle-1-about-us-audit-report.html)
**Mode:** autonomous

## T precondition

N/A. Audit-only cycle per issue. Proceeded directly to visual diffs and WCAG audit.

## Preview sanity-check

Two preview defects surfaced that contradict shipped sibling-fit conventions:

1. **Preview header carries a right-side "Book a testing review" CTA pill** (`Previews/about-us.html` line 488). Per memory `design_header_nav_breakpoint.md` and the shipped homepage / services / open-source-projects headers, the canonical header has **no** right-side CTA pill. Live page correctly omits the pill.
2. **Preview mobile header is broken**: at `<992 px` the preview hides nav via `display: none` but provides no hamburger toggle, leaving mobile visitors with no way to reach nav links. Live page ships the correct hamburger (`navbar-expand-lg` pattern) per memory `design_header_nav_breakpoint.md`.

These are preview-side defects, not live-page defects. The live page is closer to the canonical family pattern than the preview is on header chrome. Recommendation: update the preview before any further fix cycle. Verdict gated on this — see verdict section below.

No other preview a11y floors violated: heading hierarchy single h1 + h2/h3 in order; preview body color `#5C544C` on canvas `#FFFFFF` = ~7.5:1 contrast; preview kickers `#8E4A2A` on cream `#F5EFE2` = ~5.7:1 (≥ 4.5:1 for 12 px body); preview espresso fg `#F5EFE2` on bg `#1F1A14` = ~15:1.

## Tier 3 visual audit

### Visual diff results

| Viewport | Live | Preview | Diff PNG | Composite | AE pixels (fuzz 2%) | Whole-page delta % |
|---|---|---|---|---|---|---|
| 1280×800 | `t3-about-us-1280-live-20260512.png` (1280×4549) | `t3-about-us-1280-preview-20260512.png` (1280×4390) | `t3-about-us-1280-diff-20260512.png` | `t3-about-us-1280-composite-20260512.png` | 1,909,200 | 32.79 % |
| 768×1024 | `t3-about-us-768-live-20260512.png` (768×5690) | `t3-about-us-768-preview-20260512.png` (768×5045) | `t3-about-us-768-diff-20260512.png` | `t3-about-us-768-composite-20260512.png` | 2,285,980 | 52.31 % |
| 375×667 | `t3-about-us-375-live-20260512.png` (375×7952) | `t3-about-us-375-preview-20260512.png` (375×6723) | `t3-about-us-375-diff-20260512.png` | `t3-about-us-375-composite-20260512.png` | 1,652,020 | 55.40 % |

All artifacts at `docs/pl2/handoffs/screenshots/cycle-1/`. Padded inputs (`*-pad.png`) retained for the wipe-slider comparators in the HTML report.

Per PC-8: AE=0 strict is for refactor cycles only. Whole-page delta % here is inflated by (a) Drupal-managed chrome vs. preview's hand-rolled chrome and (b) section-height drift from the bio-block promotion. Per-section deltas below are binding.

### Per-section delta description

The diff PNG concentrates red across nearly every section, but tokens, components, copy, and section order all match. The pixel mass derives mostly from chrome and vertical-rhythm drift, not from on-brief failures. The actual per-section visible deltas:

**Header chrome** — preview defective (right-side CTA pill, no mobile hamburger). Live correct. **Update preview, not live.** Layer: N/A.

**Hero (§A)** — kicker "About", h1 verbatim, italic subhead, two-button row. Primary button bg renders `rgb(98,187,203)` = `--primary-light #62bbcb`. No orphan words on h1 at any viewport. **MATCH.**

**Track record (§B)** — kicker renders at `rgb(140,78,51)` (~2-unit drift from the `--accent-deep` target `rgb(142,74,42)` = `#8E4A2A`). Cream bg `rgb(245,239,226)` = `#F5EFE2` ✅. Credentials list already styled with terracotta tick-mark hairlines. **DELTA — minor**, kicker token only.

**Open source (§C) header + cards** — kicker "Open source" + h2 "The tools we wrote." render correctly. Three `card-canvas` cards in 3-up grid; `border: 1px solid rgb(229,225,220)` (= `--hairline #E5E1DC`), `border-radius: 12px`. Outer card wrapper `padding: 0` (inner padding handled by SDC slots) — preview specifies `padding: 48px` on the outer card. Net effect is slightly tighter body cadence on live. **DELTA — minor**, card outer padding only.

**Bio "Who we are." (§C tail)** — **REWORK.** Live has promoted the bio block to its own `dy-section--bio-block theme--white` section (height 1395 px). The preview embeds the bio inside §C with a thin terracotta-grey hairline rule above it, and locked decision R9 in `pl-plan--about-us.md` says the bio "stays inside §C (not promoted to its own section), separated by a hairline rule above." Live violates R9; the hairline rule above the h3 is also missing.

**Dogfood (§D)** — cream section, kicker "DOGFOOD" rendering at `rgb(140,78,51)` (same off-spec value as §B). H2 "We test what we ship." matches. Body and button match. **DELTA — minor**, same kicker normalization as §B.

**Closing CTA (§E)** — espresso bg `rgb(31,26,20)` = `#1F1A14` ✅. Kicker "GET STARTED" `rgb(201,123,92)` = `--accent #C97B5C` ✅. On-dark muted body color `rgb(184,175,160)` = `--on-dark-muted #B8AFA0` ✅. Buttons render primary + ghost-on-dark as specified. **MATCH.**

**Card grid collapse** — 3-up → 1-up at 768 and 375 on both live and preview. No horizontal scroll on live mobile (`scrollW=360`, `clientW=375`). **MATCH.**

**Footer chrome** — Drupal-managed footer; 4-column on desktop, reflows to 2-col at 992 and 1-col at 767 per preview rules. **MATCH** (gestalt; not pixel-locked because preview uses hand-rolled footer).

### Desktop (1280)

Walkthrough confirms all five sections in the correct order: Hero → Track record → (broken bio promotion appears here on live) → Open source → Dogfood → Closing CTA. On preview, bio sits inside Open source, not as its own section.

### Tablet (768)

Card grid collapses to 1-up. Section padding cadence shorter than 1280 but still rhythmic. Hamburger header on live; preview header is broken (no nav reachable).

### Mobile (375)

Single-column throughout. Hero h1 down-scales correctly. Live shows the hamburger header (correct); preview shows logo + nothing. Card stack is tight and readable. Closing CTA buttons wrap to stacked at narrow widths and remain ≥ 44 px tap height.

## Design brief compliance

| Token | Brief value | Live rendered value | Match |
|---|---|---|---|
| `--primary-light` (hero CTA bg) | `#62bbcb` | `rgb(98, 187, 203)` | ✅ |
| `--accent-deep` (kicker on light) | `#8E4A2A` = `rgb(142, 74, 42)` | `rgb(142, 74, 42)` on §A, §C; `rgb(140, 78, 51)` on §B, §D | ⚠ partial — see Cycle 3 |
| `--accent` (kicker on dark) | `#C97B5C` = `rgb(201, 123, 92)` | `rgb(201, 123, 92)` | ✅ |
| `--cream` (§B, §D bg) | `#F5EFE2` = `rgb(245, 239, 226)` | `rgb(245, 239, 226)` | ✅ |
| `--espresso` (§E bg) | `#1F1A14` = `rgb(31, 26, 20)` | `rgb(31, 26, 20)` | ✅ |
| `--body` (text) | `#5C544C` = `rgb(92, 84, 76)` | `rgb(92, 84, 76)` | ✅ |
| `--on-dark-muted` (§E body) | `#B8AFA0` = `rgb(184, 175, 160)` | `rgb(184, 175, 160)` | ✅ |
| `--hairline` (card border) | `#E5E1DC` = `rgb(229, 225, 220)` | `rgb(229, 225, 220)` | ✅ |
| Card radius | `12px` | `12px` | ✅ |
| Card border | `1px solid` | `1px solid` | ✅ |
| Kicker font-size / letter-spacing | `12px / 1.6px` | `12px / 1.6px` | ✅ |

## WCAG 2.2 AA audit (live page)

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | PASS | Skip link → logo → 6-link nav → breadcrumb → hero CTAs → in-section links → closing CTAs → footer columns. Logical, matches visual reading order. 30-step tab walk captured. |
| Focus ring visibility | PASS | 3 px dotted teal (`rgb(24,147,180)`) on light surfaces; 3 px dotted teal-light (`rgb(98,187,203)`) on espresso closing-CTA buttons. Visible on every focusable element. |
| Forced-colors mode | PASS (presumed) | Family pattern verified in Sprint 11; site uses semantic anchors/buttons; no color-only meaning. Not re-simulated here. |
| Reduced-motion | PASS (presumed) | Only hover/focus transitions; family CSS already respects `prefers-reduced-motion`. |
| 200% zoom | PASS | Layout reflows; no clipping in full-page capture. Family verified at 200% in Sprint 11. |
| Heading hierarchy | PASS | h1 ×1 ("Drupal testing, done by the people who wrote the tools."); h2s for Main navigation, Breadcrumb, §B, §C, §D, §E, Footer; h3s for ATK, Testor, Other tools, Who we are, Services, Resources, Company. No skipped levels. |
| Image alt text | PASS | One image: `/themes/custom/performant_labs_20260502/logo.svg` alt="Home". All other content text-only. |
| Mobile touch targets (375) | PASS (with caveat) | 19 anchors under 44×44 — all are inline text links inside paragraph/footer copy. WCAG 2.5.8 inline-text exception applies. Primary CTAs in hero, dogfood, closing CTA all exceed 44 × 44. |
| Mobile typography scale | PASS | Hero h1 scales per preview's `@media (max-width: 767px)` rule. Section h2 scales. Body remains 16/17 px. |
| Mobile layout | PASS | Cards 3 → 1; footer 4 → 2 → 1; no horizontal scroll (`scrollW=360 < clientW=375`). |
| Orphan words | PASS | `text-wrap: balance` applied to h1/h2 in family CSS; no orphans observed at any viewport. |

## Static preview comparison (section-by-section)

| Section | Status | Notes |
|---|---|---|
| Header | DELTA — preview defective | Live correct (no CTA pill, hamburger at mobile); preview has CTA pill and broken mobile nav. Update preview. |
| Hero (§A) | MATCH | Kicker, h1, italic subhead, button row all correct. |
| Track record (§B) | DELTA — minor | Kicker terracotta drift (rgb(140,78,51) vs target rgb(142,74,42)). |
| Open source (§C) header | MATCH | Kicker + h2 split correct. |
| Open source (§C) cards | DELTA — minor | Outer card padding shorter than preview's 48 px. |
| Bio "Who we are." | REWORK | Promoted to own section, violating R9. Missing hairline above. |
| Dogfood (§D) | DELTA — minor | Same kicker drift as §B. |
| Closing CTA (§E) | MATCH | Espresso, terracotta kicker, button pair all on token. |
| Footer | MATCH (gestalt) | 4 → 2 → 1 column reflow as specified. |

## Sibling-fit cross-check

Compared against shipped `/services` and `/open-source-projects`:

| Element | Sibling pattern | About-us preview | About-us live | Verdict |
|---|---|---|---|---|
| Header right-CTA pill | Absent | Present | Absent | **Preview wrong** |
| Mobile nav at <992 | Hamburger toggle | Hidden, no toggle | Hamburger present | **Preview wrong** |
| Kicker pattern | Terracotta hairlines, 12 px / 1.6 px ls | Specified | 4/5 correct, 2/5 token drift | Live minor drift |
| Card-canvas chrome | 1 px hairline border, 12 px radius, no shadow | Same | Same | Match |
| Closing CTA on espresso | Locked across family | Specifies espresso | Renders correct | Match |

## Verdict

**ADVISORY-HOLD.** The audit is complete and the carve is in place, but two preview defects (header CTA pill, broken mobile header) contradict shipped sibling-fit convention. Committing further fix cycles against a defective preview risks the same false-PASS pattern documented in the 2026-05-07 course correction. The cleanest unblock is for the operator to either (a) approve a 5-minute preview amendment to delete the header CTA pill and add a hamburger stub or annotation, or (b) explicitly accept the preview's header chrome as out-of-scope for fidelity and proceed straight into Cycle 2. Either decision is fine; the carve below holds in either case because none of the fix cycles depend on the header question.

Per PC-9 this verdict silently parks the cycle. Per the issue, REWORK is not applicable for an audit-only cycle (no F output to reject), and PASS would imply "carve recorded, proceed" without flagging the preview defect — which the prior course correction explicitly warned against.

## Carve recommendation — Sprint 12 Cycles 2..N

**Pre-cycle reconciliation (optional, 5-minute operator-or-quick-F edit):** Update `docs/pl2/Previews/about-us.html` to remove the right-side header CTA pill at line 488 and either add a hamburger toggle stub at the `@media (max-width: 991px)` breakpoint or annotate with a comment that the header reuses shipped chrome. Fold into Cycle 2's branch if accepted.

### Cycle 2 — Bio block re-nest + hairline above
- **Branch:** `aa/pl-sprint-12-cycle-2-about-us-bio-renest`
- **Scope:** Re-nest the bio "Who we are." inside §C (Canvas content patch preserving `component_version` per PC-6) and add the terracotta-grey hairline rule above the bio block.
- **Absorbs:** "Bio (§C tail)" REWORK row.
- **Layer:** Canvas-content + L5.
- **Operator decisions:** none — locked by R9.

### Cycle 3 — Kicker terracotta token normalization
- **Branch:** `aa/pl-sprint-12-cycle-3-about-us-kicker-token`
- **Scope:** Audit why §B (Track record) and §D (Dogfood) kickers render at `rgb(140,78,51)` while §A (About) and §C (Open source) render at `rgb(142,74,42)`. Resolve to one source variable — likely `--accent-deep #8E4A2A`. If the off-spec value is a stale token alias used cross-page, prefer L3 (one fix); if it's local to a kicker variant on cream surface, prefer L5.
- **Absorbs:** Track record DELTA, Dogfood DELTA rows.
- **Layer:** L3 preferred (cross-page); L5 scoped if local.
- **Operator decisions:** none; F's Step-3 layer trace resolves per PC-3.

### Cycle 4 — Card-canvas outer padding alignment
- **Branch:** `aa/pl-sprint-12-cycle-4-about-us-card-padding`
- **Scope:** Tune `.card-canvas` outer padding to match preview's `.project-card { padding: 48px }` cadence. File is page-shared with `/open-source-projects` — F handoff must flag cross-page impact; T regression-spots OSS page.
- **Absorbs:** Open source §C cards DELTA row.
- **Layer:** L5 (`card-canvas.css`).
- **Operator decisions:** none; flag any sibling regression at T.

### Cycle 5 — Sprint wrap verification (T → S)
- **Branch:** `aa/pl-sprint-12-cycle-5-about-us-wrap-verify`
- **Scope:** Pure verification (no F). T1+T2 sweep on `/about-us`; T3 visual at 1280 / 375 against the updated preview; pa11y with allowlist; sibling-fit spot-check against `/services` and `/open-source-projects`.
- **Layer:** N/A (verification).
- **Operator decisions:** approve integration → local main merge per R8.

**Carve total:** 3 fix cycles + 1 verification cycle = 4 follow-on cycles. Sub-44-tap-target inline links and the preview header chrome are intentionally out of scope (WCAG 2.5.8 inline exception; chrome is shipped family pattern that supersedes the preview).

## Advisory notes

- The whole-page pixel deltas (32–55 %) look alarming but are dominated by chrome plus bio-section vertical drift. Per-section evaluation confirms strong gestalt fidelity. Treat the AE % here as informative, not binding (PC-8).
- The course-correction history in `pl-plan--about-us.md` (2026-05-07) explicitly added a "sibling fit" check after a false-PASS shipped. This audit applied the check and surfaced two preview-side regressions of exactly the type the course correction warned about. Worth landing the preview amendments as a permanent learning, not just a one-off.
- Bio-section promotion to its own `dy-section--bio-block` is interesting — someone likely added a bespoke marker for it. The Cycle-2 re-nest should also retire any orphaned CSS for that marker if it isn't used elsewhere.
- Kicker color drift between sections is unusual — same theme, same kicker SDC, different rgb output. Likely a `theme--light` vs `theme--cream` cascade quirk. Cycle 3's F is well-placed to root-cause.
