# Sprint 4 — Pre-Services Foundation Runbook

> **Parent:** [`post-homepage-next.md`](post-homepage-next.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Prerequisite:** Homepage Phase 8.x merged to `main` (in flight on `aa/pl-homepage-phase-8.6-polish`)
> **Successor:** [`pl-plan--services.md`](pl-plan--services.md) — Sprint 4 should land before Services Phase 1 opens
> **Upstream references:**
> - [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) §A.2, §A.3, §D.3, §D.4, §J.2, §J.6, §L.1, §L.4
> - [`post-homepage-next.md`](post-homepage-next.md) §2.2 (Tech Debt #1), §2.3 (Tech Debt #4)

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` |
| Branch (parent) | `aa/pl-sprint-4-pre-services-foundation` (from `main`) |
| Estimated effort | ~6–9 hours across 6 cycles |
| **Status** | 🟡 **Planned (2026-05-11).** Not yet opened. |

---

## Objective

Eight site-wide foundation items have accumulated across the homepage overhaul (Phase 8.x in flight) and prior page audits. Each one would benefit *every future page* — Services first, then About, How-We-Do-It, and beyond. Doing them now, in a focused sprint, prevents every future F session from re-encountering the same Layer-1 mis-configs, token-alias debt, and a11y gaps.

This sprint is **explicitly pre-Services**. The hero H1 size reconciliation (Cycle 3) in particular forces a brief-vs-live decision that Services would otherwise re-litigate. Better to set the baseline once.

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| S4-R1 | **Sprint runs as 6 cycles**, not one bundled commit. The new F scope cap in [`workflow-ofts.md`](workflow-ofts.md) requires splits when work touches > 1 component family or > 1 design surface. These items span Drupal config, base.css token architecture, Canvas spacing, template a11y, and SDC schema work — six surfaces. | F scope cap, workflow-ofts.md |
| S4-R2 | **Cycles 1–5 are required before Services Phase 1.** Cycle 6 (heal-flow Canvas integration) is deferrable to Services prep if the need crystallizes there. | this runbook |
| S4-R3 | **Cross-page T3 is mandatory for any cycle touching site-wide chrome or tokens.** S must screenshot at least `/`, `/services`, `/articles`, and `/contact-us` at desktop + mobile after changes that affect every page. | sprint-3 precedent S3-R5 |
| S4-R4 | **Decision-first cycles** (Cycles 3, 4, 5 each contain an operator-decision step) pause at F's confirmation table until the operator picks a path. F does not pre-empt the decision; F enumerates options with tradeoffs and waits. | operator-decision threshold in O prompt |
| S4-R5 | **Each cycle commits independently** to its own sub-branch off the sprint branch. Sprint branch `aa/pl-sprint-4-pre-services-foundation` is the integration line; each phase merges in via `--no-ff` per the local-only posture rule. | project memory `project_local_only_main.md` |
| S4-R6 | **Housekeeping items (D.1 close-out, J.4 verify-or-close) ride along with the sprint** but do not require their own OFTS cycle. O closes them as part of sprint cleanup. | this runbook |

---

## Operator pre-commitments (autonomous mode)

The operator pre-committed to the following at sprint kickoff (2026-05-11). These resolve every 🛑 Approval Checkpoint in this sprint under autonomous-mode operation. If the operator invokes human-in-the-loop mode mid-sprint, these revert to standard checkpoints requiring explicit approval.

| Checkpoint | Pre-commitment | Rationale |
|---|---|---|
| 🛑 S4-0 (sprint kickoff) | Approved 2026-05-11 | Operator approved the sprint plan |
| 🛑 S4-3 (Hero H1 path) | **A** — reconcile previews up to 72px | Cheapest; brief already has `display-xl: 72px`; live already 72px; updates 4 preview HTML files plus one brief annotation |
| 🛑 S4-4 (Canvas alignment path) | **A** — retune Pass 2 in `canvas.css` to match Dripyard's `.container` gutter | Runbook explicitly recommends A; lowest ripple |
| 🛑 S4-6 (heal-flow) | **Defer** — Cycle 6 not opened in Sprint 4 | Heal-flow is a Services-scoping question, not a Sprint 4 prerequisite; revisit during Services Phase 1 prep |
| 🛑 S4-WRAP | Self-contained `sprint-4-wrap.md` per §Cleanup | No operator handshake; wrap doc is the deliverable |

Cycle-internal decisions:

- **Cycle 5 D.4** — if a page type is missing breadcrumbs, document as a follow-up issue in the orchestrator log; do not widen Easy Breadcrumb or block placement autonomously (cross-site ripple risk).
- **Cycle 5 scope split** — F may split into 5a (J.2 + A.3 template work, requires authoring code) and 5b (A.2 + D.4 verify-only) at its discretion without escalating; both 5a and 5b must land before sprint wrap.

Autonomous-mode policies for this sprint live in the user-level orchestrator/feature-implementor prompts (`~/.claude/agents/`); operator-facing record of decisions made under autonomous mode lives in `docs/pl2/handoffs/sprint-4-orchestrator-log.md`.

---

## Operating rules

All agents follow the standing operating rules from [`workflow-ofts.md`](workflow-ofts.md). Sprint-specific emphasis:

- **Operator-decision threshold:** O escalates only for scope change, design ambiguity in the source of truth, or breaking change to shared scope. Cycles 3, 4, and 5 contain explicit decision points where F presents options to the operator; those are *not* the same as menu-shopping for permission on uncontroversial paths.
- **F scope cap:** If any cycle's actual diff would exceed ~6 files or > 1 component family, F proposes a split before writing code. Cycle 4 (Canvas title-content alignment) and Cycle 5 (a11y polish bundle) are the highest-risk for scope creep.
- **Preview sanity check at S:** S sanity-checks the preview/spec before running visual diffs. Cycle 3 (hero H1) and Cycle 4 (Canvas alignment) both reference previews; S should confirm the previews are internally consistent before declaring REWORK.
- **Cross-page T3** per S4-R3.
- **7-step CSS change workflow** ([`theme-change--workflow.md`](theme-change--workflow.md)) for every CSS change. Layer trace required at Step 3.
- **Read `.component.yml` before referencing any prop name.** Cycle 6 (heal-flow SDC) is entirely schema-bound.
- **No `!important`. Stage files by explicit path.**

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (from host, not inside ddev exec) |
| SSL | Locally-trusted mkcert cert — no `-k` flag needed |
| Cache clear | `ddev drush cr` before every verification run |
| Pa11y | Run from host against `/` and a representative second page per cycle |
| Cross-page T3 | S screenshots `/`, `/services` (or `/articles` if Services not yet live), `/articles`, `/contact-us` at 1280px + 375px when site-wide chrome or tokens change |

---

## Cycle plan

### Cycle 1 — Header theme-source repair (Tech Debt #1)

**Pipeline:** O → F → T → S → O
**Branch:** `aa/pl-sprint-4-phase-1-header-theme-source`
**Source:** [`post-homepage-next.md`](post-homepage-next.md) §2.2 ("Tech Debt #1")

**Objective.** Fix the header block's Drupal theme prop at the config source (it is currently `theme--light`) so `<header class="theme--white">` renders correctly without a CSS compensation patch.

**Why this is foundational.** `header.css` currently forces `background-color: #FFFFFF` and `--theme-surface: #FFFFFF` on `.site-header` because the block's theme prop is wrong. Every future F that touches header CSS reads this Layer-5 patch and has to understand it compensates for a Layer-1 mis-config. Fixing once propagates site-wide; failing to fix means perpetuating confusing CSS for every page.

**Scope:**
1. Identify the Drupal config entity that sets the header block's theme prop (likely `block.block.performant_labs_20260502_header.yml` or similar in `config/sync/`).
2. Change `theme--light` → `theme--white` at the config source. Export with `ddev drush cex`.
3. Remove the CSS workaround in [`header.css`](web/themes/custom/performant_labs_20260502/css/components/header.css) — the forced `background-color` and `--theme-surface` overrides that were compensating.
4. Re-verify the header renders identically (same visual result, cleaner DOM/CSS path).

**Files expected to change:**
- `config/sync/block.block.*header*.yml` (1 file)
- `web/themes/custom/performant_labs_20260502/css/components/header.css` (remove workaround)

**Acceptance criteria:**
- [ ] Header `<header>` DOM has `class="theme--white"` (not `theme--light`)
- [ ] No `background-color: #FFFFFF` or `--theme-surface: #FFFFFF` compensation rules remain in `header.css`
- [ ] Visual diff against current live shows zero header delta at 1280 / 768 / 375
- [ ] `ddev drush cim` shows clean state
- [ ] No regressions on `/`, `/articles`, `/contact-us`, `/open-source-projects`

**Operator decision:** None (deterministic fix).

---

### Cycle 2 — Brand tokens on `:root` (L.4)

**Pipeline:** O → F → T → S → O
**Branch:** `aa/pl-sprint-4-phase-2-tokens-on-root`
**Source:** [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) §L.4

**Objective.** Declare the brand-canonical token values (`--ink`, `--body`, `--cream`, `--primary`, `--accent`, etc.) on `:root` in [`base.css`](web/themes/custom/performant_labs_20260502/css/base.css) so any code that reads them outside a `.theme--*` zone receives the brand values instead of falling through to a legacy `--primary: #0000d9` from a Dripyard / Tailwind ancestor.

**Why this is foundational.** Today, `getComputedStyle(document.documentElement).getPropertyValue('--ink')` returns empty. `:root --primary` resolves to `#0000d9`. Everything renders correctly *only because* component CSS hardcodes color values or stays inside themed zones. Any future component that reads a token at the root level — JS-driven, third-party, or a new SDC — receives the wrong value silently.

**Scope:**
1. Read the existing brand token definitions inside `html .theme--white`, `html .theme--light`, etc. in [`base.css`](web/themes/custom/performant_labs_20260502/css/base.css).
2. Determine the canonical default values (brand-white surface is the most common; use those as the `:root` defaults).
3. Add a `:root { … }` block at the top of `base.css` declaring every brand token with its canonical default.
4. **Verification step:** spot-check every existing component that reads a brand token still resolves to the intended value after the change. Themed-zone overrides should still cascade correctly.

**Files expected to change:**
- `web/themes/custom/performant_labs_20260502/css/base.css` (add `:root` block)

**Acceptance criteria:**
- [ ] `:root` block defines every brand token with its brand-canonical default
- [ ] `getComputedStyle(document.documentElement).getPropertyValue('--ink')` returns the brand ink color (not empty)
- [ ] `getComputedStyle(document.documentElement).getPropertyValue('--primary')` returns brand teal (not `#0000d9`)
- [ ] Visual diff against current live shows no *unintended* delta on `/`, `/articles`, `/contact-us`, `/open-source-projects` (themed zones override correctly). Brand-correction deltas on surfaces previously falling through to Dripyard defaults — e.g. pale-lavender breadcrumb / page-title bands flipping to brand cream `#F5EFE2` — are accepted as intended cycle output, not regressions. (Wording corrected 2026-05-11 per Sprint 4 FU-1; original "zero visual delta" was empirically wrong since `:root` backstop necessarily affects unthemed surfaces.)
- [ ] T1 grep confirms `:root` selectors land in served CSS
- [ ] No regressions on any themed surface

**Operator decision:** None (deterministic fix; values come from the existing `.theme--white` block).

---

### Cycle 3 — Hero H1 size reconciliation (L.1)

**Pipeline:** O → (decision) → F → T → S → O
**Branch:** `aa/pl-sprint-4-phase-3-hero-h1-reconciliation`
**Source:** [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) §L.1

**Objective.** Reconcile the hero H1 size discrepancy across all four landing-page heroes (`/`, `/services`, `/how-we-do-it`, `/open-source-projects`). Live renders 72px (Dripyard `--h1-size: 4.5rem`); previews specify 64px; brief has no 64px token.

**Why before Services.** Services will hit this same discrepancy on Phase 1 of its overhaul. Better to set the baseline once.

**Decision required (operator picks path):**

- **(A) Reconcile previews UP to 72px.** Cheapest. Update all four previews to use 72px / -1.8px tracking. Brief stays unchanged (already has `display-xl: 72px`). Live stays unchanged. Brief codifies `display-xl` as the standard landing hero size.
- **(B) Introduce a new `display-lg-plus: 64px` token, update `--h1-size` site-wide.** More work, touches every landing-page hero. Brief grows a new typography token. Requires verifying every consumer of `--h1-size` site-wide.
- **(C) Per-page tokens.** Each landing page uses its own H1 size. Cheap to land but creates cross-page inconsistency that S would flag on every audit. Not recommended.

**F presents options + tradeoffs in the confirmation table; operator picks; F executes the chosen path.**

**Scope (per chosen path):**
- **A:** Edit `docs/pl2/Previews/{homepage,services,how-we-do-it,open-source-projects}.html` to use 72px / -1.8px on the hero H1. Brief gets one note added under `display-xl`.
- **B:** Add `display-lg-plus: 64px` to the typography scale in [`pl_design_brief.md`](Briefs/pl_design_brief.md). Update `--h1-size` token in [`base.css`](web/themes/custom/performant_labs_20260502/css/base.css). Grep all consumers and verify rendered output across all four landing pages.

**Files expected to change (path B):**
- `docs/pl2/Briefs/pl_design_brief.md` (add token)
- `web/themes/custom/performant_labs_20260502/css/base.css` (update `--h1-size`)
- Potentially typography component CSS if `--h1-size` is shadowed there

**Acceptance criteria:**
- [ ] All four landing-page heroes render the same H1 size — 72px (path A) or 64px (path B)
- [ ] Previews match live (cross-page T3 at 1280)
- [ ] Brief is consistent with rendered output
- [ ] No regressions on non-hero H1 contexts (e.g. article body H1)

**Operator decision:** Required at confirmation table.

---

### Cycle 4 — Canvas page title-vs-content horizontal alignment (D.3)

**Pipeline:** O → (decision) → F → T → S → O
**Branch:** `aa/pl-sprint-4-phase-4-canvas-title-alignment`
**Source:** [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) §D.3

**Objective.** Close the ~6px horizontal misalignment between the Canvas page-title band (`.block-page-title-block`, 20px inset) and the content below it (`.dy-section__container.container`, ~14px auto-margin) at mobile and up. Visible as a leftward "tuck" on every Canvas page.

**Why cross-page.** Affects `/contact-us`, `/articles-2`, `/open-source-projects`, and every future Canvas page including Services. Pre-existed the gutter-architecture decision but became visible after Path 1 (Dripyard owns the gutter) was committed.

**Decision required (operator picks path):**

- **(A) Retune Pass 2 in `canvas.css` to match Dripyard's `.container` gutter.** Cheapest. Swap `var(--spacing-xs, 1.25rem)` for whatever value Dripyard's `.container` produces. Risk: `.container` is viewport-derived, not a fixed token. Hardcoding couples Pass 2 to an upstream value.
- **(B) Retune Dripyard's `.container` via subtheme override** to emit `padding-inline: var(--spacing-xs)` at mobile instead of auto-margins. Matches tokens exactly. Risk: `.container` is used widely by Dripyard; an override could ripple into non-Canvas contexts.
- **(C) Wrap the title in a Basic Section** so h1 and body share one gutter owner. Matches Canvas composition theory. Changes authoring workflow on every Canvas page.
- **(D) Accept the 6px discrepancy.** Cheapest of all; trades pixel perfection for architectural calm.

**Recommended:** (A) for this sprint. Lowest ripple. Document the coupling in the trace comment.

**Scope (path A):**
1. Measure Dripyard's `.container` left/right gutter at 375 / 576 / 768 / 992 / 1200+ viewports.
2. Update Pass 2 in [`canvas.css`](web/themes/custom/performant_labs_20260502/css/layout/canvas.css) so `.block-page-title-block` `padding-inline` matches `.container`'s effective gutter at each breakpoint.
3. T3 at 375 and 1280 on at least `/contact-us`, `/articles-2`, `/open-source-projects` — confirm h1 x-offset equals content-first-element x-offset.

**Files expected to change:**
- `web/themes/custom/performant_labs_20260502/css/layout/canvas.css`

**Acceptance criteria:**
- [ ] Title-band left edge aligns with content first-element left edge (within 1px) at 375, 768, 1280
- [ ] No regression on any non-Canvas page
- [ ] Trace comment documents the `.container`-derived value and the coupling

**Operator decision:** Required at confirmation table (path A vs B vs C vs D).

---

### Cycle 5 — Site-wide a11y polish bundle (J.2 + A.2 + A.3 + D.4)

**Pipeline:** O → F → T → S → O
**Branch:** `aa/pl-sprint-4-phase-5-a11y-polish`
**Source:** [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) §A.2, §A.3, §D.4, §J.2

**Objective.** Resolve four site-wide a11y items that are individually small and collectively meaningful before Services brings new templates into the mix.

**Scope:**

1. **J.2 — Move `<section class="page-title">` inside `<main>`.** Currently sits between `page.highlighted` (breadcrumb) and `<main>`, above the main landmark. Fix: edit the page-level template (likely `page.html.twig` or a region-template override) so the page-title section renders inside `<main>`. Cross-page T3 required — affects every page.

2. **A.2 — Verify `<h2>Main navigation>` is truly `.visually-hidden`.** Confirm the nav-labeling h2 (first heading on every page before page h1) is invisible to sighted users and properly scoped for screen-reader landmark identification. If it is `visually-hidden` and the SR experience reads as intended, document and close. If it leaks visually anywhere, fix the visually-hidden rule.

3. **A.3 — Add `aria-current="page"` to the active pager `<li>`.** Affects every paginated listing (today: `/articles-2`, `/articles`, any future paginated views). Fix: theme-level pager template override — `pager.html.twig` (or equivalent in `dripyard_base`/`neonbyte`) that adds `aria-current="page"` on the `.is-active` item.

4. **D.4 — Breadcrumb audit across page types.** Scripted curl across one URL per page type (book interior, Canvas page, article detail, Views page, user-facing account page) grepping for `<nav … aria-label="breadcrumb">` or the `.breadcrumb` DOM hook. If any page type is missing breadcrumbs, widen the block placement or adjust Easy Breadcrumb settings.

**Files expected to change:**
- `web/themes/custom/performant_labs_20260502/templates/layout/page.html.twig` (J.2)
- `web/themes/custom/performant_labs_20260502/templates/navigation/pager.html.twig` (A.3 — new file)
- Potentially `block.block.breadcrumbs.yml` or `easy_breadcrumb.settings.yml` if D.4 surfaces a missing page type
- No file change expected for A.2 if the existing `visually-hidden` rule is correct (verify-only)

**Acceptance criteria:**
- [ ] `<section class="page-title">` renders inside `<main>` on every page tested
- [ ] Nav h2 confirmed visually-hidden (or fix shipped if not)
- [ ] Active pager `<li>` carries `aria-current="page"` on `/articles-2` and `/articles`
- [ ] Breadcrumb audit table: every page type has or explicitly does-not-need breadcrumbs (with rationale)
- [ ] Pa11y on `/`, `/articles`, `/contact-us` shows 0 errors

**Scope cap note.** This cycle is borderline on the F scope cap (4 items, 2–3 files). F evaluates at the confirmation table; if any item's scope grows beyond expected, F splits.

**Operator decision:** None for J.2, A.3. For D.4, operator decides response if a page type is missing breadcrumbs (widen vs accept).

---

### Cycle 6 — heal-flow SDC Canvas integration (Tech Debt #4)

**Pipeline:** O → F → T → S → O
**Branch:** `aa/pl-sprint-4-phase-6-heal-flow-canvas`
**Source:** [`post-homepage-next.md`](post-homepage-next.md) §2.3 ("Tech Debt #4")

**Objective.** Resolve the `heal-flow` SDC's `array-of-objects` Canvas gap so the diagram can be authored through Canvas rather than as inline SVG inside a text component. Unblocks templated reuse on Services and How-We-Do-It (both likely need a process-flow diagram).

**Why this is deferrable.** Cycles 1–5 are pre-Services prerequisites. Cycle 6 is "would be nice before Services authors a heal-flow-style section." If Services Phase 1 doesn't need a heal-flow diagram, defer Cycle 6 to a later sprint. Open Cycle 6 only after operator confirms it's needed.

**Decision required (operator picks path before opening):**

- **(A) Bridge via JSON-encoded prop.** Cheapest. Add a Canvas field that accepts a JSON string; the SDC twig template parses it. Loses Canvas's authoring UX for individual steps (would be a textarea blob).
- **(B) Custom Canvas field-type for array-of-objects.** Proper fix. Adds an authoring surface that matches Canvas's other field types. Substantial work — new field-type plugin, schema, validators, widget.
- **(C) Decompose `steps` into N separate string props.** Cheapest authoring UX. Hard upper bound on steps (e.g. 5). Each step is a separate `step_1_label` / `step_1_desc` pair. Awkward but works.

**Recommended for Sprint 4:** (A) if Cycle 6 is opened — fastest unblock, accept the authoring tradeoff. Path (B) is its own multi-cycle project.

**Scope (path A, sketch):**
1. Add a JSON-text Canvas field to the heal-flow SDC's component schema.
2. Update the SDC twig template to parse the JSON into the existing `steps` iteration.
3. Migrate the homepage's inline-SVG heal-flow rendering to authored Canvas data.
4. Document the JSON shape in the SDC's `README.md`.

**Files expected to change (path A):**
- `web/themes/custom/performant_labs_20260502/components/heal-flow/heal-flow.component.yml`
- `web/themes/custom/performant_labs_20260502/components/heal-flow/heal-flow.twig`
- `web/themes/custom/performant_labs_20260502/components/heal-flow/README.md` (or new)
- Canvas page entity (homepage) — heal-flow section's `component_inputs` blob

**Acceptance criteria:**
- [ ] heal-flow renders correctly on the homepage from authored Canvas data (not inline SVG)
- [ ] Canvas authoring UI shows the JSON-text field with a usable widget
- [ ] SDC schema validates the JSON shape
- [ ] README documents the JSON shape with an example
- [ ] Visual regression: heal-flow at 1280 / 768 / 375 matches pre-migration render

**Operator decision:** Required *before opening this cycle* — confirm Services needs a heal-flow diagram, and pick path A / B / C.

---

## Approval Checkpoints

🛑 **Approval Checkpoint S4-0** — Before opening Cycle 1, operator reviews and approves this sprint plan.
🛑 **Approval Checkpoint S4-3** — Before opening Cycle 3, operator confirms hero H1 path (A / B / C).
🛑 **Approval Checkpoint S4-4** — Before opening Cycle 4, operator confirms Canvas alignment path (A / B / C / D).
🛑 **Approval Checkpoint S4-6** — Before opening Cycle 6, operator confirms heal-flow is needed for Services and picks path (A / B / C).
🛑 **Approval Checkpoint S4-WRAP** — After Cycle 5 (or Cycle 6 if opened) merges, sprint summary + Services kickoff handshake.

---

## Out of scope

- Performance tuning (CSS bundling, font subsetting, critical-CSS extraction) — deferred per [`post-homepage-next.md`](post-homepage-next.md) §2.4 until two pages are live.
- Human WCAG 2.2 AA specialist audit — deferred per `post-homepage-next.md` §2.5.
- Legacy theme directory cleanup — deferred per `post-homepage-next.md` §2.6.
- Article-detail Phase 2 (end-of-article CTA) — its own work-stream per `post-homepage-next.md` §2.7.
- Articles to Canvas migration (GET-BACK §C.1) — product/content decision.
- Page-title-block enabling in Canvas picker (GET-BACK §C.2) — separate plumbing decision.
- Trust-bar logo sizing (GET-BACK §G.1) — likely closed by Homepage Phase 8.3 (logo bar bitmap parity at 28px / grayscale). Verify during sprint cleanup; if closed, mark in GET-BACK.
- FriendlyCaptcha sitekey on `/contact` (GET-BACK §D.2) — contact-page-specific; resolve before contact goes live for public traffic, not in this sprint.
- Article detail E.1–E.5 — article-detail-specific.
- Book pages F.1, F.2 — book-pages-specific.
- /automated-testing §5 metric (GET-BACK §H.1) — page-specific; resolve before that page launches externally.
- Services accessibility-engagement copy refinement (GET-BACK §I.1) — Services-specific; folds into Services planning.
- OSS-specific carry-forwards L.2, L.5, L.6 — OSS-specific.
- Article-detail L.7 pill touch-target — folds into the next a11y pass if upstream Dripyard pill is touched anywhere.
- Component-token-alias consolidation (GET-BACK §J.6) — **decision deferred**. Recommend addressing as a workflow-checklist addition first (cheaper than option A), promote to a code-consolidation pass only if a future global-token bump needs it. Track separately, not as a Sprint 4 cycle.

## Rework loop

Standard O-F-T-S rework: when S returns REWORK, O files a rework issue, F fixes on the same branch, T re-verifies the changed files, S re-runs Tier 3. Two rework cycles is the soft limit; on the third, O pauses to consult the operator about whether the acceptance criteria or the cycle's scope itself need revision.

When S returns ADVISORY-HOLD (preview/spec defective per the new S preview-sanity rule): O surfaces the advisory to the operator and pauses the cycle. Likely candidates: Cycle 3 may flag a preview-vs-brief inconsistency on the hero H1 token; Cycle 4 may flag that previews don't show the 6px misalignment because they're rendered at the brief's intended gutter, not Dripyard's actual `.container` math.

## Cleanup

After Cycle 5 (or Cycle 6 if opened) merges:

1. **Update [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md):** mark §A.2, §A.3, §D.3, §D.4, §J.2, §L.1, §L.4 as resolved (cite the sprint and the closing commit). For §J.6, note the workflow-checklist decision if taken. For §D.1, mark as resolved — current `logo.svg` is the real Performant Labs mark, not the KEYTAIL placeholder.
2. **Verify §J.4 (header "How we do it" wrap at 1280px):** render `/` at 1280 and confirm no wrap on any nav label. If clean, close §J.4 in GET-BACK. If still present, file a follow-up issue for a header micro-cycle.
3. **Update [`post-homepage-next.md`](post-homepage-next.md):** mark §2.2 (Tech Debt #1) as resolved by Cycle 1. If Cycle 6 ran, mark §2.3 (Tech Debt #4) too.
4. **Delete completed handoff files** for each cycle per the standard OFTS cleanup (handoffs are ephemeral coordination artifacts).
5. **Update [`pl-plan--services.md`](pl-plan--services.md):** add a one-line note at the top — "Sprint 4 (pre-Services foundation) merged [date]; baseline tokens, header chrome, a11y polish all locked. Hero H1 size = [chosen value]px from S4-R3."

## Key references

- [`workflow-ofts.md`](workflow-ofts.md) — the O-F-T-S pipeline, the new operator-decision threshold, F scope cap, and S preview-sanity / ADVISORY-HOLD verdict.
- [`theme-change--workflow.md`](theme-change--workflow.md) — the 7-step CSS change workflow.
- [`theme-change.md`](theme-change.md) — Layer system reference (L1 config → L5 component CSS).
- [`Briefs/pl_design_brief.md`](Briefs/pl_design_brief.md) — typography scale, color tokens, responsive breakpoint table.
- [`Briefs/archive/pl_homepage_components.md`](Briefs/archive/pl_homepage_components.md) — historical component mapping from the homepage overhaul; archived 2026-05-11. Useful as the pattern reference when authoring per-page component briefs for Services / About / etc.
- [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) — full triage of deferred items (the source of Cycles 2–5).
- [`post-homepage-next.md`](post-homepage-next.md) — the post-ship priority document (the source of Cycles 1 and 6).
- `~/Projects/playbook/workflow/workflow-coding-pipeline.md` — generic O-F-T-S template (canonical upstream of `workflow-ofts.md`).
- `~/Projects/playbook/testing/verification-cookbook.md` — T1 / T2 / T3 hierarchy.
- `~/Projects/playbook/frameworks/drupal/theming/operational-guidance.md` — curl-first, browser-last efficiency rules.
- `~/Projects/playbook/frameworks/drupal/theming/visual-regression-strategy.md` — T3 protocol; mandatory Playwright + ImageMagick visual diff.
