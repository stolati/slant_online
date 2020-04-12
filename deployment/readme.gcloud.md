# How to deploy the new version

gcloud init

compute-engine => vm instance => 
f1-micro
create
Select CoreOS to have docker.
ContainerOptimizedOS

Don't forget to allow http in the firewall.


http connection allowed
core-os (it should have docker from scratch).

TODO: 
- The copy of client is too long, really make a deploy version
- Then create a volume sharable with server
- Make the server serve the data
- Change the database to NeoDB or similar.
- Have a second docker-compose.

// Wrap docker-compose with a python script to change the /mnt/d again.
//https://subscription.packtpub.com/book/web_development/9781782169628/1/ch01lvl1sec12/handling-static-files-simple

Ubuntu 1804 minimal

Test the ssh works : 

gcloud beta compute ssh --zone "us-central1-a" "slant-puzzle" --project "slant-mmo"
docker ps

Follow # https://www.vultr.com/docs/installing-docker-compose-on-coreos

> should show images

Creating the images (TODO here)

Copying the images and the docker-compose


Setting up docker and docker-compose

```

curl -fsSL https://get.docker.com -o - | bash -
sudo sh get-docker.sh

sudo usermod -aG docker $USER

- log out and back


sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

```



```shell
instance_name="instance-1"
images="slant_server slant_client slant_puzzle slant_nginx"
gscp(){
    gcloud beta compute scp --zone us-central1-a --project slant-mmo "$@"
}
gssh(){
    gcloud beta compute ssh --zone "us-central1-a" "$instance_name" --project "slant-mmo" -- "$@"
}

copy_image(){ #<image name>
    local image_name="$1"
    echo $image_name
    docker save --output $image_name.prod.tar $image_name:prod
    gscp ./$image_name.prod.tar $instance_name:~
    gssh "docker load -i $image_name.prod.tar"
    gssh "rm $image_name.prod.tar"
    rm $image_name.prod.tar
}



for image in $images ; do
    copy_image "$image"
done


gscp ./docker-compose.prod-no-build.yaml $instance_name:~/docker-compose.yaml


> ssh
(bigger to smaller)
docker-compose up -d
docker-compose run -d client
docker-compose run -d server
docker-compose run -d puzzle
docker-compose run -d nginx



docker-compose ./docker-compose.prod.yaml run -d <service>

```
images=""""

docker save --output slant_puzzle.latest.tar slant_puzzle:latest
docker save --output slant_client.latest.tar slant_client:latest
docker save --output slant_server.latest.tar slant_server:latest


gcloud beta compute scp --zone us-central1-a --project slant-mmo ./slant_puzzle.latest.tar  slant-puzzle:~
gcloud beta compute scp --zone us-central1-a --project slant-mmo ./slant_client.latest.tar  slant-puzzle:~
gcloud beta compute scp --zone us-central1-a --project slant-mmo ./slant_server.latest.tar  slant-puzzle:~



``




```

sudo apt-get install docker
sudo apt-get insntall docker-compose

```




```
gcloud compute scp local-file-path instance-name:~
```


```
docker tag slant_puzzle:latest us.grc.io/slant-mmo/slant_puzzle:latest
docker tag slant_client:latest us.grc.io/slant-mmo/slant_client:latest
docker tag slant_server:latest us.grc.io/slant-mmo/slant_server:latest
```

```
docker push us.grc.io/slant-mmo/slant_puzzle:latest
docker push us.grc.io/slant-mmo/slant_client:latest
docker push us.grc.io/slant-mmo/slant_server:latest
```


# Need powershell (because windows)

`Install-Module GoogleCloud`

gcloud is not recognized as an internal or external command' . ... Under System variables in Environment variables choose PATH->Edit-> ADD "C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin " and click OK
 
 
 
 

NAME                    CPU %               MEM USAGE / LIMIT     MEM %
slant_online_puzzle_1   1.55%               34.77MiB / 1.943GiB   1.75%
slant_online_client_1   0.00%               19.86MiB / 1.943GiB   1.00%
slant_online_server_1   1.39%               40.95MiB / 1.943GiB   2.06%
slant_online_nginx_1    0.00%               1.582MiB / 1.943GiB   0.08%




