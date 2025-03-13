namespace API.DTOs
{
    public class CreateUserOptionDto
    {
        public UserDto? User { get; set; }
        public int OptionId { get; set; } 
        public DateTime AnswerDate { get; set; }
    }
}