import {map_table,Fun,Unit, StringUnit, tableData,FilterPair,List} from  "../utils/utils"//import tool
import {ExcludeProps} from  "./Tools" //import 'tools'
import {Column, Row,QueryResult} from "../data/models"
import {Grades,Educations, GradeStats,Students} from  "../data/models"//import model
import {RandomGrades,ListEducations,ListGrades,ListStudents} from  "../data/data"//import model

//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>

/******************************************************************************* 
 * @Interfaces
*******************************************************************************/

//base interface that contens tables
export interface dataInterface<T,N>{
    dataDB: tableData<T,N>
    FilterData: FilterPair
}

//base execute something
export interface Execute{
    Commit: () => QueryResult<Unit>
}

//the user can only select something before commit
export interface PrepareSelect<T,U extends string,M ,N> extends dataInterface<T,N>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<ExcludeProps<T,k>,U,M,N>
}

interface IncludeSelect<T,U extends string,M extends string,N> extends dataInterface<T,N>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<ExcludeProps<T,k>,U,M,N>
}

export interface Operators<T,U extends string,M,N> extends Execute,dataInterface<T,N>{
    Where:() => Omit<Operators<T,U | "Where",M,N>,U | "Where">,
    Include: ()=>IncludeTable<T,U,StringUnit,N>
    // OrderBy: null,
    // GroupBy: null
    //TODO: implement ^ stuff
}


interface Table<T,U extends string,M extends string,N> extends Operators<T,U,M,N>,PrepareSelect<T,U,M,N>, IncludeSelect<T,U,M,N>{}

/******************************************************************************* 
 * @description Include
 * @Note:Could it be more dynamic? Probably, but creating a generic include almost seemed impossible. Hence this approach was chosen. Refactoring may be needed 
*******************************************************************************/
interface IncludeTable<T,U extends string,M extends string,N>{
    SelectStudents: <k extends keyof Students>(...Props:k[])=> Omit<Operators<T,U | "Include",M,Students>,U | "Include">
    SelectEducations: <k extends keyof Educations>(...Props:k[])=> Omit<Operators<T,U | "Include",M,Educations>,U | "Include">
    SelectGrades: <k extends keyof Grades>(...Props:k[])=> Omit<Operators<T,U | "Include",M,Grades>,U | "Include">
    SelectGradeStates: <k extends keyof GradeStats>(...Props:k[])=> Omit<Operators<T,U | "Include",M,GradeStats>,U | "Include">
}
//{RandomGrades,ListEducations,ListGrades,ListStudents}
let IncludeTable = function<T,U extends string,M extends string,N>(dbData: tableData<T,any>, filterData: FilterPair):IncludeTable<T,U,M,N> & dataInterface<T,U>{
    return{
        dataDB: dbData,
        FilterData : filterData,
        SelectStudents: function<k extends keyof Students>(...Props:k[]){
            return IncludeLambda<T,U,M,Students,k>({fst:dbData.fst, snd:ListStudents},Props,filterData)
        },
        SelectEducations: function<k extends keyof Educations>(...Props:k[]){
            return IncludeLambda<T,U,M,Educations,k>({fst:dbData.fst, snd:ListEducations},Props,filterData)
        },
        SelectGrades: function<k extends keyof Grades>(...Props:k[]){
            return IncludeLambda<T,U,M,Grades,k>({fst:dbData.fst, snd:RandomGrades},Props,filterData)
        },
        SelectGradeStates: function<k extends keyof GradeStats>(...Props:k[]){
            return IncludeLambda<T,U,M,GradeStats,k>({fst:dbData.fst, snd:ListGrades},Props,filterData)
        }
    }

}
let IncludeLambda = function<T,U extends string,M extends string,N,k>(newData:tableData<T,N>,Props:k[],fData:FilterPair) : Omit<Operators<T,U | "Include",M,N>,U | "Include">{
    Props.map(x=> {fData.snd.push(String(x))})
    return Table<T,U | "Include",M,N>(newData,fData)
}

/******************************************************************************* 
    * @ListLambda
    * Note: trying to use Fun, but I'm not going to do Fun in Fun
*******************************************************************************/
let GetRows = function<X>(dataDB:List<X>,FilterData : string[],maxColumns: number) : List<Row<Unit>>{
    return map_table<X,Unit>(dataDB,Fun<X,Row<Unit>>((obj:X)=>{
        //the lambda turns obj into json-format, otherwicse a problem occurs  
        let jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))))
        let newBody : Column<Unit>[] = []
        Object.getOwnPropertyNames(obj).map(y =>{
                let count = 0
                FilterData.map(x=> { 
                    //loops through all objects and looks if it is selected with another loop
                    //Foreign key can be selected, but will not be shown just like normal SQL
                    if(String(x) == String(y) && count < maxColumns){  
                        newBody.push(Column(String(x), jObject[y] == "[object Object]" ? "Ref("+String(x)+")" : jObject[y]))
                    }
                    count++;
                })
                console.log(count)
        })
        return Row(newBody)
    }))
}
/******************************************************************************* 
 * @Table
*******************************************************************************/
//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//M is the T of list2 (that is the include)
//N is the U of list2 (that is the include)
export let Table = function<T,U extends string,M extends string,N>(dbData: tableData<T,N>, filterData: FilterPair) : Table<T,U,M,N> {
    return {
        dataDB: dbData,
        FilterData : filterData,

        
        Select: function<k extends keyof T>(...Props:k[]) : Operators<ExcludeProps<T,k>,U,M,N>{
            Props.map(x=> {this.FilterData.fst.push(String(x))})
            return Table(dbData,filterData)
        },
        Include:function(){
            return IncludeTable<T,U,M,N>(this.dataDB,this.FilterData)
        },
        Where:function(): Omit<Operators<T,U | "Where",M,N>,U | "Where">{
            return Table<T,U | "Where",M,N>(this.dataDB,filterData)
        },
        Commit: function(this) { //this is to get the list
            //return the result of map_table in datatype "Query result"
            return QueryResult(GetRows<T>(this.dataDB.fst,filterData.fst,filterData.fst.length))
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
    legacy code
    //interfaces to have mulitple returns types, as Typescript otherwise don't allow it...
type StudentsReturn<T,U extends string> =  <k extends keyof Students>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type GradesReturn<T,U extends string> =  <k extends keyof Grades>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type GradeStatsReturn<T,U extends string> =  <k extends keyof GradeStats>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type EducationsReturn<T,U extends string> =  <k extends keyof Educations>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type combineReturnTypes<T,U extends string> = StudentsReturn<T,U> | GradesReturn<T,U> | GradeStatsReturn<T,U> | EducationsReturn<T,U> 


type IncludeReturnTypes = "Students" |"GradeStats" | "Grades" | "Educations"  

// type tmp1 = "barcode" | "mqtt"
function get<S extends IncludeReturnTypes>(s: S):  
    S extends "Students" ? { IncludeStudents: <T,U extends string>(l: TableData<T,any>) => StudentsReturn<T,U> } :
    S extends "Grades" ? { IncludeGrades: <T,U extends string>() => GradesReturn<T,U> } : 
    S extends "GradeStats" ? { IncludeGradeStats:<T,U extends string>() => GradeStatsReturn<T,U> } : 
    { IncludeEducation:<T,U extends string> () => EducationsReturn<T,U> }
function get(s: IncludeReturnTypes): { IncludeStudents: <T,U extends string> (l: TableData<T,any>) => StudentsReturn<T,U> } |  { IncludeGrades: <T,U extends string> () => GradesReturn<T,U> } | { IncludeGradeStats: <T,U extends string> () => GradeStatsReturn<T,U> } |  { IncludeEducation: <T,U extends string> () => EducationsReturn<T,U> }{
    return s === "Students" ?
        { IncludeStudents: <T,U extends string>(l: TableData<T,any>) => (
             <k extends keyof Students>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => 
                { return IncludeLambda<T,U,Students,k>(ListStudents,null!,i) }
        } : s === "Grades" ?
        { IncludeGrades: <T,U extends string>() => (<k extends keyof Grades>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => (
                (IncludeLambda<T,U,Grades,k>(RandomGrades,null!,i))
            ))
        } : s === "GradeStats" ?
        { IncludeGradeStats:<T,U extends string> () => (<k extends keyof GradeStats>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => (
               IncludeLambda<T,U,GradeStats,k>(ListGrades,null!,i)))
        } : 
        { IncludeEducation:<T,U extends string>() => (<k extends keyof Educations>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => (
                 IncludeLambda<T,U,Educations,k>(ListEducations,null!,i)))
        }
}
// let IncludeLambda = function<T,U extends string,N,a>(incData:List<N>,tableData:tableData<T,any>,Props:a[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">{
//     let fData : string[] = []
//     Props.map(x=> {fData.push(String(x))})
//     let newList : List<Unit> = Table<N,U,StringUnit,Unit>({fst: incData,snd:null!},fData).Commit().data
//     return Table<T,U | "Include",StringUnit,Unit>({fst: tableData.fst,snd:newList},fData)
// }
get("Students").IncludeStudents()("Grades","Id").Commit().printRows()  // OK
// get("GradeStats").pan()     // OK

*/