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

const Cons = <a>(h: a, t:List<a>):List<a>=>{
  return{
    kind: "Cons",
    head: h,
    tail: t
  }
}

const Empty =<a>() : List<a> =>{
  return{
    kind: "Empty"
  }
}

let map_list = function<a,b>(f:Fun<a,b>,l:List<a>) : List<b>{
  return l.kind == "Cons" ? Cons(f.f(l.head),map_list(f,l.tail)) : Empty()
}

let f_l = Fun<string,string>(x => (x+1))
let l1 = Cons("a",Cons("b",Cons("c",Empty())))
let l2 = map_list(f_l,l1)

console.log(l2)

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

//feels wrong because it not really generic... or is it?
let Exception = Fun<Exception<string>,string>(
    x => x.kind == "Result" ? x.value : "Something went wrong"
  )


/*
  ***** Lesson 3
*/