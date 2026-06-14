# Cycle 4 — `/about-us` Card-canvas outer padding alignment

**Sprint:** 12
**Branch:** `aa/pl-sprint-12-cycle-4-about-us-card-padding`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Tune the `card-canvas` outer padding on the 3-up tools card grid in §C (Open source) of `/about-us` to match the preview's 48 px cadence. Cycle 1's audit recorded:

> **Open source (§C) header + cards** — … Outer card wrapper `padding: 0` (inner padding handled by SDC slots) — preview specifies `padding: 48px` on the outer card. Net effect is slightly tighter body cadence on live. **DELTA — minor**, card outer padding only.

This cycle aligns live to preview. The `card-canvas` SDC is page-shared with `/open-source-projects` (and possibly other pages); sibling regression spot-checks are mandatory.

## Background — Cycle 1 audit finding

From `cycle-1-about-us-audit-S.md`:

- Live `card-canvas` outer wrapper: `padding: 0` (inner padding handled by SDC slots).
- Preview `.project-card` outer wrapper: `padding: 48px`.
- Net effect: live's card bodies sit slightly tighter than preview's; on-brief content reads the same but cadence is off.

Section-cluster carve absorbed: Cycle 1 "Open source §C cards DELTA" row.

## Input documents

Read these before starting:

- [ ] `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md` — sprint runbook (PC-1, PC-3, PC-5, PC-8)
- [ ] `docs/pl2/pl-plan--about-us.md` — page runbook
- [ ] `docs/pl2/handoffs/cycle-1-about-us-audit-S.md` — Open source §C cards DELTA row
- [ ] `docs/pl2/handoffs/cycle-3-about-us-kicker-token-F.md` — recent precedent for an L3-with-cross-page-impact decision; useful framing for the page-shared-card scope-split judgment in this cycle
- [ ] `docs/pl2/handoffs/sprint-12-orchestrator-log.md` — cycle ledger, FB list (note FB-7: the "PC-1 supersedes scope-split when AE confined + contrast preserved" precedent)
- [ ] `docs/pl2/briefs/pl_design_brief.md` — spacing tokens, card cadence
- [ ] `docs/pl2/Previews/about-us.html` — `.project-card` selector + 48 px treatment
- [ ] `docs/pl2/Previews/open-source-projects.html` — confirm preview's expected card cadence on the sibling page so you can predict cross-page impact
- [ ] `docs/pl2/workflow-ofts.md` §"F — Feature Implementor" (7-step workflow)

## Operating environment

- **Live URLs:**
  - Primary: `https://pl-performantlabs.com.3.ddev.site:8493/about-us`
  - Sibling: `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects`
- **Active theme:** `performant_labs_20260502`
- **DDEV:** port 8493 from host; mkcert-trusted, no `-k`. SSL-chain workaround: `ddev exec curl http://localhost/<path>`.
- **Likely L5 file** (verify in Step 3): `web/themes/custom/performant_labs_20260502/css/components/card.css`. The `card-canvas` SDC schema lives at `web/themes/contrib/dripyard_base/components/card/card-canvas.component.yml`; do NOT modify contrib.
- **Canvas-content patch unlikely.** This is CSS cadence, not content. If somehow needed, preserve `component_version` (PC-6) — reference `scripts/sprint12-cycle2-about-us-bio-renest.php`.

## Scope (binding — do not exceed without scope-split escalation)

1. **Root-cause trace (Step 3).** Identify the current selector + declaration that produces `padding: 0` on the `card-canvas` outer wrapper. Compare against preview's `.project-card { padding: 48px }`. Determine whether the live treatment is a deliberate `padding: 0` declared somewhere or simply the absence of any padding declaration. Document the cascade.
2. **Preview verification.** Confirm the preview's 48 px is on the **outer** wrapper, not an inner element. Confirm whether the inner SDC slots already carry their own padding that would compound with a 48 px outer pad (visual sanity-check via composite rendering or DevTools-equivalent inspection — F's `getComputedStyle` cross-check or Playwright preview).
3. **Fix scoped to root cause (L5 preferred).**
   - **L5 (component CSS in `web/themes/custom/performant_labs_20260502/css/components/card.css`):** preferred. Add `padding: 48px` (or the brief-canonical spacing token if one exists in the spacing scale; F to check the brief's token table) on the `.card-canvas` outer wrapper. Confirm no `!important`. Confirm correct specificity (no conflict with existing SDC defaults).
   - **L3 (spacing token):** justified only if the brief defines a token like `--card-padding-outer` that should be added or aligned. Likely not needed.
4. **Cross-page impact mandatory.** `card-canvas` is shared with `/open-source-projects` (the OSS page). Before editing, render both pages and capture the current state of the cards. After editing, capture again. Confirm the OSS page either (a) was already off-cadence the same way and is now also brought into preview-compliance, or (b) preview specifies a different cadence on OSS in which case scope-split is required.
5. **Responsive behavior.** Confirm `padding: 48px` does not break the 3-up → 1-up collapse at 768 / 375. If the preview uses a different padding at smaller viewports (e.g. `padding: 24px` at mobile), match that scheme. Document any media-query additions.
6. **No `!important`. No new SDCs. No new brand tokens** unless brief mandates and F flags clearly.

## Scope-split rule (binding)

If F discovers the OSS page preview specifies a different `.project-card` padding than the about-us preview, **stop and surface a scope-split proposal in the handoff before editing**. Two preview-canonical values means the cycle absorbs both pages — operator should be aware before F commits to a unified L5 value.

The precedent from Cycle 3 (FB-7 in orchestrator log) applies: PC-1 supersedes the scope-split rule **only** when (a) the brief or preview is unambiguous on the canonical value, (b) the cross-page delta will be empirically sub-perceptual or improve fidelity on both pages, and (c) no regression risk on shipped chrome. If any of those is in doubt, surface the scope-split.

## Out of scope

- Hero (§A) edits (FU-2 hero exception).
- Bio re-nest (Cycle 2, already shipped).
- Kicker token (Cycle 3, already shipped).
- §C header content (kicker + h2 already MATCH per Cycle 1).
- §E (Closing CTA) — no card-canvas.
- Homepage cards (different component if applicable — confirm in Step 3; if not card-canvas, ignore).
- New brand tokens, new SDCs, contrib edits.
- `!important`.

## Acceptance criteria

- [ ] Live `/about-us` §C cards render outer wrapper `padding: 48px` at 1280 (or matching preview's cadence with any breakpoint variants the preview specifies).
- [ ] Card 3-up collapse to 1-up at 768 / 375 still works correctly.
- [ ] Live `/open-source-projects` cards either render the same new cadence and improve fidelity to its own preview, OR a scope-split was surfaced before editing.
- [ ] No regression on `/services` (no card-canvas there per Cycle 1, but verify).
- [ ] No regression on homepage (verify whether homepage uses card-canvas; if yes, include in sibling sweep).
- [ ] No `!important` introduced.
- [ ] Root cause + layer-trace decision documented in handoff-F.
- [ ] Cross-page consumer grep matrix in handoff-F (which pages use `.card-canvas`).
- [ ] Tier 1 (curl/grep) and Tier 2 (ARIA / structural + contrast carry-over) pass.
- [ ] Tier 3 (S) per-section delta: Cycle 1 "Open source §C cards" row flips DELTA → MATCH at 1280 / 768 / 375.
- [ ] S Tier-3 includes cross-page sibling diffs on every `card-canvas` consumer page (precedent set in Cycle 3).
- [ ] Pa11y with allowlist (PC-5): 0 errors. Allowlist NOT edited.

## Handoff locations

- `docs/pl2/handoffs/cycle-4-about-us-card-padding-F.md`
- `docs/pl2/handoffs/cycle-4-about-us-card-padding-T.md`
- `docs/pl2/handoffs/cycle-4-about-us-card-padding-S.md`

## Layer-choice guidance (PC-3, autonomous)

F's Step-3 layer trace is autonomous. Expected outcome: **L5** in `web/themes/custom/performant_labs_20260502/css/components/card.css` (or wherever the active selector for `.card-canvas` outer wrapper currently lives). L3 only if brief specifies a spacing token. Record the trace.

## Pre-commitments inherited from sprint kickoff

PC-1 (brief / preview wins over current live); PC-3 (autonomous layer trace); PC-5 (pa11y allowlist locked); PC-6 (component_version if Canvas patch — unlikely); PC-7 (specificity-safe markers — likely N/A); PC-8 (per-section AE binding at S).

## Commit message (drafted by O at cycle close)

`fix(about-us): cycle 4 — align card-canvas outer padding to preview 48px cadence`
