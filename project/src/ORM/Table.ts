import {map_table,Fun,Unit, tableData,FilterPair,List, PlusList, FilterPairUnit,Empty,Cons, ConvertStringsToNumber} from  "../utils/utils"//import tool
import {Column, Row,QueryResult, Grades,Educations, GradeStats,Students} from "../data/models"
import {RandomGrades,ListEducations,ListGrades,ListStudents} from  "../data/data"//import model

//note tools: keyof [], [X in Exclude<keyof I, 'k' | 'l'>] : I[X], Omit<I,X>

/******************************************************************************* 
 * @Interfaces
*******************************************************************************/

//base interface that contens tables
export interface dataInterface<T,N>{
    dataDB: tableData<T,N>
    FilterData: FilterPair
    tbOperations: OperationType
}

//base execute something
export interface Execute{
    Commit: () => QueryResult<Unit>
}

//the user can only select something before commit
export interface PrepareSelect<T,U extends string ,N> extends dataInterface<T,N>{
    Select: <k extends keyof T>(...Props:k[])=> Operators<T,U,N>
}

export interface Operators<T,U extends string,N> extends Execute,dataInterface<T,N>{
    Where:<k extends keyof T, z extends keyof WhereClauses>(x:k, operator:z,value:string) => Omit<Operators<T,U | "Where",N>,U | "Where">,
    Include: ()=>IncludeTable<T,U,N>
    OrderBy: <k extends keyof T>(x:k, option:OrderByOptions) => Omit<Operators<T,U | "OrderBy",N>,U | "OrderBy">,
    // GroupBy: null
    //TODO: implement ^ stuff
}


interface Table<T,U extends string,N> extends Operators<T,U,N>,PrepareSelect<T,U,N>{}

/******************************************************************************* 
 * @description Include - that works as a UNION ALL
 * @Note:Could it be more dynamic? Probably, but creating a generic include almost seemed impossible. Hence this approach was chosen. Refactoring may be needed  
 *******************************************************************************/
interface IncludeTable<T,U extends string,N>{
    SelectStudents: <k extends keyof Students>(...Props:k[])=> Omit<Operators<T,U | "Include",Students>,U | "Include">
    SelectEducations: <k extends keyof Educations>(...Props:k[])=> Omit<Operators<T,U | "Include",Educations>,U | "Include">
    SelectGrades: <k extends keyof Grades>(...Props:k[])=> Omit<Operators<T,U | "Include",Grades>,U | "Include">
    SelectGradeStates: <k extends keyof GradeStats>(...Props:k[])=> Omit<Operators<T,U | "Include",GradeStats>,U | "Include">
}
//{RandomGrades,ListEducations,ListGrades,ListStudents}
let IncludeTable = function<T,U extends string,N>(dbData: tableData<T,any>, filterData: FilterPair, tbOperations: OperationType):IncludeTable<T,U,N> & dataInterface<T,U>{
    return{
        dataDB: dbData,
        FilterData : filterData,
        tbOperations: tbOperations,

        SelectStudents: function<k extends keyof Students>(...Props:k[]){
            return IncludeLambda<T,U,Students,k>({fst:dbData.fst, snd:ListStudents},Props,filterData,tbOperations)
        },
        SelectEducations: function<k extends keyof Educations>(...Props:k[]){
            return IncludeLambda<T,U,Educations,k>({fst:dbData.fst, snd:ListEducations},Props,filterData,tbOperations)
        },
        SelectGrades: function<k extends keyof Grades>(...Props:k[]){
            return IncludeLambda<T,U,Grades,k>({fst:dbData.fst, snd:RandomGrades},Props,filterData,tbOperations)
        },
        SelectGradeStates: function<k extends keyof GradeStats>(...Props:k[]){
            return IncludeLambda<T,U,GradeStats,k>({fst:dbData.fst, snd:ListGrades},Props,filterData,tbOperations)
        }
    }

}
let IncludeLambda = function<T,U extends string,N,k>(newData:tableData<T,N>,Props:k[],fData:FilterPair, tb: OperationType) : Omit<Operators<T,U | "Include",N>,U | "Include">{
    Props.map(x=> {fData.snd.push(String(x))})
    return Table<T,U | "Include",N>(newData,fData, tb)
}

/******************************************************************************* 
    * @Operations like where, oderby and groupby
    * Note: trying to use Fun, but I'm not going to do Fun in Fun
*******************************************************************************/

interface OperationType{
    Where: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    GroupBy: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    Orderby: (i:List<Row<Unit>>)=> List<Row<Unit>>
}

let OperationExecute = function(w: (i:List<Row<Unit>>)=> List<Row<Unit>>,g: (i:List<Row<Unit>>)=> List<Row<Unit>>, o: (i:List<Row<Unit>>)=> List<Row<Unit>>) : OperationType{
    return{
        Where:w,
        GroupBy:g,
        Orderby:o
    }
}

let OperationUnit = function() : OperationType{
    let unit = (i:List<Row<Unit>>)=> i
    return OperationExecute(unit,unit,unit)
}

/******************************************************************************* 
    * @Whereclause
    * Note: trying to use Fun, but I'm not going to do Fun in Fun
*******************************************************************************/
interface WhereClauses{
    Equal: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    GreaterThan: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    LessThan: (i:List<Row<Unit>>)=> List<Row<Unit>>,
    NotEqual: (i:List<Row<Unit>>)=> List<Row<Unit>>,
}
let WhereClauses = function(columnName:string,value:string) : WhereClauses{
    return{
        Equal:(list:List<Row<Unit>>) => {
              return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                    if(x == value){
                        return true
                    }else{
                        return false
                    }
            }))
        },
        GreaterThan:(list:List<Row<Unit>>) => {
            return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                let i = ConvertStringsToNumber(x,value)
                if(i[0] != NaN && i[1] != NaN){
                    if(i[0] > i[1]){ //needed a nested if...why???????
                        return true 
                    }else{
                        return false
                    }
                }
                else if(x > value){
                    return true
                }else{
                    return false
                }
            }))
        },
        LessThan:(list:List<Row<Unit>>) => {
            return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                let i = ConvertStringsToNumber(x,value)
                if(i[0] != NaN && i[1] != NaN){
                    if(i[0] < i[1]){ //needed a nested if...why???????
                        return true 
                    }else{
                        return false
                    }
                }
                else if(x < value){
                    return true
                }
                return false
            }))
        },
        NotEqual:(list:List<Row<Unit>>) => {
            return WhereLambda(list,columnName,Fun<string,boolean>(x=>{
                if(x != value){
                    return true
                }else{
                    return false
                }
            }))
        }
    }
}

let WhereLambda =  function(i:List<Row<Unit>>,columnName:string,targetvalue:Fun<string,boolean>) : List<Row<Unit>>{
    if(i.kind == "Cons"){
        let found = 0
        let row : List<Row<Unit>> = null!
        i.head.columns.map(x=>
            {
                if(x.name == columnName){
                    if(targetvalue.f(String(x.value))){
                        found++;
                        row = Cons(i.head,WhereLambda(i.tail,columnName,targetvalue)) 
                    }
                }
            })
        if(found != 0){
            return row 
        }
        return WhereLambda(i.tail,columnName,targetvalue)
    }else{
        return Empty()
    }
}
/******************************************************************************* 
    * @OrderByclause
    * Note: 
*******************************************************************************/
// interface OrderByClauses{
//     ASC: (i:List<Row<Unit>>)=> List<Row<Unit>>,
//     DESC: (i:List<Row<Unit>>)=> List<Row<Unit>>
// }
// let OrderByClauses = function(list:List<Row<Unit>>){
//     if(list.kind == "Cons"){}
// }
type OrderByOptions = "ASC" | "DESC"

interface OrderByclause{
    Orderby:(list:List<Row<Unit>>) => List<Row<Unit>>
}

let OrderByclause = function(columnName:string,  o: OrderByOptions) : OrderByclause{
    return{
        Orderby:(list:List<Row<Unit>>) : List<Row<Unit>> =>{
            return OrderList(list,columnName,o)
        }
    }
}

let OrderList = function(list:List<Row<Unit>>, columnName:string, o: OrderByOptions): List<Row<Unit>>{
    if(list.kind == "Cons"){
        if(list.tail.kind == "Cons"){
            let x = OrderRows(list.head,list.tail.head,columnName,o)
            // console.log("Start")
            // console.log(x[0])
            // console.log(x[1])

            return Cons(x[0],Cons(x[1],OrderList(list.tail.tail,columnName,o)))
        }
        return Cons(list.head,OrderList(list.tail,columnName,o)) //this wil return empty
    }
    return Empty()
}

//boolean is to say: Hé the values needed to switched!
let OrderRows = function(value1: Row<Unit>, value2: Row<Unit>, columnName: string, o: OrderByOptions) : [Row<Unit>, Row<Unit>]{
    let v1 = GetColumnValue(value1, columnName)
    let v2 = GetColumnValue(value2, columnName)
    let vN = ConvertStringsToNumber(v1,v2)
    if(o == "DESC"){
        if(vN[0] != NaN && vN[0] == NaN && vN[0] < vN[1]){
            return [value2,value1]
        }
        if(v1 < v2){   
            return [value2,value1]
        }
    }else{
        if(vN[0] != NaN && vN[0] != NaN && vN[0] > vN[1]){
            return [value2,value1]
        }
        if(v1 > v2){   
            return [value2,value1]
        }
    }
    return [value1,value2]
}


let GetColumnValue =  function(r: Row<Unit>,columnName:string) : string{
    let x : string = ""
    r.columns.map(y =>{
        if(y.name == columnName){
            x = String(y.value)
        }
    })
    return x
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
                    if(String(x) == String(y) && count < maxColumns){ //to ensure that list 2 is bigger than list 1
                        newBody.push(Column(String(x), jObject[y] == "[object Object]" ? "Ref("+String(x)+")" : jObject[y]))
                    }
                    count++;
                })
        })
        //if second filter is smaller it creates empty columns to match the column amount
        if(FilterData.length < maxColumns){
            for(let i = FilterData.length; i <= (maxColumns-1); i++){
                newBody.push(Column("Empty",""))
            }
        }
        return Row(newBody)
    }))
}
/******************************************************************************* 
 * @Table
*******************************************************************************/
//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//M is the T of list2 (that is the include)

let Table = function<T,U extends string,N>(dbData: tableData<T,N>, filterData: FilterPair, opType:OperationType) : Table<T,U,N> {
    return {
        dataDB: dbData,
        FilterData : filterData,
        tbOperations: opType,
        
        Select: function<k extends keyof T>(...Props:k[]) : Operators<T,U,N>{
            Props.map(x=> {this.FilterData.fst.push(String(x))})
            return Table(dbData,filterData,this.tbOperations)
        },
        Include:function(){
            return IncludeTable<T,U,N>(this.dataDB,this.FilterData,this.tbOperations)
        },
        Where:function<k extends keyof T, z extends keyof WhereClauses>(columnT:k, operator:z,value:string): Omit<Operators<T,U | "Where",N>,U | "Where">{
            let column = String(columnT)
            let w = WhereClauses(column,value)
            switch(String(operator)){
                case 'Equal':
                    return Table<T,U | "Where",N>(this.dataDB,filterData,{...this.tbOperations, Where: w.Equal  })
                case 'GreaterThan':
                    return Table<T,U | "Where",N>(this.dataDB,filterData,{...this.tbOperations, Where: w.GreaterThan  })
                case 'LessThan':
                    return Table<T,U | "Where",N>(this.dataDB,filterData,{...this.tbOperations, Where: w.LessThan  })
                case 'NotEqual':
                    return Table<T,U | "Where",N>(this.dataDB,filterData,{...this.tbOperations, Where: w.NotEqual  })
            }
            return Table<T,U | "Where",N>(this.dataDB,filterData,this.tbOperations)
        },
        OrderBy: function <k extends keyof T>(x:k, option:OrderByOptions) :Omit<Operators<T,U | "OrderBy",N>,U | "OrderBy">{
            return Table<T,U | "OrderBy",N>(this.dataDB,filterData,{...this.tbOperations, Orderby: OrderByclause(String(x),option).Orderby  })
        },
        Commit: function(this) { //this is to get the list
           let t = this.tbOperations //to shorten the name
           //return the result of map_table in datatype "Query result"
           return QueryResult(
                t.Orderby(
                    t.GroupBy(
                        t.Where( 
                            PlusList<Row<Unit>>(
                                    (GetRows<T>(this.dataDB.fst,filterData.fst,filterData.fst.length)),
                                    (GetRows<N>(this.dataDB.snd,filterData.snd,filterData.fst.length))
                            )
                        )
                    )
                )
            )
        }
    }
}

/******************************************************************************* 
 * @InitTable
*******************************************************************************/
export let TableInit = function<T,U extends string,N>(l:List<T>) : Table<T,U,N>{
    return Table(tableData(l,Empty()),FilterPairUnit,OperationUnit())
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