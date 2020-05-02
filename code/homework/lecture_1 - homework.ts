type Fun<a,b> = {
  f:(i:a) =>b
  then:<c>(x:Fun<b,c>)=> Fun<a,c>
  repeat:()=>Fun<number,Fun<a,a>>
  repeatUntil:()=>Fun<Fun<a,boolean>,Fun<a,a>>
}

let then = function<a,b,c>(f:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
  return Fun<a,c>((x)=>g.f(f.f(x)))
}

let  Identity = <a>(): Fun<a, a> => Fun(x => x)

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

let Fun = function<a,b>(f:(i:a)=>b) : Fun<a,b>{
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

let v = Fun<number,number>((x)=> x+1)
let x = v.repeat().f(5).f(5)
console.log(x)