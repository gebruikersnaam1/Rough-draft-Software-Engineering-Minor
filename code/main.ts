//basic stuff
type Fun<a,b> = { f:(i:a) => b, then:<c>(g:Fun<b,c>) => Fun<a,c> }

let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
  return Fun<a,c>(a => g.f(f.f(a)))
}
type Option<a> = { kind:"none" } | { kind:"some", value:a }
let none = function<a>() : Option<a> { return { kind:"none" } }
let some = function<a>(x:a) : Option<a> { 
  return { kind:"some", value:x } }
  

// type liption<a> = List<Option<a>>

let Fun = function<a,b>(f:(_:a)=>b) : Fun<a,b> { 
  return { 
    f:f,
    then:function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> { 
      return then(this,g) }
  }
}

type Id<a> = a //"simple"?
const id = <a>() : Fun<a,a> => Fun(a=>a)
type container<a> = {value: a, counter:number}
type List<a> = Array<a>

type Unit = {}
type Pair<a,b> = {fst:a,snd:b}
let makePair = <a,b>() : Fun<a, Fun<b, Pair<a,b>>> => Fun(a => Fun(b=> ({ fst:a, snd:b })))

//two ways to do the same (not really the best way? teacher said)
const eta_sum : Fun<Unit,number> = Fun(_ => 0)
const join_sum : Fun<Pair<number,number>,number> = Fun(xy => xy.fst * xy.snd) 

const e_sum : number = eta_sum.f({})
const plus_sum = (x:number, y:number) => join_sum.f({fst:x, snd:y})

const eta_Id = <a>() : Fun<a, Id<a>> => id()
const join_Id = <a>() : Fun<Id<Id<a>>, Id<a>> => id()
const Map_id = <a, b>(): Fun<Fun<a,b>, Fun<Id<a>,Id<b>>> => id()


type Fun_n<a> = Fun<number,a>
const Map_fun_n = <a,b>() :
    Fun<Fun<a,b>,Fun<Fun_n<a>,Fun_n<b>>> =>
      Fun((f:Fun<a,b>) =>
        Fun((f_n:Fun<number,a>) : Fun<number,b> =>
            f_n.then(f) //this becomes b?
        )
      )


type  PairLeft<a> = Pair<a,number>
const map_PairLeft = <a,b>():
  Fun<Fun<a,b>, Fun<PairLeft<a>,PairLeft<b>>> =>
    Fun((f:Fun<a,b>)=>
      Fun(p1=>
        ({ fst: f.f(p1.fst), snd: p1.snd})
      )
    ) 
    

const eta_fun_n = <a>() : Fun<a,Fun_n<a>> => Fun(a => null)
const join_fun_n = <a>() : Fun<Fun_n<Fun_n<a>>, Fun_n<a>> =>
        Fun((f_f:Fun_n<Fun_n<a>>): Fun_n<a> =>
          Fun(n => f_f.f(n).f(n))
        ) 

const eta_PairLeft = <a>(): Fun<a, PairLeft<a>> => Fun(a => ({fst:a,snd:0}))
const join_PairLeft = <a>() : Fun<PairLeft<PairLeft<a>>, PairLeft<a>> =>
        Fun(pl_pl =>({ fst:pl_pl.fst.fst, snd:pl_pl.fst.snd*pl_pl.snd }))

// const bind_fun_n = //did not type it over (around 60 minutes of lecture a) 

const bind_PairLeft = <a,b> (p:PairLeft<a>, k:Fun<a, PairLeft<b>>) : PairLeft<b> =>{
  return (map_PairLeft<a,PairLeft<b>>().f(k).then(join_PairLeft<b>())).f(p)
}


// type Process <s,e,a> = Fun<s, Either<e, Pair<a,s>>>
