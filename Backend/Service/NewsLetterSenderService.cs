
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;


namespace  SoftwareProject.Service{

    public class NewsLetterSenderService:IHostedService,IDisposable
    {

        private readonly ILogger<NewsLetterSenderService> _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private Timer _timer;

        public NewsLetterSenderService(ILogger<NewsLetterSenderService> logger,IServiceScopeFactory serviceScopeFactory)
        {
            _logger=logger;
             _serviceScopeFactory = serviceScopeFactory;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformationWithMethod("NewsLetter sender service is starting. First run will be in 2 minutes.");

            _timer=new Timer(StartTask,null,TimeSpan.FromMinutes(2),TimeSpan.FromMinutes(2));

            return Task.CompletedTask;

        }

        private void StartTask(object state)
        {
            _logger.LogInformationWithMethod("Starting  NewsLetter sender service");
            SendNewsLetterAsync().Wait();
        }

        private async Task SendNewsLetterAsync()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var newsLetterService = scope.ServiceProvider.GetRequiredService<NewsLetterSubscriptionService>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

                var subscribedConsumers = await _context.Consumers.Where(c => c.isSubscribed).ToListAsync();

                foreach (var consumer in subscribedConsumers)
                {
                    try
                    {
                        var user = await userManager.FindByIdAsync(consumer.IdentityUserId);
                        if (user == null)
                        {
                            _logger.LogWarning($"No IdentityUser found for consumer with ID {consumer.ConsumerId}");
                            continue;
                        }

                        string email = user.Email;

                        if (string.IsNullOrEmpty(email))
                        {
                            _logger.LogErrorWithMethod($"No email found for IdentityUser with ID {consumer.IdentityUserId}");
                            continue;
                        }

                        int newsLetterId = await GetLatestNewsletterIdAsync(_context);

                        var result = await newsLetterService.SendNewsletter(newsLetterId, email);

                        if (result.result)
                        {
                            _logger.LogInformation($"Newsletter sent successfully to {email}");
                        }
                        else
                        {
                            _logger.LogWarning($"Failed to send newsletter to {email}: {result.message}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error sending newsletter:");
                    }
                }
            }
        }
        private async Task<int> GetLatestNewsletterIdAsync(ApplicationDbContext  context)
        {
            var latestNewsletter = await context.NewsLetterSubscriptions
                .OrderByDescending(n => n.CreatedAt)
                .FirstOrDefaultAsync();

            return latestNewsletter?.Id ?? 0;
        }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Newsletter Sender Service is stopping.");

        _timer?.Change(Timeout.Infinite, 0);

        return Task.CompletedTask;
    }

    public void Dispose()
    {
         _logger.LogInformation("Disposing Timer");
        _timer?.Dispose();
    }


    }
}