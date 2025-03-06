namespace API.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }=string.Empty;
        public DateTime CreationDate { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }    
        public int ThemeId { get; set; }
        public Theme? Theme { get; set; }
        public List<Form>? Forms { get; set; }
        public List<MessageMaterial>? Materials { get; set; }

    }
}