using System.Collections.Generic;
using System.Threading.Tasks;
using SoftwareProject.Models;

namespace SoftwareProject.Interfaces{

    public interface IWebscrapper{
        Task<List<string>> GetProductLinks(string product);

        Task<List<Product>> GetProductDetails(List<string> urls);



    }
}