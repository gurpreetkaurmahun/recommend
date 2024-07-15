using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SoftwareProject.Interfaces;
using SoftwareProject.Models;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Controllers;

using SoftwareProject.Scrapper;
namespace SoftwareProject.Scrapper{

    public class ScrapingService{
    //     private readonly IWebscrapper _aldiScrapper;
    //     private readonly IWebscrapper _asdaScrapper;
    //     private readonly IWebscrapper _sainsburyScrapper;
    //     private readonly IWebscrapper _tescoScrapper;
    private readonly IEnumerable<IWebscrapper> _scrappers;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScrapingService> _logger;
        


      public ScrapingService(
    IEnumerable<IWebscrapper> scrappers,
    ApplicationDbContext context,
    ILogger<ScrapingService> logger)
{
    _scrappers = scrappers;
    _context = context;
    _logger = logger;
}

public async Task ScrapeAndSaveProducts()
{

      try
    {
        _logger.LogInformation("Starting scraping process");
        _logger.LogInformation("Enter Product you want to search on Tesco/Sainsbury/Aldi/Asda");
        var product = "chicken"; // You can replace this with user input if needed

        var Tscraper = new TescoScrapper();
        var Sscraper = new SainsburyScrapper();
        var Ascraper = new AldiScrapper();
        var asScrapper = new AsdaScrapper();

        var allProducts = new List<(string source, Product Product)>();

        var scrappers = new List<(string Name, Func<string, Task<List<string>>> GetLinks, Func<List<string>, Task<List<Product>>> GetDetails)>
        {
            ("Aldi", Ascraper.GetProductLinks, Ascraper.GetProductDetails),
            ("Tesco", Tscraper.GetProductLinks, Tscraper.GetProductDetails),
            ("Sainsbury", Sscraper.GetProductLinks, Sscraper.GetProductDetails),
            ("Asda", asScrapper.GetProductLinks, asScrapper.GetProductDetails)
        };

        // Creating a list of async tasks, one for each scrapper
        var tasks = scrappers.Select(async scrapper =>
        {
            var (name, getLinks, getDetails) = scrapper;
            _logger.LogInformation($"Scraping from {name} for: {product}");

            try
            {
                var productLinks = await getLinks(product);
                _logger.LogInformation($"Found {productLinks.Count} links for {name}");
                var products = await getDetails(productLinks);
                _logger.LogInformation($"Scraped {products.Count} products from {name}");

                return products.Select(prod => (name, prod)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error scraping {name}: {ex.Message}");
                return new List<(string, Product)>();
            }
        }).ToList();

        var results = await Task.WhenAll(tasks);

        foreach (var result in results)
        {
            allProducts.AddRange(result);
        }

        foreach (var (source, prod) in allProducts)
        {
            Console.WriteLine();
            Console.WriteLine($"Source:{source} : Title:{prod.ProductName}, Price: {prod.Price}, Image: {prod.ImageUrl}, price per piece: {prod.pricePerUnit}");
            Console.WriteLine();
        }

        _logger.LogInformation($"Total products scraped: {allProducts.Count}");

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                foreach (var (source, prod) in allProducts)
                {
                    _logger.LogInformation($"Source:{source} : Title:{prod.ProductName ?? "Unknown"}, Price: {prod.Price ?? "0"}, Image: {prod.ImageUrl}, Price per piece: {prod.pricePerUnit ?? "Unknown"}");

                    var dbProduct = new Product
                    {
                        ProductName = prod.ProductName ?? "Unknown",
                        Price = prod.Price ?? "0",
                        ImageUrl = prod.ImageUrl ?? "",
                        pricePerUnit = prod.pricePerUnit ?? "",
                        Url = prod.Url ?? "",
                        Date = DateOnly.FromDateTime(DateTime.UtcNow),
                        IsAvailable = true,
                        SupermarketName = source
                    };

                   _context.Products.Add(dbProduct);
                }

                var savedCount = await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                _logger.LogInformation($"Saved {savedCount} products to the database");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error saving products to database: {ex.Message}");
            }
        }

        _logger.LogInformation("Scraping process completed");
    }
    catch (Exception ex)
    {
        _logger.LogError($"An error occurred: {ex.Message}");
    }
}
}
    
    
    
    
    }