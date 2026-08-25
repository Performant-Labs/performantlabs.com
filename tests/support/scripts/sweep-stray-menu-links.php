<?php

/**
 * @file
 * Sweeps stray `Test<random>`-titled menu links out of the "main" menu.
 *
 * Belt-and-suspenders guard for the pattern behind ATK-PW-1150: a Playwright
 * test that creates a menu link to verify it, then deletes it. If the test
 * times out or the browser context dies mid-run, the browser-driven cleanup
 * never fires and the link is orphaned in the live menu. This script — run
 * via `drush php:script` before the suite (and safe to run any time) —
 * deletes anything matching that exact leak signature, so a leak from any
 * run (this test or a future one with the same shape) never survives past
 * the next test invocation.
 *
 * Deliberately scoped tight: only the "main" menu, only titles that are
 * EXACTLY "Test" + 6 alphanumeric characters (the literal pattern
 * atk_menu.spec.js generates). This can never match legitimate content —
 * e.g. the "Testing-suite takeover" footer link is a different menu and a
 * different length, so it's untouched.
 */

$ids = \Drupal::entityQuery('menu_link_content')
  ->accessCheck(FALSE)
  ->condition('menu_name', 'main')
  ->execute();

$deleted = 0;
foreach ($ids as $id) {
  $link = \Drupal\menu_link_content\Entity\MenuLinkContent::load($id);
  if ($link && preg_match('/^Test[A-Za-z0-9]{6}$/', $link->getTitle())) {
    $link->delete();
    $deleted++;
  }
}

echo "sweep-stray-menu-links: deleted {$deleted} stray link(s).\n";
