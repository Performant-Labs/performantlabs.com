# Sprint 14 — `/about-us` preview-fidelity (high-quality ImageMagick diff)

**Date opened:** 2026-05-13
**Mode:** Autonomous (kickoff message = go-signal per memory `feedback_autonomous_no_explicit_go.md`)
**Integration branch:** `aa/pl-sprint-14-about-us-fidelity-hq`
**Cycle branches:** `aa/pl-sprint-14-cycle-N-[slug]`
**Posture:** local-only main; merge each cycle to integration via `--no-ff`; merge integration to local main via `--no-ff` at wrap. Never push, never open PRs (memory `project_local_only_main.md`).
**Active theme:** `performant_labs_20260502`
**Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us` (verified 200 at kickoff)
**Preview:** `docs/pl2/Previews/about-us.html` (canonical post-Sprint 13)

---

## Goal

Re-audit live `/about-us` against the now-canonical preview using a higher-quality ImageMagick diff method than Sprint 12/13 used (DSSIM primary, PSNR + fuzzed-AE secondary, 2× retina captures, Drupal-chrome mask), then close any remaining deltas — including the two carry-forwards (F-NEW-1 preview H1 desktop 64 → 72, F-NEW-2 live H1 mobile 36 → 44).

---

## Sources of truth (precedence — PC-1)

1. Brief tokens — `docs/pl2/briefs/pl_design_brief.md`
2. Preview layout — `docs/pl2/Previews/about-us.html` (canonical post-Sprint 13)
3. Content brief — `docs/pl2/pl-plan--about-us.md`
4. Live — defers to all three above

Hard a11y floor wins over preview. S flags as ADVISORY-HOLD; operator decides.

---

## Pre-commitments (autonomous-mode resolution for every 🛑 checkpoint)

- **PC-1.** Brief tokens > preview > content > live. Hard a11y floors win.
- **PC-2.** Cycle carve driven by Cycle 1 audit (S-only).
- **PC-3.** F Step-3 layer trace autonomous; L5 preferred; L1 only with cross-page sweep + S confirmation.
- **PC-4.** Higher-quality diff method — DSSIM primary, PSNR + fuzz-AE secondary; never substitute prose for pixel artifacts (memory `feedback_visual_diff_mandatory.md`).
- **PC-5.** pa11y "0 errors with allowlist applied" (Sprint 9 standard).
- **PC-6.** Canvas `component_version` preserved (Sprint 10 codification).
- **PC-7.** Specificity-safe `.dy-section.dy-section--<marker>` for any new markers.
- **PC-8.** For visual-fidelity cycles, per-section delta judged against documented intent + DSSIM threshold table (below). Refactor cycles retain AE=0 strict binding.
- **PC-9.** Silent-park on S ADVISORY-HOLD (autonomous mode).
- **PC-10.** Hard-stop floor — env breakage / availability / new WCAG regression / config schema deletion / cross-page sweep failure on L1 token change.

---

## High-quality diff method (REQUIRED — S is responsible)

1. **2× retina captures.** Playwright `deviceScaleFactor: 2` for both preview and live.
2. **Perceptual metric primary.** `compare -metric DSSIM` (0=identical, 1=max different) per section.
3. **Secondary metrics.** `compare -metric PSNR` (dB; >40 ≈ indistinguishable). `compare -metric AE -fuzz 3%` (fuzz mask). Tertiary: raw AE at `-fuzz 0%` reported side-by-side so noise floor is visible.
4. **Section anchoring.** Per-section crops anchored to each section's measured top in its own render, cropped to the smaller of the two heights (Sprint 12 FB-3 convention).
5. **Drupal-chrome mask.** Mask out the breadcrumb cream band region on live before comparing (FB-3 noise source). Document mask coordinates per viewport in the audit doc.
6. **Visual diff PNG.** `-highlight-color red` for operator inspection; mandatory regardless of metric choice.
7. **Threshold convention:**
   - DSSIM < 0.01 → MATCH
   - 0.01 ≤ DSSIM < 0.05 → MINOR DELTA (likely subpixel/font-metric)
   - DSSIM ≥ 0.05 → REAL DELTA (warrants per-token investigation)
   S may flag below the lower threshold if the diff PNG shows clear structural difference.

---

## Sprint shape

- **Cycle 1.** S-only high-quality preview-vs-live audit at 1280/768/375 @ 2× DPR. Output: delta catalog with DSSIM + PSNR + fuzzed-AE per section, MATCH/MINOR-DELTA/REAL-DELTA classification, remediation layer (L1/L3/L5/Canvas-content/Preview-doc).
- **Cycles 2..N.** F-driven fix cycles per Cycle 1 catalog. Pre-committed candidates:
  - Preview-doc: raise H1 `display-xl` from 64 → 72 desktop in `docs/pl2/Previews/about-us.html` (F-NEW-1).
  - L1 token: raise mobile `display-xl` from 36 → 44 at <576 in theme (F-NEW-2). Cross-page sweep required.
  - Any new deltas surfaced by the higher-quality diff.
- **Final cycle.** Cross-page S sweep (mandatory if L1 mobile token ships) + pa11y-ci confirmation (optional if Sprint 9 surgical allowlist covers).

---

## Pages reviewed for preview-fidelity to date

- `/` (homepage) — original overhaul phases
- `/services` — Sprints 5 + 6
- `/about-us` — Sprints 10, 11, 12; Sprint 13 Cycle 1 re-audit; Sprint 14 (this sprint)

---

## Approval Checkpoints

- 🛑 Kickoff — resolved by this kickoff briefing (autonomous-mode go-signal).
- 🛑 Cycle 1 catalog → Cycle 2 carve — resolved by PC-2 (audit drives carve).
- 🛑 L1 token change (F-NEW-2) → cross-page sweep — resolved by PC-3 (L1 with S cross-page confirmation).
- 🛑 Sprint wrap → merge to local main `--no-ff` — resolved by posture (memory `project_local_only_main.md`).

---

## Handoffs

- Orchestrator log: `docs/pl2/handoffs/sprint-14-orchestrator-log.md` (durable)
- Per-cycle F/T/S: `docs/pl2/handoffs/sprint-14-cycle-N-*.md` (ephemeral)
- Wrap doc: `docs/pl2/handoffs/sprint-14-wrap.md` (durable at close)
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-14-cycle-N/`
