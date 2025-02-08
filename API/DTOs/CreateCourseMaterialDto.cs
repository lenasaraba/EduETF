namespace API.DTOs
{
    public class CreateCourseMaterialDto
    {
        
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int MaterialTypeId { get; set; }
        public DateTime CreationDate { get; set; }
        public int Week {get;set;}
    }
}