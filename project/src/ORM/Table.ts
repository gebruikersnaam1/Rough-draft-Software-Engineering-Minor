import {List,map_table,Fun} from  "../utils/utils"//import tool
import {ExcludeProps} from  "./Tools" //import 'tools'
import {Column, Row,QueryResult} from "../data/models"

//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>

//base interface that contens tables
export interface TableData<T>{
    tableData: List<T>
    FilterData: string[]
}

//base execute something
export interface Execute<U>{
    Commit: () => QueryResult<U>
}

//the user can only select something before commit
export interface PrepareSelect<T,U> extends TableData<T>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<ExcludeProps<T,k>,U>
}

export interface Operators<T,U> extends Execute<U>,TableData<T>{
    Where:  () => Omit<Omit<Operators<T,U>,"Where">,z>,
    Include:() => Omit<Omit<Operators<T,U>,"Include">,z>,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

interface Table<T,U> extends Operators<T,U>,PrepareSelect<T,U>{}

type z = "Include" | "Where"

export let Table = function<T,U>(tableData: List<T>, filterData: string[]) : Table<T,U> {
    return {
        tableData: tableData,
        FilterData : filterData,

        //if interface fails and select get selected twice, keyof ensures that i.e. column1 can still not be selected twice
        Select: function<k extends keyof T>(...Props:k[]) : Operators<ExcludeProps<T,k>,U>{
            Props.map(x=> {this.FilterData.push(String(x))})
            return Table(tableData,filterData)
        },
        Include:function(): Omit<Omit<Operators<T,U>,"Include">,z>{
            return Table<T,U>(tableData,filterData)
        },
        Where:function(): Omit<Omit<Operators<T,U>,"Where">,z>{
            // let a : ExcludePropTypes<Operators<T,U>,P> = Table<T,U>(tableData,filterData)
            return Table<T,U>(tableData,filterData)
        },
        Commit: function(this) { //this is to get the list
            //return the result of map_table in datatype "Query result"
            return QueryResult(map_table<T,U>(tableData,Fun<T,Row<U>>((obj:T)=>{
                //the lambda turns obj into json-format, otherwise a problem occurs  
                let jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))))
                let newBody : Column<U>[] = []
                this.FilterData.map(x=> {
                    Object.getOwnPropertyNames(obj).map(y =>{
                            if(String(x) == String(y)){ 
                                newBody.push(Column(String(x), jObject[y] == "[object Object]" ? null : jObject[y]))
                            }
                        }
                    )
                    // let z : Column<U>[] = []
                    // newBody.push(z)
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

/*
    Idea: If implementing something like this is possible, then a custom lambda needs to be developed for each table. 

    SELECT = [Object] == nul can be a way to do Include
    
    Table gets a Fun that recursive goes to the list, if attribute is selected then get value?
    Type U removes the attributes that are not selected?
    Type U is a real object, not a JSON file.
    Then type column or row can be changed. Either row contains the value of U or column contains the value T?
    Column x.name and x.age are not type U right? Yeah
    so, column needs to be removed and contains the value of U

    <U>(queryresult:U) => Fun<definedType(i.e. student), U>(
        let tmp1 = List<definedTypte() //with content
        let tmp2 =  <definedType() => {}
        let tmp3 = map_option(tmp2,tmp3)
        instance : definedType => {
                let newI : U = {}
                for(let i in instance){
                    if (i in queryresult){
                       newI.Name = instance.Name
                    } 
                }
        return tmp3;
            }
        }
    )
*/