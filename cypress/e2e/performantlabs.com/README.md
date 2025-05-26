# SOLR response diff automation

Generate and run SOLR requests to servers and diff the returned response for quality.

Refer to the ticket [WW2-4614](https://idtweb.atlassian.net/browse/WW2-4614) for details. Use the IDs attached to this
ticket or dump them from the DB. The ID file is a complete dump of all the fields from a table and will include the
fields (the table used for this is node__field_agile): `bundle,deleted,entity_id,revision_id,langcode,delta,field_agile_id_value`

## Requirements
Run solr-generate-search-requests.sh locally. Set the SOLR_REQUESTS_LOG environment variable is set in the CLI image.
Without this, this automation would not work.

Snippet from docksal.yml:

```cli:
image: ${COMPOSE_PROJECT_NAME_SAFE}_cli
build: services/cli
environment:
- PHP_IDE_CONFIG=serverName=${VIRTUAL_HOST}
- SOLR_REQUESTS_LOG=/var/www/solr-requests.log
```

## Generate search requests
The shell script (*solr-generate-search-requests.sh*) will invoke the drush script solr-generate-search-requests.php to run the searches on the given keywords.

`fin exec scripts/solr/response-diff/solr-generate-search-requests <id-file> <no-of-requests> | tee solr-requests.csv`

The specified no of keywords are extracted randomly from the id file and used to generate the SOLR requests.

Sample output from the script:

`document,0,598051,8576216,en,0,X0016490,solr-requests-jp-ja-X0016490.log
`

Capture all the output from this script to a file, e-g solr-requests.csv. This file along with all the individual request logs
is used in the rest of the test automation.

## Run search requests
Setup a config.json (similar to the one in response-fiff/config.json) and pass it to *solr-run-search-requests.php* drush script.

`fin drush scr scripts/solr/response-diff/solr-run-search-requests.php /var/www/config-agile-ids.json`

This will run the searches against all the configured servers in the config and generate a response file (e-g solr-response.csv).

The response file has details about the keyword searched and the response from each server. If a required hit was found, then details
about that as well as all the responses are included.

It is possible to create a config file that is consumed by the page-diff script. See the option "page_diff_config" in config.json for example.
