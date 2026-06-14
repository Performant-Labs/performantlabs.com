# Blast-Radius Audit — homepage — 2026-06-12

**Tool chain:** css-scan (static) → cascade-map.cjs (Tier B containment) → perturb.cjs (Tier C active/dormant)
**Target:** https://pl-performantlabs.com.3.ddev.site:8493/  · viewports 375 + 1280

## Result
- 23 components on page. Tier B: **17 raw cross-component matches → 2 true boundary-escapes** (15 were
  normal parent→nested-child composition, demoted to info).
- Tier C perturbation classified both escapes:

| Selector | scoped→escapes | verdict | severity | note |
|---|---|---|---|---|
| `.header-navigation-wrapper:not(.is-expanded) .primary-menu` | primary-menu→menu-block | DORMANT (masked) | WARNING | "bites later" class — masked today |
| `.primary-menu` | primary-menu→menu-block | ACTIVE (live) | WARNING | sets `--top-level-link-*` custom props on menu-block |

## Triage note (O, against source)
Both escapes are primary-menu styling the `menu-block` it composes (sibling component, not nested).
The active one sets link-styling **custom properties** the menu consumes — likely **intentional
composition**, a waiver candidate, not a layout bug. No CRITICAL live layout over-reach on the
homepage: containment is largely clean.
