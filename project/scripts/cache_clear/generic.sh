#!/bin/bash

HOST="www.renesas.com"
#PAGEPATH="about/press-center"
if [ ${#1} -eq 0 ]
  then
    PAGEPATH=""
  else
    PAGEPATH="/$1"
fi

BALS=("bal-34211.prod.hosting.acquia.com" "bal-34212.prod.hosting.acquia.com")
LANGS=("en" "ja" "zh")
REGIONS=("us" "br" "eu" "jp" "cn" "sg" "in" "kr" "tw")

for b in ${BALS[@]}; do
  for l in ${LANGS[@]}; do
    for r in ${REGIONS[@]}; do
      URL="https://$b/$r/$l$PAGEPATH"
      curl -sS -o /dev/null -k -X PURGE -H "X-Acquia-Purge:idtd8.prod" --compress -H "Host:$HOST" $URL
      echo "[PURGED] $URL"
    done
  done
done
      
