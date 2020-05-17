import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit,tableData} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    Students: () => PrepareSelect<Students,StringUnit,Omit<dbEnv,"Students">> 
    Grades: () => PrepareSelect<GradeStats,StringUnit,Omit<dbEnv,"GradeStats">> 
    Cources: () => PrepareSelect<Grades,StringUnit,Omit<dbEnv,"Grades">>
    Educations: () => PrepareSelect<Educations,StringUnit,Omit<dbEnv,"Educations">>
}

let dbEnv = () : dbEnv => {
    return{
        Students: function(){  
            return Table(tableData("Students",ListStudents),[]) 
        },
        Grades: function(){ 
            return Table(tableData("GradeStats",ListGrades),[]) 
        },
        Cources: function() { 
            return Table(tableData("Grades",RandomGrades),[]) 
        },
        Educations: function() { 
            return Table(tableData("Educations",ListEducations),[]) 
        }
    }
}

export let dbTables = dbEnv()