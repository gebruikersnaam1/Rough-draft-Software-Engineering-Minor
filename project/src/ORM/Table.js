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
var data_1 = require("../data/data"); //import model
//{RandomGrades,ListEducations,ListGrades,ListStudents}
var IncludeTable = function (dbData, filterData, tbOperations) {
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
    return Table(newData, fData, tb);
};
var OperationExecute = function (w, g, o) {
    return {
        Where: w,
        GroupBy: g,
        Orderby: o
    };
};
var OperationUnit = function () {
    var unit = function (i) { return i; };
    return OperationExecute(unit, unit, unit);
};
var GroupByClauses = function (columnName) {
    return {
        GroupBy: function (list) { return (GroupByTool(list, columnName)); }
    };
};
var GroupByTool = function (l, columnName) {
    if (l.kind == "Cons") {
        var searchVal = utils_1.GetColumnValue(l.head, columnName);
        var result = FilterOut(searchVal, l.tail, columnName);
        return utils_1.Cons(l.head, GroupByTool(result, columnName));
    }
    else {
        return utils_1.Empty();
    }
};
var FilterOut = function (searchVal, l, columnName) {
    if (l.kind == "Cons") {
        var compareVal = utils_1.GetColumnValue(l.head, columnName);
        if (compareVal == searchVal) {
            return FilterOut(searchVal, l.tail, columnName);
        }
        else {
            return utils_1.Cons(l.head, FilterOut(searchVal, l.tail, columnName));
        }
    }
    else {
        return utils_1.Empty();
    }
};
var WhereClauses = function (columnName, value) {
    return {
        Equal: function (list) {
            return WhereLambda(list, columnName, utils_1.Fun(function (x) {
                if (x == value) {
                    return true;
                }
                else {
                    return false;
                }
            }));
        },
        GreaterThan: function (list) {
            return WhereLambda(list, columnName, utils_1.Fun(function (x) {
                var i = utils_1.ConvertStringsToNumber(x, value);
                if (i[0] != NaN && i[1] != NaN) {
                    if (i[0] > i[1]) { //needed a nested if...why???????
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (x > value) {
                    return true;
                }
                else {
                    return false;
                }
            }));
        },
        LessThan: function (list) {
            return WhereLambda(list, columnName, utils_1.Fun(function (x) {
                var i = utils_1.ConvertStringsToNumber(x, value);
                if (i[0] != NaN && i[1] != NaN) {
                    if (i[0] < i[1]) { //needed a nested if...why???????
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (x < value) {
                    return true;
                }
                return false;
            }));
        },
        NotEqual: function (list) {
            return WhereLambda(list, columnName, utils_1.Fun(function (x) {
                if (x != value) {
                    return true;
                }
                else {
                    return false;
                }
            }));
        }
    };
};
var WhereLambda = function (i, columnName, targetvalue) {
    if (i.kind == "Cons") {
        var found_1 = 0;
        var row_1 = null;
        i.head.columns.map(function (x) {
            if (x.name == columnName) {
                if (targetvalue.f(String(x.value))) {
                    found_1++;
                    row_1 = utils_1.Cons(i.head, WhereLambda(i.tail, columnName, targetvalue));
                }
            }
        });
        if (found_1 != 0) {
            return row_1;
        }
        return WhereLambda(i.tail, columnName, targetvalue);
    }
    else {
        return utils_1.Empty();
    }
};
var OrderByclause = function (columnName, o) {
    return {
        Orderby: function (list) {
            return OrderList(list, columnName, o);
        }
    };
};
var OrderList = function (list, columnName, o) {
    if (list.kind == "Cons" && list.tail.kind == "Cons") {
        var tmp1 = OrderListTool(list, list.head, columnName, o);
        return utils_1.Cons(tmp1[1], OrderList(tmp1[0], columnName, o));
    }
    else if (list.kind == "Cons") {
        return utils_1.Cons(list.head, utils_1.Empty());
    }
    else {
        return utils_1.Empty();
    }
};
var OrderListTool = function (list, value, columnName, o) {
    if (list.kind == "Cons" && list.tail.kind == "Empty") {
        return [utils_1.Empty(), value];
    }
    else if (list.kind == "Cons" && list.tail.kind == "Cons") {
        var x = OrderRows(list.tail.head, value, columnName, o);
        var tmp1 = OrderListTool(list.tail, x[0], columnName, o);
        return [utils_1.Cons(x[1], tmp1[0]), tmp1[1]];
    }
    else {
        return [utils_1.Empty(), value];
    }
};
//boolean is to say: Hé the values needed to switched!
var OrderRows = function (value1, value2, columnName, o) {
    var v1 = utils_1.GetColumnValue(value1, columnName);
    var v2 = utils_1.GetColumnValue(value2, columnName);
    var vN = utils_1.ConvertStringsToNumber(v1, v2);
    if (o == "DESC") {
        if (vN[0] != NaN && vN[1] != NaN && vN[0] < vN[1]) {
            return [value2, value1];
        }
        else if (vN[0] != NaN && vN[1] != NaN) { //if vN[0] is not bigger than vN[1] return value1,value2 order instead of trusting sting
            return [value1, value2];
        }
        if (v1 < v2) {
            return [value2, value1];
        }
    }
    else {
        if (vN[0] != NaN && vN[1] != NaN && vN[0] > vN[1]) {
            return [value2, value1];
        }
        if (v1 > v2) {
            return [value2, value1];
        }
    }
    return [value1, value2];
};
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
var Table = function (dbData, filterData, opType) {
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
            return Table(dbData, filterData, this.tbOperations);
        },
        Include: function () {
            return IncludeTable(this.dataDB, this.FilterData, this.tbOperations);
        },
        Where: function (columnT, operator, value) {
            var column = String(columnT);
            var w = WhereClauses(column, value);
            switch (String(operator)) {
                case 'Equal':
                    return Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.Equal }));
                case 'GreaterThan':
                    return Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.GreaterThan }));
                case 'LessThan':
                    return Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.LessThan }));
                case 'NotEqual':
                    return Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Where: w.NotEqual }));
            }
            return Table(this.dataDB, filterData, this.tbOperations);
        },
        OrderBy: function (x, option) {
            return Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { Orderby: OrderByclause(String(x), option).Orderby }));
        },
        GroupBy: function (x) {
            return Table(this.dataDB, filterData, __assign(__assign({}, this.tbOperations), { GroupBy: GroupByClauses(String(x)).GroupBy }));
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
    return Table(utils_1.tableData(l, utils_1.Empty()), utils_1.FilterPairUnit, OperationUnit());
};
