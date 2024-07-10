using System.Collections.Generic;

namespace SoftwareProject {

    public class ProductReview{

        public int ProductReviewId { get; set; }

        public string review { get; set; }

        public DateOnly reviewDate{get;set;}

       
        public Product? ProductId { get; set; }

        public Product? Product  { get; set; }
        public Consumer? ConsumerId { get; set; }
        public Consumer? Consumer { get; set; }
        
    }
}