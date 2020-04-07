/*
 practising typescript for the upcoming lecture below
*/
//https://www.typescriptlang.org/docs/handbook/functions.html
// example function... note that this function doesn't use ':'
var Try = function (x, y) { return x + y; };
//this function does use ':' it means the return type
// function() contains the parameters and then you get : return type { body of the function} 
var myAdd = function (x, y) { return x + y; };
//another example, I believe the extra arrow is just to make it more clear the return type
var myAdd1 = function (x, y) { return x + y; };
// The first ‘f’ is to define the input which is a lambda with two generic types a and b. 
// It returns (‘:’) type Fun. The body is defined between the { }. 
// Within the body the first ‘f’ is the name that needs to be called to use it and that ‘f’ is of return type ‘f’.
// note: how is B defined
// I think that ‘a’ is often a primitive type (i.e. number) and g and f are simple functions. 
// But instead of executing them right away, the method then is used to do it an order that enables the programmers to
// read the code from left to right (the code will be executed from left to right)
var then = function (f, g) {
    return Fun(function (a) { return g.f(f.f(a)); });
};
var FunSimple = function (f) { return { f: f }; }; ////'simple wrapper'
//Difference is, I think, that another (optional) attribute/function can be called.
var Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then(this, g);
        }
    };
};
/*
 Trying stuff… not a part of the lecture.
*/
console.log("- trying stuff \n");
var example = Fun(function (x) { return x; }); //The type of a parameter doesn’t has to be defined if, the body doesn’t alter the value 
console.log(example.f(10));
var useless = Fun(function (x) { return x + " doesn't help against corona!"; });
console.log(useless.f("Drinking water "));
var useless1 = Fun(function (x) { return "test"; });
console.log(useless1.f(55));
console.log("\n\n -end trying stuff \n");
//code of practice 1 
console.log("\n\n Assignment 1 - 1 \n");
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
var square = Fun(function (x) { return x * x; });
var isPositive = Fun(function (x) { return x > 0; });
var isEven = Fun(function (x) { return x % 2 == 0; });
var invert = Fun(function (x) { return -x; });
var squareRoot = Fun(function (x) { return Math.sqrt(x); });
// console.log(incr.f(1))
// console.log(double.f(2))
// console.log(square.f(10))
// console.log(isPositive.f(-10))
// console.log(isEven.f(5))
// console.log(invert.f(500))
// console.log(squareRoot.f(100))
//Identity function
var id_num = Fun(function (x) { return x; });
var ifThenElse = function (p, _then, _else) {
    return Fun(function (x) {
        if (p.f(x)) {
            return _then.f(x);
        }
        else {
            return _else.f(x);
        }
    });
};
console.log(incr.then(isPositive).f(5));
//same code as bove
var plusOneAndCheck = incr.then(isPositive);
console.log(plusOneAndCheck.f(5));
var first = ifThenElse(isPositive, squareRoot, invert);
console.log(first.f(100));
console.log(first.f(-100));
console.log("\n\n -end Assignment 1  \n");
// let repeat = function<a>(f: Fun<a, a>, n: number): Fun<a, a> {
//   if (n <= 0) {
//     //COMPLETE
//   }
//   else {
//     //COMPLETE
//   }
// }
// export let Fun = function <a, b>(f: (_: a) => b): Fun<a, b> {
//   return {
//     f: f,
//     then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
//       return Fun<a, c>(a => g.f(this.f(a)))},
//     repeat: function(this: Fun<a, a>): Fun<number,Fun<a, a>> {
//        //COMPLETE
//     }
//   }
// }
