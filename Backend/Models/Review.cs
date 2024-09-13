using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SoftwareProject.Models {

    public class Review{
        [Key]
        public int ReviewId { get; set; }

        public string review { get; set; }

        public DateOnly reviewDate{get;set;}

        public int stars{get;set;}
        public int? ConsumerId { get; set; }
        public virtual Consumer? Consumer { get; set; }

        public string UserEmail { get; set; }
       // This attribute ensures the property is not mapped to the database
        public string ConsumerName { get; set; }
        
    }
}