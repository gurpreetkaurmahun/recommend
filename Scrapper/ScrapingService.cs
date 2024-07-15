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

       public async Task ScrapeAndSaveProducts(string productName)
{
    var scrapingTasks = _scrappers.Select(async scrapper =>
    {
        var scrapperName = scrapper.GetType().Name.Replace("Scrapper", "");
        _logger.LogInformation($"Scraping from {scrapperName} for: {productName}");

        try
        {
            var productLinks = await scrapper.GetProductLinks(productName);
            var products = await scrapper.GetProductDetails(productLinks);

            return products.Select(prod => (scrapperName, prod)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error scraping {scrapperName}: {ex.Message}");
            return new List<(string, Product)>();
        }
    }).ToList();

    var results = await Task.WhenAll(scrapingTasks);

    var allProducts = results.SelectMany(x => x).ToList();

    await SaveProductsToDatabase(allProducts);
}
private async Task SaveProductsToDatabase(List<(string source, Product product)> products)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        foreach (var (source, product) in products)
        {
            var existingProduct = await _context.Products
                .FirstOrDefaultAsync(p => p.Url == product.Url);

            if (existingProduct == null)
            {
                product.Date = DateOnly.FromDateTime(DateTime.UtcNow);
                product.IsAvailable = true;
                product.SupermarketName = source;

                _context.Products.Add(product);
                _logger.LogInformation($"Added new product: {product.ProductName} from {source}");
            }
            else
            {
                UpdateExistingProduct(existingProduct, product, source);
            }
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
        _logger.LogInformation($"Saved {products.Count} products to database");
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError($"Error saving products to database: {ex.Message}");
        _logger.LogError($"Stack trace: {ex.StackTrace}");
        throw; // Re-throw the exception to be caught in the calling method
    }
}
private void UpdateExistingProduct(Product existingProduct, Product newProduct, string source)
{
    existingProduct.ProductName = newProduct.ProductName;
    existingProduct.Price = newProduct.Price;
    existingProduct.ImageUrl = newProduct.ImageUrl;
    existingProduct.pricePerUnit = newProduct.pricePerUnit;
    existingProduct.Date = DateOnly.FromDateTime(DateTime.UtcNow);
    existingProduct.IsAvailable = true;

    _logger.LogInformation($"Updated existing product: {existingProduct.ProductName} from {source}");
}
    }}