import {map_table,Fun,Unit,tableData,List} from  "../utils/utils"//import tool
import {ExcludeProps,Filter} from  "./Tools" //import 'tools'
import {Column, Row,QueryResult,Students, Grades} from "../data/models"
import {ListStudents,ListGrades,RandomGrades,ListEducations} from '../data/data'



//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>


//base interface that contens tables
export interface TableData<T,N>{
    tableData: tableData<T,N>
    FilterData: string[]
}

//base execute something
export interface Execute{
    Commit: () => QueryResult<Unit>
}

//the user can only select something before commit
export interface PrepareSelect<T,U extends string,M,N> extends TableData<T,N>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<ExcludeProps<T,k>,U,M,N>
}

export interface Operators<T,U extends string,M,N> extends Execute,TableData<T,N>{
    Where:() => Omit<Operators<T,U | "Where",M,N>,U | "Where">,
    Include:<k extends keyof M> (tableName:k) =>  <z extends keyof Students>(...Props:z[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">,
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

interface Table<T,U extends string,M extends string,N> extends Operators<T,U,M,N>,PrepareSelect<T,U,M,N>{}


//function to get data for the Union had to be in this file.
let GetTableData = function(name:string): List<any>{
    switch(name){
        case 'Students':
            return ListStudents
        case 'GradeStats':
            return ListGrades
        case 'Grades':
            return RandomGrades
        case 'Educations':
            return ListEducations
    }
    return ListEducations
}
type StudentsIE<T,U extends string,M extends string> =  <k extends keyof Students>(...i:k[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">
type GradesIE<T,U extends string,M extends string> =  <k extends keyof Grades>(...i:k[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">

//<T,U extends string,M extends string,N>
let temp = function<T,U extends string,M extends string,N>(name:string) : StudentsIE<T,U,M> | GradesIE<T,U,M>
{
    if(name == "test"){
        return <k extends keyof Students>(...i:k[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include"> => {
            return IncludeLambda<T,U,M,N,k>(String(""),null!,null!)
        }
    }else{
        return <k extends keyof Grades>(...i:k[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include"> => {
            return IncludeLambda<T,U,M,N,k>(String(""),null!,null!)
        }
    }
    // switch(name){
    //     case 'Students':
    //         return ListStudents
    //     case 'GradeStats':
    //         return ListGrades
    //     case 'Grades':
    //         return RandomGrades
    //     case 'Educations':
    //         return ListEducations
    // }
    // return ListEducations
}

let IncludeLambda = function<T,U extends string,M extends string,N,a>(tableName:string,tableData:tableData<T,any>,Props:a[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include">{
    let tempList : List<a>= GetTableData(tableName)
    let fData : string[] = []
    Props.map(x=> {fData.push(String(x))})
    let newList : List<Unit> = Table<a,U,M,N>({fst: tempList,snd:null!},fData).Commit().data
    return Table<T,U | "Include",M,Unit>({fst: tableData.fst,snd:newList},fData)
}
//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//M is to say the includes possible are X,Y and Z
export let Table = function<T,U extends string,M extends string,N>(tableData: tableData<T,N>, filterData: string[]) : Table<T,U,M,N> {
    return {
        tableData: tableData,
        FilterData : filterData,

        
        Select: function<k extends keyof T>(...Props:k[]) : Operators<ExcludeProps<T,k>,U,M,N>{
            Props.map(x=> {this.FilterData.push(String(x))})
            return Table(tableData,filterData)
        },
        Include:function<k extends keyof M>(tableName:k) : <z extends  keyof Students>(...Props:z[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">{
            //(i:a) =>b
            return function<z extends keyof Students>(...Props:z[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include">{
                return IncludeLambda<T,U,M,N,z>(String(tableName),tableData,Props)
            }
        },
        Where:function(): Omit<Operators<T,U | "Where",M,N>,U | "Where">{
            return Table<T,U | "Where",M,N>(tableData,filterData)
        },
        Commit: function(this) { //this is to get the list
            //return the result of map_table in datatype "Query result"
            return QueryResult(map_table<T,Unit>(tableData.fst,Fun<T,Row<Unit>>((obj:T)=>{
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
    Dus wat ik ook terug geeft moet in het begin Table bevatten + key
    Moet een optie bevatten voor x.("Y")
    Moet terug geven Table + nieuwe waarde 

    <a (van nieuwe table)> (...Props:a[]) =>{
        t = Table()

    }
*/