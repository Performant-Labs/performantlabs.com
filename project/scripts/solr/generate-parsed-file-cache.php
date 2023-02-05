<?php

use Drupal\node\Entity\Node;
use Drupal\Core\Logger\RfcLogLevel;
use Smalot\PdfParser\Parser;
use Drupal\search_api\SearchApiException;


class GenerateParsedFileCache {

  const DOC_UNK = 0;
  const DOC_PDF = 1;
  const DOC_TXT = 2;
  const DOC_ZIP = 3;


  const STATUS_NOT_TEXT = 0;
  const STATUS_CACHED = 1;
  const STATUS_MISSING = 2;
  const STATUS_SECURE = 3;
  const STATUS_PARSED = 4;

  const PARSED_FILE_CACHE_DIR = 'parsed-files';

  var string $cache_dir;
  var string $log_file;
  var string $job_file;

  var array $skip_list = [
    1530421, 664221, 824701, 824701, 915141, 920321,
    928111, 936991, 947371, 947371, 964971, 965121,
    965181, 965191, 965221, 965241, 965511, 965711,
    965721, 965731, 966101, 966121, 966461, 966471,
    966491, 966511, 966521, 967161, 967451, 967461,
    967501, 920326, 936996,964976, 965126, 965186,
    965196, 965716, 965736, 966106, 966516, 966526,
    967456, 967466, 967506
  ];

  private function log($msg) {
    print($msg . "\n");
    if ($this->log_file) {
      file_put_contents($this->log_file, $msg . "\n", FILE_APPEND);
    }
  }

  private function status_msg($status) {
    $s = [
      self::STATUS_NOT_TEXT => "Not PDF or TXT",
      self::STATUS_CACHED => "In cache",
      self::STATUS_MISSING => "Missing file",
      self::STATUS_SECURE => "Secure pdf .. can't parse",
      self::STATUS_PARSED => "Parsed"
    ];

    if (array_key_exists($status, $s)) {
      return $s[$status];
    }

    return "Unknown Status [$status] value";
  }

  private function index_name() {
    $index_name = \Drupal::config('idt_search.settings')->get('index_name');
    return !empty($index_name) ? $index_name : SEARCH_INDEX;
  }

  private function filetype($name) {
    $name = strtolower($name);
    if ($name && strlen($name) > 0) {
      switch (substr($name, -3)) {
        case 'pdf':
          return self::DOC_PDF;
        case 'txt':
          return self::DOC_TXT;
        case 'zip':
          return self::DOC_ZIP;
        default:
          return self::DOC_UNK;
      }
    }
  }

  private function parsed_file_path($doc_path):string {
    $base_path = $this->cache_dir;
    $doc_path = str_replace(array("public://", "private://"), array("", ""), $doc_path);
    return $base_path . "/" . self::PARSED_FILE_CACHE_DIR . "/" . $doc_path;

  }

  private function save_file($doc_path, $contents):void {
    $parsed_path = $this->parsed_file_path($doc_path);
    $dir = dirname($parsed_path);
    if (!file_exists($dir)) {
      mkdir(dirname($parsed_path), 0744, TRUE);
    }
    file_put_contents($parsed_path, $contents);
  }

  private function parse_file($doc_path, $file_info):int {
    $ext = strtolower($file_info['extension']);

    // we care about small pdf (< 15MB) and txt files only
    if (!in_array($ext, ['pdf', 'txt'])) {
      return self::STATUS_NOT_TEXT;
    }

    $parsed_path = $this->parsed_file_path($doc_path);
    if (file_exists($parsed_path)) {
      return self::STATUS_CACHED;
    }

    try {
      $message = NULL;
      $exists = file_exists($doc_path);
    }
    catch (Exception $ex) {
      $message = "Check if {$doc_path} exists failed - " . $ex->getMessage();
      \Drupal::logger('file')->log(RfcLogLevel::WARNING, $message);
    }
    finally {
      if (!$exists) {
        if (!$message) {
          \Drupal::logger('file')->log(RfcLogLevel::WARNING, "$doc_path does not exist");
        }
        return self::STATUS_MISSING;
      }
    }

    $contents = '';

    // PDF files.
    if ($ext == 'pdf') {
      try {
        $parser = new Parser();
        $pdf = $parser->parseFile($doc_path);
        // Retrieve some meta details from the pdf file.
        $details = $pdf->getDetails();
        foreach ($details as $property => $value) {
          if (is_array($value)) {
            $value = implode(', ', $value);
          }
          if (in_array(strtolower($property), ['keywords', 'title', 'subject'])) {
            $contents .= $value . ' ';
          }
        }
        $contents .= preg_replace('/[\t\n\r\. ]+/', ' ', $pdf->getText());
      } catch (\Throwable $e) {
        $this->log("parse_file throws an exception " . $e->getCode() . " " . $e->getMessage());
        return self::STATUS_SECURE;
      }
    }

    // TXT files.
    elseif ($ext == 'txt') {
      $contents = file_get_contents($doc_path);
    }

    $this->save_file($doc_path, $contents);

    return self::STATUS_PARSED;
  }

  private function parse_node($node, $nid, $lang, $job_status) {
    $name = $node->field_file_path->value;
    $sz = $node->field_file_size->value;
    $ty = $node->field_file_type->value;
    $job_status->count++;
    if ($this->filetype($name) == self::DOC_PDF) {
      if (($status = $this->parse_file($name, pathinfo($name))) == self::STATUS_PARSED) {
        $files[] = [$name, $sz, $ty];
        $job_status->totalSize += (int)$sz;
        $idx = count($files) - 1;
        $job_status->files[] = [$nid, $lang, $name, $sz, $ty];
        $this->log("{$nid} {$lang} {$files[$idx][0]} {$files[$idx][1]} {$files[$idx][2]}");
      } else {
        $this->log("{$nid} {$lang} {$name} - $status -- " . $this->status_msg($status));
        $job_status->files[] = [$nid, $lang, $name, 0, $ty];
        $this->save_file($name, "");
        $job_status->missing++;
      }
    }
  }

  /**
   * Generate Parsed File cache
   *
   * Generate and cache parsed file content (pdf mostly, some txt files too)
   * on prod. This will serve two purposes:
   *
   * Search index ignores certain large files as well as problematic ones.
   * Lot of PDFs are secure and in-accessible outside of prod. So, it is
   * impossible to run the indexing job on non-prod environments reliably
   * for the entire content.
   *
   * Parse file contents cached in the prod, can be used in all environments
   * as part of per-environment indexing tasks.
   *
   * In production, if there were ever a need to regenerate the index again, the
   * parsed file content  will cut down the indexing time considerably.
   *
   * @command idt_search:generate-parsed-file-cache
   *
   * @throws \Drupal\search_api\SearchApiException
   */
  public function generate_parsed_file_cache($options): int {
    $options['si'] ??= $this->index_name();
    $limit = $options['limit'];
    $batch_size = $options['batch-size'];

    $this->cache_dir = $options['cache-dir'];
    $this->job_file = $options['job-file'];
    $this->log_file = $options['log-file'];

    $job_status = new stdClass();

    if (!file_exists($this->job_file)) {
      $entity_query = \Drupal::entityQuery('node');
      $entity_query->condition('type', 'document');
//      $entity_query->condition('nid', 973796);
      $entity_query->condition('status', 1);

      $job_status->nids = [];
      $job_status->files = [];

      // convert results into array
      $nids = $entity_query->execute();
      foreach($nids as $nid) {
        $job_status->nids[] = $nid;
      }

      $job_status->totalNodes = count($job_status->nids);
      $job_status->totalSize = $job_status->count = $job_status->missing = 0;
      file_put_contents($this->job_file, json_encode($job_status));
      $this->log("Total no of nodes to process: " . $job_status->totalNodes);
    } else {
      $job_status = json_decode(file_get_contents($this->job_file));
      $this->log("No of nodes processed: " . $job_status->count . " of " . $job_status->totalNodes . " missing " . $job_status->missing);
    }

    $controller = \Drupal::entityTypeManager()->getStorage('node');

    $langs = array_keys(\Drupal::languageManager()->getLanguages());

    $files = [];
    $total = 0;

    $done = FALSE;

    while(!$done && $total < $limit) {
      $count = 0;
      while ($count < $batch_size) {
        if (count($job_status->nids) == 0) {
          $done = TRUE;
          break;
        }

        $nid = array_shift($job_status->nids);
        if (in_array($nid, $this->skip_list)) {
          $this->log("Skipping {$nid} ...");
          $count++;
          continue;
        }


        $node = $controller->load($nid);
        foreach ($langs as $lang) {
          if ($node && $node->hasTranslation($lang)) {
            $node = $node->getTranslation($lang);
            $this->parse_node($node, $nid, $lang, $job_status);
          }
        }

        $count++;
      }

      $total += $count;
      $total_size = $job_status->totalSize;
      file_put_contents($this->job_file, json_encode($job_status));
    }

    $this->log(sprintf("Total nodes: %d PDFs: %d Total Size: {$total_size}K, %5.2fM, %5.2fG", $job_status->count, count($files), $total_size/1024, $total_size/(1024*1024)));
    return 0;
  }
}

// no memory & time limit
ini_set("memory_limit", -1);
set_time_limit(0);

error_reporting(E_ERROR | E_PARSE);

$gpfc = new GenerateParsedFileCache();

$tmp = \Drupal::service('file_system')->getTempDirectory();

$options = [
  'si' => NULL,
  'batch-size' => 1,
  'limit' => 50,
  'job-file' => $tmp . '/parse-documents.json',
  'log-file' => $tmp . '/parse-files-log.txt',
  'cache-dir' => $tmp
];
try {
  $gpfc->generate_parsed_file_cache($options);
} catch (SearchApiException $e) {
  print("Generate Parsed Files: exception - " . $e->getCode() . " " . $e->getMessage());
}
