// CLI that takes in a file name and builds the wasm then runs that file
const { exec } = require("child_process");
const readFile = require("node:fs/promises").readFile;
const path = require("node:path");
const [file, ...rawArgs] = process.argv.slice(2);
const exportName = path.basename(file);
const args = rawArgs.map((arg) => {
  const num = Number(arg);
  if (Number.isNaN(num)) {
    throw new Error(`Argument "${arg}" is not a valid number.`);
  }
  return num;
});

exec(`wat2wasm ${file} -o awesome.wasm`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error building ${file}.wat:`, err);
    return;
  }
  console.log(`Built awesome.wasm successfully.`);

  readFile(`awesome.wasm`)
    .then((wasmBuffer) => {
      WebAssembly.instantiate(wasmBuffer)
        .then(({ instance }) => {
          const fn = instance.exports[Object.keys(instance.exports)[0]];
          const result = fn(...args);
          console.log(`Result of ${exportName}(${args.join(", ")}):`, result);
        })
        .catch((err) => {
          console.error(`Error instantiating ${file}.wasm:`, err);
        });
    })
    .catch((err) => {
      console.error(`Error reading ${file}.wasm:`, err);
    });
});
