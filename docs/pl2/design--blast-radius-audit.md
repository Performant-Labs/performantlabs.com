# Design — Blast-Radius / Placement-Correctness Analysis

**Status:** Tiers B + C BUILT & validated on pl2 (2026-06-12); see "Build status" below.
**Date:** 2026-06-12
**Pipelines affected:** Website Audit (O-W-O) + Website Front-End build (O-F-A-T-S)
**Decisions locked (operator, 2026-06-12):** priority = **over-reach (containment)**; ground
truth = **infer from conventions**; lives in **both** pipelines; depth = **static → render →
perturbation**, gated behind `--work-extra-hard`; a **sampling/budget model is required**.

---

## 1. Problem

A CSS/component change must be authored at the precise point in the cascade + component
hierarchy so it affects **exactly the intended downstream elements and no more**. The current
audit detects *symptoms* of misplacement (wrong-layer, `!important`, cross-component reach) but
never measures what a rule actually affects. Goal: surface **over-reach** — a rule whose real
effect extends beyond its intended scope — empirically, not by pattern-guessing.

## 2. Definitions

- **Matched set** — DOM elements a selector matches on a rendered page.
- **Effective reach** — elements for which the rule's declaration actually *wins* the cascade
  for a given property (matched **and** winning).
- **Intended scope (convention-inferred)** — where a rule is *supposed* to reach:
  - Component rule (file under `components/<X>/`) → elements inside an `<X>` subtree.
  - Theme-zone token override (`html .theme--white { --t }`) → elements inside that zone.
  - Base/Layer-3 token → intended-global; judged by *fan-out*, not containment.
- **Over-reach** — effective-reach elements **outside** intended scope. (Priority.)
- **Under-reach** — intended-scope elements the rule fails to affect. (Advisory.)
- **Blast radius (of a change)** — elements whose computed style changes when a rule/declaration
  is added/modified/removed (empirical, via perturbation).

**Platform anchor (Drupal-Canvas-SDC):** SDC components render with
`data-component-id="<ns>:<component>"`. This is a *reliable* subtree anchor — "element E is
inside component X" = `E.closest('[data-component-id$=":X"]')` exists. The adapter declares this;
it makes convention-based containment exact rather than class-name guesswork. Other platforms
supply their own subtree anchor in their adapter.

## 3. Analysis tiers (cheap → expensive)

Escalating; `--work-extra-hard` enables Tiers B–C.

**Tier A — Static suspects (always on; no render).** Extend `css-scan.py`:
- Selector-breadth heuristics: bare element selectors and descendant selectors in component
  files (`section p {}`), classes reused across unrelated component files, `:root` token defs
  that should be zone-scoped.
- **Shared-dependency fan-out:** count consumers of each token/mixin/base rule → theoretical
  reach. High fan-out = high blast-radius risk.
- Output: a **ranked suspect list** (this is the budget input for Tiers B/C).

**Tier B — Empirical reach + cascade attribution (render; `--work-extra-hard`).** New tool
`cascade-map.cjs`:
- Render page(s) × viewport(s).
- For each suspect rule (budgeted): `querySelectorAll(selectorText)` → matched set; per matched
  element + property, reconstruct the cascade winner from the CSSOM (iterate
  `document.styleSheets → cssRules`, test `el.matches(selectorText)`, sort by specificity +
  source order) → effective reach + winner's file:line.
- Apply the convention containment test (via the adapter's subtree anchor) → elements in
  effective reach but **outside** intended scope = **over-reach findings**.
- Observation only (no mutation). Cost: suspects × elements × viewports (bounded by budget).

**Tier C — Perturbation / blast radius (render + mutate; `--work-extra-hard`; heaviest).** New
tool `perturb.cjs`:
- *Audit mode:* snapshot computed styles → disable a suspect rule → re-snapshot → diff =
  empirical blast radius → classify in/out of intended scope.
- *Per-change mode (build pipeline):* baseline render → apply the diff's actual change →
  re-render → diff = blast radius of **the change** → over-reach = changed elements outside the
  change's intended scope; under-reach = intended elements unchanged.
- Cost: a render + full/sampled computed-style snapshot per perturbation. **Must be budgeted.**

## 4. Sampling / budget model (the load-bearing part)

Tier C is O(suspects × elements × viewports × pages); uncontrolled it never finishes. Rules:

- **Budget input:** `--budget <wall-clock>` and/or `--max-perturbations N`; `--work-extra-hard`
  raises defaults for overnight offload. Defaults declared in the project profile.
- **Prioritize, never enumerate:** Tier C only perturbs rules Tier B flagged as over-reaching or
  Tier A ranked high-fan-out. Never perturb every rule.
- **Element sampling:** snapshot representative instances per component class **plus all
  out-of-scope candidates** (the elements over-reach would hit). Full snapshot only under an
  element-count threshold.
- **Page sampling:** one representative page per template/layout (configurable in profile), not
  every URL.
- **Viewport sampling:** 375 + 1280 default; add 768 only for responsive-flagged rules.
- **Incremental / cache:** cache Tier B maps keyed by (CSS hash, DOM hash); per-change mode is
  naturally incremental (only the diff's rules).
- **Early-exit:** stop perturbing a rule once over-reach is *confirmed* — don't measure
  magnitude beyond "it leaks."
- **Deterministic ordering:** process by suspect rank, so a bigger budget **extends** coverage
  rather than reshuffling it.
- **No silent caps:** the report MUST state coverage — "perturbed 120/400 suspects; 280 deferred
  (ranked list attached)" — never imply completeness. (Standing operator preference.)

## 5. Outputs

- **Audit (O-W-O):** new **blast-radius** dimension in W's HTML report. Per finding: rule
  location, intended scope, measured reach, out-of-scope elements (selector + `data-component-id`
  + sample), tier reached (A/B/C), confidence. Plus a **coverage summary** (budget used, analyzed
  vs deferred). Findings still O-triaged against source before decomposition.
- **Build (per-change):** a blast-radius gate in A/T. For the diff: empirical changed-set vs
  intended scope → **BLOCK** on over-reach beyond a threshold; under-reach reported advisory.

## 6. Where it lives

| Piece | Location |
|---|---|
| Tier A + fan-out | extend `website-audit/core/tools/css-scan.py` |
| Tier B | new `website-audit/core/tools/cascade-map.cjs` |
| Tier C | new `…/perturb.cjs` (shared; build pipeline calls it on the diff) |
| Dimension + tier/budget protocol | `website-audit/core/roles/website-auditor.md` + `audit-flow.md` |
| Per-change gate | `website-frontend/core/roles/{architecture-reviewer,tester}.md` |
| `--work-extra-hard` / `--budget` flags | the two orchestrators; defaults in the profile |
| Subtree anchor, zone selectors, layer→scope rules | the **adapter** (per platform) |

## 7. Limitations (state honestly in reports)

- **Intentional over-reach** (deliberate global utilities) → false positives. Need a
  **waiver/allowlist** (mirror the architecture-audit `waivers.json`) so confirmed-intentional
  reach is suppressed on re-runs.
- **CSSOM cascade reconstruction** is approximate for `@layer`, `:where()` (zero specificity),
  container queries, shadow DOM — document these blind spots.
- **Static-state only** unless the interaction harness first drives JS state (hover, open menus,
  active filters); perturbation then measures those states too.
- **Sampling ⇒ coverage < 100%**, always reported.

## 8. Phasing (proposed build order)

1. **Tier A + fan-out + suspect ranking** — cheap, immediate value, no render.
2. **Tier B cascade-map + convention containment** — the core over-reach detector.
3. **Budget model + coverage reporting.**
4. **Tier C perturbation** — audit + per-change.
5. **Waiver mechanism.**

## Build status (2026-06-12)

**Built & validated against the live pl2 homepage:**
- **Tier B** — `website-audit/core/tools/cascade-map.cjs`: containment detector using SDC
  `data-component-id` as the subtree anchor. Correctly separates true boundary-escapes from
  normal parent→nested-child composition (17 raw → 2 real on the homepage).
- **Tier C** — `…/perturb.cjs`: disables each suspect rule and re-measures → ACTIVE vs DORMANT.
- Severity model implemented: ACTIVE+high-risk-prop = CRITICAL; ACTIVE+other or DORMANT =
  WARNING; nested-child composition = INFO. **No count threshold** (resolves §9.1).
- First run retained at `docs/pl2/handoffs/audits/<ts>-homepage-blastradius/` (2 low-severity,
  likely-intentional escapes; no critical live layout over-reach — containment is clean).

**Also built & validated (2026-06-12, second pass):**
- **Tier A** — `css-scan.py` now emits `fan-out` (custom props consumed ≥8× → change
  blast-radius rank; 75 on the pl2 chain) and `broad-selector` (classless selectors in component
  files; 161 found).
- **Waivers** — `perturb.cjs --waivers <file>` routes confirmed-intentional escapes to a
  `waived` section (never dropped). Validated: the intentional primary-menu→menu-block escape
  waives cleanly.
- **Budget + coverage** — `perturb.cjs --max-targets N --budget-seconds S`; descending-score
  order; emits an explicit `coverage` block (total/waived/perturbed/deferred/elapsed/complete)
  with a ranked `deferred` list — no silent caps.
- **Per-change build gate** — build pipeline has its **own copies** of `cascade-map.cjs` +
  `perturb.cjs`; `architecture-reviewer.md` gates a new ACTIVE high-risk boundary-escape as
  `block`. (Pipelines keep separate copies — no cross-reference.)

**Remaining (orchestration polish, not core capability):**
- Page-set sampling **loop** at the orchestrator level (run the chain across the profile's
  representative URLs; per-page or global budget).
- Fold blast-radius findings into W's HTML report as a first-class dimension (currently emitted
  as JSON + triaged in `findings.md`).
- Element-count snapshot threshold (full vs sampled) for very large pages.

## 9. Open questions for the operator

1. **Build-gate threshold:** what magnitude of over-reach should *BLOCK* a change vs warn?
   (e.g., any out-of-scope element = block? or > N elements / > some component count?)
2. **Budget defaults:** overnight wall-clock ceiling and a per-page element-count threshold for
   full vs sampled snapshots?
3. **Representative page set** for pl2 (which URLs cover the distinct templates/layouts)?
4. **Waiver format/authority:** reuse the architecture-audit `waivers.json` shape?
5. **Scope of first build:** Tiers A–B only (no perturbation) as a v1, then add Tier C — or go
   straight to all three?
