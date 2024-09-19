#!/usr/bin/bash

# don't uncomment this if you don't want to reveal the secrets and hang the servers with logs I/O
#set -x
# export all secrets to environment variables
set -a
source "$GITHUB_SECRETS"
source "$GITHUB_ENV"
set +a
# trigger run
curl -L\
  -X POST\
  -H "Accept: application/vnd.github+json"\
  -H "Authorization: Bearer $GITHUB_TOKEN"\
  -H "X-GitHub-Api-Version: 2022-11-28"\
  https://api.github.com/repos/Performant-Labs/performantlabs.com/actions/workflows/test-against-pantheon.yml/dispatches\
  -d '{"ref":"'${branch}'","inputs":{"env":"'${env}'","multienv":"'${multienv}'"}}'
# get the last run
sleep 15
RUNS=$(curl -L\
  -H "Accept: application/vnd.github+json"\
  -H "Authorization: Bearer $GITHUB_TOKEN"\
  -H "X-GitHub-Api-Version: 2022-11-28"\
  https://api.github.com/repos/Performant-Labs/performantlabs.com/actions/runs?per_page=1)
RUN_ID=$(echo $RUNS | jq -r '.workflow_runs[0].id')
STATUS=$(echo $RUNS | jq -r '.workflow_runs[0].status')
# wait for status "completed"
while [[ $STATUS != "completed" ]]; do
  echo "Run status is \"$STATUS\". Logs and results are available only after run is completed. Waiting..."
  sleep 60
  RUN=$(curl -L\
    -H "Accept: application/vnd.github+json"\
    -H "Authorization: Bearer $GITHUB_TOKEN"\
    -H "X-GitHub-Api-Version: 2022-11-28"\
    https://api.github.com/repos/Performant-Labs/performantlabs.com/actions/runs/$RUN_ID)
  STATUS=$(echo $RUN | jq -r '.status')
done
# download logs
curl -L\
  -H "Accept: application/vnd.github+json"\
  -H "Authorization: Bearer $GITHUB_TOKEN"\
  -H "X-GitHub-Api-Version: 2022-11-28"\
  --output logs.zip https://api.github.com/repos/Performant-Labs/performantlabs.com/actions/runs/$RUN_ID/logs
# download report
ARTIFACTS=$(curl -L\
  -H "Accept: application/vnd.github+json"\
  -H "Authorization: Bearer $GITHUB_TOKEN"\
  -H "X-GitHub-Api-Version: 2022-11-28"\
  https://api.github.com/repos/Performant-Labs/performantlabs.com/actions/runs/$RUN_ID/artifacts)
REPORT_URL=$(echo $ARTIFACTS | jq -r '.artifacts[]|select(.name=="playwright-report").archive_download_url')
curl -L\
  -H "Accept: application/vnd.github+json"\
  -H "Authorization: Bearer $GITHUB_TOKEN"\
  -H "X-GitHub-Api-Version: 2022-11-28"\
  --output playwright-report.zip\
  $REPORT_URL

# unzip report to publish it
rm -rf playwright-report
unzip playwright-report.zip -d playwright-report
