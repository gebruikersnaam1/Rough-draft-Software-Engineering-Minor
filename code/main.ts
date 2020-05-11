/*
  ***** Lesson 1
*/
type Fun<a,b> = {
  f: (i:a) =>b 
  then:<c>(i:Fun<b,c>) => Fun<a,c>,
  repeat:()=> Fun<number, Fun<a,a>>,
  repeatUntil:(g:Fun<a,boolean>)=> Fun<Fun<a,boolean>,Fun<a,a>>
}

let Id = <a>() : Fun<a,a> => Fun(x=>x)

let repeat = function<a>(f: Fun<a,a>, n:number) : Fun<a,a>{
  if(n <= 0){
    return Id<a>()
  }
  else{
    return f.then(repeat(f,(n-1)))
  }
}

let repeatUntil = function<a> (f:Fun<a,a>, p: Fun<a,boolean>) : Fun<a,a>{
  let g = (x:a) => {
    if(p.f(x)){
      return Id<a>().f(x)
    }
    else{
      return f.then(repeatUntil(f,p)).f(x)
    }
  }
  return Fun(g)
}

let then = function<a,b,c>(f:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
  return Fun(x => g.f(f.f(x)))
}

let Fun = function<a,b>(f:(i:a)=>b) : Fun<a,b>{
  return {
    f:f,
    then:function<c>(this,g:Fun<b,c>) : Fun<a,c>{
      return then(this,g)
    },
    repeat: function(this) : Fun<number,Fun<a,a>>{
      return Fun(x => repeat(this,x))
    },
    repeatUntil: function(this,g:Fun<a,boolean>) :  Fun<Fun<a,boolean>,Fun<a,a>>{
      return Fun(x => repeatUntil(this,g))
    }
  }
} 

/*
  ***** Lesson 2
*/

type List<a> = {
  kind: "Cons",
  head: a,
  tail: List<a>
} | {
  kind: "Empty"
}

const Cons = <a>(h: a, t:List<a>):List<a>=>({
    kind: "Cons",
    head: h,
    tail: t
})

const Empty =<a>() : List<a> => ({
    kind: "Empty"
})

let map_list = function<a,b>(f:Fun<a,b>,l:List<a>) : List<b>{
  return l.kind == "Cons" ? Cons(f.f(l.head),map_list(f,l.tail)) : Empty()
}

let f_l = Fun<string,string>(x => (x+1))
let l1 = Cons("a",Cons("b",Cons("c",Empty())))
let l2 = map_list(f_l,l1)

// console.log(l2)

type Exception <a> = {
  kind: "Result",
  value: a
} | {
  kind: "Error"
}

const Result = <a>(v:a) : Exception<a> =>{
  return {
    kind: "Result",
    value: v
  }
}

const Ex_Error = <a>() : Exception<a> =>{
  return{
    kind: "Error"
  }
}

//TODO: feels wrong because it not really generic... or is it?
let Exception = Fun<Exception<string>,string>(
    x => x.kind == "Result" ? x.value : "Something went wrong"
  )


/*
  ***** Lesson 3
*/
type Unit = {}
type Pair<a,b> = { fst: a, snd:b}
type Id<a> = a
type Option<a> = { kind:"none" } | { kind:"some", value:a }


//example from code provided by the teacher
let zero_int : Fun<Unit,number> = Fun((_:Unit) => 0)

//assignment 3.1
const Pair = <a,b>(fst:a,snd:b) : Pair<a,b> => ({
  fst:fst, snd:snd
})

let zero_string : Fun<Unit,string> = Fun((_:Unit)=>"")

let plus_string : Fun<Pair<string,string>,string> = Fun(
  x => x.fst + x.snd
)



let plus_ie = Pair<string,string>("Hello", " world")
let plus_r = plus_string.f(plus_ie)
// console.log(plus_r)

//assignment 3.2
//NOTE: zero_something always returns the 0 of that object... int=0, List=Empty, etc.... I think.
let zero_List = function<a>(): Fun<Unit, List<a>> {
  return Fun<Unit, List<a>>((_: Unit) => Empty<a>())
}
// l1: 4,5,7 Empty
// l2: 8,5,4 Empty
// l3 4,5,7,8,5,4 Empty
let plus_list = <a> () : Fun<Pair<List<a>,List<a>>,List<a>> => Fun(
  x => x.fst.kind == "Cons" ? Cons<a>(x.fst.head,plus_list<a>().f({fst: x.fst.tail, snd: x.snd})) : x.snd
)
var p_list1 = Cons(10, Cons(20, Cons(30, Empty())));
var p_list2 = Cons(40, Cons(50, Cons(60, Empty())));
var p_pair = Pair(p_list1, p_list2);
var p_list3 = plus_list().f(p_pair);
console.log(p_list3);

//
let id =  <a>() : Fun<a, Id<a>> => Fun(  x=> x)
//nothing more to do because Id<Id<a>> = a
let join = <a>() : Fun<Id<Id<a>>, Id<a>> => Fun( x => x)



let Some = <a>(value:a) : Option<a> => ({kind: "some", value: value})
let None = <a>()  : Option<a> => ({kind: "none"})
// let none = <a>() : Fun<{},Option<a>> => Fun<{},Option<a>>(_ => ({ kind:"None" }))
// let some = <a>() : Fun<a,Option<a>> => Fun<a,Option<a>>(x => ({ kind:"Some", value:x }))
let z = Some("x")
let unit_option = <a>() => Fun<a, Option<a>>(x => Some(x))

let join_option = function<a>() :  Fun<Option<Option<a>>, Option<a>> {
  return Fun<Option<Option<a>>, Option<a>>(x =>  x.kind == "some" ? x.value : None())
}

let unit_list = <a>() : Fun<a,List<a>> => Fun(x => Cons(x,Empty()))
let join_list = <a>() : Fun<List<List<a>>, List<a>> => Fun(x => {
  return x.kind == "Cons" ? plus_list<a>().f({ fst: x.head, snd: join_list<a>().f(x.tail) } ) : Empty<a>()
})
