namespace API.DTOs
{
    public class CreateFormDto
    {
        public string Topic { get; set; }=string.Empty;
        public DateTime? EndDate { get; set; } 
        public bool MultipleAnswer  { get; set; }  =false;
        public List<CreateOptionDto>? Options {get;set;}  
        public int? CourseId { get; set; } 
        public int? MessageId { get; set; }
    }
}