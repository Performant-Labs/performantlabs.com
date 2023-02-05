<?php

/**
 * @file@
 *
 * id-false-positive-rate.php
 *
 * Generate the known-ids.csv using the pattern-match-for-ids.php script.
 *
 * Generate the keywords.txt using sumo-search-keywords.php (after downloading
 * data from SumoLogic)
 *
 * And then run this script using the two data files. These files usually end up
 * in docroot when run using drush.
 */
function help() {
  print("Usage:\n");
  print("drush scr id-false-positive-rate.php known-ids.csv keywords.txt\n");
}

// No memory & time limit.
ini_set("memory_limit", -1);
set_time_limit(0);

if (count($extra) != 2) {
  help();
  exit();
}

$known_ids = $extra[0];
$keywords = $extra[1];

$fd = fopen($known_ids, "r");
$header = fgetcsv($fd);

$ids = [];
$clashes = 0;
while ($row = fgetcsv($fd)) {
  $kw = "kw-" . strtolower(trim($row[4]));
  if (!isset($ids[$kw])) {
    $ids[$kw] = $row;
  } else {
    $clashes++;
//    print("ID clash -- " . $row[4] . "\n");
  }
}
fclose($fd);

$fd = fopen($keywords, "r");

$positives = $false_positives = 0;
$count = 0;

//print("Count of ids: " . count($ids) . " Clashes: $clashes\n");

$fps = [];
while (($keyword = fgets($fd)) !== false) {
  $keyword = strtolower(trim($keyword));
  if (preg_match('/^(?=.*[0-9])(?=.*[a-zA-Z])([\w\s\-\(\)\[\]\.\/\+\*\:\&#]+)$/', $keyword, $matches)) {
    $kw = "kw-$keyword";
    if (!isset($ids[$kw])) {
      $false_positives++;
      print($keyword . "\n");
      $fps[] = $keyword;
    } else {
      $positives++;
    }
  }
  $count++;
}

fclose($fd);

//print_r($fps);
print("Positives: $positives False positives: $false_positives Total: $count\n");
