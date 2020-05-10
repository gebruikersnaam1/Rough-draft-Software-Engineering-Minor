"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
// import {PrintUsedData} from "./utils/PrintLog"
var query1 = Database_1.dbTables.tableStudents().Select("Id").Select("Firstname", "Lastname", "Grades").Commit();
// query1.printRows()
console.log(query1.countRows());
// console.log(query1)
//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
