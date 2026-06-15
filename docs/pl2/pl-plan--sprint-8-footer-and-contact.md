# Sprint 8 — Footer + contact webform sweep — Runbook

> **Parent:** [`pl-plan.md`](pl-plan.md)
> **Workflow:** [`workflow-ofts.md`](workflow-ofts.md)
> **Mode:** autonomous
> **Predecessor:** Sprint 7 ([wrap](handoffs/sprint-7-wrap.md))
> **Tech-debt source:** [`tech-debt-register.md`](tech-debt-register.md) §D "Routing / footer / forms" + §"Quick triage view" Bundle 3.

## Goal

Resolve four cross-cutting routing/content debts on the footer and contact-form path. These are real user-facing failures (404 on global nav CTAs; broken anchor; missing H1).

| ID | Surface | Item |
|---|---|---|
| F.8 | site footer | Services sub-list anchor `#testing-suite-takeover` is broken (live card ID is `#test-suite-takeover`). |
| F.9 | site footer | Footer "Contact us" link uses bare `/contact` (resolves via 301 to `/contact-us`). Should link to `/contact-us` directly. |
| ADV-C1 | global nav + header + footer CTAs | `/form/contact` returns 404 — affects global nav "Contact us" link, header "Call today" CTA, footer "Get in touch" CTA. Services-page CTAs already use `/contact-us` which works. |
| ADV-CU1 | `/contact-us` | Page has no H1. |

## Sources of truth (precedence)

1. WCAG 2.2 SC 2.4.6 (Headings and Labels) for ADV-CU1 — H1 is required on every page.
2. Drupal routing + webform configuration (live system state) — must resolve, no 404s.
3. `docs/pl2/Previews/*.html` — preview canonical for footer link text + anchor targets where relevant.
4. `docs/pl2/briefs/pl_design_brief.md` — token authority where any styling touches.

## Cycles

### Cycle 1 — Contact + footer audit

**Pipeline:** O → S → O (audit; no F, no T, no commit).

**Objective.** Inventory every contact-form CTA and every footer link site-wide. Confirm which return 200 vs 404. Identify the actual Drupal route(s) that serve the contact form (it's `/contact-us` per services runbook §R3 and Sprint 5 cycle 4 work — confirm). Determine whether ADV-C1's `/form/contact` 404 should be fixed by (a) redirecting `/form/contact` → `/contact-us`, (b) updating the links that point to `/form/contact` to point to `/contact-us`, or (c) creating a Drupal route at `/form/contact` that serves the same webform.

**Scope.** Sweep:
- Global nav (header) on every shipped page
- Header CTAs (e.g., "Call today")
- Footer (every column, every link, every anchor)
- All confirmed-shipped pages: `/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`
- `/contact-us` page DOM (count H1s, check heading hierarchy)
- The four ID anchors referenced by footer's Services sub-list (verify each card on `/services` has a matching ID — especially the `#testing-suite-takeover` vs `#test-suite-takeover` mismatch)

**S deliverables.**
- Markdown handoff + HTML report.
- Tables: every CTA / footer link with HTTP status; every anchor target with existence check.
- Recommended remediation per item (a/b/c style options where there's a routing decision; deterministic edits where there isn't).
- Cycle 2 carve recommendation.

**Acceptance criteria.**
- [ ] Every contact CTA enumerated (page, selector, href, HTTP status of href).
- [ ] Every footer link enumerated (column, label, href, status).
- [ ] Every Services-sub-list anchor target verified against `/services` DOM IDs.
- [ ] `/contact-us` H1 count + heading hierarchy probed.
- [ ] ADV-C1 remediation path recommended with rationale.
- [ ] Cycle 2 carve: single fix cycle vs split.

### Cycle 2..N — Fix cycles (defined by Cycle 1)

**Pipeline:** O → F → T → S → O.

Pre-committed carve rules:

- **Default expectation: one fix cycle.** All four items are small + related (routing/content on shared surfaces). If audit confirms scope is ≤ 6 files / coherent set, do it in one cycle.
- **Split only if needed.** If ADV-C1 requires a Drupal routing change (config import) that warrants separation from footer-text edits, split into:
  - Cycle 2a — `/form/contact` route fix (config or redirect)
  - Cycle 2b — Footer + H1 patches (Twig/template/menu/content)

**Acceptance per fix cycle.**
- [ ] Every CTA on the audit table returns 200 (or 301 → 200 for intentional redirects).
- [ ] `#testing-suite-takeover` link in footer now targets the correct card ID (whichever direction — fix link OR rename card ID; audit recommends).
- [ ] Footer "Contact us" links to `/contact-us` directly (no bare `/contact`).
- [ ] `/contact-us` has a single H1 matching the page title.
- [ ] No `!important`.
- [ ] T1 + T2 PASS on every page sweep-touched.
- [ ] No regression on `/`, `/services`, `/about-us`, `/articles`, `/how-we-do-it`, `/open-source-projects`.

### Final cycle — Site-wide CTA + footer link sweep (T + S)

**Pipeline:** O → T → S → O.

**Objective.** Verify every CTA + footer link site-wide returns 200; `/contact-us` clears WCAG 2.4.6; no regression.

## Approval Checkpoints (pre-committed)

| Checkpoint | Pre-commitment |
|---|---|
| Cycle 1 carve | O carves per audit recommendation; no operator surface. |
| ADV-C1 remediation path | If audit can pick deterministically from (a)/(b)/(c), proceed. If ambiguous, default to (b) — update links to point to `/contact-us` (canonical route per R3) — lowest-risk + no config-import change. |
| F.8 fix direction | Default: rename the footer link to match the live card ID. If audit shows preview's `#testing-suite-takeover` is the canonical anchor (matches content brief), rename the card ID instead. Audit decides. |
| F Step-3 layer trace | Twig/template/menu/content + L5 CSS if any. No L3 changes expected. |
| Drupal config import (if any) | F runs `ddev drush cim --diff` and shows the diff in handoff before applying. If diff includes unexpected schema deletion, hard-stop. |
| S ADVISORY-HOLD | Silent park, continue. |
| Pa11y | PC-5 "0 new errors" wording. |

## Hard-stop floor

Verification env broken; any shipped landing page returns non-200; new WCAG regression on shipped pages; unexpected schema deletion at config import.

## Sprint posture

- Local-only; never push.
- `--no-ff` per cycle into integration `aa/pl-sprint-8-footer-and-contact`.
- Integration `--no-ff` into local `main` at wrap.
- Orchestrator log + wrap doc per standard.

## Out of scope

- Other tech-debt bundles (4 a11y, 6 architecture, 7 hygiene).
- Footer **redesign** — only fix broken links/anchors, not restructure.
- `/contact-us` page **layout** — only add the missing H1, not restyle.
- `/contact-us` form intent-handling (services-page CTAs emit `?intent=…` already; form is free to ignore).
