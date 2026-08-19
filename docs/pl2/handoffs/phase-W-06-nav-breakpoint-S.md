# Handoff-S: Phase W-06 — Align header nav breakpoint 1000px → 992px

**Verdict: PASS**
**Date:** 2026-06-14
**Branch:** `aa/pl-neonbyte-W-06-nav-breakpoint`
**Reviewer:** S (Spec Auditor) — Tier 3, visual
**Site:** https://pl-performantlabs.com.3.ddev.site:8493/

---

## Scope of this audit

W-06 moves the header nav breakpoint from 1000px to 992px (`navbar-expand-lg`).
There is **no new visual design** — the same header switching at a different width.
Per the operator framing, this is a **visual-regression sanity pass at the boundary**,
not a pixel-diff against a new reference. The binding questions: does the mobile header
render correctly at ≤991, does the inline desktop nav render correctly at ≥992, is the
header unbroken at the 992 transition, and is there no horizontal overflow at 375.

## Preconditions

| Precondition | Status |
|---|---|
| A handoff = PASS | Confirmed (`phase-W-06-nav-breakpoint-A.md`, 2026-06-14) |
| T handoff = zero blocking | Confirmed (`phase-W-06-nav-breakpoint-T.md`, "Blocking issues: None") |
| Real browser can render | Confirmed (Playwright/Chromium, site HTTP 200) |
| Pixel-level visual evidence producible | Confirmed (Playwright element screenshots + ImageMagick available) |

All four preconditions met — full Tier-3 render audit performed, not cascade reasoning.

## Method

Rendered the live homepage header in a real browser (Playwright + Chromium,
`ignoreHTTPSErrors`) at the three standard viewports (375, 768, 1280) and the three
boundary viewports (991, 992, 993), smallest first. For each: captured an element
screenshot of the `header` region, measured `document.documentElement.scrollWidth`
vs `window.innerWidth` for the overflow precondition, and read computed
`display`/`visibility`/`clientHeight` for the hamburger
(`[data-drupal-selector="mobile-nav-button"]`) and the inline `.primary-menu`.

Screenshots: `docs/pl2/handoffs/screenshots/W-06-20260614-142007/`
(`t3-homepage-header-<viewport>-live-20260614.png`).

## Overflow precondition (smallest viewport first)

| Viewport | scrollWidth | innerWidth | Overflow? |
|---|---|---|---|
| 375 | 360 | 375 | No — PASS |
| 768 | 753 | 768 | No |
| 991 | 976 | 991 | No |
| 992 | 977 | 992 | No |
| 993 | 978 | 993 | No |
| 1280 | 1265 | 1280 | No |

No horizontal overflow at any viewport, including the smallest. T3 structural
precondition satisfied.

## Boundary behavior — hamburger vs inline nav

| Viewport | Hamburger (display / clientHeight) | Inline `.primary-menu` (display / clientHeight) | Mode | Screenshot confirms |
|---|---|---|---|---|
| 375 | block / 42 (44px rect) | none / 0 | Mobile | Logo + hamburger only — PASS |
| 768 | block / 42 | none / 0 | Mobile | Logo + hamburger only — PASS |
| 991 | block / 42 | none / 0 | Mobile | Logo + hamburger only — PASS |
| 992 | none / 0 | block / 58 | Desktop | Inline nav, all 6 labels — PASS |
| 993 | none / 0 | block / 58 | Desktop | Inline nav, all 6 labels — PASS |
| 1280 | none / 0 | block / 23 | Desktop | Inline nav, single-line labels — PASS |

The transition is exactly at 992px: at 991 the hamburger is the sole nav control and
the inline menu is `display:none`; at 992 the hamburger is `display:none` and the inline
menu is visible. There is no integer width where both or neither nav is shown
(complementary `>= 992` / `< 992` operators), and no overlap between the two states.

## Visual checklist (rendered evidence)

| Item | Result |
|---|---|
| Mobile header (375/768/991): logo + hamburger present, correctly placed | PASS |
| Hamburger touch target ≥ 44×44 (44px rect at mobile) | PASS |
| Desktop header (992/993/1280): inline nav with all 6 labels (Services · How we do it · Articles · Open source projects · About us · Contact us) | PASS |
| Logo intact and aligned in both modes | PASS |
| No overlap / clipping / truncation of nav items at the 992 transition | PASS — labels wrap to two lines at the tight 992/993 width but remain fully legible and non-overlapping; reflow to single line by 1280 |
| No horizontal overflow at 375 | PASS |
| No header breakage at any of the six viewports | PASS |

Note (advisory, not a finding): at exactly 992–993px the inline labels wrap to two
lines ("How we do / it", "Open source / projects", "About / us", "Contact / us") because
that is the tightest width at which inline mode engages. This is expected and pre-existing
behavior for the inline nav at its narrowest — it is legible, non-overlapping, and within
the viewport. It is inherent to the inline layout at the new floor, not a regression
introduced by the threshold change, and there is no new design to diff against.

## WCAG / accessibility

No color, typography, spacing, or structural values changed by W-06 (CSS media-query
threshold only). Contrast, heading hierarchy, landmarks, and ARIA are unaffected, per
T's axe-core runs (the two pre-existing serious violations are page-body elements
`.button--primary` and `.heal-flow`, neither in the header/nav, unrelated to this diff).
Hamburger touch target measured at 44px — meets WCAG 2.5.5. No new a11y concern.

## Verdict

**PASS.** The mobile/hamburger header renders correctly at ≤991, the inline desktop nav
renders correctly at ≥992, the header is not broken/overlapping/clipped at the 992
transition, and there is no horizontal overflow at 375. Rendered-browser evidence at all
six viewports confirms the breakpoint relocation behaves as intended with no visual
regression.

S complete.
