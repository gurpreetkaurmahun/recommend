using System.Collections.Generic;
using Microsoft.Playwright;
using SoftwareProject.Interfaces;
using SoftwareProject.Models;
using SoftwareProject.Service;

namespace SoftwareProject.Scrapper {

    public class AsdaScrapper:IWebscrapper
    
    {

        private readonly CategoryService _categoryService;

        public AsdaScrapper(){
            _categoryService=new CategoryService();
        }

public async Task<List<string>> GetProductLinks(string brand,string product)
{
    var productLinks = new List<string>();

    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        Headless = true,  // Set to true for production use
        SlowMo = 50  // Slow down Playwright operations by 50ms
    });

    var context = await browser.NewContextAsync(new BrowserNewContextOptions
    {
        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    });

    var page = await context.NewPageAsync();

    try
    {
        await page.SetExtraHTTPHeadersAsync(new Dictionary<string, string>
        {
            {"Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8"}
        });

        var encodedProduct =Uri.EscapeDataString($"{brand} {product}");
      

        var url = $"https://groceries.asda.com/search/{encodedProduct}";
        
        Console.WriteLine($"Navigating to: {url}");
        var response = await page.GotoAsync(url, new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60000  // Increase timeout to 60 seconds
        });

        if (!response.Ok)
        {
            Console.WriteLine($"Failed to load the page. Status: {response.Status}");
            return productLinks;
        }

       await page.WaitForSelectorAsync("a.co-product__anchor", new PageWaitForSelectorOptions { Timeout = 60000 });

        // Extract product links
        var links = await page.EvaluateAsync<string[]>(@"
            Array.from(document.querySelectorAll('a.co-product__anchor'))
                .map(a => a.href)
        ");

        foreach (var link in links)
        {
            if (!string.IsNullOrEmpty(link))
            {
                productLinks.Add(link);
                if (productLinks.Count == 5) break; // Limit to 5 unique links
            }
        }

        Console.WriteLine($"Found {productLinks.Count} unique links");

        // Print the links
        foreach (var link in productLinks)
        {
            Console.WriteLine(link);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }

    return productLinks;
}

public async Task<List<Product>> GetProductDetails(List<string> urls, string brand, string product)
{
    List<Product> products = new List<Product>();

    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        Headless = true // Set to true for headless operation
    });

    foreach (string url in urls)
    {
        try
        {
            Console.WriteLine($"Fetching URL: {url}");

            var context = await browser.NewContextAsync(new BrowserNewContextOptions
            {
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            });

            var page = await context.NewPageAsync();

            var response = await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 60000 // 60 seconds timeout
            });

            if (response.Ok)
            {
                // Ensure the page is fully loaded and elements are visible
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
                await page.WaitForSelectorAsync("h1", new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 30000 });

                var title = await page.EvaluateAsync<string>("() => document.querySelector('h1')?.innerText || 'Title not found'");
                Console.WriteLine($"Extracted title: {title}");

                bool brandMatch = string.IsNullOrEmpty(brand) || title.Contains(brand, StringComparison.OrdinalIgnoreCase);
                bool productMatch = string.IsNullOrEmpty(product) || title.Contains(product, StringComparison.OrdinalIgnoreCase);

                if (!brandMatch && !productMatch)
                {
                    Console.WriteLine($"Skipping product as it doesn't match the expected brand or product name: {title}");
                    continue;
                }

                // var price = await page.EvaluateAsync<string>(@"() => {
                //     const priceElement = document.querySelector('.pdp-main-details__price-container .co-product__price');
                //     return priceElement ? priceElement.innerText.trim() : 'Price not found';
                // }");
                var price = await page.EvaluateAsync<string>(@"() => {
                    const priceElement = document.querySelector('.pdp-main-details__price-container .co-product__price');
                    if (priceElement) {
                        let price = priceElement.innerText.trim();
                        return price.replace(/^now\s*/i, ''); // Remove 'now' from the beginning
                    }
                    return 'Price not found';
                }");

                // var pricePerPiece = await page.EvaluateAsync<string>(@"() => {
                //     const element = document.querySelector('.co-product__price-per-uom');
                //     return element ? element.innerText.trim() : 'Price per piece not found';
                // }");
                 var pricePerPiece = await page.EvaluateAsync<string>(@"() => {
                    const element = document.querySelector('.co-product__price-per-uom');
                    if (element) {
                        let price = element.innerText.trim();
                        return price.replace(/^\(|\)$/g, ''); // Remove brackets
                    }
                    return 'Price per piece not found';
                }");

                var imageUrl = await page.EvaluateAsync<string>(@"() => {
                    const imgElement = document.querySelector('img.asda-img.asda-image');
                    return imgElement ? imgElement.src : 'Image not found';
                }");
                Console.WriteLine($"Extracted image URL: {imageUrl}");

                // Categorize the product
                var categoryName = _categoryService.CategorizeProduct(title);
                var category = new Category { CategoryName = categoryName };

                products.Add(new Product
                {
                    ProductName = title,
                    Price = price,
                    ImageUrl = imageUrl,
                    pricePerUnit = pricePerPiece,
                    ImageLogo = "https://cdn.dribbble.com/users/432077/screenshots/2731784/attachments/553941/asda2.jpg",
                    Url = url,
                    IsAvailable = true,
                    Date = DateOnly.FromDateTime(DateTime.Now),
                    Category = category, // Assign the category
                    CategoryId = category.CategoryId // Assign the category ID (if available)
                });
            }
            else
            {
                Console.WriteLine($"Failed to load page: {url}. Status: {response.Status}");
            }

            await context.CloseAsync();

            // Random delay to mimic human behavior and avoid being blocked
            await Task.Delay(TimeSpan.FromSeconds(new Random().Next(5, 15)));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to get details for URL: {url}. Error: {ex.Message}");
        }
    }

    return products;
}






    }
}