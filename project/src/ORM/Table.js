"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
var models_1 = require("../data/models");
var TableInclude_1 = require("./TableInclude");
var TableOperations_1 = require("./TableOperations");
/*******************************************************************************
    * @ListLambda
    * Note: trying to use Fun, but I'm not going to do Fun in Fun
*******************************************************************************/
var GetRows = function (dataDB, FilterData, maxColumns) {
    return utils_1.map_table(dataDB, utils_1.Fun(function (obj) {
        //the lambda turns obj into json-format, otherwicse a problem occurs  
        var jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))));
        var newBody = [];
        Object.getOwnPropertyNames(obj).map(function (y) {
            var count = 0;
            FilterData.map(function (x) {
                //loops through all objects and looks if it is selected with another loop
                //Foreign key can be selected, but will not be shown just like normal SQL
                if (String(x) == String(y) && count < maxColumns) { //to ensure that list 2 is bigger than list 1
                    newBody.push(models_1.Column(String(x), jObject[y] == "[object Object]" ? "Ref(" + String(x) + ")" : jObject[y]));
                }
                count++;
            });
        });
        //if second filter is smaller it creates empty columns to match the column amount
        if (FilterData.length < maxColumns) {
            for (var i = FilterData.length; i <= (maxColumns - 1); i++) {
                newBody.push(models_1.Column("Empty", ""));
            }
        }
        return models_1.Row(newBody);
    }));
};
/*******************************************************************************
 * @Table
*******************************************************************************/
//T contains information about the List, also to make Select("Id").("Id") is not possible, if that would happen for an unexpected reason
//U contains information which Operators is chosen
//M is the T of list2 (that is the include)
exports.Table = function (dbData, filterData, opType) {
    return {
        dataDB: dbData,
        FilterData: filterData,
        tbOperations: opType,
        Select: function () {
            var _this = this;
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            Props.map(function (x) { _this.FilterData.fst.push(String(x)); });
            return exports.Table(dbData, filterData, this.tbOperations);
        },
        Include: function () {
            return TableInclude_1.IncludeTable(this.dataDB, this.FilterData, this.tbOperations);
        },
        Where: function (columnT, operator, value) {
            var column = String(columnT);
            var w = TableOperations_1.WhereClauses(column, value);
            switch (String(operator)) {
                case 'Equal':
                    return exports.Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.Equal }));
                case 'GreaterThan':
                    return exports.Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.GreaterThan }));
                case 'LessThan':
                    return exports.Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.LessThan }));
                case 'NotEqual':
                    return exports.Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.NotEqual }));
            }
            return exports.Table(this.dataDB, filterData, this.tbOperations);
        },
        OrderBy: function (x, option) {
            return exports.Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Orderby: TableOperations_1.OrderByclause(String(x), option).Orderby }));
        },
        GroupBy: function (x) {
            return exports.Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { GroupBy: TableOperations_1.GroupByClauses(String(x)).GroupBy }));
        },
        Commit: function () {
            var t = this.tbOperations; //to shorten the name
            //return the result of map_table in datatype "Query result"
            return models_1.QueryResult(t.Orderby(t.GroupBy(t.Where(utils_1.PlusList((GetRows(this.dataDB.fst, filterData.fst, filterData.fst.length)), (GetRows(this.dataDB.snd, filterData.snd, filterData.fst.length)))))));
        }
    };
};
/*******************************************************************************
 * @InitTable
*******************************************************************************/
exports.TableInit = function (l) {
    return exports.Table(utils_1.tableData(l, utils_1.Empty()), utils_1.FilterPairUnit, TableOperations_1.OperationUnit());
};
