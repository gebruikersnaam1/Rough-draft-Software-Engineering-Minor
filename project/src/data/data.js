"use strict";
exports.__esModule = true;
var utils_1 = require("../utils/utils"); //import list
var models = require("./models");
//education
var cmi1 = models.Educations("Informatica", 4);
var cmi2 = models.Educations("Communicatie", 4);
var cmi3 = models.Educations("Technische Informatica", 4);
var cmi4 = models.Educations("Technische communicatie", 4);
//cource names
var courceName1 = "SLC";
var courceName2 = "Skills";
var courceName3 = "Work Safety - Corona Edition";
var courceName4 = "Become a Gift For Your Environment";
/*
  * Grade
*/
var CreateRandomGrades = function () {
    return Math.floor(Math.random() * (10 - 6 + 1)) + 6; //extra random? 
};
var gradeID = 0; //TODO: find a way that fits more the minor
var CreateGradeID = function () {
    gradeID += 1;
    return (gradeID);
};
//random grades used for 28 students... but doesn't allow include
var CreateGrades = function () {
    return utils_1.Cons(models.Grades(CreateGradeID(), CreateRandomGrades(), courceName1), utils_1.Cons(models.Grades(CreateGradeID(), CreateRandomGrades(), courceName2), utils_1.Cons(models.Grades(CreateGradeID(), CreateRandomGrades(), courceName3), utils_1.Cons(models.Grades(CreateGradeID(), CreateRandomGrades(), courceName4), utils_1.Empty()))));
};
//maybe not needed for include
exports.educations = utils_1.Cons(cmi1, utils_1.Cons(cmi2, utils_1.Cons(cmi3, utils_1.Cons(cmi3, utils_1.Empty()))));
//grade states to have something to include
var g1 = models.GradeStats(courceName1, CreateRandomGrades(), "Judith-Lotte van Koopvrouw");
var g2 = models.GradeStats(courceName2, CreateRandomGrades(), "Gwen-Anouk van Koopman");
var g3 = models.GradeStats(courceName3, CreateRandomGrades(), "Anne-Barbie van Koopoverig");
var g4 = models.GradeStats(courceName4, CreateRandomGrades(), "Eibert 'the Gift' Wagenaar");
exports.ListGrades = utils_1.Cons(g1, utils_1.Cons(g2, utils_1.Cons(g3, utils_1.Cons(g4, utils_1.Empty()))));
exports.ListStudents = 
//10 Informatica
utils_1.Cons(models.Students(1, "Jurgen", "van der", "Heiden", CreateGrades(), models.Gender("Man"), cmi1), utils_1.Cons(models.Students(2, "Joey", "van", "Egmond", CreateGrades(), models.Gender("Man"), cmi1), utils_1.Cons(models.Students(3, "Abdul-Achmed", "van", "UniNiveau", CreateGrades(), models.Gender("Binary"), cmi1), utils_1.Cons(models.Students(4, "Roos", "", "Padre", CreateGrades(), models.Gender("Man"), cmi1), utils_1.Cons(models.Students(5, "Marvin", "", "Madre", CreateGrades(), models.Gender("Women"), cmi1), utils_1.Cons(models.Students(6, "Edin", "", "Lamens", CreateGrades(), models.Gender("Bigender"), cmi1), utils_1.Cons(models.Students(7, "Sara", "van", "Hemsworth", CreateGrades(), models.Gender("Women"), cmi1), utils_1.Cons(models.Students(8, "Martijn", "", "Muilwijk", CreateGrades(), models.Gender("Polygender"), cmi1), utils_1.Cons(models.Students(9, "Steven", "van der", "Heiden", CreateGrades(), models.Gender("Androgyne"), cmi1), utils_1.Cons(models.Students(10, "Kees", "", "Flodder", CreateGrades(), models.Gender("Women"), cmi1), 
//5 Communicatie
utils_1.Cons(models.Students(11, "Jurgen", "", "Redelijkheid", CreateGrades(), models.Gender("Man"), cmi2), utils_1.Cons(models.Students(12, "Joey", "van der", "Heiden", CreateGrades(), models.Gender("Man"), cmi2), utils_1.Cons(models.Students(13, "Marvin", "", "IDK-Lamens", CreateGrades(), models.Gender("Women"), cmi2), utils_1.Cons(models.Students(14, "Roos", "van der", "Flodder", CreateGrades(), models.Gender("Man"), cmi2), utils_1.Cons(models.Students(15, "Sara", "van der", "Flodder", CreateGrades(), models.Gender("Women"), cmi2), 
//5 technische
utils_1.Cons(models.Students(16, "Jurrian", "van", "Goud", CreateGrades(), models.Gender("Women"), cmi3), utils_1.Cons(models.Students(17, "Eibert", "van", "Kitten", CreateGrades(), models.Gender("Man"), cmi3), //no mistake
utils_1.Cons(models.Students(18, "Suzan", "", "Redelijkheid", CreateGrades(), models.Gender("Women"), cmi3), utils_1.Cons(models.Students(19, "Rox", "van", "Egmond", CreateGrades(), models.Gender("Women"), cmi3), utils_1.Cons(models.Students(20, "Thom", "van", "Hemsworth", CreateGrades(), models.Gender("Man"), cmi3), 
//8 technische communicatie
utils_1.Cons(models.Students(21, "Lalya", "van der", "Grey", CreateGrades(), models.Gender("Women"), cmi4), utils_1.Cons(models.Students(22, "Lotte", "", "Brik", CreateGrades(), models.Gender("Women"), cmi4), utils_1.Cons(models.Students(23, "Wah", "van", "Nek", CreateGrades(), models.Gender("Man"), cmi4), utils_1.Cons(models.Students(24, "Kevin", "", "Moerkerken", CreateGrades(), models.Gender("Women"), cmi4), utils_1.Cons(models.Students(25, "Quinten", "van", "Meijbeek-Huisman", CreateGrades(), models.Gender("Gender fluid"), cmi4), utils_1.Cons(models.Students(26, "Lindsey", "de", "Ark", CreateGrades(), models.Gender("Women"), cmi4), utils_1.Cons(models.Students(27, "Steven", "", "Kole", CreateGrades(), models.Gender("Man"), cmi4), utils_1.Cons(models.Students(28, "Andre", "van", "Duin", CreateGrades(), models.Gender("Man"), cmi4), utils_1.Cons(models.Students(29, "Folkert", "van der", "Heiden", CreateGrades(), models.Gender("Man"), cmi4), utils_1.Empty())))))))))))))))))))))))))))));
