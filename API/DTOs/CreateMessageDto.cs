using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CreateMessageDto
    {
        public string Content { get; set; }=string.Empty;
        public DateTime CreationDate { get; set; }
        public int ThemeId { get; set; }
        public List<CreateMessageMaterialDto>? Materials { get; set; }
        public List<GetFormDto>? Forms { get; set; }

    }
}