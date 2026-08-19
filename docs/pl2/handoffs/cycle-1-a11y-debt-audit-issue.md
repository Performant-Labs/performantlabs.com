# Sprint 9 — Cycle 1 — A11y debt audit (S-only)

**Branch:** `aa/pl-sprint-9-cycle-1-audit`
**Pipeline:** O → S → O (audit-only)
**Mode:** autonomous

## Objective

Three threads:

1. **FU-3 scope.** Recommend a concrete pa11y-ci config artifact path. Probe the repo for existing JS tooling (`package.json` at project root? in `web/themes/custom/performant_labs_20260502/`? elsewhere?) and choose between (a) `.pa11yci.json` config-only artifact + `pa11y-ci` invocation lines documented, or (b) `npm install --save-dev pa11y-ci` plus a runner script. Provide the exact allowlist entries with selectors + WCAG rule IDs.

2. **FU-7b root cause.** Find the template / view config / SDC component on `/articles` that emits `<h3>` without an intervening `<h2>`. Identify the smallest semantic fix. (Sprint 5 + 8 final cycles both confirmed the heading skip is still present.)

3. **Accumulated a11y items.** Sweep all 7 shipped pages: heading hierarchy, landmark integrity, alt text, keyboard focus visibility, form labels, link discernibility. Surface any NEW items not in the register.

## Scope

All 7 shipped pages — `/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`. FU-7b focus on `/articles`.

## Tooling probe (for FU-3)

- `pa11y` is installed at `/opt/homebrew/bin/pa11y` (host shell).
- `pa11y-ci` is NOT installed.
- No `.pa11yci*` files at project root.
- Check: does any `package.json` exist anywhere in the repo where pa11y-ci could be wired? (Search `find . -name package.json -not -path '*/node_modules/*' -maxdepth 4` or similar.)
- If `package.json` exists, recommend `npm install --save-dev pa11y-ci`. If not, recommend committing a `.pa11yci.json` config-only artifact + documenting the `npx pa11y-ci` or `pa11y --config .pa11yci.json` invocation in the wrap doc.

## Known allowlist entries (from Sprint 5–8 work)

These two should be in the allowlist. Audit verifies selectors are current.

1. Primary button white-on-teal contrast `2.21:1` — selector likely `.button--primary` or `a.button.button--primary` — WCAG rule `WCAG2AA.Principle1.Guideline1_4.1_4_3.G145`.
2. Breadcrumb link teal-on-cream contrast `3.12:1` to `3.58:1` — selector likely `.breadcrumb a` or similar — same rule.

Audit may surface a third (button-small 35 px touch-target was flagged by Sprint 5 final but S overrode it; check whether pa11y catches a different version).

## FU-7b investigation

Run `curl http://localhost/articles | grep -E 'h[1-6]'` (via `ddev exec`) to dump the heading sequence. Then trace each `<h3>` back to its emitting template / SDC. Drupal article cards typically come from a view or block; identify which.

## Acceptance

- [ ] `package.json` existence + location reported.
- [ ] FU-3 install recommendation with exact `.pa11yci.json` content sketch + allowlist entries with selectors + WCAG rule IDs.
- [ ] FU-7b root cause file path identified (Twig template, view config, or SDC component file).
- [ ] FU-7b recommended fix: promote h3 to h2 OR insert hidden h2.
- [ ] Site-wide a11y sweep: any new items surfaced as candidate tech-debt entries.
- [ ] Brand-exception re-eval position: lift / keep / token-tweak.
- [ ] Cycle 2 carve: 1 cycle vs 2a/2b split.
- [ ] Verdict PASS.

## Handoff

- Markdown: `docs/pl2/handoffs/cycle-1-a11y-debt-audit-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-a11y-debt-audit-report.html`
- Probe artifacts: `docs/pl2/handoffs/screenshots/sprint-9-cycle-1/`

## Operating rules

- T precondition N/A.
- Binding signal: pa11y output + DOM heading-sequence dump + template file paths.
- Visual screenshots not required.
- `ddev exec curl http://localhost/<path>` for HTTP probes.
