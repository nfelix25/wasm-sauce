(module
  (export "add" (func $addplus10))
  (func $addplus10 (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add

    i32.const 10
    i32.add))
