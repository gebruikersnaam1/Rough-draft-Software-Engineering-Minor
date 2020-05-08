"use strict";
/*
    * the types/interfaces of the models that are going to be used during this project
*/
exports.__esModule = true;
/*
    * the constructors for the models
*/
exports.Students = function (id, firstname, prefix, lastname, education, Grades) { return ({
    Id: id,
    Firstname: firstname,
    LastName: lastname,
    Prefix: prefix,
    Educations: education,
    Grades: Grades
}); };
