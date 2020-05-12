type Filter<T, Condition> = {
    [P in keyof T]: T[P] extends Condition ? P : never
  }[keyof T]
  
  // ...And finally I will show you how to make a start on the Select and Include, a 5.5 was never so close!
  
  interface Student {
    id: string
    name: string
    age: number
    courses: Course[]
  }
  
  interface Course {
    grade: number
    courseName: string
  }
  
  type Fun<a, b> = (_: a) => b
  
  type GetArrayType<T> = T extends Array<infer U> ? U : never
  
  interface Table<T, U> {
    data: [T[], U[]]
    Select: <K extends keyof T>(...props: K[]) => Table<Omit<T, K>, Pick<T, K>>
    //haal K uit T (...props zorg ervoor dat je 1-x parameters mee kan geven)
    //hij return zichzelf waarbij:
    //                            T is de interface van iets (bijv. Person) min k (dit geeft aan welke waardes nog geselecteerd kunnen worden)
    //                            U is de interface van iets (bijv. Person) maar haal de waardes eruit die gekozen zijn
  
    Include: <R extends Filter<T, object[]>, K extends keyof GetArrayType<T[R]>>(
        record: R,
        //records van de nieuwe table?
        q: Fun<Table<GetArrayType<T[R]>, Unit>, Table<Omit<GetArrayType<T[R]>, K>, Pick<GetArrayType<T[R]>, K>>>
        //combine de twee waardes?
    ) => Table<Omit<T, R>, U & { [key in R]: Array<Pick<GetArrayType<T[R]>, K>> }>
        //return????????
  }
  
  //T en U is een array... denk om {waardes} van de interface te bevatten
  let Table = <T, U>(data: [T[], U[]]): Table<T, U> => ({
    data: data,
    Select: function <K extends keyof T>(): Table<Omit<T, K>, Pick<T, K>> {
        return null!
    },
  
    Include: function<R extends Filter<T, object[]>, K extends keyof GetArrayType<T[R]>>(
        record: R,
        q: Fun<Table<GetArrayType<T[R]>, Unit>, Table<Omit<GetArrayType<T[R]>, K>, Pick<GetArrayType<T[R]>, K>>>
    ): Table<Omit<T, R>, U & { [key in R]: Array<Pick<GetArrayType<T[R]>, K>> }> {
        return null!
    }
  })
  
  type Unit = {}
  let s1: Student[] = []
  let u: Unit[] = []
  let students: Table<Student, Unit> = Table([s1, u])
  students.Select('age').Select('id').Select('name')
    .Include('courses', q => q.Select('grade', 'courseName'))
  
  /**
  * students.Select('name', 'age').Select('id')
  *         .Include('courses', q => q.Select('grade'))
  */