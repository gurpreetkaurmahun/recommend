using Microsoft.AspNetCore.Identity;

namespace SoftwareProject.Models {

    public class NewsLetterSubscription{

         public int Id { get; set; }
        public string Title { get; set; }
        public List<string> ImageUrls { get; set; }
        public string Content { get; set; }
        public string Offers { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; }
        public string UserEmail { get; set; }
        public int? ConsumerId { get; set; }
        public Consumer? Consumer { get; set; }
         public string? IdentityUserId { get; set; }
        
        // Navigation property
        public  IdentityUser? IdentityUser { get; set; }
    }
    }