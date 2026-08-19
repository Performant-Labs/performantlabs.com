# `/services` Page Overhaul — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Content brief:** [`Existing Pages/Design1/services.md`](Existing%20Pages/Design1/services.md) — locked v1, all D1–D10 resolved
> **Engagement-card copy:** [`Existing Pages/Target1/services--engagement-cards.md`](Existing%20Pages/Target1/services--engagement-cards.md)
> **Visual reference:** [`Previews/services.html`](Previews/services.html)
> **Pre-Services baseline complete 2026-05-11** via Sprint 4 + FU-2 follow-up. Sprint 4 ([runbook](pl-plan--sprint-4-pre-services-foundation.md), [wrap doc](handoffs/sprint-4-wrap.md)): brand tokens on `:root` (cycle 2, commit `def55d97f`); landing-hero previews + brief reconciled at 72px / 500 desktop and 44px / 500 mobile (cycle 3, commit `6510f88c5`); page-title inside `<main>` on `/articles` (cycle 5, commit `dbe1deda6`); nav h2 / pager aria-current / cross-page breadcrumbs verified clean (cycle 5). **FU-2 (commit `9a2999dbc`):** live CSS on `/services` + `/how-we-do-it` + `/open-source-projects` now matches the brief end-to-end at `72/500/1.05/-2px` desktop + `44/500/1.05/-1px` mobile via the `landing-hero` Canvas-class pattern + scoped L5 override in `dy-section.css`. Services Phase 1 inherits a clean baseline.

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` (already shipped on homepage cycle) |
| Canvas entity | `canvas_page` id=3, uuid `b2613e35-516b-4d7c-86b8-75eb8a5d5356`, alias `/services` |
| Strategy | **Patch in place** — same entity, same UUID, same URL. No `/services-v2` parallel. |
| Branch | `aa/pl-services` (one branch, 3 commits, single merge to `main` at the end) |
| GitHub issues | Skipped — issue bodies live as `docs/pl2/handoffs/cycle-N-services-issue.md` |
| **Status** | ✅ **Complete (2026-05-05).** All 4 cycles shipped: 1 (`66c20bdd6`) → 1.5 (`15db8d94f`) → 2 (`a76a8bf80`) → 3 (verification, no commit). S verdict on Cycle 3: PASS. Branch ready to merge to `main`. |

---

## Final advisory carry-forward (post-Cycle 3)

These items are deliberately deferred from this overhaul. Each has its accepted home for follow-on:

| ID | Item | Disposition |
|---|---|---|
| ADV-S1 / R8 | Mobile 375px horizontal overflow on hero (site-wide WCAG 1.4.10) | Branch `aa/pl-mobile-hero-overflow` (high-priority cycle-debt) |
| ADV-S5 | Pre-existing primary-button contrast (`#FFFFFF` on `#62bbcb` ≈ 2.21:1) — site-wide button component | Future button-token revision (cycle-debt) |
| F.8 | Footer Services sub-list anchor `#testing-suite-takeover` is broken (card ID is `#test-suite-takeover`) | Footer-sweep cycle |
| F.9 | Footer "Contact us" link uses bare `/contact` (resolves via 301 to `/contact-us`) | Footer-sweep cycle / contact-us site-wide sweep |
| ADV-3 (C2) | DOM-shape-sniffing CSS selectors in `dy-section.css` (`:not(:has(.grid-wrapper))`, `:has(> .button + .button)`) — work but fragile | Future maintenance: replace with class-based markers (`dy-section--centered`, `dy-section--has-cta-pair`) |
| ADV-C1 (C3) | `/form/contact` returns 404 site-wide — affects global nav "Contact us" link, header "Call today" CTA, footer "Get in touch" CTA | Separate sweep: wire up contact webform routes site-wide (the `/services` page CTAs are unaffected; they all use `/contact-us` which works) |
| ADV-CU1 (C3) | `/contact-us` page has no H1 | Webform page; small content fix |
| Hero image | `thinker_1600.png` retired in Cycle 1; Drupal-specific replacement deferred | Task #59 follow-on |
| Anthropic + OpenAI logos | Currently Simple Icons CC0 monochrome PNGs (brand-faithful primary marks) | Acceptable as ship state; replace if design wants full-color uniform treatment for all 8 logos |

---

## Locked decisions (from `Design1/services.md` + this runbook)

| ID | Decision | Source |
|---|---|---|
| D1–D10 | Section count, hero copy, sub-card retirement, nearshore framing, dogfooding pointer, intent-param deferral, length, tone-check, hero-image retirement | `Design1/services.md` |
| R1 | **Footer Services sub-list** — *defer.* Keep the homepage-cycle footer untouched in this overhaul. | this runbook |
| R2 | **Logo trust bar §5** — tech-stack logos: Drupal, Playwright, Cypress, PHP, JavaScript, React, **plus Anthropic and OpenAI** (8 logos total). Overrides `Design1/services.md` §5 client-logo retention. | this runbook |
| R3 | **CTA targets** — every CTA links to `/contact-us?intent=…`. The current `/contact` route gets aliased/renamed to `/contact-us` site-wide as part of Cycle 1. | this runbook |
| R4 | **Hero image** — text-only interim per D10. `thinker_1600.png` retired this cycle. Drupal-specific replacement is task #59 follow-on, out of scope. | `Design1/services.md` D10 |
| R5 | **Patch in place** — work directly on `canvas_page` id=3. No parallel `/services-v2`. | this runbook |
| R6 | **Preserve `component_version`** in any Canvas patch script — do NOT set to NULL (Canvas throws `OutOfRangeException`; corrected 2026-05-12 per Sprint 10 cycle 2a). | OFTS workflow |
| R7 | **Font canon = the previews.** All headings (h1–h6) use Rubik weight 500. Body copy uses Poppins weight 400. The M6 fix applied to the homepage (Poppins-800 H1 + Rubik body) is **reverted** site-wide as part of Cycle 2 — the homepage `/` will lose the heavy Poppins H1. `Previews/services.html` and `Previews/homepage.html` are the source of truth. | this runbook |
| R8 | **Mobile horizontal overflow on hero** (S advisory ADV-S1; WCAG 1.4.10 reflow failure) is **split off** to its own cycle-debt branch (`aa/pl-mobile-hero-overflow` — to be opened after this overhaul ships). Site-wide; predates `/services` work; out of scope here. | this runbook |
| R9 | **Brand assets for Anthropic + OpenAI logos** — F sources brand-official wordmark/logomark SVGs or high-resolution PNGs from the official brand pages and replaces the GD placeholder PNGs in Cycle 1.5. | this runbook |

---

## Cycle plan

Four cycles total (Cycle 1 already shipped + 1.5/2/3 remaining), one branch (`aa/pl-services`), one commit per cycle. Approval Checkpoint between every cycle (explicit "approved" required before opening the next).

### Cycle 1 — Canvas assembly + `/contact-us` route

**Pipeline:** O → F → T → S → O

**Objective:** Patch `canvas_page` id=3 in place to match the 6-section structure in `Design1/services.md`, using existing components only. No new CSS in this cycle. Also: rename `/contact` → `/contact-us` site-wide.

**Scope:**

- §1 Hero — patch `component_inputs` (H1, subhead, primary + secondary CTAs); retire `thinker_1600.png` (text-only)
- §2 Four engagement cards — patch the 4 existing cards' `title` and `body` per `Target1/services--engagement-cards.md` (locked copy); retire the 18-card sub-specialty section (`e014edc3-0694-4d76-9b61-772d35e613c0` and descendants per the brief)
- §3 Nearshore — add a new section with locked copy; reuse existing `title-cta` or `dy-section` shape
- §4 Dogfooding pointer — add a new section with locked copy
- §5 Logo trust bar — replace the 6 client logos with **8 tech-stack logos**: Drupal, Playwright, Cypress, PHP, JavaScript, React, Anthropic, OpenAI (R2). Source media entities (existing Drupal media or new uploads — F decides based on what's available)
- §6 Final CTA — patch the existing `title-cta` at uuid `509fc6e0-19f4-4339-b284-0c3d602a2fd8` to the new title, body, primary CTA (`Book a testing review` → `/contact-us?intent=testing-review`), and secondary ghost-on-dark (`Or start with the tools` → `/open-source-projects`)
- **`/contact-us` route** — change the path alias for the existing contact webform from `/contact` to `/contact-us`. Add a redirect from `/contact` → `/contact-us` so old links keep working. All CTAs on `/services` use `/contact-us?intent=…`.

**Acceptance criteria:**

- [ ] `/services` returns 200 and renders all 6 sections in the order specified
- [ ] Hero displays new H1, subhead, both CTAs; no `thinker_1600.png` rendered
- [ ] All 4 engagement cards show locked headings + bodies from `Target1/services--engagement-cards.md`
- [ ] Sub-specialty section (heading "What we do specifically") and its 18 cards no longer render
- [ ] Nearshore §3, dogfooding §4 sections render with locked copy
- [ ] Logo trust bar shows 8 tech-stack logos (Drupal, Playwright, Cypress, PHP, JavaScript, React, Anthropic, OpenAI)
- [ ] Final CTA shows new title, body, both buttons; primary links to `/contact-us?intent=testing-review`
- [ ] `/contact-us` returns 200 (was `/contact`); `/contact` redirects to `/contact-us` (301)
- [ ] All CTAs on `/services` link to `/contact-us?intent=…` (no bare `/contact`)
- [ ] T1 (HTTP 200, content grep) + T2 (heading hierarchy, ARIA, semantic structure) pass
- [ ] WCAG contrast computed for any new text-on-surface combinations
- [ ] All Canvas patches preserve `component_version` (do NOT set to NULL; R6)
- [ ] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/cycle-1-services-{F,T,S}.md`

**Commit message:** `feat(services): assemble 6-section page in place + /contact-us route`

✅ **Shipped in `66c20bdd6`.** S deep audit (`docs/pl2/handoffs/cycle-1-services-S-deep-audit.md`) catalogued 73 deltas vs the preview, of which six are content-only Canvas omissions resolved in Cycle 1.5 below.

---

### Cycle 1.5 — Content-only Canvas patches + brand-asset replacement

**Pipeline:** O → F → T → S → O

**Objective:** Resolve the six Canvas/content omissions from Cycle 1 that the deep audit surfaced, plus replace the Anthropic + OpenAI placeholder PNGs with brand-official assets. **CSS-free.** Sets the page up so Cycle 2's CSS work has clean content underneath it.

**Scope:**

1. §1 Hero — add `kicker--centered` "Engagements" component above the H1.
2. §2 Cards — add `kicker--centered` "Four ways we engage" section eyebrow above the H2.
3. §2 Cards — add the four `01 / TAKEOVER`, `02 / EMBED`, `03 / PILOT`, `04 / a11y` mono-font numeric eyebrows on each of the 4 engagement cards. (Use whichever Canvas/SDC mechanism the existing card schema supports for a numeric prefix; if none exists, F surfaces the question — may bleed into a tiny SDC update which is OK if scoped tightly.)
4. §4 Dogfooding — change kicker variant from `kicker--inline` (left-aligned) to `kicker--centered`.
5. §4 Dogfooding — change CTA button variant from `button--bare` to `button--secondary` ("See how we test this site" should render as a pill outline, not a bare link).
6. §6 Final CTA — change secondary CTA button variant from `button--bare` to `button--ghost-on-dark` ("Or start with the tools" should render as ghost-on-dark pill outline, not a bare teal link). If `button--ghost-on-dark` does not exist as a Canvas-selectable variant, F flags it for Cycle 2 (Cycle 2 will add it as a CSS variant + Canvas option).
7. §5 Logo bar — replace `anthropic-logo.png` and `openai-logo.png` with brand-official assets sourced from the official brand pages. F documents URLs sourced and license rationale in handoff.

**Acceptance criteria:**

- [ ] §1 Hero kicker "Engagements" renders above H1, centered, terracotta uppercase tracked
- [ ] §2 Section eyebrow "Four ways we engage" renders above the section H2, same kicker style as §1
- [ ] All 4 cards display their numeric eyebrow (01/TAKEOVER, 02/EMBED, 03/PILOT, 04/a11y) in the locked mono-font terracotta style — OR if Canvas can't carry the numeric prefix as content, F has flagged the SDC question and proposed a path (do not invent CSS in 1.5)
- [ ] §4 kicker is centered (not left-aligned)
- [ ] §4 CTA renders as pill-outline secondary button (not bare link)
- [ ] §6 secondary CTA renders as ghost-on-dark pill outline (or `button--ghost-on-dark` variant flagged as missing for Cycle 2)
- [ ] §5 Anthropic + OpenAI images replaced with brand-official assets, alt text "Anthropic" / "OpenAI"
- [ ] T1 + T2 still pass on `/services`; no regressions
- [ ] No CSS changes (zero theme files modified)
- [ ] All Canvas patches preserve `component_version` (do NOT set to NULL; R6)
- [ ] Files staged by explicit path

**Handoff doc location:** `docs/pl2/handoffs/cycle-1.5-services-{F,T,S}.md`

**Commit message:** `feat(services): content patches + brand-official tech logos`

---

### Cycle 2 — CSS punch list

**Pipeline:** O → F → T → S → O

**Objective:** Resolve every CSS delta in `cycle-1-services-S-deep-audit.md` that wasn't handled in Cycle 1.5. The audit is the precise scope.

**Scope (definitive — from the deep audit):**

- **Typography canon (R7) — site-wide token revert.** L3 base.css: set body `--font-sans` to Poppins, set `--h1-font-family` to Rubik, set `--h1-weight` to 500. Reverts the M6 fix from the homepage cycle. **Will affect the homepage `/` too** — verify after change that `/` still passes its prior S audit.
- **L3 typography sizes:** raise H2 to 40px desktop with `letter-spacing: -1px`; raise §6 closing-CTA H2 to 56px with `letter-spacing: -1.6px` and `line-height: 1.05` (likely a §6-specific class, not a global H2 token).
- **L5 hero.css:** wrap hero CTAs in a flex container (`display:flex; gap:12px; justify-content:center; flex-wrap:wrap`) so they render as a centered pill pair instead of stacked block buttons. Reduce hero padding to match preview.
- **L5 grid-wrapper.css:** make `.grid-wrapper--2col .grid-wrapper__grid { grid-template-columns: repeat(2, 1fr); }` actually apply at desktop. Currently mis-breakpointed or missing.
- **L5 card.css:** raise card padding from 32px to 48px; ensure card surface is white (`#FFFFFF`) on `/services` cards (or ratify the cream surface as a deliberate evolution and update the preview); add the numeric-eyebrow rule (mono-font, terracotta, with hairline before).
- **L5 nearshore + dogfooding section CSS:** center H2, body, and CTA within an 820px max-width container. Restore inline CTA-pill rendering (not block button).
- **L5 logo-grid.css:** single-row layout for 8 logos at 1280px (no orphan), baseline-aligned via `max-height: 40px; object-fit: contain`, top + bottom hairlines, vertical padding to match preview, and demote "We Speak" heading to 12px tracked uppercase label (not H2 default).
- **L5 title-cta.css:** center §6 H2 and wrap primary + secondary CTA in centered flex pair. Reduce body color to softer `--on-dark-muted` per preview.
- **L5 button.css:** verify `button--ghost-on-dark` variant exists; if not, add it (transparent bg, on-dark text, 40% opacity cream border). Verify `button--bare` and `button--secondary` look distinct in section context.
- **L5 footer.css:** render footer column headings as 12px tracked uppercase muted labels (not H3 default).

**Out of scope (per the audit's deferral list and runbook decisions):**

- Mobile horizontal overflow (R8 — split-off branch)
- Live brand-color logos vs preview gray text spans (live wins; preview is older placeholder)
- Hero secondary CTA `#005AA0` color (intentional AA improvement)
- Breadcrumb separator glyph
- Footer anchor `#testing-suite-takeover` and bare `/contact` href (R1 — footer-sweep cycle)
- Section vertical rhythm token (TOP-4 — revisit only if it looks wrong post-fixes)

**Acceptance criteria:**

- [ ] Every "must-do" item in the deep audit's §"Recommended Cycle 2 scope" landed at the correct CSS layer
- [ ] Step-3 layer trace presented to operator before any L3 token change (font canon especially — that change cascades)
- [ ] No `!important`
- [ ] Tier 1 + Tier 2 pass on `/services`
- [ ] Tier 3 visual at desktop (1280px) and mobile (375px) shows zero critical and zero major deltas vs `Previews/services.html` (minor deltas may remain and are documented)
- [ ] Homepage `/` still passes its prior S audit after the M6 typography revert
- [ ] WCAG contrast unchanged or improved across the page
- [ ] Files staged by explicit path

**Handoff doc location:** `docs/pl2/handoffs/cycle-2-services-{F,T,S}.md`

**Commit message:** `feat(services): css punch list — typography, grid, sections, logos, ctas`

---

### Cycle 3 — Cross-section verification + WCAG

**Pipeline:** O → T → S → O *(no F — pure verification, no new code)*

**Objective:** Whole-page integration audit. Catch issues that only show up when all 6 sections render together with all CSS applied — keyboard flow, mobile layout end-to-end, integrated WCAG 2.2 AA, visual delta against `Previews/services.html` head-to-toe.

**Scope:**

- T1+T2 fresh sweep on `/services` (HTTP, content, heading hierarchy, ARIA, semantic structure, focus order)
- T1+T2 spot-check on `/` (homepage) and one other page (`/articles`) to confirm no shared-CSS regressions
- T3 visual audit at 1280px desktop + 375px mobile, full-page screenshots compared section-by-section against `Previews/services.html`
- WCAG 2.2 AA: keyboard nav full-page, focus rings, forced-colors mode, reduced-motion, 200% zoom, image alt text, mobile touch targets ≥44×44 CSS px
- Pa11y on `/services` — expect 0 errors

**Acceptance criteria:**

- [ ] T1+T2 PASS for `/services`, `/`, `/articles`
- [ ] Tier 3 visual: every section MATCH or DELTA-with-justification against `Previews/services.html`
- [ ] WCAG 2.2 AA: every row of S's audit table PASS
- [ ] Pa11y on `/services`: 0 errors
- [ ] Keyboard flow lands on every interactive element in logical reading order with visible focus ring
- [ ] All CTAs route correctly (no 404, no bare `/contact`)
- [ ] Mobile 375px horizontal-scroll check is **noted but excluded** per R8 (split-off cycle-debt branch)

**Handoff doc location:** `docs/pl2/handoffs/cycle-3-services-{T,S}.md` (no F handoff — no F in this cycle)

**Commit message:** `chore(services): cross-section verification + WCAG audit`

(If Cycle 3's S verdict is REWORK, the rework opens a new mini-cycle with F. The verification commit lands only after S returns PASS.)

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator reviews `/services` live in browser. Explicit "approved" required to open Cycle 2. |
| Cycle 2 commit | Operator reviews `/services` live + mobile. Explicit "approved" required to open Cycle 3. |
| Cycle 3 commit | Operator reviews S handoff. Explicit "approved" required to merge `aa/pl-services` to `main`. |

---

## Out of scope

- Footer Services sub-list rewrite (R1 deferred)
- `/contact-us` form intent-handling — pages emit `?intent=…`; form is free to ignore for now
- Per-engagement standalone pages (`/services/test-suite-takeover` etc.)
- Hero image replacement (task #59)
- Pricing or rate cards
- Standalone `/nearshoring` page

---

## Rework loop

If S returns REWORK on any cycle:

1. O reads handoff-S, writes `docs/pl2/handoffs/cycle-N-services-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `cycle-N-services-F-rework.md`
3. T re-runs verification on changed files only, writes `cycle-N-services-T-rework.md`
4. S re-audits, writes `cycle-N-services-S-rework.md`
5. If S returns PASS → O commits with the cycle's commit message + rework note
6. If S returns REWORK on round 2 → O pauses and consults operator about whether acceptance criteria need revision

---

## Cleanup

After each cycle's commit lands, O deletes that cycle's handoff files (`cycle-N-services-*.md`). Per OFTS workflow Step 5: handoffs are ephemeral coordination artifacts.

After Cycle 3 commits and `aa/pl-services` merges to `main`, the runbook stays (this file is permanent project documentation).
