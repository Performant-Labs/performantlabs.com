# Deployment Instructions

## Overview

Code lives in GitHub. Deployments to Pantheon are driven by a GitHub Actions
workflow — there is no direct git push to Pantheon. The workflow builds a
Composer artifact, clones the Pantheon repo, overwrites it with the built code,
and force-pushes to Pantheon's master branch.

## Environments

| Environment | Pantheon URL | Promoted from |
|-------------|-------------|---------------|
| Dev | `https://dev-performant-labs.pantheonsite.io` | GitHub `main` (manual trigger) |
| Test | `https://test-performant-labs.pantheonsite.io` | Dev (Pantheon dashboard) |
| Live | `https://live-performant-labs.pantheonsite.io` / `performantlabs.com` | Test (Pantheon dashboard) |

## Deploying to Dev

1. Merge your branch into `main` and push to GitHub origin.
2. Go to **GitHub → Actions → (Deploy) Deploy artifact to Pantheon Dev**.
3. Click **Run workflow**, select branch `main`, click **Run workflow**.
4. The workflow (~5 min) will:
   - Run `composer install --no-dev`
   - Clone the Pantheon dev git repo
   - Copy the built artifact over it
   - Force-push to Pantheon master
   - Wait for Pantheon's post-deploy Quicksilver hooks
   - Trigger the Playwright test suite against Pantheon dev

After the workflow completes, Pantheon dev is live with the new code. **Config
import (`drush config:import`) does not run automatically** — run it manually
via Terminus or the Pantheon dashboard if config changes are included:

```bash
terminus remote:drush performant-labs.dev -- config:import -y
terminus remote:drush performant-labs.dev -- cache:rebuild
```

## Promoting Dev → Test → Live

Use the **Pantheon dashboard** (or Terminus) to deploy code between environments:

```bash
# Dev → Test
terminus env:deploy performant-labs.test --sync-content --note "Release notes here" --cc

# Test → Live
terminus env:deploy performant-labs.live --note "Release notes here" --cc
```

Run `drush config:import` on each environment after promoting.

## Theme Activation (V2 Cutover)

The V2 theme (`performant_labs_v2`) is deployed to all environments but **pinned
off on Pantheon** via a `$config` override in `web/sites/default/settings.php`:

```php
// In the Pantheon else block:
$config['system.theme']['default'] = 'performant_labs';
```

Locally (DDEV), `settings.local.php` overrides this to activate V2:

```php
$config['system.theme']['default'] = 'performant_labs_v2';
```

**To cut over to V2 on Pantheon:**
1. Remove (or update) the `$config['system.theme']['default']` line in
   `settings.php` — set it to `'performant_labs_v2'` or delete it and let
   `system.theme.yml` drive it.
2. Commit, push to `main`, and run the deploy workflow.
3. Run `drush config:import && drush cr` on dev, verify, then promote.

## Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `PANTHEON_SSH_PRIVATE_KEY` | SSH key for pushing to Pantheon git |
| `PANTHEON_MACHINE_TOKEN` | Terminus authentication |

| Variable | Purpose |
|----------|---------|
| `PANTHEON_REPO_URL` | Pantheon git remote URL (set under repo → Settings → Variables) |

## Workflow File

`.github/workflows/deploy-to-pantheon-dev.yml` — triggered manually
(`workflow_dispatch`). The `on: [push]` trigger is commented out.
