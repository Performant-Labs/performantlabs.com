<?php
// do a manual upgrade from version 1.x to 3.x
// enabled dependent modules file_mdm, file_mdm_exif, file_mdm_font

try {
  module_load_install('image_effects');

  image_effects_update_8201();
  image_effects_update_8202();
  image_effects_update_8203();

  drupal_set_installed_schema_version('image_effects', '8203');

  drupal_set_installed_schema_version('file_mdm', '8200');
  drupal_set_installed_schema_version('file_mdm_font', '8000');
  drupal_set_installed_schema_version('file_mdm_exif', '8000');

  drupal_flush_all_caches();
} catch (Exception $ex) {
  print("Got an exception: " . $ex->getMessage());
}

/**
 * Enable file_mdm module and required submodules.
 */
function image_effects_update_8201() {
  \Drupal::service('module_installer')->install([
    'file_mdm',
    'file_mdm_exif',
    'file_mdm_font',
  ]);
}

/**
 * Clear caches to discover new effects.
 */
function image_effects_update_8202() {
  // Empty function.
}

/**
 * Clear caches to discover new effects.
 */
function image_effects_update_8203() {
  // Empty function.
}
