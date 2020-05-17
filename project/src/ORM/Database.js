"use strict";
exports.__esModule = true;
var Table_1 = require("./Table");
var data_1 = require("../data/data"); //import model
var utils_1 = require("../utils/utils");
var dbEnv = function () {
    return {
        Students: function () {
            return Table_1.Table(utils_1.tableData(data_1.ListStudents, null), []);
        },
        Grades: function () {
            return Table_1.Table(utils_1.tableData(data_1.ListGrades, null), []);
        },
        Cources: function () {
            return Table_1.Table(utils_1.tableData(data_1.RandomGrades, null), []);
        },
        Educations: function () {
            return Table_1.Table(utils_1.tableData(data_1.ListEducations, null), []);
        }
    };
};
exports.dbTables = dbEnv();
