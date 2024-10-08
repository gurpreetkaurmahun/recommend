
using Microsoft.Playwright;
using SoftwareProject.Interfaces;
using SoftwareProject.Models;
using SoftwareProject.Service;
namespace SoftwareProject.Scrapper {

public class TescoScrapper:IWebscrapper

{

    private readonly CategoryService _categoryService;

        public TescoScrapper(){
            _categoryService=new CategoryService();
        }

public async Task<List<string>> GetProductLinks(string brand, string product)
{
    var productLinks = new List<string>();
    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        Headless = false,
        SlowMo = 50
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

        var encodedProduct = Uri.EscapeDataString($"{brand} {product}");
        var url = $"https://www.tesco.com/groceries/en-GB/search?query={encodedProduct}";
        Console.WriteLine($"Navigating to: {url}");

        var response = await page.GotoAsync(url, new PageGotoOptions
        {
            WaitUntil = WaitUntilState.NetworkIdle,
            Timeout = 60000
        });

        if (!response.Ok)
        {
            Console.WriteLine($"Failed to load the page. Status: {response.Status}");
            return productLinks;
        }

        Console.WriteLine("Page loaded successfully. Waiting for content...");

        // Wait for any of these selectors to appear
        var selectors = new[] { ".product-list--list-item", ".product-tile", ".ddsweb-title-link__link" };
        var element = await page.WaitForSelectorAsync(string.Join(",", selectors), new PageWaitForSelectorOptions { Timeout = 60000 });

        if (element == null)
        {
            Console.WriteLine("No product elements found on the page.");
            Console.WriteLine("Page content:");
            Console.WriteLine(await page.ContentAsync());
            await page.ScreenshotAsync(new PageScreenshotOptions { Path = "debug_screenshot.png" });
            return productLinks;
        }

        Console.WriteLine("Product elements found. Extracting links...");

        // Try different selectors to find product links
        var selectorQueries = new[]
        {
            ".ddsweb-title-link__link[href^='/groceries/en-GB/products/']",
            "a[data-auto='product-tile--title']",
            ".product-tile a[href^='/groceries/en-GB/products/']"
        };

        foreach (var query in selectorQueries)
        {
            Console.WriteLine($"Trying selector: {query}");
            var links = await page.QuerySelectorAllAsync(query);
            Console.WriteLine($"Found {links.Count} elements with selector {query}");

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
                        Console.WriteLine($"Added link: {href}");
                    }
                    if (productLinks.Count == 3) break;
                }
                break; // Stop if we found links with this selector
            }
        }

        Console.WriteLine($"Found {productLinks.Count} links");

        if (productLinks.Count == 0)
        {
            Console.WriteLine("No links found. Taking screenshot for debugging...");
            await page.ScreenshotAsync(new PageScreenshotOptions { Path = "debug_screenshot.png" });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }

    return productLinks;
}
// public async Task<List<string>> GetProductLinks(string brand,string product)
// {
//     var productLinks = new List<string>();

//     using var playwright = await Playwright.CreateAsync();
//     await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
//     {
//         Headless = false,  // Set to true for production use
//         SlowMo = 50  // Slow down Playwright operations by 50ms
//     });

//     var context = await browser.NewContextAsync(new BrowserNewContextOptions
//     {
//         UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//     });

//     var page = await context.NewPageAsync();

//     try
//     {
//         await page.SetExtraHTTPHeadersAsync(new Dictionary<string, string>
//         {
//             {"Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8"}
//         });

//         var encodedProduct =Uri.EscapeDataString($"{brand} {product}");
//         var url = $"https://www.tesco.com/groceries/en-GB/search?query={encodedProduct}";
        
//         Console.WriteLine($"Navigating to: {url}");
//         var response = await page.GotoAsync(url, new PageGotoOptions
//         {
//             WaitUntil = WaitUntilState.NetworkIdle,
//             Timeout = 60000  // Increase timeout to 60 seconds
//         });

//         if (!response.Ok)
//         {
//             Console.WriteLine($"Failed to load the page. Status: {response.Status}");
//             return productLinks;
//         }

//         // Wait for any of these selectors to appear
//         var selectors = new[] { "li.product-list--list-item", ".product-tile" };
//         var element = await page.WaitForSelectorAsync(string.Join(",", selectors), new PageWaitForSelectorOptions { Timeout = 60000 });

//         if (element == null)
//         {
//             Console.WriteLine("No product elements found on the page.");
//             Console.WriteLine("Page content:");
//             Console.WriteLine(await page.ContentAsync());
//             return productLinks;
//         }

//         // Try different selectors to find product links
//         var selectorQueries = new[]
//         {
//             "li.product-list--list-item a[href^='/groceries/en-GB/products/']",
//             ".product-tile a[href^='/groceries/en-GB/products/']"
//         };

//         foreach (var query in selectorQueries)
//         {
//             var links = await page.QuerySelectorAllAsync(query);
//             if (links.Count > 0)
//             {
//                 foreach (var link in links)
//                 {
//                     var href = await link.GetAttributeAsync("href");
//                     if (!string.IsNullOrEmpty(href))
//                     {
//                         if (!href.StartsWith("http"))
//                         {
//                             href = "https://www.tesco.com" + href;
//                         }
//                         productLinks.Add(href);
//                     }

//                     if (productLinks.Count == 3) break; 
//                 }
//                 break;  // Stop if we found links with this selector
//             }
//         }

//         Console.WriteLine($"Found {productLinks.Count} links");

        
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"An error occurred: {ex.Message}");
//         Console.WriteLine($"Stack trace: {ex.StackTrace}");
//     }

//     return productLinks;
// }


public async Task<List<Product>> GetProductDetails(List<string> urls, string brand, string product)
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

                // Check if the title contains the brand and product
                bool brandMatch = string.IsNullOrEmpty(brand) || title.Contains(brand, StringComparison.OrdinalIgnoreCase);
                bool productMatch = string.IsNullOrEmpty(product) || title.Contains(product, StringComparison.OrdinalIgnoreCase);

                if (!brandMatch || !productMatch)
                {
                    Console.WriteLine($"Skipping product as it doesn't match the expected brand or product name: {title}");
                    continue; // Skip to the next URL
                }

                var category = await page.EvaluateAsync<string>(@"() => {
                    const breadcrumbItems = document.querySelectorAll('ol.base-components__BaseList-sc-150pv2j-2 li.styled__ListItem-sc-li57wm-3');
                    return Array.from(breadcrumbItems).map(item => item.innerText.trim()).join(' > ');
                }");

                Console.WriteLine($"Extracted category: {category}");

                // Extract price using the specific class
                var price = await page.EvaluateAsync<string>(@"() => {
                    const priceElement = document.querySelector('p.text__StyledText-sc-1jpzi8m-0.lmgzsH.ddsweb-text.styled__PriceText-sc-v0qv7n-1.eNIEDh');
                    return priceElement ? priceElement.innerText.trim() : 'Price not found';
                }");

                var imageUrl = await page.EvaluateAsync<string>("() => document.querySelector('img.ddsweb-responsive-image__image')?.src || 'Image not found'");
                Console.WriteLine($"Extracted image URL: {imageUrl}");

                // Extract price per unit using the specific class
                var pricePerPiece = await page.EvaluateAsync<string>(@"() => {
                    const element = document.querySelector('p.text__StyledText-sc-1jpzi8m-0.dyJCjQ.ddsweb-text.styled__Subtext-sc-v0qv7n-2.nsITR.ddsweb-price__subtext');
                    return element ? element.innerText.trim() : 'Price per piece not found';
                }");

                var categoryName = _categoryService.CategorizeProduct(title);
                var newCategory = new Category { CategoryName = categoryName };

                products.Add(new Product
                {
                    ProductName = title,
                    Price = price,
                    ImageUrl = imageUrl,
                    pricePerUnit = pricePerPiece,
                    ImageLogo = "https://cdn.prod.website-files.com/63f6e52346a353ca1752970e/644fb7a65f01016bb504d02c_20230501T1259-553128f8-5bb8-4582-81d0-66fae3937e6f.jpeg",
                    Url = url,
                    IsAvailable = true,
                    Date = DateOnly.FromDateTime(DateTime.Now),
                    Category = newCategory,
                    CategoryId = newCategory.CategoryId
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