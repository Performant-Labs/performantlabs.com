<?php

namespace Drupal\pl_work_log\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Auto-maps a work log entry to a category based on configurable rules.
 *
 * Reads rules from the pl_work_log_category_rules database table. Rules are evaluated
 * in order; the first match wins. If the source already has a category
 * and override_source is false, the existing category is preserved.
 *
 * Returns a taxonomy term ID for the matched category.
 *
 * Example usage:
 * @code
 * process:
 *   field_work_log_category:
 *     plugin: category_auto_map
 *     source: category
 *     vocabulary: work_log_categories
 * @endcode
 *
 * @MigrateProcessPlugin(
 *   id = "category_auto_map",
 *   handle_multiples = FALSE
 * )
 */
class CategoryAutoMap extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    $config = \Drupal::config('pl_work_log.category_rules');
    $override = $config->get('override_source') ?: FALSE;
    $fallback = $config->get('fallback_category') ?: 'development';

    // Load rules from the database table, ordered by weight.
    $rules = \Drupal::database()->select('pl_work_log_category_rules', 'r')
      ->fields('r', ['field_name', 'match_type', 'pattern', 'category'])
      ->orderBy('weight')
      ->execute()
      ->fetchAll();
    $vocabulary = $this->configuration['vocabulary'] ?? 'work_log_categories';

    // If source already has a category and we're not overriding, use it.
    $source_category = $value;
    if (!empty($source_category) && !$override) {
      return $this->resolveTermId($source_category, $vocabulary);
    }

    // Evaluate rules in order.
    foreach ($rules as $rule) {
      $field = $rule->field_name ?? 'title';
      $field_value = $row->getSourceProperty($field);

      if (empty($field_value)) {
        continue;
      }

      $match_type = $rule->match_type ?? 'contains';
      $pattern = $rule->pattern ?? '';
      $matched = FALSE;

      switch ($match_type) {
        case 'contains':
          $matched = stripos($field_value, $pattern) !== FALSE;
          break;

        case 'exact':
          $matched = strtolower($field_value) === strtolower($pattern);
          break;

        case 'regex':
          $matched = (bool) preg_match('/' . $pattern . '/i', $field_value);
          break;
      }

      if ($matched) {
        $term_id = $this->resolveTermId($rule->category, $vocabulary);
        if ($term_id) {
          return $term_id;
        }
      }
    }

    // Fallback.
    return $this->resolveTermId($fallback, $vocabulary);
  }

  /**
   * Resolves a category machine name to a taxonomy term ID.
   *
   * Looks up by the description field first (where machine names are stored),
   * then falls back to name matching.
   *
   * @param string $machine_name
   *   The category machine name.
   * @param string $vocabulary
   *   The vocabulary ID.
   *
   * @return int|null
   *   The term ID, or NULL if not found.
   */
  protected function resolveTermId($machine_name, $vocabulary) {
    // Look up by description (machine name storage).
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'vid' => $vocabulary,
        'description__value' => $machine_name,
      ]);

    if ($terms) {
      return reset($terms)->id();
    }

    // Fallback: match by name.
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'vid' => $vocabulary,
        'name' => ucfirst($machine_name),
      ]);

    if ($terms) {
      return reset($terms)->id();
    }

    return NULL;
  }

}
