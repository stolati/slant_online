
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

dev-build:
	docker-compose -f ./docker-compose.dev.yaml build

dev-start: dev-build
	docker-compose -f ./docker-compose.dev.yaml up

prod-build:
	docker-compose -f ./docker-compose.prod.yaml build

prod-start: prod-build
	ocker-compose -f ./docker-compose.prod.yaml up

prune:
	docker system prune --all --force || true
