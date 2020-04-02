
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

py = python3.6
p3 = $(ref_dir)/virtualenv/bin/$(py)

server_image = slant_server:latest

help:
	echo "$(MAKE) - help not present, look into the file"

build: dev_docker_build ./virtualenv


./virtualenv:
	$(py) -m venv virtualenv
	$(p3) -m pip install -r ./requirements.txt

dev_docker_build:
	docker build -t $(server_image) .

dev_start: dev_docker_build
	../bin/forever docker run --rm \
		--publish 5000:5000 \
		--volume $(ref_dir)/slant_server:/srv/slant_server \
		$(server_image)

dev_mongo_server:
	docker run --rm \
		--publish 27017:27017 \
		mongo:4.2-bionic

dev_local_start: ./virtualenv
	PYTHONDONTWRITEBYTECODE=1 $(p3) ./slant_server/server_start.py

dev_local_start_loop:
	while sleep 1 ; do $(MAKE) dev_local_start ; done

prune:
	rm -rf ./virtualenv
	docker rmi --force $(server_image) || true

.PHONY: build dev_docker_build dev_local_start dev_start help prune


