/*
 lesson 1
 TODO:
  - make the Id functor
  - Make let and type Fun with 'f','then', 'repeat' and 'repeat until'
*/
let Id = <a>() => Fun<a,a>(x=>x)

type Fun<a,b> = {
  f: (x:a) => b
  then:<c> (this:Fun<a,b>, g:Fun<b,c>) => Fun<a,c>
  repeat: (this: Fun<a,a>) => Fun<number, Fun<a,a>>
  repeatUntil: (this:Fun<a,a>) => Fun<Fun<a,boolean>,Fun<a,a>>
}

let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c>{
  return Fun(x=> g.f(f.f(x)))
}

let repeat = function<a>(n:number, g: Fun<a,a>) : Fun<a,a> {
  if (n <= 0){
    return Id<a>()
  }else{
    return g.then(repeat((n-1),g))
  }
}

let repeatUntil = function<a>(p:Fun<a,boolean>, g:Fun<a,a>) : Fun<a,a> {
  let z = (x:a) =>{
    if(p.f(x)){
      return Id<a>().f(x)
    }else{
      return g.then(repeatUntil(p,g)).f(x)
    }
  }
  return Fun(z)
}

let Fun = function<a,b>(f:(x:a)=>b) : Fun<a,b>{
  return {
    f: f,
    then: function<c>(this, g:Fun<b,c>) : Fun<a,c>{
      return then(this,g)
    },
    repeat: function(this) : Fun<number, Fun<a,a>>{
      return Fun(x => repeat(x,this))
    },
    repeatUntil: function(this): Fun<Fun<a,boolean>,Fun<a,a>>{
      return Fun(x => repeatUntil(x, this))
    }
  }
}

/*
 lesson 2
 TODO:
  - Make Monad Option
  - Make map_option
*/
type Option<a> = {
  kind: "Some",
  value: a
} | {
  kind: "None"
}

let Some = <a>(x:a) : Option<a> => ({kind: "Some", value:x})
let None = <a>() : Option<a> => ({kind: "None"})

let map_option = function<a,b>(p:Fun<a,b>) : Fun<Option<a>,Option<b>>{
  return Fun(x => x.kind == "Some" ? Some(p.f(x.value)) : None<b>())
}

let map_option2 = <a,b>(p:Fun<a,b>) :  Fun<Option<a>,Option<b>> => (Fun(x => x.kind == "Some" ? Some(p.f(x.value)) : None<b>()))

/*
 lesson 3
 TODO:
  - Make Monad Pair
  - Make zero/unit for string, list
  - Make plus for Pair<string,string>, list
  - make join for option, list
*/

type Pair<a,b> = {
  fst: a,
  snd: b
}

type List<a> = {
  kind: "Cons",
  head: a,
  tail: List<a>
} | {
  kind: "Empty"
}

let Cons = <a>(h:a,t:List<a>) : List<a> => ({
  kind: "Cons",
  head: h,
  tail: t
})

let Empty = <a>() : List<a> => ({
  kind: "Empty"
})

let plus_pair = () => Fun<Pair<string,string>,string>(x => x.fst+x.snd)

let plus_list = <a> () : Fun<Pair<List<a>,List<a>>,List<a>> => Fun(
  x => x.fst.kind == "Cons" ? Cons<a>(x.fst.head,plus_list<a>().f({fst: x.fst.tail, snd: x.snd})) : x.snd
)

let join_option = <a>() => Fun<Option<Option<a>>, Option<a>>(x => x.kind == "Some" ? x.value : None<a>() )

let join_list = <a>() => Fun<List<List<a>>, List<a>>(x => x.kind == "Cons" ? x.head : Empty<a>() )


/*
 lesson 4
 TODO:
  - Make bind (that is map_list(x) and join right after)
  - Make map_list
*/

let map_list = <a,b>(p:Fun<a,b>) :  Fun<List<a>,List<b>> => (
    Fun(x => x.kind == "Cons" ? Cons<b>(p.f(x.head) ,map_list<a,b>(p).f(x.tail)) : Empty<b>())
)
let z = join_list()
let bind_list = <a,b>(p:Fun<a,List<b>>) => Fun<List<a>,List<b>>(x =>
    map_list<a,List<b>>(p).then(join_list()).f(x)
  )

/*
 lesson 5
 TODO:
  - Make apply (pair with a fun as first element, and as second the element that needs to be applied)
*/
let apply = <a,b> () => Fun<Pair<Fun<a,b>,a>, b>(x => x.fst.f(x.snd))

/*
 lesson 6,7,8 have exercises, but none will be done at this point.
 6 = states / instructions
 7 = adding errors as options to everything
 8 = Coroutine
*/
