using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Scrapper;
using SoftwareProject.Interfaces;
using SoftwareProject.Controllers;
using SoftwareProject.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlite(builder.Configuration.GetConnectionString("Connection")));

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<EmailService>();


builder.Services.AddScoped<IWebscrapper,AldiScrapper>();
builder.Services.AddScoped<IWebscrapper,AsdaScrapper>();
builder.Services.AddScoped<IWebscrapper,SainsburyScrapper>();
builder.Services.AddScoped<IWebscrapper,TescoScrapper>();
// builder.Services.AddScoped<ScrapingService>();
builder.Services.AddScoped<AppJwtBearerEvents>();
builder.Services.AddScoped<RolesController>();
// builder.Services.AddScoped<LogSupport>();
// builder.Services.AddScoped<TokenRevocation>();
builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                    options.EventsType = typeof(AppJwtBearerEvents);
                    });


var app = builder.Build();
// app.Lifetime.ApplicationStarted.Register(async () =>
// {
//     using var scope = app.Services.CreateScope();
//     var scraperService = scope.ServiceProvider.GetRequiredService<ScrapingService>();
//     await scraperService.ScrapeAndSaveProducts();});
    // using var scope = app.Services.CreateScope();
    // var services = scope.ServiceProvider;
    // var logger = services.GetRequiredService<ILogger<Program>>();
    // var dbContext = services.GetRequiredService<ApplicationDbContext>();

//     try
//     {
//         logger.LogInformation("Starting scraping process");
//         logger.LogInformation("Enter Product you want to search on Tesco/Sainsbury/Aldi/Asda");
//         var product = "chicken"; // You can replace this with user input if needed

//         var Tscraper = new TescoScrapper();
//         var Sscraper = new SainsburyScrapper();
//         var Ascraper = new AldiScrapper();
//         var asScrapper = new AsdaScrapper();

//         var allProducts = new List<(string source, Product Product)>();

//         var scrappers = new List<(string Name, Func<string, Task<List<string>>> GetLinks, Func<List<string>, Task<List<Product>>> GetDetails)>
//         {
//             ("Aldi", Ascraper.GetProductLinks, Ascraper.GetProductDetails),
//             ("Tesco", Tscraper.GetProductLinks, Tscraper.GetProductDetails),
//             ("Sainsbury", Sscraper.GetProductLinks, Sscraper.GetProductDetails),
//             ("Asda", asScrapper.GetProductLinks, asScrapper.GetProductDetails)
//         };

//         // Creating a list of async tasks, one for each scrapper
//         var tasks = scrappers.Select(async scrapper =>
//         {
//             var (name, getLinks, getDetails) = scrapper;
//             logger.LogInformation($"Scraping from {name} for: {product}");

//             try
//             {
//                 var productLinks = await getLinks(product);
//                 logger.LogInformation($"Found {productLinks.Count} links for {name}");
//                 var products = await getDetails(productLinks);
//                 logger.LogInformation($"Scraped {products.Count} products from {name}");

//                 return products.Select(prod => (name, prod)).ToList();
//             }
//             catch (Exception ex)
//             {
//                 logger.LogError($"Error scraping {name}: {ex.Message}");
//                 return new List<(string, Product)>();
//             }
//         }).ToList();

//         var results = await Task.WhenAll(tasks);

//         foreach (var result in results)
//         {
//             allProducts.AddRange(result);
//         }

//         foreach (var (source, prod) in allProducts)
//         {
//             Console.WriteLine();
//             Console.WriteLine($"Source:{source} : Title:{prod.ProductName}, Price: {prod.Price}, Image: {prod.ImageUrl}, price per piece: {prod.pricePerUnit}");
//             Console.WriteLine();
//         }

//         logger.LogInformation($"Total products scraped: {allProducts.Count}");

//         using (var transaction = await dbContext.Database.BeginTransactionAsync())
//         {
//             try
//             {
//                 foreach (var (source, prod) in allProducts)
//                 {
//                     logger.LogInformation($"Source:{source} : Title:{prod.ProductName ?? "Unknown"}, Price: {prod.Price ?? "0"}, Image: {prod.ImageUrl}, Price per piece: {prod.pricePerUnit ?? "Unknown"}");

//                     var dbProduct = new Product
//                     {
//                         ProductName = prod.ProductName ?? "Unknown",
//                         Price = prod.Price ?? "0",
//                         ImageUrl = prod.ImageUrl ?? "",
//                         pricePerUnit = prod.pricePerUnit ?? "",
//                         Url = prod.Url ?? "",
//                         Date = DateOnly.FromDateTime(DateTime.UtcNow),
//                         IsAvailable = true,
//                         SupermarketName = source
//                     };

//                     dbContext.Products.Add(dbProduct);
//                 }

//                 var savedCount = await dbContext.SaveChangesAsync();
//                 await transaction.CommitAsync();
//                 logger.LogInformation($"Saved {savedCount} products to the database");
//             }
//             catch (Exception ex)
//             {
//                 await transaction.RollbackAsync();
//                 logger.LogError($"Error saving products to database: {ex.Message}");
//             }
//         }

//         logger.LogInformation("Scraping process completed");
//     }
//     catch (Exception ex)
//     {
//         logger.LogError($"An error occurred: {ex.Message}");
//     }
// });

   

  
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapControllers();
app.UseHttpsRedirection();

app.MapGet("/scrapetest/{supermarket}", async (string supermarket) =>
{
    IWebscrapper scraper = supermarket.ToLower() switch
    {
        "tesco" => new TescoScrapper(),
        "asda" => new AsdaScrapper(),
        "sainsbury" => new SainsburyScrapper(),
        "aldi" => new AldiScrapper(),
        _ => throw new ArgumentException("Invalid supermarket")
    };

    try
    {
        var links = await scraper.GetProductLinks("eggs");
        var products = await scraper.GetProductDetails(links);
        return Results.Ok(new { LinkCount = links.Count, ProductCount = products.Count, Products = products });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { Error = ex.Message, StackTrace = ex.StackTrace });
    }
});





app.UseRouting();

// Make sure to add authentication middleware
app.UseAuthentication();

app.UseAuthorization();



app.UseRouting();
app.UseAuthorization();
app.Run();


