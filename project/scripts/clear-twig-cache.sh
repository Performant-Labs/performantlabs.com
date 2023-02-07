#!/bin/bash
set -x

for I in {1..12}; do
  echo $I
  ssh acq.idtd8.prod$I "cd /var/www/html/idtd8.prod; drush @idtd8.prod --uri=http://www.renesas.com/ ev '\Drupal\Core\PhpStorage\PhpStorageFactory::get(\"twig\")->deleteAll();'"
done
