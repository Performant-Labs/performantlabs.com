<?php

namespace Drupal\pl_work_log\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Row;

/**
 * Source plugin for Hermes work log SQLite data.
 *
 * @MigrateSource(
 *   id = "hermes_work_log",
 *   source_module = "pl_work_log"
 * )
 */
class HermesWorkLog extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    return $this->select('work_logs', 'w')
      ->fields('w', [
        'id',
        'date',
        'title',
        'hours',
        'event_id',
        'ingested_at',
        'project_id',
        'category',
      ]);
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'id' => $this->t('Primary key / Google Calendar event ID'),
      'date' => $this->t('Work log date (YYYY-MM-DD)'),
      'title' => $this->t('Work log title'),
      'hours' => $this->t('Duration in decimal hours'),
      'event_id' => $this->t('Google Calendar event ID'),
      'ingested_at' => $this->t('ISO-8601 UTC ingest timestamp'),
      'project_id' => $this->t('Project machine name'),
      'category' => $this->t('Category machine name'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'id' => [
        'type' => 'string',
        'max_length' => 255,
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    if (!parent::prepareRow($row)) {
      return FALSE;
    }

    // Convert ingested_at from ISO-8601 to Drupal datetime format.
    $ingested_at = $row->getSourceProperty('ingested_at');
    if ($ingested_at) {
      // Strip trailing 'Z' and ensure format is Y-m-d\TH:i:s.
      $ingested_at = rtrim($ingested_at, 'Z');
      $row->setSourceProperty('ingested_at', $ingested_at);
    }

    return TRUE;
  }

}
