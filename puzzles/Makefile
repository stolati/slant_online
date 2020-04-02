
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ref_dir:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

puzzle_image = slant_puzzle:latest

help:
	echo "$(MAKE) - help not present, look into the file"

build:
	docker build -t $(puzzle_image) .

test: build
	docker run $(puzzle_image) /slant_puzzle 5x5dh test_seed

dev_start: build
	../bin/forever docker run --rm \
		--publish 5001:5001 \
		--volume $(ref_dir)/:/srv/ \
		$(puzzle_image)

prune:
	docker rmi $(puzzle_image) || true

.PHONY: help build test prune
