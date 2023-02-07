<?php
// disable the css to hide toolbar status
\Drupal::service('config.factory')->getEditable('asset_injector.css.hide_acquia_cloud_status_in_admin_toolbar')
  ->set('status', 0)
  ->save();
