using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class MaterialType
    {
        public int Id { get; set; }      
        public string Name { get; set; }=string.Empty;   
        public string Description { get; set; }=string.Empty;
    }
}