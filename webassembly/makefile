all: main.o

# TODO: Bump to 5.4.1?
main.o: main.c lua
	emcc -Ilua-5.4.0/src main.c lua-5.4.0/src/liblua.a -s WASM=1 -O2 -o main.js -s EXPORTED_FUNCTIONS="['_run_lua']" -s 'EXPORTED_RUNTIME_METHODS=["ccall", "cwrap"]' -s MODULARIZE=1 -s 'EXPORT_NAME="initWasmModule"'

lua:
	cd lua-5.4.0/src && make generic CC='emcc -s WASM=1'

clean:
	rm main.wasm main.js && cd lua-5.4.0/src && make clean