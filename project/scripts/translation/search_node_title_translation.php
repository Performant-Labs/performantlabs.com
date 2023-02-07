<?php

/**
 * search_node_title_translation.php
 *
 * Need to export translations from locale table and newly added node titles
 * from node_field_data table.
 */

function help() {
  print("Usage\n");
  print("drush scr search_node_title_translation.php <locale_t.csv> <node_field_data_t.csv>\n");
}

// No memory & time limit.
ini_set("memory_limit", -1);
set_time_limit(0);


if (count($extra) != 2) {
  help();
  exit();
}

$file1 = $extra[0];
$file2 = $extra[1];

$fd = fopen($file1, "r");
if (!$fd) {
  print("Failed to open $file1 $fd\n");
  exit();
}

//$header = fgetcsv($fd);
//print_r($header);
$count = 0;
$trans_source = [];
while ($row = fgetcsv($fd)) {
  // print $row[0];
  // print $row[1]."\n";
  $trans_source[] = $row[1];

  $count++;
}
print "Total translations stored = " . $count . " matched " . count($trans_source);


$fd2 = fopen($file2, "r");
if (!$fd2) {
  print("Failed to open $file2 $fd2\n");
  exit();
}

//$header = fgetcsv($fd);
//print_r($header);
$count2 = 0;
while ($row2 = fgetcsv($fd2)) {
  $key = array_search($row2[0], $trans_source);
  if ($key) {
    print("Title translation found for ****" .$row2[0]. "**** \n");
  }
  $count2++;
}

print "Number of titles searched = " . $count2 . "\n";

fclose($fd2);

