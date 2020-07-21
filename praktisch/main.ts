/*
 lesson 1
 TODO:
  - make the Id functor
  - Make let and type Fun with 'f','then', 'repeat' and 'repeat until'
*/

type Fun <a,b> = {
  f: (_:a) => b 
  then:<c> (this:Fun<a,b>,g: Fun<b,c>) => Fun<a,c>
  repeat: (this:Fun<a,a>) => Fun<number,Fun<a,a>>
  repeatUntil: (this:Fun<a,a>) => Fun<Fun<a,boolean>,Fun<a,a>>
}

let then = function<a,b,c>(f:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
  return Fun(x =>  g.f(f.f(x)))
}

let Id = <a>() => Fun<a,a>(x=>x)

let repeat = function<a>(f:Fun<a,a>, n:number) : Fun<a,a> {
  if(n == 0){
    return Id<a>()
  }
  else{
    f.then(repeat(f,(n-1)))
  }
}

let repeatUntil = function<a>(f:Fun<a,a>, p:Fun<a,boolean>) : Fun<a,a>{
  return Fun(x =>{
    if(p.f(x)){
      return f.f(x)
    }else{
      return f.then(repeatUntil(f,p)).f(x)
    }
  })
}

let Fun = function<a,b>(f:(i:a)=>b) : Fun<a,b> {
  return {
    f: f,
    then:function<c>(this, g:Fun<b,c>) : Fun<a,c>{
      return then(this,g)
    },
    repeat: function(this) : Fun<number,Fun<a,a>>{
      return Fun(x => repeat(this,x))
    },
    repeatUntil: function(this): Fun<Fun<a,boolean>,Fun<a,a>>{
      return Fun(p => repeatUntil(this,p))
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
  kind: "Some"
  value: a
 } | {
   kind: "Empty"
 }

 let Some = <a>(x:a) :Option<a> => ({ kind: "Some", value:x})
 let None = <a>() : Option<a> => ({ kind:"Empty"})

let map_option = function<a,b>(f:Fun<a,b>) : Fun<Option<a>,Option<b>>{
  return Fun(x => x.kind == "Some" ? Some(f.f(x.value)) : None())
}

let map_option1 = <a,b>(f:Fun<a,b>) : Fun<Option<a>,Option<b>> => 
  Fun(x => x.kind == "Some" ? Some(f.f(x.value)) : None())

/*
 lesson 3
 TODO:
  - Make Monad Pair
  - Make zero/unit for string, list
  - Make plus for Pair<string,string>, list
  - make join for option, list
*/

type Pair<a,b> = {
  fst: a
  snd: b
}

type List<a> = {
  kind: "Cons"
  head: a
  tail: List<a>
} | {
  kind: "Empty"
}

let Cons = <a> (l:a, t:List<a>) : List<a> => ({
  kind: "Cons",
  head: l,
  tail: t
}) 

let Empty = <a> () : List<a> => ({
  kind: "Empty"
}) 

let list_plus = <a> (l1:List<a>) => (l2:List<a>) : List<a> => l1.kind == "Cons" ? Cons(l1.head, list_plus(l1)(l2)) : Empty()

let plus_pair = (p: Pair<string,string>) => p.fst + p.snd

let join_option = <a> (x: Option<Option<a>>) => x.kind == "Some" ? x.value : None() 

/*
 lesson 4
 TODO:
  - Make bind (that is map_list(x) and join right after)
*/

let join_list = <a> (x: List<List<a>>) : List<a> => x.kind == "Cons" ? x.head : Empty() 


let map_list = <a,b> (f:Fun<a,b>) : Fun<List<a>,List<b>> => 
  Fun(x => x.kind == "Cons" ? Cons(f.f(x.head), map_list(f).f(x.tail)) : Empty())
  

let bind = <a,b> (f:Fun<a,List<b>>) : Fun<List<a>,List<b>> => 
map_list(f).then(Fun(join_list))

/*
 lesson 5
 TODO:
  - Make apply (pair with a fun as first element, and as second the element that needs to be applied)
*/

let apply = <a,b> () => Fun<Pair<Fun<a,b>, a>,b>(x => x.fst.f(x.snd))
/*
 lesson 6,7,8 have exercises, but none will be done at this point.
 7 = adding errors as options to everything
 8 = Coroutine
*/
