<?php

namespace Drupal\pl_work_log\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Confirmation form to rollback the work log migration.
 */
class RollbackForm extends ConfirmFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pl_work_log_rollback_form';
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return $this->t('Are you sure you want to rollback all imported work logs?');
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    try {
      $migration_manager = \Drupal::service('plugin.manager.migration');
      $migration = $migration_manager->createInstance('work_log_import');
      $map = $migration->getIdMap();
      $imported = $map->importedCount();

      return $this->t('This will delete all @count imported work log nodes. The source data in the SQLite database will not be affected. You can re-import at any time.', [
        '@count' => $imported,
      ]);
    }
    catch (\Exception $e) {
      return $this->t('This will delete all imported work log nodes. The source data will not be affected.');
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Rollback');
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
      $executable->rollback();

      $this->messenger()->addStatus($this->t('Rollback completed. All imported work log nodes have been removed.'));
    }
    catch (\Exception $e) {
      $this->messenger()->addError($this->t('Rollback failed: @error', [
        '@error' => $e->getMessage(),
      ]));
    }

    $form_state->setRedirectUrl($this->getCancelUrl());
  }

}
