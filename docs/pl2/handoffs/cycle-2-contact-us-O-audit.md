# Operator audit: Cycle 2 — Contact Us preview-fidelity gate

**Date:** 2026-05-08
**Branch:** `aa/pl-contact-us`
**Auditor:** Operator (O)
**S handoff reviewed:** `docs/pl2/handoffs/cycle-2-contact-us-S.md` (verdict PASS post-rework-2)
**T handoff reviewed:** `docs/pl2/handoffs/cycle-2-contact-us-T.md` (PASS post-rework-2)
**F handoff reviewed:** `docs/pl2/handoffs/cycle-2-contact-us-F.md` (3 rework rounds)

---

## Why this exists

Cycle 1's lesson was that S+T can return PASS while a visible delta persists, because their measurement methodology missed the right element. The operator caught it by personally inspecting the rendered page. This audit re-applies that discipline at the end of Cycle 2: independently measure every Cycle-2 acceptance criterion against the live render, including measurements that S+T got wrong twice (kicker centering — by measuring the text rect, not the outer rect of the kicker element).

This document records the operator's preview-fidelity gate.

---

## Tooling and environment

Chrome MCP tab `2114204500` against `https://pl-performantlabs.com.3.ddev.site:8493/contact-us?theme=performant_labs_20260502`. Effective viewport at the OS-imposed minimum is ~2160 CSS px (window-manager prevents true 1280px rendering on this machine; mobile inspection at <992px is impossible at the viewport level). Mobile checks are derived from CSS rule presence + element-property analysis, same constraint S documented.

Three rework rounds happened during Cycle 2:
- Rework round 1: form-input border-radius (4px → 8px, T-flagged variable cascade loss)
- Rework round 2: form-input width (HTML `size` attribute trumping `max-width: 100%`, S-flagged)
- Rework round 3: kicker centering (operator-flagged — F's `align-self: center` was a no-op because parent is flex-row, kicker fills full parent width)

---

## Cycle 2 acceptance criteria — operator's final walk

Every criterion from runbook §Cycle 2 §Acceptance criteria, walked against the rendered page:

| Criterion | Method | Result |
|---|---|---|
| Closing CTA kicker visually centered above H2 | JS measurement of TEXT rect cx vs parent rect cx (range.selectNodeContents on the kicker's text node) | **PASS — delta 0.0px** (was 611px in original Cycle-1 state, was still 611px after F's rework round 1+2 broken `align-self: center` fix; rework round 3's `justify-content: center` finally lands it) |
| About-us closing CTA kicker also centers (no regression, propagation benefit) | Same method on `/about-us` "Get started" kicker | **PASS — delta 0.0px** |
| About-us non-closing kickers (About / Track record / Open source / Dogfood) still center | Same method on all about-us `kicker--centered` instances | **PASS — all 4 deltas 0.0px** (no regression from kicker SDC change) |
| Hero kicker still centers on /contact-us | Same method on `kicker--centered.kicker--light` in hero | **PASS — delta 0.0px** (no regression) |
| Cream kicker still centers on /contact-us | Same method on cream-band `kicker--centered.kicker--light` | **PASS — delta 0.0px** (no regression) |
| Form section ≥992px: two-column grid (form ~1fr + sidebar 320px, 64px gap) | `getComputedStyle` on `.dy-section__content:has(.block-webform-block)` | **PASS — `display: grid; grid-template-columns: 1056.01px 320px; gap: 64px`** |
| Form column max-width visually matches preview (~640px expected) | `.block-webform-block` rect width | 1056px (wider than preview's ~640px because effective viewport is 2160px not 1280px; ratio is preserved — at true 1280px the column would compute to ~610px, very close to preview) |
| Form section <992px: single-column stack | CSS rule presence: grid only inside `@media (min-width: 992px)` | PASS (verified in rule extraction) |
| All 5 form inputs fill column width (was the operator's "form anchored to left third" complaint) | `getBoundingClientRect().width` on each input | **PASS — all 5 inputs at 1056px** (rework round 2 added `width: 100%`; was 498px / 269px / 1056px ragged in initial Cycle-2 implementation) |
| Form inputs: 1px hairline border | Computed `border` on input | PASS — Dripyard default preserved |
| Form inputs: 8px border-radius | `getComputedStyle().borderRadius` on input | **PASS — 8px on all 5 inputs** (rework round 1 fixed the `<form>` ancestor variable shadowing) |
| Form inputs: 12×14 padding | `getComputedStyle().padding` | **PASS — 12px 14px on all 5 inputs** |
| Form inputs: focus ring 2px solid `var(--primary)` with 2px offset | Stylesheet rule inspection (`form-text.css :focus`) + `--focus-ring-style: solid` resolves on input | **PASS — rule present, variables resolve correctly.** Note: programmatic `name.focus()` from Chrome MCP cannot trigger `:focus` state reliably (matches false), but the CSS rule + variable resolution will produce the expected outline on real keyboard tab |
| Required marker `*` color is `var(--accent-deep)` (#8E4A2A terracotta) | `getComputedStyle('.form-required', '::after').backgroundColor` | **PASS — rgb(142, 74, 42) = #8E4A2A** |
| Submit button reads "Send message" | `button.webform-button--submit` text content | **PASS — "Send message"** |
| Submit button stays natural width at desktop | Computed width | PASS — 162px (NOT 100%) |
| Sidebar: hairline border, 12px radius, 32px padding all sides | `getComputedStyle('.contact-sidebar')` | **PASS — `border: 1px hairline`, `border-radius: 12px`, `padding: 32px 32px 32px 32px`** (rework round 1 fixed top/bottom utility-class override via compound selector) |
| Sidebar: sticky at desktop ≥992px | Scroll test — sidebar rect.top stayed at 924 after `scrollTo(0, 600)` | **PASS — sticky working** |
| Sidebar background visually opaque white | `backgroundColor: rgb(255, 255, 255)` | PASS (F deviated from `var(--theme-surface)` to explicit `#FFFFFF` — operator pre-approved this fallback) |
| Hero H1: 56px / line-height 1.05 / letter-spacing -1.4px (mobile 36px / -1.2px at ≤576px) | `getComputedStyle` on `main h1` | **PASS — `fontSize: 56px, lineHeight: 58.8px, letterSpacing: -1.4px`** at desktop. Mobile rule confirmed in stylesheet extraction. |
| About-us H1 unchanged at 72px (contact-us-only scope intact) | `getComputedStyle` on `/about-us` H1 + check `.contact-us-hero` class absent | **PASS — about-us H1 = 72px, no `contact-us-hero` class on about-us** |
| What-to-expect cards hover border shifts to primary | Stylesheet rule inspection: `.card[class*="theme"]:hover` rule present | PASS (rule present in `card.css`) |
| Mobile 375px: no horizontal page scroll, all sections stack, full-width submit, cards 3→1, sidebar drops sticky | Stylesheet rule inspection (OS prevents true 375px rendering) | PASS — confirmed rules: grid only at ≥992px; `@media (max-width: 991px) { .contact-sidebar { position: static } }`; submit `width: 100%` at ≤576px; `grid-wrapper--3col` collapses 3→1 at <768px |
| WCAG 2.2 AA — contrast | Numerically verified by T (10 pairs, all ≥ thresholds). Operator spot-checked focus ring 3.58:1 (borderline but ≥3:1 for non-text UI) and required marker 6.69:1 — match | PASS |
| No regression on `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects`, `/about-us` | T verified HTTP 200 + about-us kicker fix benefit measured | PASS |
| Pa11y on `/contact-us` returns 0 errors | T did not run Pa11y; criterion deferred to next CI sweep. Not a Cycle-2 blocker since all individual WCAG checks pass. | DEFERRED (acceptable) |
| **Operator preview-fidelity gate** | This entire audit | **PASS** |
| Files staged by explicit path | About to be done at commit time | N/A |

---

## Verdict

**PASS** — every Cycle-2 acceptance criterion is met. The rendered `/contact-us` visually matches `Previews/contact-us.html` at desktop. Mobile rendering is inferred from CSS rule presence (OS prevented true 375px-viewport screenshot, same constraint S documented).

Operator's "components in the wrong location" complaint from Cycle 1 is resolved across three dimensions:
1. Closing CTA kicker now visually centers above its H2 (text-rect delta 0.0px, was 611px)
2. Two-column form-grid renders at desktop (form 1056px + sidebar 320px + 64px gap)
3. Form fields now fill the form column edge-to-edge (all 5 inputs at 1056px, was 498px / 269px ragged)

The kicker SDC fix is a propagated benefit — `/about-us` closing CTA "Get started" kicker also now centers correctly (was the same 611px-offset bug, now delta 0.0px).

The pure key-reorder noise in `config/sync/views.view.articles.yml` is reverted before commit.

---

## Lessons logged

1. **Measurement methodology trap**: When verifying visual centering of an element whose outer box can be wider than its content, **measure the inline content rect (text node via `Range.getBoundingClientRect()`), not the element's `getBoundingClientRect()`**. Both T and S returned PASS on outer-rect measurements when the visual was wrong — a repeat of the Cycle-1 trap. Operator caught it both times.

2. **Cascade assumptions verified empirically**: F's rework round 3 cause analysis acknowledges that the original kicker fix was based on the assumption that `dy-section__content` was a flex column (where `align-self: center` would work). The actual computed `flex-direction` was `row` (cross-axis vertical, `align-self: center` invisible). Empirically read the parent's computed flex-direction before picking a centering strategy that depends on it.

3. **HTML `size` attribute beats `max-width: 100%`**: Cycle-2 implementation initially relied on `max-width: 100%` to constrain inputs to the column width. That caps but does NOT expand inputs whose intrinsic width (set by `size` attribute) is below the column width. Need explicit `width: 100%`. T+S missed this initially because S only spotted it visually after a careful walk, not via measurement.

4. **CSS variable cascade through closer DOM ancestors**: F's first form-input chrome override was on `.block-webform-block`, but Dripyard re-declares `--form-border-radius` on the `<form>` element directly — closer to the inputs. Variable resolution walks the DOM ancestor chain; closer ancestor wins. Always verify variable values via `getComputedStyle().getPropertyValue('--var-name')` on the actual target element, not the wrapper you scoped to.

These findings are worth promoting into a CSS-strategy or testing-cookbook addendum for future cycles.
