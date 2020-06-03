
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

dev-build:
	docker-compose -f ./docker-compose.dev.yaml build

dev-start: dev-build
	docker-compose -f ./docker-compose.dev.yaml up

prod-build:
	docker-compose -f ./docker-compose.prod.yaml -f ./docker-compose.prod.build.yaml build

prod-start: prod-build
	docker-compose -f ./docker-compose.prod.yaml up

prune:
	docker system prune --all --force || true
	cd async && rm -r venv

prod-deploy: prod-build copy-prod-db
	./bin/deploy.bash

copy-prod-db:
	./bin/copy-prod-db.bash

