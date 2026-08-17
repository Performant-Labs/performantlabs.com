<?php

// phpcs:ignoreFile

/**
 * @file
 * Flotilla preview-environment settings override (issue #314).
 *
 * This is the Flotilla port of `.tugboat/settings.tugboat.php`. It is copied
 * into place by the `.flotilla.yml` build hook as the site's
 * `sites/default/settings.local.php`, which `settings.php` includes for any
 * non-Pantheon environment ("Might be replaced for Tugboat" — settings.php:724).
 *
 * The ONLY structural difference from the Tugboat override is the database
 * connection: it points at the `db` service by service name (Flotilla gives
 * sibling services DNS on the preview network, mirroring the db-seed fixture's
 * `-h db` pattern) instead of Tugboat's `mysql` service. The DB name/user/pass
 * are the empty-root-password MariaDB the `db` service boots (see .flotilla.yml),
 * so they match the credentials `drush sql:cli` will use to load the snapshot.
 */

assert_options(ASSERT_ACTIVE, TRUE);
assert_options(ASSERT_EXCEPTION, TRUE);

/**
 * Enable local development services.
 */
$dev_services_file = DRUPAL_ROOT . '/sites/development.services.yml';
if (file_exists($dev_services_file)) {
  $settings['container_yamls'][] = $dev_services_file;
}

/**
 * Verbose errors + no aggregation for a preview (mirrors the Tugboat override).
 */
$config['system.logging']['error_level'] = 'verbose';
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

/**
 * Null caches while the preview is being built, so a stale render/page cache
 * cannot mask freshly-restored content.
 */
$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['page'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';

// NOT rebuild_access: a Flotilla preview is internet-reachable, and
// rebuild_access = TRUE exposes rebuild.php to anonymous callers (repeated
// cache rebuilds → DoS). The build hook already runs `drush cache:rebuild`, so
// the web-exposed rebuild endpoint is unnecessary here.
// skip_permissions_hardening IS kept: ${DOCROOT} is a symlink to the VCS
// checkout (settings.php lives in a tracked dir), so Drupal's periodic
// permissions hardening would fight the checkout — the same reason this repo's
// own settings.github.php sets it.
$settings['skip_permissions_hardening'] = TRUE;

/**
 * Environment indicator so a preview is never mistaken for prod.
 */
$config['environment_indicator.indicator']['name'] = 'Flotilla Preview';
$config['environment_indicator.indicator']['bg_color'] = '#0b6e4f';
$config['environment_indicator.indicator']['fg_color'] = '#ffffff';

/**
 * Trusted host patterns.
 *
 * Flotilla routes the preview to the default service's host. When that host is
 * known (Flotilla injects FLOTILLA_DEFAULT_SERVICE_URL_HOST) we constrain the
 * trust list to EXACTLY that host, so Drupal's host-header validation stays on
 * for the internet-reachable preview — closing the host-header-poisoning gap a
 * bare `['.*']` would open. Only if the host is somehow absent (e.g. a bare
 * intra-container `drush` bootstrap with no routing env) do we fall back to a
 * permissive pattern, so the CLI still bootstraps rather than fataling.
 */
$flotilla_host = $_ENV['FLOTILLA_DEFAULT_SERVICE_URL_HOST'] ?? getenv('FLOTILLA_DEFAULT_SERVICE_URL_HOST');
if (!empty($flotilla_host)) {
  $settings['trusted_host_patterns'] = ['^' . preg_quote($flotilla_host, '/') . '$'];
}
else {
  // No routing host available (CLI-only bootstrap). Permissive fallback.
  $settings['trusted_host_patterns'] = ['.*'];
}

/**
 * Database — the `db` service (MariaDB 10.6) reachable by service name over the
 * preview network. Empty root password, matching the `db` service's
 * `MARIADB_ALLOW_EMPTY_ROOT_PASSWORD` in .flotilla.yml.
 */
$databases['default']['default'] = [
  'database' => 'drupal',
  'username' => 'root',
  'password' => '',
  'prefix' => '',
  'host' => 'db',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
];

/**
 * Per-preview hash salt, derived from the Flotilla repo id (mirrors the Tugboat
 * override's `hash('sha256', getenv('TUGBOAT_REPO_ID'))`). Falls back to a
 * stable constant if the env var is absent so a bare CLI bootstrap still works.
 */
$repo_id = $_ENV['FLOTILLA_REPO_ID'] ?? getenv('FLOTILLA_REPO_ID');
$settings['hash_salt'] = hash('sha256', $repo_id ?: 'flotilla-preview');

/**
 * Config sync directory — the committed repo config whose `system.site:uuid`
 * (config/default/sync/system.site.yml) is the uuid the restore normalizes to.
 */
if (empty($settings['config_sync_directory'])) {
  $settings['config_sync_directory'] = dirname(DRUPAL_ROOT) . '/config/default/sync';
}

$config['system.file']['path']['temporary'] = '/tmp';
ini_set('max_execution_time', '0');
