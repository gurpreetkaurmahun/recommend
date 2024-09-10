
namespace SoftwareProject.Models {

public class SavedProduct{

     public int? ProductId { get; set; }
     public int? ConsumerId { get; set; }
      public DateTime DateSaved{get;set;}
      public string TempId { get; set; }
      public Product? Product{get;set;}
      public Consumer? Consumer { get; set; }
    }


}