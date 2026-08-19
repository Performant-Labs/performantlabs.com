# `/open-source-projects` Page Overhaul — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Visual reference:** [`Previews/open-source-projects.html`](Previews/open-source-projects.html) (committed `7cff83297`, S-approved)
> **Live (current state):** `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects`

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` (already shipped on homepage / services / how-we-do-it / articles) |
| Canvas entity | `canvas_page` id=`5`, uuid `199d9f62-962c-44fc-bbb6-6bc3796c43b0`, path alias `/open-source-projects` |
| Strategy | **Patch in place** — same entity, same UUID, same URL. No `/open-source-projects-v2` parallel. |
| Branch | `aa/pl-open-source-projects` (one branch, ~3 commits, single `--no-ff` merge to local `main` at the end) |
| GitHub issues | Skipped — issue bodies live as `docs/pl2/handoffs/cycle-N-oss-issue.md` |
| **Status** | ⬜ Not started. Preview F2 (commit `7cff83297`) is the design target. |

---

## Source-of-truth visual delta

The S2 audit on commit `7cff83297` returned APPROVE for the static preview. A subsequent 3-tier comparison against the rendered Canvas page (T1 PASS / T2 + T3 large delta) showed the live page does not match the preview. This runbook closes that gap.

Anchored deltas (full inventory in operator's 3-tier comparison message, 2026-05-07):

1. **Hero is missing entirely** on live. Page renders breadcrumb → straight into the lede `dripyard_base:text` block. No kicker, no h1.
2. **Section heads are missing** on live. The "testing tools" and "community contributions" groupings are not labeled at all — cards just stack.
3. **Cards render horizontal (image-left, body-right) and full-width** on live. Each project sits in its own `dripyard_base:section` containing one `card-canvas`. The preview specifies **two 3-up vertical-card grids**.
4. **Decorative cream bands** sit between cards on live. These are the empty `theme--light` sections that previously held the section header. Should be removed once cards are placed in grids.
5. **"Other modules" h2 is left-aligned and ends with a period** on live. Preview specifies centered section-head with no terminal period.
6. **Closing CTA is teal** (`theme--primary`) on live. Brief locks closing CTAs to **espresso** (`theme--dark`); preview F2 made the swap. Live CTA also lays out h2-left + button-right with a circle-arrow icon; preview specifies centered kicker + centered h2 + centered ghost-on-dark button.

Header and footer chrome on live already match the preview. No work needed there.

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| R1 | **No new SDC.** The existing `dripyard_base:card-canvas` renders horizontal at >600px container width and vertical at ≤600px (container query in `card.css` line 41). Wrapping three cards in a `dripyard_base:grid-wrapper` 3-col will yield vertical cards automatically — no theme work needed for layout direction. | `card.css:35–53` confirmed |
| R2 | **Patch in place.** Work directly on `canvas_page` id=5. Do not create a parallel page. | this runbook |
| R3 | **Preserve `component_version`** in any Canvas patch script — do NOT set to NULL (Canvas throws `OutOfRangeException`; corrected 2026-05-12 per Sprint 10 cycle 2a). | OFTS |
| R4 | **Stale duplicate `/open-source-projects-0`** (basic page, node id=5 — confusingly the same numeric id but a different entity type) is pruned in Cycle 1. Per `pl-plan--pages.md` line 50, the `-0` suffix marks a stale duplicate alias. | `pl-plan--pages.md` |
| R5 | **Logos for ATK / Testor / CTRFHub stay as the migration placeholder** (`/sites/default/files/migration/open-source-projects/pl-placeholder-logo.png`) until the operator supplies brand-correct artwork. Real logos for DQI / Campaign Kit / Layout Builder Kit (already on disk) are used as-is. No brand-asset cycle here — drop new logos in via media replace once supplied. | operator instruction (2026-05-06) |
| R6 | **Closing CTA copy + intent param** mirror the preview verbatim: h2 "Found a bug or want to contribute?", button "Drop us a line" → `/contact-us?intent=oss`, with kicker "Contribute" above. | `Previews/open-source-projects.html` |
| R7 | **Card project-link copy** mirrors the preview verbatim: "Read the docs →" for ATK, Testor, DQI, Campaign Kit, Layout Builder Kit, Payment Stripe (and "Read the build notes →" for CTRFHub specifically). Card hrefs match the preview. | `Previews/open-source-projects.html` |
| R8 | **Branch + push policy.** Local-only. `aa/pl-open-source-projects` merges to local `main` with `--no-ff`. No push to `origin`. No PR. | `project_local_only_main.md` |

---

## Cycle plan

Three cycles total, one branch (`aa/pl-open-source-projects`), one commit per cycle. Approval Checkpoint between every cycle (explicit "approved" required before opening the next).

### Cycle 1 — Canvas restructure (content-only, no CSS)

**Pipeline:** O → F → T → S → O

**Objective:** Restructure `canvas_page` id=5 so the rendered page matches the preview's section sequence and component vocabulary. No theme/CSS work in this cycle. Use existing components only (`dripyard_base:section`, `dripyard_base:grid-wrapper`, `dripyard_base:card-canvas`, `dripyard_base:heading`, `dripyard_base:text`, `dripyard_base:title-cta`, the bespoke `kicker` SDC).

**Scope:**

1. **Hero** — add a new `dripyard_base:section` (theme: white) at the top with:
   - `kicker` SDC, variant centered, text "Open source"
   - `dripyard_base:heading` h1 "What we maintain in the open"
   - `dripyard_base:text` lede paragraph (verbatim from preview, with the `aangel` link)
2. **Testing tools section** — replace ATK + Testor + CTRFHub's three full-width single-card sections with one `dripyard_base:section` (theme: light / cream) containing:
   - `dripyard_base:heading` h2 "Our testing tools" (with kicker "Testing tools" above)
   - `dripyard_base:grid-wrapper` (3-col) wrapping the three existing `card-canvas` blocks for ATK / Testor / CTRFHub
   - Card hrefs and copy unchanged from current Canvas content (already verbatim-aligned with the preview)
3. **Community contributions section** — replace DQI + Campaign Kit + LBK's three full-width single-card sections with one `dripyard_base:section` (theme: white) containing:
   - `dripyard_base:heading` h2 "Community contributions" (with kicker "Community" above)
   - `dripyard_base:grid-wrapper` (3-col) wrapping the three existing `card-canvas` blocks for DQI / Campaign Kit / Layout Builder Kit
4. **"Other modules" section** — patch the existing `Other modules we maintain.` section to drop the trailing period; the single Payment Stripe card stays.
5. **Closing CTA** — patch the existing `dripyard_base:title-cta` section: change theme from `primary` (teal) to `dark` (espresso), add a centered `kicker` "Contribute" above the h2, change button from current treatment to the existing `button--ghost-on-dark` variant (already used on homepage + services closing CTAs). Copy stays "Found a bug or want to contribute?" + "Drop us a line" → `/contact-us?intent=oss`.
6. **Prune `/open-source-projects-0`** (R4) — delete the stale basic-page node id=5 (the basic page, not the canvas page) and remove its path alias. Verify no internal links target `/open-source-projects-0` before removal.

**Acceptance criteria:**

- [ ] `/open-source-projects` returns 200 and renders the 5 sections in order: Hero / Testing tools / Community contributions / Other modules / Closing CTA
- [ ] Hero displays kicker + h1 + lede paragraph; the `aangel` drupal.org profile link is present
- [ ] Testing tools section: 3 cards render side-by-side at desktop (3-up grid); cards are vertical (image-on-top) — confirm via DOM that each `card__layout` carries the column flex orientation, not the >600px grid layout
- [ ] Community contributions section: same — 3 cards in 3-up vertical grid
- [ ] Section h2s render with `kicker` above; both h2 strings have no terminal period
- [ ] "Other modules we maintain" h2 has no terminal period
- [ ] Closing CTA section uses `theme--dark` (espresso); button is ghost-on-dark, no teal background
- [ ] No empty cream "spacer" sections remaining between content sections
- [ ] `/open-source-projects-0` returns 404 (alias + node both removed)
- [ ] T1 (HTTP 200, content grep for required strings) + T2 (heading hierarchy h1→h2→h3, ARIA, semantic structure) pass
- [ ] All Canvas patches preserve `component_version` (do NOT set to NULL; R3)
- [ ] No theme files modified (CSS-free cycle)
- [ ] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/cycle-1-oss-{F,T,S}.md`

**Commit message:** `feat(open-source-projects): restructure Canvas to match preview`

---

### Cycle 2 — CSS punch list

**Pipeline:** O → F → T → S → O

**Objective:** Resolve any visual deltas between the Cycle-1 rendered page and the preview that S surfaces in its Cycle-1 audit. The Cycle-1 S handoff is the precise scope. CSS-only — no further Canvas content edits.

**Anticipated scope** (refined by Cycle 1's S audit before this cycle opens):

- **Card chrome** — preview specifies hairline border + no shadow on cream and white surfaces; the existing dripyard `card` may render with a different default treatment. If S flags a delta, override at L5 in `web/themes/custom/performant_labs_20260502/components/card-canvas/card-canvas.css` (the override file already exists from earlier cycles).
- **Card padding** — preview uses 48px card padding; if dripyard ships 32px, raise via L5 token.
- **"Read the docs / build notes" link styling** — preview renders these as text links with arrow glyph (`→`) inside the card. `card-canvas` ships with an `arrow-top-right.svg` corner glyph as a separate pattern; if the renderer uses that instead of an inline link with arrow, decide whether to (a) accept the corner glyph or (b) add a card-link override that matches the preview.
- **Closing CTA layout** — preview centers kicker + h2 + button. The `title-cta` SDC may default to a different alignment on `theme--dark`; if so, override at L5 in `title-cta.css`.
- **Other modules surface** — preview shows a small chip-style card (smaller padding, smaller h3) rather than the full project-card treatment; consider adding a `card-canvas` size variant or a wrapper class to differentiate.
- **No `!important`.** Specificity escapes use `[class]` attribute selectors, consistent with prior cycles.

**Acceptance criteria:**

- [ ] Every CRITICAL and MAJOR finding in `cycle-1-oss-S.md` resolved at the correct CSS layer (Cascade Layers 3/5 per `pl-plan--css-strategy.md`)
- [ ] Tier 3 visual at 1280px desktop and 375px mobile shows zero CRITICAL and zero MAJOR deltas vs `Previews/open-source-projects.html`
- [ ] WCAG 2.1 AA contrast unchanged or improved across the page; espresso closing-CTA contrast (cream-on-espresso 15.30:1, kicker accent on espresso 5.45:1, ghost border 3.56:1) confirmed by S
- [ ] Pa11y on `/open-source-projects` returns 0 errors
- [ ] No regression on `/`, `/services`, `/how-we-do-it`, `/articles` (spot-check at least these four to catch shared-CSS leaks; Cycle 2 may touch `card.css`, `card-canvas.css`, or `title-cta.css` which are page-shared)
- [ ] Files staged by explicit path

**Handoff doc location:** `docs/pl2/handoffs/cycle-2-oss-{F,T,S}.md`

**Commit message:** `feat(open-source-projects): css punch list — cards, closing-cta, other-modules`

---

### Cycle 3 — Cross-section verification + WCAG

**Pipeline:** O → T → S → O *(no F — pure verification)*

**Objective:** Whole-page integration audit. Confirm the page reads as a sibling to `/services`, `/how-we-do-it`, `/articles`, `/`. Catch issues that only surface when all sections render together with all CSS applied.

**Scope:**

- T1 + T2 fresh sweep on `/open-source-projects` (HTTP, content, heading hierarchy, ARIA, focus order, internal-link integrity)
- T1 + T2 spot-check on `/`, `/services`, `/how-we-do-it`, `/articles` to confirm no shared-CSS regressions
- T3 visual audit at 1280px desktop + 375px mobile, full-page screenshots compared section-by-section against `Previews/open-source-projects.html`
- WCAG 2.1 AA: keyboard nav full-page, focus rings on every theme zone (white / cream / espresso), forced-colors mode, reduced-motion, 200% zoom, image alt text, mobile touch targets ≥ 44×44 CSS px
- Pa11y on `/open-source-projects` — expect 0 errors
- Confirm placeholder-logo cards (ATK / Testor / CTRFHub) carry alt text appropriate for "real logo not yet supplied" — likely empty alt or "Performant Labs" generic, not a fake project mark

**Acceptance criteria:**

- [ ] T1 + T2 PASS for `/open-source-projects`, `/`, `/services`, `/how-we-do-it`, `/articles`
- [ ] Tier 3 visual: every section MATCH or DELTA-with-justification vs preview
- [ ] WCAG 2.1 AA: every row of S's audit table PASS
- [ ] Pa11y on `/open-source-projects`: 0 errors
- [ ] Keyboard flow lands on every interactive element in logical reading order with visible focus ring
- [ ] All CTAs route correctly (no 404)
- [ ] Mobile 375px: no page-level horizontal scroll; 3-up grids collapse to 1-up cleanly

**Handoff doc location:** `docs/pl2/handoffs/cycle-3-oss-{T,S}.md`

**Commit message:** `chore(open-source-projects): cross-section verification + WCAG audit`

(If Cycle 3's S verdict is REWORK, the rework opens a new mini-cycle with F. The verification commit lands only after S returns PASS.)

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator reviews `/open-source-projects` live in browser. Explicit "approved" required to open Cycle 2. |
| Cycle 2 commit | Operator reviews live + mobile. Explicit "approved" required to open Cycle 3. |
| Cycle 3 commit | Operator reviews S handoff. Explicit "approved" required to merge `aa/pl-open-source-projects` to `main`. |

---

## Out of scope

- Real logo artwork for ATK / Testor / CTRFHub (R5 — operator supplies; drop in via media replace post-merge)
- New project SDCs — none needed (R1)
- `/contact-us?intent=oss` form-side handling — page emits the param; the form is free to ignore for now
- "Other modules" expansion beyond Payment Stripe — design accommodates 2–3 additional items via `auto-fill` grid; new entries are content additions, not a structural change
- Repointing prod `/open-source-projects` (the legacy LBK 3-card page on `performantlabs.com`) — local-only sprint per R8
- New theme tokens or color additions — all needed tokens already exist

---

## Rework loop

If S returns REWORK on any cycle:

1. O reads handoff-S, writes `docs/pl2/handoffs/cycle-N-oss-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `cycle-N-oss-F-rework.md`
3. T re-runs verification on changed files only, writes `cycle-N-oss-T-rework.md`
4. S re-audits, writes `cycle-N-oss-S-rework.md`
5. If S returns PASS → O commits with the cycle's commit message + rework note
6. If S returns REWORK on round 2 → O pauses and consults operator about whether acceptance criteria need revision

---

## Cleanup

After each cycle's commit lands, O deletes that cycle's handoff files (`cycle-N-oss-*.md`). Per OFTS workflow Step 5: handoffs are ephemeral coordination artifacts.

After Cycle 3 commits and `aa/pl-open-source-projects` merges to `main` (local, `--no-ff`, no push), the runbook stays — this file is permanent project documentation.
