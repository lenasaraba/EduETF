namespace API.DTOs
{
    public class CreateMessageMaterialDto
    {
        public int MessageId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string? Url { get; set; } = string.Empty;
        public int MaterialTypeId { get; set; }
        public DateTime CreationDate { get; set; }
    }
}