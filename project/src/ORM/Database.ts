import {Table} from './Table'
import {Students} from  "../data/models"//import model
import {ListStudents} from  "../data/data"//import model

/*
    * database environment
    * get all the tables of this environment with one 'connect'
*/
export type dbEnv = {
    tableStudents: () => Table<Students> 
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: () : Table<Students> => { return Table<Students>(ListStudents) }
    }
}

export let dbTables = dbEnv()