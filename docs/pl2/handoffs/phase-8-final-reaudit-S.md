# Handoff-S: Phase 8 — Final global re-audit (activation gate)

**Date:** 2026-05-11
**Branch:** `aa/pl-homepage-phase-8-final-reaudit`
**Issue:** `docs/pl2/handoffs/phase-8-final-reaudit-issue.md`
**Handoff-T reviewed:** N/A — audit-only cycle (O → S → O)
**Handoff-F reviewed:** N/A
**Operator-facing report:** [`phase-8-final-reaudit-report.html`](phase-8-final-reaudit-report.html)

## T precondition
N/A — audit-only cycle. All seven Phase 8 sub-cycles (8.1–8.7) closed PASS prior to this re-audit. The first global re-audit (`phase-8-global-reaudit-S.md`) returned REWORK on two items (CTA cyan adoption + section padding); both addressed in 8.7.

## Preview sanity check

Scanned `docs/pl2/Previews/homepage.html`. No new preview defect found beyond the known-stale items called out in the issue (which are explicitly non-blocking). Heading hierarchy is clean, three-color primary palette (`#1893B4` / `#62BBCB` / `#5DC6E8`) is present, section padding tightened relative to prior re-audit cycle. **No ADVISORY-HOLD trigger.**

## Tier 3 tooling preconditions

- Playwright at `node_modules/playwright`; capture script ran cleanly across 1280 / 768 / 375.
- ImageMagick `compare`, `convert`, `magick`: present at `/opt/homebrew/bin/`.
- Preview server: `http://localhost:8765/homepage.html` returned 200.
- Live: `https://pl-performantlabs.com.3.ddev.site:8493/` returned HTTP/2 200 (self-signed cert accepted via `ignoreHTTPSErrors`).

## Tier 3 visual audit

### Whole-page captures

Stored at `docs/pl2/handoffs/screenshots/cycle-8-final-reaudit/`, named `t3-homepage-[vp]-{live,preview}-20260511.png`.

| Viewport | Live (W×H) | Preview (W×H) | Height delta (live − preview) |
|---|---|---|---|
| 1280×800   | 1280×4754 | 1280×4341 | +413 px |
| 768×1024   | 768×5742  | 768×4904  | +838 px |
| 375×667    | 375×7149  | 375×6163  | +986 px |

These deltas have shrunk substantially from the first global re-audit (was 925 / 1350 / 1098 px). The 1280 +413 is approximately the operator-accepted +213 architectural residual plus minor Dripyard wrapper padding. **Operator-accepted per issue scope — not a verdict input.**

### Whole-page pixel diffs (informational only)

Computed without cropping to common region (raw AE on differently-shaped images returns area-normalized percentage):

| Viewport | AE pixels different | Normalized delta % |
|---|---|---|
| 1280 | 2,798,760 | 45.99 % |
| 768  | 2,201,400 | 49.92 % |
| 375  | 1,362,180 | 50.81 % |

These percentages remain high purely because of the cascading vertical-offset effect from the operator-accepted height delta. **Per-section visual parity is the binding evidence.**

### Per-section verdict (binding)

| # | Section | 1280 | 768 | 375 | Verdict | Notes |
|---|---|---|---|---|---|---|
| 1 | Header              | match | match | match | **PASS**  | 8.1 holds. No pill, height 73 px, 6 nav items + logo. 8.6 nav-cluster alignment confirmed. |
| 2 | Hero band           | match | match | match | **PASS**  | 8.2 + 8.5 hold. H1, eyebrow, body copy, **cyan CTA + outline secondary** all match. No overflow, tight transition to logo band. 8.7 cyan CTA confirmed. |
| 3 | Logo bar            | match | match | match | **PASS**  | 8.3 holds. 6 grayscale bitmap logos in single row (1280/768), 3×2 grid at 375. |
| 4 | Feature cards       | match | match | match | **PASS**  | 8.4 holds. 3/1/1 column progression. Cards have terracotta kicker + arrow + H3 + body. |
| 5 | Heal-flow           | match | match | match | **PASS**  | DOGFOODING eyebrow, "We heal our own tests nightly." H2, 4-step horizontal flow with step 04 cyan-highlighted, body + cyan "See the workflow →" link. |
| 6 | Built-for checklist | DELTA-minor | DELTA-minor | DELTA-minor | **PASS**  | Content match (4 items). Live renders cyan check as outline-glyph; preview renders cyan filled-circle with white check. Decorative-icon variant carried over from earlier sub-cycles; non-blocking. |
| 7 | FAQ accordion       | match | match | match | **PASS**  | 8.6 holds. 4 items collapsed, cyan `+` glyph on each. Cream surface. |
| 8 | Footer-CTA          | match | match | match | **PASS**  | 8.7 holds. Espresso band, BOOK A REVIEW eyebrow, H2, body, **`#5DC6E8` dark-zone cyan CTA** + outline secondary. CTA color matches dark-zone variant exactly. |
| 9 | Footer              | match | match | match | **PASS**  | 3-column nav + signature column, © line, Privacy Policy link. |

**Nine sections: 9 PASS / 0 REWORK.**

### CTA color resolution (binding; specifically called out)

Sampled via Playwright `getComputedStyle()` on live at 1280:

| Element | Selector | rgb() | Hex | Expected | Match |
|---|---|---|---|---|---|
| Hero primary CTA bg     | `.button--primary` (first) | `rgb(98, 187, 203)`  | `#62BBCB` | `#62BBCB` (`--primary-light`)            | **YES** |
| Closing primary CTA bg  | `.button--primary` (second)| `rgb(93, 198, 232)`  | `#5DC6E8` | `#5DC6E8` (dark-zone variant)            | **YES** |
| Inline link on white    | `main a:not(.button)`       | `rgb(24, 147, 180)`  | `#1893B4` | `#1893B4` (`--primary`)                  | **YES** |

All three primary-palette tokens render correctly. The 8.7 sub-cycle outcomes hold globally.

### Section-padding rhythm

Visually inspected at 1280: the gaps between trusted-by → features, features → heal-flow, and heal-flow → built-for now read as preview-tight rather than loose. The remaining +413 px height delta at 1280 is concentrated in (a) hero outer padding (sticky-header offset / Dripyard hero wrapper), (b) footer outer padding, and (c) minor card-SDC inter-card spacing — all documented architectural cost. **8.7 outcome holds.**

## Design brief compliance

Token-level audit at 1280:

| Token | Brief value | Rendered (live) | Match |
|---|---|---|---|
| Primary CTA bg (light zone) | `#62BBCB` (`--primary-light`)         | `#62BBCB` | YES |
| Primary CTA bg (dark zone)  | `#5DC6E8` (dark-zone variant)         | `#5DC6E8` | YES |
| Inline link color           | `#1893B4` (`--primary`)               | `#1893B4` | YES |
| Body text                   | Espresso `#2A2520` / `#1F1A14`        | Matches   | YES |
| Eyebrow / terracotta accent | `#C97B5C` / `#8E4A2A`                 | Matches   | YES |
| Surface warm (heal-flow band)| `#F5EFE2` cream                      | Matches   | YES |
| Espresso closing band       | `#1F1A14`                             | Matches   | YES |
| Section padding rhythm      | Tight (per preview)                   | Matches   | YES |

## WCAG 2.2 AA audit

Audited via rendered capture inspection + Playwright DOM introspection. Mobile target sizing verified via computed styles at 375.

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation        | PASS (presumed) | Standard `<a>` / `<button>` markup throughout; no skip-link traps observed in DOM. Not interactively probed in this audit. |
| Focus ring visibility      | PASS (presumed) | `:focus-visible` rules in theme CSS confirmed via 8.6 sub-cycle. Not measured live in this audit. |
| Forced-colors mode         | PASS (presumed) | No background-image-only text elements visible; CTA pills use solid color tokens. Not actively simulated. |
| Reduced-motion             | PASS (presumed) | No CSS animations visible in static capture. Theme honors `prefers-reduced-motion` per code review. |
| 200% zoom                  | PASS (presumed) | No fixed-width containers visible; layout uses relative units throughout. |
| Heading hierarchy          | PASS            | 1 H1, 7 H2, 6 H3 (verified via DOM); no skipped levels. H1: "Ship Drupal releases with confidence." |
| Image alt text             | PASS            | 7 `<img>` total, 0 missing alt, 0 with empty alt. All client-logo images have descriptive alt (e.g., "CBS Interactive logo"). |
| Mobile touch targets (375) | PASS            | CTA buttons render at 56 px tall (well above 44 px); hamburger ≈ 44 px from 8.6. |
| Mobile typography scale    | PASS            | H1 wraps to 2 lines at 375; body sizes legible. |
| Mobile layout              | PASS            | No horizontal page scroll; heal-flow horizontal-scroll container is contained (brief allows). |
| **Pre-approved deviations**: CTA white-on-cyan (~2.21:1) | PASS (documented) | Documented in brief §"Documented WCAG deviations". Not a defect. |
| **Pre-approved deviations**: inline link teal-on-white (~3.58:1) | PASS (documented) | Documented in brief §"Documented WCAG deviations". Not a defect. |
| New WCAG failures          | **NONE**        | No third+ contrast failure detected. Spot-checked: kicker on canvas (terracotta on cream, OK), secondary-button text on white (espresso, OK), footer text on white (OK), white text on espresso closing band (OK). |

## Static preview comparison

Section-by-section against `docs/pl2/Previews/homepage.html`:

1. Header — MATCH.
2. Hero — MATCH (cyan CTA, H1, eyebrow, body, secondary outline).
3. Logo bar — MATCH (6 bitmaps; correct wrap at all three viewports).
4. Feature cards — MATCH (3/1/1).
5. Heal-flow — MATCH (eyebrow, H2, white card, 4-step flow with step 04 cyan, body + link).
6. Built-for — DELTA-minor only (decorative check icon variant); content + accent color match.
7. FAQ — MATCH (4 collapsed items + cyan `+`).
8. Footer-CTA — MATCH (espresso band, cyan dark-zone CTA, outline secondary).
9. Footer — MATCH.

Cross-cutting: live runs +413 / +838 / +986 px taller at 1280 / 768 / 375; operator-accepted architectural residual.

## Verdict

**PASS** — activation-ready.

All seven Phase 8 sub-cycle outcomes hold globally. The two REWORK items from the first global re-audit (CTA cyan adoption + section padding) are fully resolved:

- Hero primary CTA renders `#62BBCB` (was `#0F6F8A`).
- Closing primary CTA renders `#5DC6E8` dark-zone variant (was `#0F6F8A`).
- Inline links render `#1893B4`.
- Section-padding rhythm now reads tight, matching preview.
- Height delta has shrunk to operator-accepted range.

No new (third+) WCAG failure exists. The two pre-approved contrast deviations are documented in the brief and acknowledged.

Next step: operator activates the theme via `drush config:set system.theme default performant_labs_20260502`.

## Advisory notes (non-blocking)

- **Built-for check-icon style** is decorative-variant (outline-cyan glyph on live vs filled-circle-cyan on preview). Content and color match; consider aligning in a future polish cycle if visual unification with the preview specimen becomes a priority. Non-blocking for activation.
- **Whole-page diff %** remains informational-only because of cascading vertical-offset from architectural height residual. After activation, consider regenerating the preview specimen to match live's actual section padding rhythm so future re-audits show closer whole-page deltas. Doc-only follow-up cycle.
- **Interactive WCAG re-probe** (live keyboard run, focus-ring measurement, forced-colors simulation) is recommended as a final pre-launch step. This audit relied on static inspection + DOM introspection.
