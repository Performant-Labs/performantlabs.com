#!/bin/bash

# This directory is where you have all your results locally, generally named as `allure-results`
ALLURE_RESULTS_DIRECTORY='allure-results'
# If the report hasn't been generated, skip its uploading
if [ ! -d $ALLURE_RESULTS_DIRECTORY ]; then
    echo "$ALLURE_RESULTS_DIRECTORY does not exist"
    exit 0
fi

# Environment file
# (docs: https://allurereport.org/docs/how-it-works-environment-file/)
echo "client_os = $(uname)"                      >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "client_os_release = $(uname -rs)"          >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "client_os_codename = $(uname -cs)"         >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "workflow = $GITHUB_WORKFLOW"               >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "branch = ${GITHUB_BRANCH:-$GITHUB_REF_NAME}">> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "commit = $GITHUB_SHA"                      >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "pantheon_site_name = $PANTHEON_SITE_NAME"  >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"
echo "pantheon_env = $PANTHEON_ENV"              >> "$ALLURE_RESULTS_DIRECTORY/environment.properties"

# This url is where the Allure container is deployed. We are using localhost as example
ALLURE_SERVER=$ALLURE_SERVER  #'http://localhost:5050'
# Project ID according to existent projects in your Allure container - Check endpoint for project creation >> `[POST]/projects`
PROJECT_ID='performantlabs'
#PROJECT_ID='my-project-id'
# Set SECURITY_USER & SECURITY_PASS according to Allure container configuration
SECURITY_USER=$ALLURE_SECURITY_USER  #'my_username'
SECURITY_PASS=$ALLURE_SECURITY_PASS  #'my_password'

# Reachability gate.
#
# An unavailable results server must not fail the build. The tests already
# ran; losing an upload is a reporting gap, not a test failure. It is valid
# for none of the results services to be up.
#
# Not hypothetical: reportportal.performantlabs.com was decommissioned and
# every nightly run errored on it for weeks before anyone noticed (see #308).
if [ -z "$ALLURE_SERVER" ]; then
  echo "[allure] ALLURE_SERVER is not set — skipping upload."
  exit 0
fi
# --connect-timeout bounds DNS + TCP. Any HTTP response means something is
# listening, which is all this needs to establish; credentials are verified
# by the login call further down.
if ! curl -sS -o /dev/null --connect-timeout 5 --max-time 10 "$ALLURE_SERVER" 2>/dev/null; then
  echo "[allure] $ALLURE_SERVER unreachable — skipping upload (not a test failure)."
  exit 0
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
FILES_TO_SEND=$(ls -dp $DIR/$ALLURE_RESULTS_DIRECTORY/* | grep -v /$)
if [ -z "$FILES_TO_SEND" ]; then
  # Previously exit 1, which failed the job for a condition the top of this
  # same script already treats as normal ("does not exist" -> exit 0).
  echo "[allure] no result files in $ALLURE_RESULTS_DIRECTORY — nothing to upload."
  exit 0
fi

FILES=''
for FILE in $FILES_TO_SEND; do
  FILES+="-F files[]=@$FILE "
done

set -o xtrace
echo "------------------LOGIN-----------------"
####curl -X POST "$ALLURE_SERVER/allure-docker-service/send-results?project_id=$PROJECT_ID" -H 'Content-Type: multipart/form-data' $FILES -ik

curl -X POST "$ALLURE_SERVER/allure-docker-service/login" \
  -H 'Content-Type: application/json' \
  -d "{
    "\""username"\"": "\""$SECURITY_USER"\"",
    "\""password"\"": "\""$SECURITY_PASS"\""
}" -c cookiesFile -ik

echo "------------------EXTRACTING-CSRF-ACCESS-TOKEN------------------"
CRSF_ACCESS_TOKEN_VALUE=$(cat cookiesFile | grep -o 'csrf_access_token.*' | cut -f2)
echo "csrf_access_token value: $CRSF_ACCESS_TOKEN_VALUE"

echo "------------------SEND-RESULTS------------------"
curl -X POST "$ALLURE_SERVER/allure-docker-service/send-results?project_id=$PROJECT_ID" \
  -H 'Content-Type: multipart/form-data' \
  -H "X-CSRF-TOKEN: $CRSF_ACCESS_TOKEN_VALUE" \
  -b cookiesFile $FILES -ik


#If you want to generate reports on demand use the endpoint `GET /generate-report` and disable the Automatic Execution >> `CHECK_RESULTS_EVERY_SECONDS: NONE`
#echo "------------------GENERATE-REPORT------------------"
#EXECUTION_NAME='execution_from_my_bash_script'
#EXECUTION_FROM='http://google.com'
#EXECUTION_TYPE='bamboo'

#You can try with a simple curl
#RESPONSE=$(curl -X GET "$ALLURE_SERVER/allure-docker-service/generate-report?project_id=$PROJECT_ID&execution_name=$EXECUTION_NAME&execution_from=$EXECUTION_FROM&execution_type=$EXECUTION_TYPE" -H "X-CSRF-TOKEN: $CRSF_ACCESS_TOKEN_VALUE" -b cookiesFile $FILES)
#ALLURE_REPORT=$(grep -o '"report_url":"[^"]*' <<< "$RESPONSE" | grep -o '[^"]*$')

#OR You can use JQ to extract json values -> https://stedolan.github.io/jq/download/
#ALLURE_REPORT=$(echo $RESPONSE | jq '.data.report_url')
