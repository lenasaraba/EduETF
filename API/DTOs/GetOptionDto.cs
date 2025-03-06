namespace API.DTOs
{
    public class GetOptionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }=string.Empty;
        public List<UserOptionDto>? UsersOption { get; set; }
        public int FormId { get; set; }
    }
}