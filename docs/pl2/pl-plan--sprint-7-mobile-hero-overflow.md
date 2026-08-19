# Sprint 7 — Mobile hero overflow (R8 / ADV-S1 / WCAG 1.4.10) — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md)
> **Mode:** autonomous
> **Predecessor:** Sprint 6 ([wrap](handoffs/sprint-6-wrap.md))
> **Tech-debt source:** [`tech-debt-register.md`](tech-debt-register.md) §A "WCAG / pa11y" — R8 / ADV-S1; Bundle 5 in §"Quick triage view".

## Goal

Resolve the mobile horizontal-scroll regression on the landing-hero pattern at 375 px. This is a real WCAG 2.1 Success Criterion 1.4.10 (Reflow) failure — the standard requires content reflow without horizontal scrolling at 320 CSS px width when the natural width is up to 1280 CSS px. The current page-level horizontal scroll on the hero at 375 fails 1.4.10 site-wide on the landing-hero pattern.

## Why this sprint shape

R8 was deferred from the original `/services` overhaul as a "site-wide cycle-debt" item with a pre-allocated branch name (`aa/pl-mobile-hero-overflow`). That branch was never actually created — only referenced in docs. Sprint 7 promotes the cycle-debt to a real sprint and addresses it across all four landing-hero pages.

**Lineage:** the same flex-min-content trap was resolved on homepage `.heal-flow` in commit `d8622f6` (Cycle-debt Phase 1) — `min-width: 0` on the flex item to defeat the `min-content` default. The hero overflow may share the root cause, or it may be a separate hero-specific class (image, CTA pair, headline letterforms). The Cycle 1 audit decides.

## Sources of truth (precedence)

1. WCAG 2.1 SC 1.4.10 (Reflow) — non-negotiable AA criterion.
2. `docs/pl2/briefs/pl_design_brief.md` §"Responsive behavior" §"Per-section mobile behavior" §Hero — current spec.
3. `docs/pl2/Previews/*.html` — landing-page previews (services, homepage, how-we-do-it, open-source-projects). Preview canonical for layout where it doesn't fail 1.4.10 itself.
4. Live — defers to all three above.

## Cycles

### Cycle 1 — R8 audit (S-only)

**Pipeline:** O → S → O.

**Objective.** Identify the actual root cause of mobile hero horizontal overflow at 375 across the four landing pages: `/` (homepage), `/services`, `/how-we-do-it`, `/open-source-projects`. Establish remediation scope.

**S deliverables.**

- Playwright at 375×667 on each landing page. Capture full-page screenshots. Measure:
  - `document.documentElement.scrollWidth` vs `document.documentElement.clientWidth`. Page-level overflow iff scrollWidth > clientWidth.
  - For each page where overflow is present: enumerate the elements whose `getBoundingClientRect().right` exceeds the viewport.
- Cross-reference with the heal-flow precedent: is the hero a flex-item child of a parent with `display:flex`? Is some descendant forcing intrinsic width (image, SVG, CTA pair, long word)?
- HTML operator-facing report at `docs/pl2/handoffs/cycle-1-r8-audit-report.html` per S canonical prompt §"Step 4f": verdict, per-page overflow summary, screenshots, root-cause hypothesis with cited DOM measurements.

**Acceptance criteria.**

- [ ] Page-level overflow measured (scrollWidth vs clientWidth, in CSS px) for all four landing pages.
- [ ] For each page with overflow: at least one specific element flagged as a contributor, with its rendered width + how it exceeds viewport.
- [ ] Root-cause hypothesis stated, with the smallest-cost remediation path proposed (CSS-only at L5 preferred; structural fix only if CSS cannot resolve).
- [ ] Cycle 2 carve recommendation: one fix cycle (single shared fix) vs N fix cycles (per-page divergence).

**Handoff:** `docs/pl2/handoffs/cycle-1-r8-audit-S.md` + report.

**No code commit.** Audit only. Artifacts committed to cycle branch for retention.

### Cycle 2..N — Fix cycles (defined by Cycle 1 output)

**Pipeline:** O → F → T → S → O each.

Pre-committed carve rules:

- **Default expectation: one fix cycle.** If the root cause is a single shared class (e.g., one element across pages, or one CSS rule), Cycle 2 fixes all four pages in one pass.
- **Per-page split only if needed.** If Cycle 1 finds different contributors per page (e.g., homepage = heal-flow-adjacent; services = hero CTA pair; how-we-do-it = different again), open one cycle per page or per remediation class.

**Acceptance per fix cycle.**

- [ ] At 375 px, `documentElement.scrollWidth === clientWidth` on the target page (no page-level horizontal scroll).
- [ ] No new regression at 768 or 1280.
- [ ] No `!important`.
- [ ] T1 + T2 PASS on target page + cross-page spot-check.
- [ ] T3 visual at 375 shows no clipping; intentional internal-scroll containers (e.g., heal-flow internal `overflow-x: auto`) still engage correctly.
- [ ] WCAG 1.4.10 PASS via Playwright probe at 320 CSS px (spec minimum) + 375 (target).

### Final cycle — Cross-landing-page verification + WCAG 1.4.10 sweep

**Pipeline:** O → T → S → O.

**Objective.** After all fix cycles land, verify all four landing pages clear WCAG 1.4.10 at 320 px and 375 px. Spot-check no regression at 768 + 1280. Pa11y "0 new errors" per PC-5.

**Acceptance.**

- [ ] Page-level `scrollWidth === clientWidth` at 320 and 375 on `/`, `/services`, `/how-we-do-it`, `/open-source-projects`.
- [ ] Internal scroll containers still scroll correctly (heal-flow on `/`).
- [ ] T3 visual at 375 + 320 shows no clipped content; all hero elements visible.
- [ ] Pa11y 0 new errors.
- [ ] WCAG 2.2 AA every row PASS.

## Approval Checkpoints (pre-committed)

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 1 carve (1 vs N fix cycles) | O carves per audit recommendation; no operator surface. |
| F Step-3 layer trace | L5 preferred; L3 token change only if audit shows a token contributes to overflow. F documents the cascade in handoff. |
| Brief ↔ preview ↔ live divergence | WCAG 1.4.10 wins absolutely (it's a hard a11y floor, not a fidelity preference). Per source-of-truth, brief tokens come next; preview layout subordinates to 1.4.10. If preview itself fails 1.4.10, file that as an advisory and proceed (preview ≠ canonical when it violates a hard a11y floor). |
| S ADVISORY-HOLD | Silent park, continue. |
| Pa11y | PC-5 wording from Sprint 5. |

## Hard-stop floor

Verification env broken; landing-page availability broken (any of `/`, `/services`, `/how-we-do-it`, `/open-source-projects` returning non-200 on shipped state); new WCAG regression on shipped pages; unexpected config-import schema deletion.

## Sprint posture

- Local-only; never push.
- `--no-ff` per cycle into integration `aa/pl-sprint-7-mobile-hero-overflow`.
- Integration `--no-ff` into local `main` at sprint wrap.
- Orchestrator log at `docs/pl2/handoffs/sprint-7-orchestrator-log.md`.
- Wrap doc at `docs/pl2/handoffs/sprint-7-wrap.md`.

## Out of scope

- Other tech-debt bundles (Bundle 3 footer/contact, Bundle 4 a11y debt, Bundle 6 architecture, Bundle 7 hygiene). Sprint 7 is single-bucket focus.
- Non-landing pages unless audit shows the same overflow on them.
- Hero visual fidelity items (FU-2 canonical for size/weight; this sprint touches hero only insofar as overflow remediation requires).
- Pre-existing accepted deviations.
