using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SoftwareProject {

    public class Consumer{

        [Key]
        public int ConsumerId { get; set; }
        public string FName { get; set; }

        public string LName{ get; set; }

        public string Address { get; set; }
        public string ContactNo { get; set; }

        public DateOnly Dob{get;set;}

        public string? IdentityUserId { get; set; }
        
  
        public  IdentityUser? IdentityUser { get; set; }

        public  ICollection<Newsletter>? Newsletters { get; set; }

        public  ICollection<Product>? Products { get; set; }
        public int? LocationId { get; set; }

        public Location? Location{get;set;}




    }
}