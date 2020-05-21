"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import list
exports.Gender = function (x) { return (x == "Man" ? "Man" : x == "Women" ? "Women" : "Other"); };
/*
    * the constructors for the models
*/
exports.Students = function (id, firstname, prefix, lastname, grades, gender, education) { return ({
    Id: id,
    Firstname: firstname,
    Lastname: lastname,
    Prefix: prefix,
    Gender: gender,
    Educations: education,
    Grades: grades
}); };
exports.Educations = function (name, study) { return ({
    Name: name,
    Study_Duration: study
}); };
exports.Grades = function (id, grade, courseName) { return ({
    Id: id,
    Grade: grade,
    Course_Name: courseName
}); };
exports.GradeStats = function (courseName, averageStats, teacher) { return ({
    Course_Name: courseName,
    Average_Grade: averageStats,
    Teacher: teacher
}); };
exports.Column = function (name, value) { return ({
    name: name,
    value: value
}); };
// | {
//     rows: Row<T>[]
// }
exports.Row = function (columns) { return ({
    columns: columns
}); };
exports.QueryResult = function (list) { return ({
    data: list,
    countColumns: function () {
        var z = 0;
        if (list.kind == "Cons") {
            list.head.columns.map(function (_) { return z += 1; });
        }
        return z;
    },
    countRows: function () {
        var i = function (l) {
            if (l.kind == "Cons") {
                return 1 + i(l.tail);
            }
            return 0;
        };
        return i(list);
    },
    printRows: function () {
        if (list.kind == "Cons") {
            console.log(list.head.columns.map(function (x) { return String(x.name); }));
            utils_1.PrintQueryValues(list);
        }
    }
}); };
