
using Microsoft.AspNetCore.Mvc;
using SoftwareProject.Models;
using System.Text.Json;
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
            var result=await _savedProductService.SavedProductsByConsumers();
            if (result == null)
            {
                return BadRequest(new { Message = "Failed to retrieve saved products for consumers" });
            }
            else{
                 return Ok(new { Message = "Retrieved SavedProducts", Data = result });
            }
        }

        // GET: api/SavedProduct/5
        [HttpGet("{consumerId}")]
        public async Task<ActionResult<Dictionary<int, List<object>>>> GetSavedProduct(int consumerId)
        {
            var result = await _savedProductService.GetSavedProductForConsumer(consumerId);
            if (result == null)
            {
                return BadRequest(new { Message = "Failed to retrieve saved products" });
            }
            if (result.ContainsKey(consumerId) && result[consumerId].Count == 0)
            {
                return Ok(new { Message = "No saved products found for this user", Data = result });
            }
            return Ok(new { Message = "Retrieved SavedProducts", Data = result });
    
        }
    
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
                return BadRequest(new{message});
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
    }
}
