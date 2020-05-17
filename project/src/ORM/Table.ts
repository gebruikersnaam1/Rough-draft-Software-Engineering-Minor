import {map_table,Fun,Unit,tableData} from  "../utils/utils"//import tool
import {ExcludeProps,Filter} from  "./Tools" //import 'tools'
import {Column, Row,QueryResult} from "../data/models"
import {dbEnv} from './Database'


//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>


//base interface that contens tables
export interface TableData<T>{
    tableData: tableData<T>
    FilterData: string[]
}

//base execute something
export interface Execute{
    Commit: () => QueryResult<Unit>
}

//the user can only select something before commit
export interface PrepareSelect<T,U extends string,M> extends TableData<T>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<ExcludeProps<T,k>,U,M>
}

export interface Operators<T,U extends string,M> extends Execute,TableData<T>{
    Where:() => Omit<Operators<T,U | "Where",M>,U | "Where">,
    Include:<k extends keyof M> (tableName:k) =>  Omit<Operators<T,U | "Include",M>,U | "Include">,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

interface Table<T,U extends string,M extends string> extends Operators<T,U,M>,PrepareSelect<T,U,M>{}


//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//K is to say the includes possible are X,Y and Z
export let Table = function<T,U extends string,M extends string>(tableData: tableData<T>, filterData: string[]) : Table<T,U,M> {
    return {
        tableData: tableData,
        FilterData : filterData,

        //if interface fails and select get selected twice, keyof ensures that i.e. column1 can still not be selected twice
        Select: function<k extends keyof T>(...Props:k[]) : Operators<ExcludeProps<T,k>,U,M>{
            Props.map(x=> {this.FilterData.push(String(x))})
            //Pick<T,K>
            return Table(tableData,filterData)
        },
        Include:function<k extends keyof M>(tableName:k) : Omit<Operators<T,U | "Include",M>,U | "Include">{
            let o = <a extends keyof Filter<dbEnv,k>> (...Props:a[]) => Props 
            return Table<T,U | "Include",M>(tableData,filterData)
        },
        Where:function(): Omit<Operators<T,U | "Where",M>,U | "Where">{
            return Table<T,U | "Where",M>(tableData,filterData)
        },
        Commit: function(this) { //this is to get the list
            //return the result of map_table in datatype "Query result"
            return QueryResult(map_table<T,Unit>(tableData.snd,Fun<T,Row<Unit>>((obj:T)=>{
                //the lambda turns obj into json-format, otherwise a problem occurs  
                let jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))))
                let newBody : Column<Unit>[] = []
                Object.getOwnPropertyNames(obj).map(y =>{
                        this.FilterData.map(x=> { 
                            //loops through all objects and looks if it is selected with another loop
                            //Foreign key can be selected, but will not be shown just like normal SQL
                            if(String(x) == String(y)){  
                                newBody.push(Column(String(x), jObject[y] == "[object Object]" ? "Ref("+String(x)+")" : jObject[y]))
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
/*
    na de include wil ik een: Table<T,U,M> returnen en iets dat alleen input van dat Include table toelaat ()
    (...Props:Pick<x,x>[])
*/