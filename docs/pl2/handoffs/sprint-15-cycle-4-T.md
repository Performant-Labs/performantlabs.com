# Handoff-T: Sprint 15 Cycle 4 - Preview mobile H2 letter-spacing sweep

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-4-preview-letter-spacing-sweep`
**Issue:** sprint-15-cycle-4-issue.md
**Handoff-F reviewed:** docs/pl2/handoffs/sprint-15-cycle-4-F.md

## Tier 1 results

This is a docs-only preview HTML change. There is no live Drupal page, no ddev site to cache-clear, and no HTTP endpoint to curl. Tier 1 checks are adapted to the static-file context as specified in the spawn prompt.

### T1-A: No remaining `-0.6px` in mobile H2 context

Command: `grep -nE "letter-spacing:\s*-0\.6px" docs/pl2/Previews/<file>.html` for each of the 5 files.

| File | Hits | Notes | PASS/FAIL |
|---|---|---|---|
| homepage.html | 0 | No matches | PASS |
| services.html | 0 | No matches | PASS |
| about-us.html | 0 | No matches | PASS |
| open-source-projects.html | 1 hit at line 387 | Desktop `.other-modules h2` rule, outside `@media (max-width: 767px)`. Intentionally out of scope per issue. | PASS |
| contact-us.html | 0 | No matches | PASS |

### T1-B: `-0.8px` present in mobile H2 context

Command: `grep -nE "letter-spacing:\s*-0\.8px" docs/pl2/Previews/<file>.html` for each of the 5 files, cross-referenced against the `@media (max-width: 767px)` block in the diff.

| File | Mobile H2 hit | Line | Selector | PASS/FAIL |
|---|---|---|---|---|
| homepage.html | yes | 492 | `.section-head h2, .built-for h2, .faq h2` | PASS |
| services.html | yes | 497 | `.section-head h2, .nearshore h2` | PASS |
| about-us.html | yes | 516 | `.section-head h2` | PASS |
| open-source-projects.html | yes | 505 | `.section-head h2` | PASS |
| contact-us.html | yes | 569 | `.section-head h2` | PASS |

All 5 files confirmed with at least one `-0.8px` hit inside the mobile media query block.

## Tier 2 results

### T2-A: Staged diff scope (Cycle 4 changes only)

Command: `git diff HEAD --name-only` (HEAD = last merged commit, which is the Cycle 3 integration point)

Result:
```
docs/pl2/Previews/about-us.html
docs/pl2/Previews/contact-us.html
docs/pl2/Previews/homepage.html
docs/pl2/Previews/open-source-projects.html
docs/pl2/Previews/services.html
docs/pl2/handoffs/sprint-15-cycle-4-F.md
```
Plus `docs/pl2/handoffs/sprint-15-cycle-4-issue.md` (untracked).

Exactly the 5 target preview files and the Cycle 4 F handoff. No other files. PASS.

### T2-B: `how-we-do-it.html` not touched by Cycle 4

Command: `git diff HEAD -- docs/pl2/Previews/how-we-do-it.html` — no output (empty diff).

`how-we-do-it.html` appears in `git diff --name-only main` only because `main` predates Sprint 15 Cycle 2 and 3 commits that modified that file in earlier cycles. The binding check (`git diff HEAD`) confirms Cycle 4 did not re-touch it. PASS.

Note: The spawn prompt instructs T to verify `how-we-do-it.html` was NOT touched again. `git diff --name-only main` shows it (carrying Cycle 2+3 history), but `git diff HEAD` — which isolates Cycle 4's staged changes — does not. The correct signal is `git diff HEAD`. PASS.

### T2-C: Diff content — single-property, single-character change per file

Command: `git diff HEAD -- 'docs/pl2/Previews/*.html'`

Each of the 5 hunks shows exactly one deleted line and one added line. The only change in each hunk is the value `-0.6px` replaced by `-0.8px` on the `letter-spacing` property. No selector changes, no added properties, no structural changes. PASS.

Stat summary: `5 files changed, 5 insertions(+), 5 deletions(-)` — matches F's reported stat exactly.

### T2-D: No `!important` introduced

Command: `git diff HEAD -- 'docs/pl2/Previews/*.html' | grep -i '!important'` — 0 matches. PASS.

### T2-E: All changes inside `@media (max-width: 767px)` blocks

Each hunk verified against surrounding context lines in the diff. All 5 changed lines are inside `@media (max-width: 767px) {` blocks with the adjacent rules (`section, .hero`, `.hero h1`, `.closing-cta h2`, `.footer__inner`) confirming the mobile context. PASS.

### T2-F: `open-source-projects.html` line 387 retained `-0.6px` correctly

Verified at lines 383-391: `.other-modules h2` is an unconditional desktop rule (no enclosing media query). The `-0.6px` value there is not a `display-md` mobile heading selector and is explicitly out of scope. PASS.

## WCAG contrast verification

N/A. No color, foreground, or background property changes. Letter-spacing is a purely typographic spacing property with no contrast implications.

## Mobile responsive verification

The changes tighten letter-spacing within existing `@media (max-width: 767px)` blocks. No new responsive overrides were introduced. No breakpoint values changed. No touch-target or typography-mobile spec deviations possible from a letter-spacing-only change.

Breakpoint confirmed: `@media (max-width: 767px)` — consistent across all 5 files and matches the project's mobile breakpoint used in Cycle 3 (`how-we-do-it.html` precedent commit 67958416).

N/A for touch-target math (no interactive element changes).

## Acceptance criteria status

| Criterion | Evidence | PASS/FAIL |
|---|---|---|
| All 5 preview files have mobile `.section-head h2` (or equivalent) letter-spacing set to `-0.8px` | T1-B confirms `-0.8px` in mobile H2 context for all 5 files | PASS |
| No other selector / property changes in those files | T2-C: each hunk is a single-line value swap, no other changes | PASS |
| No live theme files modified | `git diff HEAD --name-only` shows only preview HTML and handoff doc, no `css/` or theme files | PASS |
| No `!important` | T2-D: zero matches | PASS |
| Stage by explicit path | F handoff confirms explicit path staging; `git diff --cached --name-only` matches only the 5 preview files + handoff doc | PASS |

## Blocking issues

None.

## Advisory notes

1. The `git diff --name-only main` output includes `how-we-do-it.html` and all Sprint 15 Cycle 1-3 artifacts. This is expected because `main` predates the sprint. T2-B confirms `how-we-do-it.html` was not modified in Cycle 4 by using `git diff HEAD` (the correct Cycle 4 boundary).

2. `open-source-projects.html` retains one `-0.6px` occurrence at line 387 on the unconditional desktop `.other-modules h2` rule. This is intentionally out of scope and does not require a fix.

3. `homepage.html` mobile selector covers `.section-head h2, .built-for h2, .faq h2` (broader than the other four files which target only `.section-head h2`). This reflects Sprint 13 canonicalization and is consistent with the file's pre-existing content. No deviation from spec.

---

T complete, no blocking issues. Ready for S.
