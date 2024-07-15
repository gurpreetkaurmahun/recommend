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
    public class ProductLocationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductLocationController> _logger; 

        public ProductLocationController(ApplicationDbContext context,ILogger<ProductLocationController> logger)
        {
            _context = context;
            _logger=logger;
        }

        // GET: api/ProductLocation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductLocation>>> GetProductLocations()
        {

            try{
                _logger.LogInformationWithMethod("Retreiving all the product locations");
                var productLocations = await _context.ProductLocations
                .Include(pl => pl.Product)
                .Include(pl => pl.Location)
                .GroupBy(pl=>pl.Product.ProductName)
               .Select(group => new
            {
                ProductName = group.Key,
                Locations = group.Select(pl => pl.Location.FullLocation).ToList()
            })
            .ToDictionaryAsync(
                item => item.ProductName,
                item => item.Locations
            );
                _logger.LogInformationWithMethod($"ProductLocations retreived Sucessfully:==>");
                return Ok(productLocations);
        }

        catch(Exception ex){
              _logger.LogErrorWithMethod($"Failed to retrieve ProductLocations:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

        }
            }

      

        // GET: api/ProductLocation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductLocation>> GetProductLocation(int? id)
        {

            try{
                _logger.LogInformationWithMethod($"Checking system for productLocation with id:{id}");
                 var productLocation = await _context.ProductLocations
                .Include(pl => pl.Product)
                .Include(pl => pl.Location)
                .Where(pl => pl.ProductId == id)
                .GroupBy(pl => pl.Product.ProductName)
                .Select(group => new
                {
                    ProductName = group.Key,
                    Locations = group.Select(pl => pl.Location.FullLocation).ToList()
                })
                .ToDictionaryAsync(
                    item => item.ProductName,
                    item => item.Locations
                );

                if (productLocation == null)
                {

                    _logger.LogErrorWithMethod($"Failed to retrieve ProductLocation with id {id}");
                    return NotFound($"Failed to retrieve ProductLocation with id {id}");
                }
                _logger.LogInformationWithMethod($"Providing details of ProductLocation with id:{id}");
                return Ok(productLocation);
            }
            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed to retrieve ProductLocation with id:{id}:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

            }
          
        }

        // PUT: api/ProductLocation/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductLocation(int? id, ProductLocation productLocation)
        {
            

            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                if (id != productLocation.ProductId)
                {
                    _logger.LogErrorWithMethod($"Error:Please check the id");
                    return BadRequest();
                }

                _context.Entry(productLocation).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($"Product location with id:{id} successfully updated");
                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ProductLocationExists(id))
                {
                    _logger.LogErrorWithMethod($"Productlocation with id:{id} not found in the system");
                    return NotFound();
                }
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
               
            }

            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }

           
        }

        // POST: api/ProductLocation
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductLocation>> PostProductLocation(ProductLocation productLocation)
        {
           
            try
            {
                 if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                 _context.ProductLocations.Add(productLocation);
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($"Product location with  added successfully");
                return CreatedAtAction("GetProductLocation", new { id = productLocation.ProductId }, productLocation);
            }
            catch (DbUpdateException ex)
            {
                if (ProductLocationExists(productLocation.ProductId))
                {
                    _logger.LogErrorWithMethod($"ProductLocation with id:{productLocation.ProductId} already exists");
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

        // DELETE: api/ProductLocation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductLocation(int? id)
        {

            try{

            _logger.LogInformationWithMethod($"Searching for ProductLocation with id:{id}");
            var productLocation = await _context.ProductLocations.FindAsync(id);

            if (productLocation == null)
            {
                _logger.LogErrorWithMethod($"Product with id:{id} not found");
                return NotFound();
            }

            _context.ProductLocations.Remove(productLocation);
            await _context.SaveChangesAsync();
            _logger.LogInformationWithMethod($"ProductLocation with id:{id} deleted sucessfully");

            return NoContent();
            }
            catch(Exception ex){

                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
            
        }

        private bool ProductLocationExists(int? id)
        {
            return _context.ProductLocations.Any(e => e.ProductId == id);
        }
    }
}
