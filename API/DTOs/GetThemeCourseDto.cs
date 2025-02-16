using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class GetThemeCourseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Year Year { get; set; }
        public StudyProgram StudyProgram { get; set; }
        public DateTime CourseCreationDate { get; set; }
        public List<ProfessorCourseDto>? ProfessorsCourse { get; set; }
        public List<UserCourseDto>? UsersCourse { get; set; }

    }
}