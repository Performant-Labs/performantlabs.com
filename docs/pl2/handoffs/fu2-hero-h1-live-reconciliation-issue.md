# Follow-up Cycle FU-2: Hero H1 live-CSS reconciliation (option A — brief wins)

**Mode:** autonomous
**Branch:** `aa/pl-fu2-hero-h1-live-reconciliation` (off `aa/pl-sprint-4-pre-services-foundation`)
**Parent sprint:** Sprint 4 wrap doc, FU-2: [`sprint-4-wrap.md`](sprint-4-wrap.md) §"Follow-up backlog"
**Cycle 3 evidence (computed-style probe at 1280×800):**

| Page | letter-spacing (live) | line-height (live) | Brief target |
|---|---|---|---|
| `/` | -2px | 1.05 | -2px / 1.05 ✓ |
| `/services` | -1.8px | 1.10 | -2px / 1.05 — needs update |
| `/how-we-do-it` | -1.8px | 1.10 | -2px / 1.05 — needs update |
| `/open-source-projects` | -1.8px | 1.10 | -2px / 1.05 — needs update |

## Objective

Update live CSS on `/services`, `/how-we-do-it`, `/open-source-projects` so their hero H1 renders at `letter-spacing: -2px` and `line-height: 1.05`, matching the brief's `display-xl` token and the homepage live (already correct). Result: all 8 surfaces (4 previews + 4 live) align on `72px / 500 / 1.05 / -2px / Rubik`.

## Operator decision

🛑 **Option A** locked. Do not present A/B/C. Execute the brief-wins path.

## Input documents

Read before starting:

- [ ] [Sprint 4 wrap doc](sprint-4-wrap.md) §FU-2 — full context on the three options and why A was chosen
- [ ] [`docs/pl2/briefs/pl_design_brief.md`](../briefs/pl_design_brief.md) `display-xl` token (the canonical spec: `72px / 500 / 1.05 / -2px / Rubik`)
- [ ] Live `/services`, `/how-we-do-it`, `/open-source-projects` hero H1 styling — find the rule that sets `-1.8px / 1.10`. Likely candidates: Dripyard `landing-hero` SDC or a shared layout CSS file. **Pass 1 trace first: where does `-1.8px` come from?**
- [ ] [`docs/pl2/theme-change.md`](../theme-change.md) — layer system reference
- [ ] [`docs/pl2/theme-change--workflow.md`](../theme-change--workflow.md) — 7-step workflow

## Scope

1. **Pass 1 trace.** On live `/services`, identify the CSS rule that sets `letter-spacing: -1.8px` and `line-height: 1.10` on the hero H1. It's either:
   - A Dripyard component default (override at L5 in subtheme via `libraries-extend`), or
   - A page-specific override in `dripyard_base` / `neonbyte` (override at L5), or
   - A property of a specific landing-hero SDC class only used on these three pages
2. **Pass 2.** Identify the highest correct layer for the fix. The brief's `display-xl` token *should* drive the value, so ideally the fix is at the layer that consumes the token — not a per-page override. If the token is currently not threaded through to those pages, the right fix may be wiring the token in rather than hardcoding the value.
3. **Write the CSS** at the chosen layer. Override to `letter-spacing: -2px; line-height: 1.05` (or wire the `display-xl` token in if that's the cleaner path).
4. **Verify on live** at 1280 via Playwright `getComputedStyle()`: all four landing-page hero H1s now report `letter-spacing: -2px` and `line-height: 1.10` — wait, **target is `1.05`**, not 1.10. Verify `line-height: 1.05`. (The 1.10 is live's *current* incorrect value; we're moving to brief's `1.05`.)
5. **Mobile equivalent.** The brief's `typography-mobile.display-xl` is `44px / 500 / line-height ? / letter-spacing ?` — read the brief for mobile values. If the three pages also have mobile hero H1 overrides at `40px` (per Cycle 3 advisory note FU-7), and the brief says mobile is `44px`, **scope-cap that to a follow-up** rather than expanding this cycle. The mobile parallel inconsistency was flagged for the same cycle but option A's stated scope is desktop letter-spacing + line-height only. If you find the mobile fix is trivially in the same rule (e.g. a single SDC selector covers both), do it; if it requires a separate media-query block on multiple files, split it out.

## Files expected to change

- `web/themes/custom/performant_labs_20260502/css/components/<hero or landing-hero>.css` (most likely) — single override file
- OR `web/themes/custom/performant_labs_20260502/<subtheme libraries.yml or theme info>` if wiring a library extension

## Acceptance criteria

- [ ] Playwright `getComputedStyle()` at 1280 reports `letter-spacing: -2px` and `line-height: 1.05` on `.hero h1` for `/services`, `/how-we-do-it`, `/open-source-projects`
- [ ] Homepage `/` still reports the same `-2px / 1.05` (no regression)
- [ ] Cross-page T3 at 1280 — visual diff on the three updated pages shows hero H1 visually tighter/closer (smaller line-height) and slightly tighter letter-spacing; no other visual changes
- [ ] No regressions on `/articles` (non-landing-hero page) or other non-landing pages
- [ ] Trace comment documents the brief-token source and that this is the single source of truth going forward

## Operator decision

None — option A pre-committed in operator message 2026-05-11.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/fu2-hero-h1-live-reconciliation-F.md`

## Operating rules

- **Mode: autonomous** — Step 3 layer trace self-approved (record in handoff "Layer decisions"). Likely L5 component CSS or library extension; verify via Pass 1 trace.
- **Pre-flight per Sprint 4 pattern:** check whether this is already done before assuming work is needed. (Unlikely here — Cycle 3 just measured the divergence — but worth a 30-second confirmation.)
- Follow the 7-step CSS change workflow. No `!important`. Stage by explicit path.
- Mandatory handoff section: **Autonomous decisions** — layer choice, scope decisions on mobile inclusion, any judgment calls about the trace.

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| SSL workaround for shell curl | `ddev exec curl http://localhost/<path>` |
| Cache clear | `ddev drush cr` before every T1/T2 run |
| Playwright | Already at project root (used by Sprint 4 cycles 2/3/5) |
