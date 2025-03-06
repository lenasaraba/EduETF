using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("UserOption")]

    public class UserOption
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public User? User { get; set; }
        public int OptionId { get; set; } 
        public Option? Option { get; set; }
        public DateTime AnswerDate { get; set; }
    }
}