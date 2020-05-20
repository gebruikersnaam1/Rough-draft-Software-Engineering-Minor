"use strict";
exports.__esModule = true;
var Table_1 = require("./Table");
var data_1 = require("../data/data"); //import model
//{RandomGrades,ListEducations,ListGrades,ListStudents}
exports.IncludeTable = function (dbData, filterData, tbOperations) {
    return {
        dataDB: dbData,
        FilterData: filterData,
        tbOperations: tbOperations,
        SelectStudents: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return IncludeLambda({ fst: dbData.fst, snd: data_1.ListStudents }, Props, filterData, tbOperations);
        },
        SelectEducations: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return IncludeLambda({ fst: dbData.fst, snd: data_1.ListEducations }, Props, filterData, tbOperations);
        },
        SelectGrades: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return IncludeLambda({ fst: dbData.fst, snd: data_1.RandomGrades }, Props, filterData, tbOperations);
        },
        SelectGradeStates: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return IncludeLambda({ fst: dbData.fst, snd: data_1.ListGrades }, Props, filterData, tbOperations);
        }
    };
};
var IncludeLambda = function (newData, Props, fData, tb) {
    Props.map(function (x) { fData.snd.push(String(x)); });
    return Table_1.Table(newData, fData, tb);
};
