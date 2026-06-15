# Cycle 1 — `/about-us` Preview-vs-Live Audit (S-only)

**Sprint:** 12
**Branch:** `aa/pl-sprint-12-cycle-1-about-us-audit`
**Pipeline:** O → S → O (audit-only; no F, no T)
**Mode:** autonomous

## Objective

Produce a section-by-section delta catalog of live `/about-us` vs. the static preview `docs/pl2/Previews/about-us.html` at 1280×800, 768×1024, and 375×667. Classify each section MATCH / DELTA / REWORK; tag each delta with a remediation layer (L1 config / L3 token / L5 component-CSS / Canvas-content / N-A). Output carves Cycles 2..N of Sprint 12.

## Input documents

Read these before starting:

- [ ] `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md` (this sprint's runbook)
- [ ] `docs/pl2/pl-plan--about-us.md` (existing page runbook — copy & content decisions, course-correction history)
- [ ] `docs/pl2/Previews/about-us.html` (canonical visual reference)
- [ ] `docs/pl2/briefs/pl_design_brief.md` (token tables, responsive behavior, mobile typography)
- [ ] `docs/pl2/workflow-ofts.md` §"S — Spec Auditor" (your role + visual-diff protocol)
- [ ] `docs/pl2/handoffs/sprint-11-wrap.md` (most-recent verification baseline; preview-fidelity context for shipped siblings)
- [ ] `docs/pl2/tech-debt-register.md` (status: ZERO open; do not reopen closed items unless audit finds re-regression)

## Operating environment

- **Live URL:** `https://pl-performantlabs.com.3.ddev.site:8493/about-us`
- **Active theme:** `performant_labs_20260502` (verify with `ddev drush cget system.theme default`)
- **DDEV port:** 8493 from host. mkcert cert is trusted; no `-k` flags needed.
- **Host curl SSL chain workaround:** if needed, use `ddev exec curl http://localhost/about-us`.
- **Visual-diff tooling:** Playwright + ImageMagick `compare` (mandatory per memory `feedback_visual_diff_mandatory.md`). Bootstrap with `npm install --no-save playwright && npx playwright install chromium` if missing. ImageMagick `compare` at `/opt/homebrew/bin/compare`.
- **Preview server:** serve `docs/pl2/Previews/` via `python3 -m http.server` from that directory, or use `file://`. Pick whichever Playwright renders cleanly.

## Acceptance criteria

- [ ] **Preview sanity-check completed.** Spend up to 2 minutes verifying the preview itself does not violate a11y floors (contrast ≥ 4.5:1 body, ≥ 3:1 large/focus; heading hierarchy; touch targets ≥ 44×44 on mobile preview). If preview defective, return `ADVISORY-HOLD` with proposed fix.
- [ ] **Visual diffs at all three viewports** (1280×800, 768×1024, 375×667). For each: live screenshot + preview screenshot + diff PNG (red overlay) + side-by-side composite. Save to `docs/pl2/handoffs/screenshots/cycle-1/` with naming `t3-about-us-[viewport]-{live,preview,diff,composite}-20260512.png`.
- [ ] **Whole-page AE pixel-count + delta %** reported per viewport in the handoff table.
- [ ] **Per-section delta table.** Columns: Section name | Viewport | Status (MATCH / DELTA / REWORK) | Description (operator-readable, no jargon) | **Remediation layer** (L1 / L3 / L5 / Canvas-content / N-A) | Crop thumbnail path. Sections expected: Hero / Track record / Open source / Bio / Dogfood / Closing CTA (refine per actual page).
- [ ] **Sibling-fit cross-check.** For each delta that involves shared chrome (kickers, `card-canvas`, closing-CTA, `dy-section--*` markers), spot-compare against the shipped pattern on `/services` and `/open-source-projects`. Flag any case where the about-us preview specifies a treatment that contradicts the shipped sibling pattern.
- [ ] **WCAG 2.2 AA audit table** populated for the live page (keyboard nav, focus rings, forced-colors, reduced-motion, 200% zoom, heading hierarchy, image alt, mobile touch targets, mobile typography, mobile layout).
- [ ] **Carve recommendation.** Propose 2-5 fix cycles for Sprint 12 Cycles 2..N. Each cycle entry includes: proposed branch slug (`aa/pl-sprint-12-cycle-N-[slug]`), one-sentence scope, rough remediation layer, and which delta-table rows it absorbs. Group by section cluster + layer where natural.
- [ ] **Operator-facing HTML report** at `docs/pl2/handoffs/cycle-1-about-us-audit-report.html` per workflow Step 4f: verdict banner, plain-English "what I see different" summary, per-viewport wipe-slider comparators, per-section delta table with crops, carve recommendations. Self-contained (no CDN deps).

## Handoff locations

- Markdown handoff: `docs/pl2/handoffs/cycle-1-about-us-audit-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-about-us-audit-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/cycle-1/`

## Operating rules

- Pixel-level visual diffs are mandatory; prose descriptions of screenshots do NOT substitute (memory `feedback_visual_diff_mandatory.md`).
- Enumerate every visual + WCAG check; never trim for brevity (memory `feedback_ofts_s_checklist_completeness.md`).
- Watch for orphan words on headings/copy and flag with proposed `text-wrap: balance` (memory `feedback_no_orphan_words.md`).
- Three verdicts available: PASS / REWORK / ADVISORY-HOLD. For an audit-only cycle, PASS = "audit complete, carve recommendations recorded"; REWORK is not applicable (no F output to reject); ADVISORY-HOLD = preview itself defective.
- Do NOT write code. Do NOT commit. Do NOT run Tier 1 / Tier 2.
- Audit URL uses the default theme — no `?theme=` query string needed (verify the default is `performant_labs_20260502` first).

## Pre-commitments inherited from sprint kickoff

PC-1..PC-10 in `docs/pl2/pl-plan--sprint-12-about-us-fidelity.md`. Most relevant to this cycle:
- **PC-1** — brief tokens > preview layout > content > live. Hard a11y floors win over preview.
- **PC-4** — audit-before-fix; flag any items empirically resolved.
- **PC-7** — any new markers must follow `.dy-section.dy-section--<marker>` specificity-safe form.
- **PC-9** — silent-park on ADVISORY-HOLD.
