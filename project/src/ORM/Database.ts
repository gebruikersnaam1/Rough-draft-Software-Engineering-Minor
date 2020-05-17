import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit,tableData, Unit, Empty} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = {
    Students: () => PrepareSelect<Students,StringUnit,Omit<dbEnv,"Students">,Unit> 
    Grades: () => PrepareSelect<GradeStats,StringUnit,Omit<dbEnv,"GradeStats">,Unit> 
    Cources: () => PrepareSelect<Grades,StringUnit,Omit<dbEnv,"Grades">,Unit>
    Educations: () => PrepareSelect<Educations,StringUnit,Omit<dbEnv,"Educations">,Unit>
}

let dbEnv = () : dbEnv => {
    return{
        Students: function(){  
            return Table(tableData(ListStudents,Empty()),[]) 
        },
        Grades: function(){ 
            return Table(tableData(ListGrades,Empty()),[]) 
        },
        Cources: function() { 
            return Table(tableData(RandomGrades,Empty()),[]) 
        },
        Educations: function() { 
            return Table(tableData(ListEducations,Empty()),[]) 
        }
    }
}

export let dbTables = dbEnv()