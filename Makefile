
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

p3 = $(ref_dir)/server/virtualenv/bin/python3.6

help:
	echo "$(MAKE) - help not present, look into the file"

build_all:
	$(MAKE) -C puzzles build
	$(MAKE) -C server build

dev_start:
	$(MAKE) -C server dev_start

dev_local_start_tmux:
	./bin/tmux_commands \
	"$(MAKE) -C server dev_local_start"

dev_local_start:
	./bin/parallel_commands \
	"$(MAKE) -C server dev_local_start"


