"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
// import {PrintUsedData} from "./utils/PrintLog"
var query1 = Database_1.dbTables.tableStudents().Select("Prefix").Select("Firstname", "Lastname").Commit();
if (query1.kind == "Cons") { //just to stop the 'error'
    console.log(query1.head);
}
// console.log(query1)
//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
