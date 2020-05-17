"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
var models_1 = require("../data/models");
var data_1 = require("../data/data");
//function to get data for the Union had to be in this file.
var GetTableData = function (name) {
    switch (name) {
        case 'Students':
            return data_1.ListStudents;
        case 'GradeStats':
            return data_1.ListGrades;
        case 'Grades':
            return data_1.RandomGrades;
        case 'Educations':
            return data_1.ListEducations;
    }
    return data_1.ListEducations;
};
//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//M is to say the includes possible are X,Y and Z
exports.Table = function (tableData, filterData) {
    return {
        tableData: tableData,
        FilterData: filterData,
        Select: function () {
            var _this = this;
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            Props.map(function (x) { _this.FilterData.push(String(x)); });
            return exports.Table(tableData, filterData);
        },
        Include: function (tableName) {
            var o = function () {
                var Props = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    Props[_i] = arguments[_i];
                }
                var newList = GetTableData(String(tableName));
                var fData = [];
                Props.map(function (x) { fData.push(String(x)); });
                var a = exports.Table({ fst: newList, snd: null }, fData).Commit().data;
                return exports.Table({ fst: tableData.fst, snd: a }, fData);
            };
            return exports.Table(tableData, filterData);
        },
        Where: function () {
            return exports.Table(tableData, filterData);
        },
        Commit: function () {
            var _this = this;
            //return the result of map_table in datatype "Query result"
            return models_1.QueryResult(utils_1.map_table(tableData.fst, utils_1.Fun(function (obj) {
                //the lambda turns obj into json-format, otherwise a problem occurs  
                var jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))));
                var newBody = [];
                Object.getOwnPropertyNames(obj).map(function (y) {
                    _this.FilterData.map(function (x) {
                        //loops through all objects and looks if it is selected with another loop
                        //Foreign key can be selected, but will not be shown just like normal SQL
                        if (String(x) == String(y)) {
                            newBody.push(models_1.Column(String(x), jObject[y] == "[object Object]" ? "Ref(" + String(x) + ")" : jObject[y]));
                        }
                    });
                });
                return models_1.Row(newBody);
            })));
        }
    };
};
/*
 *notes
*/
/*
    na de include wil ik een: Table<T,U,M> returnen en iets dat alleen input van dat Include table toelaat ()
    Dus wat ik ook terug geeft moet in het begin Table bevatten + key
    Moet een optie bevatten voor x.("Y")
    Moet terug geven Table + nieuwe waarde

    <a (van nieuwe table)> (...Props:a[]) =>{
        t = Table()

    }
*/ 
