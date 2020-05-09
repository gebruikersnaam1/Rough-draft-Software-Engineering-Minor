"use strict";
exports.__esModule = true;
//notes: how to create the table SELECT
//interface x = {y,z,i}
//possible selections = interface
//SELECTED {}
//FOR EACH SELECT remove possible selection
//i.e. SELECTED("y") == possible selection {z,i}
// T = {y,z, i} | U = { } | 
// T = {z,i } | U = { y } |
// z = T - U
// y = Props of type T(k) + U
exports.Table = function (tableData) {
    return {
        tableData: tableData,
        Select: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return exports.Table(tableData);
        }
    };
};
