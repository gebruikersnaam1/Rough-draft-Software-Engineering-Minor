import * as models from  "../data/models"//import model
import {List} from  "../utils/utils"//import tool
import {ExcludeProps, GetProps,Filter,ExcludePropTypes,IncludePropTypes} from  "./Tools" //import 'tools'


//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T>{
    tableData: List<T>
    Select: <K>()=>null
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

export let Table = function<T>(tableData: List<T>) : Table<T> {
    return {
        tableData: tableData,
        Select: function<k>(){
            return null
        }
    }
}