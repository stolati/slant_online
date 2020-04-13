#!/usr/bin/env bash
set -eux -o pipefail

function gcc_base_call() {
  gcc \
    -I./icons/ \
    -I./icons/ \
    -I/usr/include/at-spi-2.0 \
    -I/usr/include/at-spi2-atk/2.0 \
    -I/usr/include/atk-1.0 \
    -I/usr/include/blkid \
    -I/usr/include/cairo \
    -I/usr/include/dbus-1.0 \
    -I/usr/include/freetype2 \
    -I/usr/include/fribidi \
    -I/usr/include/gdk-pixbuf-2.0 \
    -I/usr/include/gio-unix-2.0 \
    -I/usr/include/glib-2.0 \
    -I/usr/include/gtk-3.0 \
    -I/usr/include/harfbuzz \
    -I/usr/include/libdrm \
    -I/usr/include/libmount \
    -I/usr/include/libpng16 \
    -I/usr/include/pango-1.0 \
    -I/usr/include/pixman-1 \
    -I/usr/include/uuid \
    -I/usr/lib/dbus-1.0/include \
    -I/usr/lib/glib-2.0/include \
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
    -MF .deps/${name}.Tpo \
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
  -MT ./libslant2_a-slant.o \
  -MD \
  -MP \
  -MF \
  .deps/libslant2_a-slant.Tpo \
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
