import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model

/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    tableStudents: () => PrepareSelect<Students> 
    tableGrades: () => PrepareSelect<GradeStats> 
    tableCources: () => PrepareSelect<Grades> 
    tableEducations: () => PrepareSelect<Educations> 
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: () : PrepareSelect<Students> => { return Table<Students>(ListStudents,[]) },
        tableGrades: () : PrepareSelect<GradeStats> => { return Table<GradeStats>(ListGrades,[]) },
        tableCources: () : PrepareSelect<Grades> => { return Table<Grades>(RandomGrades,[]) },
        tableEducations: () : PrepareSelect<Educations> => { return Table<Educations>(ListEducations,[]) },
    }
}

export let dbTables = dbEnv()