<?php

/**
 * @file
 * solr-meta-data-dump.php
 *
 * Dump all the meta data from all documents; used for testing search results
 *
 * Usage:
 *
 * drush scr solr-meta-data-dump.php
 */

function help() {

}

//if (count($extra) != 2) {
//  help();
//  exit();
//}

$database = \Drupal::database();

$id_fields = [
  "field_meta_description",
  "field_meta_keyword",
  "field_page_title"
];

$fd = fopen("meta-data.csv", "w");
fputcsv($fd, ["Type", "Bundle", "Entity ID", "Language", "Value"]);

foreach($id_fields as $id_field) {
  $total = 0;
  print("\n*****\nField: $id_field\n");
  $q = "SELECT * from node__{$id_field}";
  $field = "{$id_field}_value";
  $result = $database->query($q);
  if ($result != null) {
    while ($row = $result->fetchAssoc()) {
      $total++;
      $value = $row[$field];
      $data = [$id_field, $row["bundle"], $row["entity_id"], $row["langcode"], $value];
      fputcsv($fd, $data);
    }

    print("Total: $total\n\n");
  }
}

fclose($fd);
