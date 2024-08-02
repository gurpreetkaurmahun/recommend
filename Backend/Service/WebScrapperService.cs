using SoftwareProject.Models;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;

namespace  SoftwareProject.Service{

    public class WebScrapperService{


        private readonly ILogger<WebScrapperService> _logger;
        private readonly ApplicationDbContext _context;

        public WebScrapperService(ILogger<WebScrapperService> logger,ApplicationDbContext context){

            _logger=logger;
            _context=context;
        }

        public async Task<(List<WebScrapper> webScrappers, string message)> GetAllWebScrappers(){

            try{

                var allScrappers=await _context.WebScrappers.ToListAsync();
                _logger.LogInformationWithMethod("Sucessfully retreived Web Scrappers");

                return (allScrappers,"Sucessfully retreived Web Scrappers");


            }
             catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retrieve Web Scrappers:{ex.Message}");

                return (null,$"Failed to retreive Web Scrappers");

            }
            
        }

         public async Task<(WebScrapper webScrapper, string message)> GetWebScrapperById(int id){

            try{
                 _logger.LogInformationWithMethod($"Retreiving Details of WebScrapper  with id: {id}");
                var webScrapper=await _context.WebScrappers.FindAsync(id);

                if(webScrapper==null){

                     _logger.LogErrorWithMethod($"Failed to retrieve WebScrapper with id {id})");
                    return (null,$"Failed to retrieve WebScrapper with id {id})");

                }
                _logger.LogInformationWithMethod($"Sucessfully retreived Web Scrapper with id:{id}");

                return (webScrapper,$"Sucessfully retreived Web Scrapper with id:{id}");


            }
             catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retrieve Web Scrappers:{ex.Message}");

                return (null,$"Failed to retreive Web Scrapper:");

            }
            
        }
            public async Task<(bool result,string message)> UpdateWebScrapper(int id,WebScrapper webScrapper){
                 

            try
            {

            if (id != webScrapper.Id)
            {
                _logger.LogErrorWithMethod($"Invalid request as provided id does not match with WebScrapper id");
                    return (false,"Invalid request as provided id does not match with WebScrapper id");
            }

             _logger.LogInformationWithMethod($"Saving Details of the Web Scrapper:===>");
            _context.Entry(webScrapper).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return (true, $"Changes made to Web Scrapper with Id:{webScrapper.Id}" );
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!WebScrapperExists(id))
                {
                    _logger.LogErrorWithMethod($"WebScrapper does not exist in the database. Error message: {ex.Message}");
                    return (false,$"WebScrapper does not exist in the database. Error message: {ex.Message}");
                }
                _logger.LogErrorWithMethod($"WebScrapper does not exist in the database. Error message: {ex.Message}");
                    return (false,$"WebScrapper does not exist in the database. Error message: {ex.Message}");
            }
             catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (false,"Update request failed due to some internal error. Try again.");
            }

            
             

            }

            public async Task<(WebScrapper webScrapper,string message)> AddNewScrapper(WebScrapper webScrapper){

                try{

                     var existingScrapper = await _context.WebScrappers.FindAsync(webScrapper.Id);

                if (existingScrapper!=null){
                _logger.LogErrorWithMethod($"Invalid request: WebScrapper with id:{webScrapper.Id} already exists in the system");
                 return (null,$"Invalid request: WebScrapper with id:{webScrapper.Id} already exists in the system");
                }

                _logger.LogInformationWithMethod($"Adding new WebScrapper with id:{webScrapper.Id} to the system");
                _context.WebScrappers.Add(webScrapper);
                await _context.SaveChangesAsync();

                _logger.LogInformationWithMethod($" WebScrapper with id:{webScrapper.Id} added to the system");

                return (webScrapper,$" Customer with id:{webScrapper.Id} added to the system");

                }
                 catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to add Web Scrapper with name {webScrapper.Name}, Error:{ex.Message}");

                return (null,$"Failed to add Web Scrapper with name {webScrapper.Name}, Error:{ex.Message}");

            }
                
            }

              public async Task<(bool result,string message)> DeleteWebScrapperById(int id){

                try{
                 
                _logger.LogInformationWithMethod($"Checking for WebScrapper with id:{id}");
                var webScrapper = await _context.WebScrappers.FindAsync(id);
                if (webScrapper == null)
                {

                    _logger.LogErrorWithMethod($"Error: WebScrapper with id: {id} not found, Please check the id");
                    return (false,$"Error: WebScrapper with id: {id} not found, Please check the id");
                }

                _logger.LogInformationWithMethod($"Removing WebScrapper with id:{id} from the system");
                _context. WebScrappers.Remove(webScrapper);
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($"  WebScrapper with id:{id} sucessfully deleted");
                return (true,$"  WebScrapper with id:{id} sucessfully deleted");
            }
            catch(Exception ex){
                  _logger.LogErrorWithMethod($"Delete request failed due to some internal server error: {ex.Message}");
                  return (false,"Delete request failed due to some internal server error");

            }

        }

        
        private bool WebScrapperExists(int id)
        {
            return _context.WebScrappers.Any(e => e.Id == id);
        }





    }}