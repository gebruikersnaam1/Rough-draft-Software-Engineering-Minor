import {dbTables} from './ORM/Database'
// import {PrintUsedData} from "./utils/PrintLog"

let query1 = dbTables.tableStudents().Select("Prefix").Select("Firstname","Lastname").Commit()
if(query1.kind == "Cons"){ //just to stop the 'error'
    console.log(query1.head)
}
// console.log(query1)


//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
