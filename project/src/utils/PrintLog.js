"use strict";
exports.__esModule = true;
var data_1 = require("../data/data");
//kind of a mess to read, but helps me to see the data being show in the console.log
var PrintStudentGrades = function (l) {
    if (l.kind == "Cons") {
        console.log("\t Grade entry ID: #" + l.head.Id + " = course: " + l.head.Course_Name + " & Grade " + l.head.Grade);
        PrintStudentGrades(l.tail);
    }
};
var PrintStudents = function (l) {
    if (l.kind == "Cons") {
        console.log("Student: #" + l.head.Id + " " + l.head.Firstname + " " + l.head.Prefix + " " + l.head.LastName);
        console.log("Gender: " + l.head.Gender.gender);
        // console.log()
        console.log("Education: " + l.head.Educations.Name + " with a duration: " + l.head.Educations.Study_Duration);
        console.log("Grades of student:");
        PrintStudentGrades(l.head.Grades);
        console.log("----------------------------------------------------\n");
        PrintStudents(l.tail);
    }
};
var PrintGrades = function (l) {
    if (l.kind == "Cons") {
        console.log(l.head.Course_Name + " is given by " + l.head.Teacher + " the average grade for this course is " + l.head.Average_Grade);
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
