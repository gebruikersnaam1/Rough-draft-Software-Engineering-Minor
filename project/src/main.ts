import {dbTables} from './ORM/Database'
import {PrintUsedData} from "./utils/PrintLog"

let query1 = dbTables.tableStudents().Select("Firstname","Id")


//kind of a mess to read, but helps me to see the data being show in the console.log
PrintUsedData()
