"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
var OperationExecute = function (w, g, o) {
    return {
        Where: w,
        GroupBy: g,
        Orderby: o
    };
};
exports.OperationUnit = function () {
    var unit = function (i) { return i; };
    return OperationExecute(unit, unit, unit);
};
exports.GroupByClauses = function (columnName) {
    return {
        GroupBy: function (list) { return (GroupByTool(list, columnName)); }
    };
};
var GroupByTool = function (l, columnName) {
    if (l.kind == "Cons") {
        var searchVal = utils_1.GetColumnValue(l.head, columnName);
        var result = FilterOut(searchVal, l.tail, columnName);
        //the result contains a list without the search value(l.head), this will be done until no values are left
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
exports.WhereClauses = function (columnName, value) {
    return {
        Equal: function (list) {
            return WhereFun(list, columnName, utils_1.Fun(function (x) {
                if (x == value) {
                    return true;
                }
                else {
                    return false;
                }
            }));
        },
        GreaterThan: function (list) {
            return WhereFun(list, columnName, utils_1.Fun(function (x) {
                var i = utils_1.ConvertStringsToNumber(x, value);
                if (i.fst != NaN && i.snd != NaN) {
                    if (i.fst > i.snd) { //needed a nested if...why???????
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
            return WhereFun(list, columnName, utils_1.Fun(function (x) {
                var i = utils_1.ConvertStringsToNumber(x, value);
                if (i.fst != NaN && i.snd != NaN) {
                    if (i.fst < i.snd) { //needed a nested if...why???????
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
            return WhereFun(list, columnName, utils_1.Fun(function (x) {
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
var WhereFun = function (i, columnName, targetvalue) {
    if (i.kind == "Cons") {
        var found_1 = 0; //this can be seen as a boolean
        var row_1 = null; //the placeholder is null (yes, reusing a var)
        i.head.columns.map(function (x) {
            if (x.name == columnName) {
                if (targetvalue.f(String(x.value))) {
                    found_1++; //so, the value is found you say?
                    row_1 = utils_1.Cons(i.head, WhereFun(i.tail, columnName, targetvalue));
                }
            }
        });
        if (found_1 != 0) {
            return row_1; //if found return value
        }
        return WhereFun(i.tail, columnName, targetvalue); //if not found go to the next item
    }
    else {
        return utils_1.Empty();
    }
};
exports.OrderByclause = function (columnName, o) {
    return {
        Orderby: function (list) {
            return OrderList(list, columnName, o);
        }
    };
};
var OrderList = function (list, columnName, o) {
    if (list.kind == "Cons" && list.tail.kind == "Cons") { //if it has two values to switch
        var tmp1 = OrderListTool(list, list.head, columnName, o); //get the lowest or highest value and a list without that value
        return utils_1.Cons(tmp1[1], OrderList(tmp1[0], columnName, o)); //return the con
    }
    else if (list.kind == "Cons") {
        return utils_1.Cons(list.head, utils_1.Empty()); //only one value left? So, stop sorting
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
        var x = o == "ASC" ? OrderTwoRowsASC(list.tail.head, value, columnName) : OrderTwoRowsDESC(list.tail.head, value, columnName);
        var tmp1 = OrderListTool(list.tail, x.fst, columnName, o);
        return [utils_1.Cons(x.snd, tmp1[0]), tmp1[1]];
    }
    else {
        return [utils_1.Empty(), value];
    }
};
var OrderTwoRowsDESC = function (value1, value2, columnName) {
    var v1 = utils_1.GetColumnValue(value1, columnName);
    var v2 = utils_1.GetColumnValue(value2, columnName);
    var vN = utils_1.ConvertStringsToNumber(v1, v2);
    if (vN.fst != NaN && vN.snd != NaN && vN.fst < vN.snd) {
        return { fst: value2, snd: value1 };
    }
    else if (vN.fst != NaN && vN.snd != NaN) {
        //if vN[0] is not bigger than vN[1] return value1,value2 order instead of trusting string (string i.e. 1,11,9)
        return { fst: value1, snd: value2 };
    }
    if (v1 < v2) {
        return { fst: value2, snd: value1 };
    }
    return { fst: value1, snd: value2 };
};
var OrderTwoRowsASC = function (value1, value2, columnName) {
    var v1 = utils_1.GetColumnValue(value1, columnName);
    var v2 = utils_1.GetColumnValue(value2, columnName);
    var vN = utils_1.ConvertStringsToNumber(v1, v2);
    if (vN.fst != NaN && vN.snd != NaN && vN.fst > vN.snd) {
        return { fst: value2, snd: value1 };
    }
    if (v1 > v2) {
        return { fst: value2, snd: value1 };
    }
    return { fst: value1, snd: value2 };
};
