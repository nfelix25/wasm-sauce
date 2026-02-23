;; main.wat
(module
  ;; Parameters are prefixed with a dollar sign ($) and have a type (i32, f32, etc.)
  (func $minusOne
    (param $num i32) (result i32) ;; The result type is specified after the parameters, indicating that this function will return a 32-bit integer
    ;; A function implicitly returns the value of the last expression, so we can just subtract 1 from the parameter and return it
    ;;
    ;; The parenthesis are helpful for following the order of ops local.get & i32.const get loaded onto stack -> i32 sub with those values
    ;;
    ;; local.get is used to retrieve the value of a local variable (in this case, the parameter $num)
    ;; local.const is used to push a constant value onto the stack (in this case, the value 1)
    ;;
    ;; i32.sub is the subtraction operation for 32-bit integers, which takes the two values on the stack (the value of $num and the constant 1) and subtracts them, returning the result
    ;;
    ;; The result will be the value of $num minus 1, which is what we want to return from the function
    (i32.sub
      (local.get $num)
      (i32.const 1)))

  (export "minusOne" (func $minusOne))) ;; This line exports the function so that it can be called from outside the module, such as from JavaScript. The name "minusOne" is the name that will be used to call the function from JavaScript, and it references the function defined earlier in the module.
