<?php

namespace Drupal\pl_main\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class PerformantLabsConfigForm extends ConfigFormBase {

  public function getFormId() {
    return 'pl_main_settings';
  }

  protected function getEditableConfigNames() {
    return ['pl_main.settings'];
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('pl_main.settings');

    $form['body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('body.value'),
      // '#format' => $config->get('body.format') ?: 'basic_html',
      '#description' => $this->t('Enter the popup body text.'),
    ];

    $form['pages_to_show'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Allow to pages'),
      '#default_value' => $config->get('pages_to_show'),
      '#description' => $this->t('One path per line where popup should be shown. Example: /node/1'),
    ];

    $form['delay_time'] = [
      '#type' => 'number',
      '#title' => $this->t('Delay Time'),
      '#default_value' => $config->get('delay_time'),
      '#description' => $this->t('Enter delay time for the popup (in milliseconds), e.g., 1000 = 1 second.'),
      
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('pl_main.settings')
      ->set('body', [
        'value' => $form_state->getValue('body'),
        // 'format' => $form_state->getValue('body')['format'],
      ])
      ->set('pages_to_show', $form_state->getValue('pages_to_show'))
      ->set('delay_time', $form_state->getValue('delay_time'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
