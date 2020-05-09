"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
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
            return utils_1.map_table(tableData, utils_1.Fun(function (obj) {
                //T = {} somewhere between 0 and 1000
                //U = {} somewhere between 0 and 1000
                //i.e. T = {x,y,z} | U = {y,z}
                //obj = {x,y,z}
                // if(obj.kind)
                // let tmp1 = 
                // const copy = {} as Pick<T, obj>;
                return null;
            }));
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
