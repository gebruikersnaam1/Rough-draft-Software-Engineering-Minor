"use strict";
exports.__esModule = true;
var data_1 = require("../data/data");
//kind of a mess to read, but helps me to see the data being show in the console.log
var PrintStudents = function (l) {
    if (l.kind == "Cons") {
        console.log("Student: #" + l.head.Id + " " + l.head.Firstname + " " + l.head.Prefix + " " + l.head.LastName);
        console.log("Gender: " + l.head.Gender.gender);
        // console.log()
        console.log(l.head.Educations);
        console.log(l.head.Grades);
        console.log("----------------------------------------------------\n");
        PrintStudents(l.tail);
    }
};
var PrintGrades = function (l) {
    if (l.kind == "Cons") {
        console.log(l.head);
        console.log("\n");
        PrintGrades(l.tail);
    }
};
var printLine = function () { console.log("\n\n**********************************************************\n\n"); };
//to see the data that is being used within this project
exports.PrintUsedData = function () {
    printLine();
    console.log("INIT - Print dummy data in list form\n");
    printLine();
    console.log("List students");
    PrintStudents(data_1.ListStudents);
    printLine();
    console.log("List grades");
    PrintGrades(data_1.ListGrades);
    printLine();
};
