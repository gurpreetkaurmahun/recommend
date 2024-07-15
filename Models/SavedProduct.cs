using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SoftwareProject.Models {

public class SavedProduct{

     public int? ProductId { get; set; }

     public Product? Product{get;set;}

    public int? ConsumerId { get; set; }
    public Consumer? Consumer { get; set; }

    public DateTime DateSaved{get;set;}


}


}