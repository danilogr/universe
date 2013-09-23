CC=clang
CFLAGS= `sdl-config --cflags` -c -Wall
LDFLAGS= `sdl-config --libs`

all: test1

.cpp.o:
	$(CC) $(CFLAGS) $< -o $@

test1: main.o
	$(CC) $(LDFLAGS) -o $@ $<
