using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }

        public string Email { get; set; }=string.Empty;
        public string Username { get; set; }=string.Empty;

        public string Token { get; set; }=string.Empty;
        public string  FirstName { get; set; }=string.Empty;
        public string LastName { get; set; }=string.Empty;
        public string? Role {get;set;}=string.Empty;
    }
}