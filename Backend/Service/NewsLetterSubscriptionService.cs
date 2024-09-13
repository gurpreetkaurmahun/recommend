using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;


namespace  SoftwareProject.Service{

    public class NewsLetterSubscriptionService{
        private readonly UserManager<IdentityUser> _userManager;
        private readonly EmailService _emailService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AccountService> _logger;
        public NewsLetterSubscriptionService(UserManager<IdentityUser> userManager,EmailService emailService,ApplicationDbContext context,ILogger<AccountService> logger)
        {
            _userManager=userManager;
            _emailService=emailService;
            _context=context;
            _logger= logger;
        }




        public async Task<(List<NewsLetterSubscription> newsLetterSubscriptions, string message)> GetAllNewsLetters()
        {
            try
            {
                var newsLetters=await _context.NewsLetterSubscriptions.ToListAsync();
                _logger.LogInformationWithMethod("Sucessfully retreived NewsLetters");
                return (newsLetters,"Sucessfully retreived NewsLetters");

            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retrieve NewsLetters:{ex.Message}");
                return (null,$"Failed to retreive NewsLetters");

            }
        }

        public async Task<(NewsLetterSubscription newsLetterSubscription, string message)> GetNewsLetterById(int id)
        {
            try
            {
                var newsLetterSubscription = await _context.NewsLetterSubscriptions.FindAsync(id);

                if (newsLetterSubscription == null)
                {
                    return (null,$" NewsLetter with id {id} doesnot exists.");
                }

                return (newsLetterSubscription,$"Successfully retrieved NewsLetter with id {id}");
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed to retrieve NewsLetter with id {id}:{ex.Message}");
                return (null,$"Failed to retrieve NewsLetter with id {id}");
            }
        }

         public async Task<(NewsLetterSubscription newsLetterSubscription, string message)> addNewsletter(NewsLetterSubscription newsLetterSubscription)
        {
            try
            {
                var existingNewsletter = await _context.NewsLetterSubscriptions.FindAsync(newsLetterSubscription.Id );

                if (existingNewsletter!=null){
                _logger.LogErrorWithMethod($"Invalid request: NewsLetterSubscription with id:{newsLetterSubscription.Id } already exists in the system");
                 return (null,$"Invalid request: NewsLetterSubscription with id:{newsLetterSubscription} already exists in the system");
                }

                _logger.LogInformationWithMethod($"Adding new NewsLetterSubscription with id:{newsLetterSubscription.Id } to the system");
                _context.NewsLetterSubscriptions.Add(newsLetterSubscription);
                await _context.SaveChangesAsync();

                return  (newsLetterSubscription,$" NewsLetterSubscription with id:{newsLetterSubscription.Id } added to the system");

            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed to retrieve NewsLetter with id {newsLetterSubscription.Id }:{ex.Message}");
                return (null,$"Failed to add NewsLetter with id {newsLetterSubscription.Id }");
            }
        }

         public async Task<(bool result, string message)> updateNewsletter(int id,NewsLetterSubscription newsLetterSubscription)
        {
            try
            {
                if (id != newsLetterSubscription.Id)
                {
                    return (false,$"NewsLetter with id:{id} not found for update.");
                }

                _context.Entry(newsLetterSubscription).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return (true, $"Changes made to  NewsLetterSubscription with Id {id}" );
            }
            catch (DbUpdateConcurrencyException ex)
            {
               if (!NewsLetterSubscriptionExists(id))
                {
                    _logger.LogErrorWithMethod($"NewsLetterSubscription does not exist in the database. Error message: {ex.Message}");
                    return (false,$"NewsLetterSubscriptionExist does not exist in the database. Error message: {ex.Message}");
                }

                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (false, "Update request failed due to some internal error. Try again.");
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed to retrieve NewsLetter with id {newsLetterSubscription.Id }:{ex.Message}");
                return (false,$"Failed to add NewsLetter with id {newsLetterSubscription.Id }");
            }
        }

        public async Task<(bool result, string message)> deleteNewsletter(int id)
        {
            try
            {
            
                _logger.LogInformationWithMethod($"Checking for NewsLetterSubscription with id:{id}");
                var newsLetterSubscription = await _context.NewsLetterSubscriptions.FindAsync(id);
                if (newsLetterSubscription == null)
                {
                    _logger.LogErrorWithMethod($"Error: NewsLetterSubscription with id: {id} not found, Please check the id");
                        return (false,$"Error: NewsLetterSubscription with id: {id} not found, Please check the id");
                }

                _logger.LogInformationWithMethod($"Removing NewsLetterSubscription with id:{id} from the system");
                _context.NewsLetterSubscriptions.Remove(newsLetterSubscription);
                await _context.SaveChangesAsync();

                return (true,$" NewsLetterSubscriptionwith id:{id} sucessfully deleted");

            }
             catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Delete request failed due to some internal server error: {ex.Message}");
                return (false,"Delete request failed due to some internal server error");
            }
        }

        private bool NewsLetterSubscriptionExists(int id)
        {
            return _context.NewsLetterSubscriptions.Any(e => e.Id == id);
        }

        public async Task<(bool result,string message)> SendNewsletter(int id,  string email)
        {
            try
            {
                var newsletter = await _context.NewsLetterSubscriptions.FindAsync(id);
                if (newsletter == null)
                {
                    return (false,$"Newsletter with id:{id} doesnot exists");
                }

                // Find the user by email
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return (false,$"User with provided email not found");
                }

                var consumer = await _context.Consumers
                    .Include(c => c.IdentityUser)
                    .Include(c => c.Newsletters)
                    .FirstOrDefaultAsync(c => c.IdentityUserId == user.Id);

                if (consumer == null)
                {
                    return (false,$"Consumer not found for the provided email");
                }

                var htmlContent = await GenerateNewsletterHtml(id);

                await SendNewsletterToUser(newsletter.Title, htmlContent, email);

                if (consumer.Newsletters == null)
                {
                    consumer.Newsletters = new List<NewsLetterSubscription>();
                }
                
                consumer.Newsletters.Add(newsletter);
                consumer.isSubscribed = true;
                _context.Consumers.Update(consumer);

                newsletter.SentAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return (true,$"Newsletter sent successfully to {email} and added to their subscriptions");
            }
            catch (Exception ex)
            {
                
                return (false,$"An error occurred while sending the newsletter");
            }
        }

        private async Task SendNewsletterToUser(string subject, string htmlBody, string userEmail)
        {
            _emailService.SendEmail(userEmail, subject, htmlBody, true);
        }

            
        private async Task<string> GenerateNewsletterHtml(int newsletterId)
        {
            var newsletter = await _context.NewsLetterSubscriptions.FindAsync(newsletterId);
            if (newsletter == null)
            {
                throw new ArgumentException("Newsletter not found", nameof(newsletterId));
            }

            var imageHtml = "";
            if (newsletter.ImageUrls != null && newsletter.ImageUrls.Any())
            {
                imageHtml = string.Join("", newsletter.ImageUrls.Select(url => 
                    $"<img src='{url}' alt='Newsletter Image' style='max-width: 100%; height: auto; margin-bottom: 20px;' />"));
            }

            var unsubscribeUrl = "https://yourwebsite.com/unsubscribe"; // Replace with your actual unsubscribe URL

            return string.Format(@"
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>{0}</title>
                </head>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    {1}
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                        <header style='background-color: #f4f4f4; padding: 10px; text-align: center;'>
                            <h1 style='color: #444;'>{0}</h1>
                        </header>
                        <main style='padding: 20px;'>
                            <div style='margin-bottom: 20px;'>
                                {2}
                            </div>
                            <div style='background-color: #ffe6e6; padding: 10px; border-radius: 5px;'>
                                <h2 style='color: #cc0000;'>Special Offers</h2>
                                <p>{3}</p>
                            </div>
                        </main>
                        <footer style='text-align: center; margin-top: 20px; font-size: 0.8em; color: #666;'>
                            <p>You're receiving this email because you subscribed to our newsletter.</p>
                            <p>To unsubscribe, <a href='{4}' style='color: #0066cc;'>click here</a>.</p>
                        </footer>
                    </div>
                </body>
                </html>",
                newsletter.Title,
                imageHtml,
                newsletter.Content,
                newsletter.Offers,
                unsubscribeUrl
            );
        }

    }
    
}