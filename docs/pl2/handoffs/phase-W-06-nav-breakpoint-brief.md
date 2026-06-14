# Brief — W-06: align header nav breakpoint 1000px → 992px

**Branch:** `aa/pl-neonbyte-W-06-nav-breakpoint`
**Tri-review of brief:** on   **Tri-review of diff:** on   (nav/header = high blast radius)
**Mode:** autonomous
**Handoff output:** `docs/pl2/handoffs/phase-W-06-nav-breakpoint-F.md`

## Objective
Change the header navigation breakpoint from **1000px to 992px** (the documented
`navbar-expand-lg` contract) consistently across all header component CSS.

## Survey findings (O — read before starting)
- The header is **internally consistent at 1000px today** — every nav-related `@media` query
  uses `width > 1000px` / `width <= 1000px` / `width < 1000px`. There is no stray value and no
  CSS/JS mismatch.
- **The JS needs no change.** `isDesktopNav()` in `header/header.js` returns
  `mobileNavigationButton.clientHeight === 0` — it derives the mode from whether the hamburger
  is visible (CSS-controlled). So moving the CSS breakpoint moves the JS behavior automatically.
- Therefore this is a **shared-breakpoint value change only** — operators per `@media`, layout,
  and everything else stay exactly as they are.

## Brief-gate reconciliation (O, after tri-review)
- **B-1 (build pipeline) — resolved:** `themes/neonbyte/package.json` has no build scripts (only
  stylelint), there are no `.scss`/`.pcss` sources, and the header `.css` files are git-tracked
  sources. Hand-editing the CSS is safe; nothing regenerates it.
- **B-2 (other JS breakpoints) — resolved:** repo-wide grep finds no theme JS comparing width to
  1000/992/999 or using `innerWidth`/`matchMedia`. Only `isDesktopNav()` (clientHeight), which
  derives from CSS. No JS change.
- **B-3 (behaviour at exactly 992) — adopted:** a literal value swap keeping the strict `>`
  operators would put the desktop floor at 993 (off-by-one). **Normalize to min-width semantics
  so 992 is the desktop floor** (see Scope) and add the explicit 992 acceptance check.

## Scope — normalize each header nav `@media` breakpoint to 992 (min-width semantics)
Inside `@media (width …)` conditions **only**, in the files below, apply this mapping (this also
fixes a pre-existing 1px gap where some files paired `< 1000` mobile with `> 1000` desktop):
- desktop/wide conditions  `(width > 1000px)`            → `(width >= 992px)`
- mobile/narrow conditions `(width <= 1000px)` / `(width <=1000px)` / `(width < 1000px)` → `(width < 992px)`

Everything else in each rule stays identical. Files:
- `themes/neonbyte/components/header/mobile-nav-button/mobile-nav-button.css`
- `themes/neonbyte/components/header/language-switcher/language-switcher/language-switcher.css`
- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.css`
- `themes/neonbyte/components/header/primary-menu/primary-menu-narrow.css`
- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.theme.css`
- `themes/neonbyte/components/header/primary-menu/primary-menu-narrow.theme.css`
- `themes/neonbyte/components/header/header-search/header-search.css`
- `themes/neonbyte/components/header/header/header.css`

Do **not** change any `1000` that is not a media-query breakpoint (there are none expected, but
verify — leave content widths, etc. alone). Do **not** touch the JS.

## Acceptance criteria
- [ ] No `1000px` remains in any header `@media` condition.
- [ ] Desktop/wide conditions use `(width >= 992px)`; mobile/narrow use `(width < 992px)`.
- [ ] **At exactly 992px: inline (desktop) nav shown, hamburger hidden** (the navbar-expand-lg floor).
- [ ] 991px → hamburger; 993px → inline nav; **no width where both or neither nav is shown**.
- [ ] No JS changes; no `!important`, no new selectors, no layer changes.

## Constraints
- Value-only change; mobile-first authoring already in place (don't restructure queries).
- This is a high-blast-radius shared change — expect the diff tri-review + per-change
  blast-radius gate to scrutinize it.
