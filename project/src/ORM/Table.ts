import {List,map_table,Fun} from  "../utils/utils"//import tool
import {ExcludeProps, GetProps,Filter,ExcludePropTypes,IncludePropTypes} from  "./Tools" //import 'tools'


//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T,U>{
    tableData: List<T>
    Select: <k extends keyof T>(...Props:k[])=> Table<ExcludeProps<T,k>,Pick<T,k>>
    Commit: () => List<U>
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

export let Table = function<T,U>(tableData: List<T>) : Table<T,U> {
    return {
        tableData: tableData,
        Select: function<k extends keyof T>(...Props:k[]) : Table<ExcludeProps<T,k>,Pick<T,k>>{
            return Table<ExcludeProps<T,k>,Pick<T,k>>(tableData)
        },
        Commit: () => { //a little to get the list
            return map_table<T,U>(tableData,Fun<T,U>((obj:T)=>{
                //T = {} somewhere between 0 and 1000
                //U = {} somewhere between 0 and 1000
                //i.e. T = {x,y,z} | U = {y,z}
                //obj = {x,y,z}
                type result = ExcludeProps<T,U>
                type TypeWithGeneric<T> = T[]
                type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never
                // [P in keyof T] : T[P] extends Condition ? P : never
                return null!
            }))
        }
    }
}


/*
 *notes
*/
//how to create the table SELECT for Props
    //interface x = {y,z,i}
    //possible selections = interface
    //SELECTED {}
    //FOR EACH SELECT remove possible selection
    //i.e. SELECTED("y") == possible selection {z,i}
    // T = {y,z, i} | U = { } | 
    // T = {z,i } | U = { y } |
    // z = T - U
    // y = Props of type T(k) + U