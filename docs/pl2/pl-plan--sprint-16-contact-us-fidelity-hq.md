# Sprint 16 — `/contact-us` preview-fidelity (HQ ImageMagick diff)

**Date opened:** 2026-05-13
**Mode:** Autonomous (per memory `feedback_autonomous_no_explicit_go.md`)
**Integration branch:** `aa/pl-sprint-16-contact-us-fidelity-hq`
**Cycle branches:** `aa/pl-sprint-16-cycle-N-[slug]`
**Posture:** local-only main; `--no-ff` merges; no push, no PR (memory `project_local_only_main.md`).
**Active theme:** `performant_labs_20260502`
**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/contact-us` (HTTP 200 at kickoff)
**Preview:** `docs/pl2/Previews/contact-us.html` (canonical post-Sprint 13 + Sprint 15 Cycle 4 letter-spacing)

---

## Goal

HQ-method audit of live `/contact-us` vs canonical preview, with special attention to the form. This is the only form on the site, so form-specific WCAG criteria (1.3.5 identify input purpose, 3.3.1 error identification, 3.3.2 labels or instructions, 3.3.7 redundant entry, 3.3.8 accessible authentication) become load-bearing for the first time in this fidelity loop.

---

## Sources of truth (PC-1)

1. Brief tokens — `docs/pl2/briefs/pl_design_brief.md`
2. Preview — `docs/pl2/Previews/contact-us.html`
3. Content brief — `docs/pl2/pl-plan--contact-us.md` if exists; else runbook
4. Live — defers

Hard a11y floor wins → S ADVISORY-HOLD.

---

## Pre-commitments (PC-1..PC-10 carry from Sprint 14/15)

- PC-1 Brief > preview > content > live. A11y floors win.
- PC-2 Cycle carve driven by Cycle 1 audit.
- PC-3 F Step-3 trace autonomous; L5 preferred; L1 only with cross-page sweep + S confirmation.
- PC-4 HQ diff method (DSSIM primary, PSNR + fuzz-AE secondary, 2× DPR, chrome mask).
- PC-5 pa11y "0 errors with allowlist" (Sprint 9 standard).
- PC-6 Canvas `component_version` preserved.
- PC-7 Specificity-safe markers.
- PC-8 Threshold table: < 0.01 MATCH / 0.01–0.05 MINOR / ≥ 0.05 REAL.
- PC-9 Silent-park on S ADVISORY-HOLD.
- PC-10 Hard-stop floor — env breakage / availability / new WCAG regression / config schema deletion / cross-page sweep failure on L1 token.

---

## Form-specific S checklist (mandatory this sprint)

For Cycle 1 audit, S must enumerate (no trimming per memory `feedback_ofts_s_checklist_completeness.md`):

- **1.3.1** Form fields have associated `<label>` (or `aria-labelledby` / `aria-label`).
- **1.3.5** Inputs use appropriate `autocomplete` tokens where applicable (e.g. `name`, `email`, `tel`, `organization`).
- **1.4.3 / 1.4.11** Field borders, focus rings, error states meet 3:1 non-text contrast.
- **2.4.6** Headings and labels descriptive.
- **2.4.11 / 2.4.12** Focus not obscured when fields scroll into sticky-header overlap.
- **2.5.3** Visible label matches accessible name.
- **2.5.8** Form-control target size ≥ 24 × 24 (CSS px).
- **3.3.1** Error identification — required-field validation messages present + programmatic linkage to fields.
- **3.3.2** Labels or instructions — required-field markers; format hints where needed.
- **3.3.3** Error suggestion (if validation fails, suggestion offered).
- **3.3.7** Redundant entry — N/A for a single contact form (no multi-step flow).
- **4.1.2** Inputs expose name/role/state via native semantics.
- **4.1.3** Status messages — submit success / failure announced via `role="status"` or live region.

Plus the standard 32-criterion enumeration.

---

## Known inheritances

- Preview canonicalized through Sprint 13 + 15 Cycle 4 (letter-spacing `-0.8 px`).
- Cycle 4 preview letter-spacing sweep already touched `contact-us.html`.
- `/contact-us` is currently H1-clean (Sprint 8 confirmed; H1 fix landed pre-Sprint-8).
- `/form/contact` redirects to `/contact-us` (Sprint 8 baseline; not part of this sprint's audit).
- pa11y `.pa11yci.json` allowlist covers `/contact-us` carry-forwards (Sprint 9).

---

## Sprint shape

- **Cycle 1.** S-only HQ audit at 1280/768/375 @ 2× DPR. Same HQ method as Sprints 14/15. Plus form-specific WCAG checklist above.
- **Cycles 2..N.** Fix cycles per Cycle 1 catalog.
- **Final.** pa11y-ci re-confirm if anything form-related changes (Sprint 9 standard).

---

## Approval checkpoints

- 🛑 Kickoff — resolved by this briefing.
- 🛑 Cycle 1 → carve — PC-2.
- 🛑 Any L1 / sitewide change — PC-3 cross-page sweep.
- 🛑 Sprint wrap → local-main `--no-ff` — posture.

---

## Handoffs

- Orchestrator log: `docs/pl2/handoffs/sprint-16-orchestrator-log.md`
- Per-cycle F/T/S: `docs/pl2/handoffs/sprint-16-cycle-N-*.md`
- Wrap: `docs/pl2/handoffs/sprint-16-wrap.md`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-16-cycle-N/`
