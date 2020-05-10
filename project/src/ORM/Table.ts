import {List,map_table,Fun} from  "../utils/utils"//import tool
import {ExcludeProps} from  "./Tools" //import 'tools'

//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>
export interface Table<T,U>{
    tableData: List<T>
    FilterData: string[]
    Select: <k extends keyof T>(...Props:k[])=> Table<ExcludeProps<T,k>,Pick<T,k> & U>
    Commit: () => List<U[]>
    // Include: null,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

// type T = {x,y,z}
// type U = {}
// let customArray = List<T>({x,y,z},{x,y,z})

// Select(x)
// Type T = {y,z}
// Type U = { x }

// can select twice
// Select(y)
// Type T = {y,z}
// Type U = { x,y }

//let customArray2 = List<U>
//for i in customArray: 
//      //I = {x,y,z}
//      let z = FilterToNewType(i) //z contains {x,y}
//      add z to customArray 2
// let customArray2 = List<T>({x,y},{x,y})

export let Table = function<T,U>(tableData: List<T>, filterData: string[]) : Table<T,U> {
    return {
        tableData: tableData,
        FilterData : filterData,

        Select: function<k extends keyof T>(...Props:k[]) : Table<ExcludeProps<T,k>,Pick<T,k> & U>{
            Props.map(x=> {this.FilterData.push(String(x))})
            return Table<ExcludeProps<T,k>,Pick<T,k> & U>(tableData,filterData)
        },
        Commit: function(this) { //a little to get the list
            return map_table<T,U>(tableData,Fun<T,U[]>((obj:T)=>{ 
                let jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))))
                let newBody : U[] = []
                this.FilterData.map(x=> {
                    Object.getOwnPropertyNames(obj).map(y =>{
                            if(String(x) == String(y)){
                                newBody.push(jObject[y])
                            }
                        }
                    )
                })
                return newBody
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