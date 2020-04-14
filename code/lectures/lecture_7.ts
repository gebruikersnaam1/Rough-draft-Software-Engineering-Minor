// type Process <s,e,a> = Fun<s, Either<e, Pair<a,s>>>

// let unit_Process = <s, e, a>(): Fun<a, Process<s, e, a>> =>
//   Fun((x: a) => Fun((state: s) => unit_Either<Pair<a, s>, e>().f(Pair<a, s>(x, state))))

// let join_Process = <s, e, a>(): Fun<Process<s, e, Process<s, e, a>>, Process<s, e, a>> =>
// Fun<Process<s, e, Process<s, e, a>>, Process<s, e, a>>
//     ((p: Process<s, e, Process<s, e, a>>) =>
//     p.then(map_Either(id<e>(), apply())).then(join_Either()))

// let map_Process = <s, e, a, b>(f: Fun<a, b>): Fun<Process<s, e, a>, Process<s, e, b>> =>
// Fun<Process<s, e, a>, Process<s, e, b>>((p: Process<s, e, a>) => 
//         p.then(map_Either(id<e>(), map_Pair(f, id<s>()))))

// type Memory = Immutable.Map<string, number>
// type Error = string
// type Instruction<a> = Process<Memory, Error, a>

// let get_var = (v:string) : Instruction<number> =>
//   get_state().then(m =>
//   m.has(v) ? unit_Process(m.get(v))
//   : inl(`Error: variable ${v} does not exist`))

// let set_var = (v:string, n:number) : Instruction<Unit> =>
//   get_state().then(m =>
//   set_state(m.set(v, n)))

//   let try_catch = <a>(p:Instruction<a>, q:Instruction<a>) : Instruction<a> =>
//   Fun(m => p.then(map_Either(q.f(m), id())).f(m))

//   let swap_a_b = () : Instruction<Unit> =>
//   try_catch(get_var("a"), set_var("a", 0).then(get_var("a")).then(a_val =>
//   try_catch(get_var("b"), set_var("b", 0).then(get_var("b")).then(b_val =>
//   set_var("a", b_val).then(
//   set_var("b", a_val))))