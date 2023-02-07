#!/usr/bin/env bash
#: exec_target = cli

if [[ $# == 0 ]]; then
  echo "Usage:"
  echo "solr-generate-search-requests <id-file> <no-of-requests>"
  exit
fi

# get random <no-of-requests> from the <csv-file> and pass it through
# solr-generate-search-requests.php; move the generate request log wit

# Params passed to this function
# 1: ID
# 2: reqion/language
# 3: request log suffix
# 4: original line from CSV
#
# Invoke the drush script ahd move the resulting solr-request.log
# Print the results in a format easy to append to csv file
run_drush() {
  drush scr scripts/solr/response-diff/solr-generate-search-requests.php "$1" "$2"
  mv "solr-requests.log" "solr-requests-$3.log"
  rp=$(realpath "solr-requests-$3.log")
  echo "$4,$rp"
}

while read -r O_LINE; do
  IFS=',' read -ra LINE <<< "$O_LINE"
#  NID=${LINE[2]}
#  RID=${LINE[3]}
#  LANG=${LINE[4]}
  ID="${LINE[6]}"
#  echo "${LINE[@]}"
#  echo "nid: ${NID} lang: ${LANG} id: ${ID}"
  run_drush "${ID}" "jp/ja" "jp-ja-${ID//\//x}" "${O_LINE}"
  run_drush "${ID}" "cn/zh" "cn-zh-${ID//\//x}" "${O_LINE}"
done <<<$(tail --lines=+2 $1 | shuf -n $2)

