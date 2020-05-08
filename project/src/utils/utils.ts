export type List<a> = {
    kind: "Cons",
    head: a,
    tail: List<a>
} | {
    kind: "Empty"
}

export let Cons = <a>(head:a,tail:List<a>) : List<a> =>({
    kind: "Cons",
    head: head,
    tail: tail
}) 

export let Empty = <a>() : List<a> =>({
    kind: "Empty"
}) 