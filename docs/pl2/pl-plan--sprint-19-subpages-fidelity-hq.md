# Sprint 19 — Sub-pages preview-fidelity (HQ ImageMagick diff)

**Date opened:** 2026-05-14
**Mode:** Autonomous
**Integration branch:** `aa/pl-sprint-19-subpages-fidelity-hq`

## Scope (three sub-pages)

| Preview file | Live URL |
|---|---|
| `docs/pl2/Previews/automated-testing-kit.html` | `https://pl-performantlabs.com.3.ddev.site:8493/automated-testing-kit` |
| `docs/pl2/Previews/automated-testing-kit-introduction.html` | `https://pl-performantlabs.com.3.ddev.site:8493/introduction` |
| `docs/pl2/Previews/article-introducing-layout-builder-kit-beta-1.html` | `https://pl-performantlabs.com.3.ddev.site:8493/articles/introducing-layout-builder-kit-beta-1` |

All three previews were canonicalized in Sprint 13 Cycle 3 but never HQ-audited against live. Final batch closes the preview-fidelity loop at the sub-page level.

## Sources of truth + pre-commitments

Brief > preview > content > live (PC-1). PC-1..PC-13 carry from Sprint 18.

**PC-14 (new):** Article/product detail pages may have content-flow divergence vs preview (different article body, different ATK feature list) — same convention as PC-13: compare chrome/typography/grid, not content parity.

## Sprint shape

- Cycle 1 — S-only HQ audit, three pages in one cycle. Each page gets its own per-section DSSIM + WCAG enumeration. Carve per page.
- Cycles 2..N — fix cycles per Cycle 1.

## Handoffs

- Orchestrator log: `docs/pl2/handoffs/sprint-19-orchestrator-log.md`
- Per-cycle: `docs/pl2/handoffs/sprint-19-cycle-N-*.md`
- Wrap: `docs/pl2/handoffs/sprint-19-wrap.md`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-19-cycle-N/`
