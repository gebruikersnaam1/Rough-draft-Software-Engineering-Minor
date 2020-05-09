import * as models from  "../data/models"//import model
import {List, Cons,Empty} from  "../utils/utils"//import tool
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
export let map_TableRow = <T,U>(row:T[]) : U[] =>{
    return null!
} 
//l = [a,b,c] of type T
//    [d] of type U
// 
export let map_table = <T,U>(x:List<T>) : List<U> =>{
    if(x.kind == "Cons"){
        for(let i in x.head){
            
        }
    }
    // var z = x.kind == "Cons" ? Cons(map_TableRow(x.head),Empty()) : Empty()
    return null!
}

export let Table = function<T,U>(tableData: List<T>) : Table<T,U> {
    return {
        tableData: tableData,
        Select: function<k extends keyof T>(...Props:k[]) : Table<ExcludeProps<T,k>,Pick<T,k>>{
            return Table<ExcludeProps<T,k>,Pick<T,k>>(tableData)
        },
        Commit: () => { //a little to get the list
            return map_table<T,U>(tableData)
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