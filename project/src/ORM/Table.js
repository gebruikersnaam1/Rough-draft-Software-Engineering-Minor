"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
var models_1 = require("../data/models");
//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//K is to say the includes possible are X,Y and Z
exports.Table = function (tableData, filterData) {
    return {
        tableData: tableData,
        FilterData: filterData,
        //if interface fails and select get selected twice, keyof ensures that i.e. column1 can still not be selected twice
        Select: function () {
            var _this = this;
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            Props.map(function (x) { _this.FilterData.push(String(x)); });
            //Pick<T,K>
            return exports.Table(tableData, filterData);
        },
        Include: function (tableName) {
            var o = function () {
                var Props = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    Props[_i] = arguments[_i];
                }
                return Props;
            };
            return exports.Table(tableData, filterData);
        },
        Where: function () {
            return exports.Table(tableData, filterData);
        },
        Commit: function () {
            var _this = this;
            //return the result of map_table in datatype "Query result"
            return models_1.QueryResult(utils_1.map_table(tableData.snd, utils_1.Fun(function (obj) {
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
    (...Props:Pick<x,x>[])
*/ 
