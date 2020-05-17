"use strict";
exports.__esModule = true;
var Table_1 = require("./Table");
var data_1 = require("../data/data"); //import model
var utils_1 = require("../utils/utils");
var dbEnv = function () {
    return {
        Students: function () {
            return Table_1.Table(utils_1.tableData("Students", data_1.ListStudents), []);
        },
        Grades: function () {
            return Table_1.Table(utils_1.tableData("GradeStats", data_1.ListGrades), []);
        },
        Cources: function () {
            return Table_1.Table(utils_1.tableData("Grades", data_1.RandomGrades), []);
        },
        Educations: function () {
            return Table_1.Table(utils_1.tableData("Educations", data_1.ListEducations), []);
        }
    };
};
exports.dbTables = dbEnv();
