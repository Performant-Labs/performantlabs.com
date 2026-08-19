# Sprint 12 — Orchestrator Log

**Sprint:** 12 — `/about-us` preview-fidelity
**Runbook:** [`../pl-plan--sprint-12-about-us-fidelity.md`](../pl-plan--sprint-12-about-us-fidelity.md)
**Integration branch:** `aa/pl-sprint-12-about-us-fidelity`
**Mode:** autonomous
**Started:** 2026-05-12

---

## Kickoff record

Operator delegated full sprint unattended via kickoff briefing on 2026-05-12. Per memory `feedback_autonomous_no_explicit_go.md`: briefing IS the go-signal. Confirmation table presented in chat; no explicit "go" awaited. Cycle 1 opened immediately.

### Confirmation table

| Field | Value |
|---|---|
| Page | `/about-us` |
| Project | pl2 (Performant Labs) |
| Mode | autonomous |
| Runbook | `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md` |
| Workflow spec | `docs/pl2/workflow-ofts.md` |
| Handoff directory | `docs/pl2/handoffs/` |
| Issue template source | `docs/pl2/workflow-ofts.md` §"Issue Template" |
| Branch pattern | `aa/pl-sprint-12-cycle-N-[slug]` |
| Integration branch | `aa/pl-sprint-12-about-us-fidelity` |
| Active theme | `performant_labs_20260502` |
| Live URL | `https://pl-performantlabs.com.3.ddev.site:8493/about-us` |
| Next cycle | Cycle 1 — preview-vs-live audit (S-only) |
| Approval rule | Auto-resolve per PC table; silent-park on ADVISORY-HOLD; hard-stop only on real breakage |
| Posture | Local-only; never push; merge `--no-ff` |

### Kickoff pre-commitments

PC-1..PC-10 captured in runbook §"Pre-commitments". No operator overrides at kickoff. No deferrals at kickoff.

### Spawn protocol (resumed session)

This sprint's O instance does not have direct Agent-tool access. Operator-as-parent acts as the spawn relay: O drafts each F/T/S kickoff as a single fenced block (per memory `feedback_prompt_format_clipboard.md`); parent spawns and forwards results. O retains all gate logic, decisions, commits, merges, and runbook/log updates.

---

## Cycle ledger

| Cycle | Slug | Branch | Status | S verdict | Merged | Notes |
|---|---|---|---|---|---|---|
| 1 | about-us-audit | `aa/pl-sprint-12-cycle-1-about-us-audit` | committed + merged | ADVISORY-HOLD (silent-park) | yes | Two preview-side defects (header CTA pill, missing mobile hamburger). Per memory `design_header_nav_breakpoint.md` + sibling-fit, preview is wrong, live is correct on header chrome. Folded to follow-up backlog; live header is NOT changed. Carve adopted. |
| 2 | about-us-bio-renest | `aa/pl-sprint-12-cycle-2-about-us-bio-renest` | committed + merged | PASS | yes | F's structural investigation found bio was already inside §C — only marker was wrong. Canvas patch + L5 selector rewrite. R9 satisfied; live render pixel-equivalent to Cycle 1 at 1280 (md5 match). Merge `3cac77a3c`. |
| 3 | about-us-kicker-token | `aa/pl-sprint-12-cycle-3-about-us-kicker-token` | committed + merged | PASS | yes | L3 token-value alignment `--pl-accent-deep-on-light: #8C4E33 → #8E4A2A` in base.css. Cross-page consumer set (homepage, /services, /open-source-projects) AE 310–504 px each at 1280, red confined to kicker glyphs. PC-1 empirically vindicated by inflated S scope. Procedural finding logged below. Merge `af2614d09`. |
| 4 | about-us-card-padding | `aa/pl-sprint-12-cycle-4-about-us-card-padding` | committed + merged | PASS (NO-OP per PC-4) | yes | F traced Cycle 1 cards DELTA to a structural-vs-visual misread; 48 px cadence already present via `.card__bottom { padding: 3rem }` from Sprint 5 Cycle 2. S confirmed 49 px (1 px border + 48 px padding) on live and preview at all 3 viewports via Playwright `getBoundingClientRect`. Helper scripts retained as reference. Merge `2f421fa82`. |
| 5 | about-us-wrap-verify | `aa/pl-sprint-12-cycle-5-about-us-wrap-verify` | open | — | — | T → S verification sweep. T1+T2 site-availability + structural on `/about-us`; T3 visual diff vs preview at 3 viewports against the post-Cycle-4 live; pa11y with allowlist; sibling-fit spot-check against `/services` + `/open-source-projects` + homepage. No F. Outcome gates integration → main merge. |

---

## Cycle 1 decision log

**S verdict:** ADVISORY-HOLD.

**Preview-side defects (silent-parked to follow-up backlog):**
1. Preview header has right-side "Book a testing review" CTA pill at line 488; canonical family header (verified via memory `design_header_nav_breakpoint.md` + shipped homepage / services / open-source-projects) has no such pill. Live page is correct.
2. Preview's `<992px` breakpoint hides nav with no hamburger toggle. Live ships the correct `navbar-expand-lg` hamburger per family pattern. Live is correct.

Both are preview-side errors. Per PC-1 (brief tokens > preview layout) and the canonical header memory, the live header chrome stands. The preview should eventually be amended for documentation hygiene but no fix cycle is required — silent-parked per PC-9.

**Carve decision — accept S's recommendation in full:**

- Cycle 2 — bio re-nest inside §C with hairline above. PC-1 supports brief/preview structure; live's bio promotion was the R9 violation.
- Cycle 3 — terracotta kicker token normalization (§B + §D rendering `rgb(140,78,51)` vs target `rgb(142,74,42)`). L3 preferred if cross-page; L5 if local.
- Cycle 4 — `card-canvas` outer padding alignment to preview's 48 px cadence. L5; sibling-impact on `/open-source-projects` flagged at F handoff.
- Cycle 5 — T→S verification sweep prior to integration → main merge.

---

## Cycle 2 decision log

**S verdict:** PASS.

F's Step-3 investigation reinterpreted the issue: the bio was already physically inside §C; the "promotion" was an incorrect `dy-section--bio-block` marker on §C itself. F removed the marker via idempotent Canvas patch (`scripts/sprint12-cycle2-about-us-bio-renest.php`) and rewrote two L5 selectors in `dy-section.css` from `.dy-section--bio-block` to `.dy-section--centered-white`. The rendered geometry is pixel-equivalent to Cycle 1 at 1280 (md5 match) because the hairline + centered-bio styles continue to apply through the rewritten selector. R9 is satisfied semantically and structurally.

FB-4 (orphan CSS sweep): resolved. F surfaced one pre-existing dead selector at `dy-section.css:483` unrelated to this cycle; logged as FB-5.

Commit: `c488dee57`. Merge to integration: `3cac77a3c` (`--no-ff`).

---

## Cycle 3 decision log

**S verdict:** PASS.

F traced the off-spec `rgb(140, 78, 51)` to `:root { --pl-accent-deep-on-light: #8C4E33; }` in `base.css:19` — a stale contrast-motivated variant overriding the brief's canonical `#8E4A2A` whenever the `.theme--light .kicker--light` selector fired (§B Track record + §D Dogfood, but also kickers on homepage / /services / /open-source-projects). F's L3 fix: align the on-light token to `#8E4A2A`. Cross-page sibling pages all shift sub-perceptually.

**Procedural finding — F bypassed the kickoff's scope-split rule.** O accepted F's call with mitigation: inflated S's scope to mandatory Tier-3 visual diffs on every cross-page consumer.

**Empirical outcome justified F's call.** S found cross-page AE confined entirely to kicker glyph rectangles: homepage 473 px (0.0077%); /services 310 px (0.0054%); /open-source-projects 504 px (0.0087%). /about-us §B + §D rows flipped Cycle 1 DELTA → MATCH.

**Precedent recorded (FB-7).** In autonomous mode, when (a) the brief is unambiguous on the canonical token, (b) the cross-page delta is empirically sub-perceptual, and (c) contrast is preserved or improved, **PC-1 supersedes a kickoff-level scope-split directive**. The inflated-S mitigation is the safety net.

Commit: `7199c00db`. Merge to integration: `af2614d09` (`--no-ff`).

---

## Cycle 4 decision log

**S verdict:** PASS (NO-OP verified per PC-4).

F's investigation revealed the Cycle 1 "Open source §C cards" DELTA row was a structural-vs-visual misread: live's `.card-canvas` outer wrapper has `padding: 0`, but `.card[class*="theme"] .card__bottom { padding: 3rem }` (set in Sprint 5 Cycle 2, `card.css:83`) fills the entire card interior via zero-margin/zero-padding `.card__layout`. Effective content-to-border spacing is 48 px on all sides at all viewports — visually identical to the preview's `.project-card { padding: var(--space-2xl) }`. No CSS change required. F resolved as no-op per PC-4.

O ran a reduced-scope belt-and-suspenders S audit (no T spawn; F's `getComputedStyle` evidence covers T1/T2 equivalents). S independently confirmed via Playwright `getBoundingClientRect` (card outer edge → first text glyph): live and preview both read 49 px inset (1 px border + 48 px padding) at 1280 / 768 / 375. Cycle 1 row flipped DELTA → MATCH.

Helper scripts retained as reference for future no-op verification cycles: `scripts/cycle-4-about-us-card-padding-capture.mjs`, `scripts/cycle-4-measure-inset.mjs`. First formal Playwright-based inset-measurement scripts in the repo.

**Brief-vs-preview tension (FB-8).** F surfaced a pre-existing brief-vs-preview discrepancy: brief specifies 32 px internal card padding at three locations (`pl_design_brief.md` lines 335, 355, 488); preview and live both use 48 px (established in Sprint 5 Cycle 2 with explicit audit justification). Out of scope for Sprint 12 (preview-fidelity sprint, not brief-reconciliation). Logged to follow-up backlog; will surface at sprint wrap for operator decision.

Commit: `ce6f3cf56`. Merge to integration: `2f421fa82` (`--no-ff`).

---

## Follow-up backlog (silent-park items)

- **FB-1 (sprint-12 cycle 1):** Preview `docs/pl2/Previews/about-us.html` has a header CTA pill (line 488) that contradicts the canonical no-pill header pattern. Remove during a future docs hygiene pass. Live page is correct; no remediation needed.
- **FB-2 (sprint-12 cycle 1):** Preview `docs/pl2/Previews/about-us.html` hides nav at `<992px` with no hamburger toggle, contradicting the family `navbar-expand-lg` pattern. Add a hamburger stub or `<!-- uses shipped header chrome -->` annotation during a future docs hygiene pass. Live is correct; no remediation needed.
- **FB-3 (sprint-12 cycle 1, advisory):** Whole-page AE deltas at 32–55% are dominated by Drupal chrome + bio-section vertical drift; not load-bearing per PC-8. Recorded for posterity.
- **FB-4 (sprint-12 cycle 2):** RESOLVED in Cycle 2 — zero active `dy-section--bio-block` selectors remain post-rewrite.
- **FB-5 (sprint-12 cycle 2, advisory):** Pre-existing dead selector at `web/themes/custom/performant_labs_20260502/css/components/dy-section.css:483` — `.dy-section.theme--white .dy-section__content > .text + .heading.h3` no longer matches any DOM. Candidate for a future housekeeping cycle.
- **FB-6 (sprint-12 cycle 3, advisory):** T's independent §E (espresso) kicker contrast computation returned 5.32:1 vs F's reported 4.71:1. Both pass AA. Discrepancy likely a calculation-method difference. Out of Sprint 12 scope.
- **FB-7 (sprint-12 cycle 3, procedural):** F's non-scope-split call on a cross-page L3 edit was accepted post-hoc on empirical (S-verified sub-perceptual cross-page delta) grounds. Workflow refinement candidate: codify the "PC-1 supersedes scope-split when (a) brief unambiguous, (b) AE confined to affected element, (c) contrast preserved or improved" precedent in `workflow-ofts.md` §F so future autonomous F's have explicit guidance. Out of Sprint 12 scope.
- **FB-8 (sprint-12 cycle 4, brief reconciliation):** Brief specifies 32 px internal card padding at three locations (`pl_design_brief.md` lines 335, 355, 488); preview and live both use 48 px (established in Sprint 5 Cycle 2 with explicit audit justification). Per PC-1 brief > preview, but this brief value contradicts deliberate audit-reviewed shipped behavior. Three resolution paths: (i) amend brief to 48 px to match shipped reality; (ii) open a future sprint to reduce card padding back to 32 px (touches all card consumers site-wide); (iii) defer indefinitely. **Operator decision required at sprint wrap.** Not a regression — flagged for awareness.

---

## Hard-stop events

(none yet)
