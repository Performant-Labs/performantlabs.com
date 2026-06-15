# Sprint 1 — Conversion-Path Repair Runbook

> **Parent:** [`post-homepage-next.md`](post-homepage-next.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md) (O-F-T-S 4-agent pipeline)
> **Prerequisite:** `/services` overhaul shipped and merged to `main` (2026-05-05)
> **Upstream references:** [`GET-BACK-TO-THESE.md`](GET-BACK-TO-THESE.md) item D.2, [`pl-plan--services.md`](pl-plan--services.md) advisory carry-forward ADV-C1, ADV-CU1

---

## Status

| Item | State |
|---|---|
| Active theme | `performant_labs_20260502` |
| Branch | `aa/pl-sprint-1-conversion-repair` (from `main`) |
| Estimated effort | ~4 hours |
| **Status** | ✅ **Complete (2026-05-05).** Merged to `main`. |

---

## Objective

Every visitor-facing path from CTA to contact form must resolve without error. This sprint fixes the three conversion-path failures identified during the `/services` overhaul and earlier audits: the site-wide `/form/contact` 404, the unresolved FriendlyCaptcha sitekey on the contact form, and the missing H1 on `/contact-us`.

---

## Locked decisions

| ID | Decision | Source |
|---|---|---|
| S1-R1 | **Scope is conversion-path only.** No visual/CSS work beyond what the H1 fix requires. No footer link rewiring (that is Sprint 3). | this runbook |
| S1-R2 | **`/form/contact` resolution strategy:** determine whether a webform route, redirect, or alias satisfies the existing links. Every global-nav, header, and footer link currently pointing at `/form/contact` must resolve to the working contact form at `/contact-us`. | this runbook |
| S1-R3 | **FriendlyCaptcha sitekey:** source a real sitekey from the Performant Labs FriendlyCaptcha account. If no account exists, document that and fall back to disabling the captcha challenge cleanly (honeypot remains). | this runbook |
| S1-R4 | **`/contact-us` H1:** the page must have a semantic `<h1>`. Content to be determined by F based on the page's purpose — likely "Contact Us" or "Get in Touch". | this runbook |

---

## Operating rules

All agents follow the standing operating rules from `workflow-ofts.md`. Sprint-specific notes:

- **Three-Tier Verification Hierarchy** (`~/Sites/ai_guidance/testing/verification-cookbook.md`): T runs Tier 1 (curl/grep) + Tier 2 (ARIA/structural). S runs Tier 3 (visual). Tier 1 before Tier 2; Tier 2 before Tier 3. Never open a browser until the structural skeleton passes.
- **7-step CSS change workflow** (`docs/pl2/theme-change--workflow.md`): applies if any CSS is touched (unlikely in this sprint — scope is routes, config, and content).
- **Operational guidance** (`~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md`): curl first, browser last. Efficiency rules and known failure patterns.
- **Visual regression strategy** (`~/Sites/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md`): Tier 3 VR gates are blocking — S must pass before O commits.
- **Layer system** (`docs/pl2/theme-change.md`): override at the highest correct layer. L1 (Drupal config) → L3 (tokens) → L5 (component CSS) → L6 (Twig). Never patch at L4.
- **Dripyard guidance** (`~/Sites/ai_guidance/themes/dripyard-guidance.md`): color architecture, OKLCH, theme wrappers.
- **Canvas scripting protocol** (`~/Sites/ai_guidance/frameworks/drupal/theming/canvas-scripting-protocol.md`): if any Canvas patches are needed, **preserve `component_version`** — do NOT set to NULL (Canvas throws `OutOfRangeException`; corrected 2026-05-12 by Sprint 10 cycle 2a; see `workflow-ofts.md` §F prompt step 8).
- Read `.component.yml` before referencing any prop name — schema is source of truth.
- No `!important`. Stage files by explicit path (never `git add .`).

## Verification environment

| Item | Value |
|---|---|
| DDEV URL | `https://pl-performantlabs.com.3.ddev.site:8493/` |
| Port | `8493` (from host, not inside ddev exec) |
| SSL | Locally-trusted mkcert cert — no `-k` flag needed |
| Cache clear | `ddev drush cr` before every verification run |
| Pa11y | Run from host: `pa11y https://pl-performantlabs.com.3.ddev.site:8493/contact-us` |

---

## Cycle plan

Single cycle. One branch, one commit (or two if the FriendlyCaptcha sitekey requires a separate config export).

### Cycle 1 — Fix all three conversion-path issues

**Pipeline:** O → F → T → S → O

**Scope:**

1. **ADV-C1: `/form/contact` 404 sweep**
   - Audit every link site-wide that targets `/form/contact` (global nav "Contact us", header "Call today" CTA, footer "Get in touch" CTA, any other occurrences).
   - Determine the correct fix: path alias, redirect (301 from `/form/contact` → `/contact-us`), or menu-link href update. The `/contact-us` route already works (shipped in the services overhaul).
   - Implement the fix. Verify all previously-404 paths now resolve to the working contact form.

2. **D.2: FriendlyCaptcha sitekey**
   - Inspect the current FriendlyCaptcha config at `/admin/config/people/captcha/friendlycaptcha` (or equivalent config entity).
   - The rendered captcha currently shows `data-sitekey="${site_uuid}"` — a literal placeholder from the `drupal_cms_anti_spam` recipe.
   - If a real FriendlyCaptcha account exists: enter the sitekey via admin UI, export config, verify the captcha challenge initializes on `/contact-us`.
   - If no account exists: document that finding. Options: (a) create a FriendlyCaptcha account and configure, (b) disable the FriendlyCaptcha challenge cleanly so it does not render a broken widget, leaving honeypot as the sole anti-spam layer. F surfaces the question to O if unclear.

3. **ADV-CU1: `/contact-us` H1**
   - The `/contact-us` webform page currently renders with no `<h1>`.
   - Add an H1. If the page is a Canvas page, patch the entity. If it is a standard webform route, the fix is likely a block placement or webform title config change.
   - Verify heading hierarchy: `<h1>` followed by form labels, no skip-levels.

**Acceptance criteria:**

- [x] `/form/contact` returns 200 or 301 → `/contact-us` (no 404)
- [x] Every site-wide link that previously targeted `/form/contact` now reaches the working contact form
- [x] `/contact-us` renders a visible `<h1>` as the first heading on the page
- [x] `/contact-us` heading hierarchy is valid (no skip-levels)
- [x] FriendlyCaptcha `data-sitekey` on `/contact-us` is either a real UUID (captcha initializes) or the widget is cleanly removed (no broken placeholder)
- [x] Contact form submission works end-to-end (T verifies with a test submission or confirms form action resolves)
- [x] T1 (HTTP 200, content grep) + T2 (heading hierarchy, ARIA) pass on `/contact-us`
- [x] No regressions on `/services`, `/`, or `/articles` (T1 spot-check)
- [x] Pa11y on `/contact-us`: 0 errors
- [x] Files staged by explicit path; no `git add .`

**Handoff doc location:** `docs/pl2/handoffs/sprint-1-{F,T,S}.md`

**Commit message:** `fix(contact): resolve /form/contact 404 + captcha sitekey + contact-us H1`

---

## Approval Checkpoints

| After | Operator action |
|---|---|
| Cycle 1 commit | Operator visits `/contact-us` in browser, clicks every global-nav/header/footer contact link, verifies captcha renders or is cleanly absent. Explicit "approved" required to merge. |

---

## Out of scope

- Footer link text or structure changes (Sprint 3)
- Contact form intent-parameter handling (`?intent=…` query strings)
- Visual/CSS changes to the contact form layout
- New contact form fields or workflow changes
- FriendlyCaptcha account creation (if no account exists, document and defer)

---

## Rework loop

If S returns REWORK:

1. O reads handoff-S, writes `docs/pl2/handoffs/sprint-1-rework-issue.md` quoting S's findings
2. F reads the rework issue, fixes on the same branch, writes `sprint-1-F-rework.md`
3. T re-runs verification on changed files only, writes `sprint-1-T-rework.md`
4. S re-audits, writes `sprint-1-S-rework.md`
5. If S returns PASS → O commits and merges
6. If S returns REWORK on round 2 → O pauses and consults operator

---

## Cleanup

After merge to `main`, delete sprint-1 handoff files. This runbook stays as permanent project documentation.

---

## Key references

| What you need | Where |
|---|---|
| O-F-T-S pipeline — agent roles, handoff templates | `docs/pl2/workflow-ofts.md` |
| Three-Tier Verification Hierarchy (T1/T2/T3) | `~/Sites/ai_guidance/testing/verification-cookbook.md` |
| 7-step CSS change workflow | `docs/pl2/theme-change--workflow.md` |
| CSS layer system and override strategy | `docs/pl2/theme-change.md` |
| Operational guidance (efficiency rules, curl-first) | `~/Sites/ai_guidance/frameworks/drupal/theming/operational-guidance.md` |
| Visual regression strategy (Tier 3 VR gates) | `~/Sites/ai_guidance/frameworks/drupal/theming/visual-regression-strategy.md` |
| Dripyard color architecture, OKLCH, theme wrappers | `~/Sites/ai_guidance/themes/dripyard-guidance.md` |
| Layer 4 component-wrapper override pattern | `~/Sites/ai_guidance/frameworks/drupal/theme-planning/color-management.md` |
| Canvas scripting protocol | `~/Sites/ai_guidance/frameworks/drupal/theming/canvas-scripting-protocol.md` |
