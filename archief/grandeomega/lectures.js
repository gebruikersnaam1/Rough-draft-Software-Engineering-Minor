var Fun = function (f) { return { f: f }; };
//examples
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
var negate = Fun(function (x) { return !x; });
var is_even = Fun(function (x) { return x % 2 == 0; });
var c_i = { content: 10, counter: 0 };
var c_s = { content: "Howdy!", counter: 0 };
var c_ss = { content: ["Howdy", "!"], counter: 0 };
//wrong way of doing a container (its nog generic)
var transform_countainer_content_num_to_bool = function (f, c) {
    return { content: f.f(c.content), counter: c.counter };
};
// beter way
var map_countainer = function (f, c) {
    return { content: f.f(c.content), counter: c.counter };
};
var c = { content: 3, counter: 0 };
var l = map_countainer(is_even, c);
// let l2:Countainer<boolean> = map_countainer(incr.then(is_even), c)
