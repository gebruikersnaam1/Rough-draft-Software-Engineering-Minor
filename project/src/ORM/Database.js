"use strict";
exports.__esModule = true;
var Table_1 = require("./Table");
var data_1 = require("../data/data"); //import model
var dbEnv = function () {
    return {
        Students: function () {
            return Table_1.TableInit(data_1.ListStudents);
        },
        GradeStats: function () {
            return Table_1.TableInit(data_1.ListGrades);
        },
        Grades: function () {
            return Table_1.TableInit(data_1.RandomGrades);
        },
        Educations: function () {
            return Table_1.TableInit(data_1.ListEducations);
        }
    };
};
exports.dbTables = dbEnv();
