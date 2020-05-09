import * as models from  "../data/models"//import model
import {List} from  "../utils/utils"//import tool
import {ExcludeProps, GetProps,Filter,ExcludePropTypes,IncludePropTypes} from  "./Tools" //import 'tools'

export interface test {
    x: number,
    a: string,
    z: string,
    y: number
}
type z = ExcludeProps<test,'x'>
//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T,U>{
    tableData: List<T>
    Select: <k extends keyof T>(...Props:k[])=> Table<ExcludeProps<T,k>,Pick<T,k>>
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

//notes: how to create the table SELECT
//interface x = {y,z,i}
//possible selections = interface
//SELECTED {}
//FOR EACH SELECT remove possible selection
//i.e. SELECTED("y") == possible selection {z,i}
// T = {y,z, i} | U = { } | 
// T = {z,i } | U = { y } |
// z = T - U
// y = Props of type T(k) + U

export let Table = function<T,U>(tableData: List<T>) : Table<T,U> {
    return {
        tableData: tableData,
        Select: function<k extends keyof T>(...Props:k[]) : Table<ExcludeProps<T,k>,Pick<T,k>>{
            return Table<ExcludeProps<T,k>,Pick<T,k>>(tableData)
        }
    }
}