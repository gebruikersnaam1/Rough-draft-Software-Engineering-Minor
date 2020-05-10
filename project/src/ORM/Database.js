"use strict";
exports.__esModule = true;
var Table_1 = require("./Table");
var data_1 = require("../data/data"); //import model
var dbEnv = function () {
    return {
        tableStudents: function () { return Table_1.Table(data_1.ListStudents, []); },
        tableGrades: function () { return Table_1.Table(data_1.ListGrades, []); },
        tableCources: function () { return Table_1.Table(data_1.RandomGrades, []); },
        tableEducations: function () { return Table_1.Table(data_1.ListEducations, []); }
    };
};
exports.dbTables = dbEnv();
