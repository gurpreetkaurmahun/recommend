
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;
using System.Text.Json;

using SoftwareProject.Helpers;
using SoftwareProject.Service;


namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        private readonly ILogger<SavedProductController> _logger; 
        private readonly SavedProductService _savedProductService;

        public SavedProductController(ApplicationDbContext context,ILogger<SavedProductController> logger,SavedProductService savedProductService)
        {
            _context = context;
            _logger=logger;
            _savedProductService=savedProductService;
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
        public async Task<ActionResult<Dictionary<int, List<object>>>> GetSavedProduct(int consumerId)
        {

            var result= await _savedProductService.GetSavedProductForConsumer(consumerId);
            if(result!=null){
                return Ok(new{Message="Retreived SavedProducst",data=result});
            }
            else{
                return BadRequest(new{Message="Falied To retreive saved products"});
            }

    
                }
    

        // PUT: api/SavedProduct/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPut("{consumerId}/{productId}")]
        // public async Task<IActionResult> PutSavedProduct(int consumerId, int productId,SavedProduct savedProduct)
        // {
            

        //     try
        //     {
        //          if (!ModelState.IsValid)
        //         {
        //             _logger.LogErrorWithMethod($"Invalid request");
        //             return BadRequest(ModelState);
        //         }


        //         if (consumerId != savedProduct.ConsumerId || productId != savedProduct.ProductId)
        //         {

        //             _logger.LogErrorWithMethod($"Please recheck the id.");
        //             return BadRequest();
        //         }

        //            var existingSavedProduct = await _context.SavedProducts
        //     .AsNoTracking() // This ensures we're not tracking the entity
        //     .Include(sp => sp.Product)
        //     .FirstOrDefaultAsync(sp => sp.ConsumerId == consumerId && sp.ProductId == productId);

        // if (existingSavedProduct == null)
        // {
        //     _logger.LogErrorWithMethod("Saved Product not found");
        //     return NotFound();
        // }

        // // Update only the DateSaved field
        // existingSavedProduct.DateSaved = savedProduct.DateSaved;

        // _context.Update(existingSavedProduct); // Use Update method instead of changing entity state
        // await _context.SaveChangesAsync();

        //      _logger.LogInformationWithMethod($"Saved Product with id:{consumerId} successfully updated"); 
        //      return Ok(existingSavedProduct);

        //     }
        //     catch (DbUpdateConcurrencyException ex)
        //     {
        //         if (!SavedProductExists(consumerId))
        //         {

        //             _logger.LogErrorWithMethod($"Saved Product with is:{consumerId} not found in the system");
        //             return NotFound();
        //         }
        //             _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
        //           return StatusCode(500,$"Failed with error:{ex.Message}");
        //     }

        //     catch (Exception ex){
        //          _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
        //           return StatusCode(500,$"Failed with error:{ex.Message}");
        //     }
        // }

        // POST: api/SavedProduct
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
[HttpPost]
public async Task<ActionResult<SavedProduct>> PostSavedProduct([FromBody] JsonElement jsonElement)
{

    var (result,message)=await _savedProductService.AddSavedProduct(jsonElement);
    if(result!=null){
        return Ok(new{message="Prodcut saved for the consumer"});
    }
    else{
        return BadRequest(new{message="Erroo Saving product for the consumer"});
    }
    }


 


        // DELETE: api/SavedProduct/5
        [HttpDelete("{consumerId}/{tempId}")]
        public async Task<IActionResult> DeleteSavedProduct(int consumerId,string tempId)
        {

            var (result,message)=await _savedProductService.DeleteSavedProductForConsumer(consumerId,tempId);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
           
        }

        // private bool SavedProductExists(int? id)
        // {
        //     return _context.SavedProducts.Any(e => e.ConsumerId == id);
        // }
    }
}
