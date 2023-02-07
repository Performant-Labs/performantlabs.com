<?php

/**
 * @file
 * pattern-match-for-ids.php
 *
 * Fit regular expression patterns for various IDs (document id, product id,
 * orderable product id, etc) and generate some stats around matches, outliers etc.
 *
 * Usage:
 *
 * drush scr pattern-match-for-ids.php <type-of-id>
 */

function help() {
  print("Usage:\n");
  print("drush scr pattern-match-for-ids.php <file-name.csv>\n");
}

if (count($extra) != 1) {
  help();
  exit();
}

$database = \Drupal::database();

$id_fields = [
  "field_document_id",
  "field_product_id",
  "field_orderable_part_id"
//  "field_package_code"
];

$fd = fopen($extra[0], "w");
fputcsv($fd, ["Type", "Bundle", "Entity ID", "Language", "Value", "Match?"]);

foreach($id_fields as $id_field) {
  $complete_matches = $partial_matches = $mismatches = $total = 0;
  print("*****\nField: $id_field\n");
  $q = "SELECT * from node__{$id_field}";
  $field = "{$id_field}_value";
  $result = $database->query($q);
  if ($result != null) {
    while ($row = $result->fetchAssoc()) {
      $total++;
      $keyword = $row[$field];
      $data = [$id_field, $row["bundle"], $row["entity_id"], $row["langcode"], $keyword];
      $matches = null;
      if (preg_match('/^(?=.*[0-9])(?=.*[a-zA-Z])([\w\s\-\(\)\[\]\.\/\+\*\:\&#]+)$/', $keyword, $matches)) {
        if (strcmp($matches[0], $keyword)) {
          $partial_matches++;
          $data[] = "Partial: '{$matches[0]}'";
        } else {
          $complete_matches++;
          $data[] = "Complete";
        }
      } else {
        $mismatches++;
        $data[] = "Mismatch";
      }
      fputcsv($fd, $data);
    }

    $percentage = round(($complete_matches / $total) * 100, 2);
    print("Complete matches: $complete_matches Partial matches: $partial_matches Mismatches: $mismatches Total: $total Percentage Match: $percentage\n");
  }
}

fclose($fd);
