using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsLetterSubscriptionsController : ControllerBase
    { private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public NewsLetterSubscriptionsController(ApplicationDbContext context,EmailService emailService)
        {
            _context = context;
            _emailService=emailService;
        }

        // GET: api/NewsLetterSubscriptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsLetterSubscription>>> GetNewsLetterSubscriptions()
        {
            return await _context.NewsLetterSubscriptions.ToListAsync();
        }

        // GET: api/NewsLetterSubscriptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsLetterSubscription>> GetNewsLetterSubscription(int id)
        {
            var newsLetterSubscription = await _context.NewsLetterSubscriptions.FindAsync(id);

            if (newsLetterSubscription == null)
            {
                return NotFound();
            }

            return newsLetterSubscription;
        }

        // PUT: api/NewsLetterSubscriptions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNewsLetterSubscription(int id, NewsLetterSubscription newsLetterSubscription)
        {
            if (id != newsLetterSubscription.Id)
            {
                return BadRequest();
            }

            _context.Entry(newsLetterSubscription).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NewsLetterSubscriptionExists(id))
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

        // POST: api/NewsLetterSubscriptions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NewsLetterSubscription>> PostNewsLetterSubscription(NewsLetterSubscription newsLetterSubscription)
        {
            _context.NewsLetterSubscriptions.Add(newsLetterSubscription);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNewsLetterSubscription", new { id = newsLetterSubscription.Id }, newsLetterSubscription);
        }
[HttpPost("send/{id}")]
public async Task<IActionResult> SendNewsletter(int id)
{
    var newsletter = await _context.NewsLetterSubscriptions.FindAsync(id);
    if (newsletter == null)
    {
        return NotFound("Newsletter not found");
    }

    var users = await _context.Users.ToListAsync();

    foreach (var user in users)
    {
        await SendNewsletterToUser(newsletter, user.Email);
    }

    newsletter.SentAt = DateTime.UtcNow;
    await _context.SaveChangesAsync();

    return Ok("Newsletter sent successfully");
}

private async Task SendNewsletterToUser(NewsLetterSubscription newsletter, string userEmail)
{
    var subject = newsletter.Title;
    var body = $"<h1>{newsletter.Title}</h1>{newsletter.Content}";
    if (!string.IsNullOrEmpty(newsletter.Offers))
    {
        body += $"<h2>Special Offers</h2><p>{newsletter.Offers}</p>";
    }
    if (newsletter.ImageUrls != null && newsletter.ImageUrls.Any())
    {
        foreach (var imageUrl in newsletter.ImageUrls)
        {
            body += $"<img src='{imageUrl}' alt='Newsletter Image' style='max-width: 100%;' />";
        }
    }

    _emailService.SendEmail(userEmail, subject, body);
}
private string BuildNewsletterBody(NewsLetterSubscription newsletter)
{
    var body = $"<h1>{newsletter.Title}</h1>";
    body += $"<p>{newsletter.Content}</p>";
    
    if (!string.IsNullOrEmpty(newsletter.Offers))
    {
        body += $"<h2>Special Offers</h2><p>{newsletter.Offers}</p>";
    }

    if (newsletter.ImageUrls != null && newsletter.ImageUrls.Any())
    {
        foreach (var imageUrl in newsletter.ImageUrls)
        {
            body += $"<img src='{imageUrl}' alt='Newsletter Image' style='max-width: 100%;' />";
        }
    }

    return body;
}
        // DELETE: api/NewsLetterSubscriptions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNewsLetterSubscription(int id)
        {
            var newsLetterSubscription = await _context.NewsLetterSubscriptions.FindAsync(id);
            if (newsLetterSubscription == null)
            {
                return NotFound();
            }

            _context.NewsLetterSubscriptions.Remove(newsLetterSubscription);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NewsLetterSubscriptionExists(int id)
        {
            return _context.NewsLetterSubscriptions.Any(e => e.Id == id);
        }
    }
}
