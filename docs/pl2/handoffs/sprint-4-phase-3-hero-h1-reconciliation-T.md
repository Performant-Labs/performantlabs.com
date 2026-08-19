# Handoff-T: Sprint 4 Cycle 3 - Hero H1 size reconciliation

**Date:** 2026-05-11
**Branch:** `aa/pl-sprint-4-phase-3-hero-h1-reconciliation`
**Issue:** `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-issue.md`
**Handoff-F reviewed:** `docs/pl2/handoffs/sprint-4-phase-3-hero-h1-reconciliation-F.md`

Note: This cycle is preview HTML + brief documentation only. No CSS was shipped. There is no live URL to curl. T1 and T2 checks are file-grep based per the issue's verification environment specification.

---

## Tier 1 results

### Check 1 — homepage.html hero H1 desktop values

Command: `grep -n "font-size\|line-height\|letter-spacing\|font-weight"` in `.hero h1` block, confirmed by selector context read.

Selector confirmed at line 202: `.hero h1 {`

| Property | Expected | Actual | Result |
|---|---|---|---|
| font-size | 72px | 72px (line 203) | PASS |
| line-height | 1.05 | 1.05 (line 204) | PASS |
| letter-spacing | -2px | -2px (line 205) | PASS |
| font-weight | 500 | 500 (line 206) | PASS |

### Check 2 — services.html hero H1 desktop values

Selector confirmed at line 196: `.hero h1 {`

| Property | Expected | Actual | Result |
|---|---|---|---|
| font-size | 72px | 72px (line 197) | PASS |
| line-height | 1.05 | 1.05 (line 198) | PASS |
| letter-spacing | -2px | -2px (line 199) | PASS |
| font-weight | 500 | 500 (line 200) | PASS |

### Check 3 — how-we-do-it.html hero H1 desktop values

Selector confirmed at line 198: `.hero h1 {`

| Property | Expected | Actual | Result |
|---|---|---|---|
| font-size | 72px | 72px (line 199) | PASS |
| line-height | 1.05 | 1.05 (line 200) | PASS |
| letter-spacing | -2px | -2px (line 201) | PASS |
| font-weight | 500 | 500 (line 202) | PASS |

### Check 4 — open-source-projects.html hero H1 desktop values

Selector confirmed at line 207: `.hero h1 {`

| Property | Expected | Actual | Result |
|---|---|---|---|
| font-size | 72px | 72px (line 208) | PASS |
| line-height | 1.05 | 1.05 (line 209) | PASS |
| letter-spacing | -2px | -2px (line 210) | PASS |
| font-weight | 500 | 500 (line 211) | PASS |

All four files are identical in their `.hero h1` desktop block. PASS.

---

## Tier 2 results

### Check 1 — Brief annotation at line 54 under display-xl

Method: Read `docs/pl2/briefs/pl_design_brief.md` lines 47-66.

The `display-xl` token block (lines 48-53) reads:

```
  display-xl:
    fontFamily: "Rubik, sans-serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2px
```

Line 54 contains: `# display-xl is the standard hero size for all landing-page hero H1s (homepage, services, how-we-do-it, open-source-projects). 72px / -2px tracking.`

Line 55 opens the next token block: `display-lg:`

Assessment: The annotation is correctly placed between `display-xl` and `display-lg`. It is not orphaned. It does not contradict adjacent tokens — the values it names (72px, -2px) match the `display-xl` token definition immediately above. PASS.

### Check 2 — Non-hero H1 contexts: no regressions in three modified files

Method: Grepped each modified file for all `h1 {` selector occurrences.

**services.html:**
- Line 196: `.hero h1 {` — the updated block (desktop)
- Line 441: `.hero h1 { font-size: 40px; ... }` — mobile override, inside `@media` block, untouched

**how-we-do-it.html:**
- Line 198: `.hero h1 {` — the updated block (desktop)
- Line 425: `.hero h1 { font-size: 40px; ... }` — mobile override, inside `@media` block, untouched

**open-source-projects.html:**
- Line 207: `.hero h1 {` — the updated block (desktop)
- Line 449: `.hero h1 { font-size: 40px; ... }` — mobile override, inside `@media` block, untouched

In all three files, the only `h1`-targeted selector is `.hero h1`. The shared heading reset block at line 78 (`h1, h2, h3, h4, h5, h6 {`) sets only `font-family`, `font-weight`, `color`, and `margin` — no `font-size`. No non-hero H1 font-size rules exist in any of the three modified files. PASS.

---

## WCAG contrast verification

Not applicable. No color or background changes in this cycle.

---

## Mobile responsive verification

No responsive overrides were written in this cycle. The mobile `@media` blocks in all three modified files were not touched — independently confirmed: each mobile override remains `.hero h1 { font-size: 40px; letter-spacing: -1px; }` at its respective line.

---

## F's -2px deviation from the issue's -1.8px — validation

The issue text specifies `-1.8px tracking` in two places (objective paragraph and scope item 1). F used `-2px` instead, citing the `display-xl` token in `pl_design_brief.md`.

Independent verification of the brief confirms `display-xl.letterSpacing: -2px` (line 53). The brief is the declared source of truth for this path (issue §Operator pre-commitment: "Brief stays unchanged (already has `display-xl: 72px`)"). The homepage preview, which was already at 72px before this cycle, uses `-2px`. F's harmonization to `-2px` is correct. Using the issue's `-1.8px` would have created a mismatch between the brief token, the homepage preview, and the three updated previews.

F's deviation from the issue's `-1.8px` is a correction to match the brief, not a spec violation. PASS.

---

## Acceptance criteria status

From the issue:

| Criterion | Evidence | Result |
|---|---|---|
| All four landing-page heroes render the same H1 size — 72px (path A) | All four `.hero h1` blocks confirmed at `font-size: 72px` via independent grep | PASS |
| Previews match live (cross-page T3 at 1280) | T3 (visual diff at 1280) is outside T's scope; file-level values are consistent with live's 72px source of truth | OUT OF SCOPE FOR T |
| Brief is consistent with rendered output | `display-xl.letterSpacing: -2px` matches all four previews; annotation at line 54 is coherent and non-contradictory | PASS |
| No regressions on non-hero H1 contexts (e.g. article body H1) | No non-.hero h1 font-size rules exist in any modified file; heading reset block does not set font-size | PASS |

---

## Blocking issues

None.

---

## Advisory notes

**Mobile hero H1 inconsistency (pre-existing, not introduced by this cycle).**

The three non-homepage previews retain their pre-existing mobile override of `font-size: 40px` for `.hero h1`. The homepage preview uses `font-size: 44px`, which matches the brief's `typography-mobile.display-xl: 44px` (per F's handoff). This inconsistency predates Cycle 3 and was not introduced by F's changes. It should be added to the follow-up backlog for a future cycle (Cycle 4 or equivalent) that reconciles mobile hero H1 values across all four previews to the brief's `typography-mobile.display-xl` token.

Affected files and lines:
- `services.html` line 441: `font-size: 40px`
- `how-we-do-it.html` line 425: `font-size: 40px`
- `open-source-projects.html` line 449: `font-size: 40px`
- `homepage.html` line 491: `font-size: 44px` (correct per brief)
