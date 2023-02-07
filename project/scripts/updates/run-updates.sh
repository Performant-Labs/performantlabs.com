#!/bin/bash -x

echo "Remove compare_role_permissions ..."
drush scr scripts/updates/compare_role_permissions.php

echo "Install image_effects updates ..."
drush scr scripts/updates/image_effects.php

#echo "Remove references to acquia_search ..."
#drush scr scripts/updates/acquia_search.php
