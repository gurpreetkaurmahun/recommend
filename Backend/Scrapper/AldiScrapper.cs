using System.Collections.Generic;
using Microsoft.Playwright;
using SoftwareProject.Interfaces;
using SoftwareProject.Service;
using SoftwareProject.Models;

namespace SoftwareProject.Scrapper {

    public class AldiScrapper:IWebscrapper
    {


        private readonly CategoryService _categoryService;
        public AldiScrapper()
        {
            _categoryService = new CategoryService();
        }


    

   public async Task<List<string>> GetProductLinks(string brand,string product)
    {
        var productLinks = new List<string>();

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false,  // Set to true for production use
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
            var url = $"https://groceries.aldi.co.uk/en-GB/Search?keywords={encodedProduct}";
            
            Console.WriteLine($"Navigating to: {url}");
            var response = await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 100000  // Increase timeout to 60 seconds
            });

            if (!response.Ok)
            {
                Console.WriteLine($"Failed to load the page. Status: {response.Status}");
                return productLinks;
            }

            // Wait for any of these selectors to appear
          await page.WaitForSelectorAsync("a[data-qa='search-product-title']", new PageWaitForSelectorOptions { Timeout = 30000 });

        // Extract product links
        var links = await page.EvaluateAsync<string[]>(@"
            Array.from(document.querySelectorAll('a[data-qa=""search-product-title""]'))
                .map(a => a.href)
        ");

        foreach (var link in links)
        {
            if (!string.IsNullOrEmpty(link))
            {
                productLinks.Add(link);
                if (productLinks.Count == 5) break; // Limit to 1 unique links
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
        Headless = false, // Set to false for debugging, true for production
        SlowMo = 50
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

            await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 60000 // 60 seconds timeout
            });

            // Wait for the price element to be visible
            await page.WaitForSelectorAsync("span[property='price'][data-qa='product-price'] span.product-price", new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 30000 });

            var title = await page.EvaluateAsync<string>("() => document.querySelector('h1')?.innerText || 'Title not found'");
            Console.WriteLine($"Extracted title: {title}");

            var price = await page.EvaluateAsync<string>(@"() => {
                const priceElement = document.querySelector('span[property=""price""][data-qa=""product-price""] span.product-price');
                return priceElement ? priceElement.innerText.trim() : 'Price not found';
            }");
            Console.WriteLine($"Extracted price: {price}");

            var pricePerUnit = await page.EvaluateAsync<string>(@"() => {
                const element = document.querySelector('div.small.text-gray-small p.m-0 small[property=""price""][data-qa=""product-price""] span');
                return element ? element.innerText.trim() : 'Price per unit not found';
            }");
            Console.WriteLine($"Extracted price per unit: {pricePerUnit}");

            var imageUrl = await page.EvaluateAsync<string>("() => document.querySelector('img.product-main-img')?.src || 'Image not found'");
            Console.WriteLine($"Extracted image URL: {imageUrl}");

            // Categorize the product
            var categoryName = _categoryService.CategorizeProduct(title);
            var category = new Category { CategoryName = categoryName };

            products.Add(new Product
            {
                ProductName = title,
                Price = price,
                ImageUrl = imageUrl,
                pricePerUnit = pricePerUnit,
                ImageLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__s0KOdG9gCDQSeTtBwgrLCNa2ctqu1TohA&s",
                Url = url,
                IsAvailable = true,
                Date = DateOnly.FromDateTime(DateTime.Now),
                Category = category,
                CategoryId = category.CategoryId
            });

            await context.CloseAsync();
            await Task.Delay(TimeSpan.FromSeconds(new Random().Next(5, 15)));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to get details for URL: {url}. Error: {ex.Message}");
        }
    }

    return products;
}


}}

// public async Task<List<Product>> GetProductDetails(List<string> urls,string brand,string product)
// {
//     List<Product> products = new List<Product>();

//     using var playwright = await Playwright.CreateAsync();
//     await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
//     {
//         Headless = false // Set to true for production
//     });

//     foreach (string url in urls)
//     {
//         try
//         {
//             Console.WriteLine($"Fetching URL: {url}");

//             var context = await browser.NewContextAsync(new BrowserNewContextOptions
//             {
//                 UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//             });

//             var page = await context.NewPageAsync();

//             var response = await page.GotoAsync(url, new PageGotoOptions
//             {
//                 WaitUntil = WaitUntilState.NetworkIdle,
//                 Timeout = 60000 // 60 seconds timeout
//             });

//             if (response.Ok)
//             {
//                 // Wait for the content to load
//                 await page.WaitForSelectorAsync("h1", new PageWaitForSelectorOptions { Timeout = 30000 });

//                 // Extract title
//                 var title = await page.EvaluateAsync<string>("() => document.querySelector('h1')?.innerText || 'Title not found'");
//                 Console.WriteLine($"Extracted title: {title}");

//                  if (!title.Contains(brand, StringComparison.OrdinalIgnoreCase) || 
//                             !title.Contains(product, StringComparison.OrdinalIgnoreCase))
//                         {
//                             Console.WriteLine($"Skipping product as it doesn't match the expected brand or product name: {title}");
//                             continue; // Skip to the next URL
//                         }

//                 // Extract price
//               var price = await page.EvaluateAsync<string>(@"() => {
//     const priceElement = document.querySelector('span[property=""price""][data-qa=""product-price""] span.product-price');
//     return priceElement ? priceElement.innerText.trim() : 'Price not found';
// }");

//                 // Extract image URL
//                 var imageUrl = await page.EvaluateAsync<string>("() => document.querySelector('img.product-main-img')?.src || 'Image not found'");
//                 Console.WriteLine($"Extracted image URL: {imageUrl}");

//                 // Extract price per piece
//                 var pricePerPiece = await page.EvaluateAsync<string>(@"() => {
//     const element = document.querySelector('div.small.text-gray-small p.m-0 small[property=""price""][data-qa=""product-price""] span');
//     return element ? element.innerText.trim() : 'Price per piece not found';
// }");

//                 // Add product to list
//                 products.Add(new Product
//                 {
//                     ProductName = title,
//                     Price = price,
//                     ImageUrl = imageUrl,
//                     pricePerUnit = pricePerPiece,
//                     ImageLogo ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYqauB9RFJqt7rS9eY18Rm9Uen7G0cSDR7w&s",
//                     Url = url,
//                     IsAvailable = true,
//                     Date = DateOnly.FromDateTime(DateTime.Now)
//                 });
//             }
//             else
//             {
//                 Console.WriteLine($"Failed to load page: {url}. Status: {response.Status}");
//             }

//             await context.CloseAsync();

//             // Add a random delay between requests
//             await Task.Delay(TimeSpan.FromSeconds(new Random().Next(5, 15)));
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Failed to get details for URL: {url}. Error: {ex.Message}");
//         }
//     }

//     return products;
// }
// }



// }