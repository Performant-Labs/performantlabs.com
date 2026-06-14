# Sprint 5 — `/services` Preview-Fidelity — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline; `~/.claude/agents/{orchestrator,feature-implementor,tester,spec-auditor}.md` are canonical)
> **Mode:** autonomous (default)
> **Predecessor:** Sprint 4 + FU-2 ([wrap](handoffs/sprint-4-wrap.md))
> **Prior Services runbook (reference, not resumed):** [`pl-plan--services.md`](pl-plan--services.md) — work on `aa/pl-services` was never merged to `main`. Sprint 5 starts from `main` and uses O-F-T-S rigor (per-cycle F/T/S handoffs; mandatory pixel-diff in S) end-to-end.

---

## Goal

Bring `/services` live closer to the static preview at `docs/pl2/Previews/services.html`, section by section, using the O-F-T-S pipeline. The hero is already correct (FU-2). Everything below the hero is in scope.

**Sources of truth (precedence):**

1. **Design brief tokens** (`docs/pl2/briefs/pl_design_brief.md`) — colors, typography, spacing, breakpoints. Win on token conflicts.
2. **Static preview** (`docs/pl2/Previews/services.html`) — canonical for layout, composition, section order, copy display, where not contradicting brief tokens.
3. **Content brief** (`docs/pl2/Existing Pages/Design1/services.md` + `Target1/services--engagement-cards.md`) — locked copy.
4. **Live** — defers to all three above, except for shipped FU-2 hero treatment, which is canonical.

## Scope posture

- **Visual fidelity primary.** Copy edits in scope only where preview/content brief diverge from live.
- **Patch in place.** Canvas entity id=3, uuid `b2613e35-516b-4d7c-86b8-75eb8a5d5356`, alias `/services`. No `/services-v2`.
- **Hero is out of scope** (FU-2 shipped; do not touch unless audit finds an unrelated regression).
- **Sprint integration branch:** `aa/pl-sprint-5-services-fidelity`. Each cycle gets its own branch off the integration; merged `--no-ff` immediately after S returns PASS.
- **Local-only.** Never push. No PRs.

---

## Cycle plan

### Cycle 1 — Preview-vs-live audit (S-only)

**Pipeline:** O → S → O (audit-only)

**Objective:** Produce a delta catalog of every visible difference between the static preview and `/services` live at viewports 1280, 768, 375. Sections § engagements, § nearshore, § proof (logo bar), § closing-cta. Excludes § hero (FU-2 canonical).

**S deliverables:**

- Playwright screenshots live + preview at three viewports.
- ImageMagick pixel diffs + side-by-side composites.
- Operator-facing HTML report at `docs/pl2/handoffs/cycle-1-audit-services-report.html` with wipe-slider comparators.
- Per-section delta table classifying each delta as: TYPO (typography), LAYOUT (grid/spacing/alignment), COPY (text content), COMPONENT (Canvas/SDC structure), TOKEN (color/border/shadow), or WCAG.

**Output:** the catalog dictates Cycle 2..N carve. O reads the report, groups deltas by section + remediation layer, opens one cycle per coherent section cluster.

**Acceptance criteria:**

- [ ] Screenshots captured at 1280 / 768 / 375 for live + preview.
- [ ] Per-section delta table covers § engagements, § nearshore, § proof, § closing-cta.
- [ ] Each delta tagged with category + recommended remediation layer (L1/L3/L5/Canvas-content).
- [ ] HTML report self-contained, wipe-slider comparators functional.

**Handoff:** `docs/pl2/handoffs/cycle-1-audit-services-S.md` + report.

**No commit.** Audit is a planning artifact. The delta catalog updates this runbook's Cycle 2..N below.

---

### Cycle 2..N — Section fix cycles (placeholder; defined by Cycle 1 output)

**Carve rule.** One cycle per coherent section cluster (typically one § per cycle; combine only if remediation layer is identical and S's delta count is small). Each cycle:

- **Pipeline:** O → F → T → S → O.
- **Branch:** `aa/pl-sprint-5-cycle-N-[section]` off the integration branch.
- **Scope cap:** F applies the standard 6-file / one-component-family rule from its canonical prompt.
- **Acceptance:** Tier 3 visual delta < 5% whole-page for the target section at 1280 + 375; WCAG 2.2 AA clean; brief tokens honored; no `!important`.
- **Commit message:** `feat(services): cycle [N] — [section] preview fidelity`.
- **Merge:** `--no-ff` into integration immediately on S PASS.

Pre-committed cycle ordering when the audit allows it:

1. **Engagement cards** (largest visible delta historically — card padding, surface color, numeric eyebrows).
2. **Nearshore + Dogfooding sections** (alignment, max-width container, CTA button variants).
3. **Logo trust bar** (single-row layout, baseline alignment, hairlines, "We Speak" label demotion).
4. **Closing CTA** (centered H2, ghost-on-dark secondary button variant).
5. **Typography canon** (if audit finds H2/H3 sizing drift not section-local) — L3 base.css token change; must verify `/` regression in the same cycle.

If the audit finds the section is already MATCH within threshold, that cycle is closed as no-op.

---

### Final cycle — Cross-section verification + WCAG (S + optional T)

**Pipeline:** O → T → S → O.

**Objective:** Whole-page integration check after all section cycles land.

- Tier 3 visual: every section MATCH or DELTA-with-justification vs preview at 1280 / 768 / 375.
- WCAG 2.2 AA: keyboard nav, focus rings, forced-colors, reduced-motion, 200% zoom, alt text, touch targets ≥ 44×44 CSS px.
- Spot-check `/` and `/articles` for shared-CSS regressions.
- Pa11y on `/services` — qualify ACs against FU-3 allowlist policy (see Pre-commitments below).

**Commit:** `chore(services): sprint 5 verification + WCAG audit`.

---

## Approval Checkpoints (pre-commitments captured at kickoff)

All checkpoints are pre-resolved per the rules below; O records resolutions in the sprint orchestrator log without surfacing.

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 1 audit complete → carve cycles 2..N | O carves per the audit catalog using the carve rule above; no operator approval mid-sprint. |
| F Step-3 layer choice (canonical prompt requires operator approval for layer choice in human-in-loop) | Autonomous: F applies the layer trace, picks the highest-correct layer per `theme-change--workflow.md`, records the choice in handoff-F. Defer to L3 only when the change is genuinely site-wide (e.g., typography canon revert) and F flags the cross-page impact for T to verify on `/` and `/articles`. |
| Brief ↔ preview ↔ live divergence (Sprint 4 pattern) | Brief tokens win. Preview wins on layout/composition. Live deviations resolve toward brief unless intentional and documented. F surfaces upstream-brief defects as ADVISORY-HOLD to S; S → ADVISORY-HOLD → O parks the cycle silently and continues. |
| S ADVISORY-HOLD | Silent park (per autonomous mode); log to orchestrator log; continue to next cycle. Summarized at wrap. |
| Pa11y errors (FU-3 carry-forward) | Pre-existing operator-approved brand-color deviations (button `--primary` 2.21:1; breadcrumb 3.12:1) are not blockers. Cycle ACs read "0 *new* errors introduced by this cycle." Allowlist install deferred to sprint wrap as FU. |
| Heal-flow on Services (FU-6 carry-forward) | Resolution: Cycle 1 audit checks whether the preview shows a heal-flow section. If no → close FU-6 as "Services does not need heal-flow." If yes → open a dedicated SDC cycle within Sprint 5 only if scope cap allows; else defer to a successor sprint. |
| Cycle 6 (heal-flow) deferral from Sprint 4 | Folded into the FU-6 resolution above. |

---

## Autonomous-mode operating rules (from O canonical prompt + memory)

- 🛑 checkpoints resolve via the table above. No mid-sprint operator surfaces.
- Silent-park triggers: ADVISORY-HOLD, F scope-cap split, third rework round on a cycle.
- Hard-stop floor (surface immediately): verification env broken; `/services`, `/`, or `/articles` availability broken; new WCAG regression on shipped pages; unexpected config-import schema deletion.
- Merge cadence: cycle branch → integration via `--no-ff` immediately on S PASS. No batching.
- Maintain `docs/pl2/handoffs/sprint-5-orchestrator-log.md` as durable record.
- Produce `docs/pl2/handoffs/sprint-5-wrap.md` at sprint completion.

---

## Verification environment (recap)

- DDEV: `https://pl-performantlabs.com.3.ddev.site:8493/`
- `ddev drush cr` before every T1/T2.
- Playwright + ImageMagick already present (Sprint 4 used both).
- Active theme: `performant_labs_20260502`.

---

## Folded-in Sprint-4 follow-ups

| ID | Resolution path in Sprint 5 |
|---|---|
| FU-3 (pa11y allowlist) | AC wording "0 new errors"; allowlist install deferred to sprint wrap. |
| FU-6 (heal-flow) | Cycle 1 audit answers it. |
| FU-5 (J.4 header wrap at 1280) | Out of scope. Operator spot-check at convenience. |
| FU-7b (article-card h3 skip) | Out of scope; Sprint 5 does not touch `/articles`. |
| FU-8 (delete merged cycle branches) | Sprint wrap may clean these up. |

---

## Out of scope

- Hero section (FU-2 canonical).
- `/contact-us` route + form (separate sweep).
- Per-engagement standalone pages.
- Pricing/rate cards.
- Standalone `/nearshoring` page.
- Mobile hero overflow R8 (separate cycle-debt branch).
