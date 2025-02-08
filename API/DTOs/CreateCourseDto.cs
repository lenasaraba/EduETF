using API.Entities;

namespace API.DTOs
{
    public class CreateCourseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int YearId { get; set; }
        public int StudyProgramId { get; set; }
        public DateTime CourseCreationDate { get; set; }
        public string Password{ get; set; } = string.Empty;


    }
}