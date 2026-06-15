# `/contact-us` Page Overhaul — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Visual reference:** [`Previews/contact-us.html`](Previews/contact-us.html) (preview written 2026-05-08, operator-approved)
> **Live (current state):** `https://pl-performantlabs.com.3.ddev.site:8493/form/contact`

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` (already shipped on homepage / services / how-we-do-it / articles / open-source-projects / about-us) |
| Page entity | **Canvas page 13** (`canvas_page` id=13, alias `/contact-us`). Canvas 13 currently holds three components: `section` → `heading` + `block.webform_block` (the embed of the `contact` webform). The webform itself (`config/sync/webform.webform.contact.yml`, `status: closed`) is the data store; chrome lives in Canvas. |
| Path | Currently `/contact-us` aliased to `/page/13`. Two redirects exist: `redirect/89` (`/contact` → `internal:/page/13`) and `redirect/90` (`/form/contact` → `internal:/contact-us`). Canonical URL stays `/contact-us`. |
| Strategy | **Patch in place** — same Canvas page (id=13), same UUID, same alias. Restructure the component tree to mirror the preview, mirroring the `/about-us` (Canvas 17) approach. No parallel `/contact-v2`. |
| Branch | `aa/pl-contact-us` (one branch, ~2 commits, single `--no-ff` merge to local `main` at the end) |
| GitHub issues | Skipped — issue bodies live as `docs/pl2/handoffs/cycle-N-contact-us-issue.md` |
| **Status** | ✅ Cycle 1 committed (`c3c70b8ab feat(contact-us): restructure Canvas to match preview`). ✅ Cycle 2 committed (`42cda3502 feat(contact-us): css punch list — kicker centering, form chrome, sidebar, mobile`) after 3 rework rounds and operator preview-fidelity gate. Branch `aa/pl-contact-us` ready for `--no-ff` merge to local `main` after operator approval. |

---

## Architecture discoveries (2026-05-08)

### Discovery 2: Two contact webforms exist (mid-Cycle-1, F implementation)

While implementing the Canvas 13 rebuild, F surfaced (and operator confirmed via DB inspection) that **two contact webforms exist**:

- `webform.webform.contact_form.yml` — id `contact_form`. This is the form that **actually renders on `/contact-us`** (Canvas 13's `webform_block` references `webform_id: "contact_form"`). Already `status: open`. No `processed_text` intro elements. Has a `captcha` element (invisible challenge, no visible impact on layout).
- `webform.webform.contact.yml` — id `contact`. Legacy webform. Was `status: closed`. Held the three `processed_text` intro elements that the preview retired. Not displayed anywhere.

R3 originally said "activate the webform (`status: closed` → `open`)" — this was satisfied before this cycle started, by the wrong webform. The runbook's references to `webform.webform.contact.yml` for activation/cleanup were wrong; the **rendered** webform is `contact_form`. F edited both to keep R7 satisfied (the legacy `contact` webform had its processed_text intros removed) while landing the sentence-case labels on `contact_form` (the rendered one). The legacy `contact` webform stays `status: closed` since it is not displayed and decommissioning it is out of scope.

Decommissioning the legacy `contact` webform (and pointing the Canvas 13 block at `contact` if a single canonical entity is desired) is a follow-up cleanup task, not Cycle-1 scope.

### Discovery 1: /contact-us is a Canvas page (Step-3 trace)

Initial runbook draft assumed `/contact-us` was a standalone Webform route requiring a theme template (`webform--contact.html.twig` or `page--form--contact.html.twig`) to wrap the form with chrome. F's Step-3 investigation surfaced — and the operator independently verified — that this premise was wrong:

- `/contact-us` is **Canvas page 13** (alias row 317: `/contact-us` → `/page/13`).
- The webform's standalone route is currently disabled (`page: false`); the live `/form/contact` endpoint exists only as redirect 90 (`form/contact` → `internal:/contact-us`).
- `/contact` is redirect 89 (`/contact` → `internal:/page/13`).
- About-us is composed identically: Canvas page 17 (alias row 323: `/about-us` → `/page/17`), 32 SDC components total, including the two-button espresso closing CTA at deltas 26–31 (`section` → `kicker` + `heading` + `text` + `button` + `button`). No `page--about-us.html.twig` exists.

Implication: the right strategy mirrors about-us — **patch Canvas 13 in place** with the same component vocabulary used on every other shipped page. R5, R7, and the Cycle-1 scope below are revised to reflect this.

---

## Source-of-truth visual delta

The current `/contact-us` Canvas page (id 13) holds 3 components: a `section` containing a `heading` + a `webform_block` (which embeds the contact webform). The webform schema additionally renders three `processed_text` intro elements (a sidebar image, a heading "Let's talk about your quality and testing goals.", and a SavvyCal link) above the form fields. There is **no hero band**, **no "what to expect" content**, and **no closing CTA**. The page does not read as a sibling to `/about-us`, `/services`, `/how-we-do-it`, etc.

Anchored deltas (preview vs live, 2026-05-08):

1. **Page chrome is missing.** Live page renders only the form + the three intro `processed_text` blocks. Preview specifies a full-page rhythm: header → breadcrumb → hero (canvas) → form section (canvas, two-column) → "what to expect" (cream, 3-up cards) → closing CTA (espresso) → footer.
2. **Hero band missing.** Preview specifies kicker "Get in touch" + H1 "Let's talk about your quality and testing goals." + italic subhead "Tell us where your suite is now, and we'll come back with a concrete next step — not a sales sequence." Live has no hero — the heading currently lives inside the form as a `processed_text` element.
3. **Form is single-column.** Preview specifies two columns at desktop (form ~1fr + sidebar 320px, 64px gap), stacked at <992px. Live form is a single column with the SavvyCal link buried in a paragraph above the fields.
4. **SavvyCal is buried.** Live wraps the SavvyCal link in a `<p>` inside the webform schema's `contact_intro_text`. Preview promotes it to a sticky right-column sidebar with kicker "Faster path", H2 "Prefer a quick call?", and a `button--secondary` to the calendar URL, plus a "Response time" meta block.
5. **No "what to expect" reassurance.** Preview adds a cream-band 3-up card grid after the form: `01 / Acknowledgment` (real reply by a real engineer), `02 / Discovery call` (30 min, screen-share), `03 / Written next step` (one-page proposal). Live has nothing in this slot.
6. **No closing CTA.** Preview adds an espresso closing CTA — kicker "Already decided?", H2 "Skip the form — book the review.", primary "Book a testing review" → SavvyCal, ghost-on-dark "View services" → `/services`. Live has nothing.
7. **Webform is closed.** `webform.webform.contact.yml` has `status: closed`. Live route currently 404s in production (verified). Form must be activated before any chrome work matters.
8. **Path mismatch with sibling pages.** Sibling pages all advertise `/contact-us` (header CTA "Book a testing review" on every preview points to `/contact-us?intent=testing-review`). Live form lives at `/form/contact`; the header "Call today" points to `/contact` (no alias exists). Canonical URL must consolidate to `/contact-us`.
9. **Form-field labels are sentence-case but verbose.** Live: "Your Name", "Your Email", "Your Company Name", "Your Phone Number", "Message". Preview: "Your name", "Your email", "Your company name", "Your phone number", "Your message" — sentence case throughout (per `pl_copy_brief.md`), and "Message" → "Your message" for parallelism. The `*` required-indicator uses `--accent-deep` per design brief.

Header, breadcrumb, and footer chrome on live already match the preview shell (shipped in earlier phases). No work needed there beyond the menu/footer link path update (R8).

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| R1 | **Branch + push policy.** Local-only. `aa/pl-contact-us` merges to local `main` with `--no-ff`. No push to `origin`. No PR. | `project_local_only_main.md` |
| R2 | **Patch in place.** Same Canvas page entity (`canvas_page` id=13), same UUID, same `/contact-us` alias. Same `contact` webform entity, same UUID. No parallel `/contact-v2`. | this runbook; about-us R2 precedent |
| R3 | **Two webforms — `contact_form` is canonical.** The webform actually rendered on `/contact-us` is `contact_form` (already `status: open`, has `captcha` element). The legacy `contact` webform stays `status: closed` and is not displayed. Both webforms get sentence-case labels in Cycle 1; the legacy `contact` also has its three `processed_text` intros removed (per R7, even though it is not rendered, to retire that pattern from the codebase). The webform stays `page: false` — Canvas 13 is the only entry point for `contact_form`. See §Architecture discoveries §Discovery 2. | `webform.webform.contact_form.yml`, `webform.webform.contact.yml` |
| R4 | **Canonical URL = `/contact-us`** (no change — already aliased). Redirect 89 (`/contact` → `/page/13`) gets repointed to `internal:/contact-us` for cleanliness. Redirect 90 (`/form/contact` → `/contact-us`) stays as-is. | path_alias row 317; redirect rows 89, 90 |
| R5 | **Page chrome rendered via Canvas 13 component tree.** Same SDC vocabulary as `/about-us` (Canvas 17): `dripyard_base:section` × 4 (one per band) → `kicker` + `dripyard_base:heading` + `dripyard_base:text` + (band-specific children: `card-canvas` × 3 in cream, `dripyard_base:button` × 2 in espresso, `block.webform_block` in form section). NO theme-template route override. NO inline twig. | sibling-page convention; about-us Canvas 17 component dump |
| R6 | **SavvyCal sidebar rendered as additional Canvas components within the form section** — `kicker` "Faster path" + `heading` + `text` + `button` (secondary variant) + `text` (response-time meta). Stacked below the form in Cycle 1; two-column layout is Cycle 2 CSS. | preview §RIGHT sidebar |
| R7 | **Webform schema gets simplified.** The three `processed_text` intro elements (`contact_intro_graphic`, `contact_intro_heading`, `contact_intro_text`) get **removed** from the webform schema in Cycle 1 — their content moves to Canvas 13 (hero band kicker/heading/text + sidebar SavvyCal block). Cleaner separation: schema owns data fields; Canvas owns chrome. | preview vs schema diff |
| R8 | **Menu + footer links unchanged.** F's Step-3 trace verified: primary nav menu link 15 already points to `/contact-us`, footer menu link 44 already points to `/contact-us`, header CTA block already renders "Book a testing review" with target `/contact-us?intent=testing-review`. No edits needed. | F Step-3 trace 2026-05-08 §5 |
| R9 | **Form fields inherit Bootstrap defaults except focus ring.** Per `pl_design_brief.md` §Excluded ("Inputs, selects, checkboxes, and radios inherit from Bootstrap defaults"), no custom input chrome in Cycle 1. Cycle 2's CSS punch list adds the focus-ring rule (`2px solid var(--primary)` outline, 2px offset) per design-brief §Elevation, plus hairline border + 8px radius matching the preview. | `pl_design_brief.md` §Excluded §Elevation |
| R10 | **Closing CTA theme is `dark`** (espresso). Matches sibling pages (homepage / services / how-we-do-it / open-source-projects / about-us). | `pl_brand_brief.md`; sibling-page convention |
| R11 | **Component vocabulary.** Existing components only — `kicker` (custom theme SDC), `dripyard_base:section`, `dripyard_base:heading`, `dripyard_base:text`, `dripyard_base:button`, `dripyard_base:card-canvas`, `dripyard_base:grid-wrapper` (for the 3-up cards in the cream band), `block.webform_block` (existing on Canvas 13 — keep). | sibling-page conventions; about-us Canvas 17 |
| R12 | **Honeypot field** (Webform's "Leave this field blank" anti-spam) stays enabled. The preview's hidden honeypot mirrors what Drupal renders. | `webform.webform.contact.yml` defaults |
| R13 | **Hero copy stays verbatim from preview.** H1 "Let's talk about your quality and testing goals." Subhead "Tell us where your suite is now, and we'll come back with a concrete next step — not a sales sequence." No copy changes mid-cycle. | `Previews/contact-us.html` §Hero |
| R14 | **Canvas patches preserve `component_version`** in any assembly script — do NOT set to NULL (Canvas throws `OutOfRangeException`; corrected 2026-05-12 per Sprint 10 cycle 2a). | OFTS workflow F prompt §Step 8 |

---

## Cycle plan

Two cycles total, one branch (`aa/pl-contact-us`), one commit per cycle. Approval Checkpoint between every cycle (explicit "approved" required before opening the next).

### Cycle 1 — Canvas restructure + webform plumbing (content-only, no CSS)

**Pipeline:** O → F → T → S → O

**Objective:** Restructure Canvas page 13 so the rendered `/contact-us` matches the preview's component vocabulary and section sequence. Activate the webform schema. No theme/CSS work in this cycle. Use existing components only. Mirrors the about-us Cycle 1 pattern (Canvas restructure first, CSS punch list second).

**Scope:**

1. **Webform activation** — flip `status: closed` → `status: open` in `config/sync/webform.webform.contact.yml`. Import via `drush cim`. Verify with `drush cget webform.webform.contact status` → `open`. Webform stays `page: false`.
2. **Webform schema cleanup** — remove the three `processed_text` intro elements (`contact_intro_graphic`, `contact_intro_heading`, `contact_intro_text`) from the schema. Keep the five form-field elements (`name`, `email`, `company_name`, `phone_number`, `message`) and `actions` exactly as-is. Update the title strings: "Your Name" → "Your name", "Your Email" → "Your email", "Your Company Name" → "Your company name", "Your Phone Number" → "Your phone number", "Message" → "Your message" (sentence case, parallel construction per R13/`pl_copy_brief.md`).
3. **Canvas 13 restructure** — assembly script (under `scripts/`) that wipes the existing 3-component tree and rebuilds it as four Canvas sections, mirroring the about-us pattern (kicker SDC + section/heading/text/button vocabulary, preserving each component's existing `component_version` hash per R14):

   **Section A — Hero (canvas, theme: white, edge-to-edge, centered):**
   - `kicker` SDC, variant centered, text "Get in touch"
   - `dripyard_base:heading` h1, center: true, "Let's talk about your quality and testing goals."
   - `dripyard_base:text`, italic, "Tell us where your suite is now, and we'll come back with a concrete next step — not a sales sequence."

   **Section B — Form (canvas, theme: white):**
   - `dripyard_base:heading` h2 (visually hidden or sr-only — keep semantic flow with one h2 per section; or omit if Canvas allows section-only-with-content)
   - `block.webform_block` referencing the `contact` webform (re-use the existing block; it's already on the page at delta 2)
   - SavvyCal sidebar block, rendered as direct children of Section B (stacked below form in Cycle 1):
     - `kicker` SDC text "Faster path"
     - `dripyard_base:heading` h2 "Prefer a quick call?"
     - `dripyard_base:text` "Pick a 30-minute slot on the calendar — same engineer who'd answer the form, no SDR layer in between."
     - `dripyard_base:button` (secondary variant) text "Book a slot →" href `https://savvycal.com/AndreAngelantoni/meet-with-andre`
     - `dripyard_base:text` (small/muted) "**Response time:** One business day, US Pacific. Most questions get a written reply before a meeting is needed."

   **Section C — What to expect (cream, theme: cream-equivalent / `surface-warm`, edge-to-edge):**
   - `kicker` SDC, variant centered, text "After you send"
   - `dripyard_base:heading` h2, center: true, "What to expect from the other side of this form."
   - `dripyard_base:text`, "No drip campaign, no 'thanks for your interest' autoresponder pretending to be a person. Three concrete steps."
   - `dripyard_base:grid-wrapper`, additional_classes: `grid-wrapper--3col` (mirror about-us §C convention; cards directly in `grid_cells` slot — no `grid-cell` wrappers, per about-us course-correction lessons)
     - `dripyard_base:card-canvas` × 3, copy verbatim from preview:
       - 01 / Acknowledgment — "A real reply, by a real engineer." + body
       - 02 / Discovery call — "Thirty minutes, screen-share if helpful." + body
       - 03 / Written next step — "A short proposal, not a slide deck." + body
       - F decides per `card-canvas.component.yml` whether the "01 / Acknowledgment" tag goes in an `eyebrow` prop or via title prefix; mirror about-us OSS convention (about-us Cycle-1 corrected rebuild removed eyebrow_text — verify what the OSS family uses; if the family has reverted to using eyebrow, follow that)

   **Section D — Closing CTA (espresso, theme: dark, edge-to-edge, centered):**
   - `kicker` SDC, variant centered, text "Already decided?"
   - `dripyard_base:heading` h2, center: true, "Skip the form — book the review."
   - `dripyard_base:text`, "If you already know you want a testing review, the calendar link is the fastest path. If you're still scoping, the form above is the right place."
   - `dripyard_base:button` (primary) text "Book a testing review" href `https://savvycal.com/AndreAngelantoni/meet-with-andre`
   - `dripyard_base:button` (ghost-on-dark variant) text "View services" href `/services`

4. **Redirect cleanup** — repoint redirect 89 (`/contact` source) from `internal:/page/13` to `internal:/contact-us` for cleanliness. Redirect 90 (`/form/contact` → `/contact-us`) stays as-is. Verified via `drush sql:query` after change.

5. **No theme files modified** — CSS-free cycle. All chrome comes from existing `dripyard_base` SDC defaults plus the active theme's section-zone classes (`theme--white`, `theme--cream`, `theme--dark`).

**Acceptance criteria:**

- [ ] `webform.webform.contact.yml` `status: open` (config import + `drush cget` confirm); `page: false` retained
- [ ] `/contact-us` returns HTTP 200 (existing alias still resolves to `/page/13`)
- [ ] Canvas 13 component count is 4 sections + their children (rough total 16–22 components depending on card-canvas children); deltas reordered cleanly with no dangling parent_uuid references
- [ ] Form renders: 5 input fields in correct order (name *, email *, company_name, phone_number, message *) with the preview-locked sentence-case labels
- [ ] Required-field markers present on `name`, `email`, `message` (HTML5 `required` + visible `*`)
- [ ] Form posts successfully — `drush eval` confirms a test submission lands and the `email_confirmation` + `email_notification` handlers fire
- [ ] Page renders 4 chrome bands in Canvas order: Hero (theme--white) → Form section (theme--white) → "What to expect" (cream / theme--light or surface-warm equivalent — F's call) → Closing CTA (theme--dark)
- [ ] Hero copy verbatim from preview: kicker "Get in touch", H1 "Let's talk about your quality and testing goals.", italic subhead from R13
- [ ] SavvyCal sidebar block present in Section B with `button` SDC (secondary variant) targeting `https://savvycal.com/AndreAngelantoni/meet-with-andre`, plus the kicker/heading/text/meta children listed in scope §3 §Section B
- [ ] "What to expect" 3 cards present in Section C using `dripyard_base:card-canvas` inside a `grid-wrapper` with `additional_classes: grid-wrapper--3col`, copy verbatim from preview (01 Acknowledgment / 02 Discovery call / 03 Written next step)
- [ ] Closing CTA on Section D with `theme: dark`; two `button` SDCs — primary "Book a testing review" → SavvyCal; ghost-on-dark variant "View services" → `/services`
- [ ] Redirect 89 (`/contact`) repointed to `internal:/contact-us`; redirect 90 unchanged
- [ ] Webform schema's three `processed_text` intro elements are absent (verified in `webform.webform.contact.yml` after `drush cex`)
- [ ] T1 (HTTP 200, content grep for: each kicker text, hero H1, form labels, SavvyCal URL, all 3 card titles, closing-CTA copy) + T2 (single H1, heading hierarchy h1→h2→h3 no skips, ARIA landmarks header/main/footer/nav, every input has associated `<label>` via `for=`, every required input has HTML5 `required` attribute, focus order top-to-bottom logical) PASS. **Note:** HTML5 `required` on native form controls is the sole required-field marker. Per WAI-ARIA Authoring Practices, `aria-required` is NOT added on top of HTML5 `required` for native inputs (the attribute is for composite/custom controls only). Original draft of this criterion incorrectly demanded both — corrected mid-Cycle-1 (T1 audit, 2026-05-08) when T flagged the discrepancy.
- [ ] Sibling-fit check: rendered `/contact-us` reads as a sibling of `/about-us` and `/open-source-projects` at the rendered-HTML level — same kicker variant convention, same section structure, same closing-CTA shape
- [ ] All Canvas component patches preserve `component_version` (do NOT set to NULL — R14)
- [ ] No theme files (CSS, twig, component schemas) modified — CSS-free cycle
- [ ] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/cycle-1-contact-us-{F,T,S}.md`

**Commit message:** `feat(contact-us): restructure Canvas to match preview`

---

### Cycle 2 — CSS punch list

**Pipeline:** O → F → T → S → O

**Objective:** Resolve every visual delta between Cycle-1 rendered page and the preview that S surfaces in its Cycle-1 audit. The Cycle-1 S handoff is the precise scope. CSS-only — no further template or schema edits.

**Confirmed scope** (refined post-Cycle-1, operator-approved 2026-05-08):

Cycle 1 shipped the Canvas component tree. Cycle 2 is the visual punch list — the operator's directive is to make `/contact-us` visually match `Previews/contact-us.html` at desktop and mobile, with one explicit non-negotiable: at end of cycle, the operator personally verifies every section against the preview before commit.

The visible deltas operator surfaced post-Cycle-1, plus deltas surfaced by S §Advisory and operator's own visual audit (`cycle-1-contact-us-O-audit.md`):

1. **Closing CTA kicker not visually centered** (operator-flagged). Text "ALREADY DECIDED?" sits at left edge of full-width parent, not above the centered H2. Root cause: when `kicker--centered` is a child of `dy-section__content` (full-width parent), CSS flips its `display` from `inline-flex` to `flex` (block-level) and `justify-content` defaults to `normal`/flex-start. About-us closing CTA has the same bug. **Fix at the SDC level** — add `justify-content: center` to the `.kicker--centered` rule when display is `flex`. Propagates the fix to all sibling pages (`/about-us` benefits too). L5 scope on `web/themes/custom/performant_labs_20260502/components/kicker/css/kicker.css` (or whichever file ships the variant). Verify no regression on hero/cream kickers (which use `inline-flex` and are already correct).

2. **Two-column form-grid** (operator-flagged). Section B's `dy-section__content` currently stacks the webform_block + SavvyCal sidebar children as siblings. Cycle 2 grids them into two columns: form (~1fr, max ~640px) + sidebar (320px), 64px gap, at ≥992px viewport. Below 992px stacks single-column. The sidebar children (kicker + heading + text + button + meta) need to be treated as a single column-cell, which means either wrapping them in a div (Canvas restructure) or using a CSS sibling-targeting trick to group them. F's Step-3 trace decides — wrapping is cleaner. L5 scope on `webform.css` and/or `section.css` extension.

3. **Form-input chrome** — hairline border (`1px solid var(--hairline)`), 8px radius (`var(--radius-md)`, currently 4px), 12×14 padding, focus ring `2px solid var(--primary)` with 2px offset (per `pl_design_brief.md` §Elevation). Override at L5 via a new `css/components/webform.css` (or extend Dripyard's webform stylesheet if it ships one). Inputs already have `max-width: 100%; box-sizing: border-box` (verified) — that part stays.

4. **Required-marker color** — Drupal's default `*` is red. Preview specifies `--accent-deep` (terracotta `#8E4A2A`). L5 scope override on the webform required-indicator span/marker.

5. **Sidebar polish** — `position: sticky; top: var(--space-2xl)` at desktop, `1px solid var(--hairline)` border around the sidebar block, `var(--radius-lg)` (12px) corners, `var(--space-xl)` (32px) internal padding. Kicker stays `--inline` variant (left-aligned, single rule before text). L5 scope on a wrapper class.

6. **Submit button label** — currently "Submit" (Drupal default), preview specifies "Send message". One-line webform config edit on `webform.webform.contact_form.yml` `actions.__submit__label: "Send message"`. Bundle into Cycle 2 since it's a copy/label change parallel to the form-field sentence-casing F already did.

7. **Hero H1 typography** — currently 72px / line-height 79.2px, preview specifies 56px / line-height 1.05 / letter-spacing -1.4px. Theme typography override at L3 or L5 scoped to the hero or to all H1s. Verify no regression on sibling pages — about-us H1 is also currently 72px theme default, so changing this affects /about-us too.

8. **What-to-expect cards** — already preview-compliant for eyebrow_text (Consolas/terracotta/12px/uppercase with `::before` left-rule, verified by operator audit). Spot-check hover border-color shift to primary; the design brief specifies hover state for `card-feature` chrome. If Dripyard's `card-canvas` doesn't already do this, add at L5.

9. **Mobile responsive** — verified Cycle-1 already inherits good mobile behavior (`grid-wrapper--3col` collapses 3→1 at <768px, dark-CTA buttons stack at <576px, form inputs `max-width: 100%`). Cycle 2 needs to confirm: (a) the two-column form-grid collapses to single-column < 992px, (b) the sidebar drops its sticky positioning at mobile, (c) submit button goes full-width below `sm`, (d) any input/sidebar overrides honor mobile breakpoints.

10. **Operator's preview-fidelity gate** — at end of cycle, operator personally walks every section against `Previews/contact-us.html` at 1280px desktop AND 375px mobile. Any visible delta blocks the commit.

**No `!important`.** Specificity escapes use `[class]` attribute selectors, consistent with prior cycles.

**Acceptance criteria:**

- [ ] Closing CTA kicker text visually centered above the H2 (kicker SDC `justify-content: center` fix lands; verified via JS that text rect centerX matches parent centerX). Same fix verified to render correctly on `/about-us` closing CTA.
- [ ] Form section at desktop (≥992px): two-column grid, form on left, SavvyCal sidebar on right, ~64px gap. Form column max-width visually matches preview (~640px). Sidebar column 320px.
- [ ] Form section at <992px: single-column stack, sidebar below form.
- [ ] Form-input chrome: `1px solid var(--hairline)` border, `var(--radius-md)` (8px) corners, focus ring `2px solid var(--primary)` with 2px offset visible on keyboard focus
- [ ] Required-marker `*` color is `var(--accent-deep)` (terracotta) on every required field
- [ ] Submit button text reads "Send message" (config edit confirmed in `webform.webform.contact_form.yml`)
- [ ] Sidebar visually matches preview: hairline border, 12px radius, 32px padding; sticky at desktop ≥992px
- [ ] Hero H1 size matches preview spec (56px / line-height 1.05 / letter-spacing -1.4px) — verify no regression on `/about-us` H1
- [ ] What-to-expect cards: hover border-color shifts to `var(--primary)` (verify; add at L5 if missing)
- [ ] Mobile 375px: no page-level horizontal scroll; form-grid collapses cleanly to single column; submit button full-width; what-to-expect cards collapse 3→1; sidebar drops sticky positioning
- [ ] WCAG 2.2 AA confirmed by S — focus ring on every form input ≥ 3:1 against canvas, accent-deep `*` required-marker ≥ 4.5:1 against canvas, ghost-on-dark border ≥ 3:1 against espresso
- [ ] No regression on `/`, `/services`, `/how-we-do-it`, `/articles`, `/open-source-projects`, `/about-us` (spot-check at least these six — Cycle 2 may touch shared component CSS, especially the kicker SDC fix)
- [ ] Pa11y on `/contact-us` returns 0 errors
- [ ] **Operator's preview-fidelity gate** — operator walks every section live at 1280px AND 375px against `Previews/contact-us.html` and confirms no visible delta. **This is the final gate; no commit without explicit operator sign-off.**
- [ ] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/cycle-2-contact-us-{F,T,S}.md`

**Commit message:** `feat(contact-us): css punch list — form chrome, sidebar, what-to-expect, mobile`

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator reviews `/contact-us` live in browser. Explicit "approved" required to open Cycle 2. |
| Cycle 2 commit | Operator reviews live + mobile (375px). Explicit "approved" required to merge `aa/pl-contact-us` to `main`. |

---

## Out of scope

- New webform fields (file upload, dropdowns, multi-step wizard) — preview is the locked field set
- Newsletter signup or marketing-list opt-in checkbox — explicitly excluded by the preview's privacy line ("no newsletter signup behind the form")
- reCAPTCHA / hCaptcha integration — preview ships only the Drupal honeypot; if spam volume warrants, add post-merge as its own runbook
- Confirmation page redesign (`/contact-us-thank-you`) — separate work, listed in `pl-plan--pages.md` as its own page
- Repointing prod `/contact-us` — local-only sprint per R1
- Rewriting hero or "what to expect" copy — copy is locked at preview state (R13)
- Form-submission handler customization — existing `email_confirmation` + `email_notification` handlers stay 1:1
- Pathauto patterns for other webforms — only the `contact` webform gets the `/contact-us` alias

---

## Rework loop

If S returns REWORK on any cycle:

1. O reads handoff-S, writes `docs/pl2/handoffs/cycle-N-contact-us-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `cycle-N-contact-us-F-rework.md`
3. T re-runs verification on changed files only, writes `cycle-N-contact-us-T-rework.md`
4. S re-audits, writes `cycle-N-contact-us-S-rework.md`
5. If S returns PASS → O commits with the cycle's commit message + rework note
6. If S returns REWORK on round 2 → O pauses and consults operator about whether acceptance criteria need revision

---

## Cleanup

After each cycle's commit lands, O deletes that cycle's handoff files (`cycle-N-contact-us-*.md`). Per OFTS workflow Step 5: handoffs are ephemeral coordination artifacts.

After Cycle 2 commits and `aa/pl-contact-us` merges to `main` (local, `--no-ff`, no push), the runbook stays — this file is permanent project documentation.
