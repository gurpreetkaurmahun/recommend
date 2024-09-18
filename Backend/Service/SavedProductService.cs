using SoftwareProject.Models;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

using Microsoft.AspNetCore.Mvc;

namespace  SoftwareProject.Service{

    public class SavedProductService{

        private readonly ApplicationDbContext _context;
        private readonly ILogger<SavedProductService> _logger;

        public SavedProductService( ApplicationDbContext context,ILogger<SavedProductService> logger)
        {
            _context=context;
            _logger=logger;
        }

        public async Task<Dictionary<int, List<object>>> SavedProductsByConsumers()
        {
            try
            {
                _logger.LogInformationWithMethod("Retrieving SavedProducts ===>");

                var savedProducts = await _context.SavedProducts
                    .Include(sp => sp.Product)
                    .Include(sp => sp.Consumer)
                    .Where(sp => sp.ConsumerId != null)
                    .GroupBy(sp => sp.ConsumerId!.Value)
                    .Select(group => new
                    {
                        ConsumerId = group.Key,
                        Products = group.Select(sp => new
                        {
                            ProductName = sp.Product.ProductName,
                            ConsumerName = sp.Consumer.FName,
                            DateSaved = sp.DateSaved,
                        }).ToList()
                    })
                    .ToDictionaryAsync(x => x.ConsumerId, x => x.Products.Cast<object>().ToList());

                _logger.LogInformationWithMethod("Saved Products retrieved successfully");
                return savedProducts;
            }
            catch (Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed to retrieve SavedProducts: {ex.Message}");
                return null;
            }

        }
        public async Task<Dictionary<int, List<object>>> GetSavedProductForConsumer(int consumerId)
        {
            try
            {
                _logger.LogInformationWithMethod($"Checking saved products for Consumer with id: {consumerId}");
                var savedProducts = await _context.SavedProducts
                .Where(sp => sp.ConsumerId == consumerId)
                .Include(sp => sp.Product)
                .ToListAsync();

                if (savedProducts == null || !savedProducts.Any())
                {
                    _logger.LogInformationWithMethod($"No saved products found for Consumer with id: {consumerId}");
                    return new Dictionary<int, List<object>> { { consumerId, new List<object>() } };
                }

                _logger.LogInformationWithMethod($"Providing details of saved products for Consumer with id: {consumerId}");

                var result = new Dictionary<int, List<object>>
                {
                {consumerId,
                savedProducts.Select(sp => new
                {
                    Product = new
                    {
                        sp.Product.ProductId,
                        sp.Product.TempId,
                        sp.Product.ProductName,
                        sp.Product.Price,
                        sp.Product.ImageUrl,
                        sp.Product.pricePerUnit,
                        sp.Product.Url,
                        sp.Product.Date,
                        sp.Product.IsAvailable,
                        sp.Product.SupermarketName
                    }
                }).ToList<object>()}};

                return result;
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"An error occurred while retrieving savedProducts for Consumer: {ex}");
                return null;
            }

        }

        public async Task<(SavedProduct product,string message)> AddSavedProduct([FromBody] JsonElement jsonElement)
        {
            try
            {
        
                var tempId = jsonElement.GetProperty("TempId").GetString();
                var consumerId = jsonElement.GetProperty("ConsumerId").GetInt32();
                var dateSaved = DateTime.Parse(jsonElement.GetProperty("DateSaved").GetString());

                if (string.IsNullOrEmpty(tempId))
                {
                    _logger.LogError("TempId is required");
                    return (null,"TempId is required");
                }

                // Find the product using products  TempId
                var product = await _context.Products.FirstOrDefaultAsync(p => p.TempId == tempId);
                if (product == null)
                {
                    _logger.LogError($"Product with TempId {tempId} not found");
                    return (null,$"Product with TempId {tempId} not found");
                }

                // Check if the product is already saved by this consumer
                var existingSavedProduct = await _context.SavedProducts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(sp => sp.TempId == tempId && sp.ConsumerId == consumerId);

                if (existingSavedProduct != null)
                {
                    _logger.LogError("Product already saved by the consumer");
                    return (null,"Product already saved by the consumer");
                }

                // Create a new SavedProduct entry
                var newSavedProduct = new SavedProduct
                {
                    ProductId = product.ProductId,
                    ConsumerId = consumerId,
                    DateSaved = dateSaved,
                    TempId = tempId // Save the TempId
                };
                _context.SavedProducts.Add(newSavedProduct);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Saved Product added successfully. ConsumerId: {newSavedProduct.ConsumerId}, Id: {newSavedProduct.TempId}");
                return (newSavedProduct,$"Saved Product For Consumer with id:{consumerId}");
            }
    
            catch (Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (null,"Update request failed due to some internal error. Try again.");
            }
        
        }

        public async Task<(bool result, string message)> DeleteSavedProductForConsumer(int consumerId,string tempId)
        {
            try
            {
                
                _logger.LogInformationWithMethod($"Searching for SavedProduct with ConsumerId:{consumerId} and ProductId:{tempId}");
                
                if(consumerId==null ||tempId==null){

                    _logger.LogErrorWithMethod($"SAved product with id {tempId}    not found in the system");
                    return (false,"Invalid values for ConsumerId and SavedProductID entered");
                }
            
                var savedProduct = await _context.SavedProducts
                        .FirstOrDefaultAsync(sp => sp.ConsumerId == consumerId && sp.Product.TempId == tempId);

                    if (savedProduct == null)
                    {

                        _logger.LogErrorWithMethod($"SAved product with id {tempId}not found in the system");
                        return (false,$"Saved product with id {tempId}not found in the system");
                    }

                    _context.SavedProducts.Remove(savedProduct);
                    await _context.SaveChangesAsync();

                    _logger.LogInformationWithMethod($"SavedProduct with id:{tempId} deleted sucessfully");
                    return(true, $"SavedProduct with id:{tempId} deleted sucessfully");

                }
                catch(Exception ex)
                {
                    _logger.LogErrorWithMethod($" Error occurred while deleting SavedProduct with id:{tempId}");
                    return (false,$" Error occurred while deleting SavedProduct with id:{tempId}");
                }

            }
        }
    }