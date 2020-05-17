import {dbTables} from './ORM/Database'

// import {PrintUsedData} from "./utils/PrintLog"

let query1 = dbTables.tableStudents().Select("Id","Firstname","Grades").Commit()
let query2 = dbTables.tableStudents().Select("Id","Firstname","Grades").Include("Grades",((x)=>{
    let z = x.tableCources().Select("Id")
    return null!
}))

// query1.printRows()
query1.printRows()

// console.log(query1)


//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
