#!/usr/bin/env bash
set -x

#/code/wait-for-it.sh server:5000 -t 300
#/code/wait-for-it.sh client:3000 -t 300
#/code/wait-for-it.sh ws_server:8080 -t 300


# TODO use inotify to restart ngnix if it changes.
# This will also put some differences between prod and dev.
# https://stackoverflow.com/questions/12264238/restart-process-on-file-change-in-linux

# TODO use something like forever https://www.npmjs.com/package/forever

nginx -t
nginx
while sleep 5; do
  nginx -t
  nginx
done

