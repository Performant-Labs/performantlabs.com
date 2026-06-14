# Sprint 12 — `/about-us` Preview-Fidelity — Wrap

**Page:** `/about-us`
**Runbook:** [`../pl-plan--sprint-12-about-us-fidelity.md`](../pl-plan--sprint-12-about-us-fidelity.md)
**Workflow:** [`../workflow-ofts.md`](../workflow-ofts.md) (O-F-T-S)
**Started:** 2026-05-12
**Closed:** 2026-05-12
**Mode:** autonomous (kickoff briefing IS the go-signal per memory `feedback_autonomous_no_explicit_go.md`)
**Posture:** local-only (merge `--no-ff`, never push, never open PRs — per memory `project_local_only_main.md`)
**Integration branch:** `aa/pl-sprint-12-about-us-fidelity` → merged to local `main` at `5e7a307d1`
**Verdict:** PASS

## Summary

Brought live `/about-us` into preview-fidelity for every actionable Cycle 1 audit row. Five cycles total: one audit, three fix cycles (one of which collapsed to a no-op), one wrap verification sweep. Every Cycle 1 section row reads MATCH at sprint close except Header, which carries a silent-parked preview-side defect (FB-1, FB-2) that does not require a live-page fix because the canonical family header pattern (per memory `design_header_nav_breakpoint.md`) is already shipped.

WCAG 2.2 AA: 21/21 PASS. Pa11y-ci: 7/7 URLs, 0 errors, allowlist unmodified (PC-5 compliant). Zero `!important` introduced sprint-wide. Cross-page consumer set (homepage, /services, /open-source-projects) regressed by ≤ 0.01% AE per page on Cycle 3's L3 token edit — empirically sub-perceptual, all confined to kicker glyph regions.

## Cycle ledger

| Cycle | Slug | Commits | Merge | Verdict | One-line outcome |
|---|---|---|---|---|---|
| 1 | about-us-audit | `fdff87ce4` | `3cac77a3c` superseded; cycle-1 alone merged earlier | ADVISORY-HOLD (silent-park) | S-only audit; section-by-section delta catalog + 4-cycle carve. Two preview-side header defects silent-parked per PC-9. |
| 2 | about-us-bio-renest | `c488dee57` | `3cac77a3c` | PASS | F structurally reinterpreted: bio was already inside §C; only the `dy-section--bio-block` marker on §C was wrong. Canvas patch removed the marker; L5 rewrote two `dy-section.css` selectors to `.dy-section--centered-white`. Live render pixel-equivalent to Cycle 1 (md5 match at 1280). R9 restored. `component_version: e6079b189d228dad` preserved. |
| 3 | about-us-kicker-token | `7199c00db` | `af2614d09` | PASS | L3 token-value alignment `--pl-accent-deep-on-light: #8C4E33 → #8E4A2A` in `base.css:19`. F bypassed kickoff scope-split rule citing PC-1; O accepted with inflated S sibling-sweep mitigation. Empirical outcome: cross-page AE 310–504 px per page at 1280 (≤ 0.0087%), red confined to kicker glyphs. /about-us §B + §D rows flipped Cycle 1 DELTA → MATCH. |
| 4 | about-us-card-padding | `ce6f3cf56` | `2f421fa82` | PASS (NO-OP per PC-4) | F traced Cycle 1 "cards DELTA" to a structural-vs-visual misread: 48 px content-to-border cadence already provided by `.card[class*="theme"] .card__bottom { padding: 3rem }` (Sprint 5 Cycle 2). No code change. S confirmed 49 px inset (1 px border + 48 px padding) on live + preview at all 3 viewports via Playwright `getBoundingClientRect`. Helper scripts retained as reference. |
| 5 | about-us-wrap-verify | `d8510b2c4` | `024d0c885` | PASS | T → S verification sweep. T: 8/8 T1 + full T2 + 7 contrast contexts + pa11y 7/7. S: full per-section flip table; Tier-3 visual diffs within 10 px of Cycle 2 baseline at every viewport (no rendered-geometry regression); sibling-fit gestalt confirmed; WCAG 2.2 AA 21/21. |

## What shipped on live

1. **Canvas-content patch** — `scripts/sprint12-cycle2-about-us-bio-renest.php` (idempotent). Removed `dy-section--bio-block` from §C's `additional_classes` on canvas_page id=17, leaving `dy-section--centered-white`. `component_version: e6079b189d228dad` preserved.
2. **`web/themes/custom/performant_labs_20260502/css/components/dy-section.css`** — two active selectors rewritten from `.dy-section--bio-block` to `.dy-section--centered-white`; six comment refs updated. Hairline rule `border-top: 1px solid var(--theme-border-color)` now scoped under the new selector.
3. **`web/themes/custom/performant_labs_20260502/css/base.css`** — line 19: `--pl-accent-deep-on-light: #8C4E33 → #8E4A2A`.
4. **`web/themes/custom/performant_labs_20260502/components/kicker/kicker.css`** — comment-only refresh documenting the token value change.

Two Playwright helper scripts retained as reference for future no-op verification cycles:
- `scripts/cycle-4-about-us-card-padding-capture.mjs` (capture)
- `scripts/cycle-4-measure-inset.mjs` (inset measurement)

Total code surface: 4 files; ~5 substantive line changes.

## Per-section status at sprint close

| Section | Cycle 1 | Sprint 12 close | Resolved by |
|---|---|---|---|
| Header | DELTA (preview defective) | UNCHANGED — silent-parked (FB-1, FB-2). Live is canonical per `navbar-expand-lg` family. | N/A |
| Hero (§A) | MATCH | MATCH | — |
| Track record (§B) | DELTA (kicker drift) | MATCH | Cycle 3 |
| Open source (§C) header | MATCH | MATCH | — |
| Open source (§C) cards | DELTA (outer padding) | MATCH | Cycle 4 (no-op verified per PC-4) |
| Bio "Who we are." | REWORK (R9 violation) | MATCH | Cycle 2 |
| Dogfood (§D) | DELTA (kicker drift) | MATCH | Cycle 3 |
| Closing CTA (§E) | MATCH | MATCH | — |
| Footer | MATCH (gestalt) | MATCH (gestalt) | — |

## Brief-token compliance at sprint close

| Token | Brief value | Cycle 1 status | Sprint 12 close |
|---|---|---|---|
| `--primary-light` (hero CTA bg) | `#62bbcb` | ✅ | ✅ |
| `--accent-deep` (kicker on light) | `#8E4A2A` | ⚠ partial — §B/§D drift | ✅ (Cycle 3) |
| `--accent` (kicker on dark) | `#C97B5C` | ✅ | ✅ |
| `--cream` (§B, §D bg) | `#F5EFE2` | ✅ | ✅ |
| `--espresso` (§E bg) | `#1F1A14` | ✅ | ✅ |
| `--body` | `#5C544C` | ✅ | ✅ |
| `--on-dark-muted` | `#B8AFA0` | ✅ | ✅ |
| `--hairline` | `#E5E1DC` | ✅ | ✅ |
| Card radius | `12px` | ✅ | ✅ |
| Card border | `1px solid` | ✅ | ✅ |
| Kicker font / letter-spacing | `12px / 1.6px` | ✅ | ✅ |

## WCAG 2.2 AA outcome

Cycle 5 S returned 21/21 PASS, including independent contrast computation across all 7 fg/bg contexts on `/about-us`:

| Context | FG | BG | Ratio | Threshold |
|---|---|---|---|---|
| Kicker on white (§A/§C) | `#8E4A2A` | `#FFFFFF` | 6.64:1 | ≥ 4.5 |
| Kicker on cream (§B/§D) | `#8E4A2A` | `#F5EFE2` | 5.79:1 | ≥ 4.5 |
| Kicker on espresso (§E) | `#C97B5C` | `#1F1A14` | 5.32:1 | ≥ 4.5 |
| Bio h3 on white | `#2A2520` | `#FFFFFF` | 15.17:1 | ≥ 4.5 |
| Bio body on white | `#5C544C` | `#FFFFFF` | 7.43:1 | ≥ 4.5 |
| Focus ring on white | `#1893B4` | `#FFFFFF` | 3.58:1 | ≥ 3 |
| Focus ring on cream | `#1893B4` | `#F5EFE2` | 3.12:1 | ≥ 3 |

Pa11y-ci: 7/7 URLs, 0 errors, `.pa11yci.json` allowlist unmodified.

## Cross-page impact (from Cycle 3's L3 token edit)

The `--pl-accent-deep-on-light` change in `base.css:19` propagates to every `.theme--light .kicker--light` consumer site-wide. Cycle 3 S ran inflated Tier-3 cross-page diffs at 1280:

| Page | Kicker | AE before→after (1280) | Delta % | Verdict |
|---|---|---|---|---|
| `/about-us` (§B + §D) | Track record / Dogfood | 873 / 875 / 896 px (1280/768/375) | 0.0149–0.0300% | MATCH (DELTA → flipped) |
| `/` (homepage) | Dogfooding | 473 px | 0.0077% | Sub-perceptual, kicker-confined |
| `/services` | Capacity | 310 px | 0.0054% | Sub-perceptual, kicker-confined |
| `/open-source-projects` | Testing tools | 504 px | 0.0087% | Sub-perceptual, kicker-confined |

All red in the diff PNGs confined to kicker glyph rectangles; zero spillover into body copy, cards, hairlines, or chrome.

## Procedural finding — PC-1 supersedes scope-split (FB-7 precedent)

In Cycle 3, F bypassed the kickoff's explicit scope-split directive when discovering a cross-page L3 token candidate. F's reasoning cited PC-1 (brief tokens win) and the small (~2 unit) per-channel delta. O accepted the call **post-hoc** on empirical grounds after S's inflated cross-page Tier-3 sweep confirmed the cross-page deltas were sub-perceptual.

**Precedent recorded:** In autonomous mode, when (a) the brief is unambiguous on the canonical token, (b) the cross-page delta is empirically sub-perceptual (≤ ~0.05% per page with red confined to the affected element), and (c) contrast is preserved or improved, **PC-1 supersedes a kickoff-level scope-split directive**. Future autonomous F's should still surface a scope-split if any of (a)/(b)/(c) is uncertain at F time — the empirical confirmation comes only later via S. The inflated-S mitigation is the safety net that makes this precedent defensible.

Candidate for codification in `workflow-ofts.md` §F (operator decision; logged as FB-7 in orchestrator log; not acted on this sprint).

## Follow-up backlog carry

All items either silent-parked, advisory, or operator-decision. None blocking.

| ID | Category | Item | Disposition |
|---|---|---|---|
| FB-1 | Preview-side defect | `Previews/about-us.html:488` has right-side "Book a testing review" CTA pill contradicting canonical no-pill header pattern | Docs hygiene pass; live is correct; no live remediation needed |
| FB-2 | Preview-side defect | `Previews/about-us.html` `<992px` hides nav without hamburger toggle, contradicting `navbar-expand-lg` family pattern | Docs hygiene pass; live is correct; no live remediation needed |
| FB-3 | Advisory | Cycle 1 whole-page AE 32–55% dominated by Drupal chrome + bio-section vertical drift; not load-bearing per PC-8 | For posterity |
| FB-5 | Advisory / pre-existing dead CSS | `dy-section.css:483` — `.dy-section.theme--white .dy-section__content > .text + .heading.h3` no longer matches any DOM | Future housekeeping cycle |
| FB-6 | Advisory | T's §E kicker contrast computation (5.32:1) vs F's (4.71:1) — both pass AA; calculation-method difference | Out of scope; flag for future audit if any cycle hinges on the espresso number |
| FB-7 | Workflow refinement | Codify "PC-1 supersedes scope-split when brief unambiguous + AE confined + contrast preserved" in `workflow-ofts.md` §F | Operator decision |
| FB-8 | Brief reconciliation | Brief specifies 32 px internal card padding (lines 335, 355, 488); preview + live both use 48 px (Sprint 5 Cycle 2 audit-justified) | **Operator decision needed.** Three resolution paths in orchestrator log Cycle 4 entry. Not a regression. |

## Tech-debt register diff

Sprint 12 introduced no net-new tech-debt items. FB-5 and FB-8 are pre-existing surfaces newly documented this sprint; FB-7 is a workflow-refinement candidate. Updated register entries:

- **FB-5 added to §A (WCAG / pa11y) — wait, this is CSS dead-code, not a11y. Added to §E (Architecture / fragility) as advisory.**
- **FB-7 added to §E (Architecture / fragility) as workflow-refinement advisory.**
- **FB-8 added to §B (Preview ↔ live ↔ brief drift) as pre-existing brief-vs-shipped tension.**

See `docs/pl2/tech-debt-register.md` for canonical entries.

## Sprint 13 candidates

Operator-decision; presented in priority order:

1. **Brief reconciliation (FB-8 resolution).** Decide whether to amend the brief to 48 px or open a future sprint to reduce card padding to 32 px site-wide. Discrete, contained.
2. **Workflow refinement (FB-7 codification).** One-paragraph addition to `workflow-ofts.md` §F clarifying the PC-1-supersedes-scope-split precedent. Docs-only.
3. **Preview docs hygiene (FB-1, FB-2).** Update `docs/pl2/Previews/about-us.html` to align preview header chrome with canonical family pattern. Docs-only.
4. **Next page-fidelity sprint.** No untouched landing pages remain in the standard set; consider an audit-first sprint on a content-heavy page (e.g. `/articles` if not yet preview-fidelity-audited) or an architectural cleanup sprint (FB-5 + transition-selector P3 cleanup if remaining).
5. **Pa11y allowlist re-evaluation (ADV-S5 button + brk-3 breadcrumb).** Carry-forward from Sprint 9. Operator-approved exceptions; revisit when convenient.

## Branch hygiene

Per memory `project_local_only_main.md`: branches stay locally. To be deleted post-wrap (only after operator confirms `main` reflects the merge):

- `aa/pl-sprint-12-cycle-1-about-us-audit`
- `aa/pl-sprint-12-cycle-2-about-us-bio-renest`
- `aa/pl-sprint-12-cycle-3-about-us-kicker-token`
- `aa/pl-sprint-12-cycle-4-about-us-card-padding`
- `aa/pl-sprint-12-cycle-5-about-us-wrap-verify`
- `aa/pl-sprint-12-about-us-fidelity` (integration)

Following the Sprint 11 wrap precedent, deletion happens in one batch via `git branch -d`. Per-cycle F/T/S handoff docs remain committed to history (already on `main` via the merge) as durable record — Sprint 12's handoff docs are NOT ephemeral the way unit-test scratch is, because they ship the screenshot evidence that supports the audit findings.

## Spawn protocol note (workflow-relevant)

This sprint's O instance did not have direct Agent-tool access. The operator's parent session served as the spawn relay: O drafted each F/T/S kickoff as a single fenced code block (per memory `feedback_prompt_format_clipboard.md`); parent spawned via `Agent()` and forwarded results back via `SendMessage`. O retained all gate logic, decisions, commits, merges, runbook updates, and the orchestrator log. The hybrid mode worked cleanly across 4 F + 3 T + 5 S spawns. No precedent change to workflow needed — fallback path (memory + canonical orchestrator prompt §"Fallback: human-relay mode") covered this; the only refinement was packaging each kickoff as a single fenced block to streamline the operator's copy-paste workflow.

## Commits summary

```
5e7a307d1 Merge Sprint 12 — /about-us preview-fidelity (5 cycles, all PASS or silent-parked)
024d0c885 Merge sprint 12 cycle 5: wrap verification sweep (T → S, PASS)
d8510b2c4 docs(sprint-12): cycle 5 — wrap verification sweep (T → S, PASS)
6c84fc036 docs(sprint-12): cycle 5 issue + log update (wrap verification sweep)
2f421fa82 Merge sprint 12 cycle 4: card-canvas padding no-op verified (PC-4, PASS)
ce6f3cf56 docs(sprint-12): cycle 4 — card-canvas padding no-op verified (PC-4)
7050074b2 docs(sprint-12): cycle 4 issue + log update (card-canvas outer padding alignment)
af2614d09 Merge sprint 12 cycle 3: normalize §B/§D kicker to --accent-deep #8E4A2A (PASS)
7199c00db fix(about-us): cycle 3 — normalize §B/§D kicker to --accent-deep #8E4A2A
b6ee61a23 docs(sprint-12): cycle 3 issue + log update (kicker terracotta normalization)
3cac77a3c Merge sprint 12 cycle 2: /about-us bio re-nest inside §C + hairline (R9 restore, PASS)
c488dee57 refactor(about-us): cycle 2 — re-nest bio inside §C + hairline above (R9 restore)
7a2d381b4 docs(sprint-12): cycle 2 issue — about-us bio re-nest inside §C
fdff87ce4 docs(sprint-12): /about-us preview-vs-live audit (cycle 1)
```

## Verdict

**PASS — Sprint 12 closed.** `/about-us` is preview-fidelity-clean for every actionable Cycle 1 row. Cross-page consumers verified empirically sub-perceptual. WCAG 2.2 AA 21/21. Tech-debt register remains effectively at zero (Sprint 12 added three documentation items: FB-5, FB-7, FB-8 — none blocking, two pre-existing surfaces, one workflow-refinement candidate). Integration merged into local `main` at `5e7a307d1`.
