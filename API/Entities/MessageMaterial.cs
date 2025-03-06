namespace API.Entities
{
    public class MessageMaterial
    {
         public int Id { get; set; }
        public int MessageId { get; set; }
        public Message? Message { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string? Url { get; set; } = string.Empty;
        public int MaterialTypeId { get; set; }
        public MaterialType? MaterialType { get; set; }
        public DateTime CreationDate { get; set; }

    }
}