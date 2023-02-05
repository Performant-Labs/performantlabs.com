#!/bin/bash

PATHS=("about/press-center")
for p in "${PATHS[@]}"; do
  bash generic.sh $p
done
