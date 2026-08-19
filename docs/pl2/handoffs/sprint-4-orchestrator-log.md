# Sprint 4 — Orchestrator log

> **Mode:** autonomous
> **Sprint runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md)
> **Workflow spec:** [`../workflow-ofts.md`](../workflow-ofts.md)
> **Integration branch:** `aa/pl-sprint-4-pre-services-foundation`
> **Started:** 2026-05-11
> **Permissions verified:** 2026-05-11 — user-level `defaultMode: bypassPermissions` + `skipDangerousModePermissionPrompt: true`; project + subagent allows cover Bash/Edit/Write/Read/Glob/Grep/Agent and Chrome+Preview MCP families. No deny rules. Destructive git ops (reset --hard, push --force, branch -D) and remote pushes/PRs remain ask-first per standing guardrails.

This is the durable record of Sprint 4. Per-cycle F / T / S handoffs are ephemeral and will be deleted at sprint wrap; this log is what survives.

---

## Operator pre-commitments

Captured at sprint kickoff (2026-05-11). Source of truth: runbook §"Operator pre-commitments (autonomous mode)".

- **S4-0** approved
- **S4-3** Hero H1 = path A (reconcile previews to 72px)
- **S4-4** Canvas alignment = path A (retune canvas.css Pass 2)
- **S4-6** heal-flow = defer (not opened in Sprint 4)
- **S4-WRAP** self-contained wrap doc, no operator handshake
- **Cycle 5 D.4** missing breadcrumbs → follow-up issue, no autonomous widening
- **Cycle 5 split** F's discretion (one split max per cycle policy)

---

## Sprint status

| Cycle | Slug | Branch | Verdict | Merged into integration | Notes |
|---|---|---|---|---|---|
| 1 | Header theme-source repair | _no branch_ | **already-complete** | n/a (no-op) | Prior commit `3a9569d22` (2026-05-03) already landed L1 config + L5 workaround removal |
| 2 | Brand tokens on `:root` | `aa/pl-sprint-4-phase-2-tokens-on-root` | **PASS (reinterpreted)** | `def55d97f` | F met cycle objective; AC4 reinterpreted; cream-band delta is the brand-correction the cycle was designed to produce |
| 3 | Hero H1 reconciliation (path A) | `aa/pl-sprint-4-phase-3-hero-h1-reconciliation` | **PASS (reinterpreted)** | `6510f88c5` | F met path A intent (previews = brief); AC2 contradicted path A's own "live stays unchanged"; size + weight reconciled cleanly |
| 4 | Canvas title-content alignment (path A) | _no branch_ | **already-complete** | n/a (no-op) | Active theme has no `canvas.css`; misalignment was in old theme `performant_labs_20260418`; `/articles-2` already 0px delta |
| 5 | Site-wide a11y polish bundle | `aa/pl-sprint-4-phase-5-a11y-polish` | **PASS** | `dbe1deda6` | J.2 shipped (page-title inside main); A.2/A.3/D.4 verified clean; S 0px diff at 1280+375 |
| 6 | heal-flow Canvas integration | — | **deferred** | — | Pre-committed deferral; Services-scoping question |

---

## Sprint complete — 2026-05-11

All planned cycles concluded. Full wrap doc: [`sprint-4-wrap.md`](sprint-4-wrap.md).

**FU-2 follow-up cycle (post-wrap):** Operator chose Option A from the three follow-up paths. F → T → S all PASS. Live CSS on `/services`, `/how-we-do-it`, `/open-source-projects` now aligned to brief at `72/500/1.05/-2px` desktop and `44/500/1.05/-1px` mobile via the `landing-hero` Canvas-class pattern + scoped L5 override in `dy-section.css`. Three preview HTMLs mobile values also updated to 44px. Mobile parallel inconsistency (FU-7) closed in the same cycle. Merged at `9a2999dbc`. Services Phase 1 inherits a clean hero-spec baseline.

Quick summary:
- Cycle 1, 4: no-op (work already done on `main` pre-sprint)
- Cycle 2: PASS via objective reinterpretation (cream-band brand-correction was the cycle's intent)
- Cycle 3: PASS via path A intent (previews now match brief; live letter-spacing/line-height divergence → FU-2)
- Cycle 5: PASS (J.2 shipped, three other items verified clean)
- Cycle 6: deferred per kickoff

GET-BACK-TO-THESE.md and post-homepage-next.md updated with resolution notes per runbook §Cleanup. pl-plan--services.md updated with Sprint 4 closure handshake.

Eight follow-up items captured in [`sprint-4-wrap.md`](sprint-4-wrap.md) §"Follow-up backlog for Sprint 5 (or Services prep)."

---

## Follow-up backlog

Non-blocking issues surfaced mid-sprint and deferred to follow-up cycles or future sprints. Each entry: cycle of origin, one-line problem, proposed fix path.

- **Cycle 1 / verification-env** — host-shell `curl` rejects DDEV mkcert chain (SSL error 60). Workaround in use: `ddev exec curl http://localhost/`. Proposed fix: install mkcert root CA into the shell `curl` CA bundle (`export CURL_CA_BUNDLE=$(mkcert -CAROOT)/rootCA.pem` in `.zshrc`, or copy/append to the system trust store). Not blocking — alternative path works.
- **Cycle 2 / AC4 vs cycle-objective drift (Sprint 4 documentation cleanup)** — runbook §Cycle 2 AC4 was authored assuming every rendered element on the test pages sits inside a `.theme--*` zone (empirically false on `/articles`, `/contact-us`, `/open-source-projects` — their breadcrumb / page-title band sits outside any theme zone). Cycle merged on objective alignment, not literal AC. Future runbook authors should write ACs that describe *intent achieved* rather than *no incidental side effect*. At sprint wrap, amend AC4 in the runbook to read "no *unintended* visual delta; brand-correction deltas on surfaces previously falling through to Dripyard defaults are accepted as cycle output."
- **Cycle 3 / live letter-spacing + line-height divergence** — live CSS renders `letter-spacing: -1.8px` + `line-height: 1.10` on `/services`, `/how-we-do-it`, `/open-source-projects` hero H1, but brief + homepage live + (now) previews all specify `-2px` + `1.05`. Path A explicitly deferred live changes ("Live stays unchanged"); this is the right time to file a follow-up cycle that either (a) updates live CSS on those three pages to match brief, (b) splits the type token to acknowledge per-page variation, or (c) updates brief to match the 3-page majority. **Recommended follow-up cycle title:** "Hero H1 live-CSS reconciliation (sprint-5 candidate)." Mobile inconsistency (next bullet) folds into the same follow-up.
- **Cycle 3 / mobile-hero-inconsistency (pre-existing)** — three landing-page previews (services, how-we-do-it, oss) use `font-size: 40px` for mobile hero H1; homepage uses `44px` (matching brief `typography-mobile.display-xl`). Pre-existing inconsistency, outside Cycle 3 desktop-only scope. Folds into the Hero H1 live-CSS reconciliation follow-up above.

---

## Parked cycles

Cycles parked under autonomous-mode silent-park policy (ADVISORY-HOLD, F scope-of-split escalation, 3rd rework). Surfaced together at sprint wrap.

_(empty so far)_

---

## Hard-stop events

Significant breakage that paused the sprint mid-flight. Each entry: timestamp, cycle, trigger, operator response.

### 2026-05-11 — Hard-stop **withdrawn** (autonomous-mode calibration shift)

O originally triggered a hard-stop after Cycle 3 returned ADVISORY-HOLD, on the "two consecutive parked cycles" rule. Operator surfaced back ("i was trying to not make decisions") and corrected the calibration: parking on every ADVISORY-HOLD is over-conservative. When F's implementation meets the cycle's stated objective, the AC-vs-objective drift S flagged is a follow-up-backlog item, not a park.

Cycle 2 reinterpreted as PASS — F met the cycle objective (declare brand tokens at `:root` for code outside theme zones); AC4 "zero delta" was empirically wrong on `/articles`, `/contact-us`, `/open-source-projects` because their breadcrumb/page-title bands sit outside any theme zone. The cream-band visual delta IS the brand-correction the cycle was designed to produce.

Cycle 3 reinterpreted as PASS — F met path A's stated description ("Live stays unchanged. Brief stays unchanged. Update previews UP to brief"). All four landing-page hero previews now match the brief cleanly at 72/500/-2px/1.05. The letter-spacing/line-height divergence between brief and three live pages is upstream-of-this-cycle debt that path A explicitly defers.

Both merged into integration (`def55d97f` Cycle 2, `6510f88c5` Cycle 3). Hard-stop record retained in this log for audit; the rule itself was dropped from `feedback_sprint_autonomous_mode.md` memory. Sprint continues with Cycle 4.

---

## Per-cycle log

### Cycle 1 — Header theme-source repair

**Opened:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-1-header-theme-source` (off integration branch)
**Issue:** [`sprint-4-phase-1-header-theme-source-issue.md`](sprint-4-phase-1-header-theme-source-issue.md)
**Mode:** autonomous
**Operator-decision:** none (deterministic)
**Conflict-check directive in issue:** verify trace does not collide with phase-8.6 nav-cluster rework in `header.css` `@media (width > 1000px)`.

**Status:** **Closed — already complete.**

F's trace surfaced that commit `3a9569d22` (2026-05-03, "fix(theme): move header theme prop from light to white at config source") already landed the exact L1 + L5 fix this cycle was scoped to do. The runbook was drafted before that commit merged.

**O's independent verification (2026-05-11):**

1. `git show 3a9569d22` — commit content matches the cycle scope: `header_settings.theme: light → white` in `config/sync/performant_labs_20260502.settings.yml` + removal of `.site-header { background-color: #FFFFFF; --theme-surface: #FFFFFF; }` from `header.css`.
2. `grep -A8 "^header_settings:" config/sync/performant_labs_20260502.settings.yml` — confirms `theme: white`.
3. `grep -nE "background-color.*#[Ff]{3,6}|--theme-surface.*#[Ff]{3}" web/themes/custom/performant_labs_20260502/css/components/header.css` — no matches (no compensation rules remain).
4. `ddev exec 'curl -s http://localhost/ | grep -oE "<header[^>]*class=\"[^\"]*\""'` — returns `<header class="theme--white site-header"`. DOM verified.
5. `ddev drush cim --diff` — "There are no changes to import." Config is clean.

All five acceptance criteria met against current state of `main`. No rework needed; T+S not run for a no-op.

**Closure actions:**
- Empty cycle branch deleted via `git branch -d` (safe — no unique commits).
- Issue file + F handoff retained until sprint wrap per autonomous-mode handoff-deletion policy.
- Tech Debt #1 in `post-homepage-next.md` §2.2 is resolved; mark at sprint-wrap cleanup.

**Verification-environment note (follow-up):** host-shell `curl` rejects the DDEV cert with `SSL certificate problem: unable to get local issuer certificate` (exit 60), so curl-based T1 from the host fails. `ddev exec curl http://localhost/` works as a substitute and gives the same DOM evidence. Likely cause: macOS shell `curl` does not have mkcert's root CA in its trusted-issuer chain (may need `CURL_CA_BUNDLE` pointed at `$(mkcert -CAROOT)/rootCA.pem`). **Impact on later cycles:** T (curl-heavy) should be told to use `ddev exec curl` for HTTP path checks; S (Playwright-heavy) uses Chromium's trust store which should already pick up mkcert's system-installed CA — likely fine but verify on first S run.

---

### Cycle 2 — Brand tokens on `:root`

**Opened:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-2-tokens-on-root` (off integration branch — **retained, not merged**)
**Cycle commit:** `18b8912b5` on cycle-2 branch
**Issue:** [`sprint-4-phase-2-tokens-on-root-issue.md`](sprint-4-phase-2-tokens-on-root-issue.md) (on cycle-2 branch)
**Operator-facing report:** [`sprint-4-phase-2-tokens-on-root-report.html`](sprint-4-phase-2-tokens-on-root-report.html) (on cycle-2 branch — `git checkout aa/pl-sprint-4-phase-2-tokens-on-root` to view)
**Mode:** autonomous

**Status:** **PARKED — S returned ADVISORY-HOLD 2026-05-11.**

**Pipeline summary:**

- F: implemented `:root { … }` block in `base.css` with 10 `--theme-*` brand-canonical tokens (values from existing `html .theme--white` block + design brief). Specificity `(0,1,0)` — zone blocks `(0,1,1)` win. No `!important`. Self-approved L3 per autonomous-mode.
- T: clean. All six ACs PASS (two reframed per F's correct interpretation of `--ink` / `--primary` as conceptual rather than literal CSS-variable names). Playwright `getComputedStyle` confirmed `--theme-surface = #FFFFFF` at both `:root` and `.theme--white`; `--theme-link-color = #1893b4` end-to-end. No `--theme-*` tokens in Dripyard's `<html style="">` (no specificity conflict).
- S: returned **ADVISORY-HOLD**. Methodology: Playwright captures of `/`, `/articles`, `/contact-us`, `/open-source-projects` at 1280 + 375 on baseline (integration branch state) vs branch state; ImageMagick `compare -metric AE` pixel diffs.

**S verdict in one sentence:** the runbook's AC2/AC3 (token resolution at `:root` must change from empty/legacy to brand) and AC4 (zero visual delta on the four pages) are mutually exclusive because `/articles`, `/contact-us`, and `/open-source-projects` each contain a breadcrumb / page-title band that reads `--theme-surface-alt` *outside* any `.theme--*` zone — so adding the `:root` backstop *must* visually flip those surfaces from Dripyard's legacy-derived pale-lavender to brand cream `#F5EFE2`.

**Visual evidence (S handoff):**

| Page | Viewport | Delta % | Driving section |
|---|---|---|---|
| `/` | 1280 + 375 | 0.00% / 0.00% | none (every surface is inside an explicit theme zone) |
| `/articles` | 1280 / 375 | 5.28% / 3.49% | breadcrumb + page-title band, pale-lavender → cream |
| `/contact-us` | 1280 / 375 | 4.46% / 2.39% | same band, same flip |
| `/open-source-projects` | 1280 / 375 | 3.35% / 1.60% | same band, same flip |

Identical differing-pixel counts across the three non-home pages (193,644 @ 1280; 55,606 @ 375) confirm the delta is a single shared site-chrome region, not page-specific content.

**Three resolution paths (S enumerated, operator picks at wrap):**

1. **Amend AC4** to read "no *unintended* visual delta; surfaces outside themed zones may shift from Dripyard's legacy-derived neutrals to brand-canonical values, which is the cycle's intent." With this amendment, S's verdict becomes PASS — merge cycle-2 branch via `--no-ff` into integration. **Recommended by O for operator consideration** — the cycle's stated objective and "Why this matters" rationale both align with this outcome; AC4 was authored under the implicit (and empirically false) assumption that every rendered element on the test pages is inside a themed zone.
2. **Scope the `:root` backstop** so it does not feed into `div.region-highlighted` / `section.page-title`. Largely defeats the cycle's stated purpose (the whole point is backstopping tokens for code outside themed zones).
3. **Wrap the breadcrumb / page-title region in `.theme--white`** at the template layer. Architecturally cleanest long-term but is template work, not `base.css` work — outside cycle 2's scope. Would be its own follow-up cycle.

**Why park (not REWORK):** F's implementation faithfully matches every other AC and the cycle's stated intent. The only failure is against a literal reading of AC4 that contradicts AC2/AC3 — an upstream runbook defect, not an F defect. Per autonomous-mode silent-park policy, O does not respawn F against a defective AC.

**Why not surface mid-sprint:** does not meet the hard-stop floor — site is fully available, no WCAG regression introduced (the affected surface has no contrast change beyond pre-approved deviations), no schema deletion, no env breakage, single park (not two consecutive). Surfaces at sprint wrap per policy.

**For the operator on return:**

1. Read this entry + the §"Sprint status" table for the parked-cycle marker.
2. Switch to the cycle-2 branch: `git checkout aa/pl-sprint-4-phase-2-tokens-on-root`.
3. Open `docs/pl2/handoffs/sprint-4-phase-2-tokens-on-root-report.html` in a browser. Use the wipe-slider comparators at 1280 and 375 to *see* the breadcrumb/page-title band flip on the three non-home pages.
4. Pick path 1, 2, or 3 above. Tell O. O resumes from the appropriate state (merge for path 1; new follow-up cycle for path 3; rework with narrowed scope for path 2).

---

### Cycle 4 — Canvas title-content alignment (path A pre-committed)

**Opened:** 2026-05-11
**Branch:** _none — closed as no-op_
**Mode:** autonomous
**Operator-decision:** path A pre-committed (not exercised — no code change required)

**Status:** **Closed — already complete.**

F's pre-flight check found the runbook's D.3 misalignment was in the **old theme** `performant_labs_20260418/css/layout/canvas.css` (which had `padding-inline: var(--spacing-xs, 1.25rem)` on `.block-page-title-block`). That file was never ported to the active theme `performant_labs_20260502`, which has no `css/layout/` directory and no `canvas-layout` library entry. Independent verification: `grep` confirms `web/themes/custom/performant_labs_20260502/css/layout/canvas.css` does not exist.

Additionally, F discovered Canvas pages (`/contact-us`, `/open-source-projects`) don't use `.block-page-title-block` at all — they render titles via authored Dripyard `dy-section` heading components. Only `/articles-2` has the block, and Playwright `getBoundingClientRect()` at 375/576/768/992/1280 shows 0px delta between title-block left edge and content first-element left edge on that page.

T+S not run for a no-op. Empty cycle branch deleted via `git branch -d`. Cycle 4 ephemera (issue file + F handoff) retained on integration branch as durable record of the no-op cycle until sprint wrap.

---

### Cycle 3 — Hero H1 reconciliation (path A pre-committed)

**Opened:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-3-hero-h1-reconciliation` (off integration branch — **retained, not merged**)
**Cycle commit:** `827a17563` on cycle-3 branch
**Issue:** [`sprint-4-phase-3-hero-h1-reconciliation-issue.md`](sprint-4-phase-3-hero-h1-reconciliation-issue.md) (on cycle-3 branch)
**Operator-facing report:** [`sprint-4-phase-3-hero-h1-reconciliation-report.html`](sprint-4-phase-3-hero-h1-reconciliation-report.html) (on cycle-3 branch — `git checkout aa/pl-sprint-4-phase-3-hero-h1-reconciliation` to view)
**Mode:** autonomous

**Status:** **PARKED — S returned ADVISORY-HOLD 2026-05-11.**

**Pipeline summary:**

- F: updated three landing-page previews (services, how-we-do-it, open-source-projects) from `64px / -1.6px` to `72px / -2px` for the hero H1. Homepage preview was already at target. Added a one-line annotation under `display-xl` in the design brief codifying it as the canonical landing-page hero H1 size. F deviated from the issue's `-1.8px` to `-2px` to match the brief's `display-xl.letterSpacing: -2px` and the already-correct homepage preview — documented as Autonomous decision #1.
- T: clean. All four preview `.hero h1` blocks independently confirmed at `72px / 1.05 / -2px / 500`. Brief annotation coherent. F's `-2px` choice validated against the brief. No non-hero H1 regressions. Mobile inconsistency (40px vs 44px) flagged as advisory.
- S: returned **ADVISORY-HOLD**. Methodology: Playwright capture at 1280×800 of all four preview + live pairs, ImageMagick hero-crop diff, plus binding `getComputedStyle()` probe via `scripts/h1-probe.js` (gitignored).

**S verdict in one sentence:** the previews now match the brief's `display-xl` token (`72px / -2px / 1.05 / 500`), but live CSS renders `72px / -1.8px / 1.10 / 500` on `/services`, `/how-we-do-it`, `/open-source-projects` — only `/` matches the brief. So the previews now match the brief and homepage, but no longer match the three non-home live pages. The cycle's font-size + weight reconciliation (72/500) is met cleanly across all eight surfaces; the divergence is on letter-spacing + line-height for three of four pages.

**Computed-style probe table (the binding evidence, viewport 1280×800):**

| Page | Side | font-size | weight | line-height | letter-spacing |
|---|---|---|---|---|---|
| homepage | preview / live | 72 / 72 | 500 / 500 | 1.05 / 1.05 | -2px / -2px (MATCH) |
| services | preview / live | 72 / 72 | 500 / 500 | **1.05 / 1.10** | **-2px / -1.8px** |
| how-we-do-it | preview / live | 72 / 72 | 500 / 500 | **1.05 / 1.10** | **-2px / -1.8px** |
| open-source-projects | preview / live | 72 / 72 | 500 / 500 | **1.05 / 1.10** | **-2px / -1.8px** |

**Three resolution paths (S enumerated, operator picks at wrap):**

- **A.** Update the brief to `letterSpacing: -1.8px` + `lineHeight: 1.10`. Update all four previews to match. Update live homepage CSS to match. (This makes everything align to live's 3-of-4 majority value. Requires CSS change to homepage.)
- **B.** Keep the brief at `letterSpacing: -2px` + `lineHeight: 1.05`. Update live CSS for `/services`, `/how-we-do-it`, `/open-source-projects` to match the brief. (This is the "brief is source of truth" path; requires CSS work on three live page hero overrides.)
- **C.** Split the type token: one for homepage hero (`-2px / 1.05`), another for non-homepage landing heroes (`-1.8px / 1.10`). Reflect in the brief; revert the three previews to `-1.8px / 1.10`; leave live as-is. (Recognizes the existing per-page variation as intentional and codifies it.)

**Why park (not REWORK):** F's implementation faithfully matches the source of truth F was pointed at (the brief). The brief ↔ live divergence is upstream of this cycle. Asking F to flip values again would just re-litigate the ambiguity without operator alignment.

**Why hard-stop:** this is the second consecutive park. Per autonomous-mode hard-stop floor "two consecutive parked cycles," the sprint is paused for operator review of both parks together. See §"Hard-stop events" below.

**For the operator on return:**

1. Switch to cycle-3 branch: `git checkout aa/pl-sprint-4-phase-3-hero-h1-reconciliation`.
2. Open `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-report.html` for the visual report.
3. Read S's handoff `sprint-4-phase-3-hero-h1-reconciliation-S.md` for the full computed-style probe table.
4. Pick A / B / C. Combine with Cycle 2 resolution. Tell O.
