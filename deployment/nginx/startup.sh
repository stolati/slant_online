#!/usr/bin/env bash
set -x

#/code/wait-for-it.sh server:5000 -t 300
#/code/wait-for-it.sh client:3000 -t 300

while sleep 5; do
  nginx -g "daemon off;"
done

