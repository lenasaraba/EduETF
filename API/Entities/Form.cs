using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class Form
    {
        public int Id { get; set; }
        public string Topic { get; set; }=string.Empty;
        public DateTime CreationDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }  
        public bool MultipleAnswer  { get; set; }  =false;
        public List<Option>? Options {get;set;}  
        public int? CourseId { get; set; }
        public Course? Course { get; set; }  
        public int? MessageId { get; set; }
        public Message? Message { get; set; }  
    }
}