// global vars
let Module = undefined;
let editor;

// when to build
function build() {
    let input = editor.getValue()
    document.getElementById("output").innerHTML = "";
    Module.ccall("run_lua", 'number', ['string'], [input]);
}

// init wasm module
let ModuleConfig = {
    print: (function () {
        return function (text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            // console.log(text);

            if (text != "emsc")
                document.getElementById("output").innerHTML += `${text} <br>`;
        };
    })(),
    printErr: function (text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        if (0) { // XXX disabled for safety typeof dump == 'function') {
            dump(text + '\n'); // fast, straight to the real console
        } else {
            console.log(text);
        }
    }
};

function main() {
    // starting text
    let starting_text = `--[[
This is a Lua online editor!
Currently running Lua version 5.4.0
Source code here: https://github.com/Zeyu-Li/Lua-Online
]]

function hello_lua()
  print("Hello World!")
  return "Hit Ctrl-B to rebuild"
end

return hello_lua()
`;
    let myTextarea = document.getElementById("input");
    // console.log(myTextarea)

    // initing code mirror
    editor = CodeMirror(myTextarea, {
        value: starting_text,
        lineNumbers: true,
        viewportMargin: Infinity,
        mode: "lua",
        theme: "cobalt"
    });

    // debug
    // console.log(editor.getValue());
    build();
}

// event listeners
// is user presses ctrl-b, then rebuild
document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.keyCode == 66) {
        text_changed(editor.getValue());
    }
});
// button event listener
function download() {
    // download markdown file
    let data = new Blob([editor.getValue()], {type: 'text/plain;charset=utf-8'});
    let textFile = URL.createObjectURL(data);
    let download = document.getElementById('download_file');
    download.setAttribute('href', textFile);
}


// initWasmModule function name configured in makefile
initWasmModule(ModuleConfig).then((aModule) => {
    Module = aModule;
    main();
});
