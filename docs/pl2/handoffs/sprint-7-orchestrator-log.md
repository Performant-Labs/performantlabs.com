# Sprint 7 — Mobile hero overflow (R8) — Orchestrator Log

**Runbook:** [`../pl-plan--sprint-7-mobile-hero-overflow.md`](../pl-plan--sprint-7-mobile-hero-overflow.md)
**Integration branch:** `aa/pl-sprint-7-mobile-hero-overflow`
**Mode:** autonomous
**Started:** 2026-05-12

## Kickoff pre-commitments

- PC-1 — WCAG 1.4.10 wins absolutely. Brief tokens > preview > content > live, **subordinate to 1.4.10**.
- PC-2 — Cycle 1 audit carve dictates fix-cycle count (1 vs N).
- PC-3 — F Step-3 layer trace: L5 preferred; L3 only if a token contributes.
- PC-4 — S ADVISORY-HOLD silent-park (e.g., if preview itself fails 1.4.10).
- PC-5 — Pa11y "0 new errors" wording (carry-over from Sprint 5/6).
- PC-6 — Hard-stop floor: env / availability / new regression / schema deletion.

## Cycle timeline

### Cycle 1 — R8 audit (S-only)

- **Opened:** 2026-05-12
- **Branch:** `aa/pl-sprint-7-cycle-1-audit`
- **Pipeline:** S only
- **Pages:** `/`, `/services`, `/how-we-do-it`, `/open-source-projects` at 375
- **Closed:** 2026-05-12 — **PASS, surprise outcome.** Audit found R8 is **empirically resolved** by intervening commits (`d8622f6` heal-flow Cycle-debt Phase 1; `26026741d` mobile hero overflow + a11y; `40a4b0511` 768 hero + logo grid; `4256e1f07` articles 1.4.10; `51b2ba340` FU-2 hero H1 reconciliation). All four landing pages clean at 375 and 320: `documentElement.scrollWidth` ≤ `clientWidth` on every page. Only "offenders" enumerated are inside `div.heal-flow`'s authorized `overflow-x: auto` internal-scroll container — working as designed.
- **Cycle 2..N carve:** **closed as no-op.** No fix work required.
- **Decision:** proceed directly to Final cycle as regression-prevention baseline (T + S verification + pa11y sweep), then close R8 in the tech-debt register.

### Final cycle — Cross-landing-page WCAG 1.4.10 regression baseline

- **Opened:** 2026-05-12
- **Branch:** `aa/pl-sprint-7-cycle-final-verification`
- **Pipeline:** O → T → S → O
- **Pages:** `/`, `/services`, `/how-we-do-it`, `/open-source-projects` at 320, 375, 768, 1280
- **Closed:** 2026-05-12 — S PASS. 16 probes (4 pages × 4 viewports) clean: `scrollX = 0` after max-right scroll, zero non-authorized offenders, hero H1 + CTAs fully in viewport at 320/375. WCAG 2.2 AA combined table clean; two pre-existing operator-approved 1.4.3 deviations on PC-5 allowlist. Pa11y 0 new errors.
