/******************************************* 
 * List 
*******************************************/

export type List<a> = {
    kind: "Cons",
    head: a,
    tail: List<a>
} | {
    kind: "Empty"
}

export let Cons = <a>(head:a,tail:List<a>) : List<a> =>({
    kind: "Cons",
    head: head,
    tail: tail
}) 

export let Empty = <a>() : List<a> =>({
    kind: "Empty"
}) 

/******************************************* 
 * Fun
*******************************************/
export type Fun<a,b> = { 
    f:(i:a) =>b
    then:<c>(x:Fun<b,c>)=> Fun<a,c>
    repeat:(this: Fun<a, a>)=>Fun<number,Fun<a,a>>
    repeatUntil:(this: Fun<a, a>)=>Fun<Fun<a,boolean>,Fun<a,a>>
  }
  
  let then = function<a,b,c>(f:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
    return Fun<a,c>((x)=>g.f(f.f(x)))
  }

var repeatUntil = function<a>(f:Fun<a,a>,predict:Fun<a,boolean>) : Fun<a,a>{
    let g = (x:a) =>{ 
      if(predict.f(x)){
        return Identity<a>().f(x) 
      }
      else{
        return f.then(repeatUntil(f,predict)).f(x) 
      }
    }
    return Fun<a,a>(g)
}

let repeat = function<a>(f:Fun<a,a>,n:number) : Fun<a,a>{
  if(n<=0){
    return Identity<a>()
  }else{
    return f.then(repeat(f,(n-1)))
  }
}

export let Identity = <a>(): Fun<a, a> => Fun(x => x)
  
export let Fun = function<a,b>(f:(i:a)=>b) : Fun<a,b>{
    return { 
      f: f,
      then:function<c>(this:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
        return then(this,g)
      },
      repeat:function(this): Fun<number,Fun<a,a>>{
        return Fun<number, Fun<a, a>>(n => repeat(this, n))
      },
      repeatUntil:function(this) : Fun<Fun<a,boolean>,Fun<a,a>>{
        return Fun<Fun<a,boolean>,Fun<a,a>>(p => repeatUntil(this,p))
      }
    }
  }
  /******************************************* 
     * join
  *******************************************/

  /******************************************* 
     * map 
  *******************************************/
  export let map_table = <T,U>(l:List<T>,f:Fun<T,U[]>) : List<U[]> =>{
    return l.kind == "Cons" ? Cons<U[]>(f.f(l.head),map_table(l.tail,f)) : Empty<U[]>()
  }
  /******************************************* 
     * Other 
  *******************************************/
  export type Unit = {}