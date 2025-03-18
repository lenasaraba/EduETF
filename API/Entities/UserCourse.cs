using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    [Table("UserCourse")]
    public class UserCourse
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public User? User { get; set; }
        public int CourseId { get; set; } 
        public Course? Course { get; set; }
        public DateTime EnrollDate { get; set; }
        public DateTime? WithdrawDate { get; set; }
    }
}