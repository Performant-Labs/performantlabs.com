<?php
// remove compare_role_permission in key_value table
\Drupal\Core\Database\Database::getConnection()->delete('key_value')
  ->condition('name', 'compare_role_permissions')
  ->execute();

\Drupal\Core\Database\Database::getConnection()->delete('key_value_expire')
  ->condition('name', 'compare_role_permissions')
  ->execute();

$config = \Drupal::config('core.extension');
$m = $config->get('module');
if (isset($m['compare_role_permissions'])) {
  print("CRP found\n");
  $config = \Drupal::service('config.factory')->getEditable('core.extension');
  $m = $config->get('module');
  if (isset($m['compare_role_permissions'])) {
    unset($m['compare_role_permissions']);
    $config->set('module', $m);
    $config->save();
    print("CRP removed\n");
  }
}

drupal_flush_all_caches();
