# Sprint 6 — `/services` polish + preview/brief reconciliation — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S)
> **Mode:** autonomous (default)
> **Predecessor:** Sprint 5 ([wrap](handoffs/sprint-5-wrap.md))
> **Tech-debt source:** [`tech-debt-register.md`](tech-debt-register.md) §"Quick triage view" — Bundle 1 + Bundle 2.

## Goal

Close three small follow-ups left from Sprint 5 — two on `/services` live, one a preview/brief documentation reconciliation. Each is a focused, low-risk change.

## Cycles

### Cycle 1 — Preview / brief / runbook reconciliation (doc-only)

**Pipeline:** O alone (small targeted edits to known files; no F/T/S overhead).

**Items:**

- **FU-S5-3** — `docs/pl2/Previews/services.html`: remove `opacity: 0.8` from `.wordmark-strip__item` (or equivalent selector). Live now better than preview on this token (7.43 : 1 vs preview's 4.47 : 1). Brief tokens win; preview should not lie.
- **FU-S5-4** — `docs/pl2/briefs/pl_design_brief.md`: add a one-line spec for services-page mobile wordmark wrap. Live ships 4 + 2 at 375; preview ships 3 + 3. Either acceptance is documentable; default to live's 4 + 2 (already shipped).
- **FU-1** — `docs/pl2/pl-plan--sprint-4-pre-services-foundation.md` Cycle 2 AC4: rewrite "zero visual delta" to "no *unintended* visual delta; brand-correction deltas on surfaces previously falling through to Dripyard defaults are accepted as cycle output." Doc-only.

**Acceptance criteria:**

- [ ] `Previews/services.html` no longer contains `opacity: 0.8` on wordmark items.
- [ ] `pl_design_brief.md` documents the services-page mobile wordmark wrap (4 + 2 at 375).
- [ ] `pl-plan--sprint-4-pre-services-foundation.md` Cycle 2 AC4 wording corrected.

**Commit:** `docs(pl2): sprint 6 cycle 1 — preview/brief/runbook reconciliation (FU-S5-3 + FU-S5-4 + FU-1)`

---

### Cycle 2 — FU-S5-1 — `/services` engagement grid 768 collapse

**Pipeline:** O → F → T → S → O.

**Item:** at viewports ≤ 991 px, the `/services` engagement-cards grid currently renders 2 × 2; preview collapses to 1-col. Single L5 rule in `grid-wrapper.css` to drop the 2-col rule below 992 px on the engagement grid specifically (or globally on `.grid-wrapper--2col`, depending on cross-page impact analysis).

**Branch:** `aa/pl-sprint-6-cycle-2-grid-collapse`.

**Acceptance criteria:**

- [ ] `/services` § engagements at 768 × 1024 renders 1-col (4 cards stacked).
- [ ] `/services` § engagements at 992+ unchanged (2 × 2).
- [ ] `/services` § engagements at 375 unchanged (1-col, already MATCH).
- [ ] No regression on `/`, `/about-us`, `/articles`, or any other page using `.grid-wrapper--2col` — F traces cross-page usage in the layer choice.
- [ ] No `!important`.
- [ ] T1 + T2 PASS.
- [ ] T3 visual diff at 768 shows § engagements MATCH preview.

**Commit:** `feat(services): cycle 2 — § engagements 768 grid collapse (FU-S5-1)`

---

### Cycle 3 — FU-S5-5 — `/services` § nearshore container-cap

**Pipeline:** O → F → T → S → O.

**Item:** § nearshore H2 wraps at the page-level container (~1140 px) at 1280 instead of preview's content-cap (~640 px). Resolution requires either:

- (a) Add a Canvas-class marker `nearshore-section` (or similar) to the section's modifier_classes prop, then scope L5 styling cleanly; OR
- (b) Use `:nth-of-type` selector (fragile — Sprint 5 cycle 2 F already declined this).

**Pre-commitment:** path (a). Adds a stable marker class via Canvas content edit on entity id=3, then a small L5 block in `dy-section.css` (or a new `nearshore.css`) for the content-cap + `text-wrap: balance`.

**Branch:** `aa/pl-sprint-6-cycle-3-nearshore-cap`.

**Acceptance criteria:**

- [ ] `/services` § nearshore H2 at 1280 wraps within a content-cap of ~640 px (matches preview).
- [ ] `/services` § nearshore at 768 + 375 unchanged (already MATCH).
- [ ] `text-wrap: balance` applied to prevent orphan words (per memory `feedback_no_orphan_words.md`).
- [ ] No regression on other `dy-section` instances — F confirms the new marker class is scoped to nearshore only.
- [ ] No `!important`.
- [ ] T1 + T2 PASS.
- [ ] T3 visual diff at 1280 shows § nearshore MATCH preview.
- [ ] Canvas content edit captured in `scripts/sprint6-cycle3-nearshore-marker.php`.

**Commit:** `feat(services): cycle 3 — § nearshore container-cap (FU-S5-5)`

---

## Approval Checkpoints (pre-committed for autonomous mode)

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 2 layer choice (cross-page risk) | F traces `.grid-wrapper--2col` usage; if shared widely, F adds a more-scoped selector (e.g., a section marker class) instead of editing the global rule. F documents the choice in handoff. |
| Cycle 3 implementation path | Path (a) — Canvas-class marker + L5. Pre-committed; no operator surface. |
| Brief ↔ preview ↔ live divergence | Brief tokens win (Sprint 5 pattern). |
| S ADVISORY-HOLD | Silent park; continue. |
| Pa11y | "0 new errors" wording (PC-5 from Sprint 5). |

## Hard-stop floor

Same as Sprint 5: env breakage, site availability, new WCAG regression on shipped pages, schema deletion.

## Sprint posture

- Local-only; never push.
- `--no-ff` merges per cycle into integration.
- Integration → main `--no-ff` at sprint wrap.
- Orchestrator log at `docs/pl2/handoffs/sprint-6-orchestrator-log.md`.
- Wrap doc at `docs/pl2/handoffs/sprint-6-wrap.md`.

## Out of scope

- Other tech-debt items (Bundles 3–7 from `tech-debt-register.md`).
- Hero (FU-2 canonical).
- Pre-existing accepted deviations.
