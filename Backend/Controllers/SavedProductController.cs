using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;

using SoftwareProject.Helpers;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        private readonly ILogger<SavedProductController> _logger; 

        public SavedProductController(ApplicationDbContext context,ILogger<SavedProductController> logger)
        {
            _context = context;
            _logger=logger;
        }

        // GET: api/SavedProduct
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedProduct>>> GetSavedProduct()
        {

            try{
                _logger.LogInformationWithMethod($" Retreiving SavedProducts:===>");

            //Prodcuts saved with consumerid as key and product as valuue

            var savedProducts = await _context.SavedProducts
            .Include(sp => sp.Product)
            .Include(sp => sp.Consumer)
            .Where(sp => sp.ConsumerId != null) // Filter out any null ConsumerId
            .GroupBy(sp => sp.ConsumerId!.Value) // Use non-nullable value
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
            .ToDictionaryAsync(x => x.ConsumerId, x => x.Products);
                _logger.LogInformationWithMethod("Saved Products retreived Sucessfully");
                return Ok(savedProducts);
            }
            catch(Exception ex){

                _logger.LogErrorWithMethod($"Failed to SavedProducts:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

            }
          
        }

        // GET: api/SavedProduct/5
        [HttpGet("{consumerId}")]
        public async Task<ActionResult<Dictionary<int, List<SavedProduct>>>> GetSavedProduct(int consumerId)
        {

            try{
                _logger.LogInformationWithMethod($"Checking the databse for  saved products with id:");
            var savedProducts = await _context.SavedProducts
            .Where(sp => sp.ConsumerId == consumerId)
            .Include(sp => sp.Product)
            .ToListAsync();

                if (savedProducts == null || !savedProducts.Any())
                {
                    _logger.LogErrorWithMethod($"Saved Product with id: doesnot exists");
                    return NotFound();
                }
                _logger.LogInformationWithMethod($"Providing details of product with id:");

                var result=new Dictionary<int,List<SavedProduct>>{
                    {consumerId,savedProducts}
                };
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"An error occured :{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");
            }
          
        }

        // PUT: api/SavedProduct/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{consumerId}/{productId}")]
        public async Task<IActionResult> PutSavedProduct(int consumerId, int productId,SavedProduct savedProduct)
        {
            

            try
            {
                 if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }


                if (consumerId != savedProduct.ConsumerId || productId != savedProduct.ProductId)
                {

                    _logger.LogErrorWithMethod($"Please recheck the id.");
                    return BadRequest();
                }

                   var existingSavedProduct = await _context.SavedProducts
            .AsNoTracking() // This ensures we're not tracking the entity
            .Include(sp => sp.Product)
            .FirstOrDefaultAsync(sp => sp.ConsumerId == consumerId && sp.ProductId == productId);

        if (existingSavedProduct == null)
        {
            _logger.LogErrorWithMethod("Saved Product not found");
            return NotFound();
        }

        // Update only the DateSaved field
        existingSavedProduct.DateSaved = savedProduct.DateSaved;

        _context.Update(existingSavedProduct); // Use Update method instead of changing entity state
        await _context.SaveChangesAsync();

             _logger.LogInformationWithMethod($"Saved Product with id:{consumerId} successfully updated"); 
             return Ok(existingSavedProduct);

            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!SavedProductExists(consumerId))
                {

                    _logger.LogErrorWithMethod($"Saved Product with is:{consumerId} not found in the system");
                    return NotFound();
                }
                    _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }

            catch (Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
        }

        // POST: api/SavedProduct
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SavedProduct>> PostSavedProduct(SavedProduct savedProduct)
        {
           
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                 _context.SavedProducts.Add(savedProduct);
                 await _context.SaveChangesAsync();
                  _logger.LogInformationWithMethod($"Saved Product saved by consumer wioth id:{savedProduct.ConsumerId} with  added successfully");
                 return CreatedAtAction("GetSavedProduct", new { id = savedProduct.ConsumerId }, savedProduct);
            }
            catch (DbUpdateException ex)
            {
                if (SavedProductExists(savedProduct.ConsumerId))
                {

                    _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                    return Conflict();
                }
                   _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                    return StatusCode(500,$"Failed with error:{ex.Message}");
            }

            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }

           
        }

        // DELETE: api/SavedProduct/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSavedProduct(int? id)
        {

            try{
                _logger.LogInformationWithMethod($"Searching for SavedProduct with id:{id}");
                var savedProduct = await _context.SavedProducts.FindAsync(id);
                if (savedProduct == null)
                {

                    _logger.LogErrorWithMethod($"SAved product with id {id}not found in the system");
                    return NotFound();
                }

                _context.SavedProducts.Remove(savedProduct);
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($"SavedProduct with id:{id} deleted sucessfully");
                return NoContent();

            }
            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
           
        }

        private bool SavedProductExists(int? id)
        {
            return _context.SavedProducts.Any(e => e.ConsumerId == id);
        }
    }
}
