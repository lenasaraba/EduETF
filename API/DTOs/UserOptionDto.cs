namespace API.DTOs
{
    public class UserOptionDto
    {
        public int Id { get; set; }
        public UserDto? User { get; set; }
        public int OptionId { get; set; } 
        public DateTime AnswerDate { get; set; }
    }
}