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
            let z = (x:Filter<dbEnv,M>) => {}
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