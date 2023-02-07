<?php

define('AWS_KEY', getenv('AWS_KEY'));
define('AWS_SECRET_KEY', getenv('AWS_SECRET_KEY'));

$destination = "/home/idtd8/bmosher/userapi/renesas-ide-daily";

$client = new \Aws\S3\S3Client([
  'region' => 'us-west-2',
  'version' => '2006-03-01',
  'credentials' => [
    'key' => AWS_KEY,
    'secret' => AWS_SECRET_KEY,
  ]
]);

$date = NULL;
foreach ($_SERVER['argv'] as $key => $value) {
  if ($value == "scr") {
    $date = date("Y-m-d", strtotime($_SERVER['argv'][$key + 2]));
    print $date . "\n";
  }
}

if (empty($date)) {
  exit;
}

/** @var \Drupal\idt_health\SumoLogicLogger $sumologic */
$sumologic = \Drupal::service('idt_health.sumologic');
$log_message = [
  'message_type' => 'cron:userapi-process.php',
  'start' => \Drupal::time()->getCurrentTime(),
  'step' => 'start',
  'argv_date' => $date,
];
$sumologic->log($log_message);

$results = $client->getPaginator('ListObjects', [
    'Bucket' => 'renesas-ide',
]);

$line_count = 0;
$emails = [];

if ($fh = gzopen("$destination/IDE_$date.csv.gz", "w9")) {
  foreach ($results as $result) {
    foreach ($result['Contents'] as $object) {
      if (preg_match('/^IDE_' . $date . '/', $object['Key'])) {
        $file = $client->getObject([
          'Bucket' => 'renesas-ide',
          'Key' => $object['Key'],
        ]);
        $lines = preg_split('/$\R?^/m', $file['Body']);
        foreach ($lines as $line) {
          $line_count++;
          $data = str_getcsv($line);
          if ($data[0] != 'messageId') {
            $message = explode('|', $data[12]);
            $message = array_map('trim', $message);
            $email = getEmail($message[0]);
            $emails[$email] = $email;
            $row = [
              $message[0],
              $email,
              $message[1],
              $message[2],
              $message[3]
            ];
            fputcsv($fh, $row);
          }
        }
      }
    }
  }
  gzclose($fh);

  $result = $client->putObject([
    'Bucket' => 'renesas-ide-daily',
    'Key' => "IDE_$date.csv.gz",
    'SourceFile' => "$destination/IDE_$date.csv.gz",
  ]);

}
$log_message['step'] = 'end';
$log_message['log_lines'] = $line_count;
$log_message['emails'] = count($emails);
$log_message['end'] = \Drupal::time()->getCurrentTime();
$sumologic->log($log_message);

exit;


function getEmail($customer_id) {
  static $users = [];
  if (!array_key_exists($customer_id, $users)) {
    $query = \Drupal::database()->select('users_field_data', 'u')->fields('u', ['mail']);
    $conditions = $query->orConditionGroup()
      ->condition('myrenesas_id', $customer_id)
      ->condition('okta_id', $customer_id)
      ->condition('aem_id', $customer_id);
    $query->condition($conditions)->range(0, 1);
    $users[$customer_id] = $query->execute()->fetchField();
    //print "loaded: $customer_id " . $users[$customer_id] . "\n";
  }
  return $users[$customer_id];
}
