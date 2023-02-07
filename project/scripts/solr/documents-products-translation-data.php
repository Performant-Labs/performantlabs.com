<?php
/**
 * @file
 * documents-products-translation-data.php
 *
 * Generate a list of nodes of type document & generic_product and list data
 * related to translation for each of the content. Use this data to develop
 * and test search functions (WW2-4393, WW2-3028, and friends).
 */

use Drupal\node\Entity\Node;

/**
 * Print help text.
 *
 * Run this command inside a shell script to run continuously.
 *
 * e-g
 *
 * while true; do
 *   drush scr documents-products-translation-data.php 1000
 *   sleep 5
 *  done
 */
function help() {
  print("Usage:\n");
  print("drush scr documents-products-translation-data.php <limit>\n");
  print("Generate translation status for <limit> no of nodes and save it in xlation-status.csv\n\n");
}

function generate_list($file) {
  $header = ["type", "nid", "english", "japanese", "chinese", "data"];
  $fd = fopen("xlation-status.csv", "w");
  fputcsv($fd, $header);
  fclose($fd);

  $types = ['document', 'generic_product'];
  $docids = [];

  foreach ($types as $type) {
    $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery()
      ->condition('type', [$type], 'IN')
      ->condition('status', 1);

    $nids = $query->execute();

    foreach ($nids as $nid) {
      $docids[] = [$type,$nid];
    }
  }

  print("Generate list of documents: " . count($docids) . "\n");
  print("File saved to $file\n");

  file_put_contents($file, json_encode($docids));
}

function process_list($limit, $file) {
  $languages = ['en', 'ja', 'zh-hans'];

  $docids = json_decode(file_get_contents($file));
  print("No of documents left to process: " . count($docids) . "\n");
  $count = 0;

  $fd = fopen("xlation-status.csv", "a");

  while ($count < $limit) {
    if (count($docids) == 0) {
      break;
    }

    $docid = array_shift($docids);

    $type = $docid[0];
    $nid = $docid[1];
    $row = [$type, $nid, 0, 0, 0];
    $node = Node::load($nid);

    $count++;

    $data = [];
    $idx = 2;
    foreach ($languages as $lang) {
      if ($node != NULL && $node->hasTranslation($lang)) {
        $node = $node->getTranslation($lang);
        $data[$lang] = $node->getTitle();
        $row[$idx] = 1;
      }
      $idx++;
    }
    $row[] = json_encode($data);
    fputcsv($fd, $row);

    if ($count >= $limit) {
      break;
    }
  }

  fclose($fd);

  file_put_contents($file, json_encode($docids));

  return $count;
}

if (count($extra) != 1) {
  help();
  exit();
}

// No memory & time limit.
ini_set("memory_limit", -1);
set_time_limit(0);
error_reporting(E_ERROR | E_PARSE);

$limit = intval($extra[0]);

$file = "/tmp/document-list.json";

if (!file_exists($file)) {
  generate_list($file);
}

$cnt = process_list($limit, $file);

exit($cnt);
