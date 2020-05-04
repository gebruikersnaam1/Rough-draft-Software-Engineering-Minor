var Id = function () { return Fun(function (x) { return x; }); };
var repeat = function (f, n) {
    if (n <= 0) {
        return Id();
    }
    else {
        return f.then(repeat(f, (n - 1)));
    }
};
var repeatUntil = function (f, p) {
    var g = function (x) {
        if (p.f(x)) {
            return Id().f(x);
        }
        else {
            return f.then(repeatUntil(f, p)).f(x);
        }
    };
    return Fun(g);
};
var then = function (f, g) {
    return Fun(function (x) { return g.f(f.f(x)); });
};
var Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then(this, g);
        },
        repeat: function () {
            var _this = this;
            return Fun(function (x) { return repeat(_this, x); });
        },
        repeatUntil: function (g) {
            var _this = this;
            return Fun(function (x) { return repeatUntil(_this, g); });
        }
    };
};
var Cons = function (h, t) { return ({
    kind: "Cons",
    head: h,
    tail: t
}); };
var Empty = function () { return ({
    kind: "Empty"
}); };
var map_list = function (f, l) {
    return l.kind == "Cons" ? Cons(f.f(l.head), map_list(f, l.tail)) : Empty();
};
var f_l = Fun(function (x) { return (x + 1); });
var l1 = Cons("a", Cons("b", Cons("c", Empty())));
var l2 = map_list(f_l, l1);
console.log(l2);
var Result = function (v) {
    return {
        kind: "Result",
        value: v
    };
};
var Ex_Error = function () {
    return {
        kind: "Error"
    };
};
//feels wrong because it not really generic... or is it?
var Exception = Fun(function (x) { return x.kind == "Result" ? x.value : "Something went wrong"; });
/*
  ***** Lesson 3
*/ 
