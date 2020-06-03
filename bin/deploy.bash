#!/usr/bin/env bash
set -eu -o pipefail

script_path="$(cd "$(dirname "$0")" ; pwd)"
docker_compose="$script_path/../docker-compose.prod.yaml"
images="$(cat "$docker_compose" | grep 'image:' "$docker_compose" | cut -d: -f2- | xargs)"

# Required env variables
EC2_HOST="${EC2_HOST:-slant_aws}"
function ssh_cmd(){ ssh "$EC2_HOST" -- "$@" ; }

function text_green(){ tput setaf 2 ; }
function text_red(){ tput setaf 1 ; }
function text_reset(){ tput sgr0 ; }

# Seconds to human
function s2h(){ # <number of seconds>
  local min=$(($1/60)) sec=$(($1%60))
  (( min > 0 )) && printf '%dm' $min
  printf '%ds\n' $sec
}

function EXEC(){ # <cmd>
  local name="$1" seconds_before=$SECONDS ; shift
  echo -n "$(s2h $SECONDS) : $name ... "
  in_error=false ; output="$("$@" 2>&1)" || in_error=true
  delta=$(s2h $((SECONDS-seconds_before)))
  if $in_error ; then
    echo "$(text_red)ERR AFTER ${delta}$(text_reset)"
    echo "$output" >&2
    exit 1
  fi
  echo "$(text_green)DONE IN ${delta}$(text_reset)"
  if [[ -n "$output" ]] ; then echo "$output" ; fi
}


################################
# Methods
################################

save_images_on_disk(){
  # shellcheck disable=SC2086
  docker save $images | gzip > "$local_tgz"
}

untagging_images_ssh(){
  for tag in $images ; do
    ssh_cmd docker tag "$tag" "$tag.old" || true
    ssh_cmd docker rmi "$tag" || true
  done
}


################################
# COPY THE IMAGES TO slant_aws #
################################

local_tgz="$script_path"/images.tar.gz

EXEC "Save images on disk" save_images_on_disk
EXEC "Copy images to ec2"  scp "$local_tgz" "$EC2_HOST":images.tar.gz
EXEC "Delete image local"  rm -f "$local_tgz"
EXEC "Unzip images ec2"    ssh_cmd gzip --force --decompress images.tar.gz

EXEC "Un-tag images ec2"    untagging_images_ssh

EXEC "Load images ec2"     ssh_cmd docker load -i images.tar
EXEC "Rm images file ec2"  ssh_cmd rm images.tar

#################################
## Restart the docker-compose
#################################
EXEC "Copy the new docker-compose" scp "$docker_compose" "$EC2_HOST":docker-compose.yaml
EXEC "Start the new docker-compose" ssh_cmd \
  docker-compose up \
    --force-recreate \
    --remove-orphans \
    -d

EXEC "Docker prune" ssh_cmd docker system prune -a -f

EXEC "Fetch status" curl -s http://slant.games/api/status
