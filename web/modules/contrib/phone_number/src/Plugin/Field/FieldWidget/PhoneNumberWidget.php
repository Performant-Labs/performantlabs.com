<?php

namespace Drupal\phone_number\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\phone_number\PhoneNumberUtilInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation of the 'phone_number' widget.
 *
 * @FieldWidget(
 *   id = "phone_number_default",
 *   label = @Translation("Phone Number"),
 *   description = @Translation("Phone number field default widget."),
 *   field_types = {
 *     "phone_number",
 *     "telephone"
 *   }
 * )
 */
class PhoneNumberWidget extends WidgetBase {

  /**
   * The Phone Number field utility.
   *
   * @var \Drupal\phone_number\PhoneNumberUtilInterface
   */
  protected $phoneNumberUtil;

  /**
   * {@inheritdoc}
   */
  public function __construct($plugin_id, $plugin_definition, FieldDefinitionInterface $field_definition, array $settings, array $third_party_settings, PhoneNumberUtilInterface $phone_number_util) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $third_party_settings);

    $this->phoneNumberUtil = $phone_number_util;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['third_party_settings'],
      $container->get('phone_number.util')
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return parent::defaultSettings() + [
      'default_country' => 'US',
      'placeholder' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element = parent::settingsForm($form, $form_state);
    $field_settings = $this->getFieldSettings();
    $allowed_countries = NULL;
    if (!empty($field_settings['allowed_countries'])) {
      $allowed_countries = $field_settings['allowed_countries'];
    }

    $form_state->set('field_item', $this);

    $element['default_country'] = [
      '#type' => 'select',
      '#title' => $this->t('Default Country'),
      '#options' => $this->phoneNumberUtil->getCountryOptions($allowed_countries, TRUE),
      '#default_value' => $this->getSetting('default_country'),
      '#description' => $this->t('Default country for phone number input.'),
      '#required' => TRUE,
    ];

    $element['placeholder'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Number Placeholder'),
      '#default_value' => $this->getSetting('placeholder') !== NULL ? $this->getSetting('placeholder') : 'Phone number',
      '#description' => $this->t('Number field placeholder.'),
      '#required' => FALSE,
    ];

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $result = [];

    $result[] = $this->t('Default country: @country', ['@country' => $this->getSetting('default_country')]);

    $result[] = $this->t('Number placeholder: @placeholder', ['@placeholder' => $this->getSetting('placeholder') !== NULL ? $this->getSetting('placeholder') : 'Phone number']);

    return $result;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $item = $items[$delta];
    /** @var ContentEntityInterface $entity */
    $entity = $items->getEntity();
    $settings = $this->getFieldSettings();
    $settings += $this->getSettings() + static::defaultSettings();

    $default_country = empty($settings['allowed_countries']) ?
      $settings['default_country'] :
      (empty($settings['allowed_countries'][$settings['default_country']]) ?
        key($settings['allowed_countries']) : $settings['default_country']);

    $element += [
      '#type' => 'phone_number',
      '#description' => $element['#description'],
      '#default_value' => [
        'value' => $item->value,
        'country' => !empty($item->country) ? $item->country : $default_country,
        'local_number' => $item->local_number,
        'extension' => $item->extension,
      ],
      '#phone_number' => [
        'allowed_countries' => !empty($settings['allowed_countries']) ? $settings['allowed_countries'] : NULL,
        'allowed_types' => !empty($settings['allowed_types']) ? $settings['allowed_types'] : NULL,
        'token_data' => !empty($entity) ? [$entity->getEntityTypeId() => $entity] : [],
        'placeholder' => isset($settings['placeholder']) ? $settings['placeholder'] : NULL,
        'extension_field' => isset($settings['extension_field']) ? $settings['extension_field'] : FALSE,
      ],
    ];

    return $element;
  }

}
