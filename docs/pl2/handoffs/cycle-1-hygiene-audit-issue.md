# Sprint 11 — Cycle 1 — Hygiene audit (S-only)

**Branch:** `aa/pl-sprint-11-cycle-1-audit`
**Pipeline:** O → S → O (audit-only)
**Mode:** autonomous

## Objective

Audit five threads to support a zero-tech-debt sprint close.

## Threads

### Thread A — Orphan theme directories

Sprint 8 audit identified `web/themes/custom/performant_labs_20260411/` and `web/themes/custom/performant_labs_20260418/` as old theme directories containing dead `<a href="/contact">` strings.

- Confirm via `ddev drush config:get core.extension` that neither is installed.
- Enumerate disk size + file count of each.
- Verify no live consumer (grep imports across the active theme + modules + config).
- Recommend deletion safety: safe-to-delete / leave with rationale.

### Thread B — Merged cycle branches

- `git branch --merged main | grep aa/pl-sprint-` — every branch listed is merged into main.
- Enumerate; classify each as cycle-branch (safe to delete) vs integration-branch (also safe but bigger scope).
- Spot-check 2-3 by `git log <branch> --oneline | head` to confirm they're cycle-debt artifacts.
- Recommend deletion list.

### Thread C — FU-5 (homepage §J.4 "How we do it" header wrap at 1280)

- Live homepage at 1280 — does the header nav label "How we do it" wrap to two lines?
- Sprint 4 wrap noted the issue was "probably resolved by phase-8.6 header rework" but not visually re-verified.
- Playwright screenshot at 1280×800 + visual inspection.

### Thread D — `/open-source-projects` Community section P2 marker

Sprint 10 cycle 2b.2 left P2's transition selector active because `/open-source-projects` Community section was a P2 consumer (`theme--white` + `kicker--centered`) without a marker.

- Identify the entity ID + section index of the Community section on `/open-source-projects`.
- Verify it currently matches the OLD `.dy-section.theme--white:has(.dy-section__header .kicker--centered)` selector and will need the new `.dy-section--centered-white` marker.
- Recommend approach: single Cycle 2 mini-refactor (add marker + drop old `:has` half of P2 in `dy-section.css`) with AE=0 binding.

### Thread E — FU-4 (mkcert SSL chain)

Document the operator-side fix for the wrap. Probable fix is one-line `.zshrc`/`.bashrc` addition: `export CURL_CA_BUNDLE=$(mkcert -CAROOT)/rootCA.pem` or system-trust-store import of `mkcert -CAROOT`'s root CA.

- Verify the mkcert root CA path on this host.
- Provide the exact shell-config line.
- Note: cannot be applied by F/O (requires operator's shell config change).

## Acceptance

- [ ] Thread A: orphan-theme deletion safety classification + disk impact.
- [ ] Thread B: merged-branch deletion list.
- [ ] Thread C: FU-5 J.4 verdict (clean / regressed) at 1280.
- [ ] Thread D: /open-source-projects Community section entity ID + index + recommended approach.
- [ ] Thread E: FU-4 exact shell-config line + mkcert root CA path.
- [ ] Cycle 2 carve recommendation.
- [ ] Verdict.

## Handoff

- Markdown: `docs/pl2/handoffs/cycle-1-hygiene-audit-S.md`
- HTML report: `docs/pl2/handoffs/cycle-1-hygiene-audit-report.html`
- Probe artifacts: `docs/pl2/handoffs/screenshots/sprint-11-cycle-1/`

## Operating rules

- T precondition N/A.
- Binding signals: drush output + git output + grep output + 1280 homepage screenshot.
- Use `ddev exec` for drush/curl probes.
