# Live Config Reconciliation Plan
## Goal: Safe Drupal 11.3 Promotion to Live

**Date:** April 18, 2026
**Author:** AI Agent
**Status:** DRAFT — awaiting execution

---

## Problem Statement

Live is running **Drupal 11.1.6** with **529 config items that exist only in its database** — never exported to git. Our upgrade branch (`main`) exports config from the Dev DB, which does not include these Live-only configs.

If we deploy to Live and run `drush config:import`, those 529 items will be **deleted**, potentially destroying blocks, views, asset injector rules, backup schedules, and other configs that only exist in production.

**The fix:** Export Live's config as the new ground truth, merge in D11.3 upgrade-specific changes, test the reconciled config locally against a Live DB clone, then redeploy cleanly.

---

## Current Inventory

| Environment | Drupal Version | DB State | Config State |
|-------------|---------------|----------|--------------|
| Live | 11.1.6 | Production | 529 items only in DB |
| Test | 11.3.7 | Live DB clone + manual updb | Config imported (small delta) |
| Dev | 11.3.7 | Dev DB | Config in sync |
| Local | 11.3.7 | Dev DB | Config in sync |
| `main` sync dir | — | — | 532 items (from Dev DB export) |

---

## Phase 1 — Export Live Config as Baseline

**Goal:** Get Live's 529 DB-only configs into a git branch so we can see what we're working with.

### Step 1.1 — Pull Live DB into local DDEV

```bash
# Create a fresh backup of Live DB on Pantheon
ddev exec terminus backup:create performant-labs.live --element=db

# Pull it down into local DDEV using drush sql-sync
# (Requires ddev auth ssh to be run first if not already done)
ddev auth ssh
ddev exec drush sql-sync @pantheon.performant-labs.live @self --yes
```

> **Verify:** `ddev exec drush status` should show Drupal 11.1.6 after the sync.

### Step 1.2 — Create a baseline branch

```bash
git checkout main
git checkout -b aa/live-config-baseline
```

### Step 1.3 — Export Live's full config to sync dir

```bash
# Wipe the sync dir and replace with Live's complete config
ddev drush config:export --yes
```

This will overwrite `config/default/sync/` with ALL 529+ items from the Live DB.

### Step 1.4 — Commit the Live baseline

```bash
git add config/default/sync/
git commit -m "Export Live config as baseline (D11.1.6, 529 items)"
git push origin aa/live-config-baseline
```

---

## Phase 2 — Identify & Merge D11.3 Upgrade Deltas

**Goal:** Understand what changed between Live config and our D11.3 sync, then produce a reconciled set.

### Step 2.1 — Diff baseline vs main

```bash
git diff main..aa/live-config-baseline -- config/default/sync/ > /tmp/live-vs-main.diff
wc -l /tmp/live-vs-main.diff
```

Categorize the diff into:
- **New in Live, missing from main** → must be added to main (site content config)
- **In main, missing from Live** → D11.3 upgrade-generated configs (keep them)
- **Different in both** → review case by case

### Step 2.2 — Create the reconciled branch

```bash
git checkout main
git checkout -b aa/d11.3-reconciled
```

### Step 2.3 — Cherry-pick Live-only configs into reconciled branch

```bash
# Copy config files that are in Live but not in main
git checkout aa/live-config-baseline -- config/default/sync/<live-only-file>.yml
# Repeat for each Live-only config item
```

For a large batch, use a script:
```bash
# From aa/live-config-baseline, get list of files added vs main
git diff --name-only --diff-filter=A main..aa/live-config-baseline -- config/default/sync/ > /tmp/live-only-configs.txt

# Switch to reconciled branch and cherry-pick those files
git checkout aa/d11.3-reconciled
while read f; do
  git checkout aa/live-config-baseline -- "$f"
done < /tmp/live-only-configs.txt

git add config/default/sync/
git commit -m "Add Live-only config items to D11.3 reconciled branch"
```

### Step 2.4 — Resolve "Different" configs

For the configs that exist in both but differ, manually review each:
```bash
git diff main..aa/live-config-baseline -- config/default/sync/<differing-file>.yml
```

Typical resolution rules:
- **Drupal core schema changes** (e.g. `core.entity_form_mode.*`) → keep D11.3 version (it's a required upgrade change)
- **Site-specific settings** (e.g. `block.block.*`, `views.view.*`) → keep Live version
- **Module settings** → compare and merge manually

---

## Phase 3 — Test Reconciled Config Locally

**Goal:** Prove that the reconciled config imports cleanly against a Live DB without data loss.

### Step 3.1 — Ensure local is running Live DB (from Phase 1)

```bash
ddev exec drush status | grep "Drupal version"
# Should show 11.1.6
```

### Step 3.2 — Switch local to reconciled branch

```bash
git checkout aa/d11.3-reconciled
```

### Step 3.3 — Run the upgrade sequence locally

```bash
# 1. Run DB updates (11.1.6 → 11.3.7 schema migration)
ddev drush updatedb --yes

# 2. Review what config:import will do — DO NOT skip this review
ddev drush config:status

# 3. Import the reconciled config
ddev drush config:import --yes

# 4. Rebuild cache
ddev drush cache:rebuild
```

### Step 3.4 — Tier 1 local verification

```bash
for url in / /services /how-we-do-it /contact-us /articles /open-source-projects /automated-testing /introduction-to-atk; do
  STATUS=$(curl -sk -o /dev/null -w '%{http_code}' "https://pl-performantlabs.com.ddev.site$url")
  echo "$url → $STATUS"
done
```

All should return 200.

### Step 3.5 — Run ATK tests locally

```bash
npm run test:local
```

**Pass criteria:** Same results as before (23 pass, 2 known fail, 1 flaky, 4 skip).

### Step 3.6 — Commit and push reconciled branch

```bash
git add config/default/sync/
git commit -m "Reconciled config: Live baseline + D11.3 upgrade deltas"
git push origin aa/d11.3-reconciled
```

---

## Phase 4 — Deploy Reconciled Config to Dev (against Live DB clone)

**Goal:** Prove the upgrade works on Pantheon infrastructure against real Live data.

### Step 4.1 — Clone Live DB to Dev

```bash
ddev exec terminus env:clone-content performant-labs.live dev --yes
```

> ⚠️ This overwrites Dev's DB and files with Live's. Dev will revert to Drupal 11.1.6 state.

### Step 4.2 — Deploy reconciled branch code to Dev

The deploy workflow (`deploy-to-pantheon-dev.yml`) deploys `main`. We need to either:
- **Option A:** Merge `aa/d11.3-reconciled` into `main` and trigger the workflow.
- **Option B:** Manually push the reconciled branch to the Pantheon git remote as `master`.

Recommended: **Option A** — merge into main after local tests pass.

```bash
git checkout main
git merge --no-edit aa/d11.3-reconciled
git push origin main
# Then trigger via GitHub Actions:
gh workflow run deploy-to-pantheon-dev.yml --ref main
```

### Step 4.3 — Run post-deploy sequence on Dev manually

```bash
ddev exec terminus remote:drush performant-labs.dev -- updatedb --yes
ddev exec terminus remote:drush performant-labs.dev -- config:status
ddev exec terminus remote:drush performant-labs.dev -- config:import --yes
ddev exec terminus remote:drush performant-labs.dev -- cache:rebuild
```

### Step 4.4 — Tier 1 verification on Dev

```bash
for url in / /services /how-we-do-it /contact-us /articles /open-source-projects; do
  STATUS=$(curl -sk -o /dev/null -w '%{http_code}' "https://dev-performant-labs.pantheonsite.io$url")
  echo "$url → $STATUS"
done
```

### Step 4.5 — Fix any issues

If `config:import` still reports unexpected deltas or pages break:
1. Review `drush config:status` output carefully
2. Fix the specific config files in `aa/d11.3-reconciled`
3. Re-push, re-deploy, re-test

---

## Phase 5 — Re-clone Live to Dev & Final Dev Verification

**Goal:** Simulate the actual Live → upgrade flow one final time cleanly.

```bash
# Clone Live DB to Dev again (fresh slate)
ddev exec terminus env:clone-content performant-labs.live dev --yes

# Re-trigger deploy (code is already there, but Pantheon will sync)
gh workflow run deploy-to-pantheon-dev.yml --ref main

# Run post-deploy sequence
ddev exec terminus remote:drush performant-labs.dev -- updatedb --yes
ddev exec terminus remote:drush performant-labs.dev -- config:import --yes
ddev exec terminus remote:drush performant-labs.dev -- cache:rebuild
```

**This run should be clean** — zero unexpected config deltas, all pages 200.

---

## Phase 6 — Deploy to Test

```bash
# Clone Live DB to Test
ddev exec terminus env:clone-content performant-labs.live test --yes

# Promote Dev code to Test
ddev exec terminus env:deploy performant-labs.test --note="Drupal 11.3 upgrade - reconciled config"

# Run post-deploy sequence
ddev exec terminus remote:drush performant-labs.test -- updatedb --yes
ddev exec terminus remote:drush performant-labs.test -- config:import --yes
ddev exec terminus remote:drush performant-labs.test -- cache:rebuild
```

### Run ATK tests against Test

```bash
gh workflow run test-against-pantheon.yml --ref main -f env=test
```

**Pass criteria:** Same results as local (23 pass, 2 known fail, 1 flaky, 4 skip).

---

## Phase 7 — Deploy to Live

> ⚠️ **Production deploy — schedule during low traffic.**

```bash
# Promote Test code to Live
ddev exec terminus env:deploy performant-labs.live --note="Drupal 11.3 upgrade"

# Pantheon will try and likely fail the automated cache clear — that's OK.
# Immediately run the post-deploy sequence:
ddev exec terminus remote:drush performant-labs.live -- updatedb --yes
ddev exec terminus remote:drush performant-labs.live -- config:import --yes
ddev exec terminus remote:drush performant-labs.live -- cache:rebuild
```

### Final Tier 1 verification on Live

```bash
for url in / /services /how-we-do-it /contact-us /articles /open-source-projects /automated-testing /introduction-to-atk; do
  STATUS=$(curl -sk -o /dev/null -w '%{http_code}' "https://performantlabs.com$url")
  echo "$url → $STATUS"
done
```

---

## Phase 8 — Add Quicksilver Hook (prevent future failures)

**Goal:** Make `drush updb && drush config:import && drush cr` run automatically after every future Pantheon deploy, so the cache-clear-before-updb race condition never fails again.

### Step 8.1 — Create Quicksilver script

```bash
mkdir -p private/scripts/quicksilver
cat > private/scripts/quicksilver/drush_update.php << 'EOF'
<?php
echo "Running drush updatedb...\n";
passthru('drush updatedb --yes 2>&1');
echo "Running drush config:import...\n";
passthru('drush config:import --yes 2>&1');
echo "Running drush cache:rebuild...\n";
passthru('drush cache:rebuild 2>&1');
echo "Post-deploy complete.\n";
EOF
```

### Step 8.2 — Register in pantheon.yml

```yaml
# Add to pantheon.yml:
workflows:
  deploy:
    after:
      - type: webphp
        description: "Run post-deploy drush commands"
        script: private/scripts/quicksilver/drush_update.php
```

### Step 8.3 — Commit and push

```bash
git add private/scripts/quicksilver/drush_update.php pantheon.yml
git commit -m "Add Quicksilver post-deploy hook: updatedb + config:import + cr"
git push origin main
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Config import deletes Live-only items | HIGH (now) | HIGH | Phase 1–3: export and reconcile first |
| `config:import` mid-deploy wipes bad config | MEDIUM | HIGH | Always review `drush config:status` before `--yes` |
| Live DB clone to Dev overwrites Dev content | CERTAIN | LOW | Dev is ephemeral — this is intentional |
| Quicksilver script timeout on large updb | LOW | MEDIUM | Monitor first deploy; can disable if needed |
| ATK tests fail on Test due to Live data differences | LOW | MEDIUM | Known failures are already documented |

---

## Branch Summary

| Branch | Purpose |
|--------|---------|
| `main` | Current D11.3 code (dev-derived config) |
| `aa/live-config-baseline` | Live's full config export (D11.1.6) |
| `aa/d11.3-reconciled` | Merged: Live config + D11.3 upgrade changes |

After Phase 5 passes, `aa/d11.3-reconciled` is merged into `main` and these branches can be deleted.

---

## Checklist

- [ ] **Phase 1:** Pull Live DB locally, export config to `aa/live-config-baseline`
- [ ] **Phase 2:** Diff and create `aa/d11.3-reconciled` with merged config
- [ ] **Phase 3:** Test reconciled locally against Live DB — `drush updb + cim + cr`
- [ ] **Phase 3:** Run ATK tests locally — pass
- [ ] **Phase 4:** Clone Live → Dev, deploy reconciled, run post-deploy sequence
- [ ] **Phase 4:** Verify Dev — all pages 200, config clean
- [ ] **Phase 5:** Re-clone Live → Dev, redeploy, verify clean run
- [ ] **Phase 6:** Clone Live → Test, deploy, run post-deploy, run ATK tests
- [ ] **Phase 7:** Deploy to Live, run post-deploy, Tier 1 verify
- [ ] **Phase 8:** Add Quicksilver hook, commit, verify on next deploy

---

## Important Notes

- **Never run `drush config:import --yes` on Live without first reviewing `drush config:status`.**
- **Terminus only works inside DDEV:** prefix all terminus commands with `ddev exec terminus`.
- **`ddev auth ssh` must be run first** if terminus SSH commands fail.
- **The SendGrid API key** in `symfony_mailer_lite.symfony_mailer_lite_transport.smtp.yml` must stay as `REPLACE_WITH_SENDGRID_API_KEY` in git — never commit the real key.
- **Schedule the Live deploy** (Phase 7) during low-traffic hours.
