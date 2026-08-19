# Website Copy Audit Plan

Per-page copy audit and rewrite, anchored to the existing PL2 repositioning artifacts. The deliverable is one new `.md` per page in `docs/pl2/Existing Pages/Target1/`, paired against the `Design1/` intent and the `Actual1/` baseline already on disk.

## Approved parameters

- **Inputs root:** `docs/pl2/`
  - Briefs: `Briefs/pl_brand_brief.md`, `Briefs/pl_copy_brief.md`
  - Repositioning context: `repositioning-framework.md`, `repositioning-runbook.md`, `phase-2-page-plan.md`
  - Per-page intent: `Existing Pages/Design1/*.md`
  - Per-page baseline (rendered live): `Existing Pages/Actual1/*.md`
  - Visual baseline: `Existing Pages/Screenshots1/*.png`
- **Output:** per-page Markdown in `Existing Pages/Target1/`. Two file shapes — `<slug>--patches.md` for surgical edits, `<slug>.md` for rewrites — optionally with a `<slug>--audit.md` sibling when a rewrite needs a deeper conceptual frame. See Phase 2 for the choice criteria.
- **Page priority:** see *Recommended priorities* in `Existing Pages/Target1/_brand-conformance-review.md`. That order is informed by the actual content review and supersedes any priority list previously embedded in this plan.

## Project conventions this plan inherits

These are not negotiable per the existing PL2 work; new copy must conform.

- **Playwright before Cypress** in any sentence naming both frameworks. Playwright is primary; Cypress is legacy-supported.
- **Editor-owned body content.** New body copy is keyed in through the Drupal Admin UI on the existing Canvas page entities. Do not propose drush content scripts. Config (YAML) still goes through `drush cim`.
- **Alias swap after T3.** The legacy entity stays published and serving the URL until the new copy passes T1/T2/T3. No blank-page public window.
- **Vocabulary lock** (from `pl_brand_brief.md` §5): *Testing engineer* (not "QA"), *Claude agent(s)* (not "our AI"), *Automated Testing Kit* → *ATK*, *Testor*, *nearshore* (never "offshore").
- **What NOT to say** (from `pl_brand_brief.md` §6): no build-shop framing, no headcount inflation, no Drupal evangelism, no generic "passionate about quality," no client-logo walls on About, no unverified GitHub star/install counts, no Report-Portal-or-similar comparisons for CTRFHub.
- **AI positioning is option C** (per project memory `project_pl2_ai_positioning.md`, decided 2026-04-26). AI is a distinct service (the autonomous-healing pilot) AND named as delivery infrastructure only where it does client-visible work. Never claim AI for invisible internal use.
- **CTRFHub messaging** (per project memory `project_pl2_ctrfhub.md`). Mention is scoped to forthcoming-language until launch — open-source-projects page card and blog series only. Homepage Tools card and hero subhead wait for an alpha release / downloadable artifact.
- **Three-tool Tools pillar.** ATK, Testor, CTRFHub. Canonical card copy lives in `Existing Pages/Target1/_brand-conformance-review.md` Violation 4.1 — reuse it on any page that names PL's tools rather than re-drafting per page.

## Workflow

### Phase 1 — Brief synthesis (no input needed from André)

Read both briefs and the three repositioning docs. Produce a one-page synthesis at `Target1/_brief-synthesis.md`: brand pillars, tone rules, vocabulary lock, ICP, and a "diagnostic lens" — the questions used to score each page.

### Phase 2 — Per-page draft

For each page in priority order, choose one of two file shapes based on scope:

- **Patches** — small surgical edits (e.g. homepage's two vocabulary swaps, services title-case fix, articles teaser). Drafted in `Target1/<slug>--patches.md`. Each entry quotes the existing line, the replacement, and a *Status:* field. Quick to review, fast to key in.
- **Rewrites** — full-page or section-level redrafts (e.g. open-source-projects card additions and intro rewrite, how-we-do-it total rewrite). Drafted in `Target1/<slug>.md`, section-by-section, with a *Status:* line per section. If the conceptual frame changes wholesale, a sibling `Target1/<slug>--audit.md` carries the gap analysis using the `Design1/homepage-audit.md` template.

The conformance review (`Existing Pages/Target1/_brand-conformance-review.md`) doubles as the audit for most pages — if its findings are sufficient, no separate `<slug>--audit.md` is needed. Only pages requiring a deeper conceptual frame (e.g. how-we-do-it) get one.

**Structural preservation is the default.** Mirror the section structure of `Actual1/<slug>.md` so the diff is text-only and Admin-UI work stays at text-replacement scope. When a section rewrite *does* require structural change (a Canvas component added, removed, or moved), call it out explicitly per option, with the Admin-UI operations named, so the structural cost is visible at approval time. Exceptions are approvable but must be visible — not silent.

*Status* values: `Draft` (Claude proposed, awaiting input) · `Approved YYYY-MM-DD` (André OK'd) · `Parked` (deferred, with `GET-BACK-TO-THESE.md` reference).

### Phase 3 — Section-by-section approval

The draft sits in `Target1/`. André reads each section and replies one of three ways:

- *"approved"* (or *"approved with note: …"*) — Status flips to `Approved YYYY-MM-DD`. Claude reports what's still `Draft`.
- *"revise: …"* — Claude redrafts only that section; status stays `Draft`.
- *"park: <reason>"* — Claude moves the section to `GET-BACK-TO-THESE.md` and flips Status to `Parked`.

A page is approved when every section's status is `Approved` or `Parked`. No section is keyed into the Admin UI before its status flips. Each section is its own micro-pass; the page is the natural commit boundary. Worked example: `Existing Pages/Target1/services--engagement-cards.md`.

### Phase 4 — Cross-page consistency sweep

Once two or more pages have drafts, run a single sweep across all `Target1/*.md`:

- Vocabulary lock (grep for "QA engineer", "offshore", "tester", "our AI", "Cypress.*Playwright" wrong-order).
- Repeated phrases — flag any sentence reused verbatim across more than two pages.
- CTA inventory — the same intent (`?intent=...`) should not point to two different page experiences.

### Phase 5 — Implementation handoff

The rewrite output is markdown only. Implementation (Admin UI keying, alias swap, redirects) follows the existing repositioning runbook and is out of scope for this plan. The handoff per page is:

1. `Target1/<slug>.md` (or `<slug>--patches.md`) is fully Approved (or Parked).
2. Editor opens the corresponding Canvas page in the Admin UI and keys in the copy section by section.
3. Run T1 (curl) → T2 (ARIA) → T3 (screenshots).
4. Only after T3 passes, swap the alias. Per project memory, the legacy entity stays published until T3 passes — never a blank-page public window.
5. Commit.

Worked example: see the *Implementation order* at the bottom of `Existing Pages/Target1/services--engagement-cards.md`.

## Verification

Verification runs per page, before the page is marked approved.

### T1 — Diff verification

- `diff` `Actual1/<slug>.md` vs. `Target1/<slug>.md` and confirm every removed sentence is intentional.
- Grep `Target1/` for vocabulary violations (the same checks as the Phase 4 sweep, scoped to the page).

### T2 — Brief alignment

- Manual checklist: every brand pillar named in `pl_brand_brief.md` §4 has at least one supporting sentence on the homepage; ICP-relevant pages (services, how-we-do-it) speak to the personas in §2; tone passes the eye-roll test.
- Confirm no item from `pl_brand_brief.md` §6 ("What NOT to Say") appears in the draft.

### T3 — Test-suite impact check

- Grep the Playwright suite (`tests/`) for any string asserted from the current page that the rewrite changes. Flag tests that need updating in the same change set so the alias swap doesn't red the nightly run.
- Note: this is detection only. Test edits follow the standard test-healing workflow per `CLAUDE.md`.

### Approval gate

A page is approved when T1/T2/T3 all pass and André gives an explicit go. Only then does the page move to Admin-UI implementation.

## What this plan deliberately does not do

- Does not produce a single bundled markdown file. One file per page; the bundle would fight the existing per-page diff workflow.
- Does not re-interview André on goals already encoded in `repositioning-framework.md` and `phase-2-page-plan.md`. Open questions are raised per page, in the audit, scoped to gaps.
- Does not touch site code, config, or entities. Output is markdown drafts only; implementation follows the established runbook.
