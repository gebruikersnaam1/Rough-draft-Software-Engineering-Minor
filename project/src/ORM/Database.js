"use strict";
exports.__esModule = true;
var Table_1 = require("./Table");
var data_1 = require("../data/data"); //import model
var utils_1 = require("../utils/utils");
var dbEnv = function () {
    return {
        Students: function () {
            return Table_1.Table(utils_1.tableData(data_1.ListStudents, utils_1.Empty()), utils_1.FilterPairUnit);
        },
        GradeStats: function () {
            return Table_1.Table(utils_1.tableData(data_1.ListGrades, utils_1.Empty()), utils_1.FilterPairUnit);
        },
        Grades: function () {
            return Table_1.Table(utils_1.tableData(data_1.RandomGrades, utils_1.Empty()), utils_1.FilterPairUnit);
        },
        Educations: function () {
            return Table_1.Table(utils_1.tableData(data_1.ListEducations, utils_1.Empty()), utils_1.FilterPairUnit);
        }
    };
};
exports.dbTables = dbEnv();
