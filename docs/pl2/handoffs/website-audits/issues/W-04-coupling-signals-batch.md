# W-04 — Document / address coupling signals batch (z-index, JS offset, hero negative margin)

**Source:** W static audit `neonbyte-static-20260518`
**Dimension:** coupling-signals
**Severity:** WARNING (documentation + minor fixes)
**Branch:** `aa/pl-neonbyte-W-04-coupling-signals`
**Handoff output path:** `docs/pl2/handoffs/W-04-F.md`

## Objective

Address three coupling signals flagged by W. Two need inline comments explaining the intentional dependency; one (z-index) needs a comment and a value check. No behaviour changes are expected.

---

## Finding A — Undocumented z-index: 20 in region.css

**File:** `themes/neonbyte/css/layout/region.css`

```css
.region--fixed-middle-right {
  position: fixed;
  z-index: 20;
  ...
}
```

`z-index: 20` is high enough to risk future stacking conflicts. There is no comment explaining why this value was chosen or what it must sit above.

**Acceptance criteria:**
- [ ] Add a comment above the `z-index` declaration explaining what this region must stack above and why 20 was chosen.
- [ ] If the value can be safely lowered (e.g. to 10–12) without visual regression, lower it and document the new value.

---

## Finding B — JS-coupled dropdown width in primary-menu-wide.css

**File:** `themes/neonbyte/components/header/primary-menu/primary-menu-wide.css`

```css
.primary-menu__list--level-2 {
  width: calc(100% + var(--offset-from-header, 250px) - var(--header-padding-inline));
}
```

The `250px` fallback is baked in and may not match the actual header offset if JS fails to set `--offset-from-header`.

**Acceptance criteria:**
- [ ] Add a comment above this rule documenting: (a) that `--offset-from-header` is set by JS, (b) what the expected range of values is, (c) whether 250px is a safe fallback or a legacy placeholder.
- [ ] If the fallback value is wrong, correct it to the actual default offset.

---

## Finding C — Hero negative margin on parent (hero.css)

**File:** `themes/neonbyte/components/hero/hero.css`

```css
&.hero--position-against-screen-top {
  padding-top: var(--space-for-fixed-header);

  :is(.dy-section, .layout-dynamic):has(&) {
    margin-top: calc(-1 * var(--space-for-fixed-header));
    overflow: revert;
  }
}
```

Both `padding-top` and the parent's negative `margin-top` must stay in sync via `--space-for-fixed-header`. There is no comment making this explicit.

**Acceptance criteria:**
- [ ] Add an inline comment noting that `padding-top` and `margin-top` are intentionally paired via `--space-for-fixed-header` and must change together.

---

## Constraints

- All three findings are documentation/comment fixes only, unless the z-index value can be safely reduced.
- Do not change any layout behaviour.
- Scope: `region.css`, `primary-menu-wide.css`, `hero.css`.
