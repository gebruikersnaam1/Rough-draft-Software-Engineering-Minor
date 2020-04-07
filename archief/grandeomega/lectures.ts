
/****************************************************************
 *  lecture 1
 ****************************************************************/
//'simple wrapper'
type Fun<a,b> = { f:(i:a) => b }

let Fun = function<a,b>(f:(_:a)=>b) : Fun<a,b> { return { f:f } }

//examples
let incr = Fun<number,number>(x => x + 1)
let double = Fun<number,number>(x => x * 2)
let negate= Fun<boolean,boolean>(x => !x)
let is_even = Fun<number,boolean>(x => x % 2 == 0)



/****************************************************************
 *  lecture 2
 ****************************************************************/
type Point = { x:number, y:number }

type Countainer<a> = { content:a, counter:number }


let c_i:Countainer<number> = { content:10, counter:0 }
let c_s:Countainer<string> = { content:"Howdy!", counter:0 }
let c_ss:Countainer<Array<string>> = { content:["Howdy", "!"], counter:0 }


//wrong way of doing a container (its nog generic)
let transform_countainer_content_num_to_bool = 
  function(f:Fun<number,boolean>, c:Countainer<number>) 
  : Countainer<boolean> { 
  return { content:f.f(c.content), counter:c.counter }
}

// beter way
let map_countainer = 
  function<a,b>(f:Fun<a,b>, c:Countainer<a>) 
  : Countainer<b> { 
  return { content:f.f(c.content), counter:c.counter }
}

// let map_countainer = 
//   function<a,b>(f:Fun<a,b>) : Fun<Countainer<a>, Countainer<b>> { 
//   return Fun(c =>{ content:f.f(c.content), counter:c.counter })
// }
// let incr_countainer:Fun<Countainer<number>,Countainer<number>> = 
//   map_countainer(incr)


let c:Countainer<number> = { content:3, counter:0 }
let l:Countainer<boolean> = map_countainer(is_even, c)
// let l2:Countainer<boolean> = map_countainer(incr.then(is_even), c)




type Option<a> = { kind:"none" } | { kind:"some", value:a }


type List<a> = {
  kind: "Cons"
  head: a
  tail: List<a>
} | {
  kind: "Empty"
}

