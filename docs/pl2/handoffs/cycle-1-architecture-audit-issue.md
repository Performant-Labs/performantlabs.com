# Sprint 10 — Cycle 1 — Architectural-debt audit (S-only)

**Branch:** `aa/pl-sprint-10-cycle-1-audit`
**Pipeline:** O → S → O (audit-only)
**Mode:** autonomous

## Objective

Two threads:

1. **ADV-3 inventory.** Find every fragile DOM-shape-sniffing selector in `dy-section.css` (and any similar pattern in other shared component CSS files). For each: which page/component currently relies on it; what class-based marker would replace it; estimated Canvas-content edits + CSS edits.

2. **`component_version` doc audit.** Find every workflow-doc location that tells F to set `component_version: NULL`. Canvas throws `OutOfRangeException` on NULL (discovered Sprint 5 cycle 2; F has been quietly leaving the existing value untouched ever since). Recommend updated wording.

## Scope

**Thread 1 — selectors:**
- `web/themes/custom/performant_labs_20260502/css/components/dy-section.css` — the main offender (extended in Sprints 3, 5, 6).
- Other shared component CSS files — `card.css`, `grid-wrapper.css`, `title-cta.css`, etc. — sweep for similar patterns.
- For each: grep for `:has()`, `:not(:has(...))`, `:not(.X) :not(.Y)`-style chains, sibling combinators that depend on DOM order.

**Thread 2 — workflow docs:**
- `~/.claude/agents/feature-implementor.md` — canonical F prompt
- `docs/pl2/workflow-ofts.md` — workflow spec reference copies
- `docs/pl2/theme-change--workflow.md`
- `docs/pl2/theme-change.md`
- Any other doc in `docs/pl2/` that mentions `component_version`

## Method

**Thread 1:**
- `grep -rn ':has(\|:not(' web/themes/custom/performant_labs_20260502/css/` — fragile selector enumeration.
- For each selector found: identify the consuming Canvas page/section by reading the CSS rule context + cross-referencing live DOM via `ddev exec curl http://localhost/<page>`.
- Propose a class marker name per pattern (e.g., `dy-section--centered`, `dy-section--has-cta-pair`).
- Estimate Canvas-content edits: how many sections across how many Canvas pages need the new marker.

**Thread 2:**
- `grep -rn 'component_version' docs/pl2/ ~/.claude/agents/`
- For each hit: classify as (a) telling F to set to NULL (needs fix), (b) describing the constraint accurately (no fix), (c) other reference (no fix).

## Acceptance

- [ ] ADV-3 inventory: every fragile selector with consumer page/section + proposed class marker.
- [ ] Workflow-doc audit: every NULL-mentioning location with proposed updated wording.
- [ ] Refactor strategy: single sweep cycle vs per-component split (estimate file count).
- [ ] Shipped-state risk assessment: which Canvas pages will re-render and need T3 visual diff (`/services`, `/about-us` known; audit confirms full list).
- [ ] Recommended Cycle 2 carve.
- [ ] Verdict PASS.

## Handoff

- Markdown: `docs/pl2/handoffs/cycle-1-architecture-audit-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-architecture-audit-report.html`
- Probe artifacts: `docs/pl2/handoffs/screenshots/sprint-10-cycle-1/`

## Operating rules

- T precondition N/A.
- Binding signal: grep output + CSS file content + doc text — not pixel diff.
- Audit-before-fix pattern (Sprint 7-9). If ADV-3 has already been incidentally resolved by intervening work (e.g., Sprint 6 cycle 3's `nearshore-section` marker pattern is now broadly applied), flag the no-op.
- Visual screenshots not required.
