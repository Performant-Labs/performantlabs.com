# `/about-us` Page Overhaul — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Visual reference:** [`Previews/about-us.html`](Previews/about-us.html) (preview written 2026-05-07, operator-approved)
> **Live (current state):** `https://pl-performantlabs.com.3.ddev.site:8493/about-us`

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` (already shipped on homepage / services / how-we-do-it / articles / open-source-projects) |
| Canvas entity | `canvas_page` id=`17`, uuid `e9578306-4047-4655-9949-03bf04d2ba4c`, path alias `/about-us` |
| Strategy | **Patch in place** — same entity, same UUID, same URL. No `/about-us-v2` parallel. |
| Branch | `aa/pl-about-us` (one branch, ~3 commits, single `--no-ff` merge to local `main` at the end) |
| GitHub issues | Skipped — issue bodies live as `docs/pl2/handoffs/cycle-N-about-us-issue.md` |
| **Status** | ✅ Cycle 1 committed (`3f26c6733`). ✅ Cycle 2 committed (`094c5b0a2`). ⚠ Course-corrected rebuild (`1c98d90ed` + `8d13f899a`). ✅ Preview rewrite (`25b8689a7`). ✅ Cycle 3 (verification) — S PASS after rework round 1 (`4a1a8695e`). Branch ready to merge. |

---

## Source-of-truth visual delta

The current Canvas page (`canvas_page` id=17) already carries the correct copy in all 5 sections — the deltas are structural and chrome-level, not editorial.

Anchored deltas (full inventory from preview vs. live Canvas dump, 2026-05-07):

1. **Kickers missing on every section.** The preview specifies a terracotta kicker eyebrow above each section's primary heading: "About" (hero), "Track record" (§B), "Open source" (§C), "Dogfood" (§D), "Get started" (§E). Live page has none — sections start with the heading.
2. **§C heading is welded.** Live h2 is the single string `"Open source: the tools we wrote."`. Preview splits this into kicker "Open source" + h2 "The tools we wrote."
3. **§C ATK + Testor body is one big text blob.** Live renders ATK and Testor as `<h3>` + `<p>` runs inside a single `dripyard_base:text` block. Preview specifies a 2-up `grid-wrapper` of two `card-canvas` (or equivalent card SDC) components — one per project, each with tag + h3 + italic lede + body + drupal.org/github URL link.
4. **§C bio block is undifferentiated.** Live "Who we are." h3 + bio text reads as a continuation of the OSS body. Preview separates it visually with a hairline rule above and tightens it as a distinct prose block.
5. **§B credentials list is plain.** Live renders the three drupal.org credentials as a default `<ul>` inside a `text` block. Preview styles them with terracotta tick-mark dashes (no bullet, 16px hairline at the left of each `<li>`).
6. **§D theme.** Live uses `theme: light`. Preview uses a slightly warmer surface (`--surface-warm: #F2EFED`). Acceptable to keep `theme--light` if the rendered cream is close enough — operator decides at S audit. No new token unless S flags.
7. **§E (closing CTA) is on `theme: white`.** Live closing CTA uses white surface with `color: loud` h2. Preview locks closing CTAs to **espresso** (`theme--dark`) per brand brief, matching homepage / services / how-we-do-it / open-source-projects. Buttons need to flip: primary stays primary; secondary becomes `button--ghost-on-dark`.
8. **§A (hero) subhead is plain.** Live wraps the hero subhead in `<em>` already. Preview confirms italic — likely no change needed, just verify after kicker insert.

Header, breadcrumb, and footer chrome on live already match the preview (shipped in earlier phases). No work needed there.

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| R1 | **No new SDC.** All needed components already exist: `kicker` (custom theme), `dripyard_base:section`, `dripyard_base:heading`, `dripyard_base:text`, `dripyard_base:button`, `dripyard_base:title-cta`, `dripyard_base:card-canvas`, `dripyard_base:grid-wrapper`. | `web/themes/{custom,contrib}/...` listing |
| R2 | **Patch in place.** Work directly on `canvas_page` id=17. Do not create a parallel page. | this runbook |
| R3 | **Preserve `component_version`** in any Canvas patch script — do NOT set to NULL (Canvas throws `OutOfRangeException`; corrected 2026-05-12 per Sprint 10 cycle 2a). | OFTS |
| R4 | **No stale `/about-us-0` alias** to prune (verified — only `/page/17 → /about-us` exists). | live DB query 2026-05-07 |
| R5 | **Hero copy stays verbatim.** H1 "Drupal testing, done by the people who wrote the tools." and italic subhead about ATK + Testor + dogfooding are unchanged. CTAs unchanged: "Book a testing review" → `/contact-us?intent=testing-review`, "See the site test itself" → `/how-we-built-this-site`. | `Previews/about-us.html` §Hero |
| R6 | **§C card chrome reuses `card-canvas`** (the same SDC the open-source-projects page uses for its 3-up grids). 2-up grid via `dripyard_base:grid-wrapper` with `columns: 2`. Card image slots stay empty for now (no logo art for this surface) — kept as text-only cards if `card-canvas` allows; otherwise fall through to the existing OSS `text` block as a fallback and revisit chrome in Cycle 2. | OSS runbook §Cycle 1; `card-canvas.component.yml` |
| R7 | **§E theme is `dark`** (espresso). Closing-CTA pattern locked across the site by brand brief. | `pl_brand_brief.md`; OSS Cycle 2 |
| R8 | **Branch + push policy.** Local-only. `aa/pl-about-us` merges to local `main` with `--no-ff`. No push to `origin`. No PR. | `project_local_only_main.md` |
| R9 | **Bio block "Who we are."** stays inside §C (not promoted to its own section), separated by a hairline rule above. Matches preview structure. | `Previews/about-us.html` §C |

---

## Cycle plan

Three cycles total, one branch (`aa/pl-about-us`), one commit per cycle. Approval Checkpoint between every cycle (explicit "approved" required before opening the next).

### Cycle 1 — Canvas restructure (content-only, no CSS)

**Pipeline:** O → F → T → S → O

**Objective:** Restructure `canvas_page` id=17 so the rendered page matches the preview's component vocabulary and section sequence. No theme/CSS work in this cycle. Use existing components only.

**Scope:**

1. **Hero** — prepend a `kicker` SDC (variant centered, text "About") above the existing h1.
2. **§B (drupal.org track record)** — prepend a `kicker` SDC (text "Track record") above the existing h2. Heading, body, and `<ul>` of credentials stay as-is at this cycle's surface.
3. **§C (open source: the tools we wrote)** — three sub-edits:
   - Replace the welded h2 `"Open source: the tools we wrote."` with kicker "Open source" + h2 `"The tools we wrote."`
   - Convert the ATK/Testor `text` blob into two `card-canvas` components inside a `dripyard_base:grid-wrapper` (2-up). Each card carries the per-project tag (`01 / Drupal module`, `02 / CLI companion`), title, italic lede, body paragraph, and the drupal.org / github URL link. Card image slot empty per R6.
   - Keep the "Other OSS we ship." paragraph and the "Who we are." h3 + bio as separate `text` / `heading` components in the same section, in that order. Bio block separation (the hairline above it) is CSS in Cycle 2 — this cycle just gets the components in the right order.
4. **§D (we test what we ship)** — prepend a `kicker` SDC (text "Dogfood") above the existing h2. Theme stays `light` for now; revisit at S audit.
5. **§E (closing CTA)** — three sub-edits:
   - Prepend a `kicker` SDC (text "Get started") above the existing h2.
   - Flip the section's `theme` prop from `white` to `dark` (espresso).
   - Switch the secondary button "See the testing menu" to the `ghost-on-dark` button variant. Primary button "Book a testing review" stays as-is.

**Acceptance criteria:**

- [ ] `/about-us` returns 200 and renders the 5 sections in order: Hero / Track record / Open source / Dogfood / Closing CTA
- [ ] Every section carries a kicker eyebrow with the strings from the preview ("About", "Track record", "Open source", "Dogfood", "Get started")
- [ ] §C has h2 `"The tools we wrote."` (no terminal period stripped — confirm preview has period; brief-style ones do); kicker "Open source" sits above
- [ ] §C ATK + Testor render as two side-by-side cards at desktop (2-up grid) using `dripyard_base:grid-wrapper` + `card-canvas`
- [ ] §C card copy verbatim from preview (tag, title, italic lede, body, link URL with `<strong>`-wrapped path)
- [ ] §C "Other OSS we ship." paragraph and "Who we are." h3 + bio remain as text/heading components below the cards, in that order
- [ ] §E section theme is `dark`; secondary button uses `ghost-on-dark` variant
- [ ] T1 (HTTP 200, content grep for required strings: each kicker text, each h2, the cards' link URLs, the closing-CTA copy) + T2 (heading hierarchy h1→h2→h3, ARIA, semantic structure, single h1 on the page) pass
- [ ] All Canvas patches preserve `component_version` (do NOT set to NULL; R3)
- [ ] No theme files modified (CSS-free cycle)
- [ ] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/cycle-1-about-us-{F,T,S}.md`

**Commit message:** `feat(about-us): restructure Canvas to match preview`

---

### Cycle 2 — CSS punch list

**Pipeline:** O → F → T → S → O

**Objective:** Resolve any visual deltas between the Cycle-1 rendered page and the preview that S surfaces in its Cycle-1 audit. The Cycle-1 S handoff is the precise scope. CSS-only — no further Canvas content edits.

**Anticipated scope** (refined by Cycle 1's S audit before this cycle opens):

- **§B credentials list** — preview styles each `<li>` with a 16px terracotta hairline at the left in lieu of a bullet. Likely L5 override scoped to the §B section (or a `.theme--light .text ul` selector if scoping at L3/L5 is cleaner). No `!important`.
- **§C card chrome** — preview specifies hairline border + no shadow on white surface; tag treatment uses mono-font + terracotta hairline; italic lede above body. Override at L5 in `card-canvas.css` (file already exists from earlier OSS cycles) if Dripyard defaults differ.
- **§C bio block separator** — hairline rule above "Who we are." h3 (top border on the `bio` block per preview). L5 override scoped to a wrapper class or to a section-internal `:nth-of-type` selector.
- **§D theme** — if S flags the live `theme--light` (cream) as too cold versus preview's warm cream, either accept (preview is reference, not pixel-locked) or add a section-local surface token. Default to accept unless S marks it CRITICAL.
- **§E closing CTA layout** — preview centers kicker + h2 + body + button-row. The `title-cta` SDC default may differ on `theme--dark`; if so, override at L5 in `title-cta.css` (file already exists).
- **Hero italic subhead** — preview has the subhead in italic. Confirm the live `<em>` wrapper produces italic at the rendered surface; if not, add it via the brief-described style prop or L5 scope.
- **No `!important`.** Specificity escapes use `[class]` attribute selectors, consistent with prior cycles.

**Acceptance criteria:**

- [ ] Every CRITICAL and MAJOR finding in `cycle-1-about-us-S.md` resolved at the correct CSS layer (Cascade Layers 3/5 per `pl-plan--css-strategy.md`)
- [ ] Tier 3 visual at 1280px desktop and 375px mobile shows zero CRITICAL and zero MAJOR deltas vs `Previews/about-us.html`
- [ ] WCAG 2.1 AA contrast confirmed by S — espresso closing-CTA contrast (cream-on-espresso, kicker accent on espresso, ghost border ≥ 3:1), terracotta accents on cream and white
- [ ] Pa11y on `/about-us` returns 0 errors
- [ ] No regression on `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects` (spot-check at least these five — Cycle 2 may touch `card-canvas.css` or `title-cta.css` which are page-shared)
- [ ] Files staged by explicit path

**Handoff doc location:** `docs/pl2/handoffs/cycle-2-about-us-{F,T,S}.md`

**Commit message:** `feat(about-us): css punch list — kickers, cards, bio separator, closing-cta`

---

### Cycle 3 — Cross-section verification + WCAG

**Pipeline:** O → T → S → O *(no F — pure verification)*

**Objective:** Whole-page integration audit. Confirm `/about-us` reads as a sibling to `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects`. Catch issues that only surface when all sections render together.

**Scope:**

- T1 + T2 fresh sweep on `/about-us` (HTTP, content, heading hierarchy, ARIA, focus order, internal-link integrity — every `/contact-us?intent=...`, `/how-we-built-this-site`, drupal.org, github links must resolve correctly)
- T1 + T2 spot-check on `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects` to confirm no shared-CSS regressions
- T3 visual audit at 1280px desktop + 375px mobile, full-page screenshots compared section-by-section against `Previews/about-us.html`
- WCAG 2.1 AA: keyboard nav full-page, focus rings on every theme zone (white / cream / espresso), forced-colors mode, reduced-motion, 200% zoom, image alt text (none expected — verify), mobile touch targets ≥ 44×44 CSS px
- Pa11y on `/about-us` — expect 0 errors

**Acceptance criteria:**

- [ ] T1 + T2 PASS for `/about-us`, `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects`
- [ ] Tier 3 visual: every section MATCH or DELTA-with-justification vs preview
- [ ] WCAG 2.1 AA: every row of S's audit table PASS
- [ ] Pa11y on `/about-us`: 0 errors
- [ ] Keyboard flow lands on every interactive element in logical reading order with visible focus ring
- [ ] All CTAs route correctly (no 404)
- [ ] Mobile 375px: no page-level horizontal scroll; 2-up card grid (§C) collapses to 1-up cleanly

**Handoff doc location:** `docs/pl2/handoffs/cycle-3-about-us-{T,S}.md`

**Commit message:** `chore(about-us): cross-section verification + WCAG audit`

(If Cycle 3's S verdict is REWORK, the rework opens a new mini-cycle with F. The verification commit lands only after S returns PASS.)

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator reviews `/about-us` live in browser. Explicit "approved" required to open Cycle 2. |
| Cycle 2 commit | Operator reviews live + mobile. Explicit "approved" required to open Cycle 3. |
| Cycle 3 commit | Operator reviews S handoff. Explicit "approved" required to merge `aa/pl-about-us` to `main`. |

---

## Out of scope

- Bio photo or team headshots (preview is text-only; can be added post-merge)
- New theme tokens or color additions — all needed tokens already exist
- `/contact-us?intent=testing-review` form-side handling — page emits the param; the form is free to ignore for now
- Repointing prod `/about-us` — local-only sprint per R8
- Rewriting hero or section copy — copy is locked (R5 + faithful rendering of existing Canvas content)

---

## Rework loop

If S returns REWORK on any cycle:

1. O reads handoff-S, writes `docs/pl2/handoffs/cycle-N-about-us-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `cycle-N-about-us-F-rework.md`
3. T re-runs verification on changed files only, writes `cycle-N-about-us-T-rework.md`
4. S re-audits, writes `cycle-N-about-us-S-rework.md`
5. If S returns PASS → O commits with the cycle's commit message + rework note
6. If S returns REWORK on round 2 → O pauses and consults operator about whether acceptance criteria need revision

---

## Cleanup

After each cycle's commit lands, O deletes that cycle's handoff files (`cycle-N-about-us-*.md`). Per OFTS workflow Step 5: handoffs are ephemeral coordination artifacts.

After Cycle 3 commits and `aa/pl-about-us` merges to `main` (local, `--no-ff`, no push), the runbook stays — this file is permanent project documentation.

---

## Course correction (2026-05-07)

After Cycle 2 the operator viewed the live page and reported "looks nothing like the preview." Honest post-mortem identified three failure modes:

1. **The preview was drawn in isolation.** `Previews/about-us.html` was designed without referencing the actually-shipped sibling page (`Previews/open-source-projects.html` + the live `/open-source-projects`). The preview specified left-aligned section heads in §B/§C/§D and a 2-up `card-canvas` grid — both at odds with the family pattern.

2. **Factual claim in R6 was wrong.** R6 stated `/open-source-projects` uses `card-canvas`. It does — but with `additional_classes: "grid-wrapper--3col"` on the grid-wrapper and no `grid-cell` wrappers. About-us imitated entity 18 (Documentation, NOT OSS — S confused entities 5 and 18 in the rework root cause), inserting `grid-cell` wrappers with `columns_large: 6`. Each cell ended up at ~688px, exceeding `card-canvas`'s 600px container query, forcing horizontal layout with body squeezed into half-width.

3. **The audit chain compared live-vs-preview, never live-vs-family.** S has no step that asks "does this read as a sibling to other shipped pages?" Faithful comparison to a flawed preview produces a false PASS.

**The corrected rebuild** (`scripts/about-us-corrected-rebuild.php`) supersedes the Cycle-1 + rework scripts and produces the right tree from scratch:

- §B/§C/§D kickers: `variant: inline` → `variant: centered`
- §B/§C/§D headings: add `center: true`
- §B/§C/§D/§E sections: `section_width: max-width` → `section_width: edge-to-edge`
- §C grid-wrapper: add `additional_classes: "grid-wrapper--3col"`
- §C: `grid-cell` wrappers REMOVED — `card-canvas` placed directly in `grid_cells` slot (mirrors OSS)
- §C cards: `eyebrow_text` REMOVED (OSS doesn't use them)
- §C card body lede: `<em>` → `<strong>` (OSS convention)
- §C: third card "Other tools we maintain" added linking to `/open-source-projects` (replaces the standalone "Other OSS we ship" text block, which is removed)
- §A hero kicker: moved from `content` to `header` slot (cosmetic, mirrors OSS hero structure)

**The Cycle-1 + rework scripts remain in the repo as historical record** of the work that produced the broken intermediate state. `scripts/about-us-corrected-rebuild.php` is the canonical rebuild from this point forward.

**Carried into the next round:**
- Rewrite `Previews/about-us.html` to reflect the corrected gestalt (centered everything, edge-to-edge sections, 3-up vertical card grid). Anchor against `Previews/open-source-projects.html` from the start.
- Cycle 3 verification re-scoped to compare against both the rewritten preview AND the live `/open-source-projects` (sibling-fit check).
- Future per-page runbooks should include a "sibling fit" step before the preview lock-in.
