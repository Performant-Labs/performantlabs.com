# Cycle 2 — CSS punch list + visual-fidelity gate

**Branch:** `aa/pl-contact-us`
**Pipeline:** O → F → T → S → O
**Cycle 2 of 2** in `docs/pl2/pl-plan--contact-us.md`.

---

## Operator's directive

Cycle 1 shipped the Canvas component tree. Operator approved Cycle 1 with one heads-up: **components are visually mislocated** — the closing CTA kicker isn't centered, the form section is single-column when the preview shows two columns, the form fields occupy only the left ~third of the section. Cycle 2 must end with **`/contact-us` visually matching `docs/pl2/Previews/contact-us.html`** at 1280px desktop AND 375px mobile.

The operator personally verifies this at end of cycle (no committing on S's PASS alone).

---

## Objective

Resolve every visible delta between the Cycle-1 rendered `/contact-us` and the operator-approved preview, at desktop (1280px) AND mobile (375px). Includes one component-level fix (kicker SDC) that propagates to sibling pages — **operator approves the propagation** since `/about-us` benefits from the same fix.

---

## Scope (10 items, normative — see runbook §Cycle 2 §Confirmed scope for full prose)

1. **Closing CTA kicker centering fix.** Add `justify-content: center` to the kicker SDC's `.kicker--centered` rule (or equivalent) so it visually centers when display is `flex` (i.e., when nested in `dy-section__content`). Verify hero/cream kickers (which use `inline-flex`) don't regress. Verify `/about-us` closing CTA also centers correctly after the fix. **L5 scope** on `web/themes/custom/performant_labs_20260502/components/kicker/css/kicker.css` (or wherever the variant is defined — confirm via Step-3 trace).

2. **Two-column form-grid (Section B).** At ≥992px viewport, lay out the webform_block (left, ~1fr, max ~640px) and the SavvyCal sidebar children (right, 320px) side-by-side with 64px gap. Below 992px stack single-column. The sidebar children currently render as loose siblings of the webform_block in `dy-section__content`; either wrap them in a div (Canvas restructure — preferred for clean targeting) or use a CSS sibling selector. **Step-3 trace decision required.**

3. **Form-input chrome.** `1px solid var(--hairline)` border, `var(--radius-md)` (8px) corners (currently 4px), 12×14 padding, focus ring `2px solid var(--primary)` with 2px offset (per `pl_design_brief.md` §Elevation). New file `web/themes/custom/performant_labs_20260502/components/webform/css/webform.css` (or extend an existing one — F's trace decides). Inputs already have `max-width: 100%; box-sizing: border-box` — that part is fine.

4. **Required-marker color.** Override the Drupal default red `*` to `var(--accent-deep)` (terracotta `#8E4A2A`). L5 scope on the webform required-indicator marker.

5. **Sidebar polish.** `1px solid var(--hairline)` border, `var(--radius-lg)` (12px) corners, `var(--space-xl)` (32px) internal padding. `position: sticky; top: var(--space-2xl)` at desktop ≥992px. Sidebar kicker keeps `--inline` variant (already correct in Canvas).

6. **Submit button label.** Webform config edit on `config/sync/webform.webform.contact_form.yml` `actions.__submit__label: "Send message"` (currently default "Submit"). Apply via `drush cim`.

7. **Hero H1 typography.** Currently 72px / line-height 79.2px (theme default). Preview spec: 56px / line-height 1.05 / letter-spacing -1.4px. **Verify side effects on `/about-us` H1** (which is also currently 72px) — if scoping to hero specifically is cleaner, do that.

8. **What-to-expect cards hover state.** Per design brief §Components `card-feature`: hover border color shifts to `var(--primary)`. Verify Dripyard `card-canvas` doesn't already do this; if missing, add at L5.

9. **Mobile responsive verification.** No new responsive rules expected (Cycle 1's grid-wrapper--3col + dark-CTA-button stacking already handle most cases). Verify at 375px: (a) two-column form-grid collapses to single-column ✓, (b) sidebar drops sticky positioning ✓, (c) submit button full-width below `sm`, (d) no horizontal page scroll, (e) cards collapse 3→1 cleanly.

10. **Operator's preview-fidelity gate at end of cycle.** Walk every section against the preview at 1280px AND 375px — block commit on any visible delta.

---

## Inputs (read all of these before writing any code)

1. **Runbook (revised):** `docs/pl2/pl-plan--contact-us.md` §Cycle 2 §Confirmed scope + §Acceptance criteria
2. **Visual reference:** `docs/pl2/Previews/contact-us.html` — operator-approved
3. **Design brief:** `docs/pl2/Briefs/pl_design_brief.md` — §Components (form chrome, kicker variants, card-feature), §Elevation (focus rings), §Excluded (form fields inherit Bootstrap defaults except focus + this cycle's overrides)
4. **CSS strategy:** `docs/pl2/pl-plan--css-strategy.md` — Cascade Layers 3/5 conventions (override at the highest correct layer)
5. **Theme-change workflow:** `docs/pl2/theme-change--workflow.md` — 7-step CSS workflow (mandatory)
6. **Cycle-2 anticipated scope:** runbook §Cycle 2 (this is the source of truth; the issue paraphrases)
7. **Sibling-fit reference:** `/about-us` live (since the kicker SDC fix propagates there) — verify at end of cycle that `/about-us` closing CTA renders correctly with the fix, no other regressions

---

## Step-3 trace decisions to surface before code

Per F's role in the workflow. Land your trace at `docs/pl2/handoffs/cycle-2-contact-us-step3-trace.md`. Stop and wait for operator approval before writing code.

1. **Kicker SDC fix location.** Which file holds the `.kicker--centered` rule? Likely `web/themes/custom/performant_labs_20260502/components/kicker/css/kicker.css` or a sibling. Confirm. Identify the exact selector that flips `display: flex` (block-level) on full-width parents. Propose the one-line fix.

2. **Form-grid wrapper strategy.** Two options for Section B's two-column layout:
   - (a) **Canvas restructure** — wrap the SavvyCal sidebar children in a new `dripyard_base:section`-style container or in a sub-component, so the webform_block and the sidebar wrapper become two distinct grid cells.
   - (b) **CSS sibling-targeting** — use `:has()` and `~` selectors to grid the existing loose siblings without restructure.
   
   Lean: (a) is cleaner. (b) is fragile. Trace the trade-off and pick.

3. **Form-input chrome stylesheet location.** Does Dripyard ship a webform stylesheet? `web/themes/contrib/dripyard*/components/webform/`? Check. If yes, extend via `libraries-extend`. If no, create `web/themes/custom/performant_labs_20260502/components/webform/webform.libraries.yml` + CSS.

4. **Hero H1 typography scope.** Override theme default 72px → 56px scoped to:
   - (a) Hero `<h1>` only (most precise; doesn't affect /about-us)
   - (b) All H1s site-wide (broadest; affects /about-us, /services, etc.)
   
   Trace which sibling pages have an H1 at the page level. If only contact-us and about-us, and both should be 56px per the preview-spec convention, (b) is fine. Otherwise (a). Surface for operator approval.

5. **Sidebar wrapper class.** Where does the `.contact-sidebar` class get attached in Canvas? On a wrapper div, on the section, or via a Canvas-component additional_classes? Decide.

---

## Acceptance criteria

Copied from runbook §Cycle 2 §Acceptance criteria — see runbook for the full text. Tracked here for your handoff:

- [ ] Closing CTA kicker centered (text rect cx = parent rect cx within ±2px)
- [ ] About-us closing CTA also renders correctly with the kicker fix (no regression)
- [ ] Form section at ≥992px: two columns (form ~1fr max ~640px, sidebar 320px, 64px gap)
- [ ] Form section at <992px: single column, sidebar below
- [ ] Form inputs: 8px radius, 1px hairline, 12×14 padding, 2px primary focus ring with 2px offset
- [ ] Required marker `*` color = `var(--accent-deep)` (#8E4A2A terracotta)
- [ ] Submit button reads "Send message"
- [ ] Sidebar: hairline border, 12px radius, 32px padding, sticky at ≥992px
- [ ] Hero H1: 56px / line-height 1.05 / letter-spacing -1.4px (or theme spec equivalent)
- [ ] What-to-expect cards hover border shifts to primary
- [ ] Mobile 375px clean: no horizontal scroll, all sections stack, full-width submit, cards 3→1
- [ ] WCAG 2.2 AA: focus ring contrasts ≥3:1, accent-deep marker contrast ≥4.5:1
- [ ] No regression on `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects`, `/about-us` (spot-check)
- [ ] Pa11y on `/contact-us`: 0 errors
- [ ] **Operator preview-fidelity gate** — visible match to preview at 1280px AND 375px (operator confirms; F documents own visual checks in handoff)
- [ ] Files staged by explicit path; no `git add .`

---

## Verification you run before the F handoff

T1 + T2 (curl + grep) covers structural changes. T3 (visual) is S's job — but you do your own visual sanity check before declaring done, including the operator's preview-fidelity gate items (use Chrome MCP if available).

WCAG: contrast for focus ring (`var(--primary)` on canvas), accent-deep marker on canvas, ghost-on-dark border on espresso (no change there but spot-check). Touch target verification at mobile.

Sibling-fit re-check: after the kicker SDC fix lands, render `/about-us` and confirm closing CTA centers properly + no other regression.

---

## Handoff location

`docs/pl2/handoffs/cycle-2-contact-us-F.md`

Use the F handoff template from `docs/pl2/workflow-ofts.md` §F → §Your output.

---

## What you do NOT do

- Touch the Canvas component tree EXCEPT for the form-grid wrapper if Step-3 §2 chooses option (a)
- `!important` or `git add .`
- Commit, push, merge — operator does that after their preview-fidelity gate passes
- Skip the sibling-page regression check — kicker SDC fix touches shared component CSS

Begin with the Step-3 trace.
