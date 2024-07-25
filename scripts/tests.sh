#!/bin/bash

function init_tugboat() {
  repo=${ARGS["--repo"]}
  if [ -z $repo ]; then
    echo "Please provide --repo argument!!! (Use \`tugboat ls repos\` or dashboard.tugboatqa.com)" >&2
    exit 1
  fi
  #  check if Tugboat already installed
  type tugboat > /dev/null 2> /dev/null
  if [ $? != 0 ]; then
    echo "Tugboat not installed locally, installing..." >&2
    if [ -z $TUGBOAT_TOKEN ]; then
      echo "Please set up TUGBOAT_TOKEN env variable!!! (Use dashboard.tugboatqa.com/access-tokens)" >&2
      exit 1
    fi
    curl -O https://dashboard.tugboatqa.com/cli/linux/tugboat.tar.gz
    tar -zxf tugboat.tar.gz
    #  update PATH to execute tugboat without ./
    export PATH=$PATH:$(pwd)
    echo token: $TUGBOAT_TOKEN > ~/.tugboat.yml
    #  if we're in the context of GutHub Actions, save PATH for the further steps
    if [ ! -z $GITHUB_PATH ]; then
      echo $(pwd) >> $GITHUB_PATH
    fi
  fi
}

function check_rclone() {
  type rclone > /dev/null 2> /dev/null
  if [ $? != 0 ]; then
    echo "Please install rclone (see https://docs.google.com/document/d/1tmISRP4ZpvVAKrR15Mi33nAXdQndyIrdHb58SrhMbmY/edit)" >&2
    exit 1
  fi
}

function check_terminus() {
  type terminus > /dev/null 2> /dev/null
  if [ $? != 0 ]; then
    echo "Please install and configure terminus" >&2
    exit 1
  fi
}


COMMAND=$1
shift 1
declare -A ARGS=()
while (( "$#" )); do
  if [ ! -z "$2" ] && [ ${2:0:1} != "-" ]; then
    ARGS[$1]=$2
    shift 2
  else
    ARGS[$1]=1
    shift 1
  fi
done
if [ ! -z ${ARGS["-v"]} ] || [ ! -z ${ARGS["--verbose"]} ]; then
  set -x
fi
case "$COMMAND" in
preview:delete)
  init_tugboat
  tugboat ls previews repo=$repo --json | jq -r '.[].preview' | while read line; do
    tugboat delete $line
  done
  ;;
preview:create)
#  echo "implement goddamn preview!!!! ${ARGS["--repo"]}"

  init_tugboat
  RUN_DATE=`date "+%Y-%m-%d %H:%M:%S"`
  [[ ! -z $GITHUB_BRANCH ]] || GITHUB_BRANCH=$(git branch --no-color --show-current)
  LABEL="Branch:$GITHUB_BRANCH $RUN_DATE"
  echo "Creating preview ($LABEL)." >&2
  tugboat create preview "$GITHUB_BRANCH" \
    base=false repo=$repo label="$LABEL" output=json
  ;;
snapshot:export)
  check_terminus
  check_rclone
  SITE=performant-labs
  ENV=${ARGS["--env"]:-dev}
  terminus backup:create $SITE.$ENV --element=database
  terminus backup:list $SITE.$ENV --format=json | jq -r .[].file | (
    read line
    terminus backup:get $SITE.$ENV --file=$line --to=$line
    rclone copy $line "GDrive:/$SITE.snapshot"
    LINK=$(rclone link GDrive:$SITE.snapshot/$line)
    LINK=$(echo "$LINK" | sed "s/open/download/" | sed "s/drive/drive.usercontent/")
    LINK="$LINK&export=download&authuser=0"
    echo $LINK
    if [ ! -z ${ARGS["--use-on-preview"]} ]; then
      init_tugboat
      tugboat update $repo envvars="SNAPSHOT_URL=$LINK"
    fi
  )
  ;;
*)
  echo "Use: ./scripts/test <command> [args]

List of commands:

preview:delete <--repo REPO>               delete all previews within the repo
                                           on Tugboat

preview:create <--repo REPO>               create a preview on Tugboat for
                                           the repo

snapshot:export <--env ENV>                export snapshot from a given Pantheon
[--use-on-preview --repo REPO]             env, and upload it to GDrive,
                                           and optionally use for new previews

....to be continued....


Environment variables:
TUGBOAT_TOKEN                              token to set up Tugboat if it's
                                           not set locally
GITHUB_BRANCH                              branch to create env / run tests for
"
esac


