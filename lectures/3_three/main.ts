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

type Unit = {}

// let zero: (_:Unit) : T => e

type Id<a> = a
let map_Id = function<a,b>(f:Fun<a,b>) : Fun<Id<a>, Id<b>> { return f }