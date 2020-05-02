//to do: Fun implementeren met methodes f,then,repeat,repeatUntil
//to do: ongein van assignment 1.1
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
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
var square = Fun(function (x) { return x * x; });
var isPositive = Fun(function (x) { return x > 0; });
var isEven = Fun(function (x) { return x % 2 == 0; });
var invert = Fun(function (x) { return -x; });
var squareRoot = Fun(function (x) { return Math.sqrt(x); });
var ifThenElse = function (p, _then, _else) {
    return Fun(function (x) {
        if (p.f(x)) {
            return _then.f(x);
        }
        else {
            return _else.f(x);
        }
    });
};
// Implement a function that computes the square root if the input is positive, otherwise inverts it and then performs the square root
var v = Fun(function (x) { return x + 1; });
var x = v.repeat().f(5).f(5);
console.log(x);
