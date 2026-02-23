;; bitselect.wat` exports a function whose three parameters and single result are `v128`. The JS WebAssembly API (Node v24.11.1 included) still has no direct JS representation for `v128`, so when `bitselect.js:21` tries to pass `Uint8Array` objects the runtime throws “type incompatibility when transforming from/to JS”. The fix is to keep the SIMD work inside wasm and only pass integer offsets from JS.

(module
  (memory (export "memory") 1)

  (func (export "bitselect")
    (param $out i32) (param $a i32) (param $b i32) (param $mask i32)
    (v128.store (local.get $out)
      (v128.bitselect
        (v128.load (local.get $a))
        (v128.load (local.get $b))
        (v128.load (local.get $mask)))))
)


;; - Adds a shared memory so JS can read/write bytes.
;; - Switches the ABI to integer addresses; the SIMD values live only in wasm registers.
