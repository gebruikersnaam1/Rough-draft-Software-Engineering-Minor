//to do: Fun implementeren met methodes f,then,repeat,repeatUntil
//to do: ongein van assignment 1.1

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


let incr = Fun((x: number) => x + 1)
let double = Fun((x: number) => x * 2)
let square = Fun((x: number) => x * x)
let isPositive = Fun((x: number) => x > 0)
let isEven = Fun((x: number) => x % 2 == 0)
let invert = Fun((x: number) => -x)
let squareRoot = Fun((x: number) => Math.sqrt(x))
let ifThenElse =
  function<a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>) : Fun<a, b> {
    return Fun((x: a) => {
      if (p.f(x)) {
        return _then.f(x)
      }
      else {
        return _else.f(x)
      }
    })
  }
  // Implement a function that computes the square root if the input is positive, otherwise inverts it and then performs the square root
  let v = Fun<number,number>((x)=> x+1)
  let x = v.repeat().f(5).f(5)
  console.log(x)