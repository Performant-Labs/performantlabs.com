# Sprint 18 — `/articles` preview-fidelity (HQ ImageMagick diff)

**Date opened:** 2026-05-13
**Mode:** Autonomous
**Integration branch:** `aa/pl-sprint-18-articles-fidelity-hq`
**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/articles` (HTTP 200 at kickoff)
**Preview:** `docs/pl2/Previews/articles.html`

---

## Goal

HQ audit + close actionable findings on `/articles`. Unlike prior preview-fidelity targets, `/articles` is a **views-rendered listing page**, not a Canvas-composed layout. Audit profile is different: hero + article-card grid + pagination. Sprint 9 already shipped the visually-hidden `<h2>Articles</h2>` for heading-hierarchy WCAG 1.3.1 compliance.

---

## Sources of truth (PC-1)

Brief > preview > content > live. A11y floors win.

---

## Pre-commitments

- PC-1..PC-12 carry from Sprint 17.
- **PC-13 (new):** Views-rendered listings differ from Canvas pages. Card-grid card count fluctuates with content. S compares **card chrome / grid spacing / hero typography** rather than card-content parity. Don't flag "preview has 6 cards but live has 9" as a fix candidate — different concern.

---

## Sprint shape

- Cycle 1 — S-only HQ audit. Hero + grid + pagination + (likely small) WCAG enumeration. Apply PC-12 probe discipline + PC-13 listing-page convention.
- Cycles 2..N — fix cycles per Cycle 1 carve.

---

## Inheritances

- Sprint 9 Cycle 2: visually-hidden `<h2>Articles</h2>` shipped via `views-view-unformatted--articles--page-1.html.twig` (per-page scope; SDC unchanged).
- All Sprint 13–17 preview canonicalization + sitewide cascade fixes.
- pa11y allowlist intact.

---

## Handoffs

- Orchestrator log: `docs/pl2/handoffs/sprint-18-orchestrator-log.md`
- Wrap: `docs/pl2/handoffs/sprint-18-wrap.md`
- Per-cycle: `docs/pl2/handoffs/sprint-18-cycle-N-*.md`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-18-cycle-N/`
