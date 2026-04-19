<?php

namespace Drupal\pl_work_log\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for the Work Log Dashboard page.
 */
class DashboardController extends ControllerBase {

  /**
   * Builds the Work Log Dashboard page.
   *
   * @return array
   *   A render array for the dashboard.
   */
  public function build() {
    $build = [];

    // Summary statistics.
    $stats = $this->getStatistics();

    $build['summary'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['work-log-summary']],
    ];

    $build['summary']['stats'] = [
      '#theme' => 'item_list',
      '#title' => 'Summary',
      '#items' => [
        $this->t('This Week (@range): @hours hrs', ['@range' => $stats['week_range'], '@hours' => number_format($stats['week_hours'], 1)]),
        $this->t('This Month (@range): @hours hrs', ['@range' => $stats['month_range'], '@hours' => number_format($stats['month_hours'], 1)]),
        $this->t('Total Hours: @hours hrs', ['@hours' => number_format($stats['total_hours'], 1)]),
        $this->t('Total Entries: @count', ['@count' => $stats['total_entries']]),
      ],
      '#attributes' => ['class' => ['work-log-stats']],
    ];

    // Recent work logs block (from the view).
    $build['recent'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['work-log-recent']],
    ];

    $view = \Drupal\views\Views::getView('work_log_list');
    if ($view) {
      $build['recent']['heading'] = [
        '#markup' => '<h2>' . $this->t('Recent Work Logs') . '</h2>',
      ];
      $view->setDisplay('block_recent');
      $build['recent']['view'] = $view->buildRenderable('block_recent');
    }

    // Project breakdown block (from the view).
    $build['projects'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['work-log-projects']],
    ];

    $project_view = \Drupal\views\Views::getView('work_log_by_project');
    if ($project_view) {
      $build['projects']['heading'] = [
        '#markup' => '<h2>' . $this->t('Hours by Project') . '</h2>',
      ];
      $project_view->setDisplay('block_project_summary');
      $build['projects']['view'] = $project_view->buildRenderable('block_project_summary');
    }

    // Navigation links.
    $build['nav'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['work-log-nav']],
    ];

    $build['nav']['links'] = [
      '#theme' => 'item_list',
      '#items' => [
        \Drupal\Core\Link::createFromRoute($this->t('View All Work Logs'), 'view.work_log_list.page_1')->toRenderable(),
        \Drupal\Core\Link::createFromRoute($this->t('View by Project'), 'view.work_log_by_project.page_1')->toRenderable(),
      ],
    ];

    $build['#cache'] = [
      'tags' => ['node_list:work_log'],
      'contexts' => ['user.roles'],
    ];

    return $build;
  }

  /**
   * Calculates summary statistics for work logs.
   *
   * @return array
   *   Associative array with keys: week_hours, month_hours, total_hours, total_entries.
   */
  protected function getStatistics() {
    $node_storage = $this->entityTypeManager()->getStorage('node');

    // Total hours and entries.
    $query = $node_storage->getQuery()
      ->accessCheck(FALSE)
      ->condition('type', 'work_log')
      ->condition('status', 1);
    $all_nids = $query->execute();

    $total_hours = 0;
    $week_hours = 0;
    $month_hours = 0;

    $now = new \DateTime();
    $week_start_dt = (clone $now)->modify('monday this week');
    $week_end_dt = (clone $week_start_dt)->modify('sunday this week');
    $week_start = $week_start_dt->format('Y-m-d');
    $month_start = $now->format('Y-m-01');
    $month_end_dt = (clone $now)->modify('last day of this month');

    if ($all_nids) {
      $nodes = $node_storage->loadMultiple($all_nids);
      foreach ($nodes as $node) {
        $hours = (float) $node->get('field_work_log_hours')->value;
        $date = $node->get('field_work_log_date')->value;
        $total_hours += $hours;

        if ($date >= $month_start) {
          $month_hours += $hours;
        }
        if ($date >= $week_start) {
          $week_hours += $hours;
        }
      }
    }

    return [
      'week_hours' => $week_hours,
      'week_range' => $week_start_dt->format('M j') . ' – ' . $week_end_dt->format('M j'),
      'month_hours' => $month_hours,
      'month_range' => $now->format('F Y'),
      'total_hours' => $total_hours,
      'total_entries' => count($all_nids),
    ];
  }

}
