namespace API.Entities
{
    public class Theme
    {
    public int Id { get; set; }
    public string Title { get; set; }=string.Empty;
    public string? Description { get; set; }
    public bool Active {get; set;}=true;
    public DateTime Date { get; set; }
    public int? UserId { get; set; } 
    public User? User { get; set; }
    public int? CourseId { get; set; }
    public Course? Course { get; set; }
    public List<Message>? Messages { get; set; }

    }
}