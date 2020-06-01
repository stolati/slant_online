#!/usr/bin/env bash
set -eux -o pipefail

script_path="$(cd "$(dirname "$0")" ; pwd)"
docker_compose="$script_path/../docker-compose.prod.yaml"

# Required env variables
EC2_HOST="${EC2_HOST:-slant_aws}"

# Keep the current database
# TODO

# Generate the images
cd "$script_path/.."
#make prod-build
images="$(cat "$docker_compose" | grep 'image:' | cut -d: -f2- | xargs)"

cd "$script_path"

#docker save -o images.tgz $images

# Copy the image to ec2 instance
#scp images.tgz $EC2_HOST:~/images.tgz

# Import the image in the ec2 instance
# TODO put here some cleaning on the images names
#ssh $EC2_HOST docker load -i ~/images.tgz

scp "$docker_compose" $EC2_HOST:docker-compose.yaml

ssh "$EC2_HOST" docker-compose up --no-build -d

#docker save "$(echo "$images" | tr ' ' '\n' | xargs -I % echo %:prod)"

#for image_name in $images; do
#  docker save "$image_name":prod > "$image_name".prod.tgz
#  scp "$image_name".prod.tgz $EC2_HOST:~/"$image_name".prod.tgz
#  rm "$image_name".prod.tgz
#  ssh $EC2_HOST docker load "$"
#   ssh $EC2_HOST docker import - "$image_name":prod
#done

#ssh $EC2_HOST docker images


# Push the images to the ec2 instance


# Push the prod yaml to instance


# Launch docker compose to update



