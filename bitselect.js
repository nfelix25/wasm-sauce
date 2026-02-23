const fs = require("fs");
const buffer = fs.readFileSync("./bitselect.wasm");

// - Writes inputs directly into wasm memory, passes the four offsets (all `i32`) to `bitselect`, then reads the output bytes back.

// - Because the exported function now only sees integers, Node no longer has to marshal unsupported `v128` values, and the SIMD instruction still executes inside the module.

WebAssembly.instantiate(buffer).then(({ instance }) => {
  const { bitselect, memory } = instance.exports;
  const mem = new Uint8Array(memory.buffer);
  const bytes = 16;

  // Offsets for the input and output data in the wasm memory
  const offsets = {
    result: 0,
    a: bytes,
    b: bytes * 2,
    mask: bytes * 3,
  };

  // Initialize the input data in wasm memory
  for (let i = 0; i < bytes; i++) {
    mem[offsets.a + i] = i;
    mem[offsets.b + i] = 16 - i;
    mem[offsets.mask + i] = i % 2 === 0 ? 0xff : 0x00;
  }

  console.log(mem);

  bitselect(offsets.result, offsets.a, offsets.b, offsets.mask);

  console.log(
    "Result of bitselect:",
    mem.slice(offsets.result, offsets.result + bytes)
  );
});

// What `bitselect` Does

// `v128.bitselect` is a SIMD instruction that performs a **bit-level conditional select** across 128 bits simultaneously:

// ```
// result[i] = mask[i] ? a[i] : b[i]   (for every bit i)
// ```

// More precisely, for each bit position:
// - If the mask bit is `1` → take the bit from `a`
// - If the mask bit is `0` → take the bit from `b`

// It's equivalent to: `result = (a & mask) | (b & ~mask)`

// ---

// ## Walking Through the Example

// The JS sets up three 16-byte (128-bit) vectors:

// | Vector | Values |
// |--------|--------|
// | `a` | `[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]` |
// | `b` | `[16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]` |
// | `mask` | `[0xFF, 0x00, 0xFF, 0x00, ...]` alternating |

// The mask alternates between `0xFF` (all 1-bits) and `0x00` (all 0-bits), so:
// - **Even indices** (mask = `0xFF`): take from `a`
// - **Odd indices** (mask = `0x00`): take from `b`

// Expected result: `[0, 15, 2, 13, 4, 11, 6, 9, 8, 7, 10, 5, 12, 3, 14, 1]`

// ---

// ## Why It's a Good Example

// **1. Demonstrates the core use case:** Bitselect is essentially a vectorized ternary operator. Instead of branching or looping, you make a selection across all 128 bits in one instruction. This shows up in:
// - Blending two pixel buffers using an alpha mask
// - Conditional computation without branches (important for SIMD where branches kill parallelism)
// - Cryptographic constant-time selection (avoids timing side-channels)

// **2. Shows the JS/WASM v128 boundary problem:** The comment in the `.wat` explains the real teaching moment — `v128` values have no JS representation. You can't pass them in/out of WASM from JS at all. The solution (pass integer memory offsets, do all SIMD work inside WASM) is the canonical pattern for SIMD interop.

// **3. Memory layout is explicit:** The four 16-byte regions (`result`, `a`, `b`, `mask`) laid out at consecutive offsets (0, 16, 32, 48) make it clear that SIMD operates on flat byte arrays in linear memory — no boxing, no GC, no marshaling.

// ---

// ## The Interop Pattern (the real lesson)

// ```
// JS side                    WASM side
// ─────────────────────────  ────────────────────────────
// Write bytes to memory  →   v128.load reads them as SIMD
// Pass integer offsets   →   Works as pointer addresses
//                        ←   v128.store writes result back
// Read bytes from memory ←   JS reads the raw bytes
// ```

// This is the fundamental pattern for any SIMD-heavy WASM work: keep `v128` values entirely inside WASM, only crossing the boundary as memory pointers.
