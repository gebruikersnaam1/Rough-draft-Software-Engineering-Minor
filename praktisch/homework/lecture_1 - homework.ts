type Fun<a,b> = { //A type that represents Functor 
  //It has a method than contains a lambda that takes a variable of type a and returns b
  f:(i:a) =>b
  //It has a method that takes another Fun and combine them in one
  then:<c>(x:Fun<b,c>)=> Fun<a,c>
  //It has a method that returns a Fun that takes a number that will takes a number. That number represents how many times the fun will be repeated
  repeat:()=>Fun<number,Fun<a,a>>
  //Same as method repeat as repeat, but keeps in the loop until value is found
  repeatUntil:()=>Fun<Fun<a,boolean>,Fun<a,a>>
}

//Makes a new Fun that takes ‘a’ as input and gives it to the first Fun that takes and afterwards it gives to another Fun.
let then = function<a,b,c>(f:Fun<a,b>,g:Fun<b,c>) : Fun<a,c>{
  return Fun<a,c>((x)=>g.f(f.f(x)))
}

//Takes an input and gives it back right away
let  Identity = <a>(): Fun<a, a> => Fun(x => x)

var repeatUntil = function<a>(f:Fun<a,a>,predict:Fun<a,boolean>) : Fun<a,a>{
    let g = (x:a) =>{ //returns a lambda
      if(predict.f(x)){
        return Identity<a>().f(x) //returns x without doing anything (that is correct!)
      }
      else{
        return f.then(repeatUntil(f,predict)).f(x) //repeat until we found it
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
  return { //implemented Fun
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