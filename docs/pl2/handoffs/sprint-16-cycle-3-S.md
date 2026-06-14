# Handoff-S: Sprint 16 Cycle 3 — /contact-us sidebar H2 + sidebar card + closing-CTA layout

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-3-sidebar`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-3-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-16-cycle-3-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-16-cycle-3-F.md`
**Operator-facing report:** [`sprint-16-cycle-3-report.html`](sprint-16-cycle-3-report.html)
**Scope:** scoped re-audit — F-NEW-16-A, F-NEW-16-D, F-NEW-16-G. Full Cycle 1 matrix not re-run.

## T precondition

Confirmed: T reported zero blocking issues. One advisory (Canvas script untracked at T-run time) is an O gate responsibility, not a blocker — O stages `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` at the commit gate per the spawn prompt.

## Preconditions

- Browser-tool: Playwright (chromium) operational at the three brief viewports (1280/768/375) at DPR 2.
- ImageMagick: `/opt/homebrew/bin/compare`, `convert`, `magick` all on PATH.
- Visual-diff: AE diffs generated for pre-fix vs post-fix at sidebar and closing-CTA, and post-fix live vs preview.

All preconditions met.

## Diff sanity (Cycle 3 scope)

`git diff --name-only main` reports only the cycle-1 baseline artefacts (PNGs, JSONs, theme file historic changes) plus the cycle-3 webform.css modification. `git status` shows the Canvas script and cycle-3 handoff docs as untracked (expected — O stages at gate). No unexpected Twig, YAML, or theme files modified.

Sole live theme file change: `web/themes/custom/performant_labs_20260502/css/components/webform.css` — adds `.contact-sidebar .heading { font-size: 1.375rem; line-height: 1.25; letter-spacing: -0.2px; font-weight: 500; }` at line 266. No `!important`.

## Visual confirmation at 1280 (post-fix live render)

S captured `/contact-us` at 1280×800 DPR 2 via Playwright. Confirmed by direct screenshot inspection:

- Sidebar H2 "Prefer a quick call?" renders at the smaller size (22 px vs prior 32 px). Visible size drop.
- Sidebar wrapper renders as a card: hairline border, 12 px radius, 32 px internal padding, sticky positioning at desktop. Sidebar bounding box = 894/780/320/472 (right-rail, 320 px wide).
- Closing-CTA two buttons ("Book a testing review" primary + "View services" ghost-on-dark) render in a horizontal row centred in the dark section. Both share `top = 2812`. F's intended side-by-side layout is active.

## Pre/post pixel diffs (Cycle 1 baseline vs Cycle 3 post-fix)

| Region | Viewport | AE | Total px | Delta % | Verdict |
|---|---|---|---|---|---|
| Sidebar | 1280 | 77,680 | 764,704 | 10.16% | INTENTIONAL — H2 size + card padding + hairline border |
| Sidebar | 768 | 82,779 | 1,306,242 | 6.34% | INTENTIONAL — same factors |
| Sidebar | 375 | 49,468 | 767,821 | 6.44% | INTENTIONAL — H2 24→22 + padding shift, sticky drop preserved |
| Closing-CTA | 1280 | 266,787 | 2,932,270 | 9.10% | INTENTIONAL — vertical stack → side-by-side row |
| Closing-CTA | 768 | 215,611 | 1,923,162 | 11.21% | INTENTIONAL — same row layout |

Visual inspection of the diff PNGs:

- **Sidebar @ 1280**: red regions land on the H2 baseline shift (text smaller, moved up), the kicker "FASTER PATH" reflowed within new padding, body text reflowed, "Book a slot" CTA shifted, and a faint red rectangle on the card's outer edge corresponds to the new hairline border + 12 px radius. **No red bleed outside the sidebar bounding box.** ✓
- **Closing-CTA @ 1280**: red regions land on the H2 vertical shift (section now shorter because buttons share a row), text reflow, and two buttons in row layout overlapping the single stacked button from baseline. **No red on the section's surrounding chrome (footer band, top padding) beyond what the layout change naturally produces.** ✓
- **Sidebar @ 375**: H2 size shift visible; body reflow; the card hairline visible at edges; sticky correctly absent. ✓

These deltas are F's intended changes — they confirm the fix landed. Pre/post deltas should be non-zero in the scoped regions and zero elsewhere.

## Mobile sanity at 375

- Sidebar wrapper computed `position: static` (T verified, S re-confirmed visually — card sits inline after the form rather than floating in a sticky right rail).
- Closing-CTA buttons stack: live crop shows the two buttons one above the other, full-width (~331 px each in a 375 viewport).
- Touch target heights: 56 px (≥ 44 px). PASS.
- Orphan-word check: "Prefer a quick call?" at 22 px / Rubik 500 fits on a single line at all viewports (256 px usable width in 320 px sidebar). No orphan-word risk per memory `feedback_no_orphan_words.md`.

## Cross-page sanity

S probed `/services` closing-CTA at 1280 via Playwright (corroborates T's `/about-us` probe):

- `/services` Button 1 "Book a testing review": top = 3850.20, h = 56
- `/services` Button 2 "Or start with the tools": top = 3856.20, h = 44

Both buttons share the same row (6 px sub-pixel offset = the second button has h=44 due to its multi-line label; baseline aligns). Matches F's reported pre-cycle baseline (top 3850 / 3856). **No regression at /services.** Combined with T's `/about-us` probe (3976.31 = 3976.31), the cross-page baseline is preserved.

## F-NEW-16-D no-op verification

`webform.css` lines 179–209 implement the card chrome:

```css
.contact-sidebar { border: 1px solid var(--theme-border-color); border-radius: 12px; padding-inline: 32px; background: #FFFFFF; }
.contact-sidebar.padding-top--0 { padding-top: 32px; }
.contact-sidebar.padding-bottom--0 { padding-bottom: 32px; }
@media (min-width: 992px) { .contact-sidebar { position: sticky; top: 48px; } }
@media (max-width: 991px) { .contact-sidebar { position: static; } }
```

The live HTML renders `<div class="flex-wrapper contact-sidebar padding-top--0 padding-bottom--0 ...">` — the compound selectors `.contact-sidebar.padding-top--0` (0,2,0) beat the bare utility classes (0,1,0). All five card-chrome properties bind correctly. T verified via Playwright at all three viewports (border-color rgb(229,225,220) = #E5E1DC; border-width 1px; radius 12px; padding 32px all sides; position sticky @ 1280 / static @ 768/375; top 48px @ 1280). F's no-code-change determination is correct.

## Out-of-scope deltas (unchanged this cycle)

- **F-NEW-16-B** (Webform autocomplete) — passed in Cycle 2; not touched.
- **F-NEW-16-E** (§C "What to expect" H2 size) — still open for Cycle 4.
- **F-NEW-16-F** (§D primary CTA #62BBCB white-on-cyan contrast 2.21:1) — still open for Cycle 4. Pre-existing pa11y allowlist carries forward. Not introduced or worsened by Cycle 3.
- The form-section vs preview pixel delta (Webform module markup vs preview's hand-coded form) is a Cycle 1 carry note — not in scope here.

## Design brief compliance (Cycle 3 scope only)

| Token | Brief value | Rendered value | Match |
|---|---|---|---|
| Sidebar H2 font-size | 22 px (1.375 rem) | 22 px | YES |
| Sidebar H2 line-height | ~27.5 px (1.25) | 27.5 px | YES |
| Sidebar H2 letter-spacing | -0.2 px | -0.2 px | YES |
| Sidebar H2 font-weight | 500 | 500 | YES |
| Sidebar card border | 1px solid #E5E1DC | 1px solid rgb(229,225,220) | YES |
| Sidebar card border-radius | 12 px | 12 px | YES |
| Sidebar card padding | 32 px all sides | 32 px all sides | YES |
| Sidebar card position @ ≥992 | sticky, top 48 | sticky, top 48 | YES |
| Sidebar card position @ <992 | static | static (768 & 375) | YES |
| Closing-CTA layout @ 1280 | side-by-side | side-by-side (top match) | YES |
| Closing-CTA layout @ 768 | side-by-side | side-by-side (top match) | YES |
| Closing-CTA layout @ 375 | stacked | stacked (76 px vertical gap) | YES |

## WCAG 2.2 AA audit (Cycle 3 deltas only)

| Check | Result | Notes |
|-------|--------|-------|
| Touch targets (CTA buttons @ 375) | PASS | Both at 56 px height ≥ 44 px |
| Touch targets (sidebar "Book a slot" @ 375) | PASS | 56 px height |
| Sidebar H2 contrast | PASS | #1F1A14 on #FFFFFF = 17.27:1, well above 4.5:1 |
| Sidebar H2 size: 22 px | PASS | Above 16 px legibility minimum |
| Closing-CTA primary contrast | ALLOWLIST | #62BBCB white-on-cyan 2.21:1 — pre-existing F-NEW-16-F, not introduced this cycle |
| Closing-CTA ghost-on-dark contrast | PASS | #FFFFFF on #1F1A14 = 17.27:1 |
| Heading hierarchy | PASS | No heading-level changes this cycle |
| No horizontal scroll @ 375 | PASS | T confirmed `pageWidth=360 < clientWidth=375` |
| Mobile typography scale (sidebar H2) | PASS | 22 px uniform across viewports matches preview's typography-mobile |
| Mobile layout (CTA stacking) | PASS | Stacks at 375 with vertical gap; buttons full-width |
| Reduced-motion | PASS | No new animations introduced this cycle |
| Forced-colors mode | PASS | No new color-only signals; border + text + button outlines preserved |

## Verdict

**PASS** — all three Cycle 3 scope items verified:

1. **F-NEW-16-A** sidebar H2 sizing applied correctly at all viewports; no cascade widening to other H2s on the page (T confirmed: "What to expect" still 40 px, "Skip the form" still 56 px).
2. **F-NEW-16-D** card-chrome no-op correctly classified; pre-existing webform.css D5 rules bind to the live element and produce the intended card appearance.
3. **F-NEW-16-G** closing-CTA buttons render side-by-side at 1280 and 768, stack at 375. Cross-page baseline preserved at `/about-us` (T) and `/services` (S). Canvas patch idempotent.

No regressions detected. The pre/post visual diffs are clean: red regions land exactly where F intended changes, and zero red appears outside the scoped sidebar and CTA regions.

Ready for O to stage `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` at the gate and commit.

## Advisory notes

1. The Canvas script `scripts/sprint16-cycle3-contact-us-cta-pair-marker.php` is the cycle's persistence record of the additional-class patch; without it tracked in git, a future site rebuild from main would not re-apply the marker. O must stage it at the gate.
2. The 577 px vs 768 px CTA-pair breakpoint divergence from the issue wording is intentional and documented by F. AC satisfied at 768. No action required.
3. Cycle 4 will address §C H2 size (F-NEW-16-E) and the deferred contrast allowlist (F-NEW-16-F).
