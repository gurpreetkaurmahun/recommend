using System.Collections.Generic;
using Microsoft.Playwright;
using SoftwareProject.Interfaces;
using SoftwareProject.Models;

namespace SoftwareProject.Scrapper {

public class SainsburyScrapper:IWebscrapper

{

  public async Task<List<string>> GetProductLinks(string product)
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

            var encodedProduct = Uri.EscapeDataString(product);
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

                        if (productLinks.Count == 2) break; 
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

public async Task<List<Product>> GetProductDetails(List<string> urls)
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
            Console.WriteLine($"Fetching URL: {url}");

            var page = await context.NewPageAsync();
            await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 120000 // 100 seconds timeout for navigation
            });

            // Wait for the content to be loaded
            await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

            // Extract product title
            var titleSelector = "h1.pd__header[data-test-id='pd-product-title']";
            await page.WaitForSelectorAsync(titleSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
            var title = await page.EvaluateAsync<string>($"() => document.querySelector('{titleSelector}')?.innerText || 'Title not found'");
            Console.WriteLine($"Extracted title: {title}");

            // Extract product price
            var priceSelector = "[data-test-id='pd-retail-price']";
            await page.WaitForSelectorAsync(priceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
            var price = await page.EvaluateAsync<string>($"() => document.querySelector('{priceSelector}')?.innerText || 'Price not found'");
            Console.WriteLine($"Extracted price: {price}");

            // Extract price per piece
            var pricePerPieceSelector = "[data-test-id='pd-unit-price']";
            await page.WaitForSelectorAsync(pricePerPieceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
            var pricePerPiece = await page.EvaluateAsync<string>($"() => document.querySelector('{pricePerPieceSelector}')?.innerText || 'Price per piece not found'");
            Console.WriteLine($"Extracted price per piece: {pricePerPiece}");

            // Extract image URL
            var imageSelector = "img.pd__image[data-test-id='pd-selected-image']";
            await page.WaitForSelectorAsync(imageSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
            var imageUrl = await page.EvaluateAsync<string>($"() => document.querySelector('{imageSelector}')?.src || 'Image not found'");
            Console.WriteLine($"Extracted image URL: {imageUrl}");

            if (!string.IsNullOrEmpty(title))
            {
                products.Add(new Product
                {
                    ProductName = title,
                    Price = price,
                    ImageUrl = imageUrl,
                    pricePerUnit = pricePerPiece,
                    Url = url,
                    IsAvailable = true,
                    Date = DateOnly.FromDateTime(DateTime.Now)
                });
                Console.WriteLine($"Successfully processed: {title}");
                Console.WriteLine($"Price: {price}");
                Console.WriteLine($"Image URL: {imageUrl}");
                Console.WriteLine($"Product Url: {url}");
                Console.WriteLine();
            }
            else
            {
                Console.WriteLine($"Failed to extract details for URL: {url}");
            }

            await context.CloseAsync();

            // Add a random delay between requests
            await Task.Delay(TimeSpan.FromSeconds(new Random().Next(5, 15)));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing URL {url}: {ex.Message}");
        }
    }

    return products;
}

}



}