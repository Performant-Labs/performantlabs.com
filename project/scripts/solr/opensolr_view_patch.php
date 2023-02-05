<?php
/**
 * Patch acquia_search_index to opensolr_search_index in all views
 * as a temporary fix till the config is exported (and opensolr becomes
 * the default search index)
 */
$config_factory = \Drupal::configFactory();

$configs_to_patch = [
  "views.view.search",
  "views.view.documentation_tools",
  "views.view.acquia_support",
  "views.view.videos_landing_page",
  "views.view.software_tools_search",
];

$search_index_name = $config_factory->get('idt_search.settings')->get('index_name');
if ($search_index_name != 'opensolr_search_index') {
  print("Change the idt_search.settings.index_name to opensolr_search_index before running this script\n");
  return;
}

// Find all views configs.
foreach ($config_factory->listAll('views.view.') as $view_config_name) {
  if (!in_array($view_config_name, $configs_to_patch)) {
    continue;
  }

  print("$view_config_name\n-----------\n");

  $changed = FALSE;
  $patches = [];

  $view = $config_factory->getEditable($view_config_name);

  $cfgDependenciesConfig = 'dependencies.config';

  $depends = $view->get($cfgDependenciesConfig);
  if (in_array('search_api.index.acquia_search_index', $depends)) {
    for ($i = 0; $i < count($depends); $i++) {
      if ($depends[$i] == 'search_api.index.acquia_search_index') {
        $depends[$i] = 'search_api.index.opensolr_search_index';
      }
    }
    $view->set($cfgDependenciesConfig, $depends);
    $patches[] = $cfgDependenciesConfig;

    $changed = TRUE;
  }

  print($view->get('label') . '(' . $view->getName() . ")\n");

  if ($view->get('base_table') == 'search_api_index_acquia_search_index') {
    $view->set('base_table', 'search_api_index_opensolr_search_index');

    $patches[] = 'base_table';
    $changed = TRUE;

  }

  // Go through each display on each view.
  $displays = $view->get('display');
  foreach ($displays as $display_name => $display) {
    // Go through all the entity fields on each display and find ones currently using 'date' as the plugin.
    if (!empty($display['display_options']['fields'])) {
      foreach ($display['display_options']['fields'] as $field_name => $field) {
        if (isset($field['entity_type']) && $field['plugin_id'] === 'search_api_field') {
          $base = "display.$display_name.display_options.fields.$field_name";
          $fld_table = "$base.table";
          switch($view->get($fld_table)) {
            case 'search_api_datasource_acquia_search_index_entity_node':
              $view->set($fld_table, 'search_api_datasource_opensolr_search_index_entity_node');
              $changed = TRUE;
              $patches[] = $fld_table;
              break;
            case 'search_api_index_acquia_search_index':
              $view->set($fld_table, 'search_api_index_opensolr_search_index');
              $changed = TRUE;
              $patches[] = $fld_table;
              break;
          }
        }
      }
    }
  }

  if ($changed) {
    $view->save(TRUE);

    print("Updated the following:\n");
    foreach($patches as $patch) {
      print("   $patch\n");
    }

    print("\n\n");
  }
}