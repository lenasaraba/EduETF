using API.Entities;

namespace API.DTOs
{
    public class GetMessageMaterialDto
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string? Url { get; set; } = string.Empty;
        public MaterialType MaterialType { get; set; }
        public DateTime CreationDate { get; set; }
    }
}