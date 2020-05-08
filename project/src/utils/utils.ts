export type List<a> = {
    kind: "Cons",
    head: a,
    tail: List<a>
} | {
    kind: "Empty"
}
