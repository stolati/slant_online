#!/usr/bin/env bash
set -eu -o pipefail

function list_tracked_files(){
    git ls-tree -r master --name-only
}

function list_template_files(){
    list_tracked_files | grep .gomplate
}


#https://hub.docker.com/r/hairyhenderson/gomplate/dockerfile

