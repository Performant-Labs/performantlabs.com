# Handoff-S: Sprint 10 Cycle 1 — Architectural-debt audit (audit-only)

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-10-cycle-1-audit`
**Issue:** `docs/pl2/handoffs/cycle-1-architecture-audit-issue.md`
**Runbook:** `docs/pl2/pl-plan--sprint-10-architecture-cleanup.md`
**Mode:** autonomous, audit-only (no F, no T)
**Operator-facing report:** [`cycle-1-architecture-audit-report.html`](cycle-1-architecture-audit-report.html)
**Probe artifacts:** [`screenshots/sprint-10-cycle-1/`](screenshots/sprint-10-cycle-1/)

## T precondition
N/A — audit-only cycle, no T stage. Skipped per issue spec.

## Binding signal
Grep output + CSS file content + workflow-doc text. No pixel diffs (not required).

---

## Thread 1 — ADV-3 fragile-selector inventory

### 1.1 Headline numbers

| File | Fragile selector-lines | Distinct patterns | Marker-class already applied? |
|---|---:|---:|---|
| `dy-section.css` | 26 | 12 | Partial — 2 of 12 already migrated (`.dy-section--other-modules`, `.nearshore-section`). |
| `logo-grid.css` | 4 | 2 | No. |
| `header.css` | 2 | 1 fragile + 1 acceptable | No (small-surface, low risk). |
| `docs-page.css` | 1 | 1 | No (page-root scope, low risk). |
| `webform.css` | 1 | 1 | No (acceptable; webform-block class is stable). |
| `book-landing.css` | 5 | 1 | No (page-root scope, low risk). |
| `accordion.css` | 1 | 1 | No (adjacent-sibling within component; acceptable). |
| **Total** | **40** | **19** | — |

Excluded as not-fragile: `:where(:not([disabled]))` (button.css), `:not(.button)` anchor exclusions (article-full.css, footer.css), `:not(.is-expanded)` (header.css mobile-menu state — class-driven, not shape-driven).

### 1.2 dy-section.css — pattern-by-pattern

| # | Pattern | Lines | Current consumer pages/sections | Proposed marker class | Already done? |
|---|---|---|---|---|---|
| P1 | `.dy-section.theme--light:has(.kicker--centered)` | 49, 56, 63, 144, 462 | `/about-us` §B Track record (centered theme--light section with credentials UL). Originally Services §3 too — now theme--white. | `.dy-section--centered-light` (or reuse `.kicker--centered` is *itself* a Canvas class, but the selector compounds it with theme — extracting a single marker is cleaner) | No |
| P2 | `.dy-section.theme--white:has(.dy-section__header .kicker--centered)` | 74, 81, 145 | `/services` §3 Dogfooding / §3 Nearshore (theme--white centered). | `.dy-section--centered-white` | No |
| P3 | `.dy-section.theme--white:has(...kicker--centered):not(:has(.grid-wrapper))` | 86 | Same as P2 but **excluding** §2 cards. The `:not(:has(.grid-wrapper))` was a CRIT-1/2 firefighter (Sprint 3) to avoid collapsing the cards grid. | `.dy-section--centered-content` (positive marker only on sections that should center their content; no negative inference) | No |
| P4 | `.dy-section.theme--white .dy-section__content:has(> .button + .button)` | 103, 114, 120, 128, 135 | `/services` §1 hero (kicker + h1 + body + 2 buttons direct in content). | `.dy-section--cta-pair` (on the section, not the content) | No |
| P5 | `.dy-section:has(.kicker--inline) .dy-section__header.grid` + `.dy-section:has(.kicker--inline) .dy-section__header` | 195, 218 | `/how-we-do-it` Week 1 / Week 2 / Week 3+ (kicker--inline sections). | `.dy-section--kicker-inline` (or rely on the kicker child class as the section marker — but that requires the `:has` which is the very pattern we're removing). Recommend adding marker. | No |
| P6 | `.dy-section.theme--secondary + .dy-section .dy-section__header` (sibling combinator) | 219 | `/how-we-do-it` "What we don't do" (the theme--light section that follows the theme--secondary "Week 3+"). | `.dy-section--tight-header` on the affected section. | No |
| P7 | `.dy-section.theme--light:has(.kicker--centered) .dy-section__content .text ul` | 462 | `/about-us` §B Track record credentials UL. | Falls under P1's marker — no new marker. | No |
| P8 | `.dy-section.theme--dark .dy-section__content:has(> .button + .button)` | 565, 574, 580, 586, 592 | `/services` + `/about-us` closing CTA (Sprint 5 cycle 3). | `.dy-section--cta-pair` (same marker as P4 — `.theme--dark` already in selector). | No |
| P9 | `.dy-section.theme--white:has(.kicker--centered) .dy-section__content > .grid-wrapper + .heading.h3 (+ .text)` | 618, 626 | `/about-us` §C "Who we are." bio block. | `.dy-section--bio-block` on the section (preferred — keeps the structural `> .grid-wrapper + .heading.h3` sibling combinator harmless because it is then scoped to a single section that ships with that exact DOM). Alternative: add `.bio-block` to the trailing h3 component itself. | No |
| P10 | `.dy-section:has(.wordmark-strip-wrapper)` | 812, 817 | `/about-us` §A wordmark strip section. | `.dy-section--wordmark-strip` (or reuse `.wordmark-strip-wrapper` — but that's a child class, so :has is needed to reach the section). Add marker on the section itself. | No |
| P11 | `.dy-section--other-modules` | 303, 310, 315, 323, 328, 337, 341, 346, 353 | `/services` "Other modules" thin band. | **Already done** — M5 Cycle 2. Reference pattern. | **YES** ✓ |
| P12 | `.nearshore-section` | 932, 939 | `/services` §3 Nearshore. | **Already done** — Sprint 6 Cycle 3 (FU-S5-5). Reference pattern. | **YES** ✓ |

**Audit-before-fix verdict:** ADV-3 is **partially addressed**. Two precedents exist (`.dy-section--other-modules`, `.nearshore-section`) and both follow the same protocol: Canvas content edit adds `additional_classes: "<marker>"` to the affected section's row; CSS uses the marker as the L5 hook. **10 fragile patterns remain.** This is not a no-op.

### 1.3 Cross-file fragile patterns (non-dy-section)

| File | Selector | Consumer | Proposed marker | Risk note |
|---|---|---|---|---|
| `logo-grid.css:219` | `.dy-section:has(.logo-grid) .dy-section__header > *` | Any section containing a logo-grid (currently homepage hero-adjacent strip). | `.dy-section--logo-grid` on the parent section. | Low — single consumer. |
| `logo-grid.css:256, 260` | `.hero.theme--white + .dy-section:has(.logo-grid)` | Section that directly follows the homepage hero. Sibling-combinator: brittle to DOM reorder. | `.dy-section--post-hero-logos` on the affected section. | Low — currently homepage-only. |
| `header.css:108` | `.site-header .header-navigation-wrapper__third:not(:has(*))` | Empty third-CTA slot collapse. | Could replace with `:empty`, but `:not(:has(*))` is more robust (handles whitespace text nodes from Twig output). **Recommend leaving** — this is a defensive pattern, not a brittleness. | None — accept as-is. |
| `docs-page.css:55` | `body:has(.docs-page) .block-page-title-block` | Documentation pages (single entry). | Already class-scoped via `.docs-page`; the `:has` is page-root-style scoping which is the canonical Tailwind/Bootstrap pattern. **Recommend leaving** — page-root scoping with `:has` is idiomatic, not fragile. | None — accept as-is. |
| `webform.css:40` | `.dy-section__content:has(.block-webform-block)` | Webform-bearing sections. | Same pattern — using a child block class as a section marker. Acceptable; webform-block class is stable Drupal output. | None — accept. |
| `book-landing.css:19–53, 386` | `body:has(.book-landing) <selector>` | Book landing page root. | Same as docs-page — page-root scoping. Acceptable. | None — accept. |
| `accordion.css:28` | `.accordion-item:has(+ .accordion-item)` | Inter-item separator border on all-but-last accordion items. | Standard component-internal sibling pattern. Acceptable; not DOM-shape-sniffing in the brittle sense. | None — accept. |

**Cross-file scope reduction:** of 14 non-dy-section hit-lines, only 4 (in `logo-grid.css`) are genuinely fragile in the same sense as the dy-section offenders. The rest are page-root scoping or component-internal sibling — idiomatic uses of `:has`.

### 1.4 Refactor scope estimate

**dy-section.css carve (10 remaining patterns):**

| Pattern | Marker | Sections to touch (Canvas content edit) | Pages |
|---|---|---|---|
| P1 | `.dy-section--centered-light` | 1 section | `/about-us` |
| P2 | `.dy-section--centered-white` | 2 sections | `/services` |
| P3 | merge with P2's marker, drop `:not(:has(...))` | 0 extra | (same) |
| P4 | `.dy-section--cta-pair` | 1 section | `/services` |
| P5 | `.dy-section--kicker-inline` | 3 sections | `/how-we-do-it` |
| P6 | `.dy-section--tight-header` | 1 section | `/how-we-do-it` |
| P8 | `.dy-section--cta-pair` (same as P4) | 2 sections | `/services`, `/about-us` |
| P9 | `.dy-section--bio-block` | 1 section | `/about-us` |
| P10 | `.dy-section--wordmark-strip` | 1 section | `/about-us` |
| logo-grid P1+P2 | `.dy-section--logo-grid` + `.dy-section--post-hero-logos` | 1 section | `/` (homepage) |

**Files touched:** 1 CSS file (`dy-section.css`) + 1 CSS file (`logo-grid.css`) + 1 Canvas-patch script. CSS edits = ~12 selector-rewrites. Canvas content edits = ~13 section rows across 4 pages (`/`, `/services`, `/about-us`, `/how-we-do-it`).

**Shipped-state risk:** all 4 pages re-render. Visual-diff verification required (1280/768/375) per the Cycle 2b approval checkpoint.

### 1.5 Carve recommendation for Thread 1

**Option A — single sweeping cycle.** F does all 10 patterns + 2 logo-grid in one cycle. Pros: one F/T/S cycle, one visual-diff baseline, one cross-page regression suite. Cons: 4 pages × 3 viewports = 12 diffs; if any diverge, REWORK touches all 4 pages.

**Option B — per-page split (4 cycles).**
- 2b.1 — `/about-us` (P1, P7, P8, P9, P10) — 4 markers, 4 sections.
- 2b.2 — `/services` (P2, P3, P4, P8) — 2 markers, 3 sections (P8 shared marker).
- 2b.3 — `/how-we-do-it` (P5, P6) — 2 markers, 4 sections.
- 2b.4 — homepage logo-grid (logo-grid P1+P2) — 2 markers, 1 section.

**Option C — per-pattern split.** 10 micro-cycles. Excessive; pattern-affinity is per-page, not per-selector.

**Recommendation: Option B (per-page split, 4 cycles).** Rationale:
1. Each page has a single Canvas-patch script (idempotent, replayable) — clean atomic unit.
2. Visual-diff scope contained to one page per cycle — REWORK isolation.
3. Sprint 9 pattern (per-page fix cycles) is the established cadence.
4. Each cycle is ≤ 2 CSS file edits + 1 Canvas script + 3-viewport diff — under the runbook's "≤ 6 files, single sweep" threshold.

Per-cycle scope: ~2–4 CSS-rule rewrites, 1 Canvas script (~30 lines, follows `cycle-3-nearshore-cap-F.md`'s `sprint6-cycle3-nearshore-marker.php` template), 3-viewport T3 diff verification.

### 1.6 Shipped-state pages requiring T3 visual diff

| Page | Cycle | Why |
|---|---|---|
| `/about-us` | 2b.1 | P1, P7, P8, P9, P10 selectors all consume here. |
| `/services` | 2b.2 | P2, P3, P4, P8 selectors consume here. |
| `/how-we-do-it` | 2b.3 | P5, P6 selectors consume here. |
| `/` (homepage) | 2b.4 | logo-grid P1+P2 selectors consume here. |

Pages **not** affected (no fragile-selector consumer): `/open-source-projects`, `/contact-us`, `/docs/*`, `/book/*`.

---

## Thread 2 — `component_version` workflow-doc audit

### 2.1 Canonical workflow docs that say "set to NULL" (NEEDS FIX)

| File | Line | Current wording (paraphrased) | Proposed wording |
|---|---|---|---|
| `~/.claude/agents/feature-implementor.md` | 123 | "8. Set Canvas `component_version` to `NULL` in any assembly script." | **"8. Preserve Canvas `component_version`. Canvas throws `OutOfRangeException` on NULL (Sprint 5 cycle 2 finding). When patching existing rows, read the full inputs JSON and modify only the keys you intend to change — do not touch `component_version`. When inserting new rows, reuse a valid hash from a peer component on the same page. If the hash schema changes upstream, surface as ADVISORY-HOLD."** |
| `docs/pl2/workflow-ofts.md` | 116 | "- Set Canvas `component_version` to `NULL`" (Operating-rules summary) | **"- Preserve Canvas `component_version` (Canvas requires a valid hash; NULL throws `OutOfRangeException`)."** |
| `docs/pl2/workflow-ofts.md` | 313 | "8. **Set Canvas `component_version` to `NULL`** in any assembly script." (Full F-prompt copy) | Same expanded wording as the agent file above. Keep the two copies in sync. |
| `docs/pl2/pl-plan--homepage-overhaul.md` | 20 | "5. Set Canvas `component_version` to `NULL` in every assembly script. Never hard-code a version hash." | **"5. Preserve Canvas `component_version`. Canvas requires a valid hash matching the registered SDC schema version; NULL throws `OutOfRangeException` at render. When patching, leave the existing hash untouched. When inserting new rows, reuse a peer component's hash. Never invent a hash."** |
| `docs/pl2/pl-plan--homepage-overhaul.md` | 437 | "Canvas `component_version` must be NULL: hard-coding a hash breaks future component updates silently. (Phase 6 trap.)" | **"Canvas `component_version` non-NULL constraint. Setting NULL causes `OutOfRangeException` at render (Sprint 5 cycle 2 finding). Always preserve the existing hash on patches; reuse peer hashes for inserts."** |
| `docs/pl2/pl-plan--sprint-1-conversion-repair.md` | 48 | "if any Canvas patches are needed, set `component_version: NULL`" | **"if any Canvas patches are needed, preserve `component_version` (Canvas requires a valid hash; see Sprint 5 finding)."** |

### 2.2 Per-page runbooks (acceptance-checklist lines)

These are AC bullets that say "All Canvas patches set `component_version: NULL`." Each needs the constraint folded into the bullet.

| File | Lines |
|---|---|
| `docs/pl2/pl-plan--about-us.md` | 48, 92 |
| `docs/pl2/pl-plan--book-pages.md` | 85 |
| `docs/pl2/pl-plan--contact-us.md` | 87, 105, 161 |
| `docs/pl2/pl-plan--open-source-projects.md` | 46, 94 |
| `docs/pl2/pl-plan--services.md` | 53, 93, 131 |

**Proposed wording (one form, reused):**
> "All Canvas patches preserve `component_version` (Canvas requires a valid hash; NULL throws `OutOfRangeException`)."

### 2.3 Docs NOT requiring edits

- `docs/pl2/theme-change.md`, `theme-change--workflow.md`, `theme-change--audit.md` — no `component_version` hits.
- `tech-debt-register.md`, `pl-plan--sprint-10-architecture-cleanup.md`, `sprint-10-orchestrator-log.md` — already describe the constraint correctly.
- All handoff files under `handoffs/` — **immutable history; do not edit.** They are the audit trail of when the workflow said one thing and F discovered another.

### 2.4 Carve recommendation for Thread 2

**Cycle 2a — doc-only, O applies directly** (per Sprint 6 cycle 1 precedent for doc-only edits, codified in the Sprint 10 runbook).

Files to edit: **7** (`~/.claude/agents/feature-implementor.md`, `workflow-ofts.md`, `pl-plan--homepage-overhaul.md`, `pl-plan--sprint-1-conversion-repair.md`, `pl-plan--about-us.md`, `pl-plan--book-pages.md`, `pl-plan--contact-us.md`, `pl-plan--open-source-projects.md`, `pl-plan--services.md`) — actually 9 files. Re-counting: 1 agent + 1 workflow + 7 runbooks = 9 files; ~17 hit-locations.

Estimated effort: 15–30 minutes of careful find-and-replace. No tests. No visual diff. No risk to shipped state.

---

## Combined Cycle 2 carve recommendation

| Cycle | Pipeline | Scope | Risk | Effort |
|---|---|---|---|---|
| **2a** — `component_version` doc fix | O applies | 9 files, ~17 locations | None (doc-only) | 15–30 min |
| **2b.1** — Selector refactor: `/about-us` | O → F → T → S → O | 5 patterns → 4 markers; 1 CSS file (~5 rules) + 1 Canvas script (~30 lines); 4 sections | Re-render of `/about-us`; T3 diff at 1280/768/375 mandatory | 1 F cycle |
| **2b.2** — Selector refactor: `/services` | O → F → T → S → O | 4 patterns → 2 markers; 1 CSS file + 1 Canvas script; 3 sections | T3 diff at 3 viewports | 1 F cycle |
| **2b.3** — Selector refactor: `/how-we-do-it` | O → F → T → S → O | 2 patterns → 2 markers; 1 CSS file + 1 Canvas script; 4 sections | T3 diff at 3 viewports | 1 F cycle |
| **2b.4** — Selector refactor: homepage logo-grid | O → F → T → S → O | 2 patterns → 2 markers; 1 CSS file (`logo-grid.css`) + 1 Canvas script; 1 section | T3 diff at 3 viewports | 1 F cycle |
| **Final** — Cross-page regression baseline | O → T → S → O (skippable per runbook) | Pa11y + 12-diff sweep across 4 pages × 3 viewports | Verification-only | 1 T+S cycle |

**Total Cycle 2 effort:** 1 doc-only cycle + 4 F cycles + (optional) 1 verification cycle = **5–6 cycles**.

**Alternative single-sweep:** Cycle 2a (doc) + Cycle 2b (single F covering all 4 pages) + verification = 3 cycles. Higher REWORK blast-radius if any page diverges. **Not recommended** — Sprint 9 pattern favors atomic per-page units.

---

## Acceptance checklist

- [x] ADV-3 inventory: every fragile selector listed with current consumer + proposed class marker (Thread 1 §1.2, §1.3).
- [x] `component_version` doc audit: every file + line mentioning NULL with proposed wording (Thread 2 §2.1, §2.2).
- [x] Refactor strategy: per-page split recommended (§1.4, §1.5).
- [x] Shipped-state risk assessment: 4 pages need T3 visual diff (§1.6).
- [x] Recommended Cycle 2 carve: 2a doc-fix + 2b.1–2b.4 per-page + optional Final regression (§ Combined carve).
- [x] Verdict.

---

## Verdict

**PASS — audit complete.**

Summary signals for O:

- **Fragile selectors found:** 19 distinct patterns across 7 files; 12 genuinely-fragile (10 in `dy-section.css`, 2 in `logo-grid.css`). 7 acceptable patterns (page-root scoping, component-internal sibling, defensive empty-slot collapse) — recommend leaving.
- **Marker pattern precedent:** Sprint 5/6 already shipped `.dy-section--other-modules` and `.nearshore-section`. Cycle 2 reuses this template — F has a working reference (`scripts/sprint6-cycle3-nearshore-marker.php`).
- **Proposed marker names:** `.dy-section--centered-light`, `.dy-section--centered-white`, `.dy-section--cta-pair`, `.dy-section--kicker-inline`, `.dy-section--tight-header`, `.dy-section--bio-block`, `.dy-section--wordmark-strip`, `.dy-section--logo-grid`, `.dy-section--post-hero-logos`. Nine new markers; two existing (reused).
- **Workflow-doc fix-targets:** 9 files, ~17 hit-locations. Trivial; doc-only Cycle 2a (O applies directly).
- **Recommended Cycle 2 carve:** 2a doc + 2b.1–2b.4 per-page (4 F cycles) + optional Final regression = 5–6 cycles.
- **Pages re-rendering under 2b:** `/about-us`, `/services`, `/how-we-do-it`, `/` (homepage). All require T3 diff at 1280/768/375.

## Advisory notes

1. **Markers replace `:has(...)`, not eliminate every `:has` in the codebase.** Page-root `body:has(.docs-page)` and component-internal `.accordion-item:has(+ .accordion-item)` are idiomatic and should stay.
2. **F should reuse the existing Canvas-patch script template.** `scripts/sprint6-cycle3-nearshore-marker.php` is the reference: reads full inputs JSON, modifies only `additional_classes`, preserves `component_version`. Idempotent.
3. **Cycle 2a (doc fix) ordering.** Apply 2a before 2b so F's per-page cycles start under the corrected canonical prompt and don't re-document the same constraint from scratch.
4. **The "set to NULL" wording has been a workflow-fiction for 5+ sprints** (Sprint 5 cycle 2 forward). Closing this is small but real tech-debt repayment — every F instance currently has to re-derive the constraint at runtime.
