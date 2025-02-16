using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserCourseDto
    {
        public int Id { get; set; }
        public UserDto User { get; set; } 
        public int CourseId { get; set; } 
        public DateTime EnrollDate { get; set; }
        public DateTime? WithdrawDate { get; set; }
    }
}