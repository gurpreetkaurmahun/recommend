using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject;
using SoftwareProject.Models;
using  SoftwareProject.Helpers;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebScrapperController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<WebScrapperController> _logger; 

        public WebScrapperController(ApplicationDbContext context,ILogger<WebScrapperController> logger)
        {
            _context = context;
            _logger=logger;
        }

        // GET: api/WebScrapper
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WebScrapper>>> GetWebScrappers()
        {

            try{
                _logger.LogInformationWithMethod("Retreiving WebScrappers:===>");
                var scrapper=await _context.WebScrappers.ToListAsync();
                _logger.LogInformationWithMethod("Providing Information regarding websites scrappers");
                return scrapper;
            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to SavedProducts:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

            }
            
        }

        // GET: api/WebScrapper/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WebScrapper>> GetWebScrapper(int id)
        {

            try{
                _logger.LogInformationWithMethod($"Checking the database for WebScrapper with id:{id}");
                var webScrapper = await _context.WebScrappers.FindAsync(id);

                if (webScrapper == null)
                {
                     _logger.LogErrorWithMethod($"Web Scrapper with id:{id} doesnot exists");
                    return NotFound();
                }
                 _logger.LogInformationWithMethod($"Providing details of Web Scrapper with id:{id}");
                return webScrapper;
            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"An error occured :{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");
            }
           
        }

        // PUT: api/WebScrapper/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWebScrapper(int id, WebScrapper webScrapper)
        {
          

            try
            {

                if (id != webScrapper.ScrapeId)
                {
                    _logger.LogErrorWithMethod($"Please recheck the id.");
                    return BadRequest();
                }

            _context.Entry(webScrapper).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                 _logger.LogInformationWithMethod($"Saved Product with id:{id} successfully updated");
                  return NoContent();

            }
            catch (DbUpdateConcurrencyException ex )
            {
                if (!WebScrapperExists(id))
                {
                     _logger.LogErrorWithMethod($"Web Scrapper with id:{id} not found in the system");
                    return NotFound();
                }
                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
            catch (Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }

            return NoContent();
        }

        // POST: api/WebScrapper
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WebScrapper>> PostWebScrapper(WebScrapper webScrapper)
        {

            try{
                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                 _context.WebScrappers.Add(webScrapper);
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($"Web Scrapper with id:{webScrapper.ScrapeId} with  added successfully");
                return CreatedAtAction("GetWebScrapper", new { id = webScrapper.ScrapeId }, webScrapper);
            }
            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
           
        }

        // DELETE: api/WebScrapper/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWebScrapper(int id)
        {

            try{
                _logger.LogInformationWithMethod($"Searching for Web Scrapper with id:{id}");
                var webScrapper = await _context.WebScrappers.FindAsync(id);
                if (webScrapper == null)
                {
                    _logger.LogErrorWithMethod($"WebScrapper with id {id}not found in the system");
                    return NotFound();
                }

            _context.WebScrappers.Remove(webScrapper);
            await _context.SaveChangesAsync();
             _logger.LogInformationWithMethod($"WebScrapper with id:{id} deleted sucessfully");
            return NoContent();
            }

            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
            }
            
        }

        private bool WebScrapperExists(int id)
        {
            return _context.WebScrappers.Any(e => e.ScrapeId == id);
        }
    }
}
