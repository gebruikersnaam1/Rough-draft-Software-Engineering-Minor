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

type F<a> = {}
let unit : <a>() => Fun<a,F<a>>
let join : <a>() => Fun<F<F<a>>, F<a>>
let map_F : <a,b>(f:Fun<a,b>) => Fun<F<a>, F<b>>
let bind = <a,b>(p:F<a>, q:Fun<a,F<b>>) : F<b> => map_F<a,F<b>>(q).then(join<b>()).f(p)

//basic nomads
type Fun_n<a> = Fun<number,a>
let map_Fun_n = <a,b>(f:Fun<a,b>, p:Fun_n<a>) : Fun_n<b> => p.then(f)
let unit_Fun_n = <a>() => Fun<a, Fun_n<a>>(x => Fun(i => x))
// let join_Fun_n = <a>() => Fun<Fun_n<Fun_n<a>>>,Fun_n<a>>(f => Fun(i => f.f(i).f(i)))

type Pair<a,b> = { x:a, y:b }
type WithNum<a> = Pair<a,number>

let fst = <a,b>():Fun<Pair<a,b>,a> => Fun(p => p.x)
let snd = <a,b>():Fun<Pair<a,b>,b> => Fun(p => p.y)
let map_Pair = <a,b,a1,b1>(f:Fun<a,a1>, g:Fun<b,b1>) : Fun<Pair<a,b>,Pair<a1,b1>> => 
  Fun(p => ({ x:f.f(p.x), y:g.f(p.y) }))

// let map_WithNum = <a,b>(f:Fun<a,b>) : Fun<WithNum<a>,WithNum<b>> =>
// map_Pair(f, id<number>())

type Id<a> = a
let map_Id = <a,b>(f:Fun<a,b>) : Fun<Id<a>,Id<b>> => f

// let then_F = <a,b>(f:Fun<a,F<b>>, g:Fun<b,F<c>>) : Fun<a,F<c>> =>
//   f.then(map_F<b,F<c>>(g)).then(join_F<c>())

