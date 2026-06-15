# Cycle 3 — `/about-us` Kicker terracotta token normalization (§B + §D)

**Sprint:** 12
**Branch:** `aa/pl-sprint-12-cycle-3-about-us-kicker-token`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Normalize the terracotta kicker color on §B (Track record) and §D (Dogfood) of live `/about-us`. Cycle 1's audit captured that §A (About) and §C (Open source) kickers render at the on-spec `rgb(142, 74, 42)` (= `--accent-deep #8E4A2A`), while §B (Track record on cream) and §D (Dogfood on cream) render at the off-spec `rgb(140, 78, 51)`. Bring §B + §D into alignment with the brief token.

## Background — Cycle 1 audit finding

From `cycle-1-about-us-audit-S.md`:

> **Track record (§B)** — kicker renders at `rgb(140,78,51)` (~2-unit drift from the `--accent-deep` target `rgb(142,74,42)` = `#8E4A2A`)…
> **Dogfood (§D)** — cream section, kicker "DOGFOOD" rendering at `rgb(140,78,51)` (same off-spec value as §B).

S also noted in advisory: "Kicker color drift between sections is unusual — same theme, same kicker SDC, different rgb output. Likely a `theme--light` vs `theme--cream` cascade quirk."

Section-cluster carve absorbed: "Track record DELTA" + "Dogfood DELTA" kicker rows from Cycle 1's delta table.

## Input documents

Read these before starting:

- [ ] `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md` — sprint runbook (PC-1, PC-3, PC-5, PC-8 relevant)
- [ ] `docs/pl2/pl-plan--about-us.md` — page runbook
- [ ] `docs/pl2/handoffs/cycle-1-about-us-audit-S.md` — see Track record + Dogfood DELTA rows and the "Kicker color drift" advisory
- [ ] `docs/pl2/handoffs/sprint-12-orchestrator-log.md` — sprint state, cycle ledger, FB list
- [ ] `docs/pl2/briefs/pl_design_brief.md` — `--accent-deep` token definition (`#8E4A2A` = `rgb(142, 74, 42)`)
- [ ] `docs/pl2/Previews/about-us.html` — preview kicker rendering on §B + §D
- [ ] `docs/pl2/workflow-ofts.md` §"F — Feature Implementor" (7-step workflow)

## Operating environment

- **Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us`
- **Active theme:** `performant_labs_20260502`
- **DDEV:** port 8493 from host; mkcert-trusted, no `-k`. SSL-chain workaround: `ddev exec curl http://localhost/about-us`.
- **Canvas-content edits unlikely** (this is a CSS-cascade issue, not content). If patch needed, preserve `component_version` (PC-6); idempotent reference pattern at `scripts/sprint6-cycle3-nearshore-marker.php`.

## Scope (binding — do not exceed without scope-split escalation)

1. **Root-cause investigation.** Run a Step-3 layer trace to determine why §B + §D kickers render at `rgb(140, 78, 51)` while §A + §C kickers on the same page render at the on-spec `rgb(142, 74, 42)`. Hypothesis from S: `theme--light` vs `theme--cream` cascade quirk. Confirm via DevTools or computed-style inspection. Identify the exact source declaration (selector, file, layer) that's producing `rgb(140, 78, 51)`.
2. **Fix scoped to root cause.** Decide layer per PC-3:
   - **L3 (token):** justified if the `rgb(140, 78, 51)` value comes from a token (e.g. a `theme--cream` override) that should be retired or aligned to `--accent-deep`. Flag cross-page impact in handoff.
   - **L5 (component CSS):** justified if a local kicker rule on cream surface is hard-coding the off-spec value. Preferred for minimum blast radius.
3. **Cross-page audit.** Before fixing, grep for `rgb(140, 78, 51)`, `#8C4E33`, `rgb(140,78,51)`, and any near-variants across `web/themes/custom/performant_labs_20260502/` and `web/themes/contrib/dripyard_base/`. Document every match in handoff. If the off-spec value appears on shipped sibling pages (`/services`, `/open-source-projects`, homepage), the fix MUST verify no regression on those pages.
4. **Cascade safety.** After fix, confirm §A + §C kickers still render `rgb(142, 74, 42)` (do not break the already-correct sections).

**Out of scope:**

- Hero (§A) edits (FU-2 hero exception; kicker is already on-spec).
- §C (Open source) kicker (already on-spec).
- Bio re-nest (Cycle 2, already shipped).
- Card-canvas outer padding (Cycle 4).
- Espresso §E kicker (uses `--accent #C97B5C`, on-spec per Cycle 1).
- Any new brand tokens or new SDCs.
- Any page beyond `/about-us` for fixing (sibling pages are spot-checked only).
- `!important`.

## Acceptance criteria

- [ ] Live `/about-us` §B (Track record) kicker computes to `rgb(142, 74, 42)` (= `--accent-deep #8E4A2A`) at desktop, tablet, and mobile.
- [ ] Live `/about-us` §D (Dogfood) kicker computes to `rgb(142, 74, 42)` at desktop, tablet, and mobile.
- [ ] §A (About) and §C (Open source) kickers continue to compute to `rgb(142, 74, 42)` — no regression.
- [ ] §E (Closing CTA) kicker continues to compute to `rgb(201, 123, 92)` (= `--accent #C97B5C`) — no regression.
- [ ] Root cause documented in handoff-F: which file/selector produced `rgb(140, 78, 51)`, and why the fix layer was chosen (PC-3 trace).
- [ ] Cross-page grep matrix in handoff-F.
- [ ] No regression on `/services` or `/open-source-projects` (T spot-checks shipped sibling pages).
- [ ] No `!important` introduced.
- [ ] Tier 1 (curl/grep) and Tier 2 (ARIA / structural + contrast) pass.
- [ ] Tier 3 (S) per-section delta: §B and §D kicker rows flip from Cycle 1 DELTA → MATCH.
- [ ] Pa11y with allowlist (PC-5): 0 errors. Allowlist NOT edited.
- [ ] WCAG 2.2 AA contrast on the new kicker color: `rgb(142, 74, 42)` on `#F5EFE2` cream computes to ≥ 4.5:1 (was already passing at the previous off-spec value; re-verify at the on-spec value).

## Handoff locations

- `docs/pl2/handoffs/cycle-3-about-us-kicker-token-F.md`
- `docs/pl2/handoffs/cycle-3-about-us-kicker-token-T.md`
- `docs/pl2/handoffs/cycle-3-about-us-kicker-token-S.md`

## Layer-choice guidance (PC-3, autonomous)

F's Step-3 layer trace is autonomous. Likely scenarios:

- If `theme--cream` (or `theme--light`) defines a kicker color override that's stale/off-spec → **L3 token** (one fix touches every cream section). F handoff must enumerate cross-page consumers + T must spot-check sibling cream sections.
- If the off-spec value is local to a kicker variant scoped to about-us cream sections → **L5** in the relevant component CSS file.
- If the off-spec value comes from an inherited Bootstrap or dripyard_base token that's not on-spec → may be a deeper L3 issue; F surfaces scope-split if so.

Do not pause for layer approval; record your trace and decision in the handoff.

## Scope-split rule

If F discovers the off-spec value is cascading from a cross-page token whose realignment would affect multiple shipped pages, **stop and surface in the handoff with a scope-split proposal**. The cross-page implications go to operator decision via O.

## Pre-commitments inherited from sprint kickoff

PC-1 (brief tokens > preview layout — brief specifies `--accent-deep #8E4A2A`); PC-3 (autonomous layer trace); PC-5 (pa11y allowlist locked); PC-6 (component_version on any Canvas patch — likely N/A this cycle); PC-7 (specificity-safe markers — likely N/A); PC-8 (per-section AE binding).

## Commit message (drafted by O at cycle close)

`fix(about-us): cycle 3 — normalize §B/§D kicker to --accent-deep #8E4A2A`
