import {List,map_table,Fun} from  "../utils/utils"//import tool
import {ExcludeProps} from  "./Tools" //import 'tools'
import { isArray } from "util"

//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T,U>{
    tableData: List<T>
    FilterData: U[]
    Select: <k extends keyof T>(...Props:k[])=> Table<ExcludeProps<T,k>,Pick<T,k> & U>
    Commit: () => List<U>
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

export let Table = function<T,U>(tableData: List<T>, filterData: U[]) : Table<T,U> {
    return {
        tableData: tableData,
        FilterData : filterData,
        Select: function<k extends keyof T>(...Props:k[]) : Table<ExcludeProps<T,k>,Pick<T,k> & U>{
            [Props,this.FilterData].map(x=> {
                if(isArray(x)){
                    console.log(x)
                }
            })
            // console.log(a)
            return Table<ExcludeProps<T,k>,Pick<T,k> & U>(tableData,null!)
        },
        Commit: function(this) { //a little to get the list
            return map_table<T,U>(tableData,Fun<T,U>((obj:T)=>{

                //T = {} somewhere between 0 and 1000
                //U = {} somewhere between 0 and 1000
                //i.e. T = {x,y,z} | U = {y,z}
                //obj = {x,y,z}
                let i = this.FilterData
                let z = Object.getOwnPropertyNames(obj)
                let x = JSON.parse(JSON.stringify((Object.assign({}, obj))))
                let a = { "Id":0 }
                // console.log(i)
                for(let i = 0; i < z.length; i++){
                    //https://stackoverflow.com/questions/28150967/typescript-cloning-object/42758108
                    //https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
                    // console.log(obj)
                    if(x[z[i]] in a){
                        // console.log(x[z[i]])
                    }
                }
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