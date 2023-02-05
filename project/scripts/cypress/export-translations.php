<?php
/*
 * @file
 *
 * Build language translations file for use by cypress tests.
 *
 * Similar to javascript only translations available in the browser to Drupal.t()
 * but includes all the translations that are available in the backend.
 */
$languages = array_keys(\Drupal::languageManager()->getLanguages());

if (count($languages) > 2) {
  foreach($languages as $language) {
    // Skip the default language, which is usually English.
    if ($language == 'en') continue;

    print("Generating $language ...\n");

    // Only add strings with a translation to the translations array.
    $conditions = [
      'type' => 'javascript',
      'language' => $language,
      'translated' => TRUE,
    ];
    $translations = [];
    foreach (\Drupal::service('locale.storage')->getTranslations($conditions) as $data) {
      $translations[$data->context][$data->source] = $data->translation;
    }
    $locale_plurals = \Drupal::service('locale.plural.formula')->getFormula($language);

    $data = [
      'strings' => $translations,
      'pluralFormula' => $locale_plurals
    ];

    $data = json_encode($data);

    /** @var \Drupal\Core\File\FileSystemInterface $file_system */
    $file_system = \Drupal::service('file_system');
    $file_system->saveData($data,  "public://$language-xlations.json");
  }
}
else {
  print("No additional languages found.\n");
}
