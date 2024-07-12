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
    public class WebScrapperController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WebScrapperController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/WebScrapper
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WebScrapper>>> GetWebScrappers()
        {
            return await _context.WebScrappers.ToListAsync();
        }

        // GET: api/WebScrapper/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WebScrapper>> GetWebScrapper(int id)
        {
            var webScrapper = await _context.WebScrappers.FindAsync(id);

            if (webScrapper == null)
            {
                return NotFound();
            }

            return webScrapper;
        }

        // PUT: api/WebScrapper/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWebScrapper(int id, WebScrapper webScrapper)
        {
            if (id != webScrapper.ScrapeId)
            {
                return BadRequest();
            }

            _context.Entry(webScrapper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WebScrapperExists(id))
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

        // POST: api/WebScrapper
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WebScrapper>> PostWebScrapper(WebScrapper webScrapper)
        {
            _context.WebScrappers.Add(webScrapper);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWebScrapper", new { id = webScrapper.ScrapeId }, webScrapper);
        }

        // DELETE: api/WebScrapper/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWebScrapper(int id)
        {
            var webScrapper = await _context.WebScrappers.FindAsync(id);
            if (webScrapper == null)
            {
                return NotFound();
            }

            _context.WebScrappers.Remove(webScrapper);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WebScrapperExists(int id)
        {
            return _context.WebScrappers.Any(e => e.ScrapeId == id);
        }
    }
}
