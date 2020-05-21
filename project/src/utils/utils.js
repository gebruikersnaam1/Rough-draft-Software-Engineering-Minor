"use strict";
exports.__esModule = true;
exports.Cons = function (head, tail) { return ({
    kind: "Cons",
    head: head,
    tail: tail
}); };
exports.Empty = function () { return ({
    kind: "Empty"
}); };
exports.PlusList = function (list1, list2) {
    return list1.kind == "Cons" ? exports.Cons(list1.head, exports.PlusList(list1.tail, list2)) : list2;
};
var then = function (f, g) {
    return exports.Fun(function (x) { return g.f(f.f(x)); });
};
var repeatUntil = function (f, predict) {
    var g = function (x) {
        if (predict.f(x)) {
            return exports.Identity().f(x);
        }
        else {
            return f.then(repeatUntil(f, predict)).f(x);
        }
    };
    return exports.Fun(g);
};
var repeat = function (f, n) {
    if (n <= 0) {
        return exports.Identity();
    }
    else {
        return f.then(repeat(f, (n - 1)));
    }
};
exports.Identity = function () { return exports.Fun(function (x) { return x; }); };
exports.Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then(this, g);
        },
        repeat: function () {
            var _this = this;
            return exports.Fun(function (n) { return repeat(_this, n); });
        },
        repeatUntil: function () {
            var _this = this;
            return exports.Fun(function (p) { return repeatUntil(_this, p); });
        }
    };
};
/*******************************************
   * join
*******************************************/
/*******************************************
   * map
*******************************************/
exports.map_table = function (l, f) {
    return l.kind == "Cons" ? exports.Cons(f.f(l.head), exports.map_table(l.tail, f)) : exports.Empty();
};
exports.tableData = function (dbData, newData) { return ({ fst: dbData, snd: newData }); };
exports.FilterPair = function (tabledata, includeData) { return ({ fst: tabledata, snd: includeData }); };
exports.FilterPairUnit = exports.FilterPair([], []);
exports.PrintQueryValues = function (l) {
    if (l.kind == "Cons") {
        console.log(l.head.columns.map(function (x) { return String(x.value); }));
        exports.PrintQueryValues(l.tail);
    }
};
exports.ConvertArrayStringToNumber = function (stringArray) {
    var tmp1 = [];
    stringArray.forEach(function (e) {
        tmp1.push(Number(e));
    });
    return tmp1;
};
exports.ConvertStringsToNumber = function (x, v) {
    return { fst: Number(x), snd: Number(v) };
};
exports.GetColumnValue = function (r, columnName) {
    var x = "";
    r.columns.map(function (y) {
        if (y.name == columnName) {
            x = String(y.value);
        }
    });
    return x;
};
//only + maybe added other functions later on
exports.CalculateNumbers = function (array, operator) {
    var tmp1 = 0;
    array.forEach(function (e) {
        if (operator == "+") {
            tmp1 += Number(e);
        }
    });
    return tmp1;
};
exports.GetLowestValue = function (array) {
    var tmp1 = array.length != 0 ? array[0] : 0;
    array.forEach(function (e) {
        if (e < tmp1) {
            tmp1 = e;
        }
    });
    return tmp1;
};
exports.GetHighestValue = function (array) {
    var tmp1 = array.length != 0 ? array[0] : 0;
    array.forEach(function (e) {
        if (e > tmp1) {
            tmp1 = e;
        }
    });
    return tmp1;
};
