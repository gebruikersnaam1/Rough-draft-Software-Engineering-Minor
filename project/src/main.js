"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
// import {PrintUsedData} from "./utils/PrintLog"
var QueryRun = function (l) {
    if (l.kind == "Cons") {
        console.log(l.head.getValues);
        QueryRun(l.tail);
    }
};
var query1 = Database_1.dbTables.tableStudents().Select("Id").Select("Firstname", "Lastname", "Grades").Commit();
QueryRun(query1);
// console.log(query1)
//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
