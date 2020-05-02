/*
  @lecture 1
*/
var Identity = function () { return Fun(function (x) { return x; }); };
var then = function (f, g) {
    return Fun(function (x) { return g.f(f.f(x)); });
};
var repeat = function (f, n) {
    if (n <= 0) {
        return Identity();
    }
    else {
        return f.then(repeat(f, (n - 1)));
    }
};
var repeatUntil = function (f, rUntil) {
    var g = function (x) {
        if (rUntil.f(x)) {
            return Identity().f(x);
        }
        else {
            return f.then(repeatUntil(f, rUntil)).f(x);
        }
    };
    return Fun(g);
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
var Cons = function (Head, Tail) { return ({
    kind: "Cons",
    head: Head,
    tail: Tail
}); };
var Empty = function () { return ({
    kind: "Empty"
}); };
//f "a"+1 = 2
var map_countainer = function (f, c) {
    return { content: f.f(c.content), counter: c.counter };
};
var listExample = Cons("a", Cons("b", Cons("c", Empty())));
var assignment2 = Fun(function (x) { return x + "5"; });
var list_option = function (f) {
    return Fun(function (x) { return x.kind == "Empty" ? Empty() : Cons((f.f(x.head)), (list_option(f).f(x.tail))); });
};
var result = list_option(assignment2).f(listExample);
console.log(result);
