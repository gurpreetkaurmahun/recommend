using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SoftwareProject {

    public class ProductLocation{
        
        public int? ProductId { get; set; }
        public  Product? Product { get; set; }



        public int? LocationId { get; set; }
         public  Location? Location { get; set; }
    }
}