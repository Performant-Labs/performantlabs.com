# Handoff-S: Sprint 16 Cycle 2 — Form a11y batch (F-NEW-16-B + F-NEW-16-C)

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-16-cycle-2-form-a11y`
**Issue:** `docs/pl2/handoffs/sprint-16-cycle-2-issue.md`
**Handoff-T reviewed:** `docs/pl2/handoffs/sprint-16-cycle-2-T.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-16-cycle-2-F.md`
**Cycle 1 audit baseline:** `docs/pl2/handoffs/sprint-16-cycle-1-audit.md`
**Operator-facing report:** [`sprint-16-cycle-2-report.html`](sprint-16-cycle-2-report.html)
**Scope:** **Scoped re-audit** — F-NEW-16-B (autocomplete tokens) + F-NEW-16-C (required-marker no-op). Full visual matrix from Cycle 1 not re-run; Cycle 1 deltas (F-NEW-16-A / -D / -E / -F / -G) deferred to Cycles 3-4 as planned.

---

## T precondition

Confirmed — T reported zero blocking issues; all Tier 1 (T1-1 through T1-5) and Tier 2 (T2-1 through T2-7) checks PASS, plus regression check on `/articles` HTTP 200 and clean watchdog.

## Browser-tool / visual-diff preconditions

| Precondition | Status |
|---|---|
| Playwright installed (`node_modules/playwright`) | PASS |
| ImageMagick `compare` on PATH (`/opt/homebrew/bin/compare`) | PASS |
| Live `/contact-us` reachable (HTTPS 200) | PASS |
| `/articles` reachable (HTTPS 200) | PASS |

## Diff sanity

`git diff --name-only main` for code-bearing paths returns exactly one file:

- `web/themes/custom/performant_labs_20260502/performant_labs_20260502.theme`

No CSS, no template, no module, no `config/sync/*.yml`. All other diff entries are Cycle 1 audit artifacts / handoff docs / capture scripts (non-code).

Hook diff content review (`git diff main -- ...theme`):

- **Articles block** preserved with identical semantics: theme_wrappers strip, slug→TID lookup, invalid-slug→0 fallback. Restructured from early-return into a conditional `if` branch. Numeric-slug short-circuit retained inline (`!empty($slug) && !is_numeric($slug)`).
- **Contact webform block** added as a second `if` branch, scoped via `str_starts_with($form_id, 'webform_submission_contact_form_') && str_ends_with($form_id, '_add_form')` — correctly limited to the contact webform regardless of Canvas placement.
- Autocomplete attrs injected at `$form['elements'][$key]['#attributes']['autocomplete']`.
- No `!important`. No structural HTML changes. No new CSS file.

## Tier 3 visual audit (scoped — form region only)

Per scope memo, the full Cycle-1 capture matrix is NOT re-run. The autocomplete fix is an HTML attribute that does not affect rendered pixels (browsers do not visually display `autocomplete` tokens), and F-NEW-16-C was confirmed a no-op (no code change). The only relevant visual artifact is the form region itself, captured for the operator report:

| Viewport | Form region live PNG |
|---|---|
| 1280×800 | `screenshots/sprint-16-cycle-2/t3-contact-form-1280-live-20260513.png` |
| 375×667  | `screenshots/sprint-16-cycle-2/t3-contact-form-375-live-20260513.png` |

No pixel-diff vs preview is computed for this cycle because (a) the preview already had the correct autocomplete tokens per Cycle 1 sanity check (preview is canonical here), (b) the required-marker was already visually correct on live per Cycle 1 (the audit's Cycle-1 "color" probe error did not correspond to a visible regression), and (c) all other form-region pixel deltas observed in Cycle 1 remain unchanged and are scoped to Cycles 3-4.

## S-level re-probe (Playwright, 1280 + 375)

Probe script: `scripts/sprint-16-cycle-2-probe.mjs`. Raw output: `docs/pl2/handoffs/screenshots/sprint-16-cycle-2/probe-results.json`.

### autocomplete tokens — both viewports identical

| Element name | Type | Rendered `autocomplete` | Expected | Match |
|---|---|---|---|---|
| `name` | input[type=text] | `name` | `name` | YES |
| `email` | input[type=email] | `email` | `email` | YES |
| `company_name` | input[type=text] | `organization` | `organization` | YES |
| `phone_number` | input[type=tel] | `tel` | `tel` | YES |
| `message` | textarea | (null) | (none — free text, no semantic mapping) | YES |
| `url` (honeypot) | input[type=text] | `off` | `off` | YES |
| `honeypot_time` | input[type=hidden] | (null) | n/a (hidden) | YES |

All four semantic tokens applied to the correct named inputs at both 1280×800 and 375×667.

### Required-marker — both viewports identical

| Required field label | `::after` background-color | `::after` color | mask-image |
|---|---|---|---|
| "Your name"    | `rgb(142, 74, 42)` = `#8E4A2A` | `rgb(92, 84, 76)` (invisible under mask) | inline SVG asterisk |
| "Your email"   | `rgb(142, 74, 42)` = `#8E4A2A` | `rgb(92, 84, 76)` | inline SVG asterisk |
| "Your message" | `rgb(142, 74, 42)` = `#8E4A2A` | `rgb(92, 84, 76)` | inline SVG asterisk |

Visually rendered color is `#8E4A2A` = `--pl-accent-deep` (brief mandate). F-NEW-16-C confirmed as no-op — the existing `webform.css` L5 override was already producing the correct color; the Cycle 1 audit measured the wrong CSS property (`color` instead of `background-color`).

### Articles cross-page regression

| Check | Result |
|---|---|
| `/articles` HTTP status | 200 |
| `<form id="views-exposed-form-articles-page-1">` wrapper present | NO (correctly stripped via `#theme_wrappers = []`) |

Phase 3 articles exposed-form behavior preserved after hook restructure. No regression.

## WCAG 2.2 AA audit (scoped)

| Check | Result | Notes |
|---|---|---|
| 1.3.5 Identify input purpose | PASS | All four semantic autocomplete tokens applied to correct fields; previously the new live regression flagged in Cycle 1 (all fields had `autocomplete=null`). Now closed. |
| 1.4.11 Non-text contrast (required marker) | PASS | `#8E4A2A` on `#FFFFFF` = 6.64:1, clears 3:1 floor (and 4.5:1 AA body floor). T independent computation agrees with F. |
| 3.3.2 Labels or instructions | PASS | All required fields have `<label>` association; required state marked via `.form-required` pseudo + `aria-required` (preserved from Cycle 1). |
| Heading hierarchy | UNCHANGED from Cycle 1 (PASS) | This cycle did not modify markup or headings. |
| Keyboard navigation / focus / forced-colors / reduced-motion / 200% zoom / image alt | UNCHANGED from Cycle 1 | This cycle is HTML-attribute-only; no risk of regression. |
| Mobile (375): touch targets, typography scale, layout | UNCHANGED from Cycle 1 | No CSS, no responsive overrides added. |

## Static preview comparison

Preview at `docs/pl2/Previews/contact-us.html` was confirmed in Cycle 1 to already carry the correct autocomplete tokens and the correct `--accent-deep` required-marker color. Live now matches preview on both axes. Other preview ↔ live deltas (sidebar H2, sidebar card, §C H2, §D primary token, CTA stacking) are scoped to Cycles 3-4 and are not touched by this branch.

## Cycle 1 audit-row update — WCAG 1.3.5

| Finding | Cycle 1 status | Cycle 2 status |
|---|---|---|
| F-NEW-16-B (autocomplete tokens missing on live) | NEW live regression — FAIL | **CLOSED** (PASS at 1280 + 375; all four tokens correct) |
| F-NEW-16-C (required-marker reported as body color) | FAIL (audit probed wrong property) | **CLOSED** (no-op verified; `background-color` = `#8E4A2A` already correct) |
| F-NEW-16-A (sidebar H2 size) | Open | Open (Cycles 3-4 scope, not regressed) |
| F-NEW-16-D (sidebar card wrapper) | Open | Open (Cycles 3-4 scope, not regressed) |
| F-NEW-16-E (§C "What to expect" H2) | Open | Open (Cycles 3-4 scope, not regressed) |
| F-NEW-16-F (§D primary CTA token) | Open | Open (Cycles 3-4 scope, not regressed) |
| F-NEW-16-G (CTA stacking) | Open | Open (Cycles 3-4 scope, not regressed) |

## Verdict

**PASS** — all scoped acceptance criteria met:

1. F-NEW-16-B autocomplete tokens correctly applied to `name` / `email` / `company_name` / `phone_number` at both 1280 and 375. WCAG 1.3.5 closed on live.
2. F-NEW-16-C no-op verified: required-marker `background-color` already renders as `#8E4A2A`; existing webform.css override produces correct visual result. WCAG 1.4.11 contrast = 6.64:1 (PASS).
3. No code outside the single theme file. No `!important`. No structural form changes.
4. Articles cross-page regression clean (HTTP 200, theme_wrappers strip preserved).
5. No surprise side-effects on adjacent form visuals (form region screenshots at 1280 and 375 captured for operator review).

Ready for O to commit.

## Advisory notes

1. **Cycles 3-4 backlog unchanged.** The five remaining Cycle 1 findings (F-NEW-16-A, -D, -E, -F, -G) are explicitly out of scope for this cycle and remain open. Operator should kick those into Cycle 3 per the Sprint 16 runbook.
2. **F-NEW-16-C audit-probe lesson.** Cycle 1's measurement error (probing `color` instead of `background-color` on a mask-image asterisk) is a one-line fix to the standard required-marker probe — recommend updating the audit probe template to read both properties when a `mask-image` is detected on the pseudo-element. Not blocking; noted for future audit hygiene.
