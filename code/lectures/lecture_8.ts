// type Coroutine<s,e,a> = Fun<s, Either<NoRes<s,e,a>,Pair<a,s>>>
// type NoRes<s,e,a> = Either<e,Continuation<s,e,a>>
// type Continuation<s,e,a> = Pair<s,Coroutine<s,e,a>>

// let unit_Co = <s,e,a>(x:a) : Coroutine<s,e,a> => 
//   Fun(s => inr().f({ x:x, y:s }))

// let join_Co = <s,e,a> : Fun<Coroutine<s,e,Coroutine<s,e,a>>, 
// Coroutine<s,e,a>> => Fun(p => Fun(s => {
// let res : Either<NoRes<s,e,Coroutine<s,e,a>>,
//                     Pair<Coroutine<s,e,a>,s>> = p.f(s)
// if (res.kind == "left") {
//     if (res.value.kind == "left") {
//     return inl().then(inl()).f(res.value.value)
//     } else {
//     let rest : Pair<s,Coroutine<s,e,Coroutine<s,e,a>>> = res.value.value
//     return inl().then(inr()).then(map_Pair(id<s>(), join_Co()).f(rest))
//     }
// } else {
//     let final_res : Pair<s,Coroutine<s,e,a>> = res.value
//     return final_res.y.f(final_res .x)
// }
// }))

// let map_Co = <s,e,a,b>(f:Fun<a,b>) : Fun<Coroutine<s,e,a>, 
//   Coroutine<s,e,b>> => Fun(p => Fun(s => {
//     let res : Either<NoRes<s,e,a>,
//                      Pair<a,s>> = p.f(s)
//     if (res.kind == "left") {
//       if (res.value.kind == "left") {
//         return inl().then(inl()).f(res.value.value)
//       } else {
//         let rest : Pair<s,Coroutine<s,e,a>> = res.value.value
//         return inl().then(inr()).then(map_Pair(id<s>(), map_Co(f)).f(rest))
//       }
//     } else {
//         let final_res : Pair<s,a> = res.value
//         return map_Pair(id<s>(), f).f(final_res)
//     }
//   }))

//   let suspend = <s,e>() : Coroutine<s,e,Unit> =>
//   Fun(s => inl().inr().f({ x:unit_Co({}), y:s })