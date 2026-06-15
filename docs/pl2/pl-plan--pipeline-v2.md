# Runbook — Pipeline v2: Hybrid Models, Rule Hardening, Testing Depth

**Created:** 2026-06-12
**Scope:** O-F-A-T-S implementation pipeline + O-W-O audit pipeline
**Source:** Pipeline review against `~/Sites/ai_guidance` tri-review workflow (2026-06-12)
**Posture:** Local-only repo — merge with `--no-ff`, never push, no PRs.

Each stage is independently shippable and leaves the pipeline in a working state.
Run stages in order; do not start a stage until the prior stage's exit criteria hold.

---

## Findings this runbook addresses

| # | Finding | Severity |
|---|---|---|
| 1 | A's prompt says "read neighboring files" but A's single-shot calling pattern gives it no tools — it reviews against patterns it cannot see | defect |
| 2 | DripYard component reuse (use parent-theme component; new only as last resort) is enforced **nowhere** — not in F, A, or O's survey | gap |
| 3 | Mobile-first authoring: zero mentions in any agent prompt; W has no desktop-first detection dimension | gap |
| 4 | No written rule for when S (Tier 3) runs; skip decisions are informal | gap |
| 5 | Interaction-state testing (lost-filter bug class) is uncovered — T is curl-only, S is visual-only | gap |
| 6 | Stale prompt contradictions: T frontmatter lists browser tools vs. "T has no tools" contract; S body says Opus 4.7; dead `enable_thinking` flag in O's httpx blocks | hygiene |
| 7 | W does everything by LLM read (18-min audits); no deterministic pre-scan; render phase never run | efficiency |

---

## Stage 0 — Close out current state

**Goal:** Clean slate before touching the pipeline itself.

> **Executed 2026-06-12 (modified):** Ganymede llama-server went down and its team key was lost from LiteLLM's DB mid-W-03. Per operator directive, Stage 1's Qwen→Sonnet migration was pulled forward instead of recovering the backend; W-03's T pass and all of W-04 ran on the new Claude pipeline. Note: W-04's optional z-index lowering was skipped (ddev offline — visual regression unverifiable); documented in the comment and W-04-F handoff.

- [x] Land W-03 (in flight): T verification → merge `aa/pl-neonbyte-W-03-header-article-margin` to main with `--no-ff`.
- [x] Run W-04 (coupling-signal comments batch) through the **current** pipeline as its final exercise.
- [x] Confirm `docs/pl2/handoffs/website-audits/` static criticals = 0 (unblocks Stage 5 render phase).
- [x] Commit any pending handoff artifacts.

**Exit criteria:** main contains W-01–W-04; working tree clean; no cycle in flight.

---

## Stage 1 — Hybrid model migration + prompt hygiene

**Goal:** F/A/T/W move from Qwen/Ganymede to Claude subagents. Fixes findings 1 and 6 structurally — agents get real tools, contracts stop lying.

- [x] **F** → Claude subagent (`subagent_type: feature-implementor`, model `sonnet`) via Agent tool. Remove the Ganymede calling-contract comment block.
- [x] **A** → Claude subagent with Read/Grep/Glob. Delete the "O pipes everything" contract; A now reads the diff, changed files in full, and neighboring pattern files itself.
- [x] **T** → Claude subagent. Resolve the tools contradiction: T runs its own Tier 1/2 commands (ddev, curl, grep) — delete the two-step "O pipes output" pattern.
- [x] **W** → Claude subagent with Read/Grep. Delete the 75K-char prompt-piping pattern from orchestrator.md §Spawning W; O writes scope, W walks the tree itself.
- [x] **S** — already Claude Opus 4.8; fix the stale "Model: claude-opus-4-7" body line.
- [x] **O** — rewrite orchestrator.md §2: all spawns via Agent tool; delete both httpx blocks (dead `enable_thinking` flag, stale token budgets) and `scripts/f_agent.py` invocation.
- [x] Demote `scripts/f_agent.py`, `scripts/ganymede.py`, `scripts/qwen_agent.py` to documented fallback (header comment: "fallback when Claude unavailable; not the primary path"). Do not delete.
- [x] Update `docs/pl2/workflow-ofts.md` agent-roles table to match.
- [x] Hygiene sweep of all six agent files: every calling-contract comment must match actual invocation; no stale model IDs, token budgets, or tool lists.

**Exit criteria:** one trivial test cycle (a W-04-sized fix) runs F→A→T→merge entirely on Claude subagents; every agent file's contract matches how it is actually called.

---

## Stage 2 — Tri-review gates (o3 + Opus 4.8 adversarial reviewers)

**Goal:** Import the ai_guidance tri-review gate. Two outside reviewers on a byte-identical prompt at the two gates; O reconciles.

- [x] Verify `~/Sites/ai_guidance/workflow/dual-review.sh` runs here: `OPENAI_API_KEY` available, `--dump-only` and `--prompt-file` flags work against a sample brief.
- [x] Add gate procedure to orchestrator.md, inherited from `tri-review.md`:
  - **Brief gate** (before F): dump canonical prompt → o3 arm via `--prompt-file` → Opus 4.8 arm as fresh **read-only** subagent (mandatory wrapper — the #56 incident) → O reconciles; `hard` findings amend the brief before F spawns.
  - **Diff gate** (after A PASS, before T): same fan-out on the diff prompt; `hard` findings route back to F.
- [x] Enablement declarations in the brief template (`Tri-review of brief: on|off`, `Tri-review of diff: on|off`). Default **on** for: component-creating stories, shared-token changes, nav/header (high blast radius). Default **off** for: single-file token fixes (W-03-class work).
- [x] Bank both raw reports + dumped prompt per gate; end-of-sprint o3-vs-Opus comparison artifact per `tri-review.md`.
- [x] Record gate outcomes in the orchestrator log (autonomous mode: silent-park soft findings, surface hard ones per existing policy).

**Exit criteria:** one gated cycle completes with both arms returning reports, a reconciliation recorded, and the comparison artifact written.

> **Smoke-tested 2026-06-12:** both arms ran live on the W-04 brief — o3 via `--dump-only`/`--prompt-file` replay, Opus 4.8 as a read-only subagent on the byte-identical sidecar. Both returned structured BLOCK reviews; the Opus arm independently derived the z-index floor of 12 that F had found during implementation. Full exit criterion (a real gated cycle) lands with the next tri-review-enabled story.

---

## Stage 3 — Rule hardening: component reuse + mobile-first

**Goal:** Close findings 2 and 3 — the two rules that currently exist only in the operator's head. Pure prompt edits.

**Component reuse (rules: use DripYard/parent components; new only as last resort):**
- [x] **O survey step:** pre-issue survey gains a mandatory component inventory — list `themes/dripyard_base/components/` + `themes/neonbyte/components/` entries relevant to the phase. Every brief must either name the reuse candidate or carry a one-paragraph justification for a new component.
- [x] **F step 0:** before creating any component, search parent themes for one that can be configured (props, slots, `additional_classes`, token overrides). Record the search and verdict in the handoff "Layer decisions" section.
- [x] **A dimension (block severity):** "new component duplicates an existing parent-theme component that could be configured with a modicum of effort."
- [x] **W dimension (warning):** component in a child theme re-implementing markup/styles that exist in a parent-theme component.

**Mobile-first (rule: mobile-first unless explicitly overridden):**
- [x] **F:** base styles authored for the smallest viewport; scale up with `min-width` queries; any `max-width` override requires an inline comment naming the reason.
- [x] **A dimension (warn, block if pervasive):** desktop-first authoring — base styles assume wide viewport and `max-width` queries patch mobile.
- [x] **W static check (warning):** `max-width`-dominant media query pattern in a file.
- [x] **S:** screenshot sequence ordered smallest-first (375 → 768 → 1280); no-horizontal-overflow at 375 as a precondition, not a finding.

**S gate rule (finding 4):**
- [x] Write the explicit rule into orchestrator.md + workflow-ofts.md: **S runs whenever the diff touches a rendered visual property** (color, spacing, layout, typography, imagery, breakpoints). Pure refactors with provably identical computed values (e.g. W-03 token extraction) may skip S **only if** T adds a computed-value equivalence check (getComputedStyle before/after on the affected selector). Skip decisions are recorded in the orchestrator log.

**Exit criteria:** all four agent prompts + workflow-ofts.md updated; one cycle exercises the component-reuse survey (any story touching a component); spot-check that F's handoff contains the step-0 search record.

> **Prompt edits landed 2026-06-12.** Remaining exit criterion (a live cycle exercising the reuse survey) lands with the next component-touching story.

---

## Stage 4 — Testing depth: stateful surfaces + deterministic a11y

**Goal:** Close finding 5 — the lost-filter bug class. Import the 4-step state invariant from the ai_guidance architecture-audit system into T.

- [x] Create `docs/pl2/stateful-surfaces.md` — persistent inventory of stateful UI surfaces on shipped pages: filters, pagination, accordion/tab open state, mobile-nav toggle, scroll restoration, search input, theme/language toggles. O updates it whenever a phase ships a new surface.
- [x] Extend **T** (not a new stage — T already owns structural verification and has browser tooling post-Stage-1) with a **Tier 2.5 interaction suite**: for each inventoried surface the phase touches, run the 4-step invariant via Playwright:
  1. establish state (apply filter, open accordion, set page 2)
  2. navigate away (to a detail page)
  3. return (browser back)
  4. assert state survived
  All four steps required — applying a filter and asserting the filtered list without leaving the page does **not** cover persistence.
- [x] Write `scripts/state-invariants.spec.js` — parameterized Playwright suite reading the inventory; T runs it for touched surfaces per cycle, full suite at sprint wrap (regression).
- [x] Replace hand-computed WCAG luminance math in T with **axe-core** (`@axe-core/playwright`) at Tier 2 — deterministic ARIA + contrast. F/T prompts updated; numeric thresholds unchanged.
- [x] Add the srcset-URL-resolution check (cookbook incident 2026-04-21) to T's Tier 1 list: every `srcset` URL in rendered HTML must return 200.

**Exit criteria:** state-invariant suite passes on shipped pages; one deliberate break (comment out a filter's state persistence locally) is caught by the suite; axe-core wired into one full cycle.

> **Exit criteria met 2026-06-12 (site relaunched):** 3 surfaces enabled with live-verified selectors (category filter, pager, mobile-nav-ephemeral) — suite passes in ~6s; deliberate-break negative control correctly fails; axe-core wired via `scripts/axe-check.cjs` and immediately found real violations (teal contrast ×2, scrollable-region keyboard access) → fed into W-05. Root `package.json` added so npm installs stop pruning the toolchain.

---

## Stage 5 — W pre-scan + render phase

**Goal:** Close finding 7. Deterministic tools scan, W triages — mirroring the architecture-audit scan.py → Inspector pattern.

- [x] Write `scripts/css-scan.py`:
  - **stylelint** with rules mapped to W's static dimensions: `declaration-no-important`, `selector-max-id: 0`, `selector-max-compound-selectors: 3`, specificity ceiling.
  - **var-chain checker:** collect every `var(--x)` reference across the theme; diff against all defined custom properties; report undefined references (the W-02 bug class) and unused definitions.
  - Output: one JSON report per tool into the audit dir.
- [x] Update W's prompt: scan reports are primary signal for their dimensions; W verifies citations by reading the flagged lines, then spends its reasoning on what tools can't see (wrong-layer placement, coupling intent, schema drift). Tool-confirmed findings get high confidence.
- [x] Update orchestrator.md §Spawning W: run `css-scan.py` before spawning W; pass report paths in the scope doc.
- [x] **Render phase** (first ever run — static criticals are 0 after Stage 0):
  - Extend the existing `render-inspect.js` harness to capture computed styles + bounding rects at 375/768/1280.
  - Run W render phase against the homepage; triage findings into issue briefs per workflow-website-audit.md §W3.
- [x] Schedule cadence: static re-audit after every 4–5 merged cycles or before each sprint wrap, whichever first.

**Exit criteria:** `css-scan.py` reproduces the W-01 and W-02 findings from main's history in seconds; one full static+render audit completes with the new flow; render findings decomposed into briefs.

> **Scanner validated 2026-06-12:** reproduced W-01 and W-02 from pre-fix git history; 151 files in ~2s (neonbyte clean; dripyard_base upstream debt surfaced for a future audit). Scanner is pure Python — planned stylelint integration dropped (equivalent checks implemented natively).
>
> **Render phase ran 2026-06-12 (render-001):** `scripts/render-inspect.cjs` captured computed styles at 375/768/1280; W produced the HTML report; O triage (`audits/render-001/triage.md`) confirmed 2 criticals (teal contrast → W-05), converted 1 misread into a real breakpoint-mismatch finding (W-06), and invalidated 2 harness artifacts (nonexistent token names — harness fixed). Lesson codified: W render findings are O-triaged against source before decomposition.

---

## Stage ordering rationale

1 before everything: all later prompt edits target the new calling patterns — editing Qwen-era prompts twice is waste.
2 before 3: tri-review gates will adversarially review the Stage 3 prompt-rule changes' first real cycles — free validation.
4 and 5 are independent of each other; 4 first because testing depth protects every subsequent cycle, while 5 is an efficiency/coverage win.

## Out of scope (parked)

- Replacing O's model (stays `claude-sonnet-4-5`; revisit only if reconciliation quality at tri-review gates disappoints).
- Architecture-audit pipeline (scan.py/jscpd/knip) adoption for the Drupal PHP side — separate initiative.
- Ganymede decommissioning — scripts stay as documented fallback.
