#!/usr/bin/env bash
set -eux -o pipefail

echo "hello"

function gcc_call(){
  gcc \
  DPACKAGE_NAME=\"puzzles\" \
  -DPACKAGE_TARNAME=\"puzzles\" \
  -DPACKAGE_VERSION=\"6.66\" \
  -DPACKAGE_STRING=\"puzzles\ 6.66\" \
  -DPACKAGE_BUGREPORT=\"anakin@pobox.com\" \
  -DPACKAGE_URL=\"\" \
  -DPACKAGE=\"puzzles\" \
  -DVERSION=\"6.66\" -I. \
  "$@"
}


depbase=`echo dsf.o | sed 's|[^/]*$|.deps/&|;s|\.o$||'`
gcc -I././ -I./icons/   -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT dsf.o -MD -MP -MF $depbase.Tpo -c -o dsf.o dsf.c
mv -f $depbase.Tpo $depbase.Po

depbase=`echo findloop.o | sed 's|[^/]*$|.deps/&|;s|\.o$||'`
gcc -I././ -I./icons/   -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT findloop.o -MD -MP -MF $depbase.Tpo -c -o findloop.o findloop.c
mv -f $depbase.Tpo $depbase.Po

depbase=`echo malloc.o | sed 's|[^/]*$|.deps/&|;s|\.o$||'`
gcc -I././ -I./icons/   -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT malloc.o -MD -MP -MF $depbase.Tpo -c -o malloc.o malloc.c
mv -f $depbase.Tpo $depbase.Po

depbase=`echo misc.o | sed 's|[^/]*$|.deps/&|;s|\.o$||'`
gcc -I././ -I./icons/   -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT misc.o -MD -MP -MF $depbase.Tpo -c -o misc.o misc.c
mv -f $depbase.Tpo $depbase.Po

depbase=`echo nullfe.o | sed 's|[^/]*$|.deps/&|;s|\.o$||'`
gcc -I././ -I./icons/   -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT nullfe.o -MD -MP -MF $depbase.Tpo -c -o nullfe.o nullfe.c
mv -f $depbase.Tpo $depbase.Po

depbase=`echo random.o | sed 's|[^/]*$|.deps/&|;s|\.o$||'`
gcc -I././ -I./icons/   -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT random.o -MD -MP -MF $depbase.Tpo -c -o random.o random.c
mv -f $depbase.Tpo $depbase.Po

gcc  -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread    -DSTANDALONE_SOLVER  -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89 -MT ./libslant2_a-slant.o -MD -MP -MF .deps/libslant2_a-slant.Tpo -c -o ./libslant2_a-slant.o `test -f './slant.c' || echo './'`./slant.c
mv -f .deps/libslant2_a-slant.Tpo .deps/libslant2_a-slant.Po

gcc -I/usr/include/gtk-3.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -I/usr/include/harfbuzz -I/usr/include/fribidi -I/usr/include/freetype2 -I/usr/include/libpng16 -I/usr/include/uuid -I/usr/include/cairo -I/usr/include/pixman-1 -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/libmount -I/usr/include/blkid -I/usr/include/gio-unix-2.0 -I/usr/include/libdrm -I/usr/include/atk-1.0 -I/usr/include/at-spi2-atk/2.0 -I/usr/include/at-spi-2.0 -I/usr/include/dbus-1.0 -I/usr/lib/dbus-1.0/include -pthread   -g -O2 -Wall -Werror -std=c89   -o slantsolver ./dsf.o ./findloop.o ./malloc.o ./misc.o ./nullfe.o ./random.o libslant2_a-slant.o -lm



