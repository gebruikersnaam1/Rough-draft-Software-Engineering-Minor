import {map_table,Fun,Unit, StringUnit, tableData,List} from  "../utils/utils"//import tool
import {ExcludeProps} from  "./Tools" //import 'tools'
import {Column, Row,QueryResult,Students, Grades,GradeStats,Educations} from "../data/models"
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
export interface PrepareSelect<T,U extends string,M extends string ,N> extends TableData<T,N>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<ExcludeProps<T,k>,U,M,N>
}

export interface Operators<T,U extends string,M extends string,N> extends Execute,TableData<T,N>{
    Where:() => Omit<Operators<T,U | "Where",M,N>,U | "Where">,
    Include:<k extends keyof M> (tableName:k) => combineReturnTypes<T,U,M> 
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}

interface Table<T,U extends string,M extends string,N> extends Operators<T,U,M,N>,PrepareSelect<T,U,M,N>{}


//interfaces to have mulitple returns types, as Typescript otherwise don't allow it...
type StudentsReturn<T,U extends string,M extends string> =  <k extends keyof Students>(...i:k[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">
type GradesReturn<T,U extends string,M extends string> =  <k extends keyof Grades>(...i:k[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">
type GradeStatsReturn<T,U extends string,M extends string> =  <k extends keyof GradeStats>(...i:k[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">
type EducationsReturn<T,U extends string,M extends string> =  <k extends keyof Educations>(...i:k[]) => Omit<Operators<T,U | "Include",M,Unit>,U | "Include">
type combineReturnTypes<T,U extends string,M extends string> = StudentsReturn<T,U,M> | GradesReturn<T,U,M> | GradeStatsReturn<T,U,M> | EducationsReturn<T,U,M>

let IncludeTable = function<T,U extends string,M extends string>(name:string,TableData:tableData<T,any>) : combineReturnTypes<T,U,M> 
  {
    switch(name){
        case 'Students':
            return <k extends keyof Students>(...i:k[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include"> => {
                return IncludeLambda<T,U,M,Students,k>(ListStudents,TableData,i)
            }
        case 'GradeStats':
            return <k extends keyof GradeStats>(...i:k[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include"> => {
                return IncludeLambda<T,U,M,GradeStats,k>(ListGrades,TableData,i)
            }
        case 'Grades':
            return <k extends keyof Grades>(...i:k[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include"> => {
                return IncludeLambda<T,U,M,Grades,k>(RandomGrades,TableData,i)
            }
        case 'Educations':
        default: //NOTE: should have another default value
            return <k extends keyof Educations>(...i:k[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include"> => {
                return IncludeLambda<T,U,M,Educations,k>(ListEducations,TableData,i)
            }
    }
    // return ListEducations
}

let IncludeLambda = function<T,U extends string,M extends string,N,a>(incData:List<N>,tableData:tableData<T,any>,Props:a[]) : Omit<Operators<T,U | "Include",M,Unit>,U | "Include">{
    let fData : string[] = []
    Props.map(x=> {fData.push(String(x))})
    let newList : List<Unit> = Table<N,U,StringUnit,Unit>({fst: incData,snd:null!},fData).Commit().data
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
        Include:function<k extends keyof M>(tableName:k) : combineReturnTypes<T,U,M> {
            return IncludeTable<T,U,M>(String(tableName),tableData)
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