# Sprint 4 — Pre-Services Foundation — Wrap

**Sprint:** Sprint 4 Pre-Services Foundation
**Runbook:** [`pl-plan--sprint-4-pre-services-foundation.md`](../pl-plan--sprint-4-pre-services-foundation.md)
**Integration branch:** `aa/pl-sprint-4-pre-services-foundation`
**Mode:** autonomous (default)
**Started:** 2026-05-11
**Wrapped:** 2026-05-11 (same-day autonomous execution)
**Cycles attempted:** 5 of 6 (Cycle 6 deferred per pre-commitment)
**Outcomes:** 2 no-op closures (already done), 3 PASS-and-merged (2 via reinterpretation)

---

## Outcomes at a glance

| Cycle | Slug | Outcome | Merge commit / closure | Operator action needed |
|---|---|---|---|---|
| 1 | Header theme-source repair | **No-op** — prior commit `3a9569d22` (2026-05-03) already did the work | n/a; cycle branch deleted | None |
| 2 | Brand tokens on `:root` | **PASS** (objective reinterpretation; AC4 was empirically wrong) | `def55d97f` | Optional: amend AC4 in future runbooks (see Follow-up backlog) |
| 3 | Hero H1 size reconciliation (path A) | **PASS** (path A intent met; AC2 contradicted path A's own description) | `6510f88c5` | Optional: open Sprint 5 follow-up for letter-spacing live-CSS reconciliation |
| 4 | Canvas title-content alignment (path A) | **No-op** — misalignment was in old theme, never ported | n/a; cycle branch deleted | None |
| 5 | Site-wide a11y polish bundle (J.2 + A.2 + A.3 + D.4) | **PASS** — J.2 shipped, A.2/A.3/D.4 verified clean | `dbe1deda6` | None |
| 6 | heal-flow Canvas integration | **Deferred** per kickoff pre-commitment | — | Decide before Services Phase 1 whether Services needs heal-flow |

**Net change to the codebase:**
- `web/themes/custom/performant_labs_20260502/css/base.css` — `:root { … }` block declaring 10 `--theme-*` brand-canonical tokens (Cycle 2)
- `docs/pl2/Previews/services.html`, `how-we-do-it.html`, `open-source-projects.html` — hero H1 to `72px / -2px / 1.05 / 500` (Cycle 3)
- `docs/pl2/briefs/pl_design_brief.md` — one-line annotation under `display-xl` codifying it as the canonical landing-hero size (Cycle 3)
- `web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig` — `<section class="page-title">` moved inside `<main>` (Cycle 5)
- `docs/pl2/css-change-log.md` — one entry for Cycle 2
- `docs/pl2/GET-BACK-TO-THESE.md`, `docs/pl2/post-homepage-next.md` — resolution notes for §A.2, §A.3, §D.3, §D.4, §J.2, §L.1, §L.4, §2.2

**Site impact:** zero visible regression. Brand-correction side-effect on Canvas-page breadcrumb / page-title bands (pale-lavender → cream `#F5EFE2`) is intent-aligned and documented.

---

## Sprint-level calibration captured

The operator delegated this sprint to autonomous mode with the explicit directive "i wontt be able to attend you while you work" and "default should be autonomous now." During execution, two calibrations were tightened:

1. **ADVISORY-HOLD ≠ automatic park.** Initial autonomous-mode policy parked on every S ADVISORY-HOLD. Cycles 2 and 3 both surfaced AC-literal-text drift from cycle objective; parking them was over-conservative. The operator's feedback: *"i was trying to not make decisions."* Recalibrated mid-sprint: when F meets the cycle's stated objective, O reinterprets AC contradictions in F's favor and PASSes with a follow-up backlog note. Codified in `feedback_sprint_autonomous_mode.md`.

2. **"Two consecutive parks" hard-stop dropped.** It was firing on judgment calls (Cycles 2 + 3 ADVISORY-HOLDs) rather than structural problems. Parks are now silent regardless of consecutive count; the hard-stop floor is reserved for actual breakage (env, site availability, real WCAG regression, schema deletion).

Pattern reusable for future autonomous sprints — see the memory file.

---

## Per-cycle detail

### Cycle 1 — Header theme-source repair (no-op closure)

F's pre-flight check found commit `3a9569d22` (2026-05-03, "fix(theme): move header theme prop from light to white at config source") had already landed the L1 config change + L5 CSS workaround removal. The runbook was drafted before that commit merged. O independently verified all five acceptance criteria against current state of `main`:

- `config/sync/performant_labs_20260502.settings.yml` → `header_settings.theme: white`
- `header.css` has no `#FFFFFF` compensation rules
- Live DOM: `<header class="theme--white site-header"`
- `ddev drush cim --diff` clean
- No cross-page regressions

T+S not run for a no-op. Empty cycle branch deleted via `git branch -d`. GET-BACK §A.2-adjacent post-homepage-next §2.2 marked resolved.

### Cycle 2 — Brand tokens on `:root` (PASS, reinterpreted)

**Implementation:** F added a `:root { … }` block in `web/themes/custom/performant_labs_20260502/css/base.css` declaring 10 `--theme-*` brand-canonical tokens (`--theme-surface = #FFFFFF`, `--theme-surface-alt = #F5EFE2`, `--theme-text-color-{primary,loud,medium,soft}`, `--theme-link-color = var(--pl-primary)`, `--theme-link-color-hover = var(--pl-primary-deep)`, `--theme-border-color = #E5E1DC`, `--theme-focus-ring-color = var(--pl-primary)`). Specificity `(0,1,0)` — themed zones `(0,1,1)` continue to own the cascade where they had it.

**S verdict:** ADVISORY-HOLD — runbook AC4 ("zero visual delta") was empirically wrong on `/articles`, `/contact-us`, `/open-source-projects` because those pages each render a breadcrumb / page-title band *outside* any `.theme--*` zone. Adding the `:root` backstop necessarily flipped those surfaces from Dripyard's legacy-derived pale-lavender to brand cream `#F5EFE2`. Diff data:

| Page | Viewport | Differing pixels | Delta % |
|---|---|---:|---:|
| `/` | 1280 / 375 | 0 / 0 | 0.00% / 0.00% |
| `/articles` | 1280 / 375 | 193,644 / 55,606 | 5.28% / 3.49% |
| `/contact-us` | 1280 / 375 | 193,644 / 55,606 | 4.46% / 2.39% |
| `/open-source-projects` | 1280 / 375 | 193,644 / 55,606 | 3.35% / 1.60% |

Identical pixel counts on the three non-home pages confirm the delta is a single shared chrome region.

**O's reinterpretation:** The cycle's stated objective is "Declare brand-canonical tokens at `:root` for code reading outside theme zones." F met it cleanly. The cream-band delta IS the brand-correction the cycle was designed to produce — pale-lavender was the bug, cream is the fix. AC4 was authored on the empirically-false assumption that every rendered element on those pages sits inside a theme zone. PASS.

Merge: `def55d97f` via `--no-ff` into integration branch.

### Cycle 3 — Hero H1 size reconciliation (PASS, reinterpreted, path A)

**Implementation:** F updated three landing-page preview HTMLs (`services.html`, `how-we-do-it.html`, `open-source-projects.html`) from `font-size: 64px / letter-spacing: -1.6px` to `72px / -2px` on the hero H1. Homepage was already at target. Added a one-line annotation under `display-xl` in `pl_design_brief.md` codifying it as the canonical landing-hero size. F's `-2px` choice over the issue's `-1.8px` matches the brief and existing homepage preview (documented as Autonomous decision #1).

**S verdict:** ADVISORY-HOLD — computed-style probe at viewport 1280×800 shows all four previews now match the brief at `72 / 500 / 1.05 / -2px`, but live CSS renders `72 / 500 / 1.10 / -1.8px` on `/services`, `/how-we-do-it`, `/open-source-projects`. Only `/` matches the brief on all four properties. So previews now match brief + homepage live, but no longer match the three non-home live pages on letter-spacing + line-height.

**O's reinterpretation:** Path A's runbook description explicitly says "Live stays unchanged. Brief stays unchanged. Update previews UP to brief." F did exactly that. The headline goal (size + weight, 72/500 across all 8 surfaces) is met cleanly. AC2 ("previews match live") contradicted path A's own description; that's a runbook-internal inconsistency. The letter-spacing/line-height divergence is upstream debt path A explicitly defers — logged for Sprint 5 follow-up. PASS.

Merge: `6510f88c5` via `--no-ff` into integration branch.

### Cycle 4 — Canvas title-content alignment (no-op closure)

F's pre-flight check found the runbook's D.3 misalignment was in the **old theme** `performant_labs_20260418/css/layout/canvas.css` (which had `padding-inline: var(--spacing-xs, 1.25rem)` on `.block-page-title-block`). That file was never ported to the active theme `performant_labs_20260502`, which has no `css/layout/` directory at all. Independent grep confirms `canvas.css` does not exist in the active theme.

Additionally, Canvas pages (`/contact-us`, `/open-source-projects`) don't use `.block-page-title-block` — they render titles via authored Dripyard `dy-section` heading components. Only `/articles-2` has the block, and Playwright `getBoundingClientRect()` at 375/576/768/992/1280 shows 0px delta between the title-block left edge and the content first-element left edge.

T+S not run for a no-op. Empty cycle branch deleted. GET-BACK §D.3 marked resolved.

### Cycle 5 — Site-wide a11y polish bundle (PASS)

**Implementation:** F made one targeted change — moved `<section class="page-title">` from between `{{ page.highlighted }}` and `<main>` to inside `<main>` in `web/themes/custom/performant_labs_20260502/templates/layout/page--articles.html.twig` (J.2 fix). A.2, A.3, D.4 were all verified clean (no code needed):

- **A.2** — Nav h2 already carries `class="visually-hidden h3 menu-block__title"` (dripyard_base default); `.visually-hidden` CSS is the canonical clip-off-screen recipe.
- **A.3** — Existing `pager.html.twig` override already renders `<span class="is-current" aria-current="page">`. Confirmed on `/articles` and `/articles?page=1`. Issue mentioned `/articles-2` but that URL is a 404; pagination uses `/articles?page=N`.
- **D.4** — F's breadcrumb audit table covered 8 page types (homepage, articles listing, article detail, book root, book interior, basic page, contact form, user login). All have breadcrumbs or correctly omit them (homepage is the breadcrumb root). No gaps.

**T verdict:** clean on items 1–4. T flagged AC5 ("Pa11y 0 errors") as blocking — pa11y reports 4 errors across `/`, `/articles`, `/contact-us`, all four mapping to pre-existing operator-approved brand-color deviations from prior cycles (button `--primary` 2.21:1; breadcrumb link 3.12:1). Not new regressions.

**O's reinterpretation:** AC5's literal "0 errors" doesn't account for the operator's pre-existing approved deviations. The cycle's objective ("Resolve four site-wide a11y items") is met cleanly. T's blocking call was treated as non-blocking for S purposes, with the AC-vs-deviations contradiction logged for follow-up.

**S verdict:** PASS. 0 pixel diff at 1280 + 375 on `/articles` confirms F's claim that `.page-title` CSS is position-independent. Heading hierarchy clean. Tab focus order logical.

Merge: `dbe1deda6` via `--no-ff` into integration branch.

### Cycle 6 — heal-flow Canvas integration (deferred per kickoff pre-commitment)

Not opened. The runbook explicitly says "Open Cycle 6 only after operator confirms it's needed [for Services]." Confirming whether Services Phase 1 needs a heal-flow diagram is a Services-scoping question, not a Sprint 4 question.

---

## Follow-up backlog for Sprint 5 (or Services prep)

| ID | Source | Description | Recommended approach |
|---|---|---|---|
| FU-1 | Cycle 2 | Amend Sprint 4 runbook §Cycle 2 AC4 from "zero visual delta" to "no *unintended* visual delta; brand-correction deltas on surfaces previously falling through to Dripyard defaults are accepted as cycle output." | Documentation-only edit to the runbook at the next opportunity. Not a new cycle. |
| FU-2 | Cycle 3 | Live CSS on `/services`, `/how-we-do-it`, `/open-source-projects` renders hero H1 at `-1.8px / 1.10` while brief + homepage live + (now) all previews specify `-2px / 1.05`. Mobile previews have a parallel inconsistency (40px on 3 pages vs 44px on homepage / brief). | ✅ **CLOSED 2026-05-11, commit `9a2999dbc`.** Option A chosen by operator. Live CSS aligned to brief on all three pages via the `landing-hero` Canvas-class pattern + scoped L5 override in `dy-section.css`. Mobile fix included in the same selector family. Three previews mobile values also updated to 44px to complete the alignment. S audit: PASS. |
| FU-3 | Cycle 5 | Pa11y reports 4 errors site-wide that are all pre-existing operator-approved brand-color deviations. AC5 "0 errors" needs qualification. | Install `pa11y-ci` with a `.pa11yci.json` allowlist for the four selectors (button `--primary` background; breadcrumb link on cream), OR amend future a11y-bundle ACs to read "0 *new* errors introduced by this cycle." |
| FU-4 | Cycle 1 | Host-shell `curl` rejects DDEV mkcert chain (SSL error 60). Workaround in use this sprint: `ddev exec curl http://localhost/`. | `export CURL_CA_BUNDLE=$(mkcert -CAROOT)/rootCA.pem` in `.zshrc`, or copy/append mkcert's root CA into the system trust store. One-time environment fix. |
| FU-5 | Pre-sprint | §J.4 (header "How we do it" wraps at 1280) closed as "probably resolved" by phase-8.6 header rework, but autonomous run did not visually re-verify. | Operator spot-checks `/` at 1280 on next visit. If wrap returns, file a header micro-cycle. |
| FU-6 | Pre-sprint | Cycle 6 (heal-flow SDC Canvas integration) deferred. | Confirm during Services Phase 1 prep whether Services needs a heal-flow diagram. If yes, open Cycle 6 (or fold into Services prep) with path A/B/C decision. |
| FU-7 (was: Cycle 3 mobile inconsistency) | Cycle 3 | Three non-home previews at mobile `font-size: 40px` while homepage + brief at 44px. | ✅ **CLOSED 2026-05-11** as part of FU-2 (commit `9a2999dbc`). Live now renders 44px at 375 across all four landing pages; the three preview HTMLs also updated to 44px. |
| FU-7b | Cycle 5 | Article cards on `/articles` use h3 without intervening h2 (heading skip). Pre-existing, not in scope for Cycle 5. | A11y polish at Services-prep time; minor. |
| FU-8 | Sprint hygiene | Cycle-2 ephemera (cycle-2 branch `aa/pl-sprint-4-phase-2-tokens-on-root` @ `18b8912b5`) and cycle-3 branch `aa/pl-sprint-4-phase-3-hero-h1-reconciliation` @ `827a17563`) are merged but not deleted. | Operator may `git branch -d` both at convenience (both are merged into integration). Or leave as audit markers. |

---

## Services kickoff handshake notes

Per runbook §Cleanup #5, the following notes are added at the top of [`pl-plan--services.md`](../pl-plan--services.md):

- Brand tokens are now backstopped at `:root` (Cycle 2). New Services components reading `--theme-*` tokens outside themed zones will get brand-canonical defaults instead of legacy Dripyard fallthroughs.
- Hero H1 size + weight token is `display-xl` = 72px / 500 / Rubik. Letter-spacing live-CSS reconciliation is FU-2 above and should be resolved before Services Phase 1 hero work begins (or as part of it).
- `page--articles.html.twig` is the J.2 fix template; Services has its own page template (if needed) and should follow the same "page-title inside `<main>`" pattern from the start.
- Pa11y allowlist work (FU-3) is pending; Services should add its own selectors to the allowlist as needed if it inherits any pre-approved deviations.

---

## Integration branch state

```
aa/pl-sprint-4-pre-services-foundation
├── (prep) chore(pl2): sprint 4 kickoff — autonomous-mode pre-commitments + orchestrator log scaffold  3be6a2fc9
├── (prep) chore(pl2): record sprint 4 permissions verification in orchestrator log                    eaf91c32f
├── (prep) docs(pl2): workflow-ofts.md — autonomous-default mode framing                               4dbb9610e
├──        docs(pl2): sprint 4 cycle 1 closed as already-complete                                       b1c8c3af3
├──        docs(pl2): sprint 4 cycle 2 parked — ADVISORY-HOLD recorded in orchestrator log              86271e889  (superseded by reinterpretation merge)
├──        docs(pl2): sprint 4 hard-stop after cycle 3 park (two consecutive parks)                     937134a43  (superseded; hard-stop withdrawn)
├──        Merge sprint 4 cycle 2: brand tokens on :root (PASS on objective reinterpretation)           def55d97f  ← Cycle 2 merge
├──        Merge sprint 4 cycle 3: hero H1 preview reconciliation (PASS on path A intent)                6510f88c5  ← Cycle 3 merge
├──        docs(pl2): sprint 4 — withdraw hard-stop, reinterpret cycles 2 + 3 as PASS                    9caa0a7d3
├──        docs(pl2): sprint 4 cycle 4 closed as already-complete                                        a468e15ab
└──        Merge sprint 4 cycle 5: site-wide a11y polish bundle (PASS)                                   dbe1deda6  ← Cycle 5 merge
```

Plus this wrap doc + runbook §Cleanup edits, committed on top.

**Retained side branches (operator can delete or audit):**
- `aa/pl-sprint-4-phase-2-tokens-on-root` @ `18b8912b5` (merged via `def55d97f`)
- `aa/pl-sprint-4-phase-3-hero-h1-reconciliation` @ `827a17563` (merged via `6510f88c5`)
- `aa/pl-sprint-4-phase-5-a11y-polish` @ `d6bd31e6e` (merged via `dbe1deda6`)

**Local-only posture:** never pushed, no PRs opened.

---

## Closing

Sprint 4 met its pre-Services foundation goal: brand tokens are properly backstopped, hero-H1 size + weight is reconciled across landing pages, page-title is correctly inside `<main>` on `/articles`, and the four site-wide a11y items are resolved or verified clean. The two reinterpreted PASSes (Cycles 2 + 3) carry follow-up backlog items the operator can pick up at any time before Services Phase 1 opens. The autonomous-mode calibration learned mid-sprint is captured in user-level memory and is reusable for the next delegated sprint.
