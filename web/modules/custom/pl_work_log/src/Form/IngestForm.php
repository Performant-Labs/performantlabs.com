<?php

namespace Drupal\pl_work_log\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Form to trigger work log migration import.
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
    return $this->t('Ingest new work log hours?');
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    // Show current migration status.
    try {
      $migration_manager = \Drupal::service('plugin.manager.migration');
      $migration = $migration_manager->createInstance('work_log_import');
      $source = $migration->getSourcePlugin();
      $map = $migration->getIdMap();

      $source_count = $source->count();
      $imported = $map->importedCount();
      $unprocessed = max(0, $source_count - $imported);

      return $this->t('This will run the work log migration.<br>Source records: @source<br>Already imported: @imported<br>New/updated: @unprocessed', [
        '@source' => $source_count,
        '@imported' => $imported,
        '@unprocessed' => $unprocessed,
      ]);
    }
    catch (\Exception $e) {
      return $this->t('This will run the work log migration. Unable to read source status.');
    }
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
    try {
      $migration_manager = \Drupal::service('plugin.manager.migration');
      $migration = $migration_manager->createInstance('work_log_import');

      $executable = new \Drupal\migrate\MigrateExecutable($migration, new \Drupal\migrate\MigrateMessage());
      $result = $executable->import();

      $map = $migration->getIdMap();
      $imported = $map->importedCount();

      if ($result === \Drupal\migrate\MigrateExecutable::RESULT_COMPLETED) {
        $this->messenger()->addStatus($this->t('Ingestion completed successfully. Total imported: @count entries.', [
          '@count' => $imported,
        ]));
      }
      else {
        $this->messenger()->addWarning($this->t('Ingestion finished with status: @status. Total imported: @count entries.', [
          '@status' => $result,
          '@count' => $imported,
        ]));
      }
    }
    catch (\Exception $e) {
      $this->messenger()->addError($this->t('Ingestion failed: @error', [
        '@error' => $e->getMessage(),
      ]));
    }

    $form_state->setRedirectUrl($this->getCancelUrl());
  }

}
