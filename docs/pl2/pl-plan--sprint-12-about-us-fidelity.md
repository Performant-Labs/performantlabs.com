# Sprint 12 — `/about-us` Preview-Fidelity — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Existing page runbook:** [`pl-plan--about-us.md`](pl-plan--about-us.md) (pre-OFTS-era, retained for content decisions)
> **Visual reference:** [`Previews/about-us.html`](Previews/about-us.html)
> **Brief:** [`briefs/pl_design_brief.md`](briefs/pl_design_brief.md)
> **Live:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us`
> **Mode:** autonomous (kickoff message IS the go-signal per memory `feedback_autonomous_no_explicit_go.md`)

---

## Objective

Bring live `/about-us` closer to the static preview at `docs/pl2/Previews/about-us.html`. Audit-first carve; subsequent fix cycles driven by Cycle 1's delta catalog.

Hero exception applies per FU-2 pattern: do not touch the hero unless audit surfaces an unrelated regression.

## Posture

Local-only (per memory `project_local_only_main.md`). Merge each cycle branch into the sprint integration branch via `--no-ff` immediately after S returns PASS. Merge integration to local `main` via `--no-ff` at sprint wrap. **Never push, never open PRs.**

## Branches

- Integration: `aa/pl-sprint-12-about-us-fidelity`
- Cycle: `aa/pl-sprint-12-cycle-N-[slug]`

## Pre-commitments (autonomous-mode standing decisions)

| ID | Pre-commitment |
|---|---|
| PC-1 | Source-of-truth precedence: brief tokens > preview layout > content > live. Hard a11y floors (WCAG 1.4.10, contrast, heading hierarchy) win over preview. |
| PC-2 | Cycle carve driven by Cycle 1 audit. Cycles 2..N opened from the audit's section-cluster groupings. |
| PC-3 | F Step-3 layer trace is autonomous. L5 (component-scoped) preferred. L3 (token) only when a token contributes AND F flags cross-page impact in handoff. |
| PC-4 | Audit-before-fix pattern (Sprints 7-11 precedent). If audit finds an item empirically resolved, close as no-op + log in orchestrator log. |
| PC-5 | Pa11y standard: "0 errors with allowlist applied" (Sprint 9 codification). `.pa11yci.json` allowlist remains the floor. Do not edit allowlist. |
| PC-6 | Canvas `component_version` preserved in any patch script — do NOT set to NULL (Canvas throws `OutOfRangeException`). Reference idempotent pattern: `scripts/sprint6-cycle3-nearshore-marker.php`. |
| PC-7 | Specificity-safe marker convention: `.dy-section.dy-section--<marker>` (0,2,0). Required for any new section markers. |
| PC-8 | AE binding: AE=0 strict only for refactor cycles. Visual-fidelity cycles use per-section pixel deltas judged against documented intent (Sprint 5 pattern). |
| PC-9 | Silent-park on S ADVISORY-HOLD; log and continue. Surface at sprint wrap. |
| PC-10 | Hard-stop floor (surface immediately): verification env broken; site availability broken on shipped pages; new WCAG regression on shipped pages; unexpected schema deletion at config import; two consecutive parked cycles. |

## Approval Checkpoint resolutions (autonomous defaults)

| Checkpoint | Resolution |
|---|---|
| Cycle 1 → Cycle 2 open | Auto-resolve via audit findings; no operator pause. |
| Per-cycle commit | Auto-merge cycle branch to integration with `--no-ff` immediately after S PASS. |
| Final cycle | Auto-merge integration to local `main` with `--no-ff` at sprint wrap. No push. |
| ADVISORY-HOLD on a cycle | Silent-park per PC-9; surface only at sprint wrap. |

Every 🛑 checkpoint above has a documented resolution; autonomous-mode prerequisite satisfied.

## Sprint shape

### Cycle 1 — Preview-vs-live audit (S-only)

**Pipeline:** O → S → O
**Branch:** `aa/pl-sprint-12-cycle-1-about-us-audit`
**Issue:** `docs/pl2/handoffs/cycle-1-about-us-audit-issue.md`

**Objective.** Produce a section-by-section delta catalog of live `/about-us` vs. `Previews/about-us.html` at 1280/768/375, classify per-section MATCH/DELTA/REWORK, and tag each delta with a remediation layer (L1 / L3 / L5 / Canvas-content / N-A). Audit output carves Cycles 2..N.

**Acceptance criteria:**

- [ ] Playwright + ImageMagick visual-diff produced at all three viewports (1280×800, 768×1024, 375×667) — live + preview + diff PNG + side-by-side composite per viewport.
- [ ] Whole-page AE pixel-count and delta % per viewport reported.
- [ ] Per-section delta table: section name | viewport | status (MATCH / DELTA / REWORK) | description | remediation layer | crop thumbnail.
- [ ] Operator-facing HTML report at `docs/pl2/handoffs/cycle-1-about-us-audit-report.html` with wipe-slider comparators per viewport.
- [ ] Preview sanity-check: confirm preview itself does not violate a11y floors (contrast, heading hierarchy, touch targets). If preview defect found, return ADVISORY-HOLD.
- [ ] Audit cross-checks shipped sibling-fit: spot-compare against shipped `/services` + `/open-source-projects` patterns where the about-us preview references shared chrome (kickers, card grids, closing CTA).
- [ ] Carve recommendation: 2-5 fix cycles proposed with branch-name slug, one-sentence scope, and rough layer per cycle.

**Commit message (audit-only, no code; commit the audit doc + report on the cycle branch):**
`docs(sprint-12): /about-us preview-vs-live audit (cycle 1)`

### Cycles 2..N — Section-cluster fix cycles (F → T → S)

Opened per Cycle 1's carve. Each cycle = one branch `aa/pl-sprint-12-cycle-N-[slug]`, one commit. Acceptance criteria + scope drafted by O at cycle open, citing Cycle 1's audit findings.

Anticipated cycle archetypes (refined by audit):
- **Marker / class refactor cycles** — apply specificity-safe markers (PC-7) where Cycle 1 finds a delta resolvable by re-scoping an existing CSS rule.
- **L5 component-CSS cycles** — token-level visual matches (kickers, cards, closing-CTA) scoped to component CSS files.
- **Canvas-content cycles** — copy / structure deltas (kicker insertion, section restructure) via idempotent PHP scripts preserving `component_version`.

### Final cycle — Cross-section + WCAG sweep

Optional skip per Sprint 9 pattern if an earlier cycle's pa11y-ci run + S WCAG table already covers it. Otherwise: O → T → S over `/about-us` + shipped sibling pages.

## Wrap

- Self-contained `docs/pl2/handoffs/sprint-12-wrap.md` at close.
- Delete per-cycle F/T/S handoffs post-commit (ephemeral).
- Update tech-debt register if anything net-new surfaces.
- Merge integration to local `main` with `--no-ff`. Delete cycle branches + integration branch post-wrap.

## Out of scope

- Hero content/copy edits (FU-2 hero exception).
- New SDCs.
- New brand tokens.
- Any page other than `/about-us` (sibling pages touched only for shared-CSS regression spot-checks).
- Pushes / PRs / non-local operations.
