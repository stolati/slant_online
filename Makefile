
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

p3 = $(ref_dir)/server/virtualenv/bin/python3.6

help:
	echo "$(MAKE) - help not present, look into the file"

build:
	$(MAKE) -C puzzles build
	$(MAKE) -C server build
	$(MAKE) -C client build

dev_start:
	./bin/parallel_commands \
	"$(MAKE) -C puzzles dev_start" \
	"$(MAKE) -C server dev_start" \
	"$(MAKE) -C server dev_mongo_server"

dev_start_tmux:
	./bin/tmux_commands \
	"$(MAKE) -C puzzles dev_start" \
	"$(MAKE) -C client dev_start" \
	"$(MAKE) -C server dev_start" \
	"$(MAKE) -C server dev_mongo_server"

dev_local_start_tmux:
	./bin/tmux_commands \
	"$(MAKE) -C client dev_local_start" \
	"$(MAKE) -C server dev_local_start" \
	"$(MAKE) -C server dev_mongo_server"

dev_local_start:
	./bin/parallel_commands \
	"$(MAKE) -C client dev_local_start" \
	"$(MAKE) -C server dev_local_start" \
	"$(MAKE) -C server dev_mongo_server"

prune:
	docker system prune --all --force || true
	$(MAKE) -C puzzles prune
	$(MAKE) -C server prune
	docker system prune --all --force || true

