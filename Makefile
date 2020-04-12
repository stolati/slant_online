
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

p3 = $(ref_dir)/server/virtualenv/bin/python3.6

help:
	echo "$(MAKE) - help not present, look into the file"

dev_build:
	docker-compose -f docker-compose.dev.yaml build

dev_start:
	docker-compose -f docker-compose.dev.yaml up

prod_build:
	docker-compose -f docker-compose.prod.yaml build

prod_start:
	docker-compose -f docker-compose.prod.yaml up

prune:
	docker system prune --all --force || true

