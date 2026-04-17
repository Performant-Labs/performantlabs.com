# Drupal 11.3 Upgrade Plan

## Branch Information
- **Branch**: `aa/drupal-11.3-upgrade`
- **Purpose**: Isolated upgrade testing before merging to main
- **Parent Branch**: `main`

## Current Status
- **Current Version**: Drupal 11.1.6
- **Target Version**: Drupal 11.3.7
- **Goal**: Enable Canvas or Display Builder module installation

## Upgrade Feasibility

✅ **UPGRADE IS POSSIBLE** - Dry-run completed successfully

### What Will Be Updated

**Core Packages:**
- `drupal/core`: 11.1.6 → 11.3.7
- `drupal/core-recommended`: 11.1.6 → 11.3.7
- `drupal/core-composer-scaffold`: 11.1.6 → 11.3.7

**Symfony Components** (52 packages):
- All Symfony packages: 7.2.x → 7.4.8
- New packages: `symfony/polyfill-php84`, `symfony/polyfill-php85`

**Other Dependencies:**
- `twig/twig`: 3.19.0 → 3.22.2
- `guzzlehttp/guzzle`: 7.9.3 → 7.10.0
- `guzzlehttp/psr7`: 2.7.1 → 2.8.1
- `mck89/peast`: 1.16.3 → 1.17.5
- `asm89/stack-cors`: 2.2.0 → 2.3.0
- And more...

**Total Changes:**
- 2 new packages installed
- 52 packages upgraded
- 2 packages removed (doctrine/deprecations, doctrine/annotations)

## Security Note
⚠️ **19 security vulnerabilities** found affecting 8 packages
- These should be addressed during the upgrade

## Upgrade Steps

### 1. Preparation (CRITICAL)
```bash
# Backup database
ddev drush sql:dump > backup-pre-11.3-upgrade-$(date +%Y%m%d).sql

# Backup files
tar -czf files-backup-$(date +%Y%m%d).tar.gz web/sites/default/files

# Export current configuration
ddev drush config:export -y

# Commit all changes to git
git add -A
git commit -m "Pre-11.3 upgrade backup"
```

### 2. Perform Upgrade
```bash
# Update Drupal core and all dependencies
ddev composer update "drupal/core-*" --with-all-dependencies

# Run database updates
ddev drush updatedb -y

# Rebuild cache
ddev drush cache:rebuild

# Check for errors
ddev drush status
```

### 3. Post-Upgrade Testing
```bash
# Check module status
ddev drush pm:list --status=enabled

# Run any pending updates
ddev drush updatedb -y

# Clear all caches
ddev drush cache:rebuild

# Test site functionality
ddev launch
```

### 4. Install Canvas AND Display Builder

**Install Both Modules:**
```bash
# Install Canvas
ddev composer require drupal/canvas
ddev drush pm:enable canvas -y

# Install Display Builder and dependencies
ddev composer require drupal/ui_patterns:^2.0.15
ddev composer require drupal/ui_patterns_library
ddev composer require drupal/display_builder

# Enable Display Builder modules
ddev drush pm:enable ui_patterns ui_patterns_library display_builder -y

# Final cache rebuild
ddev drush cache:rebuild
```

**Why Both?**
- **Canvas**: Simpler, component-based page building
- **Display Builder**: Advanced UI Patterns integration, more powerful for complex layouts
- Having both gives maximum flexibility for the work log dashboard

## Rollback Plan

If something goes wrong:

```bash
# Restore database
ddev import-db --file=backup-pre-11.3-upgrade-YYYYMMDD.sql

# Restore composer.lock
git checkout composer.lock

# Reinstall dependencies
ddev composer install

# Rebuild cache
ddev drush cache:rebuild
```

## Risk Assessment

### Low Risk ✅
- Minor version upgrade (11.1 → 11.3)
- Dry-run completed successfully
- All dependencies resolve cleanly
- Symfony updates are compatible

### Medium Risk ⚠️
- 52 packages being updated
- Some contrib modules may need updates
- Custom code may need testing

### Mitigation
- Full backup before upgrade
- Test on local/dev environment first
- Review release notes for breaking changes
- Test all custom functionality after upgrade

## Timeline Estimate
- **Preparation**: 30 minutes (backups, git commit)
- **Upgrade execution**: 15-20 minutes
- **Testing**: 1-2 hours (thorough site testing)
- **Total**: 2-3 hours

## Breaking Changes to Review

Check Drupal 11.3 release notes:
- https://www.drupal.org/project/drupal/releases/11.3.0
- https://www.drupal.org/project/drupal/releases/11.3.7

## Post-Upgrade Checklist

- [ ] Site loads without errors
- [ ] Admin interface accessible
- [ ] Content displays correctly
- [ ] Forms work (contact, webforms, etc.)
- [ ] User login/logout works
- [ ] Views display correctly
- [ ] Custom modules function
- [ ] Theme renders properly
- [ ] Cron runs successfully
- [ ] No PHP errors in logs
- [ ] Configuration import/export works
- [ ] Security updates applied

## Recommendation

**Proceed with upgrade** ✅

The upgrade path is clean and should be straightforward. The main benefits:
1. Access to Canvas and Display Builder modules
2. 19 security vulnerabilities will be addressed
3. Latest Symfony components (7.4.8)
4. Better performance and stability

**Branch Strategy:**
1. ✅ **Current**: Dedicated `aa/drupal-11.3-upgrade` branch created from `main`
2. Perform upgrade and testing on this isolated branch
3. If successful, merge to `main`
4. Then merge `main` into `aa/work-log-integration` to get the upgrade
5. Continue work log feature development with new modules

**Benefits of Separate Branch:**
- Isolates upgrade risk from all feature branches
- Easy rollback if issues arise (just delete branch)
- Can test upgrade independently
- Once merged to main, all feature branches can pull it in
- Keeps main stable until upgrade is verified

## Next Steps After Upgrade

Once on 11.3.7 with Canvas and Display Builder installed:
1. Test both Canvas and Display Builder functionality
2. Merge to `main`
3. Merge `main` into `aa/work-log-integration`
4. Build work log dashboard using Canvas or Display Builder
5. Leverage UI Patterns for component-based theming
6. Implement the work log wireframes with proper layout tools
7. Choose the best tool (Canvas vs Display Builder) for each use case
