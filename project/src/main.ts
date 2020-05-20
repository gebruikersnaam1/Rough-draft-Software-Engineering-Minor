import {dbTables} from './ORM/Database'

/*
    @description: 
        - Select = Select the wanted columns
        - Include = works as an Union all, but the selected amount of columns set the amount of columns for the include table
                    this may result in empty columns or that not all columns are shown of the second list
        - Where = This is an union all if tableName doesn't exist in the selected columns than nothing will be shown. 
    @Note: 
        - one can only select once include and select (in one instance)
        - Table students has 2 'foreign keys', but one cannot do an INNER JOIN
        - one has to start with select
*/

//just showing the SELECT
// let query1 = dbTables.Students().Select("Id","Firstname","Grades").Commit()
// query1.printRows()

//showing the SELECT and Union
let query2 = dbTables.Students().Select("Id","Firstname","Prefix","Gender").Where("Id","GreaterThan","20").Include().SelectGradeStates("Course_Name","Teacher").Commit()
query2.printRows()

// let query3 = dbTables.Grades().Select("Id").Where("O")
                