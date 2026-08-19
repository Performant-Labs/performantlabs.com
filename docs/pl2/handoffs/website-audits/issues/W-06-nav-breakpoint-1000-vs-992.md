# W-06 — Nav breakpoint mismatch: CSS hides hamburger at 1000px, contract says 992px

**Source:** render-001 audit (2026-06-12) — surfaced by a misread finding, confirmed against source during triage
**Dimension:** render-cascade (responsive)
**Severity:** WARNING
**Branch:** `aa/pl-neonbyte-W-06-nav-breakpoint`
**Handoff output path:** `docs/pl2/handoffs/W-06-F.md`

## Background

The documented header contract (design brief; `navbar-expand-lg` convention) puts the hamburger/inline-nav switch at **992px**. The CSS hides the hamburger at:

```css
/* themes/neonbyte/components/header/mobile-nav-button/mobile-nav-button.css:20 */
@media (width > 1000px) {
  display: none;
}
```

Between 992 and 1000px the rendered behavior contradicts the contract. Check whether the inline nav's own appearance breakpoint (in primary-menu / header CSS or `isDesktopNav()` in JS) also uses 1000 — if hamburger and inline nav switch at *different* widths, there is a window with both or neither visible, which is the worse bug.

## Input files to read

- `themes/neonbyte/components/header/mobile-nav-button/mobile-nav-button.css`
- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.css` (+ any media queries in primary-menu CSS)
- `themes/neonbyte/components/header/header/header.js` and `primary-menu.js` — `isDesktopNav()` width constant
- `themes/neonbyte/css/_variables/` — check for an existing breakpoint token

## Acceptance criteria

- [ ] Survey ALL nav-related breakpoints (CSS + JS) and report each value found.
- [ ] If they disagree among themselves or with 992: align every one to a single value via one shared token/constant; default to 992 per the contract, OR — if 1000 is intentional everywhere — document that and propose updating the contract instead (escalate to O).
- [ ] No window where hamburger and inline nav are both visible or both hidden.
- [ ] T verifies rendered nav state at 991, 993 (and 1001 if relevant) via Playwright.
