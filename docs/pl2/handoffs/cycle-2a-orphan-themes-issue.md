# Sprint 11 — Cycle 2a — Orphan-theme uninstall + cleanup

**Branch:** `aa/pl-sprint-11-cycle-2a-orphan-themes`
**Pipeline:** O → F → T → S → O
**Mode:** autonomous

## Objective

Uninstall the two orphan themes `performant_labs_20260411` + `performant_labs_20260418`, export config, delete on-disk theme directories. **AC binding:** live state pixel-identical at 1280 on homepage (the page that historically rendered through these themes' lineage).

## Sources (audit-confirmed)

- `/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/cycle-1-hygiene-audit-S.md` — Thread A inventory.
- Per audit: `drush pm:list` confirms both still installed; 22 orphan `block.block.*.yml` configs reference them in `config/sync/`.

## Required sequence

1. `ddev drush theme:uninstall performant_labs_20260411 performant_labs_20260418 -y`
2. `ddev drush config:export -y` — captures the un-install + drops the 22 orphan block configs (Drupal auto-removes block configs for uninstalled themes).
3. `rm -rf web/themes/custom/performant_labs_20260411 web/themes/custom/performant_labs_20260418`
4. Verify active default theme is still `performant_labs_20260502`.
5. Live pages all return 200; homepage at 1280 pixel-identical to pre-cycle baseline.

## Out of scope

- Touching the active theme.
- Any other themes (contrib, dripyard, etc.).

## Acceptance criteria

- [ ] `drush pm:list --status=enabled --type=theme` no longer lists the two orphan themes.
- [ ] Active default theme remains `performant_labs_20260502` (`drush cget system.theme default`).
- [ ] `config/sync/` no longer has block.block configs referencing the orphan themes (count drops from 22 to 0).
- [ ] On-disk theme directories deleted.
- [ ] Live pages all return 200: `/`, `/services`, `/about-us`, `/articles`, `/contact-us`, `/how-we-do-it`, `/open-source-projects`.
- [ ] Homepage `/` AE=0 at 1280 vs pre-cycle baseline (S verification).
- [ ] No `!important` introduced (none expected — config + filesystem only).
- [ ] Files staged by explicit path.

## Handoff

- F: `docs/pl2/handoffs/cycle-2a-orphan-themes-F.md`
- T: `docs/pl2/handoffs/cycle-2a-orphan-themes-T.md`
- S: `docs/pl2/handoffs/cycle-2a-orphan-themes-S.md`
- Report: `docs/pl2/handoffs/cycle-2a-orphan-themes-report.html`
- Screenshots: `docs/pl2/handoffs/screenshots/sprint-11-cycle-2a/`

## Commit message

`chore(themes): cycle 2a — uninstall + delete orphan themes _20260411 + _20260418`
