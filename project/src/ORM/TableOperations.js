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
exports.OrderByclause = function (columnName, o) {
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
