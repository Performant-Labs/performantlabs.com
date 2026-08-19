# W-03 — Tokenise hardcoded -150px margin in header-article.css

**Source:** W static audit `neonbyte-static-20260518`
**Dimension:** coupling-signals
**Severity:** WARNING
**Branch:** `aa/pl-neonbyte-W-03-header-article-margin`
**Handoff output path:** `docs/pl2/handoffs/W-03-F.md`

## Objective

Replace the hardcoded `margin-top: -150px` on the article header image with a CSS custom property so the value can be adjusted alongside parent spacing without hunting for a magic number.

## Background

W found a hardcoded negative margin in `header-article.css`:

```css
/* themes/neonbyte/components/header-article/header-article.css */
.header-article__image[class] {
  img {
    width: 100%;
    margin-top: -150px;
  }
}
```

The `150px` is compensating for spacing added at a parent level. If that parent spacing ever changes, this value must also change — but there is no token linking them, so the dependency is invisible.

## Input files to read

- `themes/neonbyte/components/header-article/header-article.css` — full file
- `themes/neonbyte/css/_variables/variables-layout.css` — look for an existing spacing token that corresponds to `150px`; use it if it exists

## Acceptance criteria

- [ ] A CSS custom property (e.g. `--header-article-image-offset`) is declared in `.header-article__image[class]` defaulting to `150px`.
- [ ] `margin-top: -150px` is replaced with `margin-top: calc(-1 * var(--header-article-image-offset))`.
- [ ] If an existing spacing token in `variables-layout.css` already equals `150px`, use that instead of introducing a new variable — document the decision in the handoff.
- [ ] No visual change — the rendered offset remains `150px` by default.
- [ ] No other files changed.

## Constraints

- Single file unless a matching token exists in `variables-layout.css`.
- Do not introduce a new token at the theme layer — this is a component-scoped variable.
