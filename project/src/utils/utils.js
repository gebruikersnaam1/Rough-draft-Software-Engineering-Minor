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
