using System.Collections.Generic;
using Microsoft.Playwright;
using SoftwareProject.Interfaces;
using SoftwareProject.Models;
using SoftwareProject.Service;

namespace SoftwareProject.Scrapper {

public class SainsburyScrapper:IWebscrapper

{
     private readonly CategoryService _categoryService;

        public SainsburyScrapper(){
            _categoryService=new CategoryService();
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
            var url = $"https://www.sainsburys.co.uk/gol-ui/SearchResults/{encodedProduct}";
            
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

            // Wait for any of these selectors to appear
            var selectors = new[] { "a.pt__link", ".product-tile", ".productNameAndPromotions" };
            var element = await page.WaitForSelectorAsync(string.Join(",", selectors), new PageWaitForSelectorOptions { Timeout = 30000 });

            if (element == null)
            {
                Console.WriteLine("No product elements found on the page.");
                Console.WriteLine("Page content:");
                Console.WriteLine(await page.ContentAsync());
                return productLinks;
            }

            // Try different selectors to find product links
            var selectorQueries = new[]
            {
                "a.pt__link",
                ".product-tile a",
                ".productNameAndPromotions a"
            };

            foreach (var query in selectorQueries)
            {
                var links = await page.QuerySelectorAllAsync(query);
                if (links.Count > 0)
                {
                    foreach (var link in links)
                    {
                        var href = await link.GetAttributeAsync("href");
                        if (!string.IsNullOrEmpty(href))
                        {
                            if (!href.StartsWith("http"))
                            {
                                href = "https://www.sainsburys.co.uk" + href;
                            }
                            productLinks.Add(href);
                        }

                        if (productLinks.Count == 5) break; 
                    }
                    break;  // Stop if we found links with this selector
                }
            }

            Console.WriteLine($"Found {productLinks.Count} links");

            // Print the first few links
            foreach (var link in productLinks.Take(2))
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
    var products = new List<Product>();

    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        Headless = false, // Set to true for production use
        Timeout = 60000 // 60 seconds timeout for the entire browser context
    });

    var context = await browser.NewContextAsync(new BrowserNewContextOptions
    {
        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    });

    foreach (var url in urls)
    {
        try
        {
            var page = await context.NewPageAsync();
            await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 60000 // 60 seconds timeout for navigation
            });

            var productLocal = new Product { Url = url };

            // Wait for the content to be loaded
            await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

            // Extract product title
            var titleSelector = "h1.pd__header[data-test-id='pd-product-title']";
            await page.WaitForSelectorAsync(titleSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
            productLocal.ProductName = await page.TextContentAsync(titleSelector);

            // Normalize and trim strings for comparison
            string normalizedTitle = productLocal.ProductName?.ToLowerInvariant().Trim();
            string normalizedBrand = brand.ToLowerInvariant().Trim();
            string normalizedProduct = product.ToLowerInvariant().Trim();

            // Check for partial matches
            bool brandMatch = string.IsNullOrEmpty(normalizedBrand) || normalizedTitle.Contains(normalizedBrand, StringComparison.OrdinalIgnoreCase);
            bool productMatch = normalizedTitle.Contains(normalizedProduct, StringComparison.OrdinalIgnoreCase);

            // Log extracted and expected values
            Console.WriteLine($"Extracted title: {normalizedTitle}");
            Console.WriteLine($"Expected brand: {normalizedBrand}, Expected product: {normalizedProduct}");
            Console.WriteLine($"Brand match: {brandMatch}, Product match: {productMatch}");

            // Check if the title contains the expected brand and product name
            if (brandMatch || productMatch)
            {
                // Extract product price
                var priceSelector = "[data-test-id='pd-retail-price']";
                await page.WaitForSelectorAsync(priceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
                productLocal.Price = await page.TextContentAsync(priceSelector);

                var pricePerPieceSelector = "[data-test-id='pd-unit-price']";
                await page.WaitForSelectorAsync(pricePerPieceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
                productLocal.pricePerUnit = await page.TextContentAsync(pricePerPieceSelector);

                // Extract image URL
                var imageSelector = "img.pd__image[data-test-id='pd-selected-image']";
                await page.WaitForSelectorAsync(imageSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
                productLocal.ImageUrl = await page.GetAttributeAsync(imageSelector, "src");

                productLocal.ImageLogo = "https://thegreatbritishporridgeco.co.uk/cdn/shop/articles/5d5fd2cf38c00ef4daae4c38_Sainsburys_Logo_2258x.jpg?v=1588282695";

                var categoryName = _categoryService.CategorizeProduct(productLocal.ProductName);
                var category = new Category { CategoryName = categoryName };

                productLocal.Category=category;
                productLocal.CategoryId=category.CategoryId;


                products.Add(productLocal);
                Console.WriteLine($"Successfully processed: {productLocal.ProductName}");
            }
            else
            {
                Console.WriteLine($"Skipping product as it doesn't match the expected brand or product name: {productLocal.ProductName}");
            }

            await page.CloseAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing URL {url}: {ex.Message}");
        }
    }

    return products;
}


    
// public async Task<List<Product>> GetProductDetails(List<string> urls,string brand,string productS)
// {
//     var products = new List<Product>();

//     using var playwright = await Playwright.CreateAsync();
//     await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
//     {
//         Headless = false, // Set to true for production use
//         Timeout = 60000 // 60 seconds timeout for the entire browser context
//     });

//     var context = await browser.NewContextAsync(new BrowserNewContextOptions
//     {
//         UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//     });

//     foreach (var url in urls)
//     {
//         try
//         {
//             var page = await context.NewPageAsync();
//             await page.GotoAsync(url, new PageGotoOptions
//             {
//                 WaitUntil = WaitUntilState.NetworkIdle,
//                 Timeout = 60000 // 60 seconds timeout for navigation
//             });

//             var product = new Product { Url = url };

//             // Wait for the content to be loaded
//             await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

//             // Extract product title
//             var titleSelector = "h1.pd__header[data-test-id='pd-product-title']";
//             await page.WaitForSelectorAsync(titleSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             product.ProductName = await page.TextContentAsync(titleSelector);

//             // Extract product price
//             var priceSelector = "[data-test-id='pd-retail-price']";
//             await page.WaitForSelectorAsync(priceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             product.Price = await page.TextContentAsync(priceSelector);

//             var pricePerPieceSelector = "[data-test-id='pd-unit-price']";
//             await page.WaitForSelectorAsync(pricePerPieceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             product.pricePerUnit = await page.TextContentAsync(pricePerPieceSelector);

//             // Extract image URL
//             var imageSelector = "img.pd__image[data-test-id='pd-selected-image']";
//             await page.WaitForSelectorAsync(imageSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             product.ImageUrl = await page.GetAttributeAsync(imageSelector, "src");

//             product.ImageLogo="https://thegreatbritishporridgeco.co.uk/cdn/shop/articles/5d5fd2cf38c00ef4daae4c38_Sainsburys_Logo_2258x.jpg?v=1588282695";

//             if (!string.IsNullOrEmpty(product.ProductName))
//             {
//                 products.Add(product);
           
                
//             }
//             else
//             {
//                 Console.WriteLine($"Failed to extract details for URL: {url}");
//             }

//             await page.CloseAsync();
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Error processing URL {url}: {ex.Message}");
//         }
//     }

//     return products;
// }


// public async Task<List<Product>> GetProductDetails(List<string> urls)
// {
//     var products = new List<Product>();

//     using var playwright = await Playwright.CreateAsync();
//     await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
//     {
//         Headless = false, // Set to true for production use
//         Timeout = 60000 // 60 seconds timeout for the entire browser context
//     });

//     var context = await browser.NewContextAsync(new BrowserNewContextOptions
//     {
//         UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//     });

//     foreach (var url in urls)
//     {
//         try
//         {
//             Console.WriteLine($"Fetching URL: {url}");

//             var page = await context.NewPageAsync();
//             await page.GotoAsync(url, new PageGotoOptions
//             {
//                 WaitUntil = WaitUntilState.NetworkIdle,
//                 Timeout = 120000 // 100 seconds timeout for navigation
//             });

//             // Wait for the content to be loaded
//             await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

//             // Extract product title
//             var titleSelector = "h1.pd__header[data-test-id='pd-product-title']";
//             await page.WaitForSelectorAsync(titleSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             var title = await page.EvaluateAsync<string>($"() => document.querySelector('{titleSelector}')?.innerText || 'Title not found'");
//             Console.WriteLine($"Extracted title: {title}");

//             // Extract product price
//             var priceSelector = "[data-test-id='pd-retail-price']";
//             await page.WaitForSelectorAsync(priceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             var price = await page.EvaluateAsync<string>($"() => document.querySelector('{priceSelector}')?.innerText || 'Price not found'");
//             Console.WriteLine($"Extracted price: {price}");

//             // Extract price per piece
//             var pricePerPieceSelector = "[data-test-id='pd-unit-price']";
//             await page.WaitForSelectorAsync(pricePerPieceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             var pricePerPiece = await page.EvaluateAsync<string>($"() => document.querySelector('{pricePerPieceSelector}')?.innerText || 'Price per piece not found'");
//             Console.WriteLine($"Extracted price per piece: {pricePerPiece}");

//             // Extract image URL
//             var imageSelector = "img.pd__image[data-test-id='pd-selected-image']";
//             await page.WaitForSelectorAsync(imageSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
//             var imageUrl = await page.EvaluateAsync<string>($"() => document.querySelector('{imageSelector}')?.src || 'Image not found'");
//             Console.WriteLine($"Extracted image URL: {imageUrl}");

//             if (!string.IsNullOrEmpty(title))
//             {
//                 products.Add(new Product
//                 {
//                     ProductName = title,
//                     Price = price,
//                     ImageUrl = imageUrl,
//                     pricePerUnit = pricePerPiece,
//                     Url = url,
//                     IsAvailable = true,
//                     Date = DateOnly.FromDateTime(DateTime.Now)
//                 });
//                 Console.WriteLine($"Successfully processed: {title}");
//                 Console.WriteLine($"Price: {price}");
//                 Console.WriteLine($"Image URL: {imageUrl}");
//                 Console.WriteLine($"Product Url: {url}");
//                 Console.WriteLine();
//             }
//             else
//             {
//                 Console.WriteLine($"Failed to extract details for URL: {url}");
//             }

//             await context.CloseAsync();

//             // Add a random delay between requests
//             await Task.Delay(TimeSpan.FromSeconds(new Random().Next(5, 15)));
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Error processing URL {url}: {ex.Message}");
//         }
//     }

//     return products;
// }

}



}