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
exports.PrintQueryValues = function (l) {
    if (l.kind == "Cons") {
        console.log(l.head.getValues);
        exports.PrintQueryValues(l.tail);
    }
};
