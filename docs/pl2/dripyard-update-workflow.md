# DripYard Update Workflow

When a new DripYard release ships, follow this procedure to update the pristine parents
(`dripyard_base` + `neonbyte`) without touching our subtheme.

## Why this works
All our customization lives in `web/themes/custom/performant_labs_v2`. The parents
(`web/themes/dripyard_themes/{dripyard_base,neonbyte}`) are pristine and tracked.
Updating = overwrite the parents, re-run the audit pipeline as the regression guard.

---

## Steps

### 1 — Backup
```bash
git checkout -b aa/dripyard-update-<version>
ddev export-db --file=docs/pl2/backups/pre-dripyard-<version>-$(date +%Y%m%d).sql.gz
ddev drush cex   # baseline config export
```

### 2 — Download + read the CHANGELOG
- Download the new zip from the [dripyard.com dashboard](https://dripyard.com/).
- **Read the CHANGELOG** for both `dripyard_base` and `neonbyte` before overwriting.
  Look for: breakpoint changes, component-API changes, removed CSS custom properties,
  library-name changes. Any of these may require a corresponding subtheme update.

### 3 — Overwrite the pristine parents
```bash
unzip neonbyte-<version>.zip -d /tmp/dripyard-<version>
# Overwrite — parents are pristine so this is always clean
cp -r /tmp/dripyard-<version>/dripyard_themes/dripyard_base web/themes/dripyard_themes/
cp -r /tmp/dripyard-<version>/dripyard_themes/neonbyte       web/themes/dripyard_themes/
# Keep the starter reference current too
cp -r /tmp/dripyard-<version>/dripyard_themes/neonbyte_subtheme web/themes/dripyard_themes/
```

Commit the vendor bump:
```bash
git add web/themes/dripyard_themes
git commit -m "chore(theme): bump DripYard to <version>"
```

### 4 — Rebuild and check Drupal sees the new version
```bash
ddev drush cr
ddev drush pm:list --type=theme | grep -E 'dripyard|neonbyte'
# Should show the new version numbers
```

### 5 — Run the audit pipeline (the regression guard)
```bash
# Scan roots = subtheme only (parents are context-only)
python3 ~/Sites/ai_guidance/pipelines/website-audit/core/tools/css-scan.py \
  --cwd "$PWD" \
  --root web/themes/custom/performant_labs_v2 \
  --injected-prefix=--theme-setting- \
  --injected-prefix=--drupal-displace- \
  --injected-prefix=--offset-from-header \
  --out docs/pl2/handoffs/audits/$(date +%Y%m%d-%H%M%S)-dripyard-<version>/css-scan.json
```

Or launch the full UI: `~/Sites/ai_guidance/pipelines/website-audit/ui/auditctl start`

Look for new undefined-var or over-reach warnings that the CHANGELOG didn't flag.
If the CHANGELOG mentioned API changes, verify the subtheme's `libraries-extend` targets
still exist in the new parent (component names occasionally change across major versions).

### 6 — Visual / T2.5 check
Spot-check the homepage, a content page, and the articles listing visually at 375/768/1280.
Verify the nav breakpoint still works at 1000px (hamburger at 999, inline at 1001).

### 7 — Deploy
```bash
git push origin aa/dripyard-update-<version>
# Review + merge to main when satisfied
# Pantheon deploy as usual
```

---

## Notes
- **Our subtheme is untouched by the overwrite** — `web/themes/custom/performant_labs_v2` is never in the vendor path.
- **W-06 (nav 1000px):** DripYard's breakpoint is 1000px; ours matches. If a future release changes it, update the profile and nav contract note accordingly.
- **W-01 (`!important`/`[class]`):** Not present in 1.1.4 — not an issue. Re-check on major releases.
