using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;
using SoftwareProject.Scrapper;
using SoftwareProject.Service;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebScrappersController : ControllerBase
    {
       

        private readonly ScrapingService _scrapingService;

        private readonly WebScrapperService _webScrappingService;
        private readonly ILogger<WebScrappersController> _logger;

        public WebScrappersController(ILogger<WebScrappersController> logger, ScrapingService scrapingService,WebScrapperService webScrappingService)
        {
            
            _logger=logger;
            _scrapingService=scrapingService;
            _webScrappingService=webScrappingService;
        }

        // GET: api/WebScrappers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WebScrapper>>> GetWebScrappers()
        {

            var (result,message)=await _webScrappingService.GetAllWebScrappers();
            if(result!=null){
                return Ok(result);
            }
            else{
                return BadRequest(new{message});
            }

            
        }

        // GET: api/WebScrappers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WebScrapper>> GetWebScrapper(int id)
        {
              var (result,message)=await _webScrappingService.GetWebScrapperById(id);
            if(result!=null){
                return Ok(result);
            }
            else{
                return BadRequest(new{message});
            }
           
        }

         [HttpPost("scrape")]
        public async Task<IActionResult> ScrapeProducts([FromBody] string product)
        {
            try
            {
                var scrapedProducts=await _scrapingService.ScrapeAndSaveProducts(product);
                 

                return Ok(new{message="Scraping completed successfully",
                productCount=scrapedProducts.Count});
            }
            catch (Exception ex)
            {
                return BadRequest(new{message=$"Error occurred during scraping:"});
            }
        }



        // PUT: api/WebScrappers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWebScrapper(int id, WebScrapper webScrapper)
        {

            var(result,message)=await _webScrappingService.UpdateWebScrapper(id,webScrapper);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
            
        }

        // POST: api/WebScrappers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WebScrapper>> PostWebScrapper(WebScrapper webScrapper)
        {
             var(result,message)=await _webScrappingService.AddNewScrapper(webScrapper);
            if(result!=null){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
           
        }

        // DELETE: api/WebScrappers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWebScrapper(int id)
        {
            
            var(result,message)=await _webScrappingService.DeleteWebScrapperById(id);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
           
        }

    }
}
