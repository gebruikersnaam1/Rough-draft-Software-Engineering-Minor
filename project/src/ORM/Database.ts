import {Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {Unit} from '../utils/utils'

/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    tableStudents: () => Table<Students,Unit> 
    tableGrades: () => Table<GradeStats,Unit> 
    tableCources: () => Table<Grades,Unit> 
    tableEducations: () => Table<Educations,Unit> 
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: () : Table<Students,Unit> => { return Table<Students,Unit>(ListStudents,[]) },
        tableGrades: () : Table<GradeStats,Unit> => { return Table<GradeStats,Unit>(ListGrades,[]) },
        tableCources: () : Table<Grades,Unit> => { return Table<Grades,Unit>(RandomGrades,[]) },
        tableEducations: () : Table<Educations,Unit> => { return Table<Educations,Unit>(ListEducations,[]) },
    }
}

export let dbTables = dbEnv()