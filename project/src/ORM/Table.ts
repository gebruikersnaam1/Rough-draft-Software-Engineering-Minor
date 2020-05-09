import * as models from  "../data/models"//import model
import {List} from  "../utils/utils"//import tool
import {ExcludeProps, GetProps,Filter,ExcludePropTypes,IncludePropTypes} from  "./Tools" //import 'tools'


//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T>{
    tableData: List<T>
    Select: <k extends keyof T>(...Props:k[])=> Table<k>
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

//interface x = {y,z,i}
//possible selections = interface
//SELECTED {}
//FOR EACH SELECT remove possible selection
//i.e. SELECTED("y") == possible selection {z,i}
// y,z, i | { }
// z,i | { y }

export let Table = function<T>(tableData: List<T>) : Table<T> {
    return {
        tableData: tableData,
        Select: function<k extends keyof T>(...Props:k[]) : Table<k>{
            return null!
        }
    }
}