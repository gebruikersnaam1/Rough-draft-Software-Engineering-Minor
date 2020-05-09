import {List, Cons} from './utils'
import * as models from '../data/models'
import  {ListGrades,ListStudents} from '../data/data'

//kind of a mess to read, but helps me to see the data being show in the console.log


let PrintStudents = function(l: List<models.Students>){
    if(l.kind == "Cons"){
        console.log("Student: #" + l.head.Id + " " + l.head.Firstname + " " + l.head.Prefix + " " + l.head.LastName)
        console.log("Gender: " + l.head.Gender.gender)
        // console.log()
        console.log(l.head.Educations)
        console.log(l.head.Grades)
        console.log("----------------------------------------------------\n")
        PrintStudents(l.tail)
    }
}

let PrintGrades= function(l: List<models.GradeStats>){
    if(l.kind == "Cons"){
        console.log(l.head)
        console.log("\n")
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
