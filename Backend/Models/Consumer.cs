using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SoftwareProject.Models {

    public class Consumer{

        [Key]
        public int ConsumerId { get; set; }
        public string FName { get; set; }

        public string LName{ get; set; }

        public string Address { get; set; }
        public string ContactNo { get; set; }

        public DateTime Dob{get;set;}

        public string? IdentityUserId { get; set; }
        
        // Navigation property
        public  IdentityUser? IdentityUser { get; set; }

    
        public virtual ICollection<NewsLetterSubscription>? Newsletters { get; set; }
   
        public virtual ICollection<Review>? Reviews { get; set; }
        
        public int? LocationId { get; set; }

        public Location? Location{get;set;}

        public ICollection<SavedProduct>? SavedProducts { get; set; }




    }
}