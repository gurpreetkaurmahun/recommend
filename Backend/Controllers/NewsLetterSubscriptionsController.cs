
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Service;


namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsLetterSubscriptionsController : ControllerBase
    { private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly NewsLetterSubscriptionService _newsLetterSubscriptionService;

        public NewsLetterSubscriptionsController(ApplicationDbContext context,EmailService emailService, UserManager<IdentityUser> userManager,NewsLetterSubscriptionService newsLetterSubscriptionService)
        {
            _context = context;
            _emailService=emailService;
            _userManager=userManager;
            _newsLetterSubscriptionService=newsLetterSubscriptionService;
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
       
        public async Task<IActionResult> SendNewsletter(int id, [FromBody] string email){

            var(result,message)= await _newsLetterSubscriptionService.SendNewsletter(id,email);
            if (result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
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
