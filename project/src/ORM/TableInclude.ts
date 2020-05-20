import {tableData,FilterPair} from  "../utils/utils"//import tool
import { Grades,Educations, GradeStats,Students} from "../data/models"
import {OperationType} from './TableOperations'
import {Operators, Table, dataInterface} from './Table'
import {RandomGrades,ListEducations,ListGrades,ListStudents} from  "../data/data"//import model

/******************************************************************************* 
 * @description Include - that works as a UNION ALL
 * @Note:Could it be more dynamic? Probably, but creating a generic include almost seemed impossible. Hence this approach was chosen. Refactoring may be needed  
 *******************************************************************************/
export interface IncludeTable<T,U extends string,N>{
    SelectStudents: <k extends keyof Students>(...Props:k[])=> Omit<Operators<T,U | "Include",Students>,U | "Include">
    SelectEducations: <k extends keyof Educations>(...Props:k[])=> Omit<Operators<T,U | "Include",Educations>,U | "Include">
    SelectGrades: <k extends keyof Grades>(...Props:k[])=> Omit<Operators<T,U | "Include",Grades>,U | "Include">
    SelectGradeStates: <k extends keyof GradeStats>(...Props:k[])=> Omit<Operators<T,U | "Include",GradeStats>,U | "Include">
}
//{RandomGrades,ListEducations,ListGrades,ListStudents}
export let IncludeTable = function<T,U extends string,N>(dbData: tableData<T,any>, filterData: FilterPair, tbOperations: OperationType):IncludeTable<T,U,N> & dataInterface<T,U>{
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
