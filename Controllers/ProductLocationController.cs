using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject;
using SoftwareProject.Models;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductLocationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductLocationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductLocation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductLocation>>> GetProductLocations()
        {

            var productLocations = await _context.ProductLocations
        .Include(pl => pl.Product)
        .Include(pl => pl.Location)
        .Select(pl => new
        {
            
            ProductName = pl.Product.ProductName,
            LocationName = pl.Location.FullLocation,
            // Include other properties from ProductLocation if needed
        })
        .ToListAsync();
            return Ok(productLocations);
        }

        // GET: api/ProductLocation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductLocation>> GetProductLocation(int? id)
        {
            var productLocation = await _context.ProductLocations.FindAsync(id);

            if (productLocation == null)
            {
                return NotFound();
            }

            return productLocation;
        }

        // PUT: api/ProductLocation/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductLocation(int? id, ProductLocation productLocation)
        {
            if (id != productLocation.ProductId)
            {
                return BadRequest();
            }

            _context.Entry(productLocation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductLocationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ProductLocation
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductLocation>> PostProductLocation(ProductLocation productLocation)
        {
            _context.ProductLocations.Add(productLocation);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductLocationExists(productLocation.ProductId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductLocation", new { id = productLocation.ProductId }, productLocation);
        }

        // DELETE: api/ProductLocation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductLocation(int? id)
        {
            var productLocation = await _context.ProductLocations.FindAsync(id);
            if (productLocation == null)
            {
                return NotFound();
            }

            _context.ProductLocations.Remove(productLocation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductLocationExists(int? id)
        {
            return _context.ProductLocations.Any(e => e.ProductId == id);
        }
    }
}
