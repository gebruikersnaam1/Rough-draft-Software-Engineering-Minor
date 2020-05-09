"use strict";
exports.__esModule = true;
exports.map_TableRow = function (row) {
    return null;
};
//l = [a,b,c] of type T
//    [d] of type U
// 
exports.map_table = function (x) {
    if (x.kind == "Cons") {
        for (var i in x.head) {
        }
    }
    // var z = x.kind == "Cons" ? Cons(map_TableRow(x.head),Empty()) : Empty()
    return null;
};
exports.Table = function (tableData) {
    return {
        tableData: tableData,
        Select: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return exports.Table(tableData);
        },
        Commit: function () {
            return exports.map_table(tableData);
        }
    };
};
/*
 *notes
*/
//how to create the table SELECT for Props
//interface x = {y,z,i}
//possible selections = interface
//SELECTED {}
//FOR EACH SELECT remove possible selection
//i.e. SELECTED("y") == possible selection {z,i}
// T = {y,z, i} | U = { } | 
// T = {z,i } | U = { y } |
// z = T - U
// y = Props of type T(k) + U
