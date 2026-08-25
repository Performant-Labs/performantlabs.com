<?php

/**
 * @file
 * Sweeps stray "Automated Testing, Inc." webform submissions created by
 * atk_contact_us.spec.js.
 *
 * Unlike the menu-link and taxonomy-term leaks, this one isn't a timeout
 * bug — the contact-us test simply never deleted the submission it created.
 * By design, every run (nightly, on live) added one permanent row to
 * webform_submission. 696 had accumulated since 2024-12-10 before this was
 * caught. This script — run via `drush php:script` before the suite —
 * deletes anything matching that signature, so it can never accumulate
 * again.
 *
 * Deliberately scoped tight: only submissions whose "company_name" value is
 * EXACTLY "Automated Testing, Inc." — the literal, hardcoded string
 * atk_contact_us.spec.js fills in. No real visitor would ever submit this
 * exact company name, so this can't match a genuine lead.
 */

$sids = \Drupal::database()->select('webform_submission_data', 'wsd')
  ->fields('wsd', ['sid'])
  ->condition('wsd.name', 'company_name')
  ->condition('wsd.value', 'Automated Testing, Inc.')
  ->execute()
  ->fetchCol();

$deleted = 0;
if ($sids) {
  $submissions = \Drupal\webform\Entity\WebformSubmission::loadMultiple($sids);
  foreach ($submissions as $submission) {
    $submission->delete();
    $deleted++;
  }
}

echo "sweep-stray-webform-submissions: deleted {$deleted} stray submission(s).\n";
