import {PrepareSelect,TableInit} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit, Unit} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = { 
    Students: () => PrepareSelect<Students,StringUnit,Unit> 
    GradeStats: () => PrepareSelect<GradeStats,StringUnit,Unit> 
    Grades: () => PrepareSelect<Grades,StringUnit,Unit>
    Educations: () => PrepareSelect<Educations,StringUnit,Unit>
}

let dbEnv = () : dbEnv => {
    return{
        Students: function(){  
            return TableInit(ListStudents)
        },
        GradeStats: function(){ 
            return TableInit(ListGrades) 
        },
        Grades: function() { 
            return TableInit(RandomGrades)
        },
        Educations: function() { 
            return TableInit(ListEducations) 
        }
    }
}

export let dbTables = dbEnv()