import {List} from  "../utils/utils"//import list

//'enums'/array to be define 
export type Gender = {
    gender: "Man"
} | {
    gender: "Women"
} |{
    gender: "Other"
}


export let Gender = (x:string) : Gender =>(
    x == "Man"? {gender: "Man"} : x == "Women" ? {gender: "Women"} : {gender: "Other"}
)
/*
    * the types/interfaces of the models that are going to be used during this project
*/
export type Students = {
    Id: number
    Firstname:string
    Prefix: string
    Gender: Gender
    Lastname: string
    Educations: Educations
    Grades: List<Grades>
}

//table is made in a way that include isn't possible
export type Educations = {
    Name: string,
    Study_Duration: number
}

//table is made in a way that include isn't possible
export type Grades = {
    Id: number,
    Grade: number,
    Course_Name: string
}

//table is made to have a table to include
export type GradeStats = {
    Course_Name: string,
    Average_Grade: number,
    Teacher: string
}

/*
    * the constructors for the models
*/

export const Students = (id:number, firstname: string, prefix: string,lastname: string, grades : List<Grades>, gender:Gender, education: Educations) : Students => (
    {
        Id: id,
        Firstname: firstname,
        Lastname: lastname,
        Prefix: prefix,
        Gender: gender,
        Educations: education,
        Grades: grades
    }
)

export const Educations = (name: string, study: number) : Educations =>(
    {
        Name: name,
        Study_Duration: study
    }
)

export const Grades = (id: number, grade: number, courseName: string) : Grades =>(
    {
        Id: id,
        Grade: grade,
        Course_Name: courseName
    }
)

export const GradeStats = (courseName: string,averageStats: number, teacher:string) : GradeStats => (
    {
        Course_Name: courseName,
        Average_Grade: averageStats,
        Teacher: teacher
    }
)