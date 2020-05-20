"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
/*
    @description:
        - Select = Select the wanted columns
        - Include = works as an Union all, but the selected amount of columns set the amount of columns for the include table
                    this may result in empty columns or that not all columns are shown of the second list
        - Where = This is an union all if tableName doesn't exist in the selected columns than nothing will be shown.
        - OrderBy = Works, but mainly tested on numbers
    @Note:
        - one can only select once include and select (in one instance)
        - Table students has 2 'foreign keys', but one cannot do an INNER JOIN
        - one has to start with select
        - Maybe in the future things will be made more dynamic, but for now this is what it is
*/
var PrintHeader = function (title) {
    console.log("NEW: " + title);
    console.log("\n****************************\n");
};
// PrintHeader("Showing Complete")
// let query7 = dbTables.Students().Select("Id","Firstname","Grades").
//                 GroupBy("Prefix").Where("Id","GreaterThan","12")
//                     .OrderBy("Id","DESC").Include()
//                         .SelectEducations("Name","Study_Duration").Commit()
// query7.printRows()
// PrintHeader("Showing SELECT")
// let query1 = dbTables.Students().Select("Id","Firstname","Grades").Commit()
// query1.printRows()
// PrintHeader("Showing WHERE")
// let query2 = dbTables.Students().Select("Id","Firstname","Grades").Where("Id","Equal","20").Commit()
// query2.printRows()
// PrintHeader("Showing Include")
// let query3 = dbTables.Students().Select("Id","Firstname","Grades").Include().SelectEducations("Name").Commit()
// query3.printRows()
PrintHeader("Showing OrderBy");
var query5 = Database_1.dbTables.Students().Select("Id", "Firstname", "Gender").OrderBy("Id", "DESC").Commit();
query5.printRows();
// PrintHeader("Showing GroupBy")
// let query6 = dbTables.Students().Select("Id","Firstname","Grades").GroupBy("Prefix").Commit()
// query6.printRows()
