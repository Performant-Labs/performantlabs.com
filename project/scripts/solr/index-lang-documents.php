<?php

/**
 * @file
 * index-lang-documents.php
 *
 * Index/re-index only documents of specified language.
 *
 * Usage:
 *
 * Index all japanese documents
 * drush scr index-lang-documents.php ja
 */

use Drupal\node\Entity\Node;
use Drupal\search_api\Entity\Index;

/**
 * Print help text.
 *
 * Run this command inside a shell script to run continuously.
 *
 * e-g
 *
 * while true; do
 *   drush scr index-lang-documents.php ja 5
 *   sleep 5
 *  done
 */
function help() {
  print("Usage:\n\n");
  print("drush scr index-lang-documents.php ja 5\n");
  print("Re-index 5 japanese documents; will parse PDFs\nDocuments that have issing PDFs will be skipped\n\n");
  print("drush scr index-lang-parsed-documents.php ja 5\n");
  print("Re-index 5 japanese documents using parsed PDF files\nDocuments that have missing parsed files will be skipped\n\n");
}

/**
 * Generate a list of document node ids to work with.
 *
 * This will be run only once. To run it again, remove the generated
 * file (usually /tmp/index-*-list.json).
 */
function generate_list($lang, $use_parsed_documents, $file) {
  $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery()
    ->condition('type', ['document'], 'IN')
    ->condition('status', 1);

  $nids = $query->execute();
  $docids = [];

  foreach ($nids as $nid) {
    $docids[] = $nid;
  }

  print("Generate list of documents to index: " . count($docids) . "\n");
  print("File saved to $file\n");

  file_put_contents($file, json_encode($docids));
}

/**
 * Index $limit no of items at a time.
 */
function index_list($lang, $use_parsed_documents, $limit, $file) {
  $index_name = \Drupal::config('idt_search.settings')->get('index_name');
  $si = !empty($index_name) ? $index_name : SEARCH_INDEX;
  $index = Index::load($si);
  $server = $index->getServerInstance();
  /** @var \Drupal\search_api_solr\Plugin\search_api\backend\SearchApiSolrBackend $backend */
  $backend = $server->getBackend();

  $datasource = $index->getDatasource("entity:node");

  $docids = json_decode(file_get_contents($file));
  print("No of documents left to process: " . count($docids) . "\n");
  $count = 0;

  $processed = 0;

  $items = [];
  while ($count < $limit) {
    if (count($docids) == 0) {
      break;
    }

    $nid = array_shift($docids);
    $processed++;
    $node = Node::load($nid);
    if ($node != NULL && $node->hasTranslation($lang)) {
      $node = $node->getTranslation($lang);
      $doc_path = $node->field_file_path->getValue()[0]['value'];
      if ($use_parsed_documents) {
        $file_exists = idt_search_is_document_parsed($doc_path);
      }
      else {
        $file_exists = file_exists($doc_path);
      }
      if ($file_exists) {
        $docid = "entity:node/" . $nid . ":" . $lang;
        $fsize = filesize($doc_path);
        print("Processing $docid ... Size: $fsize\n");
        $count++;
        $items[$docid] = \Drupal::getContainer()->get("search_api.fields_helper")->createItemFromObject($index, $node->getTypedData(), $docid, $datasource);
      }
    }
  }

  print("Processed $processed items in this iteration\n");
  if (count($items) > 0) {
    print('Indexing ' . count($items) . " ...\n\n");
    $backend->deleteItems($index, array_keys($items));
    $backend->indexItems($index, $items);
  }

  file_put_contents($file, json_encode($docids));

  return $processed;
}

// No memory & time limit.
ini_set("memory_limit", -1);
set_time_limit(0);

// Implied option (based on script name)
$use_parsed_documents = FALSE;
if ($script == 'index-lang-parsed-documents.php') {
  $use_parsed_documents = TRUE;
}

if (count($extra) != 2) {
  help();
  exit();
}

$lang = $extra[0];
$limit = intval($extra[1]);

error_reporting(E_ERROR | E_PARSE);

$file = "/tmp/index-$lang-list.json";

if (!file_exists($file)) {
  generate_list($lang, $use_parsed_documents, $file);
}

$cnt = index_list($lang, $use_parsed_documents, $limit, $file);

exit($cnt);
