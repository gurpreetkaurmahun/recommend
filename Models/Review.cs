using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SoftwareProject {

    public class Review{
        [Key]
        public int ReviewId { get; set; }

        public string review { get; set; }

        public DateOnly reviewDate{get;set;}


        public int? ConsumerId { get; set; }
        public Consumer? Consumer { get; set; }

        public string UserEmail { get; set; }
        
    }
}