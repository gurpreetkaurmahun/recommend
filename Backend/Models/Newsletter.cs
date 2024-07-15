using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SoftwareProject.Models;


namespace SoftwareProject.Models {

    public class Newsletter{
        [Key]
        public int LetterId { get; set; }
        public string Content { get; set; }

        public DateOnly Date { get; set; }


        [ForeignKey("Consumer")]
        public int? ConsumerId{ get; set; }
        public Consumer? Consumer{get;set;}

    }
}