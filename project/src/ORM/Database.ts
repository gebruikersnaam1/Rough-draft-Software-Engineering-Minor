import {Table} from './Table'
import {Students} from  "../data/models"//import model
import {ListStudents} from  "../data/data"//import model
import {Unit} from '../utils/utils'
/*
    * database environment
    * get all the tables of this environment with one connect'
*/

// if(ListStudents.kind == "Cons"){
//     type z = {f:string,z:string,i:number }
//     type i = {f:string,z:string}
//     type result = ExcludeProps<i,z>
// }
export type dbEnv = {
    tableStudents: () => Table<Students,Unit> 
}

let dbEnv = () : dbEnv => {
    return{
        tableStudents: () : Table<Students,Unit> => { return Table<Students,Unit>(ListStudents,[]) }
    }
}

export let dbTables = dbEnv()