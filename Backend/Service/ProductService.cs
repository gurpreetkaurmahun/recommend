using SoftwareProject.Models;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace  SoftwareProject.Service{

    public class ProductService{

        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ApplicationDbContext context,ILogger<ProductService> logger){
            _context=context;
            _logger=logger;
        }


        public async Task<(List<object> products, string message)> GetAllProductsAsync()
        {
            try
            {
                var allProducts = await _context.Products
                    .Include(p => p.Category)
                    .Select(p => new
                    {
                        p.ProductId,
                        p.TempId,
                        p.ProductName,
                        p.Price,
                        p.ImageUrl,
                        p.pricePerUnit,
                        p.ImageLogo,
                        p.Url,
                        p.Date,
                        p.IsAvailable,
                        p.ConsumerId,
                        p.SupermarketName,
                        p.CategoryId,
                        CategoryName = p.Category.CategoryName
                    }).ToListAsync();

                _logger.LogInformation("Successfully retrieved products.");
                return (allProducts.Cast<object>().ToList(), "Successfully retrieved products.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to retrieve products with error: {ex.Message}");
                return (null, $"Failed to retrieve products with error: {ex}");
            }
        }

        public async Task<(Product product,string message)> GetProductByIdAsync(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    _logger.LogErrorWithMethod($"Failed to retrieve Product with id {id}");
                    return (null,$"Failed to retrieve Product with id {id}");
                }

                _logger.LogInformationWithMethod($"Providing details of product with id:{id}");
                return (product,"Sucessfully retreived product with id: {id}");

            }
            catch( Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed to retrieve Product with id {id}, Exception message:{ex.Message}");
                return (null,$"Failed to retrieve Product with id {id}");
            }
        }

        public async Task<(bool Result,string Message)> UpdateProductAsync(int id,Product product)
        {
            try
            {
                if (id != product.ProductId)
                {
                    _logger.LogErrorWithMethod($"Invalid request as provided id does not match with ProductId");
                    return (false,"Invalid request as provided id does not match with ProductId");
                }

                _logger.LogInformationWithMethod($"Updating Product with id:{id}");
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($"Product with id:{id} successfully updated");
                return (true,$"Product with id:{id} successfully updated");

            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ProductExists(id))
                {
                    _logger.LogErrorWithMethod($"Product does not exist in the database. Error message: {ex.Message}");
                    return (false, $"Product does not exist in the database");
                }

                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (false, "Update request failed due to some internal error. Try again.");
            }
            catch (Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (false,"Update request failed due to some internal error. Try again.");
            }
        }
        public async Task<(Product product,string message)> AddNewProductAsync(Product product)
        {
           try
           {

            _logger.LogInformationWithMethod($"Product with name:{product.ProductName } added sucessfully");
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return (product,$"Product with name {product.ProductName} added sucessfully");
            }
           catch(Exception ex)
           {
                _logger.LogErrorWithMethod($"Add request failed due to internal server error{ex.Message}");
                return (null,"Add request failed due to internal server error");
            }

        }
        public async Task<(bool result, string message)> DeleteProductAsync(int id)
        {
            try
            {
                _logger.LogInformationWithMethod($"Searching for Product with id:{id}");
                var product=await _context.Products.FindAsync(id);
                 
                if (product == null)
                {
                    _logger.LogErrorWithMethod($"Product with id:{id} not found");
                    return (false,$"Product with id:{id} not found");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                _logger.LogInformationWithMethod($"Product with id:{id} deleted sucessfully");
                return (true,$"Product with id:{id} deleted sucessfully");
            
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Delete request failed due to some internal server error: {ex.Message}");
                return (false,"Delete request failed due to some internal server error");
            }

        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }

        public async Task<(bool result, string message)> DeleteAllProductsAsync()
        {
            try
            {
                _context.Products.RemoveRange(_context.Products);
                await _context.SaveChangesAsync();
                return (true, "All products have been successfully deleted.");
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred while deleting products: {ex.Message}");
            }
        }


    }
}