# Issue: Sprint 16 Cycle 2 — Form a11y batch (F-NEW-16-B + F-NEW-16-C)

**Branch:** `aa/pl-sprint-16-cycle-2-form-a11y`
**Sprint:** 16
**Mode:** Autonomous
**Pipeline:** F → T → S

## Objective

Land two form-specific accessibility fixes on live `/contact-us`:

1. **F-NEW-16-B** — Add `autocomplete` tokens to form inputs (`name`, `email`, `organization`, `tel` per HTML5 autofill spec) to satisfy WCAG 1.3.5 (Identify input purpose). Preview already correct; live currently has `autocomplete=null` on every field — a NEW WCAG fail surfaced this cycle.
2. **F-NEW-16-C** — Required-field marker `*` color is currently body color (`rgb(92, 84, 76)` = `#5C544C`) on live; brief mandates `--accent-deep` (`#8E4A2A`). Preview already correct.

## Input documents

- [ ] `docs/pl2/handoffs/sprint-16-cycle-1-audit.md` §"F-NEW-16-B" and §"F-NEW-16-C" — finding details + computed-style probes
- [ ] `docs/pl2/Previews/contact-us.html` — preview reference for correct autocomplete tokens + required-marker color
- [ ] `docs/pl2/briefs/pl_design_brief.md` — brief mandate for `--accent-deep` (`#8E4A2A`) accent token
- [ ] `docs/pl2/theme-change--workflow.md` — 7-step CSS workflow (for the required-marker color fix layer trace)

## Acceptance criteria

- [ ] **F-NEW-16-B.** Every relevant form input on live `/contact-us` carries an HTML5 `autocomplete` token matching its semantic purpose. Minimum mapping per Cycle 1 audit:
  - Name field → `autocomplete="name"`
  - Email field → `autocomplete="email"`
  - Organization / company field → `autocomplete="organization"`
  - Phone field → `autocomplete="tel"`
  Any additional fields F discovers on the live form should get appropriate tokens per https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill or remain unspecified if no semantic mapping fits.
- [ ] **F-NEW-16-C.** Live `.form-required` (or whatever selector renders the required-marker `*` — confirm by trace) computes `color: rgb(142, 74, 42)` = `#8E4A2A` = brief's `--accent-deep`. Preserve the asterisk content; only color changes.
- [ ] No form structural changes beyond the two fixes above.
- [ ] No `!important`.
- [ ] Stage by explicit path.

## Trace expectations

The form on `/contact-us` is a Drupal webform. F-NEW-16-B is a config change (webform field definitions need `#attributes['autocomplete']` set per field) — not a CSS file. F should:

1. Identify the webform machine name (likely `contact` or similar). Check via `ddev drush wfx` (Webform Export) or by reading the rendered HTML form `id`/`data-webform-id`.
2. Decide between (a) updating webform config YAML in `config/sync/webform.webform.*.yml`, or (b) implementing a `hook_webform_element_alter()` in the theme (more flexible, less invasive to config). Choose per project precedent — read existing custom hooks in `web/themes/custom/performant_labs_20260502/performant_labs_20260502.theme` first.
3. F-NEW-16-C is a CSS color rule. Trace `.form-required` or equivalent selector via 7-step workflow. Likely L3 token or L5 component CSS (form override).

## Verification (F runs T1+T2)

- T1: `ddev drush cr`; curl `/contact-us` and grep for `autocomplete="name"`, `autocomplete="email"`, `autocomplete="organization"`, `autocomplete="tel"` — all should appear.
- T2: render the page via Playwright; probe `.form-required` (or equivalent) `color` computed-style — should be `rgb(142, 74, 42)`.
- WCAG: required-marker on white surface `#8E4A2A` vs `#FFFFFF` contrast ≥ 3:1 (non-text contrast for state-conveying decoration). Compute and report.

## Handoff

Write your handoff to: `docs/pl2/handoffs/sprint-16-cycle-2-F.md` per F template.

## Operating rules

- 7-step workflow for the CSS fix (F-NEW-16-C).
- For F-NEW-16-B, the trace should reveal whether webform config or theme hook is the right layer. Document the rationale.
- No `!important`. Stage by explicit path.
- Per memory `feedback_no_orphan_words.md` — no copy/heading changes expected; no orphan risk.
