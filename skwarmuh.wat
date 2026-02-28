(module
  (export "times_2_or_3_or_square" (func $func))
  (func $func (param $num i32) (result i32)
    local.get $num
    i32.const 2
    i32.eq
    if
      local.get $num
      i32.const 2
      i32.mul
      return
    end

    local.get $num
    i32.const 3
    i32.eq
    if
      local.get $num
      i32.const 3
      i32.mul
      return
    end

    local.get $num
    local.get $num
    i32.mul))
