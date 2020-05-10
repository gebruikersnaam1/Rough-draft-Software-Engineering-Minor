import {dbTables} from './ORM/Database'
import {List} from './utils/utils'
import {Row} from './data/models'

// import {PrintUsedData} from "./utils/PrintLog"

let QueryRun = function<T>(l : List<Row<T>>){
    if(l.kind == "Cons"){
        console.log(l.head.getValues)
        QueryRun(l.tail)
    }
}

let query1 = dbTables.tableStudents().Select("Id").Select("Firstname","Lastname","Grades").Commit()

QueryRun(query1)

// console.log(query1)


//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
