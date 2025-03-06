namespace API.DTOs
{
    public class GetFormDto
    {
        public int Id { get; set; }
        public string Topic { get; set; }=string.Empty;
        public DateTime CreationDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UserId { get; set; }
        public UserDto? User { get; set; }  
        public bool MultipleAnswer  { get; set; }  =false;
        public List<GetOptionDto>? Options {get;set;}  
        public int? CourseId { get; set; } 
        public int? MessageId { get; set; }
        
    }
}