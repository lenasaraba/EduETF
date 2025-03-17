using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public List<UserCourse>? UserCourses { get; set; }
        public List<ProfessorCourse>? ProfessorCourses { get; set; }
        public List<FcmToken> FcmTokens { get; set; }=new List<FcmToken>();


    }
}