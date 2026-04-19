<?php

namespace Drupal\pl_work_log\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Looks up a taxonomy term by machine name stored in the description field.
 *
 * Example usage:
 * @code
 * process:
 *   field_work_log_project:
 *     plugin: term_by_machine_name
 *     source: project_id
 *     vocabulary: projects
 * @endcode
 *
 * @MigrateProcessPlugin(
 *   id = "term_by_machine_name"
 * )
 */
class TermByMachineName extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    if (empty($value)) {
      return NULL;
    }

    $vocabulary = $this->configuration['vocabulary'];

    // Look up term by description (which stores the machine name).
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'vid' => $vocabulary,
        'description__value' => $value,
      ]);

    if ($terms) {
      $term = reset($terms);
      return $term->id();
    }

    // Fallback: try matching by name (case-insensitive).
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'vid' => $vocabulary,
        'name' => ucfirst($value),
      ]);

    if ($terms) {
      $term = reset($terms);
      return $term->id();
    }

    return NULL;
  }

}
