
using SoftwareProject.Interfaces;
using SoftwareProject.Models;
using Microsoft.EntityFrameworkCore;

namespace SoftwareProject.Scrapper{

    public class ScrapingService{
 
    private readonly IEnumerable<IWebscrapper> _scrappers;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScrapingService> _logger;
          private readonly IServiceProvider _serviceProvider;
        


      public ScrapingService(
    IEnumerable<IWebscrapper> scrappers,
    ApplicationDbContext context,
    ILogger<ScrapingService> logger,IServiceProvider serviceProvider)
{
    _scrappers = scrappers;
    _context = context;
    _logger = logger;
    _serviceProvider=serviceProvider;
}

public async Task<List<Product>> ScrapeAndSaveProducts(string brand,string product)
{
    try
    {
        _logger.LogInformation("Starting scraping process");
        _logger.LogInformation($"Searching for product: {product}");

        var allProducts = new List<Product>();
        var activeScrapers = await _context.WebScrappers
            .Where(ws => ws.IsActive)
            .ToListAsync();

        var scrappers = activeScrapers.Select(scraperConfig =>
        {
            var scraperType = Type.GetType(scraperConfig.TypeName);
            if (scraperType == null)
            {
                _logger.LogError($"Scraper type not found: {scraperConfig.TypeName}");
                // return (scraperConfig.Name, (Func<string, Task<List<string>>>)null, (Func<List<string>, Task<List<Product>>>)null);
                return (scraperConfig.Name, (Func<string, string, Task<List<string>>>)null, (Func<List<string>, string, string, Task<List<Product>>>)null);
            }

            var scraper = (IWebscrapper)ActivatorUtilities.CreateInstance(_serviceProvider, scraperType);
            return (scraperConfig.Name, scraper.GetProductLinks, scraper.GetProductDetails);
        }).Where(scrapper => scrapper.Item2 != null && scrapper.Item3 != null).ToList();

        var tasks = scrappers.Select(async scrapper =>
        {
            var (name, getLinks, getDetails) = scrapper;
            _logger.LogInformation($"Scraping from {name} for: {product}");

            try
            {
                var productLinks = await getLinks(brand,product);
                _logger.LogInformation($"Found {productLinks.Count} links for {name}");
                var products = await getDetails(productLinks,brand,product);
                _logger.LogInformation($"Scraped {products.Count} products from {name}");

                foreach (var prod in products)
                {
                    prod.SupermarketName = name;
                    prod.TempId = Guid.NewGuid().ToString();
                }

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error scraping {name}: {ex.Message}");
                return new List<Product>();
            }
        }).ToList();

        var results = await Task.WhenAll(tasks);

        foreach (var result in results)
        {
            allProducts.AddRange(result);
        }

        _logger.LogInformation($"Total products scraped: {allProducts.Count}");

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                foreach (var prod in allProducts)
                {
                    _logger.LogInformation($"Title: {prod.ProductName ?? "Unknown"}, Price: {prod.Price ?? "0"}, Image: {prod.ImageUrl}, Price per piece: {prod.pricePerUnit ?? "Unknown"}");


                    var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryName == prod.Category.CategoryName);

                    if (existingCategory == null)
                    {
                        // If not, create a new category
                        existingCategory = new Category { CategoryName = prod.Category.CategoryName };
                        _context.Categories.Add(existingCategory);
                        await _context.SaveChangesAsync(); // Save new category
                    }
                    var dbProduct = new Product
                    {
                        ProductName = prod.ProductName ?? "Unknown",
                        TempId = prod.TempId,
                        Price = prod.Price ?? "0",
                        ImageUrl = prod.ImageUrl ?? "",
                        ImageLogo=prod.ImageLogo,
                        pricePerUnit = prod.pricePerUnit ?? "",
                        Category = existingCategory, // Associate the product with the existing or new category
                        CategoryId = existingCategory.CategoryId,
                        Url = prod.Url ?? "",
                        Date = DateOnly.FromDateTime(DateTime.UtcNow),
                        IsAvailable = true,
                        SupermarketName = prod.SupermarketName
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
        return allProducts;
    }
    catch (Exception ex)
    {
        _logger.LogError($"An error occurred: {ex.Message}");
        return new List<Product>();
    }
}



}
    
    
    
    
    }

      