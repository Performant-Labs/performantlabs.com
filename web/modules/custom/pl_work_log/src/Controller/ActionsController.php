<?php

namespace Drupal\pl_work_log\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Controller for Work Log actions pages.
 */
class ActionsController extends ControllerBase {

  /**
   * Builds the actions overview page.
   *
   * @return array
   *   A render array.
   */
  public function overview() {
    $build = [];

    // Action links.
    $build['actions'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['work-log-actions-links']],
    ];

    $build['actions']['heading'] = [
      '#markup' => '<h2>' . $this->t('Available Actions') . '</h2>',
    ];

    $build['actions']['links'] = [
      '#theme' => 'item_list',
      '#items' => [
        Link::fromTextAndUrl(
          $this->t('View Category Mapping Rules'),
          Url::fromRoute('pl_work_log.actions.category_mapping')
        )->toRenderable() + ['#suffix' => '<br><small>' . $this->t('View the rules used to auto-assign categories.') . '</small>'],
      ],
    ];

    $build['#cache'] = [
      'tags' => ['node_list:work_log', 'config:pl_work_log.category_rules'],
      'max-age' => 0,
    ];

    return $build;
  }

  /**
   * Displays the category mapping rules.
   *
   * @return array
   *   A render array.
   */
  public function categoryMapping() {
    $build = [];
    $config = $this->config('pl_work_log.category_rules');
    $rules = $config->get('rules') ?: [];
    $override = $config->get('override_source') ?: FALSE;
    $fallback = $config->get('fallback_category') ?: 'development';

    // Settings summary.
    $build['settings'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['category-mapping-settings']],
    ];

    $build['settings']['heading'] = [
      '#markup' => '<h2>' . $this->t('Settings') . '</h2>',
    ];

    $build['settings']['info'] = [
      '#theme' => 'item_list',
      '#items' => [
        $this->t('Override source category: @value', ['@value' => $override ? 'Yes' : 'No']),
        $this->t('Fallback category: @value', ['@value' => $fallback]),
      ],
    ];

    if (!$override) {
      $build['settings']['note'] = [
        '#markup' => '<p><em>' . $this->t('When override is off, rules only apply to entries that have no category in the source data.') . '</em></p>',
      ];
    }

    // Rules table.
    $build['rules'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['category-mapping-rules']],
    ];

    $build['rules']['heading'] = [
      '#markup' => '<h2>' . $this->t('Mapping Rules') . '</h2>',
    ];

    $build['rules']['description'] = [
      '#markup' => '<p>' . $this->t('Rules are evaluated in order. The first matching rule wins.') . '</p>',
    ];

    $header = [
      $this->t('#'),
      $this->t('Label'),
      $this->t('Field'),
      $this->t('Match Type'),
      $this->t('Pattern'),
      $this->t('Category'),
    ];

    $rows = [];
    foreach ($rules as $index => $rule) {
      $rows[] = [
        $index + 1,
        $rule['label'] ?? '',
        $rule['field'] ?? 'title',
        $rule['match_type'] ?? 'contains',
        $rule['pattern'] ?? '',
        $rule['category'] ?? '',
      ];
    }

    $build['rules']['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => $this->t('No rules defined.'),
      '#attributes' => ['class' => ['category-mapping-rules-table']],
    ];

    // How to edit.
    $build['edit'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['category-mapping-edit']],
    ];

    $build['edit']['heading'] = [
      '#markup' => '<h2>' . $this->t('How to Edit') . '</h2>',
    ];

    $build['edit']['instructions'] = [
      '#markup' => '<p>' . $this->t('Edit the rules via Drush:') . '</p>'
        . '<pre>ddev drush config:edit pl_work_log.category_rules</pre>'
        . '<p>' . $this->t('Or edit the YAML file directly:') . '</p>'
        . '<pre>web/modules/custom/pl_work_log/config/install/pl_work_log.category_rules.yml</pre>'
        . '<p>' . $this->t('After editing, re-run the ingestion to apply the new rules.') . '</p>',
    ];

    // Back link.
    $build['back'] = [
      '#markup' => '<p>' . Link::fromTextAndUrl(
        $this->t('← Back to Actions'),
        Url::fromRoute('pl_work_log.actions')
      )->toString() . '</p>',
    ];

    $build['#cache'] = [
      'tags' => ['config:pl_work_log.category_rules'],
    ];

    return $build;
  }

}
