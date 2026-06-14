# Sprint 11 — Cycle 2a — REWORK — 4 lingering orphan refs

**Branch:** `aa/pl-sprint-11-cycle-2a-orphan-themes` (continue)
**Mode:** autonomous

## What T found

T's `grep -l 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returned 5 files — not 0. The block.block.* narrow check passed, but 4 categories of refs survived F's `theme:uninstall + cex`:

1. **`system.theme.global.yml`** — `favicon.path` + `logo.path` both reference `themes/custom/performant_labs_20260411/` paths now gone on disk.
2. **`metatag.metatag_defaults.global.yml` + `metatag.metatag_defaults.front.yml`** — og:image + twitter:image tokens reference `performant_labs_20260418/assets/og-image.png` (deleted).
3. **`canvas.component.sdc.performant_labs_20260418.card-canvas.yml`** — orphan canvas component config entity. F's cex set `status: false` but didn't delete.
4. **`canvas.folder.4bf98081-fc8a-431b-a829-4417eff1529a.yml`** — "Dripyard Cards" folder lists the dead `sdc.performant_labs_20260418.card-canvas` as an item.

## Fixes

### Fix 1 — system.theme.global favicon + logo paths

Update both paths to point to the active theme `performant_labs_20260502`. If those assets don't exist in the active theme yet, either:
- (a) copy `favicon.ico` + `logo.svg` from the deleted theme's original lineage (look in `.git` history — `git show 0ec999538:web/themes/custom/performant_labs_20260411/<path>` to recover binary, then put it in `performant_labs_20260502/`), OR
- (b) clear both paths to use Drupal core defaults.

F picks based on what's idiomatic for this project.

### Fix 2 — metatag og:image / twitter:image

Update `metatag.metatag_defaults.global.yml` + `metatag.metatag_defaults.front.yml` og:image + twitter:image to:
- (a) point to an active-theme asset (if `performant_labs_20260502/assets/og-image.png` or similar exists), OR
- (b) clear to use Drupal default, OR
- (c) point to a public files asset.

F picks. If `og-image.png` needs to be recovered, use `git show` to extract from the deleted theme's history.

### Fix 3 — canvas.component.sdc.performant_labs_20260418.card-canvas.yml

Delete the file from `config/sync/`. The component is orphan — its provider theme is gone. `drush cex` should re-confirm the deletion is intentional.

### Fix 4 — canvas.folder.4bf98081-...yml

Remove the `sdc.performant_labs_20260418.card-canvas` entry from the folder's items list. Other items in the folder (presumably valid Dripyard/active-theme card-canvas references) stay.

## After fixes

`grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0.

## Acceptance criteria

- [ ] Zero refs to either orphan theme in `config/sync/`.
- [ ] Live pages all 200.
- [ ] Homepage favicon + logo render correctly (no 404 in network).
- [ ] og:image accessible (curl the URL the meta tag references and get 200).
- [ ] No regression on Canvas pages — Canvas component registry no longer points at the dead SDC.
- [ ] No `!important` introduced.

## Handoff

- F rework: `docs/pl2/handoffs/cycle-2a-orphan-themes-F-rework.md`
- T rework: `docs/pl2/handoffs/cycle-2a-orphan-themes-T-rework.md`
- S rework: `docs/pl2/handoffs/cycle-2a-orphan-themes-S-rework.md`
