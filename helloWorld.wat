(module
  (func $helloWorld (param $x i32) (result i32)
    local.get $x)

  (export "helloWorld" (func $helloWorld))
)
