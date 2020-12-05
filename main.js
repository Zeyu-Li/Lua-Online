// TODO: change timer to run button
let Module = undefined;
let timer;


function text_changed() {
    clearTimeout(timer);
    input = document.getElementById("edit").value;
    timer = setTimeout(function () {
            document.getElementById("result").innerHTML = "";
            Module.ccall("run_lua", 'number', ['string'], [input]);
        },
        750);
}

// init wasm module
let ModuleConfig = {
    print: (function () {
        return function (text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            // console.log(arguments);

            if (text != "emsc")
                document.getElementById("result").innerHTML += "<br>\n" + text;
        };
    })(),
    printErr: function (text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        if (0) { // XXX disabled for safety typeof dump == 'function') {
            dump(text + '\n'); // fast, straight to the real console
        } else {
            console.error(text);
        }
    }
};

// initWasmModule function name configured in makefile
initWasmModule(ModuleConfig).then((aModule) => {
    Module = aModule;
    text_changed();
});
