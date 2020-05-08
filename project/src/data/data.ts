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



//random grades used for 24 students... but doesn't allow include
const CreateGrades = (x:number) : List<models.Grades> => {
    let r1 = Math.floor(Math.random() * 10) + 6 //Grade is between a 6 and 10 (no bad grades here!)
    let r2 = Math.floor(Math.random() * 10) + 6 //Grade is between a 6 and 10 (no bad grades here!)
    let r3 = Math.floor(Math.random() * 10) + 9 //Grade is between a 6 and 10 (no bad grades here!)
    //TODO: the courses could be random, but based on the education
    return (r1+r2) % 2 == 0 ? Cons(models.Grades(x,r1,courceName1),Cons(models.Grades((x+1),r2,courceName2),Cons(models.Grades((x+1),r3,courceName3),Empty())))
        : Cons(models.Grades(x,r2,courceName2),Cons(models.Grades((x+1),r1,courceName1),Cons(models.Grades((x+1),r3,courceName3),Empty())))
}


//maybe not needed for include
export let educations = Cons<models.Educations>(cmi1,Cons(cmi2,Cons(cmi3,Cons(cmi3,Empty())))) 

//grade states to have something to include
let g1 = models.GradeStats(courceName1,6,"Judith-Lotte van Koopvrouw")
let g2 = models.GradeStats(courceName2,6,"Gwen-Anouk van Koopman")
let g3 = models.GradeStats(courceName2,6,"Anne-Barbie van Koopoverig")

export let GradeStats = Cons(g1,Cons(g2,Cons(g3,Empty())))

//10 Informatica
export let studentData = 
          Cons(models.Students(1,"Jurgen", "van der", "Heiden",CreateGrades(1), models.Gender("Man"), cmi1),
          Cons(models.Students(2,"Joey", "van", "Egmond",CreateGrades(3),models.Gender("Man"), cmi1),
          Cons( models.Students(3,"Achmed", "", "Turkisch",CreateGrades(5),models.Gender("Binary"), cmi1),
          Cons( models.Students(4,"Roos", "van", "Kole", CreateGrades(7),models.Gender("Women"), cmi1),
          Cons( models.Students(5,"Jurrian", "", "Brik",CreateGrades(9),models.Gender("Man"), cmi1),
          Cons( models.Students(6,"Edin", "", "Lamens",CreateGrades(11),models.Gender("Bigender"), cmi1),
          Cons(models.Students(7,"Sara", "van", "Hemsworth",CreateGrades(13),models.Gender("Women"), cmi1),
          Cons( models.Students(8,"Thom", "de", "Man",CreateGrades(15),models.Gender("Polygender"), cmi1),
          Cons(models.Students(9,"Steven", "van der", "Heiden",CreateGrades(17),models.Gender("Androgyne"), cmi1),
          Cons( models.Students(10,"Kees", "", "Flodder",CreateGrades(19),models.Gender("Women"), cmi1),
          //5 Communicatie
          Cons(models.Students(11,"Jurgen", "", "Redelijkheid",CreateGrades(21),models.Gender("Man"), cmi2),
          Cons( models.Students(12,"Joey", "van der", "Heiden",CreateGrades(23),models.Gender("Man"), cmi2),
          Cons(models.Students(13,"Achmed", "van", "Emond",CreateGrades(25),models.Gender("Man"), cmi2),
          Cons(models.Students(14,"Roos", "van", "Hemsworth",CreateGrades(27),models.Gender("Women"), cmi2),
          Cons(models.Students(15,"Sara", "van der", "Flodder",CreateGrades(29),models.Gender("Women"), cmi2),
          //5 technische
          Cons(models.Students(16,"Sho", "van", "Turkisch",CreateGrades(31),models.Gender("Women"), cmi3),
          Cons(models.Students(17,"Marvin", "", "Lamens",CreateGrades(33),models.Gender("Women"), cmi3), //no mistake
          Cons(models.Students(18,"Suzan", "", "Redelijkheid",CreateGrades(35),models.Gender("Women"), cmi3),
          Cons(models.Students(19,"Rox", "van", "Egmond",CreateGrades(37),models.Gender("Women"), cmi3),
          Cons(models.Students(20,"Thom", "van", "Hemsworth",CreateGrades(39),models.Gender("Man"), cmi3),
            //4 technische communicatie
         Cons(models.Students(21,"Lalya", "van der", "Brik",CreateGrades(41),models.Gender("Women"), cmi4),
         Cons(models.Students(22,"Lotte", "", "Brik",CreateGrades(43),models.Gender("Women"), cmi4),
         Cons(models.Students(23,"Steven", "", "Kole",CreateGrades(45),models.Gender("Man"), cmi4),
         Cons(models.Students(24,"Folkert", "van der", "Heiden",CreateGrades(47),models.Gender("Man"), cmi4), Empty()))))))))))))))))))))))))
