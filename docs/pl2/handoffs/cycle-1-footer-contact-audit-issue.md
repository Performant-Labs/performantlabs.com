# Sprint 8 — Cycle 1 — Footer + contact audit (S-only)

**Branch:** `aa/pl-sprint-8-cycle-1-audit`
**Pipeline:** O → S → O (audit-only)
**Mode:** autonomous

## Objective

Inventory every contact-form CTA and every footer link site-wide. Confirm each href's HTTP status. Verify Services sub-list anchor targets against `/services` card IDs. Probe `/contact-us` for H1 + heading hierarchy. Recommend Cycle 2 carve + ADV-C1 remediation path.

## Scope

Pages to sweep (all shipped):
- `/` (homepage)
- `/services`
- `/about-us`
- `/articles`
- `/contact-us`
- `/how-we-do-it`
- `/open-source-projects`

Items per page:
- Every `<a>` in `<header>`, every `<a>` in `<nav>`, every header CTA (button/link styled as CTA)
- Every `<a>` in `<footer>` (every column, every anchor)
- For each href: HTTP status (200, 301→200, 404).
- For each `#fragment` href: target ID existence in destination page DOM.

`/contact-us` page DOM:
- `document.querySelectorAll('h1').length` — should be exactly 1.
- Heading hierarchy (no skipped levels).
- Title text vs nav label vs `<title>` consistency.

## ADV-C1 remediation paths to evaluate

Per Sprint 8 runbook PC-2, the default is (b) update links → `/contact-us`. Audit may pick (a) or (c) with rationale:

- **(a)** redirect `/form/contact` → `/contact-us` (Drupal redirect or .htaccess) — preserves any incoming external links; needs config or webserver change.
- **(b)** update offending links to `/contact-us` directly — no config; simpler; loses any external bookmarks of `/form/contact` (probably none).
- **(c)** create a Drupal route at `/form/contact` that serves the contact webform — config-import work; doubles canonical routes.

## F.8 fix direction to evaluate

Audit checks both `/services` card IDs:
- Live card IDs (current DOM) — confirm which exists: `#test-suite-takeover` (no extra "-ing-").
- Content brief: `docs/pl2/Existing Pages/Design1/services.md` + `Target1/services--engagement-cards.md` — what's the canonical anchor name?
- Preview: `docs/pl2/Previews/services.html` — anchor name?

Default (per PC-3): rename footer link to match live card ID. Override only if content brief explicitly specifies `#testing-suite-takeover`.

## Acceptance criteria

- [ ] Site-wide CTA + footer-link inventory table (page, label, href, HTTP status, anchor existence if `#fragment`).
- [ ] Every 404 enumerated with the affected CTA list.
- [ ] `/contact-us` H1 count + heading hierarchy probed and reported.
- [ ] ADV-C1 remediation path recommended with rationale.
- [ ] F.8 fix direction recommended (rename link vs rename card ID) with rationale.
- [ ] Cycle 2 carve: single fix cycle or split.
- [ ] Verdict PASS.

## Out of scope

- Fixing anything. Audit only.
- Body links inside `/articles` article content (only the global chrome: header, nav, footer).
- Footer **redesign** — audit only existing links.

## Handoff locations

- Markdown: `docs/pl2/handoffs/cycle-1-footer-contact-audit-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-footer-contact-audit-report.html`
- Screenshots/probe scripts: `docs/pl2/handoffs/screenshots/sprint-8-cycle-1/`

## Operating rules

- T precondition N/A.
- Binding signal: HTTP status + DOM element existence (not pixel diff).
- Use `curl -o /dev/null -w '%{http_code}'` via `ddev exec` per memory `feedback_ofts_s_checklist_completeness.md`.
- Cache-clear `ddev drush cr` before HTTP probes.
