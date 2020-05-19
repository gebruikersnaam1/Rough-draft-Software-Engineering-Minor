"use strict";
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
        Where: function (x) {
            return Table(this.dataDB, filterData, this.tbOperations);
        },
        Commit: function () {
            //return the result of map_table in datatype "Query result"
            return models_1.QueryResult(utils_1.PlusList((GetRows(this.dataDB.fst, filterData.fst, filterData.fst.length)), (GetRows(this.dataDB.snd, filterData.snd, filterData.fst.length))));
        }
    };
};
/*******************************************************************************
 * @InitTable
*******************************************************************************/
exports.TableInit = function (l) {
    return Table(utils_1.tableData(l, utils_1.Empty()), utils_1.FilterPairUnit, OperationUnit());
};
/*
 *notes
*/
/*
    na de include wil ik een: Table<T,U,M> returnen en iets dat alleen input van dat Include table toelaat ()
    Dus wat ik ook terug geeft moet in het begin Table bevatten + key
    Moet een optie bevatten voor x.("Y")
    Moet terug geven Table + nieuwe waarde

    <a (van nieuwe table)> (...Props:a[]) =>{
        t = Table()

    }
    legacy code
    //interfaces to have mulitple returns types, as Typescript otherwise don't allow it...
type StudentsReturn<T,U extends string> =  <k extends keyof Students>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type GradesReturn<T,U extends string> =  <k extends keyof Grades>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type GradeStatsReturn<T,U extends string> =  <k extends keyof GradeStats>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type EducationsReturn<T,U extends string> =  <k extends keyof Educations>(...i:k[]) => Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">
type combineReturnTypes<T,U extends string> = StudentsReturn<T,U> | GradesReturn<T,U> | GradeStatsReturn<T,U> | EducationsReturn<T,U>


type IncludeReturnTypes = "Students" |"GradeStats" | "Grades" | "Educations"

// type tmp1 = "barcode" | "mqtt"
function get<S extends IncludeReturnTypes>(s: S):
    S extends "Students" ? { IncludeStudents: <T,U extends string>(l: TableData<T,any>) => StudentsReturn<T,U> } :
    S extends "Grades" ? { IncludeGrades: <T,U extends string>() => GradesReturn<T,U> } :
    S extends "GradeStats" ? { IncludeGradeStats:<T,U extends string>() => GradeStatsReturn<T,U> } :
    { IncludeEducation:<T,U extends string> () => EducationsReturn<T,U> }
function get(s: IncludeReturnTypes): { IncludeStudents: <T,U extends string> (l: TableData<T,any>) => StudentsReturn<T,U> } |  { IncludeGrades: <T,U extends string> () => GradesReturn<T,U> } | { IncludeGradeStats: <T,U extends string> () => GradeStatsReturn<T,U> } |  { IncludeEducation: <T,U extends string> () => EducationsReturn<T,U> }{
    return s === "Students" ?
        { IncludeStudents: <T,U extends string>(l: TableData<T,any>) => (
             <k extends keyof Students>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> =>
                { return IncludeLambda<T,U,Students,k>(ListStudents,null!,i) }
        } : s === "Grades" ?
        { IncludeGrades: <T,U extends string>() => (<k extends keyof Grades>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => (
                (IncludeLambda<T,U,Grades,k>(RandomGrades,null!,i))
            ))
        } : s === "GradeStats" ?
        { IncludeGradeStats:<T,U extends string> () => (<k extends keyof GradeStats>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => (
               IncludeLambda<T,U,GradeStats,k>(ListGrades,null!,i)))
        } :
        { IncludeEducation:<T,U extends string>() => (<k extends keyof Educations>(...i:k[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include"> => (
                 IncludeLambda<T,U,Educations,k>(ListEducations,null!,i)))
        }
}
// let IncludeLambda = function<T,U extends string,N,a>(incData:List<N>,tableData:tableData<T,any>,Props:a[]) : Omit<Operators<T,U | "Include",StringUnit,Unit>,U | "Include">{
//     let fData : string[] = []
//     Props.map(x=> {fData.push(String(x))})
//     let newList : List<Unit> = Table<N,U,StringUnit,Unit>({fst: incData,snd:null!},fData).Commit().data
//     return Table<T,U | "Include",StringUnit,Unit>({fst: tableData.fst,snd:newList},fData)
// }
get("Students").IncludeStudents()("Grades","Id").Commit().printRows()  // OK
// get("GradeStats").pan()     // OK

*/ 
