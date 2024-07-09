using System.Collections.Generic;
using Microsoft.Playwright;

namespace SoftwareProject {

    public class AsdaScrapper{

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
                if (productLinks.Count == 2) break; // Limit to 5 unique links
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
            var page = await context.NewPageAsync();
            await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 60000 // 60 seconds timeout for navigation
            });

            var product = new Product { Url = url };

            // Wait for the content to be loaded
            await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

            // Extract product title
            var titleSelector = "h1.pdp-main-details__title";
            await page.WaitForSelectorAsync(titleSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 20000 });
            product.ProductName = await page.TextContentAsync(titleSelector);

            // Extract product price
            var priceSelector = ".co-product__price.pdp-main-details__price";
            await page.WaitForSelectorAsync(priceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 20000 });
            product.Price = await page.TextContentAsync(priceSelector);


           var imageSelectors = new[] { ".asda-img.asda-image.asda-image-zoom__zoomed-image", ".asda-img.asda-image" };
            foreach (var selector in imageSelectors)
            {
                try
                {
                    await page.WaitForSelectorAsync(selector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 30000 });
                    product.ImageUrl = await page.GetAttributeAsync(selector, "src");
                    if (!string.IsNullOrEmpty(product.ImageUrl))
                        break;
                }
                catch (TimeoutException)
                {
                    Console.WriteLine($"Timeout waiting for image selector: {selector}");
                }
            }

            var pricePerPieceSelector = ".co-product__price-per-uom";
            try
            {
                await page.WaitForSelectorAsync(pricePerPieceSelector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible, Timeout = 10000 });
                product.pricePerUnit = await page.TextContentAsync(pricePerPieceSelector);
            }
            catch (TimeoutException)
            {
                Console.WriteLine("Price per piece not found");
                product.pricePerUnit = "N/A";
            }


            if (!string.IsNullOrEmpty(product.ProductName))
            {
                products.Add(product);
                Console.WriteLine($"Successfully processed: {product.ProductName }");
                Console.WriteLine($"Price: {product.Price}");
                Console.WriteLine($"Image URL: {product.ImageUrl}");
                Console.WriteLine();
                System.Console.WriteLine($"Product Url:{product.Url}");
                System.Console.WriteLine();
            }
            else
            {
                Console.WriteLine($"Failed to extract details for URL: {url}");
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




    }
}