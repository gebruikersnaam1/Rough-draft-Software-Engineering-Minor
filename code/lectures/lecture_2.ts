//basic stuff
type Fun<a,b> = { f:(i:a) => b, then:<c>(g:Fun<b,c>) => Fun<a,c> }

let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
  return Fun<a,c>(a => g.f(f.f(a)))
}

let Fun = function<a,b>(f:(_:a)=>b) : Fun<a,b> { 
  return { 
    f:f,
    then:function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> { 
      return then(this,g) }
  }
}

let isEven = Fun((x:number)=> x % 2 == 0)



//simple container
type Point = { x: number, y: number}
//generic structure
type Countainer<a> = { content:a, counter:number }

//e.g. how container could be used
let c_i:Countainer<number> = { content:10, counter:0 }
let c_s:Countainer<string> = { content:"Howdy!", counter:0 }
let c_ss:Countainer<Array<string>> = { content:["Howdy", "!"], counter:0 }

//transform container
let transform_countainer_content_num_to_bool = 
  function(f:Fun<number,boolean>, c:Countainer<number>) 
  : Countainer<boolean> { 
  return { content:f.f(c.content), counter:c.counter }
}

// i.e. map container
let map_countainer1 = 
  function<a,b>(f:Fun<a,b>, c:Countainer<a>) 
  : Countainer<b> { 
  return { content:f.f(c.content), counter:c.counter }
}


let c:Countainer<number> = { content:3, counter:0 }
let l:Countainer<boolean> = map_countainer1(isEven, c)

//I.e. of two funcs in one
// let map_F_G = function<a,b>(f:Fun<a,b>) => Fun<F_G<a>, F_G<b>> {
//   return map_F<G<a>,G<b>>(map_G<a,b>(f))
// }
//another example
// type CountainerMaybe<a> = Countainer<Option<a>>
// let map_Countainer_Maybe = function<a,b>(f:Fun<a,b>) : 
//   Fun<CountainerMaybe<a>, CountainerMaybe<b>> {
//   return map_Countainer<Option<a>,Option<b>>(map_Option<a,b>(f)));
// }

//interface... changed the code. Is this correct?
type map_countainer = <a,b>(f:Fun<a,b>, c:Countainer<a>) => Countainer<b>

//not working... why?
// let map_countainer = 
//   function<a,b>(f:Fun<a,b>) : Fun<Countainer<a>, Countainer<b>> { 
//   return Fun(c =>( {content:f.f(c.content), counter:c.counter} )
// }
 
//c =>{ content:f.f(c.content), counter:c.counter }

// let map_F<a,a>(id<a>()) = id<F<a>>()


//option
type Option<a> = { kind:"none" } | { kind:"some", value:a }

function print(x:Option<number>) : string {
  if (x.kind == "some")
    return `the value is ${x.value}`
  else 
    return "there is no value"
}

let none = function<a>() : Option<a> { return { kind:"none" } }
let some = function<a>(x:a) : Option<a> { 
  return { kind:"some", value:x } }
  
let map_Option = function<a,b>(f:Fun<a,b>) : Fun<Option<a>,Option<b>> {
    //not yet understand the code below
    return Fun(x => x.kind == "none" ? none<b>() : some<b>(f.f(x.value))) 
  }

type List<a> = {
  kind: "Cons"
  head: a
  tail: List<a>
} | {
  kind: "Empty"
}

//code from external source
type F<a> = {} //"placeholder"
let map_F = <a, b>(f: Fun<a, b>): Fun<F<a>, F<b>> => null! 