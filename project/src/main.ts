import {dbTables} from './ORM/Database'
import {PrintUsedData} from "./utils/PrintLog"

let query1 = dbTables.tableStudents().Select("Id").Commit()
console.log(query1)


//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
