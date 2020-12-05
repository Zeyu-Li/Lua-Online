// TODO: change timer to run button
// global vars
let Module = undefined;
let editor;

function text_changed(input) {
    document.getElementById("result").innerHTML = "";
    Module.ccall("run_lua", 'number', ['string'], [input]);
}

// init wasm module
let ModuleConfig = {
    print: (function () {
        return function (text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            // console.log(text);

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

function main() {
    // starting text
    let starting_text = `function hello_lua()
  print "Hello User!"
  print("Using", _VERSION)
  return "Hit Ctrl-B to rebuild"
end

return hello_lua()`
    let myTextarea = document.getElementById("input");
    // console.log(myTextarea)

    // initing code mirror
    editor = CodeMirror(myTextarea, {
        value: starting_text,
        lineNumbers: true,
        mode: "lua",
        theme: "cobalt"
    })
    
    // TODO: check f2 to run or something like that
    // check keypress
    // editor.on('keypress', function(instance, event) {
    //     console.log(instance, event);
    // });

    // debug
    // console.log(editor.getValue());
    text_changed(editor.getValue())
}

// event listeners
document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.keyCode == 66) {
        e.preventDefault();
        text_changed(editor.getValue())
    }
});


// initWasmModule function name configured in makefile
initWasmModule(ModuleConfig).then((aModule) => {
    Module = aModule;
    main();
});
