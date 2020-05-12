var id = function () { return Fun(function (x) { return x; }); };
var repeat = function (f, n) {
    if (n <= 0) {
        return id();
    }
    else {
        return f.then(repeat(f, (n - 1)));
    }
};
var repeatUntil = function (f, p) {
    var g = function (x) {
        if (p.f(x)) {
            return id().f(x);
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
        repeatUntil: function () {
            var _this = this;
            return Fun(function (x) { return repeatUntil(_this, x); });
        }
    };
};
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
console.log(incr.f(5));
console.log(incr.then(double).f(5));
console.log(incr.repeat().f(5).f(5));
console.log(incr.repeatUntil().f(Fun(function (x) { return x > 100; })).f(5));
var Cons = function (h, t) { return ({
    kind: "Cons",
    head: h,
    tail: t
}); };
var Empty = function () { return ({
    kind: "Empty"
}); };
var map_list = function (f, list) {
    return list.kind == "Cons" ? Cons(f.f(list.head), map_list(f, list.tail)) : Empty();
};
var m_l = Fun(function (x) { return x + 1; });
var example_list = Cons("a", Cons("b", Cons("c", Empty())));
var example_list2 = map_list(m_l, example_list);
console.log(example_list2);
var zero_string = Fun(function (_) { return ""; });
var plus_pair = Fun(function (x) { return x.fst + " " + x.snd; });
var zero_list = function () { return Fun(function (_) { return Empty(); }); };
var plus_list = function () { return Fun(function (x) { return x.fst.kind == "Cons" ? Cons(x.fst.head, plus_list().f({ fst: x.fst.tail, snd: x.snd })) : x.snd; }); };
var idk_id = function () { return Fun(function (x) { return x; }); };
var join_id = function () { return Fun(function (x) { return x; }); };
var Some = function (value) { return ({ kind: "Some", value: value }); };
var None = function () { return ({ kind: "None" }); };
// let none = <a>() : Fun<{},Option<a>> => Fun<{},Option<a>>(_ => ({ kind:"None" }))
// let some = <a>() : Fun<a,Option<a>> => Fun<a,Option<a>>(x => ({ kind:"Some", value:x }))
var z = Some("x");
var unit_option = function () { return Fun(function (x) { return Some(x); }); };
var join_option = function () {
    return Fun(function (x) { return x.kind == "Some" ? x.value : None(); });
};
var unit_list = function () { return Fun(function (x) { return Cons(x, Empty()); }); };
var join_list = function () { return Fun(function (x) {
    return x.kind == "Cons" ? plus_list().f({ fst: x.head, snd: join_list().f(x.tail) }) : Empty();
}); };
