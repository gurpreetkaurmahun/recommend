using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SoftwareProject.Models {

    public class Location{

        public int LocationId { get; set; }

        public double Longitude { get; set; }
        public double Latitude { get; set; }


        
        public string FullLocation { get; set; }

        public int? ConsumerId { get; set; }
        public  Consumer? Consumer { get; set; }

        public ICollection<ProductLocation>? ProductLocations { get; set; }

   

        
    }
}