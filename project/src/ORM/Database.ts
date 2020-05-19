import {PrepareSelect,Table} from './Table'
import {Students,GradeStats,Grades,Educations} from  "../data/models"//import model
import {ListStudents,ListGrades,RandomGrades,ListEducations} from  "../data/data"//import model
import {StringUnit,tableData, Unit, Empty,FilterPairUnit} from '../utils/utils'


/*
    * database environment
    * get all the tables of this environment with one connect'
*/

export type dbEnv = { 
    Students: () => PrepareSelect<Students,StringUnit,StringUnit,Unit> 
    GradeStats: () => PrepareSelect<GradeStats,StringUnit,StringUnit,Unit> 
    Grades: () => PrepareSelect<Grades,StringUnit,StringUnit,Unit>
    Educations: () => PrepareSelect<Educations,StringUnit,StringUnit,Unit>
}

let dbEnv = () : dbEnv => {
    return{
        Students: function(){  
            return Table(tableData(ListStudents,Empty()),FilterPairUnit) 
        },
        GradeStats: function(){ 
            return Table(tableData(ListGrades,Empty()),FilterPairUnit) 
        },
        Grades: function() { 
            return Table(tableData(RandomGrades,Empty()),FilterPairUnit) 
        },
        Educations: function() { 
            return Table(tableData(ListEducations,Empty()),FilterPairUnit) 
        }
    }
}

export let dbTables = dbEnv()