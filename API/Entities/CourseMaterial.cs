using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class CourseMaterial
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public Course? Course { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string? Url { get; set; } = string.Empty;
        public int MaterialTypeId { get; set; }
        public MaterialType? MaterialType { get; set; }
        public DateTime CreationDate { get; set; }
        public int Week {get;set;}

    }
}