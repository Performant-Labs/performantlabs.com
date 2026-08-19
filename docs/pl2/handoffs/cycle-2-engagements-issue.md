# Sprint 5 — Cycle 2 — § engagements (4-card grid) preview fidelity

**Branch:** `aa/pl-sprint-5-cycle-2-engagements`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Bring the `/services` engagement-cards section visually in line with `docs/pl2/Previews/services.html` § `<section class="engagements">`. Resolve audit deltas E1, E2, E3, E5, E6 from `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ engagements."

Optionally fold in delta N2 (nearshore H2 wrap container-cap) if F's scope-cap allows — see §"Optional fold-in" below.

## Input documents

Read before writing code:
- [ ] `docs/pl2/handoffs/cycle-1-audit-services-S.md` §"§ engagements" — the delta catalog (E1–E6)
- [ ] `docs/pl2/Previews/services.html` — visual reference (find `<section class="engagements">`)
- [ ] `docs/pl2/briefs/pl_design_brief.md` — token authority (surfaces, spacing scale, typography)
- [ ] `docs/pl2/Existing Pages/Target1/services--engagement-cards.md` — engagement card copy
- [ ] `docs/pl2/theme-change--workflow.md` — 7-step layer trace (mandatory)
- [ ] `docs/pl2/pl-plan--sprint-5-services-fidelity.md` — sprint runbook

## Scope (in)

Resolve the following deltas from the Cycle 1 catalog (`cycle-1-audit-services-S.md`):

| ID | Delta | Remediation |
|---|---|---|
| E1 | Card surface: live transparent w/ hairline; preview has subtle cream/canvas surface + inner padding | L5 — card-canvas component CSS: set surface to `--surface-cream` (or brief equivalent) with `--space-lg` inner padding |
| E5 | Eyebrow underline/accent metrics differ slightly (stroke/spacing relative to H3) | L5 — card-canvas CSS metric tweak |
| E6 | Row gap between 2×2 cards: live ~32 px, preview ~48 px | L5 — grid gap: `--space-lg` → `--space-xl` (per brief spacing scale) |
| E2 | Eyebrow casing: live shows "TAKEOVER / EMBED / PILOT / a11y"; preview shows "Takeover / Embed / Pilot / a11y" (title case; no CSS `text-transform`) | Canvas content — four per-card field edits (or one if a shared source) |
| E3 | H3 trailing period: preview h3s end with `.`; live does not | Canvas content — four per-card H3 edits |

E4 (grid count at viewports) is already MATCH; no work.

## Optional fold-in (N2 from § nearshore)

If F's scope-cap permits (≤ 6 files total, still single component family or coherent CSS-only addition):

- **N2** — Nearshore H2 wraps differently between live (page-level container width ~1140) and preview (~640 content-cap). Apply a content-cap to the nearshore H2 container.
  - Remediation: L5 — `dy-section.css` or section-specific class — add `max-width: ~640px; margin-inline: auto; text-wrap: balance` per memory `feedback_no_orphan_words.md`.
  - Skip if it would push the cycle over the scope cap; defer to its own cycle.

## Out of scope

- Other sections (proof / nearshore main / closing-cta). Each has its own cycle.
- Pre-existing accepted deviations: R8 mobile hero overflow, ADV-S5 button contrast, F.8/F.9 footer items.
- L3 typography canon changes — audit found no drift.

## Acceptance criteria

- [ ] § engagements at `/services` visually matches `docs/pl2/Previews/services.html` § `<section class="engagements">` at 1280×800, 768×1024, 375×667.
- [ ] Card surface: cream/canvas background + `--space-lg` inner padding (E1).
- [ ] Card grid row gap = `--space-xl` (48 px) at 1280 (E6).
- [ ] Eyebrow accent metric matches preview (E5).
- [ ] All four card eyebrows use title case: "Takeover", "Embed", "Pilot", "a11y" (E2).
- [ ] All four card H3s end with a trailing period (E3).
- [ ] (If folded in) Nearshore H2 container content-capped at ~640 px with `text-wrap: balance` (N2).
- [ ] No `!important` introduced.
- [ ] Tier 1 (HTTP 200, content grep) + Tier 2 (heading hierarchy, ARIA, semantic) PASS on `/services`.
- [ ] Tier 2 spot-check: `/` (homepage) and `/articles` show no regressions from any shared L3 token usage.
- [ ] WCAG contrast: card body text on the new cream/canvas surface ≥ 4.5:1; computed in handoff-F.
- [ ] All Canvas patches set `component_version: NULL`.
- [ ] Files staged by explicit path; no `git add .`.
- [ ] F respects the 6-file / one-component-family scope cap; if N2 fold-in pushes over, F splits.

## Handoff locations

- F: `docs/pl2/handoffs/cycle-2-engagements-F.md`
- T: `docs/pl2/handoffs/cycle-2-engagements-T.md`
- S: `docs/pl2/handoffs/cycle-2-engagements-S.md`
- Report: `docs/pl2/handoffs/cycle-2-engagements-report.html` (S)
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-5-cycle-2/`

## Operating rules

Per F canonical prompt at `~/.claude/agents/feature-implementor.md` (read it). Highlights:

- 7-step CSS change workflow at `docs/pl2/theme-change--workflow.md`.
- Read `.component.yml` before referencing any prop/slot name.
- Override at the highest correct layer; no Layer 4 patches.
- No `!important`.
- Stage files by explicit path; never `git add .`.
- Set Canvas `component_version: NULL` in any assembly script.
- Per memory `feedback_no_orphan_words.md`: apply `text-wrap: balance` where headings/lines can orphan.

## Commit message (O will commit on S PASS)

`feat(services): cycle 2 — § engagements preview fidelity (card surface + grid gap + eyebrow casing + trailing periods)`
