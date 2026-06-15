# Triage — render-001 (homepage render-phase audit)

**Date:** 2026-06-12
**Report:** `website-audit-homepage-render.html` (4 critical / 10 warning / 1 info as written by W)
**Triaged by:** O — every W finding verified against source before decomposition.

## Verdicts

| W finding | Verdict | Disposition |
|---|---|---|
| CTA button contrast 2.19:1 (white on teal `rgb(98,187,203)`) | **CONFIRMED** (axe + numeric agree) | → issue W-05 |
| Teal link text 3.55:1 on white (`rgb(24,147,180)`, all card/icon-list links) | **CONFIRMED** (axe + numeric agree) | → issue W-05 (same root token) |
| Hamburger visible at 768px "breakpoint not firing" | **MISREAD** — hamburger below the breakpoint is correct. But it surfaced a real mismatch: CSS hides at `width > 1000px` (`mobile-nav-button.css:20`), contract says 992px | → issue W-06 (downgraded to warning) |
| Skip link 42×18 below 44×44 | **DOWNGRADED** — visually-hidden-until-focus pattern (`dripyard_base/components/_drupal/skip-link/skip-link.css`); the rule applies to the *focused* state, which the harness didn't measure | follow-up: measure focused state in a future render pass |
| `--theme-text` / `--color-brand-primary` resolve empty | **INVALID — harness artifact.** Those token names don't exist in the theme chain and nothing consumes them; the harness's THEME_VARS list guessed wrong names. `render-inspect.cjs` fixed 2026-06-12 | none |
| Touch-target warnings (footer/inline links under 44px) | **PLAUSIBLE, batched** — inline links in text have different severity than controls; revisit with focused-state data | follow-up backlog |
| No horizontal overflow at any viewport; nav inline at 1280 | clean ✓ | none |

## Lesson recorded

W's render findings must be O-triaged against source before decomposition — this first run produced 2 confirmed criticals, 1 useful misread, and 2 harness artifacts out of 4 "criticals". The harness must only query token names that exist (fixed in `scripts/render-inspect.cjs`).
