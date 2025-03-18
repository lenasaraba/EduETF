using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class GetThemeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool Active { get; set; }
        public DateTime Date { get; set; }
        public UserDto User { get; set; } = default!; 
        public GetThemeCourseDto? Course { get; set; } 
        public List<GetMessageDto>? Messages { get; set; }
    }
}