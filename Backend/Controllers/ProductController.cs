using Microsoft.AspNetCore.Mvc;
using SoftwareProject.Service;
using SoftwareProject.Models;
using SoftwareProject.Helpers;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> _logger; 
        private readonly ProductService _productService;

        public ProductController(ILogger<ProductController> logger,ProductService productService)
        {
            _logger=logger;
            _productService=productService;

        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var (allProducts,message)=await _productService.GetAllProductsAsync();
            if(allProducts!=null){
                _logger.LogInformationWithMethod(message);
                return Ok(allProducts);
            }
            else{
                _logger.LogErrorWithMethod(message);
                return StatusCode(500,message);
            }
           
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var (product,message) = await _productService.GetProductByIdAsync(id) ;
            if(product!=null){
                _logger.LogInformationWithMethod(message);
                return Ok(product);
            }
            else{
                _logger.LogErrorWithMethod(message);
                return StatusCode(500,message);
            }

        }

        // PUT: api/Product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            var (result,message)=await _productService.UpdateProductAsync(id,product);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
        }

        // POST: api/Product
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            var(newProduct,message)=await _productService.AddNewProductAsync(product);

            if(newProduct!=null){
                return Ok(new{product,message});
            }
            else{
                return BadRequest(message);
            }
            
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var (result,message)= await _productService.DeleteProductAsync(id);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(message);
            }
        }

        [HttpDelete]
        [Route("delete-all")]
        public async Task<IActionResult> DeleteAllProducts()
        {
            var (result, message) = await _productService.DeleteAllProductsAsync();
            if (result)
            {
                _logger.LogInformationWithMethod(message);
                return Ok(new { message });
            }
            else
            {
                _logger.LogErrorWithMethod(message);
                return StatusCode(500, new { message });
            }
        }
    }
}
