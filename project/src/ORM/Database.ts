import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit,tableData} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    tableStudents: () => PrepareSelect<Students,StringUnit> 
    tableGrades: () => PrepareSelect<GradeStats,StringUnit> 
    tableCources: () => PrepareSelect<Grades,StringUnit> 
    tableEducations: () => PrepareSelect<Educations,StringUnit> 
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: () : PrepareSelect<Students,StringUnit> => { 
            return Table<Students,StringUnit>(tableData("Students",ListStudents),[]) 
        },
        tableGrades: () : PrepareSelect<GradeStats,StringUnit> => { 
            return Table<GradeStats,StringUnit>(tableData("GradeStats",ListGrades),[]) 
        },
        tableCources: () : PrepareSelect<Grades,StringUnit> => { 
            return Table<Grades,StringUnit>(tableData("Grades",RandomGrades),[]) 
        },
        tableEducations: () : PrepareSelect<Educations,StringUnit> => { 
            return Table<Educations,StringUnit>(tableData("Educations",ListEducations),[]) 
        },
    }
}

export let dbTables = dbEnv()