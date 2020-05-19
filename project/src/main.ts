import {dbTables} from './ORM/Database'

// import {PrintUsedData} from "./utils/PrintLog"

// let query1 = dbTables.Students().Select("Id","Firstname","Grades").Commit()
let query2 = dbTables.Students().Select("Id","Firstname","Grades").Include().SelectGradeStates("Course_Name","Teacher").dataDB.snd
console.log(query2)

// query1.printRows()
// query1.printRows()

// console.log(query1)


//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
