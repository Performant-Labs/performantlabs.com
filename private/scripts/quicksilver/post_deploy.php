<?php
/**
 * Quicksilver post-deploy script.
 *
 * Runs automatically after every Pantheon deploy (dev, test, live).
 * Ensures DB schema, config, and caches are always in sync with deployed code.
 *
 * Registered in pantheon.yml under workflows.deploy.after.
 */

echo "=== Post-deploy: Running database updates ===\n";
passthru('drush updatedb --yes 2>&1');

echo "\n=== Post-deploy: Importing configuration ===\n";
passthru('drush config:import --yes 2>&1');

echo "\n=== Post-deploy: Rebuilding caches ===\n";
passthru('drush cache:rebuild 2>&1');

echo "\n=== Post-deploy: Complete ===\n";
