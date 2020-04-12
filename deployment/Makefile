
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

project_name="slant-mmo"
gcloud_image="gloud-cli"


build:
	cd .. ; $(MAKE) build_prod

#	docker pull google/cloud-sdk:latest
#	docker run -ti google/cloud-sdk:160.0.0 gcloud version


