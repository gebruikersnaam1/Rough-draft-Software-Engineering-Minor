"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
exports.Table = function (tableData, filterData) {
    return {
        tableData: tableData,
        FilterData: filterData,
        Select: function () {
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            var i = [Props, this.FilterData];
            var a = [];
            Props.map(function (x) {
                console.log(x);
            });
            // console.log(a)
            return exports.Table(tableData, null);
        },
        Commit: function () {
            var _this = this;
            return utils_1.map_table(tableData, utils_1.Fun(function (obj) {
                //T = {} somewhere between 0 and 1000
                //U = {} somewhere between 0 and 1000
                //i.e. T = {x,y,z} | U = {y,z}
                //obj = {x,y,z}
                var i = _this.FilterData;
                var z = Object.getOwnPropertyNames(obj);
                var x = JSON.parse(JSON.stringify((Object.assign({}, obj))));
                var a = { "Id": 0 };
                // console.log(i)
                for (var i_1 = 0; i_1 < z.length; i_1++) {
                    //https://stackoverflow.com/questions/28150967/typescript-cloning-object/42758108
                    //https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
                    // console.log(obj)
                    if (x[z[i_1]] in a) {
                        // console.log(x[z[i]])
                    }
                }
                // [P in keyof T] : T[P] extends Condition ? P : never
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
