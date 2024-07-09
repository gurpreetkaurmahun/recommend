using System.Collections.Generic;
using Microsoft.Playwright;

namespace SoftwareProject {

public class TescoScrapper{

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
        var url = $"https://www.tesco.com/groceries/en-GB/search?query={encodedProduct}";
        
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
        var selectors = new[] { "li.product-list--list-item", ".product-tile" };
        var element = await page.WaitForSelectorAsync(string.Join(",", selectors), new PageWaitForSelectorOptions { Timeout = 60000 });

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
            "li.product-list--list-item a[href^='/groceries/en-GB/products/']",
            ".product-tile a[href^='/groceries/en-GB/products/']"
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
                            href = "https://www.tesco.com" + href;
                        }
                        productLinks.Add(href);
                    }

                    if (productLinks.Count == 2) break; 
                }
                break;  // Stop if we found links with this selector
            }
        }

        Console.WriteLine($"Found {productLinks.Count} links");

        
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
        List<Product> products = new List<Product>();

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false // Set to true for production
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

                var response = await page.GotoAsync(url);

                if (response.Ok)
                {
                    // Wait for the content to load
                    await page.WaitForSelectorAsync("h1[data-auto='pdp-product-title']");

                    // Extract title
                    var title = await page.EvaluateAsync<string>("() => document.querySelector('h1[data-auto=\"pdp-product-title\"]')?.innerText || 'Title not found'");
                    Console.WriteLine($"Extracted title: {title}");

                    // Extract price
                  var price = await page.EvaluateAsync<string>(@"() => {
                   
                    const selectors = [
                        'p.ddsweb-text.styled__PriceText',
                        '[data-auto=""pdp-price""]',
                        '.price',
                        '[itemprop=""price""]',
                        '[class*=""price""]'
                    ];
                    for (let selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) return element.innerText.trim();
                    }
                    return 'Price not found';
                }");

                    // Extract image URL
                    var imageUrl = await page.EvaluateAsync<string>("() => document.querySelector('img.ddsweb-responsive-image__image')?.src || 'Image not found'");
                    Console.WriteLine($"Extracted image URL: {imageUrl}");

                     var pricePerPiece = await page.EvaluateAsync<string>(@"() => {
                    const element = document.querySelector('.ddsweb-price__subtext');
                    return element ? element.innerText.trim() : 'Price per piece not found';
                }");

                    // Add product to list
                    products.Add(new Product
                    {
                        ProductName = title,
                        Price = price,
                        ImageUrl = imageUrl,
                        pricePerUnit=pricePerPiece,
                        Url=url

                    });
                }
                else
                {
                    Console.WriteLine($"Failed to load page: {url}. Status: {response.Status}");
                }

                await context.CloseAsync();

                // Add a random delay between requests
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