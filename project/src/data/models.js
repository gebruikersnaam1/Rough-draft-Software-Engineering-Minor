"use strict";
exports.__esModule = true;
exports.Gender = function (x) { return (x == "Man" ? { gender: "Man" } : x == "Women" ? { gender: "Women" } : { gender: "Other" }); };
/*
    * the constructors for the models
*/
exports.Students = function (id, firstname, prefix, lastname, grades, gender, education) { return ({
    Id: id,
    Firstname: firstname,
    LastName: lastname,
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
