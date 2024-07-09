using System.Collections.Generic;

namespace SoftwareProject {

    public class ProductReview{

        public char ProductReviewId { get; set; }

        public string review { get; set; }
        public Product ProductId { get; set; }
        public Consumer ConsumerId { get; set; }
        
    }
}