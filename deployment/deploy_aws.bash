#!/usr/bin/env bash

INSTANCE=ec2-52-14-77-120.us-east-2.compute.amazonaws.com

images="slant_server slant_client slant_puzzle slant_nginx"

assh(){
    ssh -i ~/.ssh/SlantKeyPair.pem ubuntu@$INSTANCE "$@"
}
ascp_root(){
    #scp -i ~/.ssh/SlantKeyPair.pem "$1" ubuntu@$instance:~
    rsync --partial --progress -Pav -e "ssh -i ~/.ssh/SlantKeyPair.pem" "$@" ubuntu@$INSTANCE:~
}



copy_image(){
    local image="$1"
    echo $image
    docker save --output $image.prod.tar $image:prod
    ascp_root $image.prod.tar
    rm -rf $image.prod.tar
    assh docker load -i $image.prod.tar
}


for image in $images ; do
    copy_image "$image"
done

ascp_root ../docker-compose.prod.yaml

assh ls

exit 0

alias docker-compose='docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0'

docker-compose --no-build -f docker-compose.prod.yaml up

