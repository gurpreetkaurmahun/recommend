using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SoftwareProject {

    public class Location{

        public int LocationId { get; set; }

        public double Longitude { get; set; }
        public double Latitude { get; set; }


        [Required]
        public string SupermarketName { get; set; }
        public string FullLocation { get; set; }

        public int ConsumerId { get; set; }
        public  Consumer? Consumer { get; set; }

        public ICollection<ProductLocation> ProductLocations { get; set; }

   

        
    }
}