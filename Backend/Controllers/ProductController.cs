using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject;
using SoftwareProject.Models;
using SoftwareProject.Helpers;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

          private readonly ILogger<ProductController> _logger; 

        public ProductController(ApplicationDbContext context,ILogger<ProductController> logger)
        {
            _context = context;
            _logger=logger;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {

            try{
                _logger.LogInformationWithMethod($" Retreiving Products===>");
                var products=await _context.Products.ToListAsync();
                _logger.LogInformationWithMethod("Sucessfully retreived Products");

                return Ok(products);

            }

            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed to retrieve Products:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

            }
           
        }


        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {

            try{

            _logger.LogInformationWithMethod($"Checking system for product with id:{id}");
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                 _logger.LogErrorWithMethod($"Failed to retrieve Product with id {id}");
                return NotFound();
            }
            _logger.LogInformationWithMethod($"Providing details of product with id:{id}");
            return product;
            }
            catch( Exception ex){
                 _logger.LogErrorWithMethod($"Failed to retrieve Product with id {id}, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");


            }
         
        }

        // PUT: api/Product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            

            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }

                if (id != product.ProductId)
                {
                    _logger.LogErrorWithMethod($"Error:Please check the id");
                    return BadRequest();
                }

                _logger.LogInformationWithMethod($"Updating Product with id:{id}");

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformationWithMethod($"Product with id:{id} successfully updated");
                return Ok(new { message = $"Changes made to  Product with ProductId {product.ProductId}" });
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ProductExists(id))
                {
                      _logger.LogErrorWithMethod($"Product with id:{id} not found");
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

        // POST: api/Product
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            try{

                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                _logger.LogInformationWithMethod($"Product with name:{product.ProductName } added sucessfully");
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);

            }catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
            
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {

            try{
                _logger.LogInformationWithMethod($"Searching for Product with id:{id}");
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {

                    _logger.LogErrorWithMethod($"Product with id:{id} not found");
                    return NotFound();
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                _logger.LogInformationWithMethod($"Product with id:{id} deleted sucessfully");

                return NoContent();

            }catch(Exception ex){

                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
            
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
