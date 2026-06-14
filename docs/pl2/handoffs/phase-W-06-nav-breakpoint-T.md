# Handoff-T: Phase W-06 — Align header nav breakpoint 1000px → 992px

**Date:** 2026-06-14
**Branch:** `aa/pl-neonbyte-W-06-nav-breakpoint`
**Issue:** W-06
**Handoff-A reviewed:** `docs/pl2/handoffs/phase-W-06-nav-breakpoint-A.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/phase-W-06-nav-breakpoint-F.md`

---

## A precondition

Confirmed: A returned PASS (verdict 2026-06-14). No blocking findings. Two advisory notes recorded: pre-existing `!important` in `header-search.css` forced-colors block (out of scope), and documentation drift in component `.md` files still describing 1000px (docs-only follow-up). Neither blocks this phase.

---

## T1 results

| Check | Command / Method | Expected | Actual | Result |
|---|---|---|---|---|
| Cache-clear | `ddev drush cr` | `[success] Cache rebuild complete.` | `[success] Cache rebuild complete.` | PASS |
| HTTP 200 | `curl -sk -o /dev/null -w "%{http_code}" https://pl-performantlabs.com.3.ddev.site:8493/` | 200 | 200 | PASS |
| No `1000` in source files — 8 CSS files in `themes/neonbyte/components/header/` | `grep -rn "1000" [8 source files]` | No output (exit 1 = no match) | No output | PASS |
| No `1000` in web copy — 8 CSS files in `web/themes/contrib/neonbyte/components/header/` | `grep -rn "1000" [8 web files]` | No output | No output | PASS |
| 992 conditions in source files | `grep -rn "992" [8 source files]` | 33 occurrences, operators `>=` (desktop) and `<` (mobile) only | 33 occurrences; all `(width >= 992px)` or `(width < 992px)` | PASS |
| Served header.css contains no `1000` | `curl` the served file, `grep "1000"` | 0 matches | 0 matches | PASS |
| Served header.css contains 992 | `curl` the served file, `grep "992"` | 11 `@media` lines | 11 matches (6 `< 992px`, 5 `>= 992px`) | PASS |
| Served mobile-nav-button.css | `curl`, `grep "992\|1000"` | `(width >= 992px)` only | `@media (width >= 992px)` | PASS |
| Served primary-menu-wide.css | `curl`, `grep "992\|1000"` | `(width >= 992px)` | `@media (width >= 992px)` | PASS |
| Served primary-menu-narrow.css | `curl`, `grep "992\|1000"` | `(width < 992px)` | `@media (width < 992px)` | PASS |
| Served primary-menu-wide.theme.css | `curl`, `grep "992\|1000"` | `(width >= 992px)` | `@media (width >= 992px)` | PASS |
| Served primary-menu-narrow.theme.css | `curl`, `grep "992\|1000"` | `(width < 992px)` | `@media (width < 992px)` | PASS |
| language-switcher web copy: 12 × `992`, 0 × `1000` | `grep -c` in `web/themes/contrib` | 12 / 0 | 12 / 0 | PASS |
| header-search web copy: 5 × `992`, 0 × `1000` | `grep -c` in `web/themes/contrib` | 5 / 0 | 5 / 0 | PASS |

---

## T2 results

| Check | Method | Result |
|---|---|---|
| Heading hierarchy | N/A — CSS-only change; no template, markup, or semantic structure altered | N/A |
| ARIA landmarks | N/A — same | N/A |
| Semantic structure | N/A — same | N/A |
| New selectors | Confirmed by A's diff review (33 conditions changed, zero selectors added) | PASS |
| New `!important` | Confirmed by A (none introduced; the single pre-existing `background: none !important` is in a `forced-colors` block and predates W-06) | PASS |
| Layer compliance | All edits are inside existing `@media` conditions in Layer 5 component stylesheets; no layer drift | PASS |
| axe-core — mobile 375 | `AXE_BASE_URL=... node axe-check.cjs /` | 2 serious violations: `color-contrast` on `.hero__block-content > .button--primary.button.button--large`; `scrollable-region-focusable` on `.heal-flow` | Pre-existing (both are page-level, not header/nav elements; unrelated to this breakpoint diff) — advisory only |
| axe-core — desktop 1280 | Same | 1 serious violation: `color-contrast` on `.hero__block-content > .button--primary.button.button--large` | Pre-existing — advisory only |

The two axe violations are pre-existing across the site. Neither is on a header or nav element. W-06 is a media-query value substitution with no color, contrast, or scroll-region changes; it cannot have introduced either violation.

---

## T2.5 interaction results

**Surfaces touched:** W-06 changes CSS for `mobile-nav-button`, `primary-menu`, `language-switcher`, and `header-search` — all header components. Cross-referencing `docs/pl2/stateful-surfaces.md`:

- `mobile-nav-toggle-ephemeral` — enabled, ephemeral, directly touched by this change. **Run required.**
- `language-switcher-active-language` — disabled (second language not installed). Run not required.
- `header-search` — listed as ephemeral in the inventory; no enabled config entry exists for it. Run not required.

**mobile-nav-toggle-ephemeral run:**

Command:
```
STATE_INVARIANTS_CONFIG=scripts/state-invariants.config.json \
STATE_INVARIANTS_ONLY=mobile-nav-toggle-ephemeral \
NODE_PATH=/Users/andreangelantoni/Sites/pl-performantlabs.com.3/node_modules \
./node_modules/.bin/playwright test state-invariants.spec.js --reporter=line
```

Result: `1 passed (2.1s)`

The 4-step invariant confirms: open hamburger at 375px → navigate to /articles → go back → `aria-expanded` is `false` (ephemeral reset as expected). PASS.

---

## WCAG verification

No color, background, typography, or spacing values changed. WCAG contrast ratios are unaffected. The pre-existing violations noted in T2 above (`button--primary` contrast, `heal-flow` scrollable region) are out of scope for W-06 and were present before this diff.

Touch targets for `mobile-nav-button` (3rem × 3rem = 48px at default font-size) remain above the 44×44 CSS px WCAG 2.5.5 minimum throughout.

---

## Mobile responsive verification

**Playwright viewport tests — the 992 boundary:**

| Viewport | clientHeight of `[data-drupal-selector="mobile-nav-button"]` | isHidden | Mode |
|---|---|---|---|
| 991px | 42 | false | mobile / hamburger visible |
| 992px | 0 | true | desktop / inline nav (hamburger hidden) |
| 993px | 0 | true | desktop / inline nav (hamburger hidden) |

- 991px: hamburger VISIBLE (clientHeight > 0) — mobile nav. PASS.
- 992px: hamburger HIDDEN (clientHeight = 0) — desktop/inline nav. This is the exact `navbar-expand-lg` floor. PASS.
- 993px: hamburger HIDDEN — desktop/inline nav. PASS.
- No width where both or neither nav is shown (operators `>= 992` and `< 992` are exhaustive and mutually exclusive at every integer pixel). PASS.

---

## Acceptance criteria status

| Criterion | Evidence | Result |
|---|---|---|
| AC-1: No `1000px` in any header `@media` condition | `grep "1000"` on all 8 source files and all 8 web-copy files returns no output | PASS |
| AC-2: Desktop/wide conditions use `(width >= 992px)`; mobile/narrow use `(width < 992px)` | `grep "992"` on source files shows 33 occurrences; all are `>= 992px` or `< 992px`; confirmed in served CSS at `/themes/contrib/neonbyte/components/header/` | PASS |
| AC-3: At exactly 992px — inline (desktop) nav shown, hamburger hidden | Playwright: 992px → `clientHeight=0` (hamburger hidden) | PASS |
| AC-4: 991px → hamburger; 993px → inline nav; no width where both or neither nav is shown | Playwright: 991px `clientHeight=42` (visible); 993px `clientHeight=0` (hidden); complementary `>=`/`<` operators guarantee no gap/overlap | PASS |
| AC-5: No JS changes; no `!important`; no new selectors; no layer changes | A confirmed (diff review); grep on JS confirms no JS touched; axe `!important` note is pre-existing in forced-colors block only | PASS |

All 5 acceptance criteria: PASS.

---

## Blocking issues

None.

---

## Advisory notes

1. **Pre-existing axe violations** — `color-contrast` on `.hero__block-content > .button--primary` (mobile + desktop) and `scrollable-region-focusable` on `.heal-flow` are pre-existing site-level issues unrelated to this phase. They should be tracked as separate W-series items.
2. **Component `.md` documentation drift** — As noted by A, the `.md` files for `language-switcher`, `primary-menu`, `header-search`, `mobile-nav-button`, and `header/header` still describe the breakpoint as 1000px. A docs-only follow-up should update them to 992px.
3. **Web copy ephemerality** — F's autonomous decision to patch `web/themes/contrib/neonbyte/` in addition to the git-tracked `themes/neonbyte/` source was correct (the served CSS was verified clean). A's operator note about Composer install overwriting the web copy stands as a known infrastructure gap.

---

T complete. **Ready for S.**
