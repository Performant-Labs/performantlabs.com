# Sprint 17 — `/open-source-projects` preview-fidelity (HQ ImageMagick diff)

**Date opened:** 2026-05-13
**Mode:** Autonomous
**Integration branch:** `aa/pl-sprint-17-open-source-projects-fidelity-hq`
**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects` (HTTP 200 at kickoff)
**Preview:** `docs/pl2/Previews/open-source-projects.html`

---

## Goal

HQ audit + close actionable findings on `/open-source-projects`. Resolve the Sprint 12 card-CTA carry-forward (live `card.html.twig` makes title the link; preview has separate "Read the docs →" footer link) per pre-commitment.

---

## Sources of truth (PC-1)

Brief > preview > content > live. A11y floors win.

---

## Pre-commitments (PC-1..PC-10 carry from Sprints 14–16, plus PC-11 for this sprint)

- **PC-11 (new this sprint): Sprint 12 card-CTA carry-forward resolution.** Brief is unclear on whether card-title-as-link or separate-footer-CTA is canonical. Pre-committed default: **live is canonical; update preview to match** (card title becomes the link; remove separate footer "Read the docs →" link). Rationale: preserves the existing `card.html.twig` component (no SDC migration risk), matches Sprint 13's preview-canonicalization-against-live pattern, and keeps the structural difference out of HQ DSSIM. F's trace MAY override if the brief explicitly contradicts (escalate as spec-ambiguity); otherwise apply preview-doc only.
- PC-1..PC-10 unchanged from Sprint 16.
- **PC-12 (audit-probe convention; codifying Sprint 16 process gap):** Cycle 1 probe scripts MUST enumerate every H2 (with section ancestor identified) and every primary CTA per section. Do not infer token-level cause from section-level DSSIM alone. Probe the rendered property (mask-image patterns use `background-color`).

---

## Sprint shape

- Cycle 1 — S-only HQ audit + form-free WCAG enumeration. Diagnose card-CTA per PC-11; if any other findings, carve cycles.
- Cycles 2..N — F-driven fix cycles per Cycle 1 catalog.
- Final — wrap; merge integration → local `main` `--no-ff`.

---

## Inheritances

- Preview canonicalized through Sprint 13 + Sprint 15 Cycle 4 (letter-spacing `-0.8 px`).
- Sprint 14 Cycle 3 `landing-hero` marker present (Sprint 14 cross-page sweep verified).
- Sprint 15 Cycle 3 `display-md` cascade unified sitewide (page H2s 40/30).
- Sprint 16 process-gap doc — probe-script discipline.

---

## Handoffs

- Orchestrator log: `docs/pl2/handoffs/sprint-17-orchestrator-log.md`
- Per-cycle F/T/S: `docs/pl2/handoffs/sprint-17-cycle-N-*.md`
- Wrap: `docs/pl2/handoffs/sprint-17-wrap.md`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-17-cycle-N/`
