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
    public class SavedProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SavedProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SavedProduct
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedProduct>>> GetSavedProduct()
        {
            return await _context.SavedProduct.ToListAsync();
        }

        // GET: api/SavedProduct/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SavedProduct>> GetSavedProduct(int? id)
        {
            var savedProduct = await _context.SavedProduct.FindAsync(id);

            if (savedProduct == null)
            {
                return NotFound();
            }

            return savedProduct;
        }

        // PUT: api/SavedProduct/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSavedProduct(int? id, SavedProduct savedProduct)
        {
            if (id != savedProduct.ConsumerId)
            {
                return BadRequest();
            }

            _context.Entry(savedProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavedProductExists(id))
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

        // POST: api/SavedProduct
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SavedProduct>> PostSavedProduct(SavedProduct savedProduct)
        {
            _context.SavedProduct.Add(savedProduct);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SavedProductExists(savedProduct.ConsumerId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSavedProduct", new { id = savedProduct.ConsumerId }, savedProduct);
        }

        // DELETE: api/SavedProduct/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSavedProduct(int? id)
        {
            var savedProduct = await _context.SavedProduct.FindAsync(id);
            if (savedProduct == null)
            {
                return NotFound();
            }

            _context.SavedProduct.Remove(savedProduct);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SavedProductExists(int? id)
        {
            return _context.SavedProduct.Any(e => e.ConsumerId == id);
        }
    }
}
