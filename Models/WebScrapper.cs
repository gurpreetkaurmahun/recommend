using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SoftwareProject {

    public class WebScrapper{

        [Key]
        public int ScrapeId { get; set; }
        public string WebsiteName { get; set; }

        public string  Url { get; set; }
        public DateOnly ScrappedDate { get; set; }
        public int? ProductId { get; set; }

        public Product? Product { get; set; }
   
        public string ScraperType { get; set; }
        
    }
}