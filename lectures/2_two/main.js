var then = function (f, g) {
    return Fun(function (a) { return g.f(f.f(a)); });
};
var Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then(this, g);
        }
    };
};
var isEven = Fun(function (x) { return x % 2 == 0; });
//e.g. how container could be used
var c_i = { content: 10, counter: 0 };
var c_s = { content: "Howdy!", counter: 0 };
var c_ss = { content: ["Howdy", "!"], counter: 0 };
//transform container
var transform_countainer_content_num_to_bool = function (f, c) {
    return { content: f.f(c.content), counter: c.counter };
};
// i.e. map container
var map_countainer = function (f, c) {
    return { content: f.f(c.content), counter: c.counter };
};
var c = { content: 3, counter: 0 };
var l = map_countainer(isEven, c);
