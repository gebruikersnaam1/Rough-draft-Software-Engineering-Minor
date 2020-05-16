"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import tool
var models_1 = require("../data/models");
exports.Table = function (tableData, filterData) {
    return {
        tableData: tableData,
        FilterData: filterData,
        //if interface fails and select get selected twice, keyof ensures that i.e. column1 can still not be selected twice
        Select: function () {
            var _this = this;
            var Props = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Props[_i] = arguments[_i];
            }
            Props.map(function (x) { _this.FilterData.push(String(x)); });
            //Pick<T,K>
            return exports.Table(tableData, filterData);
        },
        Include: function () {
            return exports.Table(tableData, filterData);
        },
        Where: function () {
            return exports.Table(tableData, filterData);
        },
        Commit: function () {
            var _this = this;
            //return the result of map_table in datatype "Query result"
            return models_1.QueryResult(utils_1.map_table(tableData.snd, utils_1.Fun(function (obj) {
                //the lambda turns obj into json-format, otherwise a problem occurs  
                var jObject = JSON.parse(JSON.stringify((Object.assign({}, obj))));
                var newBody = [];
                _this.FilterData.map(function (x) {
                    Object.getOwnPropertyNames(obj).map(function (y) {
                        if (String(x) == String(y)) {
                            newBody.push(models_1.Column(String(x), jObject[y] == "[object Object]" ? null : jObject[y]));
                        }
                    });
                    // let z : Column<U>[] = []
                    // newBody.push(z)
                });
                return models_1.Row(newBody);
            })));
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
/*
    Idea: If implementing something like this is possible, then a custom lambda needs to be developed for each table.
    SELECT = [Object] == nul can be a way to do Include
    
    Table gets a Fun that recursive goes to the list, if attribute is selected then get value?
    Type U removes the attributes that are not selected?
    Type U is a real object, not a JSON file.
    Then type column or row can be changed. Either row contains the value of U or column contains the value T?
    Column x.name and x.age are not type U right? Yeah
    so, column needs to be removed and contains the value of U
    <U>(queryresult:U) => Fun<definedType(i.e. student), U>(
        let tmp1 = List<definedTypte() //with content
        let tmp2 =  <definedType() => {}
        let tmp3 = map_option(tmp2,tmp3)
        instance : definedType => {
                let newI : U = {}
                for(let i in instance){
                    if (i in queryresult){
                       newI.Name = instance.Name
                    }
                }
        return tmp3;
            }
        }
    )
*/ 
