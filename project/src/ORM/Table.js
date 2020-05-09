"use strict";
exports.__esModule = true;
//interface x = {y,z,i}
//possible selections = interface
//SELECTED {}
//FOR EACH SELECT remove possible selection
//i.e. SELECTED("y") == possible selection {z,i}
// y,z, i | { }
// z,i | { y }
exports.Table = function (tableData) {
    return {
        tableData: tableData,
        Select: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            return null;
        }
    };
};
