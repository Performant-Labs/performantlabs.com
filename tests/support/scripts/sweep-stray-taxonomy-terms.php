<?php

/**
 * @file
 * Sweeps stray `ATK-PW-1120: <random>` taxonomy terms out of the "tags"
 * vocabulary.
 *
 * Belt-and-suspenders guard for the same failure shape as ATK-PW-1150 (see
 * sweep-stray-menu-links.php): atk_taxonomy.spec.js creates a term via the
 * UI and deletes it via the UI at the end of the same test, with no
 * afterEach/afterAll safety net. If the test times out or the browser
 * context dies mid-run, the term is orphaned. This script — run via
 * `drush php:script` before the suite — deletes anything matching that
 * exact leak signature, so a leak never survives past the next run.
 *
 * Deliberately scoped tight: only titles matching EXACTLY
 * "ATK-PW-1120: " + 6 alphanumeric characters, the literal pattern
 * atk_taxonomy.spec.js generates. Cannot match legitimate tags.
 */

$ids = \Drupal::entityQuery('taxonomy_term')
  ->accessCheck(FALSE)
  ->condition('vid', 'tags')
  ->execute();

$deleted = 0;
foreach ($ids as $id) {
  $term = \Drupal\taxonomy\Entity\Term::load($id);
  if ($term && preg_match('/^ATK-PW-1120: [A-Za-z0-9]{6}$/', $term->getName())) {
    $term->delete();
    $deleted++;
  }
}

echo "sweep-stray-taxonomy-terms: deleted {$deleted} stray term(s).\n";
