import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {Unit} from '../utils/utils'

/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    tableStudents: () => PrepareSelect<Students,Unit> 
    tableGrades: () => PrepareSelect<GradeStats,Unit> 
    tableCources: () => PrepareSelect<Grades,Unit> 
    tableEducations: () => PrepareSelect<Educations,Unit> 
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: () : PrepareSelect<Students,Unit> => { return Table<Students,Unit>(ListStudents,[]) },
        tableGrades: () : PrepareSelect<GradeStats,Unit> => { return Table<GradeStats,Unit>(ListGrades,[]) },
        tableCources: () : PrepareSelect<Grades,Unit> => { return Table<Grades,Unit>(RandomGrades,[]) },
        tableEducations: () : PrepareSelect<Educations,Unit> => { return Table<Educations,Unit>(ListEducations,[]) },
    }
}

export let dbTables = dbEnv()