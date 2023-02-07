<?php
/*
 * Delete acquia_search_index and associated acquia_server_server
 * config info.
 */

$storage = \Drupal::entityTypeManager()->getStorage('search_api_index');
$index = $storage->load('acquia_search_index');
if ($index) {
  if ($index->status()) {
    print("disabling the index ...\n");
    try {
      $index = $storage->loadOverrideFree($index->id());
      $index->disable()->save();
    } catch (\Exception $e) {
      print("Error disabling index .. " . $e->getCode() . " " . $e->getMessage() . "\n");
    }
  }

  print("deleting the index ...\n");
  try {
    $index->delete();
    print(" ... deleted\n");
  } catch (\Exception $e) {
    print("Error deleting index .. " . $e->getCode() . " " . $e->getMessage());
  }
}

$storage = \Drupal::entityTypeManager()->getStorage('search_api_server');
$server = $storage->load('acquia_search_server');
if ($server) {
  if ($server->status()) {
    print("disabling the server ...\n");
    $server = $storage->loadOverrideFree($server->id());
    $server->disable()->save();
  }
  print("deleting the server ...\n");
  try {
    $server->delete();
    print(" ... deleted\n");
  } catch (\Exception $e) {
    print("Error deleting the server: " . $e->getCode() . " " . $e->getMessage() . "\n");
  }
}
