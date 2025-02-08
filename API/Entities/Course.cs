using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Course
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int YearId { get; set; }
        public Year? Year { get; set; }
        public int StudyProgramId { get; set; }
        public StudyProgram? StudyProgram { get; set; }
        public List<CourseMaterial>? Materials { get; set; }
        public List<Theme>? Themes { get; set; }
        public DateTime CourseCreationDate { get; set; }
        public List<UserCourse>? UsersCourse { get; set; }
        public List<ProfessorCourse>? ProfessorsCourse { get; set; }
        public string Password {get;set;}=string.Empty;
        public int WeekCount {get;set;}=0;


    }
}