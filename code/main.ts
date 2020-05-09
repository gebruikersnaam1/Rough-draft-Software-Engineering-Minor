interface Whatever {
  y: number,
  x: number,
  z: string,
  h: string,
  k: boolean,
  l: boolean
}

/*
  * Pak alles behalve wat is aangegeven
*/
type WhateverMinusBooleans = {
  [W in Exclude<keyof Whatever, 'k' | 'l'>] : Whatever[W]
}

/*
  * haal iets uit een lijst
*/
type WhateverProps = keyof Whatever
type WhateverOnlyK = Extract<WhateverProps, 'k'>

/*
  * haal iets uit een lijst
*/
type  WhateverOnlyH = Pick<Whatever,'h'>

type Filter<T> ={
  //t = boolean than we want to return k and l
  get:<K extends keyof T>(key:K) => Whatever
} 


// let z = 