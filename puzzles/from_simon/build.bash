#!/usr/bin/env bash
set -eux -o pipefail

function gcc_base_call() {
  gcc \
    -O2 \
    -Wall \
    -Werror \
    -g \
    -pthread \
    -std=c89 \
    "$@"
}


function gcc_call() {
  local name="$1"
 shift
  gcc_base_call \
    -I. \
    -I././ \
    -MT ${name}.o \
    -MD \
    -MP \
    "$@" \
    -o ${name}.o \
    -c \
    ${name}.c
}

gcc_call dsf
gcc_call findloop
gcc_call malloc
gcc_call misc
gcc_call nullfe
gcc_call random

gcc_base_call \
  -I. \
  -MD \
  -MP \
  -c \
  -DSTANDALONE_SOLVER \
  -o ./libslant2_a-slant.o ./slant.c

gcc_base_call \
  -o slantsolver \
  ./dsf.o \
  ./findloop.o \
  ./malloc.o \
  ./misc.o \
  ./nullfe.o \
  ./random.o \
  libslant2_a-slant.o \
  -lm
