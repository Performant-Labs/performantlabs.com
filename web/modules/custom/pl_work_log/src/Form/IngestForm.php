<?php

namespace Drupal\pl_work_log\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\node\Entity\Node;
use Drupal\Core\Site\Settings;

/**
 * Form to trigger work log ingestion from the Hermes API.
 */
class IngestForm extends ConfirmFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pl_work_log_ingest_form';
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return $this->t('Ingest work log entries from calendar?');
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    return $this->t('This will fetch work log entries from the Hermes API and create or update corresponding nodes.');
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Run Ingestion');
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return Url::fromRoute('pl_work_log.actions');
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $api_url = Settings::get('hermes_api_url') ?: getenv('HERMES_API_URL');
    $api_token = Settings::get('hermes_api_token') ?: getenv('HERMES_API_TOKEN');

    if (!$api_url || !$api_token) {
      $this->messenger()->addError($this->t('Hermes API URL or token not configured. Set HERMES_API_URL and HERMES_API_TOKEN environment variables.'));
      $form_state->setRedirectUrl($this->getCancelUrl());
      return;
    }

    try {
      $response = \Drupal::httpClient()->get($api_url, [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_token,
          'Accept' => 'application/json',
        ],
        'timeout' => 30,
      ]);

      $data = json_decode((string) $response->getBody(), TRUE);
      if (!is_array($data)) {
        $this->messenger()->addError($this->t('Invalid response from Hermes API.'));
        $form_state->setRedirectUrl($this->getCancelUrl());
        return;
      }

      $created = 0;
      $updated = 0;
      $skipped = 0;

      foreach ($data as $entry) {
        $result = $this->upsertWorkLog($entry);
        if ($result === 'created') {
          $created++;
        }
        elseif ($result === 'updated') {
          $updated++;
        }
        else {
          $skipped++;
        }
      }

      $this->messenger()->addStatus($this->t('Ingestion complete. Created: @created, Updated: @updated, Skipped: @skipped.', [
        '@created' => $created,
        '@updated' => $updated,
        '@skipped' => $skipped,
      ]));
    }
    catch (\Exception $e) {
      $this->messenger()->addError($this->t('Ingestion failed: @error', [
        '@error' => $e->getMessage(),
      ]));
    }

    $form_state->setRedirectUrl($this->getCancelUrl());
  }

  /**
   * Creates or updates a work_log node from an API entry.
   *
   * @param array $entry
   *   A work log entry from the Hermes API.
   *
   * @return string
   *   One of 'created', 'updated', or 'skipped'.
   */
  protected function upsertWorkLog(array $entry) {
    $hermes_id = $entry['id'] ?? NULL;
    $title = $entry['title'] ?? '';
    $date = $entry['date'] ?? '';
    $hours = $entry['hours'] ?? 0;
    $project = $entry['project_id'] ?? '';
    $category = $entry['category'] ?? '';

    if (!$hermes_id || !$title || !$date) {
      return 'skipped';
    }

    // Look for existing node by hermes_id.
    $existing = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->getQuery()
      ->accessCheck(FALSE)
      ->condition('type', 'work_log')
      ->condition('field_work_log_event_id', $hermes_id)
      ->range(0, 1)
      ->execute();

    if ($existing) {
      $node = Node::load(reset($existing));
      $node->setTitle($title);
      $node->set('field_work_log_date', $date);
      $node->set('field_work_log_hours', $hours);
      $this->setTaxonomyFields($node, $project, $category);
      $node->save();
      return 'updated';
    }

    // Create new node.
    $node = Node::create([
      'type' => 'work_log',
      'title' => $title,
      'field_work_log_event_id' => $hermes_id,
      'field_work_log_date' => $date,
      'field_work_log_hours' => $hours,
      'field_work_log_ingested_at' => date('Y-m-d\TH:i:s'),
    ]);
    $this->setTaxonomyFields($node, $project, $category);
    $node->save();
    return 'created';
  }

  /**
   * Sets project and category taxonomy reference fields.
   */
  protected function setTaxonomyFields($node, $project, $category) {
    if ($project) {
      $tid = $this->findTermByMachineName('projects', $project);
      if ($tid) {
        $node->set('field_work_log_project', $tid);
      }
    }
    if ($category) {
      $tid = $this->findTermByMachineName('work_log_categories', $category);
      if ($tid) {
        $node->set('field_work_log_category', $tid);
      }
    }
  }

  /**
   * Finds a taxonomy term ID by its machine name stored in description.
   */
  protected function findTermByMachineName($vid, $machine_name) {
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->getQuery()
      ->accessCheck(FALSE)
      ->condition('vid', $vid)
      ->condition('description__value', $machine_name)
      ->range(0, 1)
      ->execute();
    return $terms ? reset($terms) : NULL;
  }

}
