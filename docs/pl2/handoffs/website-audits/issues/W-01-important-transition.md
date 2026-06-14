# W-01 — Remove `!important` from transition in primary-menu-wide.theme.css

**Source:** W static audit `neonbyte-static-20260518`
**Dimension:** css-layer-hierarchy
**Severity:** CRITICAL
**Branch:** `aa/pl-neonbyte-W-01-important-transition`
**Handoff output path:** `docs/pl2/handoffs/W-01-F.md`

## Objective

Remove the `!important` declaration from the `transition` property on dropdown menu link selectors in `primary-menu-wide.theme.css`. Replace it with a correct cascade approach (specificity or layer placement).

## Background

W found an `!important` on the `transition` property inside a `.theme.css` component file:

```css
/* themes/neonbyte/components/header/primary-menu/primary-menu-wide.theme.css */
.primary-menu__link--level-2[class],
.primary-menu__link--level-3[class] {
  ...
  transition: --link-text-cover-percent 0.3s, color 0.3s !important;
}
```

This creates a cascade debt spiral — every future override of this transition must also use `!important`. The `.theme.css` file is a component CSS file (Layer 5 / `component` weight); there is no valid reason for `!important` here.

## Input files to read

- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.theme.css` — contains the violation
- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.css` — base component styles; understand existing specificity before touching `.theme.css`
- `themes/neonbyte/css/themes/theme-white.css` — check if any theme-level rule overrides this transition

## Acceptance criteria

- [ ] The `!important` is removed from the `transition` declaration.
- [ ] The transition still applies correctly — no regression in the dropdown animation.
- [ ] If a specificity conflict was causing the `!important`, that conflict is resolved at the correct layer instead.
- [ ] No `!important` anywhere in the changed files after the fix.
- [ ] Handoff documents the root cause: why was `!important` added, and what was it fighting?

## Constraints

- Do not add `!important` elsewhere as a workaround.
- Do not flatten specificity by removing selectors — find the conflict and fix it.
- Scope: `primary-menu-wide.theme.css` and any file whose specificity conflict necessitated the `!important`. Do not touch unrelated files.
