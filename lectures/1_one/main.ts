/*
 practising typescript for the upcoming lecture below 
*/
//https://www.typescriptlang.org/docs/handbook/functions.html
// example function... note that this function doesn't use ':'
let Try = function(x, y) { return x + y; };

//this function does use ':' it means the return type
// function() contains the parameters and then you get : return type { body of the function} 
let myAdd = function(x: number, y: number): number { return x + y; };
//another example, I believe the extra arrow is just to make it more clear the return type
let myAdd1: (baseValue: number, increment: number) => number =
   function(x: number, y: number): number { return x + y; };
//note that Fun is made and not a built in function of typescript

/*
  the function type of the course
*/
//So, I read https://www.typescriptlang.org/docs/handbook/advanced-types.html
//The word type is to create your own type (like int, string, et cetera), 
// but doesn’t need to be primitive type. It can be a lambda or kind of an object 

type FunSimple<a,b> = { f:(i:a) => b } //'simple wrapper'


//I think the main difference is that type has to ‘attributes’ (not sure) that both or one off can be called. 
type Fun<a,b> = { f:(i:a) => b, then:<c>(g:Fun<b,c>) => Fun<a,c> }

// The first ‘f’ is to define the input which is a lambda with two generic types a and b. 
// It returns (‘:’) type Fun. The body is defined between the { }. 
// Within the body the first ‘f’ is the name that needs to be called to use it and that ‘f’ is of return type ‘f’.
// note: how is B defined

// I think that ‘a’ is often a primitive type (i.e. number) and g and f are simple functions. 
// But instead of executing them right away, the method then is used to do it an order that enables the programmers to
// read the code from left to right (the code will be executed from left to right)
let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
  return Fun<a,c>(a => g.f(f.f(a)))
}




let FunSimple = function<a,b>(f:(_:a)=>b) : FunSimple<a,b> { return { f:f } } ////'simple wrapper'

//Difference is, I think, that another (optional) attribute/function can be called.
let Fun = function<a,b>(f:(_:a)=>b) : Fun<a,b> { 
  return { 
    f:f,
    then:function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> { 
      return then(this,g) }
  }
}


/*
 Trying stuff… not a part of the lecture. 
*/
console.log("- trying stuff \n")

let example = Fun((x) => x )//The type of a parameter doesn’t has to be defined if, the body doesn’t alter the value 
console.log(example.f(10))

let useless = Fun((x:string)=> x + " doesn't help against corona!")
console.log(useless.f("Drinking water "))

let useless1 = Fun((x:number) => "test")
console.log(useless1.f(55))


console.log("\n\n -end trying stuff \n")

//code of practice 1 
console.log("\n\n Assignment 1 - 1 \n")

let incr = Fun((x: number) => x + 1)
let double = Fun((x: number) => x * 2)
let square = Fun((x: number) => x * x)
let isPositive = Fun((x: number) => x > 0)
let isEven = Fun((x: number) => x % 2 == 0)
let invert = Fun((x: number) => -x)
let squareRoot = Fun((x: number) => Math.sqrt(x))

// console.log(incr.f(1))
// console.log(double.f(2))
// console.log(square.f(10))
// console.log(isPositive.f(-10))
// console.log(isEven.f(5))
// console.log(invert.f(500))
// console.log(squareRoot.f(100))

//Identity function
let id_num = Fun<number,number>(x => x)



let ifThenElse =
  function<a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>) : Fun<a, b> {
    return Fun((x: a) => {
      if (p.f(x)) {
        return _then.f(x)
      }
      else {
        return _else.f(x)
      }
    })
  }

console.log(incr.then(isPositive).f(5))
//same code as bove
let plusOneAndCheck = incr.then(isPositive)
console.log(plusOneAndCheck.f(5))


let first = ifThenElse(isPositive,squareRoot,invert)
console.log(first.f(100))
console.log(first.f(-100))


console.log("\n\n -end Assignment 1  \n")


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