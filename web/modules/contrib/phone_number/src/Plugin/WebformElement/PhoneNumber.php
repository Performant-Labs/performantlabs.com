<?php

namespace Drupal\phone_number\Plugin\WebformElement;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\webform\Plugin\WebformElementBase;
use Drupal\webform\WebformSubmissionInterface;
use libphonenumber\PhoneNumberFormat;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'phone_number' element.
 *
 * @WebformElement(
 *   id = "phone_number",
 *   label = @Translation("Phone Number"),
 *   description = @Translation("Provides a form element for input of a phone number."),
 *   category = @Translation("Advanced elements"),
 *   composite = TRUE,
 * )
 */
class PhoneNumber extends WebformElementBase {

  /**
   * The Phone Number field utility.
   *
   * @var \Drupal\phone_number\PhoneNumberUtilInterface
   */
  protected $phoneNumberUtil;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->phoneNumberUtil = $container->get('phone_number.util');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function getDefaultProperties() {
    return parent::getDefaultProperties() + [
      'multiple' => FALSE,
      'multiple__header_label' => '',
      'default_country' => 'US',
      'allowed_countries' => NULL,
      'allowed_types' => NULL,
      'extension_field' => FALSE,
      'placeholder' => 'Phone number',
      'as_link' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    $form['phone_number'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Phone Number Settings'),
    ];

    $form['phone_number']['default_country'] = [
      '#type' => 'select',
      '#title' => $this->t('Default Country'),
      '#options' => $this->phoneNumberUtil->getCountryOptions(NULL, TRUE),
      '#description' => $this->t('Default country for phone number input.'),
      '#required' => TRUE,
    ];

    $form['phone_number']['allowed_countries'] = [
      '#type' => 'select',
      '#title' => $this->t('Allowed Countries'),
      '#options' => $this->phoneNumberUtil->getCountryOptions(NULL, TRUE),
      '#description' => $this->t('Allowed counties for the phone number. If none selected, then all are allowed.'),
      '#multiple' => TRUE,
      '#attached' => ['library' => ['phone_number/element']],
    ];

    $form['phone_number']['allowed_types'] = [
      '#type' => 'select',
      '#title' => $this->t('Allowed Types'),
      '#options' => $this->phoneNumberUtil->getTypeOptions(),
      '#description' => $this->t('Restrict entry to certain types of phone numbers. If none are selected, then all types are allowed.  A description of each type can be found <a href="@url" target="_blank">here</a>.', [
        '@url' => 'https://github.com/giggsey/libphonenumber-for-php/blob/master/src/PhoneNumberType.php',
      ]),
      '#multiple' => TRUE,
    ];

    $form['extension_field'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable <em>Extension</em> field'),
      '#description' => $this->t('Collect extension along with the phone number.'),
    ];

    $form['phone_number']['placeholder'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Number Placeholder'),
      '#description' => $this->t('Number field placeholder.'),
    ];

    $form['display']['as_link'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show as TEL link'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    parent::validateConfigurationForm($form, $form_state);

    $default_country = $form_state->getValue('default_country');
    $allowed_countries = $form_state->getValue('allowed_countries');
    if (!empty($allowed_countries) && !in_array($default_country, $allowed_countries)) {
      $form_state->setErrorByName('phone_number][default_country', $this->t('Default country is not in one of the allowed countries.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function setDefaultValue(array &$element) {
    parent::setDefaultValue($element);

    $settings = [
      'default_country' => !empty($element['#default_country']) ? $element['#default_country'] : 'US',
    ];

    // When multiple values are allow on the Webform element, the
    // '#default_value' key can already be present with either the default
    // value key as string or NULL.
    // These situations arise because of
    // \Drupal\webform\Element\WebformMultiple::setElementDefaultValue
    // and
    // \Drupal\webform\Element\WebformMultiple::setElementRowDefaultValueRecursive.
    //
    // Use the given default value.
    if (isset($element['#default_value']) && is_string($element['#default_value'])) {

      $element['#default_value'] = [
        'country' => $element['#default_value'],
      ];
    }
    // Force set with settings, as NULL + an array doesn't result in an array.
    // If the value is an empty array, this is fine too.
    elseif (empty($element['#default_value'])) {

      $element['#default_value'] = [
        'country' => $settings['default_country'],
      ];
    }
    // The code doesn't seem to end up here, but keep this in case
    // '#default_value' isset, is not a string and assume it will be an array.
    else {

      $element += [
        '#default_value' => [
          'country' => $settings['default_country'],
        ],
      ];
    }
  }

  /**
   * {@inheritdoc}
   */
  public function prepare(array &$element, WebformSubmissionInterface $webform_submission = NULL) {
    parent::prepare($element, $webform_submission);

    $settings = [
      'allowed_countries' => !empty($element['#allowed_countries']) ? $element['#allowed_countries'] : NULL,
      'allowed_types' => !empty($element['#allowed_types']) ? $element['#allowed_types'] : NULL,
      'extension_field' => !empty($element['#extension_field']) ? $element['#extension_field'] : FALSE,
      'placeholder' => $element['#placeholder'] ?? 'Phone number',
    ];

    $element += [
      '#phone_number' => [
        'allowed_countries' => $settings['allowed_countries'],
        'allowed_types' => $settings['allowed_types'],
        'extension_field' => $settings['extension_field'],
        'placeholder' => $settings['placeholder'],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function formatHtmlItem(array $element, WebformSubmissionInterface $webform_submission, array $options = []) {
    $value = $this->getValue($element, $webform_submission, $options);

    if (empty($value['value'])) {
      return '';
    }

    $format = $this->getItemFormat($element);
    $phoneDisplayFormat = NULL;
    switch ($format) {
      case 'phone_number_international':
        $phoneDisplayFormat = PhoneNumberFormat::INTERNATIONAL;
        break;

      case 'phone_number_local':
        $phoneDisplayFormat = PhoneNumberFormat::NATIONAL;
        break;
    }
    $as_link = !empty($element['#as_link']);

    $extension = NULL;
    if (!empty($element['#extension_field']) && isset($value['extension'])) {
      $extension = $value['extension'];
    }

    if ($phone_number = $this->phoneNumberUtil->getPhoneNumber($value['value'], NULL, $extension)) {
      if (!empty($as_link)) {
        $element = [
          '#type' => 'link',
          '#title' => $this->phoneNumberUtil->libUtil()->format($phone_number, $phoneDisplayFormat),
          '#url' => Url::fromUri($this->phoneNumberUtil->getRfc3966Uri($phone_number)),
        ];
      }
      else {
        $element = [
          '#plain_text' => $this->phoneNumberUtil->libUtil()->format($phone_number, $phoneDisplayFormat),
        ];
      }
    }

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function getItemDefaultFormat() {
    return 'phone_number_international';
  }

  /**
   * {@inheritdoc}
   */
  public function getItemFormats() {
    return parent::getItemFormats() + [
      'phone_number_international' => $this->t('International'),
      'phone_number_local' => $this->t('Local Number'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function formatText(array $element, WebformSubmissionInterface $webform_submission, array $options = []) {
    $data = $webform_submission->getData($element['#webform_key']);
    return !empty($data['value']) ? $webform_submission->getData($element['#webform_key'])['value'] : '';
  }

}
