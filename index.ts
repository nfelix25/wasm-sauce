// index.ts
import { readFile } from "node:fs/promises";

async function loadModule(path: string) {
  const bytes = await readFile(path);
  return WebAssembly.instantiate(bytes);
}

async function run(input = 12) {
  const [helloWorld, minusOne, count1s] = await Promise.all([
    loadModule("./helloWorld.wasm"),
    loadModule("./minusOne.wasm"),
    loadModule("./count1s.wasm"),
  ]);

  return count1s.instance.exports.count1s(
    minusOne.instance.exports.minusOne(
      helloWorld.instance.exports.helloWorld(input),
    ),
  );
}

const value = Number(process.argv[2] ?? 12);
run(value)
  .then((result) => console.log(result))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
