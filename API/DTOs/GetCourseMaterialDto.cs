using API.Entities;

namespace API.DTOs
{
    public class GetCourseMaterialDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public MaterialType MaterialType { get; set; }
        public DateTime CreationDate { get; set; }
        public int Week {get;set;}

    }
}