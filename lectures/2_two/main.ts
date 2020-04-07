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
let map_countainer = 
  function<a,b>(f:Fun<a,b>, c:Countainer<a>) 
  : Countainer<b> { 
  return { content:f.f(c.content), counter:c.counter }
}


let c:Countainer<number> = { content:3, counter:0 }
let l:Countainer<boolean> = map_countainer(isEven, c)

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

// let map_countainer = 
//   function<a,b>(f:Fun<a,b>) : Fun<Countainer<a>, Countainer<b>> { 
//   return Fun(c =>{ content:f.f(c.content), counter:c.counter })
// }

type List<a> = {
  kind: "Cons"
  head: a
  tail: List<a>
} | {
  kind: "Empty"
}