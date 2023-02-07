<?php
/**
 * @file
 *
 * solr-generate-search-requests.php
 *
 * Run this script locally where environment variables can be set; for faster response,
 * make sure the SOLR index is empty.
 *
 * Use this script to generate search request data, based on following criteria:
 *  - search keywords.csv
 *  - user login id (0 -> anonymous, 1 -> admin, >1 -> authenticated)
 *  - no of items (if number is less than the total number of values in file, then choose randomly)
 *
 * Make sure to turn on SOLR_REQUEST_LOG to a file location. Request logs will be dumped to this location.
 * The request log is further used for debugging the request against a fully loaded index(es).
 */

function help() {
  print("Usage:\n");
  print("drush scr scripts/solr/response-diff/solr-generate-search-requests.php <keywords> [region] [uri] [solr-log]\n");
  print("Defaults: region -> us/en, uri -> https://www.renesas.com.docksal.site, solr-log -> solr-requests.log\n");
  print("solr-requests.log is typically found at the root (e-g /var/www)\n");
}

/** @var TYPE_NAME $extra */
if (count($extra) < 1) {
  help();
  exit();
}

$keywords = $extra[0];

$region = "us/en";
if (count($extra) > 1) {
  $region = $extra[1];
}

$base_url = "https://www.renesas.com.docksal.site";
if (count($extra) > 2) {
  $base_url = $extra[2];
}

$solr_requests_log = "/var/www/solr-requests.log";
if (count($extra) > 3) {
  $solr_requests_log = $extra[3];
}

try {
  $url = "$base_url/$region/search?keywords=$keywords";
  $response = \Drupal::httpClient()->get($url, ['verify' => false]);
//  print("Response: " . $response->getStatusCode() . "\n");
} catch (Exception $ex) {
  print("$url generates an exception: " . $ex->getMessage());
}
