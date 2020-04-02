
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

node_version=13.12.0
client_image = slant_client:latest

build:
	docker build -t $(client_image) .

dev_start: build
	docker run --rm \
		-it \
		--publish 3000:3000 \
		--volume $(ref_dir)/src:/srv/src \
		--volume $(ref_dir)/public:/srv/public \
		$(client_image)

dev_local_start:
	npm install
	npm start





