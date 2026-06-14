# W-02 — Fix possible undefined token reference in theme-primary.css and theme-secondary.css

**Source:** W static audit `neonbyte-static-20260518` (out-of-scope catch)
**Dimension:** variable-chain
**Severity:** HIGH (potential undefined variable — renders as empty/inherited)
**Branch:** `aa/pl-neonbyte-W-02-token-typo`
**Handoff output path:** `docs/pl2/handoffs/W-02-F.md`

## Objective

Locate and fix the suspected undefined token reference `--color-text-color-loud` in `theme-primary.css` and `theme-secondary.css`. The correct token is `--theme-text-color-loud` — confirm the typo, trace its usage, and correct it.

## Background

W noticed (outside the requested scope) that `theme-primary.css` and `theme-secondary.css` reference `--color-text-color-loud` in button text color definitions. The correct token in this codebase is `--theme-text-color-loud` (defined in `theme-white.css`). The `--color-` prefix does not follow the naming convention and is not declared anywhere — this would silently resolve to `unset`/inherited, causing button text to fall through to the browser default rather than the intended theme color.

## Input files to read

- `themes/neonbyte/css/themes/theme-primary.css`
- `themes/neonbyte/css/themes/theme-secondary.css`
- `themes/neonbyte/css/themes/theme-white.css` — source of truth for correct token names
- `themes/neonbyte/css/_variables/variables-colors-semantic.css` — confirm `--color-text-color-loud` is not declared anywhere

## Acceptance criteria

- [ ] Confirm whether `--color-text-color-loud` is declared anywhere in the theme. If it is declared, this issue is a false positive — close with a note.
- [ ] If undeclared: replace all occurrences of `--color-text-color-loud` with the correct token (`--theme-text-color-loud` or whichever token W's remediation identifies as correct after reading the files).
- [ ] Grep the full neonbyte theme for any other `--color-text-color-*` references to catch the same typo pattern elsewhere.
- [ ] No other token names changed as a side effect.
- [ ] Handoff confirms: token was undefined (or declared — either result is valid).

## Constraints

- Scope: `theme-primary.css`, `theme-secondary.css`, and any other file where the same typo pattern is found.
- Do not rename correctly-named tokens.
