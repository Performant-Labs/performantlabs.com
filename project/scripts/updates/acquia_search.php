<?php
/*
 * Delete acquia_search_index and associated acquia_server_server
 * config info.
 */

$storage = \Drupal::entityTypeManager()->getStorage('search_api_index');
$index = $storage->load('acquia_search_index');
if ($index) {
  try {
    $index->delete();
  } catch (\Drupal\Core\Entity\EntityStorageException $e) {
    print('Could not delete ... ' . $e->getMessage());
    return;
  }
  print("acquia_search_index ... deleted\n");
}

$storage = \Drupal::entityTypeManager()->getStorage('search_api_server');
$server = $storage->load('acquia_search_server');
if ($server) {
  try {
    $server->delete();
  } catch (\Drupal\Core\Entity\EntityStorageException $e) {
    print('Could not delete ... ' . $e->getMessage());
    return;
  }
  print("acquia_search_server ... deleted\n");
}

// remove acquia_search in key_value table
\Drupal\Core\Database\Database::getConnection()->delete('key_value')
  ->condition('name', 'acquia_search')
  ->execute();

\Drupal\Core\Database\Database::getConnection()->delete('key_value_expire')
  ->condition('name', 'acquia_search')
  ->execute();

$config = \Drupal::config('core.extension');
$m = $config->get('module');
if (isset($m['acquia_search'])) {
  print("acquia_search found\n");
  $config = \Drupal::service('config.factory')->getEditable('core.extension');
  $m = $config->get('module');
  if (isset($m['acquia_search'])) {
    unset($m['acquia_search']);
    $config->set('module', $m);
    $config->save();
    print("acquia_search removed\n");
  }
}

drupal_flush_all_caches();
