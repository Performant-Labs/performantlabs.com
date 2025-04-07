<?php

namespace Drupal\performant_labs_config\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class PerformantLabsConfigForm extends ConfigFormBase {

  public function getFormId() {
    return 'performant_labs_config_settings';
  }

  protected function getEditableConfigNames() {
    return ['performant_labs_config.settings'];
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('performant_labs_config.settings');

    $form['body'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('body.value'),
      '#format' => $config->get('body.format') ?: 'basic_html',
      '#description' => $this->t('Enter the popup body text.'),
    ];

    $form['pages_to_show'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Allow to pages'),
      '#default_value' => $config->get('pages_to_show'),
      '#description' => $this->t('One path per line where popup should be shown. Example: /node/1'),
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('performant_labs_config.settings')
      ->set('body', [
        'value' => $form_state->getValue('body')['value'],
        'format' => $form_state->getValue('body')['format'],
      ])
      ->set('pages_to_show', $form_state->getValue('pages_to_show'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}



