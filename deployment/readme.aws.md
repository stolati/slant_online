```
curl -fsSL https://get.docker.com -o - | bash -

sudo usermod -aG docker ubuntu

exit > restart
docker ps
```

```
instance=ec2-52-14-77-120.us-east-2.compute.amazonaws.com

images="slant_server slant_client slant_puzzle slant_nginx"
assh(){
    ssh -i ~/.ssh/SlantKeyPair.pem ubuntu@$instance "$@"
}
ascp_root(){
    #scp -i ~/.ssh/SlantKeyPair.pem "$1" ubuntu@$instance:~
    rsync --partial --progress -Pav -e "ssh -i ~/.ssh/SlantKeyPair.pem" "$@" ubuntu@$instance:~
}

copy_image(){ #<image name>
    local image_name="$1"
    echo $image_name
    docker save --output $image_name.prod.tar $image_name:prod
    ascp_root ./$image_name.prod.tar
    assh "docker load -i $image_name.prod.tar"
    assh "rm $image_name.prod.tar"
    rm $image_name.prod.tar
}

for image in $images ; do
    docker save --output $image.prod.tar $image:prod
done

ascp_root *.prod.tar
rm -f *.prod.tar

for image in $images ; do
 assh docker load -i $image.prod.tar   
done


ascp_root ../docker-compose.prod.yaml 
assh "mv docker-compose.prod.yaml pdocker-compose.yaml 
 ./docker-compose.prod-no-build.yaml $instance_name:~/docker-compose.yaml





```


``
alias docker-compose='docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0'


```




