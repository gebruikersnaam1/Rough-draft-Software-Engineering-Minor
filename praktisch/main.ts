
type Fun<a,b> = {
  f: (i:a) => b
  then:<c>(this:Fun<a,b>,g:Fun<b,c>) => Fun<a,c>
  repeat:(this:Fun<a,a>) => Fun<number,Fun<a,a>>
  repeatUntil:(this:Fun<a,a>) => Fun<Fun<a,boolean>,Fun<a,a>>
}

let then = function<a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c>{
  return Fun<a,c>(x=> g.f(f.f(x)))
}

let Id = <a>() :Fun<a,a>=> Fun(x=>x)

let repeat = function<a>(f:Fun<a,a>,x:number) : Fun<a,a>{
  if(x <= 0){
    return Id<a>()
  }else{
    return f.then(repeat(f,(x-1)))
  }
}

let repeatUntil = function<a>(f:Fun<a,a>, p: Fun<a,boolean>) : Fun<a,a>{
  let g = (x:a) =>{
    if(p.f(x)){
      return Id<a>().f(x)
    }else{
      return f.then(repeatUntil(f,p)).f(x)
    }
  }
  return Fun(g)
}

let Fun = function<a,b>(f:(i:a)=>b): Fun<a,b>{
  return {
    f:f,
    then:function<c>(this,g:Fun<b,c>){
      return then(this,g)
    },
    repeat: function(this):Fun<number,Fun<a,a>>{
      return Fun(x=>repeat(this,x))
    },
    repeatUntil: function(this): Fun<Fun<a,boolean>,Fun<a,a>>{
      return Fun(x=>repeatUntil(this,x))
    }
  }
} 

type List<T> = {
  kind: 'Cons',
  head: T,
  tail: List<T>
} | {
  kind: "Empty"
}

const Cons = <T>(h: T, t:List<T>) : List<T> =>({
    kind: "Cons",
    head: h,
    tail: t
  })

const Empty = <T>() : List<T> => ({
  kind:"Empty"
})

let map_list = <a,b>(l:List<a>,f:Fun<a,b>) =>(
  l.kind == "Cons"? Cons(f.f(l.head), map_list(l.tail,f)) : Empty()
)

type Errors<a> = {
  kind: "Error"
} | {
  kind: "Result"
  value: a
}


