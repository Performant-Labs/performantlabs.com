# Handoff-F: Sprint 15 Cycle 4 - Preview mobile H2 letter-spacing sweep

**Date:** 2026-05-13
**Branch:** `aa/pl-sprint-15-cycle-4-preview-letter-spacing-sweep`
**Issue:** sprint-15-cycle-4-issue.md

## Confirmation table

| Field | Value |
|---|---|
| Page being overhauled | All 6 preview pages (5 updated this cycle) |
| Issue | sprint-15-cycle-4-issue.md |
| Working branch | `aa/pl-sprint-15-cycle-4-preview-letter-spacing-sweep` |
| Runbook phase | Sprint 15 Cycle 4 |
| Input documents read | sprint-15-cycle-4-issue.md, sprint-15-cycle-3-S.md (Advisory 1 context), how-we-do-it.html Cycle 3 commit diff |
| Acceptance criteria count | 5 |
| Handoff document path | docs/pl2/handoffs/sprint-15-cycle-4-F.md |
| CSS workflow path | N/A -- docs-only preview file change |
| Component schema source of truth | N/A -- no component props involved |

## What was done

- `docs/pl2/Previews/homepage.html` -- line 492: mobile `.section-head h2, .built-for h2, .faq h2` letter-spacing `-0.6px` to `-0.8px`
- `docs/pl2/Previews/services.html` -- line 497: mobile `.section-head h2, .nearshore h2` letter-spacing `-0.6px` to `-0.8px`
- `docs/pl2/Previews/about-us.html` -- line 516: mobile `.section-head h2` letter-spacing `-0.6px` to `-0.8px`
- `docs/pl2/Previews/open-source-projects.html` -- line 505: mobile `.section-head h2` letter-spacing `-0.6px` to `-0.8px`
- `docs/pl2/Previews/contact-us.html` -- line 569: mobile `.section-head h2` letter-spacing `-0.6px` to `-0.8px`

All 5 changes are inside `@media (max-width: 767px)` blocks. Each is a single property value change on one line.

## Layer decisions

N/A -- these are static preview HTML files, not live theme CSS. No layer decision tree applies. The change mirrors the Cycle 3 precedent commit (67958416) on `how-we-do-it.html`.

## Deviations from spec

None.

Note: `open-source-projects.html` line 387 retains `letter-spacing: -0.6px` on the desktop `.other-modules h2` rule. This is intentional -- that rule is not a mobile `display-md` heading selector and is outside the `@media (max-width: 767px)` block. The issue scope covers only mobile `.section-head h2` (or equivalent `display-md` mobile heading) selectors.

## Verification results (T1 + T2)

### T1: no remaining `-0.6px` in mobile H2 context

```
=== homepage.html ===
grep -nE 'letter-spacing:\s*-0\.6px' docs/pl2/Previews/homepage.html
(no matches)

=== services.html ===
grep -nE 'letter-spacing:\s*-0\.6px' docs/pl2/Previews/services.html
(no matches)

=== about-us.html ===
grep -nE 'letter-spacing:\s*-0\.6px' docs/pl2/Previews/about-us.html
(no matches)

=== open-source-projects.html ===
grep -nE 'letter-spacing:\s*-0\.6px' docs/pl2/Previews/open-source-projects.html
387:      letter-spacing: -0.6px;
(desktop .other-modules h2 -- not in scope)

=== contact-us.html ===
grep -nE 'letter-spacing:\s*-0\.6px' docs/pl2/Previews/contact-us.html
(no matches)
```

### T1: `-0.8px` present in mobile H2 context

```
=== homepage.html ===
492:      .section-head h2, .built-for h2, .faq h2 { font-size: 32px; letter-spacing: -0.8px; }

=== services.html ===
497:      .section-head h2, .nearshore h2 { font-size: 30px; letter-spacing: -0.8px; }

=== about-us.html ===
516:      .section-head h2 { font-size: 30px; letter-spacing: -0.8px; }

=== open-source-projects.html ===
505:      .section-head h2 { font-size: 30px; letter-spacing: -0.8px; }

=== contact-us.html ===
569:      .section-head h2 { font-size: 30px; letter-spacing: -0.8px; }
```

### T2: diff scope

```
git diff --stat
 docs/pl2/Previews/about-us.html             | 2 +-
 docs/pl2/Previews/contact-us.html           | 2 +-
 docs/pl2/Previews/homepage.html             | 2 +-
 docs/pl2/Previews/open-source-projects.html | 2 +-
 docs/pl2/Previews/services.html             | 2 +-
 5 files changed, 5 insertions(+), 5 deletions(-)
```

No `!important` introduced (grep confirms zero matches across all 5 diffs).

## WCAG contrast ratios

N/A -- no color, background, or foreground changes. Letter-spacing only.

## Mobile responsive behavior

N/A -- the change tightens letter-spacing within existing mobile media queries. No new responsive overrides introduced.

## Autonomous decisions

None -- issue was fully specified.

## Known issues

None.

## Files changed

- `docs/pl2/Previews/homepage.html`
- `docs/pl2/Previews/services.html`
- `docs/pl2/Previews/about-us.html`
- `docs/pl2/Previews/open-source-projects.html`
- `docs/pl2/Previews/contact-us.html`
