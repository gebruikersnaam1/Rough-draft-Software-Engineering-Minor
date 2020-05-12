interface Whatever {
    y: number,
    x: number,
    z: string,
    h: string,
    k: boolean,
    l: boolean
  }
  
  
  //implemteren mogelijkheid van een interface
  type StringValue = Whatever['h']
  
  
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
  
  
  /*
    * remove/omit
  */
  type RemoveL = Omit<Whatever,'l'>
  
  /*
    * Filter
  */
  type Filter<T,Condition> ={
    //zet attribute van bepaalde waardes to never (om het makkelijk daarna weg te filteren)
    [P in keyof T] : T[P] extends Condition ? P : never
    //voor ieder veld in de interface ':'... for loop?
    //de for loop kijkt als T[P] (veld naam in interface) voldoet aan conidition dat geef je de waarde terug anders geef je de waarde never
  }[keyof T] //dit stukje is om de nevers weg te filteren... door al het resultaat weg halen dat niet voldoet aan de interface (T)
  
  type FilterVars = Filter<Whatever,boolean>
  
  
  /*
    * Pick in if-statement
  */
  type PickIf<T, Condition> = { //this may be an useless function?
    [P in Filter<T,Condition>] : T[P]
    //create a var 'P' based on the given values of Filter and then returns those fields 
  }
  
  type GetAllStrings = PickIf<Whatever,string>
  
  
  /*
    * haal alles zolang het niet voldoet aan een bepaalde waarde
    * verschil met normale omit is dat je nu doet op var type waarde
  */
  type OmitIf<T,Condition> = {
    [P in Exclude<keyof T, Filter<T,Condition>>] : T[P]
    //haal door 'Exclude<keyof T, Filter<T,Condition>>' alle niet booleans op en die geef die terug
  }
  
  type OmitIfSimple<T,Condition> = Omit<T,Filter<T,Condition>>
  
  type NoBooleans =OmitIf<Whatever,boolean>
  type NoBooleans2 =OmitIfSimple<Whatever,boolean>
  