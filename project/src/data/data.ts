import {List, Cons, Empty, } from  "../utils/utils"//import list
import * as models from './models'

//education
let cmi1 = models.Educations("Informatica",4)
let cmi2 = models.Educations("Communicatie",4)
let cmi3 = models.Educations("Technische Informatica",4)
let cmi4 = models.Educations("Technische communicatie",4)

//cource names
let courceName1 = "SLC"
let courceName2 = "Skills"
let courceName3 = "Work Safety - Corona Edition"
let courceName4 = "Become a Gift For Your Environment"

/*
  * Grade
*/
const CreateRandomGrades = () : number =>{
  return Math.floor(Math.random() * (10-6 + 1)) + 6 //extra random? 
}

let gradeID = 0 //TODO: find a way that fits more the minor
const CreateGradeID = () : number => {
  return (gradeID+1)
}

//random grades used for 28 students... but doesn't allow include
const CreateGrades = ( ): List<models.Grades> => {
  return Cons(models.Grades(CreateGradeID(),CreateRandomGrades(),courceName1),
         Cons(models.Grades(CreateGradeID(),CreateRandomGrades(),courceName2),
         Cons(models.Grades(CreateGradeID(),CreateRandomGrades(),courceName3),
         Cons(models.Grades(CreateGradeID(),CreateRandomGrades(),courceName4),Empty()))))
}


//maybe not needed for include
export let educations = Cons<models.Educations>(cmi1,Cons(cmi2,Cons(cmi3,Cons(cmi3,Empty())))) 

//grade states to have something to include
let g1 = models.GradeStats(courceName1,CreateRandomGrades(),"Judith-Lotte van Koopvrouw")
let g2 = models.GradeStats(courceName2,CreateRandomGrades(),"Gwen-Anouk van Koopman")
let g3 = models.GradeStats(courceName3,CreateRandomGrades(),"Anne-Barbie van Koopoverig")
let g4 = models.GradeStats(courceName4,CreateRandomGrades(),"Eibert 'the Gift' Wagenaar")


export let ListGrades = Cons(g1,Cons(g2,Cons(g3,Cons(g4,Empty()))))


export let ListStudents = 
          //10 Informatica
          Cons(models.Students(1,"Jurgen", "van der", "Heiden",CreateGrades(), models.Gender("Man"), cmi1),
          Cons(models.Students(2,"Joey", "van", "Egmond",CreateGrades(),models.Gender("Man"), cmi1),
          Cons(models.Students(3,"Abdul-Achmed", "van", "UniNiveau",CreateGrades(),models.Gender("Binary"), cmi1),
          Cons(models.Students(4,"Roos", "", "Padre", CreateGrades(),models.Gender("Women"), cmi1),
          Cons(models.Students(5,"Marvin", "", "Madre",CreateGrades(),models.Gender("Man"), cmi1),
          Cons(models.Students(6,"Edin", "", "Lamens",CreateGrades(),models.Gender("Bigender"), cmi1),
          Cons(models.Students(7,"Sara", "van", "Hemsworth",CreateGrades(),models.Gender("Women"), cmi1),
          Cons(models.Students(8,"Martijn", "", "Muilwijk",CreateGrades(),models.Gender("Polygender"), cmi1),
          Cons(models.Students(9,"Steven", "van der", "Heiden",CreateGrades(),models.Gender("Androgyne"), cmi1),
          Cons( models.Students(10,"Kees", "", "Flodder",CreateGrades(),models.Gender("Women"), cmi1),
          //5 Communicatie
          Cons(models.Students(11,"Jurgen", "", "Redelijkheid",CreateGrades(),models.Gender("Man"), cmi2),
          Cons(models.Students(12,"Joey", "van der", "Heiden",CreateGrades(),models.Gender("Man"), cmi2),
          Cons(models.Students(13,"Marvin", "", "IDK-Lamens",CreateGrades(),models.Gender("Man"), cmi2),
          Cons(models.Students(14,"Roos", "van der", "Flodder",CreateGrades(),models.Gender("Women"), cmi2),
          Cons(models.Students(15,"Sara", "van der", "Flodder",CreateGrades(),models.Gender("Women"), cmi2),
          //5 technische
          Cons(models.Students(16,"Jurrian", "van", "Goud",CreateGrades(),models.Gender("Women"), cmi3),
          Cons(models.Students(17,"Eibert", "van", "Kitten",CreateGrades(),models.Gender("Man"), cmi3), //no mistake
          Cons(models.Students(18,"Suzan", "", "Redelijkheid",CreateGrades(),models.Gender("Women"), cmi3),
          Cons(models.Students(19,"Rox", "van", "Egmond",CreateGrades(),models.Gender("Women"), cmi3),
          Cons(models.Students(20,"Thom", "van", "Hemsworth",CreateGrades(),models.Gender("Man"), cmi3),
          //8 technische communicatie
          Cons(models.Students(21,"Lalya", "van der", "Heiden",CreateGrades(),models.Gender("Women"), cmi4),
          Cons(models.Students(22,"Lotte", "", "Brik",CreateGrades(),models.Gender("Women"), cmi4),
          Cons(models.Students(23,"Wah", "van", "Nek",CreateGrades(),models.Gender("Man"), cmi4),
          Cons(models.Students(24,"Kevin", "", "Moerkerken",CreateGrades(),models.Gender("Women"), cmi4),
          Cons(models.Students(25,"Quinten", "van", "Meijbeek-Huisman",CreateGrades(),models.Gender("Gender fluid"), cmi4),
          Cons(models.Students(26,"Lindsey", "de", "Ark",CreateGrades(),models.Gender("Women"), cmi4),
          Cons(models.Students(27,"Steven", "", "Kole",CreateGrades(),models.Gender("Man"), cmi4),
          Cons(models.Students(28,"Folkert", "van der", "Heiden",CreateGrades(),models.Gender("Man"), cmi4), Empty()))))))))))))))))))))))))))))