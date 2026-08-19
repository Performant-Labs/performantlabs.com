# Sprint 15 — `/how-we-do-it` preview-fidelity (HQ ImageMagick diff)

**Date opened:** 2026-05-13
**Mode:** Autonomous (per memory `feedback_autonomous_no_explicit_go.md`)
**Integration branch:** `aa/pl-sprint-15-how-we-do-it-fidelity-hq`
**Cycle branches:** `aa/pl-sprint-15-cycle-N-[slug]`
**Posture:** local-only main; `--no-ff` merges; never push, never open PRs (memory `project_local_only_main.md`).
**Active theme:** `performant_labs_20260502`
**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it` (verified 200 at kickoff)
**Preview:** `docs/pl2/Previews/how-we-do-it.html` (canonical post-Sprint 13)

---

## Goal

Audit live `/how-we-do-it` against the canonical preview using the Sprint 14 HQ diff method (DSSIM primary, PSNR + fuzz-AE secondary, 2× DPR, Drupal-chrome mask), then close any actionable deltas. The page has a unique-on-site heal-flow SVG with mobile horizontal-scroll behavior; pay special attention to it at 375 px.

---

## Sources of truth (PC-1)

1. Brief tokens — `docs/pl2/briefs/pl_design_brief.md`
2. Preview layout — `docs/pl2/Previews/how-we-do-it.html`
3. Content brief — `docs/pl2/pl-plan--how-we-do-it.md` (if present; else fall back to runbook)
4. Live — defers to all three above

Hard a11y floor wins over preview → S ADVISORY-HOLD.

---

## Pre-commitments (carry from Sprint 14; autonomous-mode resolution for every 🛑)

- **PC-1** Brief tokens > preview > content > live. Hard a11y floors win.
- **PC-2** Cycle carve driven by Cycle 1 audit.
- **PC-3** F Step-3 layer trace autonomous; L5 preferred (Sprint 14 Cycle 3 codified this); L1 only with cross-page sweep + S confirmation.
- **PC-4** HQ diff method (DSSIM primary, PSNR + fuzz-AE secondary, 2× DPR, chrome mask).
- **PC-5** pa11y "0 errors with allowlist applied" (Sprint 9 standard).
- **PC-6** Canvas `component_version` preserved.
- **PC-7** Specificity-safe `.dy-section.dy-section--<marker>` for any new markers.
- **PC-8** Per-section delta judged against documented intent + DSSIM threshold table (< 0.01 MATCH / 0.01–0.05 MINOR / ≥ 0.05 REAL).
- **PC-9** Silent-park on S ADVISORY-HOLD.
- **PC-10** Hard-stop floor — env breakage / availability / new WCAG regression / config schema deletion / cross-page sweep failure on L1 token change.

---

## Known inheritances entering Sprint 15

- Sprint 14 Cycle 3 advisory (Cycle 1 input): `/how-we-do-it` produces a single-word orphan "teams." at 375 px on the hero H1 despite `text-wrap: balance` active. Expected to surface in Cycle 1; remediation candidate: copy-edit or `<wbr>`.
- `landing-hero` marker confirmed present on `/how-we-do-it` (verified during Sprint 14 Cycle 3 cross-page sweep).
- Brief defines the heal-flow SVG with: mobile horizontal scroll (NOT vertical stack); responsive behavior table per brief §"Responsive behavior."

---

## Heal-flow SVG — unique-on-site responsive pattern

This page has the only horizontal-scroll component on the site. Brief mandate:
- At ≥ `md` (768 px): heal-flow renders inline.
- At < `md` (375 px specifically): heal-flow scrolls horizontally inside its container; does NOT stack vertically; the page itself does not scroll horizontally.

S must verify both behaviors and ensure the horizontal-scroll container has an accessible affordance (focus-visible scroll behavior, visible scroll cue, or equivalent — check WCAG 2.4.11 focus-not-obscured + 2.5.8 target size if any scroll affordance is interactive).

---

## Sprint shape

- **Cycle 1.** S-only HQ audit at 1280/768/375 @ 2× DPR. Output: delta catalog with DSSIM + PSNR + fuzz-AE per section; MATCH/MINOR/REAL classification; remediation layer per finding. Special attention to heal-flow at 768 + 375, and the inherited orphan "teams." at 375.
- **Cycles 2..N.** Fix cycles per Cycle 1 catalog.
- **Final.** Pa11y-ci confirmation (optional if Sprint 9 surgical allowlist already covers).

---

## Pages reviewed for preview-fidelity to date

- `/` (homepage) — original overhaul phases
- `/services` — Sprints 5 + 6
- `/about-us` — Sprints 10/11/12/13.1/14
- `/how-we-do-it` — Sprint 15 (this sprint)

---

## Approval Checkpoints

- 🛑 Kickoff — resolved by this kickoff briefing.
- 🛑 Cycle 1 catalog → Cycle 2 carve — PC-2.
- 🛑 Any L1 token change → cross-page sweep — PC-3.
- 🛑 Sprint wrap → merge to local main `--no-ff` — local-only posture.

---

## Handoffs

- Orchestrator log: `docs/pl2/handoffs/sprint-15-orchestrator-log.md` (durable)
- Per-cycle F/T/S: `docs/pl2/handoffs/sprint-15-cycle-N-*.md` (ephemeral)
- Wrap: `docs/pl2/handoffs/sprint-15-wrap.md` (durable at close)
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-15-cycle-N/`
