using System.Collections.Generic;

namespace SoftwareProject {

    public class Product{

        public char ProductId { get; set; }
        public string ProductName { get; set; }

        // public double quantity{ get; set; }
        public string Price { get; set; }
        public bool Availability { get; set; }
        public string ImageUrl { get; set; }

        public string pricePerUnit{ get; set; }

        public string Url { get; set; }

         public DateOnly Date { get; set; }

        public Consumer ConsumerId { get; set; }
        public Category CategoryId{get;set;}

        public Location LocationId{get;set;}

        // public ProductReview ReviewId { get; set; }





    }
}