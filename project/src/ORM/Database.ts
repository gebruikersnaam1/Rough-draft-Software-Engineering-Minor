import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations,Models} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit,tableData} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    tableStudents: () => PrepareSelect<Students,StringUnit,Omit<Models,"Students">> 
    tableGrades: () => PrepareSelect<GradeStats,StringUnit,Omit<Models,"GradeStats">> 
    tableCources: () => PrepareSelect<Grades,StringUnit,Omit<Models,"Grades">>
    tableEducations: () => PrepareSelect<Educations,StringUnit,Omit<Models,"Educations">>
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: function(){  
            return Table(tableData("Students",ListStudents),[]) 
        },
        tableGrades: function(){ 
            return Table(tableData("GradeStats",ListGrades),[]) 
        },
        tableCources: function() { 
            return Table(tableData("Grades",RandomGrades),[]) 
        },
        tableEducations: function() { 
            return Table(tableData("Educations",ListEducations),[]) 
        }
    }
}

export let dbTables = dbEnv()