#!/bin/bash
cd /var/www/html/idtd8.prod

LIMIT=$1
LIMIT_NUMBER='^[0-9]+$'
if ! [[ $LIMIT =~ $LIMIT_NUMBER && $LIMIT -gt 0 ]]; then
  echo
  echo "usage:"
  echo "  index [time_limit_in_seconds]"
  echo
  exit
fi
START=`date +"%s"`
NOW=$START

date

while [ $(expr $START + $LIMIT) -gt $NOW ]; do
  #drush sapi-i opensolr_search_index_cluster_b --batch-size=25 --limit=25
  #drush sapi-i opensolr_search_index_cluster_b --batch-size=25 --limit=25 2>&1 | grep "The external command could not be executed"
  drush sapi-i opensolr_search_index_cluster_b --batch-size=25 --limit=25 2>&1 | grep 'Output is empty\|Syntax error'
  if [[ $? -eq 0 ]]; then
    echo "Found a bad document in the batch of 25, batching 1 at a time"
    #drush sapi-i opensolr_search_index_cluster_b --batch-size=1 --limit=25 2>&1 | grep "The external command could not be executed"
    drush sapi-i opensolr_search_index_cluster_b --batch-size=1 --limit=25 2>&1 | grep 'Output is empty\|Syntax error'
    if [[ $? -eq 0 ]]; then
      echo "Found the bad document"
      drush sql:query "select *, from_unixtime(changed) from search_api_item where status=1 and index_id='opensolr_search_index_cluster_b' order by changed asc, item_id asc limit 1; update search_api_item set status=0 where status=1 and index_id='opensolr_search_index_cluster_b' order by changed asc, item_id asc limit 1;" | tee -a ~/bad-docs-opensolr
    fi
  fi
  sleep 5s

  PROGRESS=`drush sapi-s | grep opensolr_search_index_cluster_b`
  echo "$PROGRESS"
  if [[ $PROGRESS =~ '100%' ]]; then
    echo "  done"
    echo "Commit data to SOLR index"
    curl "https://opensolr.com/solr_manager/api/commit?email=brendon.mosher.jy@renesas.com&api_key=219d87a5b2520cef3c9f7b4a7c3363a4&core_name=renesasprods7b"
    echo
    exit
  fi

  NOW=`date +"%s"`
done

echo "Commit data to SOLR index"
curl "https://opensolr.com/solr_manager/api/commit?email=brendon.mosher.jy@renesas.com&api_key=219d87a5b2520cef3c9f7b4a7c3363a4&core_name=renesasprods7b"

