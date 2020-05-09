
  /*
    * So, I know my option
    * TODO: look if everything is used and maybe refactor
  */

  //exclude props based on the given condition (certain fields)
  export type ExcludeProps<T,Condition> = {
    [X in Exclude<keyof T,Condition>] : T[X]
  }

  export type GetProps<T> = keyof T

  //filter the interface/types based on the condition
  export type Filter<T,Condition> ={
    [P in keyof T] : T[P] extends Condition ? P : never
  }[keyof T] //the outcome will change fields to never and this keyof removes field that don't fit the interface (so the fields with never)
  
  //remove all props of type 'number' as example
 export type ExcludePropTypes<T,Condition> = Omit<T,Filter<T,Condition>>

 //get all props of type 'number' as example
 export type IncludePropTypes<T,Condition> = Pick<T,Filter<T,Condition>>


  
