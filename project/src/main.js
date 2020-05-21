"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
/*
    @description:
        - Select  = contains the columns of the table selected. Are there no columns selected? Then no columns shown.
        - Include = Union needs to be selected and then a table can be chosen by selecting a method that enables that.
                    The method also serves as the select method for that table.
        - Where = The Where statement takes three parameters, the first is the column.
                  The columns available are only from the original table, so not the include, because this works as a UNION ALL.
        - OrderBy = Order by takes one column and orders is DESC or ASC
        - GroupBy = Group by only groups the objects and no extra option like Count or something.
        - Commit  = Commit is the way to execute the query and returns one list.
    @Note:
        - !This is kind of a Union all only no distinct union is allowed and the amount of columns don't have to match
        - Each operator can only be chosen once in one query
        - The original database design thought that Include has a join on option. Reading the project description better and seeing the example this was not the case. Hence, the foreign keys are on use. But maybe for later design
        - If a mode be added than it needs to be added to ‘dbTables’ and ‘Includetables’.
          Except that the code is dynamic enough that is SHOULD work fine with only those adjustments. Also, columns should be changeable.
*/
var PrintHeader = function (title) {
    console.log("NEW: " + title);
    console.log("\n****************************\n");
};
// PrintHeader("Showing Complete")
// let query7 = dbTables.Students().Select("Id","Firstname","Grades").
//                 GroupBy("Prefix","").Where("Id","GreaterThan","12")
//                     .OrderBy("Id","DESC").Include()
//                         .SelectEducations("Name","Study_Duration").Commit()
// query7.printRows()
// PrintHeader("Showing SELECT")
// let query1 = dbTables.Students().Select("Id","Firstname","Grades").Commit()
// query1.printRows()
// PrintHeader("Showing WHERE")
// let query2 = dbTables.Students().Select("Id","Firstname","Grades").Where("Id","GreaterThan","20").Commit()
// query2.printRows()
// PrintHeader("Showing Include")
// let query3 = dbTables.Students().Select("Id","Firstname","Grades").Include().SelectEducations("Name").Commit()
// query3.printRows()
// PrintHeader("Showing OrderBy")
// let query5 = dbTables.Students().Select("Id","Firstname","Gender").OrderBy("Firstname","ASC").Commit()
// query5.printRows()
PrintHeader("Showing GroupBy");
var query6 = Database_1.dbTables.Students().Select("Id", "Firstname", "Prefix").GroupBy("Prefix", "COUNT").Commit();
query6.printRows();
