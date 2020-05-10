import {List,map_table,Fun} from  "../utils/utils"//import tool
import {ExcludeProps} from  "./Tools" //import 'tools'
import {Column, Row,QueryResult} from "../data/models"

//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T,U>{
    tableData: List<T>
    FilterData: string[]
    Select: <k extends keyof T>(...Props:k[])=> Table<ExcludeProps<T,k>,Pick<T,k> & U>
    Commit: () => QueryResult<U>
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

export let Table = function<T,U>(tableData: List<T>, filterData: string[]) : Table<T,U> {
    return {
        tableData: tableData,
        FilterData : filterData,

        Select: function<k extends keyof T>(...Props:k[]) : Table<ExcludeProps<T,k>,Pick<T,k> & U>{
            Props.map(x=> {this.FilterData.push(String(x))})
            return Table<ExcludeProps<T,k>,Pick<T,k> & U>(tableData,filterData)
        },
        Commit: function(this) { //a little to get the list
            return QueryResult(map_table<T,U>(tableData,Fun<T,Row<U>>((obj:T)=>{ 
                let jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))))
                let newBody : Column<U>[] = []
                this.FilterData.map(x=> {
                    Object.getOwnPropertyNames(obj).map(y =>{
                            if(String(x) == String(y)){
                                newBody.push(Column(String(x), jObject[y] == "[object Object]" ? null : jObject[y]))
                            }
                        }
                    )
                })
                return Row(newBody)
            })))
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