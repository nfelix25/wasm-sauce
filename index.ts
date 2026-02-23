const fs = require("fs");

const buffer = fs.readFileSync("./helloWorld.wasm");
const buffer2 = fs.readFileSync("./minusOne.wasm");
const buffer3 = fs.readFileSync("./count1s.wasm");

WebAssembly.instantiate(buffer).then((prog) => {
  WebAssembly.instantiate(buffer2).then((prog2) => {
    WebAssembly.instantiate(buffer3).then((prog3) => {
      console.log(
        prog3.instance.exports.count1s(
          prog2.instance.exports.minusOne(prog.instance.exports.helloWorld(12))
        )
      );
    });
  });
});

// 9 in binary - 0000 0000 0000 0000 0000 0000 0000 1001
// 2 1s
