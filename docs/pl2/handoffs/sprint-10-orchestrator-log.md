# Sprint 10 — Architectural cleanup — Orchestrator Log

**Runbook:** [`../pl-plan--sprint-10-architecture-cleanup.md`](../pl-plan--sprint-10-architecture-cleanup.md)
**Integration branch:** `aa/pl-sprint-10-architecture-cleanup`
**Mode:** autonomous
**Started:** 2026-05-12

## Kickoff pre-commitments

- PC-1 — Live shipped state is canonical; refactor must preserve it pixel-identical at 1280/768/375.
- PC-2 — Doc-only cycles applied by O directly (Sprint 6 cycle 1 precedent).
- PC-3 — F scope-split if selector refactor exceeds 6 files / 1 component family.
- PC-4 — S ADVISORY-HOLD silent-park.
- PC-5 — Pa11y "0 errors with allowlist applied" (Sprint 9 standard).
- PC-6 — Canvas `component_version` non-NULL constraint observed; sprint codifies it.
- PC-7 — Audit-before-fix (Sprint 7-9 codification).

## Cycle timeline

### Cycle 1 — Architectural-debt audit

- **Opened:** 2026-05-12
- **Branch:** `aa/pl-sprint-10-cycle-1-audit`
- **Pipeline:** S only
- **Closed:** 2026-05-12 — S PASS.
- **Thread 1 (selectors):** 19 patterns / 40 selector-lines across 7 CSS files. 12 genuinely fragile (10 in `dy-section.css`, 2 in `logo-grid.css`); 7 acceptable. 2 already migrated (`dy-section--other-modules` Sprint 5; `nearshore-section` Sprint 6 cycle 3). Audit proposes 9 new markers.
- **Thread 2 (`component_version`):** 9 files / ~17 hit-locations including canonical F prompt + workflow-ofts.md.
- **Carve adopted:** 5 fix cycles. 2a doc fix (O direct); 2b.1 `/about-us`; 2b.2 `/services`; 2b.3 `/how-we-do-it`; 2b.4 homepage logo-grid. Final cycle skippable per Sprint 9 pattern.

### Cycle 2a — `component_version` workflow doc fix (O direct)

- **Opened + closed:** 2026-05-12 (same-cycle).
- **Branch:** `aa/pl-sprint-10-cycle-2a-doc-fix`
- **Pipeline:** O alone (Sprint 6 cycle 1 precedent).
- **Files edited (9):**
  - `~/.claude/agents/feature-implementor.md:123` (canonical F prompt step 8)
  - `docs/pl2/workflow-ofts.md:116` (issue template operating rules)
  - `docs/pl2/workflow-ofts.md:313` (F canonical prompt reference copy step 8)
  - `docs/pl2/pl-plan--homepage-overhaul.md:20` (operating rules)
  - `docs/pl2/pl-plan--homepage-overhaul.md:437` (traps list — was OPPOSITE of reality; flipped)
  - `docs/pl2/pl-plan--sprint-1-conversion-repair.md:48`
  - `docs/pl2/pl-plan--about-us.md:48, 92`
  - `docs/pl2/pl-plan--book-pages.md:85`
  - `docs/pl2/pl-plan--contact-us.md:87, 105, 161`
  - `docs/pl2/pl-plan--open-source-projects.md:46, 94`
  - `docs/pl2/pl-plan--services.md:53, 93, 131`
- **New wording:** "Preserve `component_version` (do NOT set to NULL — Canvas throws `OutOfRangeException`; corrected 2026-05-12 per Sprint 10 cycle 2a)."

### Cycle 2b.1 — `/about-us` selector-class refactor

- **Closed:** 2026-05-12 — S PASS (AE=0 all 12 page×viewport pairs).
- **Branch:** `aa/pl-sprint-10-cycle-2b1-about-us`
- 4 markers applied (`centered-light` ×2, `bio-block`, `cta-pair`). CSS rewrites: P1+P7+P8 transition comma-selector; P9 direct swap. P8 old half kept for /services.

### Cycle 2b.2 — `/services` selector-class refactor

- **Closed:** 2026-05-12 — S PASS after 1 rework round (AE=0 all 15 page×viewport pairs).
- **Branch:** `aa/pl-sprint-10-cycle-2b2-services`
- 4 markers (`cta-pair` on hero + closing-CTA; `centered-white` on Dogfooding; `wordmark-strip` on §5). Plus /about-us hero gets `cta-pair` via rework.
- **Round 1 issues:** P4 missed /about-us hero (also matched the old `:has`); P10 marker had lower specificity than `.padding-top--l` utility (0,1,0 vs 0,1,0; utility won by source order).
- **Round 2 fixes:** /about-us hero gets `cta-pair`; `.dy-section--wordmark-strip` selector doubled to `.dy-section.dy-section--wordmark-strip` (0,2,0).
- **P8 transition cleanup:** old `:has` half removed (both /about-us and /services now have markers; no other page has the pattern).

### Cycle 2b.3 — `/how-we-do-it` selector-class refactor

- **Closed:** 2026-05-12 — S PASS (AE=0 all 15 page×viewport pairs).
- **Branch:** `aa/pl-sprint-10-cycle-2b3-how-we-do-it`
- 4 markers (`kicker-inline` ×3 on Week1/Week2/Week3+; `tight-header` on "What we don't do"). P5+P6 direct swap (both /how-we-do-it-only).

### Cycle 2b.4 — homepage logo-grid selector-class refactor

- **Closed:** 2026-05-12 — S PASS (AE=0 all 15 page×viewport pairs).
- **Branch:** `aa/pl-sprint-10-cycle-2b4-homepage-logo-grid`
- 2 markers (`logo-grid` + `post-hero-logos`) on homepage v2 (canvas_page id=20, the live homepage) logo-strip section. 3 selectors in `logo-grid.css` rewritten.
