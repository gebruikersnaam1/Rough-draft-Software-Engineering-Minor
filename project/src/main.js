"use strict";
exports.__esModule = true;
var Database_1 = require("./ORM/Database");
var PrintLog_1 = require("./utils/PrintLog");
var query1 = Database_1.dbTables.tableStudents().Select("Firstname", "Id");
//kind of a mess to read, but helps me to see the data being show in the console.log
PrintLog_1.PrintUsedData();
