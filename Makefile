
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
	docker-compose -f ./docker-compose.prod.yaml up

dev-integration:
	# create virtual env for async
	cd async ; python3.8 -m virtualenv venv
	./async/venv/bin/pip3.8 install -r ./async/requirements.txt

prune:
	docker system prune --all --force || true
	cd async && rm -r venv


