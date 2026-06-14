# Handoff-F: Cycle 2a - Orphan theme uninstall + cleanup

**Date:** 2026-05-12
**Branch:** `aa/pl-sprint-11-cycle-2a-orphan-themes`
**Issue:** `docs/pl2/handoffs/cycle-2a-orphan-themes-issue.md`

## Confirmation table (autonomous mode)

| Field | Value |
|---|---|
| Page being overhauled | N/A -- config + filesystem cleanup, no page-specific work |
| Issue | `cycle-2a-orphan-themes-issue.md` |
| Working branch | `aa/pl-sprint-11-cycle-2a-orphan-themes` |
| Runbook phase | Sprint 11 Cycle 2a |
| Input documents read | Issue, `cycle-1-hygiene-audit-S.md` Thread A |
| Acceptance criteria count | 8 |
| Handoff document path | `docs/pl2/handoffs/cycle-2a-orphan-themes-F.md` |
| CSS workflow path | N/A -- no CSS changes |
| Component schema source | N/A -- no component changes |

## What was done

1. **`ddev drush theme:uninstall performant_labs_20260411 performant_labs_20260418 -y`** -- both themes uninstalled cleanly. No block-placement errors.
2. **`ddev drush config:export -y`** -- exported config. Drupal auto-removed 22 orphan block configs, 2 theme settings configs, and 1 canvas dry_run_test config (24 deletions total). Also updated `core.extension.yml` (removed 2 theme entries), `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` (status set to false, theme dependency removed), and `canvas.folder.9ba74396-*.yml` (removed dry_run_test reference from folder listing).
3. **`rm -rf`** both on-disk theme directories (74 files, ~2.8 MB freed).
4. **Verified** default theme unchanged, all 7 pages HTTP 200.

## Layer decisions

N/A -- no CSS changes in this cycle. All changes are config (drush uninstall + cex) and filesystem (directory deletion).

## Deviations from spec

None.

## ADVISORY: cex diff beyond expected scope

The `config:export` produced 3 "Update" entries and 1 extra "Delete" beyond the 22 orphan block configs + `core.extension`:

| File | Operation | Assessment |
|---|---|---|
| `core.extension.yml` | Update (2 lines removed) | Expected -- removed the two theme entries |
| `canvas.component.sdc.performant_labs_20260418.card-canvas.yml` | Update | Expected cascade -- Canvas marked component `status: false` and removed theme dependency since the theme is gone |
| `canvas.folder.9ba74396-170e-413a-9bae-9620dd4e55fd.yml` | Update | Expected cascade -- removed `sdc.performant_labs_20260418.dry_run_test` from folder item list |
| `canvas.component.sdc.performant_labs_20260418.dry_run_test.yml` | Delete | Expected cascade -- Canvas component config for deleted theme |
| `performant_labs_20260411.settings.yml` | Delete | Expected -- theme settings for uninstalled theme |
| `performant_labs_20260418.settings.yml` | Delete | Expected -- theme settings for uninstalled theme |

**Verdict:** All extra diff is directly caused by the theme uninstall cascade. No unexpected drift. Safe to proceed.

## Verification results (T1 + T2)

### T1: Themes no longer listed

```
$ ddev drush pm:list --status=enabled --type=theme | grep performant_labs_2026041
(no output -- confirmed absent)
```

### T1: Default theme unchanged

```
$ ddev drush cget system.theme default
'system.theme:default': performant_labs_20260502
```

### T1: Orphan block configs removed

```
$ ls config/sync/block.block.performant_labs_2026041* | wc -l
0
```

### T1: On-disk directories deleted

```
$ ls -d web/themes/custom/performant_labs_2026041*
(no matches -- confirmed deleted)
```

### T1: HTTP 200 on all 7 shipped pages

```
/ -> 200
/services -> 200
/about-us -> 200
/articles -> 200
/contact-us -> 200
/how-we-do-it -> 200
/open-source-projects -> 200
```

### T2: core.extension.yml diff is clean

Only 2 lines removed (the two orphan theme entries). No other changes to module or theme lists.

## WCAG contrast ratios

N/A -- no visual changes in this cycle.

## Mobile responsive behavior

N/A -- no responsive overrides in this phase.

## Autonomous decisions

1. **ADVISORY assessment on cex extra diff:** The config export produced 3 updates and 1 extra deletion beyond the 22 block configs and core.extension. I assessed all as expected cascading behavior from the theme uninstall (Canvas component status change, folder item removal, dry_run_test deletion, theme settings deletion). Proceeded without escalating to O because all extra entries reference the uninstalled themes directly and no unrelated config was touched.

## Known issues

None. All 8 acceptance criteria are met (except AC6 "AE=0 at 1280" which is S's responsibility).

## Files changed

**Deleted from `config/sync/` (26 files):**
- `config/sync/block.block.performant_labs_20260411_book_navigation.yml`
- `config/sync/block.block.performant_labs_20260411_breadcrumbs.yml`
- `config/sync/block.block.performant_labs_20260411_content.yml`
- `config/sync/block.block.performant_labs_20260411_footer.yml`
- `config/sync/block.block.performant_labs_20260411_main_menu.yml`
- `config/sync/block.block.performant_labs_20260411_messages.yml`
- `config/sync/block.block.performant_labs_20260411_page_title.yml`
- `config/sync/block.block.performant_labs_20260411_primary_admin_actions.yml`
- `config/sync/block.block.performant_labs_20260411_primary_local_tasks.yml`
- `config/sync/block.block.performant_labs_20260411_secondary_local_tasks.yml`
- `config/sync/block.block.performant_labs_20260411_site_branding.yml`
- `config/sync/block.block.performant_labs_20260418_book_navigation.yml`
- `config/sync/block.block.performant_labs_20260418_breadcrumbs.yml`
- `config/sync/block.block.performant_labs_20260418_content.yml`
- `config/sync/block.block.performant_labs_20260418_footer.yml`
- `config/sync/block.block.performant_labs_20260418_main_menu.yml`
- `config/sync/block.block.performant_labs_20260418_messages.yml`
- `config/sync/block.block.performant_labs_20260418_page_title.yml`
- `config/sync/block.block.performant_labs_20260418_primary_admin_actions.yml`
- `config/sync/block.block.performant_labs_20260418_primary_local_tasks.yml`
- `config/sync/block.block.performant_labs_20260418_secondary_local_tasks.yml`
- `config/sync/block.block.performant_labs_20260418_site_branding.yml`
- `config/sync/canvas.component.sdc.performant_labs_20260418.dry_run_test.yml`
- `config/sync/performant_labs_20260411.settings.yml`
- `config/sync/performant_labs_20260418.settings.yml`

**Modified in `config/sync/` (3 files):**
- `config/sync/core.extension.yml` -- removed 2 theme entries
- `config/sync/canvas.component.sdc.performant_labs_20260418.card-canvas.yml` -- status false, deps cleared
- `config/sync/canvas.folder.9ba74396-170e-413a-9bae-9620dd4e55fd.yml` -- removed dry_run_test from folder

**Deleted on-disk theme directories (74 files across 2 dirs):**
- `web/themes/custom/performant_labs_20260411/` (entire directory, 32 files)
- `web/themes/custom/performant_labs_20260418/` (entire directory, 42 files)

**Total: 102 files changed** (99 deleted, 3 modified)
