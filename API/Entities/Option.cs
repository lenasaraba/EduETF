namespace API.Entities
{
    public class Option
    {
        public int Id { get; set; }
        public string Text { get; set; }=string.Empty;
        public List<UserOption>? UsersOption { get; set; }
        public int FormId { get; set; }
        public Form? Form { get; set; }

    }
}