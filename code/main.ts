interface Whatever {
  y: number,
  x: number,
  z: string,
  h: string,
  k: boolean,
  l: boolean
}

let z = <Whatever> {x: 5, y: 5}
let y = <a>(i:a) : Whatever => {
  let o = i extends Whatever 
  return null
}
type Filter<T> ={
  //t = boolean than we want to return k and l
  get:<K extends keyof T>(key:K) => Whatever
} 


// let z = 