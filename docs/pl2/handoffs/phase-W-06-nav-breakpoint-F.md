# Handoff-F: Phase W-06 - Align header nav breakpoint 1000px to 992px

**Date:** 2026-06-14
**Branch:** `aa/pl-neonbyte-W-06-nav-breakpoint`
**Issue:** W-06

## Confirmation table (autonomous mode — informational)

| Field | Value |
|---|---|
| Page | Site-wide header / nav |
| Issue | W-06 |
| Branch | `aa/pl-neonbyte-W-06-nav-breakpoint` |
| Runbook phase | W-06 (nav breakpoint normalization) |
| Input documents read | `phase-W-06-nav-breakpoint-brief.md`, `frontend-pipeline-profile.md` |
| Acceptance criteria count | 5 |
| Handoff path | `docs/pl2/handoffs/phase-W-06-nav-breakpoint-F.md` |
| CSS workflow path | `docs/pl2/theme-change--workflow.md` |
| Component schema source | N/A — value-only change, no prop/slot/class authoring |

## What was done

- `themes/neonbyte/components/header/mobile-nav-button/mobile-nav-button.css` — 1 condition: `> 1000px` → `>= 992px`
- `themes/neonbyte/components/header/language-switcher/language-switcher/language-switcher.css` — 12 conditions: `<= 1000px` / `<=1000px` (no-space) → `< 992px` (×7); `> 1000px` → `>= 992px` (×5)
- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.css` — 1 condition: `> 1000px` → `>= 992px`
- `themes/neonbyte/components/header/primary-menu/primary-menu-narrow.css` — 1 condition: `<= 1000px` → `< 992px`
- `themes/neonbyte/components/header/primary-menu/primary-menu-wide.theme.css` — 1 condition: `> 1000px` → `>= 992px`
- `themes/neonbyte/components/header/primary-menu/primary-menu-narrow.theme.css` — 1 condition: `< 1000px` → `< 992px`
- `themes/neonbyte/components/header/header-search/header-search.css` — 5 conditions: `<= 1000px` → `< 992px` (×1); `> 1000px` → `>= 992px` (×2); `< 1000px` → `< 992px` (×2)
- `themes/neonbyte/components/header/header/header.css` — 11 conditions: `<= 1000px` / `<=1000px` (no-space) → `< 992px` (×6); `> 1000px` → `>= 992px` (×5)
- (Mirror) All 8 files also patched in `web/themes/contrib/neonbyte/components/header/` — the Composer-copied webroot copy (symlink disabled in composer.json; Drupal serves from here).

**Total: 33 breakpoint conditions normalized across 8 source files (+ 33 in web copy = 66 total file edits).**

## Layer decisions

7-step workflow trace:

- **Step 1 — Pass 1 (bottom-up):** The `@media (width > 1000px)` / `(width <= 1000px)` / `(width < 1000px)` conditions are authored directly in neonbyte component stylesheets. No variable chain; the value `1000px` is a literal in each `@media` condition.
- **Step 2 — Pass 2 (top-down):** These are component-level stylesheets within `themes/neonbyte/components/header/`. No parent-theme overrides or token wrappers involved. The value is the breakpoint literal itself.
- **Step 3 — Layer choice:** Layer 5 (component stylesheet). The change is inside existing component CSS files; no config layer (L1), no theme-token layer (L3) applies. The breakpoint value is hard-coded per-component, not a CSS custom property. **Self-approved per autonomous mode.**
- **Step 4 — Write:** Exact mapping applied per brief spec:
  - `(width > 1000px)` → `(width >= 992px)` (desktop floor is now inclusive at 992)
  - `(width <= 1000px)` / `(width <=1000px)` / `(width < 1000px)` → `(width < 992px)`
- **Step 5 — T1 + T2:** See verification section below.
- **Step 6 — No new selectors, no `!important`, no structural changes.**
- **Step 7 — Staged by explicit path (not `git add .`).**

No component reuse check required — this is a value-only change in existing components, not a new component.

## Architecture notes for A

- The brief confirmed the repo uses `"symlink": false` for the `dripyard/neonbyte` Composer path repository. This means `themes/neonbyte/` (git-tracked source) and `web/themes/contrib/neonbyte/` (Composer install target) are two independent copies. Both were patched identically. A/T should be aware that a future `composer install` will overwrite the `web/` copy from `themes/neonbyte/` — meaning the git-tracked source is the durable copy, and the web copy is ephemeral but must be in sync for the running site.
- The JS `isDesktopNav()` function derives desktop/mobile mode from `mobileNavigationButton.clientHeight === 0` (whether the hamburger is CSS-visible). No JS change was needed; the CSS breakpoint move automatically moves JS behavior as well (confirmed in brief B-2 reconciliation).
- No new dependencies. No cross-component effects beyond the breakpoint alignment itself.
- No Canvas components touched; `component_version` is not applicable.

## Deviations from spec

The brief called `(width <= 1000px)` and `(width <=1000px)` (no-space variant) both mapping to `(width < 992px)`. This was applied exactly — both spacing variants were handled with separate `sed` passes in no-space-first order to avoid partial match conflicts. No deviation from spec.

## Verification results (T1 + T2)

### T1 — Cache clear + served file check

```
ddev drush cr
→ [success] Cache rebuild complete.

curl -sk https://pl-performantlabs.com.3.ddev.site:8493/ → HTTP 200

# Source files (themes/neonbyte):
grep -rn "1000" [8 files] → (no output) PASS: no 1000 remaining

grep -rn "992" [8 files] → 33 occurrences:
  - >= 992px (desktop) and < 992px (mobile) exclusively

# Web copy (web/themes/contrib/neonbyte):
grep -rn "1000" [web header dir] → PASS: no 1000 remaining in web copy

# Served CSS after cache rebuild:
header.css (token tgn191):
   6 × width < 992px
   1 × width > 800px  (unrelated rule — correctly unchanged)
   5 × width >= 992px
   0 × 1000px

mobile-nav-button.css:
   1 × width >= 992px
   0 × 1000px
```

### T2 — Structural checks

- No heading hierarchy changes (CSS-only change).
- No ARIA changes.
- No new selectors or rules added.
- The breakpoint logic is logically consistent: at exactly 992px, `(width >= 992px)` is true (desktop nav shown, hamburger hidden); at 991px, `(width < 992px)` is true (hamburger shown, desktop nav hidden). No overlap, no gap — acceptance criteria AC-3 and AC-4 are structurally satisfied by the operator mapping.

## WCAG contrast ratios

No backdrop or color changes. This is a breakpoint value change only. WCAG contrast ratios are unchanged. Not applicable.

## Mobile responsive behavior

The change is mobile-first-compatible. Base (narrow) styles are already in `@media (width < 992px)` blocks; desktop styles scale up via `@media (width >= 992px)`. No restructuring of query order was performed — the authoring direction was already correct and was preserved.

The breakpoint shift from 1000 → 992 narrows the desktop-nav window by 8px. At 992px (which is the Bootstrap lg breakpoint and the documented `navbar-expand-lg` contract), the inline nav is now shown. At 991px, the hamburger is shown. Touch targets for the mobile-nav-button (3rem × 3rem = 48px × 48px at default font size) remain above the 44×44 CSS px minimum throughout.

## Autonomous decisions

1. **Web copy patch:** The brief did not mention that `web/themes/contrib/neonbyte/` is a separate non-symlinked copy that Drupal actually serves. Discovered during T1 verification when served CSS still showed 1000px after patching `themes/neonbyte/`. Conservative decision: patch both copies to keep the running site correct. The `themes/neonbyte/` source remains the durable git-tracked copy.
2. **No-space variant `<=1000px`:** Applied separate `sed` pass (no-space first, then spaced) to handle both spacing variants present in the source files, as specified in the brief's Scope mapping. Order was chosen to prevent the spaced pattern from pre-matching part of the no-space token.

## Known issues

None. All 5 acceptance criteria are met:
- AC-1: No `1000px` in any header `@media` condition — confirmed by grep.
- AC-2: Desktop uses `(width >= 992px)`; mobile uses `(width < 992px)` — confirmed by grep.
- AC-3: At exactly 992px, `(width >= 992px)` fires — desktop nav shown, hamburger hidden.
- AC-4: 991px → hamburger (`< 992px` true); 993px → inline nav (`>= 992px` true). No overlap, no gap.
- AC-5: No JS changes; no `!important`; no new selectors; no layer changes.

## Files changed

Source files (git-tracked):
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/mobile-nav-button/mobile-nav-button.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/language-switcher/language-switcher/language-switcher.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/primary-menu/primary-menu-wide.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/primary-menu/primary-menu-narrow.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/primary-menu/primary-menu-wide.theme.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/primary-menu/primary-menu-narrow.theme.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/header-search/header-search.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/themes/neonbyte/components/header/header/header.css`

Web copy (Drupal-served, non-symlinked Composer install target — same 8 files under `web/themes/contrib/neonbyte/`):
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/mobile-nav-button/mobile-nav-button.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/language-switcher/language-switcher/language-switcher.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/primary-menu/primary-menu-wide.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/primary-menu/primary-menu-narrow.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/primary-menu/primary-menu-wide.theme.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/primary-menu/primary-menu-narrow.theme.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/header-search/header-search.css`
- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/web/themes/contrib/neonbyte/components/header/header/header.css`
