(module
  (func $count1s (param $num i32) (result i32)
    ;; Load the value of the parameter $num onto the stack
    local.get $num

    ;; Use the i32.popcnt instruction to count the number of 1 bits in the binary representation of the value on the stack
    i32.popcnt
  )

  (export "count1s" (func $count1s))
)
