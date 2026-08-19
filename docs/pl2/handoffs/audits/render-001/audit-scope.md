# Audit Scope — render-001

**Audit ID:** render-001
**Date:** 2026-06-12
**Phase:** render
**Type:** page
**Target:** `https://pl-performantlabs.com.3.ddev.site:8493/` (homepage)
**Theme:** neonbyte (chain: dripyard_base → neonbyte)

## Prior audit context

- Prior static run: `docs/pl2/handoffs/website-audits/audit-static-001.html` (neonbyte-static-20260518)
- **Outstanding static criticals: 0** (W-01 through W-04 fixed and merged — render phase permitted)

## Focus areas

- render-cascade (variable resolution: empty / wrong value / fallback-instead-of-primary)
- wcag-contrast (computed color vs background, WCAG relative luminance)
- render-cascade responsive (navbar 992px breakpoint state, touch targets ≥ 44×44 at 375, horizontal overflow)

## Render data

`docs/pl2/handoffs/audits/render-001/render-data.json` — captured 2026-06-12 via `scripts/render-inspect.cjs` at 375 / 768 / 1280 viewports. Structure per viewport: `components` (first instance per top-level class: color, background, fontSize, theme vars), `interactive` (bounding rects of visible interactive elements), `overflow` (scrollWidth vs innerWidth), `nav.hamburgerVisible`.

## Static reference files (for expected variable values)

- `themes/neonbyte/css/_variables/` — token definitions
- `themes/dripyard_base/css/_variables/` — parent token definitions
- `themes/neonbyte/css/themes/theme-primary.css`, `theme-secondary.css` — theme zone overrides

## Known context (do not re-report)

- axe-core 2026-06-12 already flagged: hero primary button contrast, breadcrumb link contrast (/articles), `.heal-flow` scrollable-region keyboard access. Cross-reference if your numeric analysis confirms them, but attribute the finding source.
- `--theme-setting-*` variables are injected by Drupal theme settings PHP; `--offset-from-header` is set by primary-menu.js. Empty values for these in CSS-only analysis are NOT findings.

## Report output path

`docs/pl2/handoffs/audits/render-001/website-audit-homepage-render.html`
