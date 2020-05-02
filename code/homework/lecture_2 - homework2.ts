/*
  @lecture 1
*/
let  Identity = <a>(): Fun<a, a> => Fun(x => x)


type Fun<a,b> = {
  f:(i:a)=>b
  then:<c>(g:Fun<b,c>)=> Fun<a,c>
  repeat:()=>Fun<number,Fun<a,a>>
  repeatUntil:()=>Fun<Fun<a,boolean>,Fun<a,a>>
}

let then = function<a,b,c>(f:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
  return Fun(x => g.f(f.f(x)))
}

let repeat = function<a>(f:Fun<a,a>,n:number) : Fun<a,a>{
  if(n<=0){
    return Identity<a>()
  }
  else{
    return f.then(repeat(f,(n-1)))
  }
}

let repeatUntil = function<a>(f:Fun<a,a>,rUntil:Fun<a,boolean>) : Fun<a,a>{
  let g = (x:a) =>{
    if(rUntil.f(x)){
      return Identity<a>().f(x)
    }else{
      return f.then(repeatUntil(f,rUntil)).f(x)
    }
  }
  return Fun(g)
}

let Fun = function<a,b>(f:(i:a)=>b) : Fun<a,b>{
  return{
    f:f,
    then:function<c>(this,g:Fun<b,c>) : Fun<a,c>{
      return then(this,g)
    },
    repeat:function(this) : Fun<number,Fun<a,a>>{
      return Fun<number, Fun<a, a>>((x:number) => repeat(this,x))
    },
    repeatUntil:function(this) : Fun<Fun<a,boolean>,Fun<a,a>>{
      return Fun(x=> repeatUntil(this,x))
    }
  }
}
/*
  @lecture 2
*/

type List<a> = {
  kind: "Cons"
  head: a
  tail: List<a>
} | {
  kind: "Empty"
}

const Cons = <T>(Head: T,Tail: List<T>) : List<T> => ({
  kind: "Cons",
  head: Head,
  tail: Tail
})

const Empty = <T>() : List<T> =>({
  kind: "Empty"
})



type Countainer<a> = { content:a, counter:number }

//f "a"+1 = 2
let map_countainer = function<a,b>(f:Fun<a,b>, c:Countainer<a>) : Countainer<b> { 
  return { content:f.f(c.content), counter:c.counter }
}

var listExample = Cons<string>("a",Cons("b",Cons("c",Empty())))

let assignment2 = Fun<string,string>(x=> x+"5")

let list_option = function<a,b>(f:Fun<a,b>) : Fun<List<a>,List<b>>{
  return Fun<List<a>,List<b>>(x => x.kind == "Empty" ? Empty<b>() : Cons<b>((f.f(x.head)),(list_option(f).f(x.tail))))
}

let result = list_option(assignment2).f(listExample)
console.log(result)
