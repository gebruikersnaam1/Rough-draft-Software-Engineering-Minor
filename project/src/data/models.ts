import {List} from  "../utils/utils"//import list

//'enums'/array to be define 
export type Gender = {
    gender: "Man"
} | {
    gender: "Women"
} |{
    gender: "Other"
} 
/*
    * the types/interfaces of the models that are going to be used during this project
*/
export type Students = {
    Id: number
    Firstname:string
    Prefix: Gender
    LastName: string
    Educations: Educations
    Grades: List<Grades>
}

export type Educations = {
    Name: string,
    Study_Duration: number
}

export type Grades = {
    Id: number,
    Grade: number,
    Course_Name: string
}

/*
    * the constructors for the models
*/

export const Students = (id:number, firstname: string, prefix: Gender,lastname: string, education: Educations, Grades: List<Grades>) : Students => (
    {
        Id: id,
        Firstname: firstname,
        LastName: lastname,
        Prefix: prefix,
        Educations: education,
        Grades: Grades
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