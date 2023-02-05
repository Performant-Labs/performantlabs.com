<?php

/**
 * sumo-search-keywords.php
 *
 * Aggregate and list out all keywords searches by analyzing the log records from
 * sumo logic.
 */

function help() {
  print("Usage\n");
  print("drush scr sumo-search-keywords.php <search-keywords-dump-from-sumo.csv> <keywords.txt>\n");
  print("Make sure to dump all fields from sumo (Not the display only fields)\n");
}

// No memory & time limit.
ini_set("memory_limit", -1);
set_time_limit(0);


if (count($extra) != 2) {
  help();
  exit();
}

$file = $extra[0];
$out = $extra[1];

$fd = fopen($file, "r");
if (!$fd) {
  print("Failed to open $file $fd\n");
  exit();
}

$out_fd = fopen($out, "w");

$header = fgetcsv($fd);
print_r($header);

$unique = [];

$count = 0;
$unique_count = 0;
while ($row = fgetcsv($fd)) {
  $kw = $row[10];
  if (($pos = strpos($kw, "?keywords")) !== FALSE) {
    $kw = substr($kw, 0, $pos);
//    print("$kw -- {$row[10]}\n");
  } else if (strpos($kw, "tm_X3b") !== FALSE) {
    // filter out extraneous stuff
    continue;
  }
  if (!isset($unique[$kw])) {
    fwrite($out_fd, "$kw\n");
    $unique_count++;
    $unique[$kw] = $kw;
  }
  $count++;
}

fclose($fd);
fclose($out_fd);

print("Total: $count $unique_count\n");
