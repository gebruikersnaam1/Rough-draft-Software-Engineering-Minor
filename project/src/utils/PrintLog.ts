import {List} from './utils'
import * as models from '../data/models'
import  {ListGrades,ListStudents} from '../data/data'

//kind of a mess to read, but helps me to see the data being show in the console.log

let PrintStudentGrades = function(l: List<models.Grades>){
    if(l.kind == "Cons"){
        console.log("\t Grade entry ID: #" + l.head.Id + " = course: " + l.head.Course_Name + " & Grade " + l.head.Grade)
        PrintStudentGrades(l.tail)
    }
}

let PrintStudents = function(l: List<models.Students>){
    if(l.kind == "Cons"){
        console.log("Student: #" + l.head.Id + " " + l.head.Firstname + " " + l.head.Prefix + " " + l.head.LastName)
        console.log("Gender: " + l.head.Gender.gender)
        // console.log()
        console.log("Education: " + l.head.Educations.Name + " with a duration: " + l.head.Educations.Study_Duration);
        console.log("Grades of student:")
        PrintStudentGrades(l.head.Grades)
        console.log("----------------------------------------------------\n")
        PrintStudents(l.tail)
    }
}

let PrintGrades= function(l: List<models.GradeStats>){
    if(l.kind == "Cons"){
        console.log(l.head.Course_Name + " is given by " + l.head.Teacher + " the average grade for this course is " + l.head.Average_Grade)
        PrintGrades(l.tail)
    }
}
let printLine = () => {console.log("\n\n**********************************************************\n\n")}


//to see the data that is being used within this project
export let PrintUsedData = function(){
    printLine()
    console.log("INIT - Print dummy data in list form\n")
    printLine()
    console.log("List students")
    PrintStudents(ListStudents)
    printLine()
    console.log("List grades")
    PrintGrades(ListGrades)
    printLine()
}
