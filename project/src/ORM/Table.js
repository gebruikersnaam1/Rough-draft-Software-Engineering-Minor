"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
// type T = {x,y,z}
// type U = {}
// let customArray = List<T>({x,y,z},{x,y,z})
// Select(x)
// Type T = {y,z}
// Type U = { x }
// can select twice
// Select(y)
// Type T = {y,z}
// Type U = { x,y }
//let customArray2 = List<U>
//for i in customArray: 
//      //I = {x,y,z}
//      let z = FilterToNewType(i) //z contains {x,y}
//      add z to customArray 2
// let customArray2 = List<T>({x,y},{x,y})
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
        Commit: function () {
            var _this = this;
            return utils_1.map_table(tableData, utils_1.Fun(function (obj) {
                var jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))));
                var newBody = [];
                _this.FilterData.map(function (x) {
                    Object.getOwnPropertyNames(obj).map(function (y) {
                        if (String(x) == String(y)) {
                            newBody.push(jObject[y]);
                        }
                    });
                });
                return newBody;
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
