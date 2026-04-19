<?php

namespace Drupal\pl_work_log\Form;

use Drupal\Core\Database\Connection;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Form for managing category auto-mapping rules.
 */
class CategoryRulesForm extends FormBase {

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * Constructs a CategoryRulesForm.
   *
   * @param \Drupal\Core\Database\Connection $database
   *   The database connection.
   */
  public function __construct(Connection $database) {
    $this->database = $database;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('database')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pl_work_log_category_rules_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#tree'] = TRUE;

    $form['description'] = [
      '#markup' => '<p>' . $this->t('Rules are evaluated in order (by weight). The first matching rule wins. Drag rows to reorder.') . '</p>',
    ];

    // Settings from config.
    $config = $this->config('pl_work_log.category_rules');

    $form['settings'] = [
      '#type' => 'details',
      '#title' => $this->t('Settings'),
      '#open' => FALSE,
    ];

    $form['settings']['override_source'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Override source category'),
      '#description' => $this->t('When checked, rules are applied even if the source record already has a category.'),
      '#default_value' => $config->get('override_source') ?: FALSE,
    ];

    $form['settings']['fallback_category'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Fallback category'),
      '#description' => $this->t('Category machine name used when no rule matches.'),
      '#default_value' => $config->get('fallback_category') ?: 'development',
      '#size' => 30,
    ];

    // Build the draggable table.
    $form['rules'] = [
      '#type' => 'table',
      '#header' => [
        $this->t('Label'),
        $this->t('Field'),
        $this->t('Match'),
        $this->t('Pattern'),
        $this->t('Category'),
        $this->t('Weight'),
        $this->t('Delete'),
      ],
      '#empty' => $this->t('No rules defined yet.'),
      '#tabledrag' => [
        [
          'action' => 'order',
          'relationship' => 'sibling',
          'group' => 'rule-weight',
        ],
      ],
    ];

    // Load existing rules.
    $rules = $this->database->select('pl_work_log_category_rules', 'r')
      ->fields('r')
      ->orderBy('weight')
      ->execute()
      ->fetchAll();

    foreach ($rules as $rule) {
      $id = $rule->id;
      $form['rules'][$id] = $this->buildRuleRow($rule);
    }

    // "Add new rule" section.
    $form['new_rule'] = [
      '#type' => 'details',
      '#title' => $this->t('Add New Rule'),
      '#open' => FALSE,
    ];

    $form['new_rule']['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#size' => 30,
    ];

    $form['new_rule']['field_name'] = [
      '#type' => 'select',
      '#title' => $this->t('Field'),
      '#options' => [
        'title' => $this->t('Title'),
        'project_id' => $this->t('Project ID'),
      ],
      '#default_value' => 'title',
    ];

    $form['new_rule']['match_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Match Type'),
      '#options' => [
        'contains' => $this->t('Contains'),
        'exact' => $this->t('Exact'),
        'regex' => $this->t('Regex'),
      ],
      '#default_value' => 'contains',
    ];

    $form['new_rule']['pattern'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Pattern'),
      '#size' => 30,
    ];

    $form['new_rule']['category'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Category (machine name)'),
      '#size' => 20,
    ];

    $form['actions'] = [
      '#type' => 'actions',
    ];

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save Rules'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * Builds a single rule row for the draggable table.
   *
   * @param object $rule
   *   The rule record from the database.
   *
   * @return array
   *   A form row render array.
   */
  protected function buildRuleRow($rule) {
    $row = [
      '#attributes' => ['class' => ['draggable']],
      '#weight' => $rule->weight,
    ];

    $row['label'] = [
      '#type' => 'textfield',
      '#default_value' => $rule->label,
      '#size' => 25,
      '#required' => TRUE,
    ];

    $row['field_name'] = [
      '#type' => 'select',
      '#options' => [
        'title' => $this->t('Title'),
        'project_id' => $this->t('Project ID'),
      ],
      '#default_value' => $rule->field_name,
    ];

    $row['match_type'] = [
      '#type' => 'select',
      '#options' => [
        'contains' => $this->t('Contains'),
        'exact' => $this->t('Exact'),
        'regex' => $this->t('Regex'),
      ],
      '#default_value' => $rule->match_type,
    ];

    $row['pattern'] = [
      '#type' => 'textfield',
      '#default_value' => $rule->pattern,
      '#size' => 20,
      '#required' => TRUE,
    ];

    $row['category'] = [
      '#type' => 'textfield',
      '#default_value' => $rule->category,
      '#size' => 15,
      '#required' => TRUE,
    ];

    $row['weight'] = [
      '#type' => 'weight',
      '#title' => $this->t('Weight'),
      '#title_display' => 'invisible',
      '#default_value' => $rule->weight,
      '#delta' => 50,
      '#attributes' => ['class' => ['rule-weight']],
    ];

    $row['delete'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Delete'),
      '#title_display' => 'invisible',
    ];

    return $row;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $rules = $form_state->getValue('rules') ?: [];

    // Process deletes and updates.
    foreach ($rules as $id => $values) {
      if (!empty($values['delete'])) {
        $this->database->delete('pl_work_log_category_rules')
          ->condition('id', $id)
          ->execute();
        $this->messenger()->addStatus($this->t('Deleted rule: @label', ['@label' => $values['label']]));
      }
      else {
        $this->database->update('pl_work_log_category_rules')
          ->fields([
            'label' => $values['label'],
            'field_name' => $values['field_name'],
            'match_type' => $values['match_type'],
            'pattern' => $values['pattern'],
            'category' => $values['category'],
            'weight' => $values['weight'],
          ])
          ->condition('id', $id)
          ->execute();
      }
    }

    // Add new rule if filled in.
    $new = $form_state->getValue('new_rule');
    if (!empty($new['label']) && !empty($new['pattern']) && !empty($new['category'])) {
      // Set weight to max + 1.
      $max_weight = $this->database->select('pl_work_log_category_rules', 'r')
        ->fields('r', ['weight'])
        ->orderBy('weight', 'DESC')
        ->range(0, 1)
        ->execute()
        ->fetchField();

      $this->database->insert('pl_work_log_category_rules')
        ->fields([
          'label' => $new['label'],
          'field_name' => $new['field_name'],
          'match_type' => $new['match_type'],
          'pattern' => $new['pattern'],
          'category' => $new['category'],
          'weight' => ($max_weight !== FALSE ? $max_weight + 1 : 0),
        ])
        ->execute();
      $this->messenger()->addStatus($this->t('Added new rule: @label', ['@label' => $new['label']]));
    }

    // Save settings to config.
    $settings = $form_state->getValue('settings');
    \Drupal::configFactory()->getEditable('pl_work_log.category_rules')
      ->set('override_source', (bool) $settings['override_source'])
      ->set('fallback_category', $settings['fallback_category'])
      ->save();

    $this->messenger()->addStatus($this->t('Category mapping rules saved.'));
  }

}
