using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SoftwareProject {

    public class Product{

        public int ProductId { get; set; }
        public string ProductName { get; set; }

        // public double quantity{ get; set; }
        public string Price { get; set; }
        public bool Availability { get; set; }
        public string ImageUrl { get; set; }

        public string pricePerUnit{ get; set; }

        public string Url { get; set; }

        public DateOnly Date { get; set; }

        public bool IsAvailable { get; set; }

        public int? ConsumerId { get; set; }

        public Consumer? Consumer { get; set; }
        public int? CategoryId{get;set;}

        public Category? Category { get; set; }

        public int? LocationId{get;set;}

        public Location? Location { get; set; }

        [Required]
        public string SupermarketName { get; set; } 

        public ICollection<ProductLocation> ProductLocations { get; set; }

        public  ICollection<WebScrapper>? WebScrappers { get; set; }

        // public ProductReview ReviewId { get; set; }





    }
}