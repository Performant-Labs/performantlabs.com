# Sprint 7 — Cycle 1 — R8 mobile-hero overflow audit (S-only)

**Branch:** `aa/pl-sprint-7-cycle-1-audit`
**Pipeline:** O → S → O (audit-only; no F, no T, no commit)
**Mode:** autonomous

## Objective

Identify the actual root cause of page-level horizontal scroll at 375 px on the four landing-hero pages: `/` (homepage), `/services`, `/how-we-do-it`, `/open-source-projects`. Establish whether one shared fix or per-page fixes are needed.

This is the original R8 / ADV-S1 finding from the `/services` overhaul, deferred at the time as cycle-debt. WCAG 2.1 SC 1.4.10 (Reflow) failure.

## Lineage / prior art (do not re-fix; understand context)

The same flex-min-content trap was resolved on homepage `.heal-flow` in commit `d8622f6` (Cycle-debt Phase 1). The fix was `min-width: 0` + `width: 100%` on the flex item. **Do not re-flag heal-flow** unless the page-level overflow at 375 has actually returned. Hero overflow is the new focus.

## Audit URLs

Live, port 8493, default theme `performant_labs_20260502` (no `?theme=` needed):
- `https://pl-performantlabs.com.3.ddev.site:8493/`
- `https://pl-performantlabs.com.3.ddev.site:8493/services`
- `https://pl-performantlabs.com.3.ddev.site:8493/how-we-do-it`
- `https://pl-performantlabs.com.3.ddev.site:8493/open-source-projects`

## Method

For each page at viewport 375×667 (Playwright, `deviceScaleFactor:1`):

1. Capture full-page screenshot.
2. Probe `document.documentElement.scrollWidth` vs `document.documentElement.clientWidth`. If `scrollWidth > clientWidth`, page has horizontal overflow.
3. If overflow present, enumerate the elements whose `getBoundingClientRect().right > viewport.width`. JS sketch:
   ```js
   const vw = innerWidth;
   const offenders = [];
   document.querySelectorAll('*').forEach(el => {
     const r = el.getBoundingClientRect();
     if (r.right > vw + 1) offenders.push({sel: el.tagName+(el.id?'#'+el.id:'')+(el.className?'.'+String(el.className).split(' ').join('.'):''), right: r.right, width: r.width});
   });
   ```
4. For the top contributors: inspect parent chain (`offsetParent`), `display` of parents (flex/grid?), `min-width` of the element itself.
5. Cross-reference with brief §"Per-section mobile behavior" §Hero — what does the brief say should happen at 375?

## Also probe at 320 (WCAG 1.4.10 spec minimum)

Confirm same-or-worse overflow at 320 px on all four pages. WCAG 1.4.10 requires no horizontal scroll at 320, not just 375.

## Acceptance criteria

- [ ] All four landing pages probed at 375 + 320 with scrollWidth/clientWidth measurements recorded.
- [ ] For each page with overflow: top 3–5 offending elements enumerated with widths and selectors.
- [ ] Root-cause hypothesis stated. Examples of what to look for:
  - Flex `min-content` default growing parent (lineage: heal-flow `d8622f6`)
  - Hero image / SVG with intrinsic width > viewport
  - CTA pair laid out side-by-side without flex-wrap
  - Long word in headline (display-xl 44 px at 375) breaking out
  - Container `padding-inline` math producing negative space
  - Container with `width: 100vw` or similar viewport-unit trap
- [ ] Per-page or shared remediation classification.
- [ ] Cycle 2 carve recommendation: one shared fix cycle, OR N per-page fix cycles.
- [ ] Verdict: PASS (audit complete; carve usable). Or ADVISORY-HOLD if preview itself fails 1.4.10 and that's part of the story.

## Out of scope

- Fixing anything. Audit only.
- Non-landing pages — out of scope unless probe surfaces the same overflow incidentally.
- Hero visual fidelity (FU-2 / brief). Touch only insofar as needed to describe the overflow.

## Handoff locations

- Markdown: `docs/pl2/handoffs/cycle-1-r8-audit-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-r8-audit-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-7-cycle-1/`

## Operating rules

- Per S canonical prompt.
- Pixel-diff comparators are not the binding signal here — the binding signal is the `scrollWidth > clientWidth` measurement (a hard a11y floor failure). Visual screenshots support the diagnosis.
- Enumerate every offending element; do not trim for brevity (memory `feedback_ofts_s_checklist_completeness.md`).
- T precondition is N/A (no T ran). Skip that check.
