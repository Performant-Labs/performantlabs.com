# Sprint 9 — A11y debt sweep — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md)
> **Mode:** autonomous
> **Predecessor:** Sprint 8 ([wrap](handoffs/sprint-8-wrap.md))
> **Tech-debt source:** [`tech-debt-register.md`](tech-debt-register.md) §A "WCAG / pa11y" + §"Quick triage view" Bundle 4.

## Goal

Address the remaining a11y-debt cluster:

- **FU-3** — Install a real pa11y-ci allowlist (`.pa11yci.json` or equivalent) for the two pre-existing operator-approved brand-color deviations. Replaces the **PC-5 wording workaround** in use since Sprint 5 ("0 *new* errors" instead of "0 errors").
- **FU-7b** — `/articles` page renders article cards as `<h3>` without an intervening `<h2>` (heading skip per WCAG 1.3.1 / 2.4.6). Pre-existing; confirmed by Sprint 5 + 8 final cycles.
- **Optional re-eval** — ADV-S5 (button `--primary` 2.21:1) + brk-3 (breadcrumb link 3.12:1) brand exceptions. Operator-approved as live state; audit may surface a path forward.

## Sources of truth (precedence)

1. WCAG 2.2 AA — non-negotiable AA criteria.
2. `docs/pl2/briefs/pl_design_brief.md` — typography, color, brand exceptions.
3. `docs/pl2/Previews/articles.html` (if present) — preview canonical for layout.
4. Live — defers.

## Cycles

### Cycle 1 — A11y debt audit

**Pipeline:** O → S → O.

**Objective.**

1. Confirm FU-3 scope: what pa11y-ci config format fits this project? Is there an existing `package.json` or other JS tooling that pa11y-ci should slot into?
2. Confirm FU-7b root cause: where do the orphan h3s come from on `/articles`? (Drupal view template? Twig template? Each card's own component?) Identify the smallest fix.
3. Sweep for any accumulated a11y items not yet in the register: heading hierarchy on every shipped page, ARIA landmark integrity, missing alt text, keyboard traps, focus-ring visibility regressions.
4. Re-eval brand exceptions: is there a low-risk path to lift them (e.g., darker brand-teal token at -3% lightness without breaking the brand)?

**Scope.** All 7 shipped pages, with FU-7b focus on `/articles`. Use pa11y (already installed) + Playwright probes.

**S deliverables.**
- Markdown handoff + HTML report.
- For FU-3: recommended config format (`.pa11yci.json` minimal config + `npm install` line vs JSON-only doc artifact); exact selectors to allowlist (with the two known + any others surfaced).
- For FU-7b: exact template/view file containing the offending h3, recommended minimal fix (promote h3 to h2 OR insert a hidden h2 above).
- Cycle 2 carve recommendation.

**Acceptance.**
- [ ] FU-3 implementation path recommended with concrete file content sketch.
- [ ] FU-7b root cause file identified.
- [ ] Site-wide heading-hierarchy + landmark + alt-text + focus-ring scan reported.
- [ ] Brand-exception re-eval position stated (lift / keep / token-tweak).
- [ ] Cycle 2 carve: 1 cycle vs split.

### Cycle 2..N — Fix cycles (defined by Cycle 1)

**Pipeline:** O → F → T → S → O.

Pre-committed carve:

- **Default:** two cycles in parallel-shape (config artifact + template fix are unrelated changes; doing them separately keeps each diff readable).
  - **Cycle 2a — FU-3 pa11y allowlist install.** Add `.pa11yci.json` (or chosen equivalent) with allowlist for the two brand-color deviations. F may install `pa11y-ci` via `npm` if a `package.json` is acceptable in repo root; otherwise commit config-only as a documentation artifact.
  - **Cycle 2b — FU-7b heading hierarchy fix.** Template/view edit. Smallest change that resolves the skip.

- **Single-cycle alternative:** if audit shows both fixes are ≤ 4 files total, bundle into one cycle.

**Acceptance per fix cycle.**
- [ ] FU-3 (if cycle 2a): `.pa11yci.json` present in repo root; allowlist documented; if `pa11y-ci` installable, F demos `pa11y-ci` run with allowlist producing 0 errors.
- [ ] FU-7b (if cycle 2b): `/articles` heading hierarchy clean (single H1, H2s present, no h3 skip).
- [ ] No `!important`.
- [ ] T1 + T2 PASS.
- [ ] No regression on other pages.
- [ ] WCAG 2.2 AA still PASSes per S template.

### Final cycle — Site-wide a11y baseline (T + S)

**Pipeline:** O → T → S → O.

**Objective.** Verify the full a11y posture after fixes. Run pa11y with the new allowlist (if installed) — confirm 0 unallowlisted errors. WCAG 2.2 AA combined table. Heading hierarchy + landmarks across all 7 pages.

## Approval Checkpoints (pre-committed)

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 1 carve | O carves per audit recommendation. |
| FU-3 install format | Default: minimal `.pa11yci.json` config-only artifact. F may upgrade to `npm install --save-dev pa11y-ci` + `package.json` if it integrates cleanly with existing tooling; otherwise stick to config-only. |
| FU-7b fix direction | Default: promote h3 to h2 (semantic upgrade). F may insert a hidden h2 (`visually-hidden`) if promotion would visually change card design; document choice. |
| Brand-exception re-eval | If audit identifies a no-brand-impact lift (e.g., teal-deep at -3% L without breaking visual identity), surface as a new tech-debt entry for operator decision (don't ship as part of Sprint 9). |
| F Step-3 layer trace | L5 + Twig; no L3. |
| S ADVISORY-HOLD | Silent park. |
| Pa11y | After FU-3 lands, switch to "0 errors with allowlist applied" instead of PC-5 wording. |

## Hard-stop floor

Verification env broken; shipped page availability broken; new WCAG regression on shipped pages; unexpected schema deletion.

## Sprint posture

Local-only; `--no-ff` cycle → integration → main. Standard log + wrap.

## Out of scope

- Other bundles (6 architecture, 7 hygiene + orphan-theme).
- Footer/contact (Bundle 3 closed by Sprint 8).
- Mobile hero overflow (Bundle 5 closed by Sprint 7).
