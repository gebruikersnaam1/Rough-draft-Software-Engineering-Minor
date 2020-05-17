import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations, Models} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit,tableData, Unit, Empty} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    Students: () => PrepareSelect<Students,StringUnit,Omit<Models,"Students">,Unit> 
    GradeStats: () => PrepareSelect<GradeStats,StringUnit,Omit<Models,"GradeStats">,Unit> 
    Grades: () => PrepareSelect<Grades,StringUnit,Omit<Models,"Grades">,Unit>
    Educations: () => PrepareSelect<Educations,StringUnit,Omit<Models,"Educations">,Unit>
}

let dbEnv = () : dbEnv => {
    return{
        Students: function(){  
            return Table(tableData(ListStudents,Empty()),[]) 
        },
        GradeStats: function(){ 
            return Table(tableData(ListGrades,Empty()),[]) 
        },
        Grades: function() { 
            return Table(tableData(RandomGrades,Empty()),[]) 
        },
        Educations: function() { 
            return Table(tableData(ListEducations,Empty()),[]) 
        }
    }
}

export let dbTables = dbEnv()