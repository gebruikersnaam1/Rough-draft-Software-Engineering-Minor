import {map_table,Fun,Unit, tableData,FilterPair,List, PlusList, FilterPairUnit,Empty} from  "../utils/utils"//import tool
import {Column, Row,QueryResult, Grades,Educations, GradeStats,Students} from "../data/models"
import {RandomGrades,ListEducations,ListGrades,ListStudents} from  "../data/data"//import model
import {OperationType, WhereClauses, OrderByOptions, OrderByclause, GroupByClauses, OperationUnit} from './TableOperations'
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
    GroupBy: <k extends keyof T>(x:k) => Omit<Operators<T,U | "GroupBy",N>,U | "GroupBy">
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
        GroupBy: function <k extends keyof T>(x:k) : Omit<Operators<T,U | "GroupBy",N>,U | "GroupBy">{
            return Table<T,U | "GroupBy",N>(this.dataDB,filterData,{...this.tbOperations, GroupBy: GroupByClauses(String(x)).GroupBy  })
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