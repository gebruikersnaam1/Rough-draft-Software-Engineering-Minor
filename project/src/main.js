"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
var query1 = Database_1.dbTables.tableStudents().Select();
console.log(query1);
//kind of a mess to read, but helps me to see the data being show in the console.log
// PrintUsedData()
