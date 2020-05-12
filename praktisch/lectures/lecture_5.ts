//basic stuff
type Fun<a,b> = { f:(i:a) => b, then:<c>(g:Fun<b,c>) => Fun<a,c> }

let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
  return Fun<a,c>(a => g.f(f.f(a)))
}

  

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


/**********************************************
 * Lecture 5 video
 */



/**********************************************
 * Lecture 5 Grande Olega
 */
// type Option<a> = { kind:"none" } | { kind:"some", value:a }
// let none = <a>() : Fun<Unit,Option<a>> => Fun(_ => ({ kind:"none" }))
// let some = <a>() : Fun<a,Option<a>> => Fun(a => ({ kind:"some", value:a }))
// let unit_Option = <a>() : Fun<a,Option<a>> => some<a>()

// type Option<a> = ({
//   kind: "none"
// } | {
//   kind: "some",
//   value: a
// }) & {
//   then: <b>(f: (_: a) => Option<b>) => Option<b>
// }
// let safe_div = (a:Option<number>, b:Option<number>) : Option<number> =>
//   a.then(a_val =>
//   b.then(b_val =>
//   b_val == 0 ? none<number>()
//   : unit_Option(a_val / b_val)))
type Either<a,b> = { kind:"left", value:a } | { kind:"right", value:b }
let inl = <a,b>() : Fun<a, Either<a,b>> => Fun(a => ({ kind:"left", value:a }))
let inr = <a,b>() : Fun<b, Either<a,b>> => Fun(b => ({ kind:"right", value:b }))

type Option<a> = Either<Unit,a>
let none = <a>() : Option<a> => inl<Unit,a>().f({})
let some = <a>() : Fun<a,Option<a>> => inr<Unit,a>()
let unit_Either = <a,b>() : Fun<a,Either<b,a>> => inr<b,a>()
let join_Either = <a,b>() : Fun<Either<b,Either<b,a>>, Either<b,a>> =>
  Fun(x => x.kind == "left" ? inl<b,a>().f(x.value)
                : x.value)

/*
 errors
*/
// let map_Option = <a,b>(f:Fun<a,b>) : Fun<Option<a>,Option<b>> =>Fun(x => x.kind == "none" ? none<b>() : f.then(some<b>()))

// let join_Option = <a>() : Fun<Option<Option<a>>, Option<a>> =>
//   {Fun(x => x.kind == "none" ? none<a>() : x.value)  

// let bind_Option = function<a, b>(opt: Option<a>, k: Fun<a, Option<b>>) : Option<b> {
//   return map_Option(k).then(join_Option()).f(opt)
// }

// let map_Either = <a,b,c,d>(f:Fun<a,c>,g:Fun<b,d>) 
// : Fun<Either<a,b>,Either<c,d>> => Fun(x => 
//     x.kind == "left" ? f.then(inl<a,b>()).f(x.value) 
//     : g.then(inr<a,b>()).f(x.value))


// let map_Option = <a,b>(f:Fun<a,b>) : Fun<Option<a>,Option<b>> => 
//   map_Either<a,Unit,b,Unit>(f, id<Unit>())

